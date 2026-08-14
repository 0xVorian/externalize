import { describe, expect, it } from 'vitest';
import {
  deriveCapabilityState,
  deriveCapabilityStates,
  diffProgressVisibility,
  selectProgressMoment,
  snapshotProgressVisibility,
  type ProgressVisibilitySnapshot,
} from './progress-visibility';
import {
  createPracticeSession,
  isPracticeSessionComplete,
  recordFinalizedAttempt,
} from './practice-session';
import {
  nextScaffoldLevel,
  scaffoldMaxLevel,
} from './evaluation-scaffold';
import { completeLesson, loadProgress, type ProgressStore } from './storage';
import { LEVEL_0_LESSONS } from './lessons';
import { TRACKED_SKILL_IDS, type SkillId } from './progress-tracker';
import { beginPracticeAttempt, clearPracticeDraft, recordCheckedPracticeState } from './storage';
import { recordAttemptCheck } from './practice-attempt';

function emptyStore(): ProgressStore {
  return loadProgress();
}

function completeLevel0(store: ProgressStore): ProgressStore {
  let next = store;
  for (const lesson of LEVEL_0_LESSONS) {
    next = completeLesson(next, lesson.id);
  }
  return next;
}

function snapshotWith(
  overrides: {
    capabilities?: Partial<Record<SkillId, ProgressVisibilitySnapshot['capabilities'][SkillId]>>;
    unlockedExerciseIds?: string[];
    scaffoldLevels?: Record<string, number>;
  } = {},
): ProgressVisibilitySnapshot {
  const capabilities = {} as ProgressVisibilitySnapshot['capabilities'];
  for (const id of TRACKED_SKILL_IDS) {
    capabilities[id] = 'locked';
  }
  return {
    capabilities: { ...capabilities, ...overrides.capabilities },
    unlockedExerciseIds: overrides.unlockedExerciseIds ?? [],
    scaffoldLevels: overrides.scaffoldLevels ?? {},
  };
}

function finalizeClean(store: ProgressStore, exerciseId: string): ProgressStore {
  let next = beginPracticeAttempt(clearPracticeDraft(store), exerciseId);
  const draft = next.practiceDraft!;
  return recordCheckedPracticeState(next, {
    ...draft,
    phase: 'answered',
    feedbackTag: 'correct',
    attempt: recordAttemptCheck(draft.attempt, true),
  });
}

function finalizeRepaired(store: ProgressStore, exerciseId: string): ProgressStore {
  let next = beginPracticeAttempt(clearPracticeDraft(store), exerciseId);
  const wrong = next.practiceDraft!;
  next = recordCheckedPracticeState(next, {
    ...wrong,
    phase: 'answered',
    feedbackTag: 'incorrect-evaluation',
    attempt: recordAttemptCheck(wrong.attempt, false, 'incorrect-evaluation'),
  });
  const draft = next.practiceDraft!;
  return recordCheckedPracticeState(next, {
    ...draft,
    phase: 'answered',
    feedbackTag: 'correct',
    attempt: recordAttemptCheck(draft.attempt, true),
  });
}

