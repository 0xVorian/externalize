import {
  createPracticeSession,
  isPracticeSessionComplete,
  recordFinalizedAttempt,
  summarizePracticeSession,
  type PracticeSessionSummary,
} from './practice-session';
import type { SkillId } from './progress-tracker';
import type { ProgressMoment } from './progress-visibility';

export type PendingProgressMoment = {
  moment: ProgressMoment;
  attemptId: string;
  live: boolean;
};

export type PracticeUiState = {
  session: ReturnType<typeof createPracticeSession>;
  pendingProgressMoment: PendingProgressMoment | null;
  unitCompleteNotice: string | null;
  unitCompleteNoticeLive: boolean;
  sessionCompleteLive: boolean;
};

export type PracticeUiContext = {
  sessionCompleted: number;
  sessionTarget: number;
  sessionComplete: boolean;
  sessionCompleteLive: boolean;
  sessionSummary: PracticeSessionSummary | null;
  progressMoment: ProgressMoment | null;
  progressMomentLive: boolean;
  unitCompleteNotice: string | null;
  unitCompleteNoticeLive: boolean;
};

export function createPracticeUiState(): PracticeUiState {
  return {
    session: createPracticeSession(),
    pendingProgressMoment: null,
    unitCompleteNotice: null,
    unitCompleteNoticeLive: false,
    sessionCompleteLive: false,
  };
}

export function resetPracticeUiState(): PracticeUiState {
  return createPracticeUiState();
}

export function isPracticeUiSessionComplete(state: PracticeUiState): boolean {
  return isPracticeSessionComplete(state.session);
}

export function preparePracticeEntry(state: PracticeUiState): PracticeUiState {
  if (!isPracticeSessionComplete(state.session)) {
    return state;
  }
  return {
    ...state,
    session: createPracticeSession(),
    pendingProgressMoment: null,
    sessionCompleteLive: false,
  };
}

export function clearUnitCompleteNotice(state: PracticeUiState): PracticeUiState {
  return { ...state, unitCompleteNotice: null, unitCompleteNoticeLive: false };
}

export function announceUnitComplete(
  state: PracticeUiState,
  message: string,
): PracticeUiState {
  return { ...state, unitCompleteNotice: message, unitCompleteNoticeLive: true };
}

export function disarmLiveAnnouncements(state: PracticeUiState): PracticeUiState {
  return {
    ...state,
    pendingProgressMoment: state.pendingProgressMoment
      ? { ...state.pendingProgressMoment, live: false }
      : null,
    unitCompleteNoticeLive: false,
    sessionCompleteLive: false,
  };
}

export function recordPracticeFinalization(
  state: PracticeUiState,
  attemptId: string,
  skillId: SkillId,
  moments: ProgressMoment[],
  primaryMoment: ProgressMoment | null,
): PracticeUiState {
  const sessionWasComplete = isPracticeSessionComplete(state.session);
  const session = recordFinalizedAttempt(state.session, attemptId, skillId, moments);
  return {
    ...state,
    session,
    pendingProgressMoment: primaryMoment
      ? { moment: primaryMoment, attemptId, live: true }
      : null,
    sessionCompleteLive: !sessionWasComplete && isPracticeSessionComplete(session),
  };
}

export function restartPracticeSession(state: PracticeUiState): PracticeUiState {
  return {
    ...state,
    session: createPracticeSession(),
    pendingProgressMoment: null,
    sessionCompleteLive: false,
    unitCompleteNotice: null,
    unitCompleteNoticeLive: false,
  };
}

export function clearPracticeProgressMoment(state: PracticeUiState): PracticeUiState {
  return { ...state, pendingProgressMoment: null };
}

export function practiceUiContext(
  state: PracticeUiState,
  attemptId: string,
): PracticeUiContext {
  const sessionComplete = isPracticeSessionComplete(state.session);
  const pending =
    state.pendingProgressMoment?.attemptId === attemptId
      ? state.pendingProgressMoment
      : null;
  return {
    sessionCompleted: state.session.completedAttemptIds.length,
    sessionTarget: state.session.target,
    sessionComplete,
    sessionCompleteLive: state.sessionCompleteLive,
    sessionSummary: sessionComplete ? summarizePracticeSession(state.session) : null,
    progressMoment: pending?.moment ?? null,
    progressMomentLive: pending?.live === true,
    unitCompleteNotice: state.unitCompleteNotice,
    unitCompleteNoticeLive: state.unitCompleteNoticeLive,
  };
}
