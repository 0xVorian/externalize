import { afterEach, describe, expect, it } from 'vitest';
import { evidenceKey } from './curriculum';
import { ALL_LEARN_LESSONS, LEVEL_0_LESSONS, LEVEL_1_LESSONS } from './lessons';
import { PREREQUISITE_BRIDGES } from './planner';
import { recordAttemptCheck } from './practice-attempt';
import {
  applyWarmupMiss,
  applyWarmupMissAfterCheck,
  composeSessionPlan,
  offerOpening,
  SESSION_MAX,
  startSession,
} from './session-plan';
import {
  clearActiveSession,
  loadActiveSession,
  saveActiveSession,
} from './session-persistence';
import {
  mostRecentPractisedConcept,
  repairItemIds,
  selectWarmup,
} from './session-warmup';
import { isPracticeItem } from './session-units';
import {
  beginPracticeAttempt,
  completeLesson,
  loadProgress,
  recordCheckedPracticeState,
  type ProgressStore,
} from './storage';

function withLevel0Complete(store: ProgressStore): ProgressStore {
  let next = store;
  for (const lesson of LEVEL_0_LESSONS) {
    next = completeLesson(next, lesson.id);
  }
  return next;
}

function withConjunctionPractice(store: ProgressStore, at = '2026-09-07T12:00:00.000Z'): ProgressStore {
  const next = withLevel0Complete(store);
  return {
    ...next,
    passed: ['eval-001'],
    attempted: ['eval-001'],
    conceptEvidence: {
      [evidenceKey('conjunction', 'apply')]: {
        attempts: 1,
        cleanPasses: 1,
        transferPasses: 0,
        recentErrors: [],
        lastSeenAt: at,
      },
    },
    queue: [
      { exerciseId: 'eval-001', due: '2026-09-10T12:00:00.000Z', intervalDays: 1, ease: 2.5 },
    ],
  };
}

