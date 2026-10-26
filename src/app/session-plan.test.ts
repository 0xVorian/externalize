import { describe, expect, it } from 'vitest';
import { evidenceKey } from './curriculum';
import {
  ALL_LEARN_LESSONS,
  LEVEL_0_LESSONS,
  LEVEL_1_LESSONS,
  LEVEL_2_LESSONS,
} from './lessons';
import {
  LOGIC_AND_THEISM_READING_ROUTE_ID,
  LOGIC_FOUNDATIONS_ROUTE_ID,
} from './routes';
import {
  completeCurrentStep,
  composeSessionPlan,
  groupSessionSteps,
  offerOpening,
  resumeSession,
  SESSION_MAX,
  SESSION_TARGET,
  sessionClusterKey,
  sessionPosition,
  sessionSegmentMs,
  startSession,
  takeEnvelope,
  takeSessionEnvelope,
} from './session-plan';
import type { SessionStep } from './session-types';
import { expandItemsToUnits, isPracticeItem, isTeachingItem } from './session-units';
import { completeLesson, loadProgress, type ProgressStore } from './storage';
import { plannedSourceItems, setActiveRoute } from './source-route';

function cloneStore(store: ProgressStore): ProgressStore {
  return structuredClone(store);
}

function withLevel0Complete(store: ProgressStore): ProgressStore {
  let next = store;
  for (const lesson of LEVEL_0_LESSONS) {
    next = completeLesson(next, lesson.id);
  }
  return next;
}

function conjunctionLikeCluster(watchCount: number, extras: SessionStep[] = []): SessionStep[] {
  const watches: SessionStep[] = Array.from({ length: watchCount }, (_, index) => ({
    id: `level0-04-watch#${index}`,
    source: 'route',
    itemId: 'level0-04-watch',
    unitIndex: index,
  }));
  return [
    { id: 'level0-03-and', source: 'route', itemId: 'level0-03-and' },
    ...watches,
    { id: 'level0-05-guided', source: 'route', itemId: 'level0-05-guided' },
    ...extras,
  ];
}

describe('session envelope', () => {
  it('keeps 1–7 items and caps longer lists at 6', () => {
    expect(takeEnvelope(['a', 'b', 'c', 'd', 'e'])).toHaveLength(5);
    expect(takeEnvelope(['a', 'b', 'c', 'd', 'e', 'f', 'g'])).toHaveLength(7);
    expect(takeEnvelope(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])).toEqual([
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
    ]);
  });

  it('keeps guided practice with its explanation when an 8-step cluster would cut at 6', () => {
    const cluster = conjunctionLikeCluster(5, [
      { id: 'eval-011', source: 'practice', itemId: 'eval-011' },
    ]);
    expect(cluster.map((step) => step.id)).toEqual([
      'level0-03-and',
      'level0-04-watch#0',
      'level0-04-watch#1',
      'level0-04-watch#2',
      'level0-04-watch#3',
      'level0-04-watch#4',
      'level0-05-guided',
      'eval-011',
    ]);
    const taken = takeSessionEnvelope(cluster);
    expect(taken.map((step) => step.id)).toEqual([
      'level0-03-and',
      'level0-04-watch#0',
      'level0-04-watch#1',
      'level0-04-watch#2',
      'level0-04-watch#3',
      'level0-04-watch#4',
      'level0-05-guided',
    ]);
    expect(taken).toHaveLength(7);
    expect(taken.some((step) => step.itemId === 'level0-05-guided')).toBe(true);
    expect(taken.some((step) => step.itemId === 'eval-011')).toBe(false);
  });

  it('still keeps that guided step when the warm-up body budget would have capped at 6', () => {
    const cluster = conjunctionLikeCluster(5, [
      { id: 'eval-011', source: 'practice', itemId: 'eval-011' },
    ]);
    const taken = takeSessionEnvelope(cluster, { max: SESSION_MAX - 1, target: SESSION_TARGET - 1 });
    expect(taken.map((step) => step.id)).toEqual([
      'level0-03-and',
      'level0-04-watch#0',
      'level0-04-watch#1',
      'level0-04-watch#2',
      'level0-04-watch#3',
      'level0-04-watch#4',
      'level0-05-guided',
    ]);
  });

  it('splits an 8-step cluster between watch cases when guided cannot fit this round', () => {
    const cluster = conjunctionLikeCluster(6);
    expect(cluster.map((step) => step.id)).toEqual([
      'level0-03-and',
      'level0-04-watch#0',
      'level0-04-watch#1',
      'level0-04-watch#2',
      'level0-04-watch#3',
      'level0-04-watch#4',
      'level0-04-watch#5',
      'level0-05-guided',
    ]);
    const taken = takeSessionEnvelope(cluster);
    expect(taken.map((step) => step.id)).toEqual([
      'level0-03-and',
      'level0-04-watch#0',
      'level0-04-watch#1',
      'level0-04-watch#2',
      'level0-04-watch#3',
      'level0-04-watch#4',
    ]);
    const leftover = cluster.slice(taken.length);
    expect(leftover.map((step) => step.id)).toEqual([
      'level0-04-watch#5',
      'level0-05-guided',
    ]);
    expect(isTeachingItem(leftover[0]!.itemId)).toBe(true);
    expect(isPracticeItem(leftover[1]!.itemId)).toBe(true);
    expect(taken.some((step) => step.itemId === 'level0-05-guided')).toBe(false);
  });
});

