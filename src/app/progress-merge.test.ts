import { describe, expect, it } from 'vitest';
import { evidenceKey } from './curriculum';
import { isProgressStore, mergeProgress, parseProgressStore, progressSnapshotsEqual } from './progress-merge';
import type { PracticeDraft } from './practice-attempt';
import type { ProgressStore } from './storage';
import { LOGIC_AND_THEISM_READING_ROUTE_ID, LOGIC_FOUNDATIONS_ROUTE_ID } from './routes';

const T0 = '2026-01-01T00:00:00.000Z';
const T1 = '2026-01-02T00:00:00.000Z';
const T2 = '2026-01-03T00:00:00.000Z';
const T3 = '2026-01-04T00:00:00.000Z';

function resume(overrides: Partial<ProgressStore['resume']> = {}): ProgressStore['resume'] {
  return {
    mode: 'learn',
    lessonId: 'level0-01-letters',
    updatedAt: T0,
    ...overrides,
  };
}

function store(overrides: Partial<ProgressStore> = {}): ProgressStore {
  return {
    version: 7,
    lessonsCompleted: [],
    level0Complete: false,
    level1Complete: false,
    level2Complete: false,
    queue: [],
    attempted: [],
    passed: [],
    practiceDrafts: {},
    resume: resume(),
    skills: {},
    exerciseStats: {},
    errorCounts: {},
    lastVisitedAt: T0,
    onboardingComplete: false,
    activeRouteId: LOGIC_FOUNDATIONS_ROUTE_ID,
    routes: {
      [LOGIC_FOUNDATIONS_ROUTE_ID]: {
        currentStepId: 'unit-0-learn',
        seenItems: [],
      },
    },
    conceptEvidence: {},
    ...overrides,
  };
}

function draft(
  exerciseId: string,
  attempt: Partial<PracticeDraft['attempt']> & { id: string },
): PracticeDraft {
  return {
    phase: attempt.status === 'finalized' ? 'answered' : 'ready',
    attempt: {
      exerciseId,
      status: 'active',
      checkedAnswers: 0,
      firstCheckedCorrect: null,
      lastCheckCorrect: null,
      repairOccurred: false,
      errorTags: [],
      startedAt: T0,
      ...attempt,
    },
  };
}

