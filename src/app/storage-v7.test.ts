import { describe, expect, it } from 'vitest';
import { evidenceKey } from './curriculum';
import { backfillConceptEvidence, evidenceForExercise, recordConceptEvidence } from './evidence';
import {
  beginPracticeAttempt,
  clearPracticeDraft,
  completeLesson,
  importProgress,
  loadProgress,
  recordCheckedPracticeState,
} from './storage';
import { recordAttemptCheck } from './practice-attempt';
import { planRequirement } from './planner';
import { LEVEL_0_LESSONS } from './lessons';
import { LOGIC_FOUNDATIONS_ROUTE_ID } from './routes';
import { showHint, createState } from './state';
import { getExerciseDefinition } from './exercises';

const LEVEL_0_IDS = LEVEL_0_LESSONS.map((lesson) => lesson.id);

function completeLevel0() {
  let store = loadProgress();
  for (const id of LEVEL_0_IDS) {
    store = completeLesson(store, id);
  }
  return store;
}

function completeAttempt(
  store: ReturnType<typeof loadProgress>,
  exerciseId: string,
  checks: Array<{ correct: boolean; errorTag?: 'incorrect-evaluation' }> = [{ correct: true }],
) {
  let next = beginPracticeAttempt(clearPracticeDraft(store), exerciseId);
  for (const check of checks) {
    const draft = next.practiceDraft!;
    const checkedDraft = {
      ...draft,
      phase: 'answered' as const,
      feedbackTag: check.correct ? ('correct' as const) : check.errorTag,
      attempt: recordAttemptCheck(draft.attempt, check.correct, check.errorTag),
    };
    next = recordCheckedPracticeState(next, checkedDraft);
  }
  return next;
}

describe('v6 → v7 migration', () => {
  it('preserves v6 fields and resume while adding route state', () => {
    const due = new Date('2026-01-01T00:00:00.000Z').toISOString();
    const { progress } = importProgress(
      JSON.stringify({
        version: 6,
        lessonsCompleted: [...LEVEL_0_IDS],
        level0Complete: true,
        level1Complete: false,
        level2Complete: false,
        queue: [{ exerciseId: 'eval-001', due, intervalDays: 1, ease: 2.5 }],
        attempted: ['eval-001'],
        passed: ['eval-001'],
        practiceDrafts: {},
        lastExerciseId: 'eval-001',
        resume: {
          mode: 'practice',
          exerciseId: 'eval-001',
          updatedAt: '2026-01-02T00:00:00.000Z',
        },
        skills: {
          'practice:evaluate-formula': {
            attempts: 1,
            successes: 1,
            recentErrorTags: [],
          },
        },
        exerciseStats: {
          'eval-001': { attempts: 1, successes: 1, repairedPasses: 0 },
        },
        errorCounts: {},
        lastVisitedAt: '2026-01-02T00:00:00.000Z',
        onboardingComplete: true,
      }),
    );

    expect(progress.version).toBe(7);
    expect(progress.lessonsCompleted).toEqual([...LEVEL_0_IDS]);
    expect(progress.level0Complete).toBe(true);
    expect(progress.passed).toEqual(['eval-001']);
    expect(progress.attempted).toEqual(['eval-001']);
    expect(progress.queue[0]?.exerciseId).toBe('eval-001');
    expect(progress.skills['practice:evaluate-formula']?.successes).toBe(1);
    expect(progress.resume.mode).toBe('practice');
    expect(progress.resume.exerciseId).toBe('eval-001');
    expect(progress.activeRouteId).toBe(LOGIC_FOUNDATIONS_ROUTE_ID);
    expect(progress.routes[LOGIC_FOUNDATIONS_ROUTE_ID]?.seenItems).toEqual(
      expect.arrayContaining([...LEVEL_0_IDS, 'eval-001']),
    );
  });

  it('backfills concept evidence only from tagged exerciseStats', () => {
    const { progress } = importProgress(
      JSON.stringify({
        version: 6,
        lessonsCompleted: [...LEVEL_0_IDS],
        level0Complete: true,
        level1Complete: false,
        level2Complete: false,
        queue: [],
        attempted: ['eval-001'],
        passed: ['eval-001'],
        practiceDrafts: {},
        resume: { mode: 'practice', exerciseId: 'eval-001', updatedAt: new Date().toISOString() },
        skills: {},
        exerciseStats: {
          'eval-001': {
            attempts: 2,
            successes: 1,
            repairedPasses: 1,
            lastErrorTag: 'incorrect-evaluation',
          },
        },
        errorCounts: { 'incorrect-evaluation': 1 },
        lastVisitedAt: new Date().toISOString(),
        onboardingComplete: true,
      }),
    );
    const key = evidenceKey('conjunction', 'apply');
    expect(progress.conceptEvidence[key]).toEqual({
      attempts: 2,
      cleanPasses: 1,
      transferPasses: 0,
      recentErrors: ['incorrect-evaluation'],
    });
    expect(progress.conceptEvidence[key]?.lastSeenAt).toBeUndefined();
  });

  it('does not treat consistent migrated evidence of unknown age as skip-fresh', () => {
    const { progress } = importProgress(
      JSON.stringify({
        version: 6,
        lessonsCompleted: [...LEVEL_0_IDS],
        level0Complete: true,
        level1Complete: false,
        level2Complete: false,
        queue: [],
        attempted: ['eval-004'],
        passed: ['eval-004'],
        practiceDrafts: {},
        resume: { mode: 'practice', exerciseId: 'eval-004', updatedAt: new Date().toISOString() },
        skills: {},
        exerciseStats: {
          'eval-004': {
            attempts: 4,
            successes: 4,
            repairedPasses: 0,
          },
        },
        errorCounts: {},
        lastVisitedAt: new Date().toISOString(),
        onboardingComplete: true,
      }),
    );
    const key = evidenceKey('conditional', 'apply');
    expect(progress.conceptEvidence[key]).toEqual({
      attempts: 4,
      cleanPasses: 4,
      transferPasses: 0,
      recentErrors: [],
    });
    expect(progress.conceptEvidence[key]?.lastSeenAt).toBeUndefined();
    expect(
      planRequirement(progress.conceptEvidence, { concept: 'conditional', capability: 'apply' }).kind,
    ).toBe('retrieve');
  });

  it('does not invent concept evidence from lesson completion in a v6 export', () => {
    const { progress } = importProgress(
      JSON.stringify({
        version: 6,
        lessonsCompleted: [...LEVEL_0_IDS],
        level0Complete: true,
        level1Complete: false,
        level2Complete: false,
        queue: [],
        attempted: [],
        passed: [],
        practiceDrafts: {},
        resume: { mode: 'learn', lessonId: 'level1-01-neg', updatedAt: new Date().toISOString() },
        skills: {},
        exerciseStats: {},
        errorCounts: {},
        lastVisitedAt: new Date().toISOString(),
        onboardingComplete: true,
      }),
    );
    expect(progress.conceptEvidence).toEqual({});
    expect(backfillConceptEvidence({})).toEqual({});
  });
});