describe('offerOpening', () => {
  it('offers a start round of honest micro-units for a fresh learner', () => {
    const store = loadProgress();
    const offer = offerOpening(store, null);
    expect(offer.kind).toBe('start');
    expect(offer.plan?.steps.map((step) => step.id)).toEqual([
      'level0-01-letters',
      'level0-02-truth',
    ]);
    expect(offer.plan?.steps).toHaveLength(2);
    expect(offer.plan?.estimatedMinutes).toBe(2);
    expect(offer.plan?.steps.some((step) => step.itemId === 'level0-03-and')).toBe(false);
  });

  it('keeps the conjunction explanation with its watch and guided practice', () => {
    const store = loadProgress();
    const remaining = LEVEL_0_LESSONS.slice(2).map((lesson) => lesson.id);
    const plan = composeSessionPlan(store, 'continue', remaining);
    expect(plan.steps.map((step) => step.id)).toEqual([
      'level0-03-and',
      'level0-04-watch#0',
      'level0-04-watch#1',
      'level0-04-watch#2',
      'level0-04-watch#3',
      'level0-05-guided',
    ]);
    expect(plan.steps).toHaveLength(6);
  });

  it('continues with unseen Unit 1 lessons after Unit 0', () => {
    const store = withLevel0Complete(loadProgress());
    const offer = offerOpening(store, null);
    expect(offer.kind).toBe('continue');
    expect(offer.plan?.steps[0]?.itemId).toBe(LEVEL_1_LESSONS[0]!.id);
    expect(offer.plan?.steps.some((step) => step.itemId === LEVEL_0_LESSONS[0]!.id)).toBe(false);
  });

  it('offers a fixed quick-review of due SRS items only', () => {
    const now = Date.parse('2026-09-07T12:00:00.000Z');
    const store = withLevel0Complete(loadProgress());
    store.passed = ['eval-001', 'eval-011'];
    store.queue = [
      { exerciseId: 'eval-001', due: '2026-09-07T11:00:00.000Z', intervalDays: 1, ease: 2.5 },
      { exerciseId: 'eval-011', due: '2026-09-07T11:30:00.000Z', intervalDays: 1, ease: 2.5 },
      { exerciseId: 'tt-001', due: '2026-09-08T12:00:00.000Z', intervalDays: 1, ease: 2.5 },
    ];
    const offer = offerOpening(store, null, now);
    expect(offer.kind).toBe('quick-review');
    expect(offer.plan?.steps.map((step) => step.itemId)).toEqual(['eval-001', 'eval-011']);
    expect(offer.plan?.steps[0]).toMatchObject({
      itemId: 'eval-001',
      role: 'warmup',
    });
    expect(offer.nextReviewAt).toBe('2026-09-08T12:00:00.000Z');
  });

  it('does not expand a started plan when new work becomes due', () => {
    const store = loadProgress();
    const offer = offerOpening(store, null);
    const session = startSession(offer.plan!, '2026-09-07T12:00:00.000Z');
    const frozen = session.plan.steps.map((step) => step.itemId);
    const later = withLevel0Complete(store);
    later.queue = [
      { exerciseId: 'eval-001', due: '2026-09-07T11:00:00.000Z', intervalDays: 1, ease: 2.5 },
    ];
    expect(session.plan.steps.map((step) => step.itemId)).toEqual(frozen);
    expect(offerOpening(later, session).kind).toBe('resume');
    expect(offerOpening(later, session).plan?.steps.map((step) => step.itemId)).toEqual(frozen);
  });

  it('resumes an interrupted active session with the same steps', () => {
    const store = loadProgress();
    const plan = offerOpening(store, null).plan!;
    let session = startSession(plan, '2026-09-07T12:00:00.000Z');
    session = completeCurrentStep(session);
    const offer = offerOpening(store, session);
    expect(offer.kind).toBe('resume');
    expect(offer.resumeIndex).toBe(1);
    expect(offer.plan?.steps.map((step) => step.itemId)).toEqual(plan.steps.map((step) => step.itemId));
  });

  it('walks position 1/n through completion without mutating mastery fields', () => {
    const store = loadProgress();
    const before = cloneStore(store);
    let session = startSession(offerOpening(store, null).plan!, '2026-09-07T12:00:00.000Z');
    const total = session.plan.steps.length;
    expect(sessionPosition(session)).toEqual({ current: 1, total });
    for (let i = 0; i < total; i += 1) {
      session = completeCurrentStep(session);
    }
    expect(session.status).toBe('completed');
    expect(store.conceptEvidence).toEqual(before.conceptEvidence);
    expect(store.queue).toEqual(before.queue);
    expect(store.passed).toEqual(before.passed);
  });

  it('starts a Sobel preparation round with injected items first', () => {
    const store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    const offer = offerOpening(store, null);
    expect(offer.kind).toBe('start');
    expect(offer.plan?.preparation).toBe(true);
    expect(offer.plan?.steps[0]?.itemId).toBe(plannedSourceItems(store)[0]);
    expect(offer.plan?.steps.map((step) => step.itemId)).toEqual([
      'lat-conditional-bridge',
      'lat-predict-empty-club',
      'lat-empty-no-counterexample',
      'lat-name-vacuity',
      'lat-conditional-meaning',
      'lat-conditional-notation',
      'lat-retrieve-conditional',
    ]);
    expect(offer.plan?.steps).toHaveLength(7);
  });

  it('skips the conditional bridge when evidence is already strong', () => {
    let store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    store = {
      ...store,
      conceptEvidence: {
        [evidenceKey('conditional', 'apply')]: {
          attempts: 4,
          cleanPasses: 4,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: new Date().toISOString(),
        },
      },
    };
    const offer = offerOpening(store, null);
    expect(offer.plan?.steps.some((step) => step.itemId === 'lat-conditional-bridge')).toBe(false);
    expect(offer.plan?.steps.map((step) => step.itemId)).toEqual([
      'lat-universal-meaning',
      'lat-quantifier-universal',
      'lat-check-universal',
    ]);
    expect(offer.plan?.steps.some((step) => step.itemId === 'lat-existential-meaning')).toBe(false);
  });

  it('idles when the learn path is done and nothing is due', () => {
    let store = loadProgress();
    for (const lesson of ALL_LEARN_LESSONS) {
      store = completeLesson(store, lesson.id);
    }
    store = {
      ...store,
      passed: ['eval-001', 'eval-011', 'tt-001', 'counter-001'],
      queue: [
        {
          exerciseId: 'eval-001',
          due: '2026-09-10T12:00:00.000Z',
          intervalDays: 3,
          ease: 2.5,
        },
      ],
    };
    const offer = offerOpening(store, null, Date.parse('2026-09-07T12:00:00.000Z'));
    expect(offer.kind).toBe('idle');
    expect(offer.plan).toBeNull();
    expect(offer.nextReviewAt).toBe('2026-09-10T12:00:00.000Z');
  });

  it('offers lapse recovery before remaining route content', () => {
    let store = withLevel0Complete(loadProgress());
    store = completeLesson(store, LEVEL_1_LESSONS[0]!.id);
    store = {
      ...store,
      passed: ['eval-001', 'eval-011'],
      queue: [],
      conceptEvidence: {
        [evidenceKey('conditional', 'apply')]: {
          attempts: 4,
          cleanPasses: 4,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: '2025-01-01T00:00:00.000Z',
        },
      },
    };
    const offer = offerOpening(store, null, Date.parse('2026-09-07T12:00:00.000Z'));
    expect(offer.kind).toBe('lapse-recovery');
    expect(offer.plan?.steps.some((step) => step.itemId === 'lat-retrieve-conditional')).toBe(true);
  });

  it('does not classify a fresh learner as lapse recovery', () => {
    const store = loadProgress();
    expect(offerOpening(store, null).kind).toBe('start');
  });

  it('continues a strong fresh-evidence learner into remaining material', () => {
    const store = withLevel0Complete(loadProgress());
    store.conceptEvidence = {
      [evidenceKey('conditional', 'apply')]: {
        attempts: 4,
        cleanPasses: 4,
        transferPasses: 0,
        recentErrors: [],
        lastSeenAt: '2026-09-07T11:00:00.000Z',
      },
    };
    const offer = offerOpening(store, null, Date.parse('2026-09-07T12:00:00.000Z'));
    expect(offer.kind).toBe('continue');
    expect(offer.plan?.steps[0]?.itemId).toBe(LEVEL_1_LESSONS[0]!.id);
  });

  it('lets Sobel preparation retrieve a stale prerequisite without a duplicate lapse round', () => {
    let store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    store = {
      ...store,
      conceptEvidence: {
        [evidenceKey('conditional', 'apply')]: {
          attempts: 4,
          cleanPasses: 4,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: '2025-01-01T00:00:00.000Z',
        },
      },
    };
    const offer = offerOpening(store, null, Date.parse('2026-09-07T12:00:00.000Z'));
    expect(offer.kind).toBe('start');
    expect(offer.plan?.preparation).toBe(true);
    const retrieveCount = offer.plan?.steps.filter((step) => step.itemId === 'lat-retrieve-conditional').length;
    expect(retrieveCount).toBe(1);
  });

  it('offers lapse recovery from stale evidence when nothing remains or is due', () => {
    let store = loadProgress();
    for (const lesson of ALL_LEARN_LESSONS) {
      store = completeLesson(store, lesson.id);
    }
    store = {
      ...store,
      passed: ['eval-001', 'eval-011', 'tt-001', 'counter-001'],
      queue: [],
      conceptEvidence: {
        [evidenceKey('conditional', 'apply')]: {
          attempts: 4,
          cleanPasses: 4,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: '2025-01-01T00:00:00.000Z',
        },
      },
    };
    const offer = offerOpening(store, null, Date.parse('2026-09-07T12:00:00.000Z'));
    expect(offer.kind).toBe('lapse-recovery');
    expect(offer.plan?.steps.some((step) => step.itemId === 'lat-retrieve-conditional')).toBe(true);
  });
});

