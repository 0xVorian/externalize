import { describe, expect, it } from 'vitest';
import { computeWhatNext } from './what-next';
import { buildSummaryFromStore } from './progress-render';
import {
  beginPracticeAttempt,
  clearPracticeDraft,
  completeLesson,
  getUnlockedExerciseIds,
  loadProgress,
  persistPracticeDraft,
  recordCheckedPracticeState,
  selectNextExerciseId,
} from './storage';
import { recordAttemptCheck } from './practice-attempt';

const LEVEL_0 = [
  'level0-01-letters',
  'level0-02-truth',
  'level0-03-and',
  'level0-04-watch',
  'level0-05-guided',
] as const;

function completeLevel0(store: ReturnType<typeof loadProgress>) {
  let next = store;
  for (const id of LEVEL_0) {
    next = completeLesson(next, id);
  }
  return next;
}

function passEval001Repaired(store: ReturnType<typeof loadProgress>) {
  let next = beginPracticeAttempt(clearPracticeDraft(store), 'eval-001');
  let draft = next.practiceDraft!;
  next = recordCheckedPracticeState(next, {
    ...draft,
    phase: 'answered',
    feedbackTag: 'incorrect-evaluation',
    attempt: recordAttemptCheck(draft.attempt, false, 'incorrect-evaluation'),
  });
  next = persistPracticeDraft(next, {
    ...next.practiceDraft!,
    phase: 'ready',
    feedbackTag: undefined,
  });
  draft = next.practiceDraft!;
  return recordCheckedPracticeState(next, {
    ...draft,
    phase: 'answered',
    feedbackTag: 'correct',
    attempt: recordAttemptCheck(draft.attempt, true),
  });
}

describe('selectNextExerciseId', () => {
  it('prefers an immediately due repaired review over a newly unlocked exercise', () => {
    let store = passEval001Repaired(completeLevel0(loadProgress()));
    expect(getUnlockedExerciseIds(store)).toContain('eval-011');
    expect(selectNextExerciseId(store)).toBe('eval-001');
  });

  it('prefers the next new unlocked exercise when no repaired review is due', () => {
    let store = completeLevel0(loadProgress());
    store = beginPracticeAttempt(clearPracticeDraft(store), 'eval-001');
    const draft = store.practiceDraft!;
    store = recordCheckedPracticeState(store, {
      ...draft,
      phase: 'answered',
      feedbackTag: 'correct',
      attempt: recordAttemptCheck(draft.attempt, true),
    });
    expect(selectNextExerciseId(store)).toBe('eval-011');
  });

  it('matches Progress What next? and never selects locked content', () => {
    let store = completeLevel0(loadProgress());
    const continueId = selectNextExerciseId(store);
    const whatNext = computeWhatNext('en', store, buildSummaryFromStore(store));
    expect(whatNext.exerciseId).toBe(continueId);
    expect(getUnlockedExerciseIds(store)).toContain(continueId);
    expect(selectNextExerciseId(store)).toBe('eval-001');
  });
});