describe('warm-up selection', () => {
  it('selects no warm-up for a fresh learner', () => {
    const store = loadProgress();
    expect(mostRecentPractisedConcept(store)).toBeUndefined();
    expect(selectWarmup(store)).toBeUndefined();
    const offer = offerOpening(store, null);
    expect(offer.plan?.steps.some((step) => step.role === 'warmup')).toBe(false);
    expect(offer.plan?.warmupConceptId).toBeUndefined();
  });

  it('selects the most recently practised concept that has an exercise, not the last lesson viewed', () => {
    let store = withConjunctionPractice(loadProgress());
    store = completeLesson(store, LEVEL_1_LESSONS[0]!.id);
    expect(mostRecentPractisedConcept(store)).toBe('conjunction');
    expect(selectWarmup(store)?.exerciseId).toBe('eval-001');
  });

  it('uses a due review of that concept as the warm-up and keeps other due items', () => {
    const now = Date.parse('2026-09-07T12:00:00.000Z');
    let store = withConjunctionPractice(loadProgress(), '2026-09-07T11:00:00.000Z');
    for (const lesson of LEVEL_1_LESSONS) {
      store = completeLesson(store, lesson.id);
    }
    store.passed = ['eval-001', 'eval-011', 'eval-010'];
    store.queue = [
      { exerciseId: 'eval-001', due: '2026-09-07T11:00:00.000Z', intervalDays: 1, ease: 2.5 },
      { exerciseId: 'eval-011', due: '2026-09-07T11:30:00.000Z', intervalDays: 1, ease: 2.5 },
      { exerciseId: 'eval-010', due: '2026-09-07T11:45:00.000Z', intervalDays: 1, ease: 2.5 },
    ];
    const offer = offerOpening(store, null, now);
    expect(offer.kind).toBe('quick-review');
    expect(offer.plan?.steps[0]).toMatchObject({
      itemId: 'eval-001',
      role: 'warmup',
      conceptId: 'conjunction',
    });
    expect(offer.plan?.steps.map((step) => step.itemId)).toEqual([
      'eval-001',
      'eval-011',
      'eval-010',
    ]);
    expect(offer.plan?.steps.filter((step) => step.role === 'warmup')).toHaveLength(1);
  });

  it('keeps different skills on the same concept in the body', () => {
    const now = Date.parse('2026-09-07T12:00:00.000Z');
    let store = withConjunctionPractice(loadProgress(), '2026-09-07T11:00:00.000Z');
    for (const lesson of LEVEL_1_LESSONS) {
      store = completeLesson(store, lesson.id);
    }
    store.passed = ['eval-001', 'eval-011', 'tt-001', 'counter-001'];
    store.queue = [
      { exerciseId: 'eval-001', due: '2026-09-07T11:00:00.000Z', intervalDays: 1, ease: 2.5 },
      { exerciseId: 'eval-011', due: '2026-09-07T11:10:00.000Z', intervalDays: 1, ease: 2.5 },
      { exerciseId: 'tt-001', due: '2026-09-07T11:20:00.000Z', intervalDays: 1, ease: 2.5 },
      { exerciseId: 'counter-001', due: '2026-09-07T11:30:00.000Z', intervalDays: 1, ease: 2.5 },
    ];
    const offer = offerOpening(store, null, now);
    expect(offer.kind).toBe('quick-review');
    expect(offer.plan?.steps[0]).toMatchObject({ itemId: 'eval-001', role: 'warmup' });
    const itemIds = offer.plan?.steps.map((step) => step.itemId) ?? [];
    expect(itemIds).toContain('eval-011');
    expect(itemIds).toContain('tt-001');
    expect(itemIds).toContain('counter-001');
    expect(itemIds.filter((id) => id === 'eval-001')).toHaveLength(1);
  });

  it('keeps a single warm-up after a long gap instead of a second check', () => {
    const now = Date.parse('2026-09-07T12:00:00.000Z');
    const store = withConjunctionPractice(loadProgress(), '2025-01-01T00:00:00.000Z');
    const offer = offerOpening(store, null, now);
    const warmup = offer.plan?.steps.filter((step) => step.role === 'warmup');
    expect(warmup).toHaveLength(1);
    expect(warmup?.[0]?.itemId).toBe('eval-001');
  });

  it('falls back to an earlier practised concept when the latest has no presentable exercise', () => {
    const now = Date.parse('2026-09-07T14:00:00.000Z');
    const store = withConjunctionPractice(loadProgress(), '2026-09-07T12:00:00.000Z');
    store.conceptEvidence[evidenceKey('conditional', 'apply')] = {
      attempts: 1,
      cleanPasses: 1,
      transferPasses: 0,
      recentErrors: [],
      lastSeenAt: '2026-09-07T13:00:00.000Z',
    };
    expect(mostRecentPractisedConcept(store)).toBe('conditional');
    expect(selectWarmup(store, now)?.conceptId).toBe('conjunction');
    expect(selectWarmup(store, now)?.exerciseId).toBe('eval-001');
  });

  it('uses a planned retrieve of that concept as the warm-up instead of another exercise', () => {
    const now = Date.parse('2026-09-07T12:00:00.000Z');
    const store = withConjunctionPractice(loadProgress(), '2026-09-06T12:00:00.000Z');
    store.conceptEvidence[evidenceKey('conditional', 'apply')] = {
      attempts: 4,
      cleanPasses: 4,
      transferPasses: 0,
      recentErrors: [],
      lastSeenAt: '2026-09-07T11:00:00.000Z',
    };
    const selection = selectWarmup(store, now, ['lat-retrieve-conditional', 'eval-001']);
    expect(selection).toEqual({
      conceptId: 'conditional',
      exerciseId: 'lat-retrieve-conditional',
    });
  });
});

