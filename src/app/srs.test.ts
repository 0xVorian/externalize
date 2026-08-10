import { describe, expect, it } from 'vitest';
import { SRS_SKILL_PROFILES, createSrsEntry, nextSrsEntryAfterResult, srsProfileForExerciseId, srsProfileForSkill } from './srs';
import { beginPracticeAttempt, loadProgress, recordCheckedPracticeState, seedQueue } from './storage';
import { recordAttemptCheck } from './practice-attempt';

describe('srs per-skill profiles', () => {
  it('uses baseline intervals for scope exercises', () => {
    const profile = srsProfileForExerciseId('scope-001');
    expect(profile.intervalScale).toBe(1);
    expect(profile.initialIntervalDays).toBe(1);
  });
  it('uses shorter intervals for fill-truth-table and translation', () => {
    expect(srsProfileForExerciseId('tt-001').intervalScale).toBe(0.5);
    expect(srsProfileForExerciseId('translate-001').intervalScale).toBe(0.5);
    expect(srsProfileForSkill('practice:identify-main-connective').intervalScale).toBe(1);
  });
  it('schedules shorter follow-up intervals for translation than scope', () => {
    const scopeEntry = { exerciseId: 'scope-001', intervalDays: 4, ease: 2.5, due: new Date().toISOString() };
    const translateEntry = { exerciseId: 'translate-001', intervalDays: 4, ease: 2.5, due: new Date().toISOString() };
    const scopeNext = nextSrsEntryAfterResult(scopeEntry, 'scope-001', true);
    const translateNext = nextSrsEntryAfterResult(translateEntry, 'translate-001', true);
    expect(scopeNext.intervalDays).toBeGreaterThan(translateNext.intervalDays);
    expect(translateNext.intervalDays).toBe(Math.round(scopeNext.intervalDays * 0.5));
  });
  it('resets interval to zero on incorrect answers', () => {
    const entry = { exerciseId: 'tt-001', intervalDays: 6, ease: 2.4, due: new Date().toISOString() };
    const next = nextSrsEntryAfterResult(entry, 'tt-001', false);
    expect(next.intervalDays).toBe(0);
    expect(new Date(next.due).getTime()).toBeLessThanOrEqual(Date.now());
  });
  it('seeds queue entries with profile default ease', () => {
    const store = seedQueue(loadProgress(), ['translate-001', 'scope-001']);
    expect(store.queue.find((item) => item.exerciseId === 'translate-001')?.ease).toBe(SRS_SKILL_PROFILES['practice:translate-en-to-formula'].defaultEase);
    expect(store.queue.find((item) => item.exerciseId === 'scope-001')?.ease).toBe(SRS_SKILL_PROFILES['practice:identify-main-connective'].defaultEase);
  });
  it('creates new queue entries through recordResult using skill profile', () => {
    let store = beginPracticeAttempt(loadProgress(), 'tt-001');
    const draft = store.practiceDraft!;
    store = recordCheckedPracticeState(store, {
      ...draft,
      phase: 'answered',
      feedbackTag: 'correct',
      attempt: recordAttemptCheck(draft.attempt, true),
    });
    const entry = store.queue.find((item) => item.exerciseId === 'tt-001');
    expect(entry?.intervalDays).toBe(1);
    expect(entry?.ease).toBe(createSrsEntry('tt-001').ease);
  });
});