describe('capability derivation', () => {
  it('is locked when no exercise for the skill is unlocked', () => {
    const store = emptyStore();
    expect(deriveCapabilityState('practice:evaluate-formula', store, [])).toBe('locked');
  });

  it('is ready when an exercise is unlocked but there are no finalized attempts', () => {
    const store = completeLevel0(emptyStore());
    expect(
      deriveCapabilityState('practice:evaluate-formula', store, ['eval-001']),
    ).toBe('ready');
  });

  it('becomes developing after the first finalized attempt', () => {
    let store = completeLevel0(emptyStore());
    store = finalizeClean(store, 'eval-001');
    const states = deriveCapabilityStates(store, ['eval-001']);
    expect(states['practice:evaluate-formula']).toBe('developing');
  });

  it('becomes reliable at 3 attempts with a clean-pass rate of 0.8', () => {
    const store = {
      ...completeLevel0(emptyStore()),
      skills: {
        'practice:evaluate-formula': { attempts: 3, successes: 3, recentErrorTags: [] },
      },
    };
    expect(
      deriveCapabilityState('practice:evaluate-formula', store, ['eval-001']),
    ).toBe('reliable');
  });

  it('stays developing at 4 attempts with a 0.75 clean-pass rate', () => {
    const store = {
      ...completeLevel0(emptyStore()),
      skills: {
        'practice:evaluate-formula': { attempts: 4, successes: 3, recentErrorTags: [] },
      },
    };
    expect(
      deriveCapabilityState('practice:evaluate-formula', store, ['eval-001']),
    ).toBe('developing');
  });

  it('does not count repaired passes as clean successes', () => {
    let store = completeLevel0(emptyStore());
    store = finalizeRepaired(store, 'eval-001');
    expect(store.skills['practice:evaluate-formula']?.attempts).toBe(1);
    expect(store.skills['practice:evaluate-formula']?.successes).toBe(0);
    expect(
      deriveCapabilityState('practice:evaluate-formula', store, ['eval-001', 'eval-011']),
    ).toBe('developing');
  });

  it('does not become reliable from three repaired passes', () => {
    const store = {
      ...completeLevel0(emptyStore()),
      skills: {
        'practice:evaluate-formula': { attempts: 3, successes: 0, recentErrorTags: [] },
      },
    };
    expect(
      deriveCapabilityState('practice:evaluate-formula', store, ['eval-001']),
    ).toBe('developing');
  });
});

describe('progress moment diffs', () => {
  it('fires reliability only when crossing into reliable', () => {
    const before = snapshotWith({
      capabilities: { 'practice:evaluate-formula': 'developing' },
      unlockedExerciseIds: ['eval-001'],
    });
    const crossing = snapshotWith({
      capabilities: { 'practice:evaluate-formula': 'reliable' },
      unlockedExerciseIds: ['eval-001'],
    });
    const already = snapshotWith({
      capabilities: { 'practice:evaluate-formula': 'reliable' },
      unlockedExerciseIds: ['eval-001'],
    });
    expect(selectProgressMoment(diffProgressVisibility(before, crossing))).toEqual({
      kind: 'capability-reliable',
      skillId: 'practice:evaluate-formula',
    });
    expect(diffProgressVisibility(crossing, already)).toEqual([]);
  });

  it('reports a new exercise unlock without calling the capability newly available', () => {
    const before = snapshotWith({
      capabilities: { 'practice:evaluate-formula': 'developing' },
      unlockedExerciseIds: ['eval-001'],
    });
    const after = snapshotWith({
      capabilities: { 'practice:evaluate-formula': 'developing' },
      unlockedExerciseIds: ['eval-001', 'eval-011'],
    });
    expect(diffProgressVisibility(before, after)).toEqual([
      { kind: 'exercise-unlocked', exerciseId: 'eval-011' },
    ]);
  });

  it('reports a capability unlock when the first exercise for a skill opens', () => {
    const before = snapshotWith({
      capabilities: { 'practice:identify-main-connective': 'locked' },
      unlockedExerciseIds: ['eval-001'],
    });
    const after = snapshotWith({
      capabilities: { 'practice:identify-main-connective': 'ready' },
      unlockedExerciseIds: ['eval-001', 'scope-003'],
    });
    const moments = diffProgressVisibility(before, after);
    expect(moments).toContainEqual({
      kind: 'capability-unlocked',
      skillId: 'practice:identify-main-connective',
    });
    expect(selectProgressMoment(moments)?.kind).toBe('capability-unlocked');
  });

  it('reports scaffold advancement when a nested evaluation withdraws support', () => {
    const before = snapshotWith({
      capabilities: { 'practice:evaluate-formula': 'developing' },
      unlockedExerciseIds: ['eval-007'],
      scaffoldLevels: { 'eval-007': 0 },
    });
    const after = snapshotWith({
      capabilities: { 'practice:evaluate-formula': 'developing' },
      unlockedExerciseIds: ['eval-007'],
      scaffoldLevels: { 'eval-007': 1 },
    });
    expect(diffProgressVisibility(before, after, 'eval-007')).toEqual([
      { kind: 'scaffold-advanced', exerciseId: 'eval-007', from: 0, to: 1 },
    ]);
  });

  it('does not report scaffold advancement at max level', () => {
    const max = scaffoldMaxLevel('eval-007');
    const before = snapshotWith({
      scaffoldLevels: { 'eval-007': max },
    });
    const after = snapshotWith({
      scaffoldLevels: { 'eval-007': max },
    });
    expect(diffProgressVisibility(before, after, 'eval-007')).toEqual([]);
    expect(nextScaffoldLevel('eval-007', max)).toBeNull();
  });

  it('reports first pass when ready becomes developing', () => {
    const before = snapshotWith({
      capabilities: { 'practice:evaluate-formula': 'ready' },
      unlockedExerciseIds: ['eval-001'],
    });
    const after = snapshotWith({
      capabilities: { 'practice:evaluate-formula': 'developing' },
      unlockedExerciseIds: ['eval-001'],
    });
    expect(selectProgressMoment(diffProgressVisibility(before, after))).toEqual({
      kind: 'capability-first-pass',
      skillId: 'practice:evaluate-formula',
    });
  });
});