describe('warm-up pass and miss paths', () => {
  it('continues into planned material after a warm-up pass', () => {
    const store = withConjunctionPractice(loadProgress());
    const offer = offerOpening(store, null, Date.parse('2026-09-07T12:00:00.000Z'));
    expect(offer.kind).toBe('continue');
    expect(offer.plan?.steps[0]?.role).toBe('warmup');
    expect(offer.plan?.steps[0]?.itemId).toBe('eval-001');
    expect(offer.plan?.steps.map((step) => step.itemId).slice(1)).toEqual([
      'level1-01-neg',
      'level1-02-neg-watch',
      'level1-02-neg-watch',
      'level1-03-neg-guided',
    ]);
    expect(offer.plan?.steps.some((step) => step.role === 'repair')).toBe(false);
    expect(offer.plan?.steps.length).toBeLessThanOrEqual(SESSION_MAX);
  });

  it('turns the remaining round into explanation plus practice after a warm-up miss', () => {
    const store = withConjunctionPractice(loadProgress());
    const plan = offerOpening(store, null, Date.parse('2026-09-07T12:00:00.000Z')).plan!;
    const originalTotal = plan.steps.length;
    expect(plan.repairSteps?.some((step) => step.itemId === 'level0-03-and')).toBe(true);
    expect(plan.repairSteps?.some((step) => isPracticeItem(step.itemId))).toBe(true);
    let session = startSession(plan, '2026-09-07T12:00:00.000Z');
    session = applyWarmupMiss(session);
    expect(session.plan.repairApplied).toBe(true);
    expect(session.plan.steps[0]?.role).toBe('warmup');
    expect(session.plan.steps.slice(1).every((step) => step.role === 'repair')).toBe(true);
    expect(session.plan.steps.slice(1).map((step) => step.itemId)).toContain('level0-03-and');
    expect(session.plan.steps.some((step) => step.itemId.startsWith('level1-'))).toBe(false);
    expect(session.plan.steps.length).toBeLessThanOrEqual(originalTotal);
    expect(session.plan.steps.length).toBeLessThanOrEqual(SESSION_MAX);
    expect(session.plan.steps.length).toBeGreaterThan(1);
  });

  it('does not apply repair twice or on a non-warm-up step', () => {
    const store = withConjunctionPractice(loadProgress());
    let session = startSession(
      offerOpening(store, null, Date.parse('2026-09-07T12:00:00.000Z')).plan!,
      '2026-09-07T12:00:00.000Z',
    );
    session = { ...session, currentIndex: 1 };
    expect(applyWarmupMiss(session).plan.repairApplied).toBeUndefined();
  });

  it('does not rewrite the round on a graded cell or node before Check', () => {
    const store = withConjunctionPractice(loadProgress());
    const session = startSession(
      offerOpening(store, null, Date.parse('2026-09-07T12:00:00.000Z')).plan!,
      '2026-09-07T12:00:00.000Z',
    );
    const frozen = session.plan.steps.map((step) => step.id);
    const afterCell = applyWarmupMissAfterCheck(session, {
      isFinalCheck: false,
      firstCheckedCorrect: false,
    });
    expect(afterCell).toBe(session);
    expect(afterCell.plan.steps.map((step) => step.id)).toEqual(frozen);
    expect(afterCell.plan.repairApplied).toBeUndefined();
    const afterCheck = applyWarmupMissAfterCheck(session, {
      isFinalCheck: true,
      firstCheckedCorrect: false,
    });
    expect(afterCheck.plan.repairApplied).toBe(true);
  });
});

describe('warm-up SRS writes', () => {
  it('writes queue and concept evidence on a warm-up pass', () => {
    const now = Date.parse('2026-09-07T12:00:00.000Z');
    const store = withConjunctionPractice(loadProgress());
    expect(offerOpening(store, null, now).plan?.steps[0]?.itemId).toBe('eval-001');
    const started = beginPracticeAttempt(store, 'eval-001');
    const draft = started.practiceDraft!;
    const beforeDue = store.queue.find((entry) => entry.exerciseId === 'eval-001')?.due;
    const next = recordCheckedPracticeState(started, {
      ...draft,
      phase: 'answered',
      feedbackTag: 'correct',
      attempt: recordAttemptCheck(draft.attempt, true),
    });
    const entry = next.queue.find((item) => item.exerciseId === 'eval-001');
    expect(entry?.intervalDays).toBeGreaterThan(0);
    expect(entry?.due).not.toBe(beforeDue);
    expect(next.conceptEvidence[evidenceKey('conjunction', 'apply')]?.cleanPasses).toBe(2);
    expect(next.conceptEvidence[evidenceKey('conjunction', 'apply')]?.attempts).toBe(2);
    expect(next.exerciseStats['eval-001']?.successes).toBe(1);
  });

  it('writes a repaired SRS schedule after a warm-up miss that is later corrected', () => {
    const store = withConjunctionPractice(loadProgress());
    const started = beginPracticeAttempt(store, 'eval-001');
    const wrongDraft = started.practiceDraft!;
    const afterWrong = recordCheckedPracticeState(started, {
      ...wrongDraft,
      phase: 'answered',
      feedbackTag: 'incorrect-evaluation',
      attempt: recordAttemptCheck(wrongDraft.attempt, false, 'incorrect-evaluation'),
    });
    expect(afterWrong.queue.find((item) => item.exerciseId === 'eval-001')?.intervalDays).toBe(1);
    expect(afterWrong.exerciseStats['eval-001']).toBeUndefined();
    const draft = afterWrong.practiceDraft!;
    const next = recordCheckedPracticeState(afterWrong, {
      ...draft,
      phase: 'answered',
      feedbackTag: 'correct',
      attempt: recordAttemptCheck(draft.attempt, true),
    });
    expect(next.queue.find((item) => item.exerciseId === 'eval-001')?.intervalDays).toBe(0);
    expect(next.exerciseStats['eval-001']).toMatchObject({
      attempts: 1,
      successes: 0,
      repairedPasses: 1,
    });
    expect(next.conceptEvidence[evidenceKey('conjunction', 'apply')]?.cleanPasses).toBe(1);
    expect(next.conceptEvidence[evidenceKey('conjunction', 'apply')]?.attempts).toBe(2);
  });
});