describe('mergeProgress', () => {
  it('unions lesson completions and OR-s unit flags without dropping either side', () => {
    const left = store({
      lessonsCompleted: ['level0-01-letters', 'level0-02-truth'],
      level0Complete: false,
      lastVisitedAt: T1,
    });
    const right = store({
      lessonsCompleted: ['level0-03-negation', 'level0-01-letters'],
      level0Complete: true,
      level1Complete: true,
      lastVisitedAt: T2,
    });

    expect(mergeProgress(left, right)).toEqual(
      store({
        lessonsCompleted: ['level0-01-letters', 'level0-02-truth', 'level0-03-negation'],
        level0Complete: true,
        level1Complete: true,
        lastVisitedAt: T2,
        activeRouteId: LOGIC_FOUNDATIONS_ROUTE_ID,
      }),
    );
  });

  it('unions passed and attempted exercise ids in left-then-right order', () => {
    const left = store({
      attempted: ['eval-001', 'tt-001'],
      passed: ['eval-001'],
    });
    const right = store({
      attempted: ['eval-002', 'eval-001'],
      passed: ['tt-001', 'eval-002'],
    });

    expect(mergeProgress(left, right)).toEqual(
      store({
        attempted: ['eval-001', 'tt-001', 'eval-002'],
        passed: ['eval-001', 'tt-001', 'eval-002'],
      }),
    );
  });

  it('keeps the more advanced SRS entry per exercise and preserves left queue order', () => {
    const left = store({
      queue: [
        { exerciseId: 'eval-002', due: T1, intervalDays: 1, ease: 2.5 },
        { exerciseId: 'eval-001', due: T2, intervalDays: 7, ease: 2.6 },
      ],
    });
    const right = store({
      queue: [
        { exerciseId: 'eval-001', due: T3, intervalDays: 1, ease: 2.3 },
        { exerciseId: 'tt-001', due: T0, intervalDays: 1, ease: 2.5 },
      ],
    });

    expect(mergeProgress(left, right).queue).toEqual([
      { exerciseId: 'eval-002', due: T1, intervalDays: 1, ease: 2.5 },
      { exerciseId: 'eval-001', due: T2, intervalDays: 7, ease: 2.6 },
      { exerciseId: 'tt-001', due: T0, intervalDays: 1, ease: 2.5 },
    ]);
  });

  it('is idempotent on queue order: merge(x, x) does not reorder', () => {
    const original = store({
      queue: [
        { exerciseId: 'eval-002', due: T1, intervalDays: 1, ease: 2.5 },
        { exerciseId: 'eval-001', due: T2, intervalDays: 7, ease: 2.6 },
      ],
    });
    expect(mergeProgress(original, original).queue).toEqual(original.queue);
  });

  it('breaks SRS ties by ease, then later due, then left', () => {
    const equalInterval = store({
      queue: [{ exerciseId: 'eval-001', due: T1, intervalDays: 3, ease: 2.4 }],
    });
    const higherEase = store({
      queue: [{ exerciseId: 'eval-001', due: T0, intervalDays: 3, ease: 2.8 }],
    });
    expect(mergeProgress(equalInterval, higherEase).queue).toEqual([
      { exerciseId: 'eval-001', due: T0, intervalDays: 3, ease: 2.8 },
    ]);

    const earlierDue = store({
      queue: [{ exerciseId: 'eval-001', due: T1, intervalDays: 3, ease: 2.5 }],
    });
    const laterDue = store({
      queue: [{ exerciseId: 'eval-001', due: T2, intervalDays: 3, ease: 2.5 }],
    });
    expect(mergeProgress(earlierDue, laterDue).queue).toEqual([
      { exerciseId: 'eval-001', due: T2, intervalDays: 3, ease: 2.5 },
    ]);

    const same = store({
      queue: [{ exerciseId: 'eval-001', due: T1, intervalDays: 3, ease: 2.5 }],
    });
    expect(mergeProgress(same, { ...same }).queue).toEqual([
      { exerciseId: 'eval-001', due: T1, intervalDays: 3, ease: 2.5 },
    ]);
  });

  it('takes per-skill maxima and prefers error tags from the busier side', () => {
    const left = store({
      skills: {
        'practice:evaluate-formula': {
          attempts: 4,
          successes: 3,
          recentErrorTags: ['incorrect-evaluation', 'incorrect-intermediate'],
        },
        'practice:identify-main-connective': {
          attempts: 1,
          successes: 1,
          recentErrorTags: [],
        },
      },
    });
    const right = store({
      skills: {
        'practice:evaluate-formula': {
          attempts: 2,
          successes: 2,
          recentErrorTags: ['scope-too-wide'],
        },
        'practice:fill-truth-table-cell': {
          attempts: 3,
          successes: 1,
          recentErrorTags: ['incorrect-truth-table-cell'],
        },
      },
    });

    expect(mergeProgress(left, right).skills).toEqual({
      'practice:evaluate-formula': {
        attempts: 4,
        successes: 3,
        recentErrorTags: ['incorrect-evaluation', 'incorrect-intermediate', 'scope-too-wide'],
      },
      'practice:identify-main-connective': {
        attempts: 1,
        successes: 1,
        recentErrorTags: [],
      },
      'practice:fill-truth-table-cell': {
        attempts: 3,
        successes: 1,
        recentErrorTags: ['incorrect-truth-table-cell'],
      },
    });
  });

  it('caps skill successes at attempts after taking maxima', () => {
    const left = store({
      skills: {
        'practice:evaluate-formula': { attempts: 2, successes: 2, recentErrorTags: [] },
      },
    });
    const right = store({
      skills: {
        'practice:evaluate-formula': { attempts: 5, successes: 1, recentErrorTags: [] },
      },
    });
    expect(mergeProgress(left, right).skills).toEqual({
      'practice:evaluate-formula': { attempts: 5, successes: 2, recentErrorTags: [] },
    });
  });

  it('merges exercise stats by max counts, max scaffold, and unioned assignment keys', () => {
    const left = store({
      exerciseStats: {
        'eval-001': {
          attempts: 2,
          successes: 1,
          repairedPasses: 1,
          lastErrorTag: 'incorrect-evaluation',
          scaffoldLevel: 1,
          seenAssignmentKeys: ['TF', 'TT'],
        },
      },
    });
    const right = store({
      exerciseStats: {
        'eval-001': {
          attempts: 3,
          successes: 2,
          repairedPasses: 0,
          lastErrorTag: 'incorrect-intermediate',
          scaffoldLevel: 2,
          seenAssignmentKeys: ['FF', 'TF'],
        },
        'tt-001': {
          attempts: 1,
          successes: 1,
          repairedPasses: 0,
        },
      },
    });

    expect(mergeProgress(left, right).exerciseStats).toEqual({
      'eval-001': {
        attempts: 3,
        successes: 2,
        repairedPasses: 1,
        lastErrorTag: 'incorrect-intermediate',
        scaffoldLevel: 2,
        seenAssignmentKeys: ['TF', 'TT', 'FF'],
      },
      'tt-001': {
        attempts: 1,
        successes: 1,
        repairedPasses: 0,
      },
    });
  });

  it('raises attempts when max successes plus repaired passes exceed both sides', () => {
    const left = store({
      exerciseStats: {
        'eval-001': { attempts: 2, successes: 2, repairedPasses: 0 },
      },
    });
    const right = store({
      exerciseStats: {
        'eval-001': { attempts: 2, successes: 0, repairedPasses: 2 },
      },
    });
    expect(mergeProgress(left, right).exerciseStats).toEqual({
      'eval-001': { attempts: 4, successes: 2, repairedPasses: 2 },
    });
  });

  it('takes the maximum count per error tag rather than summing shared history', () => {
    const left = store({
      errorCounts: { 'incorrect-evaluation': 3, 'incorrect-tautology': 1 },
    });
    const right = store({
      errorCounts: { 'incorrect-evaluation': 1, 'incorrect-intermediate': 4 },
    });
    expect(mergeProgress(left, right).errorCounts).toEqual({
      'incorrect-evaluation': 3,
      'incorrect-tautology': 1,
      'incorrect-intermediate': 4,
    });
  });

  it('merges concept evidence by maxima, later lastSeenAt, and preferred recent errors', () => {
    const conjunctionApply = evidenceKey('conjunction', 'apply');
    const negationApply = evidenceKey('negation', 'apply');
    const left = store({
      conceptEvidence: {
        [conjunctionApply]: {
          attempts: 3,
          cleanPasses: 2,
          transferPasses: 1,
          recentErrors: ['incorrect-evaluation'],
          lastSeenAt: T1,
        },
      },
    });
    const right = store({
      conceptEvidence: {
        [conjunctionApply]: {
          attempts: 5,
          cleanPasses: 1,
          transferPasses: 0,
          recentErrors: ['incorrect-intermediate'],
          lastSeenAt: T2,
        },
        [negationApply]: {
          attempts: 1,
          cleanPasses: 1,
          transferPasses: 0,
          recentErrors: [],
        },
      },
    });

    expect(mergeProgress(left, right).conceptEvidence).toEqual({
      [conjunctionApply]: {
        attempts: 5,
        cleanPasses: 2,
        transferPasses: 1,
        recentErrors: ['incorrect-intermediate', 'incorrect-evaluation'],
        lastSeenAt: T2,
      },
      [negationApply]: {
        attempts: 1,
        cleanPasses: 1,
        transferPasses: 0,
        recentErrors: [],
      },
    });
  });

  it('unions route seen items, keeps the earlier completion, and prefers mastery depth', () => {
    const left = store({
      lastVisitedAt: T2,
      routes: {
        [LOGIC_FOUNDATIONS_ROUTE_ID]: {
          currentStepId: 'unit-1-learn',
          seenItems: ['level0-01-letters', 'eval-001'],
          completedAt: T2,
          depthByStep: { 'unit-0-learn': 'reading' },
        },
      },
    });
    const right = store({
      lastVisitedAt: T1,
      activeRouteId: LOGIC_AND_THEISM_READING_ROUTE_ID,
      routes: {
        [LOGIC_FOUNDATIONS_ROUTE_ID]: {
          currentStepId: 'unit-0-learn',
          seenItems: ['level0-02-truth'],
          completedAt: T1,
          depthByStep: { 'unit-0-learn': 'mastery', 'unit-1-learn': 'reading' },
        },
        [LOGIC_AND_THEISM_READING_ROUTE_ID]: {
          currentStepId: 'ii-26',
          seenItems: ['lat-ii-26-context'],
          depthByStep: { 'ii-26': 'reading' },
        },
      },
    });

    expect(mergeProgress(left, right).routes).toEqual({
      [LOGIC_FOUNDATIONS_ROUTE_ID]: {
        currentStepId: 'unit-1-learn',
        seenItems: ['level0-01-letters', 'eval-001', 'level0-02-truth'],
        completedAt: T1,
        depthByStep: { 'unit-0-learn': 'mastery', 'unit-1-learn': 'reading' },
      },
      [LOGIC_AND_THEISM_READING_ROUTE_ID]: {
        currentStepId: 'ii-26',
        seenItems: ['lat-ii-26-context'],
        depthByStep: { 'ii-26': 'reading' },
      },
    });
    expect(mergeProgress(left, right).activeRouteId).toBe(LOGIC_FOUNDATIONS_ROUTE_ID);
  });

  it('picks resume, last exercise, and active route from the later-visited side', () => {
    const left = store({
      lastVisitedAt: T1,
      lastExerciseId: 'eval-001',
      activeRouteId: LOGIC_FOUNDATIONS_ROUTE_ID,
      resume: resume({
        mode: 'practice',
        exerciseId: 'eval-001',
        updatedAt: T1,
      }),
    });
    const right = store({
      lastVisitedAt: T3,
      lastExerciseId: 'tt-001',
      activeRouteId: LOGIC_AND_THEISM_READING_ROUTE_ID,
      resume: resume({
        mode: 'learn',
        lessonId: 'lat-ii-26-context',
        updatedAt: T2,
      }),
    });

    const merged = mergeProgress(left, right);
    expect(merged.lastVisitedAt).toBe(T3);
    expect(merged.lastExerciseId).toBe('tt-001');
    expect(merged.activeRouteId).toBe(LOGIC_AND_THEISM_READING_ROUTE_ID);
    expect(merged.resume).toEqual(
      resume({
        mode: 'learn',
        lessonId: 'lat-ii-26-context',
        updatedAt: T2,
      }),
    );
  });

  it('prefers left resume when updatedAt is equal', () => {
    const left = store({
      resume: resume({ mode: 'practice', exerciseId: 'eval-001', updatedAt: T1 }),
    });
    const right = store({
      resume: resume({ mode: 'learn', lessonId: 'level0-02-truth', updatedAt: T1 }),
    });
    expect(mergeProgress(left, right).resume).toEqual(
      resume({ mode: 'practice', exerciseId: 'eval-001', updatedAt: T1 }),
    );
  });

  it('keeps in-progress drafts from both devices and prefers a finalized attempt', () => {
    const active = draft('eval-001', {
      id: 'attempt-a',
      checkedAnswers: 1,
      startedAt: T1,
    });
    const finalized = draft('eval-001', {
      id: 'attempt-b',
      status: 'finalized',
      checkedAnswers: 1,
      startedAt: T0,
      finalizedAt: T2,
      firstCheckedCorrect: true,
      lastCheckCorrect: true,
    });
    const other = draft('tt-001', {
      id: 'attempt-c',
      checkedAnswers: 0,
      startedAt: T2,
    });

    const left = store({
      lastExerciseId: 'eval-001',
      practiceDraft: active,
      practiceDrafts: { 'eval-001': active },
    });
    const right = store({
      lastExerciseId: 'tt-001',
      lastVisitedAt: T0,
      practiceDraft: other,
      practiceDrafts: { 'eval-001': finalized, 'tt-001': other },
    });

    const merged = mergeProgress(left, right);
    expect(merged.practiceDrafts).toEqual({
      'eval-001': finalized,
      'tt-001': other,
    });
    expect(merged.practiceDraft).toEqual(finalized);
    expect(merged.lastExerciseId).toBe('eval-001');
  });

  it('prefers the draft with more checked answers when both are active', () => {
    const few = draft('eval-001', { id: 'a', checkedAnswers: 1, startedAt: T2 });
    const many = draft('eval-001', { id: 'b', checkedAnswers: 3, startedAt: T0 });
    const merged = mergeProgress(
      store({ practiceDrafts: { 'eval-001': few } }),
      store({ practiceDrafts: { 'eval-001': many } }),
    );
    expect(merged.practiceDrafts['eval-001']).toEqual(many);
  });

  it('ORs onboardingComplete', () => {
    expect(
      mergeProgress(store({ onboardingComplete: false }), store({ onboardingComplete: true }))
        .onboardingComplete,
    ).toBe(true);
  });

  it('does not drop unique progress when merging a default store with a populated one', () => {
    const populated = store({
      lessonsCompleted: ['level0-01-letters'],
      passed: ['eval-001'],
      attempted: ['eval-001'],
      queue: [{ exerciseId: 'eval-001', due: T2, intervalDays: 3, ease: 2.6 }],
      onboardingComplete: true,
      lastVisitedAt: T2,
      lastExerciseId: 'eval-001',
      resume: resume({ mode: 'practice', exerciseId: 'eval-001', updatedAt: T2 }),
      skills: {
        'practice:evaluate-formula': { attempts: 1, successes: 1, recentErrorTags: [] },
      },
      exerciseStats: {
        'eval-001': { attempts: 1, successes: 1, repairedPasses: 0 },
      },
      routes: {
        [LOGIC_FOUNDATIONS_ROUTE_ID]: {
          currentStepId: 'unit-0-practice',
          seenItems: ['level0-01-letters', 'eval-001'],
        },
      },
    });

    expect(mergeProgress(store(), populated)).toEqual(populated);
    expect(mergeProgress(populated, store())).toEqual({
      ...populated,
      lastVisitedAt: T2,
    });
  });

  it('locks a two-device split of lessons, SRS, and evidence to one combined snapshot', () => {
    const phone = store({
      lessonsCompleted: ['level0-01-letters', 'level0-02-truth'],
      attempted: ['eval-001'],
      passed: ['eval-001'],
      queue: [{ exerciseId: 'eval-001', due: T3, intervalDays: 7, ease: 2.7 }],
      lastVisitedAt: T1,
      lastExerciseId: 'eval-001',
      onboardingComplete: true,
      resume: resume({ mode: 'practice', exerciseId: 'eval-001', updatedAt: T1 }),
      skills: {
        'practice:evaluate-formula': { attempts: 2, successes: 2, recentErrorTags: [] },
      },
      exerciseStats: {
        'eval-001': { attempts: 2, successes: 2, repairedPasses: 0, scaffoldLevel: 1 },
      },
      errorCounts: { 'incorrect-evaluation': 0 },
      conceptEvidence: {
        [evidenceKey('conjunction', 'apply')]: {
          attempts: 2,
          cleanPasses: 2,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: T1,
        },
      },
      routes: {
        [LOGIC_FOUNDATIONS_ROUTE_ID]: {
          currentStepId: 'unit-0-practice',
          seenItems: ['level0-01-letters', 'level0-02-truth', 'eval-001'],
        },
      },
    });
    const laptop = store({
      lessonsCompleted: ['level0-03-negation'],
      attempted: ['scope-001'],
      passed: ['scope-001'],
      queue: [{ exerciseId: 'scope-001', due: T2, intervalDays: 1, ease: 2.5 }],
      lastVisitedAt: T2,
      lastExerciseId: 'scope-001',
      onboardingComplete: true,
      resume: resume({ mode: 'practice', exerciseId: 'scope-001', updatedAt: T2 }),
      skills: {
        'practice:identify-main-connective': {
          attempts: 1,
          successes: 1,
          recentErrorTags: [],
        },
      },
      exerciseStats: {
        'scope-001': { attempts: 1, successes: 1, repairedPasses: 0 },
      },
      conceptEvidence: {
        [evidenceKey('scope', 'recognize')]: {
          attempts: 1,
          cleanPasses: 1,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: T2,
        },
      },
      routes: {
        [LOGIC_FOUNDATIONS_ROUTE_ID]: {
          currentStepId: 'unit-0-learn',
          seenItems: ['level0-03-negation', 'scope-001'],
        },
      },
    });

    expect(mergeProgress(phone, laptop)).toEqual({
      version: 7,
      lessonsCompleted: ['level0-01-letters', 'level0-02-truth', 'level0-03-negation'],
      level0Complete: false,
      level1Complete: false,
      level2Complete: false,
      queue: [
        { exerciseId: 'eval-001', due: T3, intervalDays: 7, ease: 2.7 },
        { exerciseId: 'scope-001', due: T2, intervalDays: 1, ease: 2.5 },
      ],
      attempted: ['eval-001', 'scope-001'],
      passed: ['eval-001', 'scope-001'],
      practiceDrafts: {},
      lastExerciseId: 'scope-001',
      resume: resume({ mode: 'practice', exerciseId: 'scope-001', updatedAt: T2 }),
      skills: {
        'practice:evaluate-formula': { attempts: 2, successes: 2, recentErrorTags: [] },
        'practice:identify-main-connective': {
          attempts: 1,
          successes: 1,
          recentErrorTags: [],
        },
      },
      exerciseStats: {
        'eval-001': { attempts: 2, successes: 2, repairedPasses: 0, scaffoldLevel: 1 },
        'scope-001': { attempts: 1, successes: 1, repairedPasses: 0 },
      },
      errorCounts: { 'incorrect-evaluation': 0 },
      lastVisitedAt: T2,
      onboardingComplete: true,
      activeRouteId: LOGIC_FOUNDATIONS_ROUTE_ID,
      routes: {
        [LOGIC_FOUNDATIONS_ROUTE_ID]: {
          currentStepId: 'unit-0-learn',
          seenItems: [
            'level0-01-letters',
            'level0-02-truth',
            'eval-001',
            'level0-03-negation',
            'scope-001',
          ],
        },
      },
      conceptEvidence: {
        [evidenceKey('conjunction', 'apply')]: {
          attempts: 2,
          cleanPasses: 2,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: T1,
        },
        [evidenceKey('scope', 'recognize')]: {
          attempts: 1,
          cleanPasses: 1,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: T2,
        },
      },
    });
  });
});