describe('composeSessionPlan', () => {
  it('is a pure function', () => {
    const store = loadProgress();
    const before = cloneStore(store);
    composeSessionPlan(store, 'start', LEVEL_0_LESSONS.map((lesson) => lesson.id));
    expect(store).toEqual(before);
    expect(store.activeRouteId).toBe(LOGIC_FOUNDATIONS_ROUTE_ID);
  });

  it('still caps a long practice-only list at the target of 6', () => {
    const store = loadProgress();
    const plan = composeSessionPlan(store, 'quick-review', [
      'eval-001',
      'eval-011',
      'tt-001',
      'counter-001',
      'eval-010',
      'eval-019',
      'eval-003',
      'eval-013',
    ]);
    expect(plan.steps).toHaveLength(6);
    expect(plan.steps.map((step) => step.itemId)).toEqual([
      'eval-001',
      'eval-011',
      'tt-001',
      'counter-001',
      'eval-010',
      'eval-019',
    ]);
  });

  it('expands a watch lesson into one unit per separately advanced case', () => {
    const store = loadProgress();
    const plan = composeSessionPlan(store, 'start', ['level0-04-watch', 'level0-05-guided']);
    expect(plan.steps.map((step) => step.id)).toEqual([
      'level0-04-watch#0',
      'level0-04-watch#1',
      'level0-04-watch#2',
      'level0-04-watch#3',
      'level0-05-guided',
    ]);
    expect(plan.steps.every((step) => step.itemId === 'level0-04-watch' ? step.unitIndex !== undefined : true)).toBe(
      true,
    );
  });

  it('does not start disjunction without its watch and guided practice', () => {
    const store = loadProgress();
    const remaining = LEVEL_1_LESSONS.map((lesson) => lesson.id);
    const plan = composeSessionPlan(store, 'continue', remaining);
    expect(plan.steps.map((step) => step.itemId)).toEqual([
      'level1-01-neg',
      'level1-02-neg-watch',
      'level1-02-neg-watch',
      'level1-03-neg-guided',
    ]);
    expect(plan.steps.some((step) => step.itemId === 'level1-04-or')).toBe(false);
    const disjunction = composeSessionPlan(
      store,
      'continue',
      remaining.filter((id) => !plan.steps.some((step) => step.itemId === id)),
    );
    expect(disjunction.steps.map((step) => step.itemId)).toEqual([
      'level1-04-or',
      'level1-05-or-watch',
      'level1-05-or-watch',
      'level1-05-or-watch',
      'level1-05-or-watch',
      'level1-06-or-guided',
    ]);
  });
});