describe('short warm-up miss envelopes', () => {
  it('does not compose a 1-step due-review round, and a miss never grows the counter', () => {
    const now = Date.parse('2026-09-07T12:00:00.000Z');
    let store = withConjunctionPractice(loadProgress(), '2026-09-07T11:00:00.000Z');
    for (const lesson of ALL_LEARN_LESSONS) {
      store = completeLesson(store, lesson.id);
    }
    store.passed = ['eval-001', 'eval-011'];
    store.queue = [
      { exerciseId: 'eval-001', due: '2026-09-07T11:00:00.000Z', intervalDays: 1, ease: 2.5 },
    ];
    const offer = offerOpening(store, null, now);
    expect(offer.kind).toBe('quick-review');
    expect(offer.plan?.steps[0]?.role).toBe('warmup');
    expect(offer.plan?.steps.length).toBeGreaterThanOrEqual(3);
    const originalTotal = offer.plan!.steps.length;
    const session = applyWarmupMiss(startSession(offer.plan!, '2026-09-07T12:00:00.000Z'));
    expect(session.plan.repairApplied).toBe(true);
    expect(session.plan.steps.length).toBe(originalTotal);
    expect(session.plan.steps.length).toBeLessThanOrEqual(SESSION_MAX);
    expect(session.plan.steps.slice(1).some((step) => isPracticeItem(step.itemId))).toBe(true);
    expect(session.plan.steps.slice(1).some((step) => step.itemId === 'level0-03-and')).toBe(true);
  });

  it('keeps both due conjunction items and still includes practice on a miss', () => {
    const now = Date.parse('2026-09-07T12:00:00.000Z');
    const store = withLevel0Complete(loadProgress());
    store.passed = ['eval-001', 'eval-011'];
    store.queue = [
      { exerciseId: 'eval-001', due: '2026-09-07T11:00:00.000Z', intervalDays: 1, ease: 2.5 },
      { exerciseId: 'eval-011', due: '2026-09-07T11:30:00.000Z', intervalDays: 1, ease: 2.5 },
    ];
    store.conceptEvidence = {
      [evidenceKey('conjunction', 'apply')]: {
        attempts: 1,
        cleanPasses: 1,
        transferPasses: 0,
        recentErrors: [],
        lastSeenAt: '2026-09-07T11:00:00.000Z',
      },
    };
    const offer = offerOpening(store, null, now);
    expect(offer.kind).toBe('quick-review');
    expect(offer.plan?.steps[0]).toMatchObject({ itemId: 'eval-001', role: 'warmup' });
    expect(offer.plan?.steps.map((step) => step.itemId)).toContain('eval-011');
    expect(offer.plan?.steps.length).toBeGreaterThanOrEqual(3);
    const originalTotal = offer.plan!.steps.length;
    const session = applyWarmupMiss(startSession(offer.plan!, '2026-09-07T12:00:00.000Z'));
    expect(session.plan.steps.length).toBe(originalTotal);
    expect(session.plan.steps.slice(1).every((step) => step.role === 'repair')).toBe(true);
    expect(session.plan.steps.slice(1).some((step) => isPracticeItem(step.itemId))).toBe(true);
    expect(session.plan.steps.slice(1).some((step) => step.itemId === 'level0-03-and')).toBe(true);
  });

  it('does not grow advertised m if a 1-step plan is applied anyway', () => {
    const store = withConjunctionPractice(loadProgress());
    const plan = offerOpening(store, null, Date.parse('2026-09-07T12:00:00.000Z')).plan!;
    const oneStep = {
      ...plan,
      steps: plan.steps.slice(0, 1),
    };
    expect(oneStep.steps).toHaveLength(1);
    const session = applyWarmupMiss(startSession(oneStep, '2026-09-07T12:00:00.000Z'));
    expect(session.plan.steps).toHaveLength(1);
    expect(session.plan.repairApplied).toBeUndefined();
  });
});