describe('practice session', () => {
  it('increments once per finalized attempt id', () => {
    let session = createPracticeSession();
    session = recordFinalizedAttempt(session, 'a1', 'practice:evaluate-formula');
    session = recordFinalizedAttempt(session, 'a1', 'practice:evaluate-formula');
    expect(session.completedAttemptIds).toEqual(['a1']);
  });

  it('does not increment for intermediate wrong checks', () => {
    const session = createPracticeSession();
    expect(session.completedAttemptIds).toHaveLength(0);
  });

  it('counts a repaired finalization once', () => {
    let session = createPracticeSession();
    session = recordFinalizedAttempt(session, 'repair-1', 'practice:evaluate-formula');
    expect(session.completedAttemptIds).toHaveLength(1);
  });

  it('completes at five finalized attempts', () => {
    let session = createPracticeSession(5);
    for (let i = 0; i < 5; i += 1) {
      session = recordFinalizedAttempt(session, `a${i}`, 'practice:evaluate-formula');
    }
    expect(isPracticeSessionComplete(session)).toBe(true);
    const after = recordFinalizedAttempt(session, 'a5', 'practice:evaluate-formula');
    expect(after.completedAttemptIds).toHaveLength(5);
  });
});

describe('evaluation scaffold', () => {
  it('advances scaffold level after a clean nested evaluation pass', () => {
    let store = completeLevel0(emptyStore());
    store = finalizeClean(store, 'eval-007');
    expect(store.exerciseStats['eval-007']?.scaffoldLevel).toBe(1);
    store = finalizeClean(store, 'eval-007');
    expect(store.exerciseStats['eval-007']?.scaffoldLevel).toBe(1);
  });

  it('does not advance scaffold on a repaired pass', () => {
    let store = completeLevel0(emptyStore());
    store = finalizeRepaired(store, 'eval-007');
    expect(store.exerciseStats['eval-007']?.scaffoldLevel ?? 0).toBe(0);
  });
});

describe('imported progress derivation', () => {
  it('derives capability state from imported v6 skill stats', () => {
    const store: ProgressStore = {
      ...completeLevel0(emptyStore()),
      skills: {
        'practice:evaluate-formula': { attempts: 5, successes: 4, recentErrorTags: [] },
      },
    };
    const snapshot = snapshotProgressVisibility(store);
    expect(snapshot.capabilities['practice:evaluate-formula']).toBe('reliable');
  });
});