function assertTeachPracticeCohesion(
  remainingItemIds: string[],
  store: ProgressStore,
  kind: 'start' | 'continue' = 'continue',
): void {
  const expanded = expandItemsToUnits(remainingItemIds, store);
  const plan = composeSessionPlan(store, kind, remainingItemIds);
  expect(plan.steps.length).toBeGreaterThan(0);
  expect(plan.steps.length).toBeLessThanOrEqual(SESSION_MAX);
  expect(plan.steps.map((step) => step.id)).toEqual(
    expanded.slice(0, plan.steps.length).map((step) => step.id),
  );
  if (expanded.length > SESSION_MAX) {
    expect(plan.steps.length).toBeGreaterThanOrEqual(1);
    expect(plan.steps.length).toBeLessThanOrEqual(SESSION_MAX);
  } else {
    expect(plan.steps).toHaveLength(expanded.length);
  }

  const last = plan.steps[plan.steps.length - 1]!;
  if (isTeachingItem(last.itemId)) {
    const key = sessionClusterKey(last.itemId);
    const rest = expanded
      .slice(plan.steps.length)
      .filter((step) => sessionClusterKey(step.itemId) === key);
    const pushedPractice = rest.filter((step) => isPracticeItem(step.itemId));
    if (pushedPractice.length > 0) {
      expect(
        rest[0] && isTeachingItem(rest[0].itemId),
        `${last.id} stranded ${key} practice without explanation`,
      ).toBe(true);
    }
  }

  const groups = groupSessionSteps(expanded);
  let offset = 0;
  for (const group of groups) {
    if (offset >= plan.steps.length) {
      break;
    }
    if (group.length > SESSION_MAX) {
      const takenFromGroup = plan.steps.slice(offset);
      expect(takenFromGroup.map((step) => step.id)).toEqual(
        group.slice(0, takenFromGroup.length).map((step) => step.id),
      );
      const leftover = group.slice(takenFromGroup.length);
      if (leftover.some((step) => isPracticeItem(step.itemId))) {
        expect(isTeachingItem(leftover[0]!.itemId)).toBe(true);
      }
      break;
    }
    expect(
      plan.steps.slice(offset, offset + group.length).map((step) => step.id),
      `split cluster ${sessionClusterKey(group[0]!.itemId)}`,
    ).toEqual(group.map((step) => step.id));
    offset += group.length;
    if (offset >= SESSION_TARGET) {
      break;
    }
  }
}