describe('concept evidence recording', () => {
  it('records portable evidence on a clean pass', () => {
    const store = completeAttempt(completeLevel0(), 'eval-001');
    const key = evidenceKey('conjunction', 'apply');
    expect(store.conceptEvidence[key]?.attempts).toBe(1);
    expect(store.conceptEvidence[key]?.cleanPasses).toBe(1);
    expect(store.passed).toContain('eval-001');
  });

  it('records a repaired pass without a clean-pass increment', () => {
    const store = completeAttempt(completeLevel0(), 'eval-001', [
      { correct: false, errorTag: 'incorrect-evaluation' },
      { correct: true },
    ]);
    const key = evidenceKey('conjunction', 'apply');
    expect(store.conceptEvidence[key]?.attempts).toBe(1);
    expect(store.conceptEvidence[key]?.cleanPasses).toBe(0);
    expect(store.exerciseStats['eval-001']?.repairedPasses).toBe(1);
  });

  it('does not record evidence when a hint is shown', () => {
    const exercise = getExerciseDefinition('eval-003')!;
    const store = completeLevel0();
    const before = store.conceptEvidence;
    const state = showHint(createState('en', exercise));
    expect(state.hintVisible).toBe(true);
    expect(store.conceptEvidence).toEqual(before);
    expect(store.conceptEvidence).toEqual({});
  });

  it('keeps supporting tags on translation items', () => {
    const tags = evidenceForExercise('translate-002');
    expect(tags.some((tag) => tag.concept === 'negation' && tag.role === 'primary')).toBe(true);
    expect(tags.some((tag) => tag.concept === 'scope' && tag.role === 'supporting')).toBe(true);
    const recorded = recordConceptEvidence({}, tags, { cleanPass: true, at: 't' });
    expect(recorded[evidenceKey('negation', 'apply')]?.cleanPasses).toBe(1);
    expect(recorded[evidenceKey('scope', 'apply')]?.cleanPasses).toBe(1);
  });
});