describe('isProgressStore', () => {
  it('accepts a v7 snapshot and rejects other payloads', () => {
    expect(isProgressStore(store())).toBe(true);
    expect(isProgressStore({ ...store(), version: 6 })).toBe(false);
    expect(isProgressStore(null)).toBe(false);
    expect(isProgressStore({ version: 7 })).toBe(false);
  });

  it('rejects malformed nested queue, skill, and route values', () => {
    expect(isProgressStore({ ...store(), queue: [{ exerciseId: 'eval-001' }] })).toBe(false);
    expect(
      isProgressStore({
        ...store(),
        skills: { 'practice:evaluate-formula': { attempts: '1', successes: 0, recentErrorTags: [] } },
      }),
    ).toBe(false);
    expect(
      isProgressStore({
        ...store(),
        routes: { 'logic-foundations': { depthByStep: { 'unit-0-learn': 'skip' } } },
      }),
    ).toBe(false);
  });

  it('strips unknown top-level keys rather than storing them', () => {
    const parsed = parseProgressStore({ ...store(), extraGarbage: { nested: true }, queue: store().queue });
    expect(parsed).toEqual(store());
    expect(parsed && 'extraGarbage' in parsed).toBe(false);
  });
});

describe('progressSnapshotsEqual', () => {
  it('treats key order as irrelevant', () => {
    const a = store({ passed: ['eval-001'], attempted: ['eval-001'] });
    const b = { ...a, attempted: ['eval-001'], passed: ['eval-001'] };
    expect(progressSnapshotsEqual(a, b)).toBe(true);
    expect(progressSnapshotsEqual(a, store({ passed: ['eval-002'] }))).toBe(false);
  });
});