describe('warm-up repair resume', () => {
  afterEach(() => {
    clearActiveSession();
    // @ts-expect-error test storage
    delete globalThis.localStorage;
  });

  it('resumes the repaired step list after a warm-up miss', () => {
    const storage = memoryStorage();
    globalThis.localStorage = storage;
    const store = withConjunctionPractice(loadProgress());
    const plan = offerOpening(store, null, Date.parse('2026-09-07T12:00:00.000Z')).plan!;
    let session = applyWarmupMiss(startSession(plan, '2026-09-07T12:00:00.000Z'));
    expect(session.plan.repairApplied).toBe(true);
    saveActiveSession(session);
    const loaded = loadActiveSession();
    expect(loaded?.plan.repairApplied).toBe(true);
    expect(loaded?.plan.steps.map((step) => step.id)).toEqual(
      session.plan.steps.map((step) => step.id),
    );
    const offer = offerOpening(store, loaded);
    expect(offer.kind).toBe('resume');
    expect(offer.plan?.repairApplied).toBe(true);
    expect(offer.plan?.steps.slice(1).every((step) => step.role === 'repair')).toBe(true);
    expect(offer.plan?.steps.map((step) => step.id)).toEqual(
      session.plan.steps.map((step) => step.id),
    );
  });
});

describe('warm-up envelope interaction', () => {
  it('counts the warm-up inside the 5–7 envelope without splitting the next cluster', () => {
    const store = withConjunctionPractice(loadProgress());
    const plan = composeSessionPlan(
      store,
      'continue',
      LEVEL_1_LESSONS.map((lesson) => lesson.id),
      { now: Date.parse('2026-09-07T12:00:00.000Z') },
    );
    expect(plan.steps[0]?.role).toBe('warmup');
    expect(plan.steps.length).toBeGreaterThanOrEqual(5);
    expect(plan.steps.length).toBeLessThanOrEqual(SESSION_MAX);
    expect(plan.steps.some((step) => step.itemId === 'level1-04-or')).toBe(false);
    expect(repairItemIds(store, 'conjunction', 'eval-001')).toContain('level0-03-and');
    expect(repairItemIds(store, 'conjunction', 'eval-001')).toContain('level0-05-guided');
  });

  it('builds a 6-step body then prepends the warm-up instead of treating the warm-up as a blocking cluster', () => {
    const store = withConjunctionPractice(loadProgress());
    const remaining = LEVEL_1_LESSONS.slice(3).map((lesson) => lesson.id);
    const plan = composeSessionPlan(store, 'continue', remaining, {
      now: Date.parse('2026-09-07T12:00:00.000Z'),
    });
    expect(plan.steps[0]).toMatchObject({
      itemId: 'eval-001',
      role: 'warmup',
    });
    expect(plan.steps.map((step) => step.itemId)).toEqual([
      'eval-001',
      'level1-04-or',
      'level1-05-or-watch',
      'level1-05-or-watch',
      'level1-05-or-watch',
      'level1-05-or-watch',
      'level1-06-or-guided',
    ]);
    expect(plan.steps).toHaveLength(SESSION_MAX);
  });

  it('keeps a 7-step teach cluster intact rather than blocking it behind a 1-step warm-up', () => {
    const store = withConjunctionPractice(loadProgress());
    const items = PREREQUISITE_BRIDGES['conditional:apply']!.teach;
    expect(items).toHaveLength(7);
    const plan = composeSessionPlan(store, 'continue', items, {
      now: Date.parse('2026-09-07T12:00:00.000Z'),
    });
    expect(plan.steps.map((step) => step.itemId)).toEqual(items);
    expect(plan.steps).toHaveLength(7);
    expect(plan.steps.some((step) => step.role === 'warmup')).toBe(false);
  });
});

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear() {
      data.clear();
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
    key(index) {
      return [...data.keys()][index] ?? null;
    },
  };
}
