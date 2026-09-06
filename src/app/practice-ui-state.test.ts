import { describe, expect, it } from 'vitest';
import {
  announceUnitComplete,
  createPracticeUiState,
  disarmLiveAnnouncements,
  practiceUiContext,
  preparePracticeEntry,
  recordPracticeFinalization,
  restartPracticeSession,
} from './practice-ui-state';

describe('practice UI state', () => {
  it('records a progress moment and arms it for one live presentation', () => {
    const state = recordPracticeFinalization(
      createPracticeUiState(),
      'attempt-1',
      'practice:evaluate-formula',
      [{ kind: 'capability-first-pass', skillId: 'practice:evaluate-formula' }],
      { kind: 'capability-first-pass', skillId: 'practice:evaluate-formula' },
    );
    const live = practiceUiContext(state, 'attempt-1');
    expect(live.sessionCompleted).toBe(1);
    expect(live.progressMoment?.kind).toBe('capability-first-pass');
    expect(live.progressMomentLive).toBe(true);

    const disarmed = practiceUiContext(disarmLiveAnnouncements(state), 'attempt-1');
    expect(disarmed.progressMoment?.kind).toBe('capability-first-pass');
    expect(disarmed.progressMomentLive).toBe(false);
  });

  it('completes a five-attempt session once and resets only on explicit preparation', () => {
    let state = createPracticeUiState();
    for (let i = 1; i <= 5; i += 1) {
      state = recordPracticeFinalization(
        state,
        `attempt-${i}`,
        'practice:evaluate-formula',
        [],
        null,
      );
    }
    expect(practiceUiContext(state, 'attempt-5').sessionComplete).toBe(true);
    expect(practiceUiContext(state, 'attempt-5').sessionCompleteLive).toBe(true);

    const next = preparePracticeEntry(state);
    expect(practiceUiContext(next, 'attempt-5').sessionCompleted).toBe(0);
    expect(practiceUiContext(next, 'attempt-5').sessionComplete).toBe(false);
  });

  it('keeps unit completion visible while disarming its live announcement', () => {
    const state = announceUnitComplete(createPracticeUiState(), 'Unit complete');
    expect(practiceUiContext(state, 'attempt-1').unitCompleteNoticeLive).toBe(true);
    const disarmed = disarmLiveAnnouncements(state);
    expect(practiceUiContext(disarmed, 'attempt-1').unitCompleteNotice).toBe('Unit complete');
    expect(practiceUiContext(disarmed, 'attempt-1').unitCompleteNoticeLive).toBe(false);
  });

  it('restart clears session and transient notices together', () => {
    let state = announceUnitComplete(createPracticeUiState(), 'Unit complete');
    state = recordPracticeFinalization(
      state,
      'attempt-1',
      'practice:evaluate-formula',
      [],
      null,
    );
    const restarted = restartPracticeSession(state);
    const context = practiceUiContext(restarted, 'attempt-1');
    expect(context.sessionCompleted).toBe(0);
    expect(context.unitCompleteNotice).toBeNull();
    expect(context.progressMoment).toBeNull();
  });
});