describe('teach-practice session boundaries', () => {
  it.each([
    ['Unit 0', LEVEL_0_LESSONS],
    ['Unit 1', LEVEL_1_LESSONS],
    ['Unit 2', LEVEL_2_LESSONS],
  ] as const)('keeps explanation with practice from every %s lesson', (_label, lessons) => {
    const store = loadProgress();
    for (let index = 0; index < lessons.length; index += 1) {
      const remaining = lessons.slice(index).map((lesson) => lesson.id);
      assertTeachPracticeCohesion(remaining, store);
    }
  });

  it('covers every foundations lesson id as a starting remainder', () => {
    const seen = new Set<string>();
    for (const lessons of [LEVEL_0_LESSONS, LEVEL_1_LESSONS, LEVEL_2_LESSONS]) {
      for (let index = 0; index < lessons.length; index += 1) {
        seen.add(lessons[index]!.id);
      }
    }
    expect([...seen]).toEqual(ALL_LEARN_LESSONS.map((lesson) => lesson.id));
  });

  it('keeps Sobel teach sequences with their checks from every remaining prefix', () => {
    const store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    const items = plannedSourceItems(store);
    expect(items.length).toBeGreaterThan(0);
    for (let index = 0; index < items.length; index += 1) {
      assertTeachPracticeCohesion(items.slice(index), store, index === 0 ? 'start' : 'continue');
    }
  });

  it('keeps skipped-bridge Sobel prefixes intact', () => {
    let store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    store = {
      ...store,
      conceptEvidence: {
        [evidenceKey('conditional', 'apply')]: {
          attempts: 4,
          cleanPasses: 4,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: new Date().toISOString(),
        },
      },
    };
    const items = plannedSourceItems(store);
    for (let index = 0; index < items.length; index += 1) {
      assertTeachPracticeCohesion(items.slice(index), store, 'continue');
    }
  });
});

describe('session duration segments', () => {
  it('does not count time spent away between interrupt and resume', () => {
    const store = loadProgress();
    const plan = offerOpening(store, null).plan!;
    const started = startSession(plan, '2026-09-07T12:00:00.000Z');
    const interruptedMs = sessionSegmentMs(started, Date.parse('2026-09-07T12:03:00.000Z'));
    const resumed = resumeSession(started, '2026-09-08T12:00:00.000Z');
    const completedMs = sessionSegmentMs(resumed, Date.parse('2026-09-08T12:01:00.000Z'));
    expect(interruptedMs).toBe(3 * 60 * 1000);
    expect(completedMs).toBe(60 * 1000);
    expect(completedMs).toBeLessThan(24 * 60 * 60 * 1000);
  });
});
