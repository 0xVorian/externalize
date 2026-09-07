/** Frozen session-first contracts. SessionPlan implementation lives in session-plan.ts. */

export const SESSION_TARGET = 6;
export const SESSION_MIN = 5;
export const SESSION_MAX = 7;

export type SessionKind = 'start' | 'continue' | 'quick-review' | 'lapse-recovery';

export type SessionStepSource = 'route' | 'practice';

export type SessionStep = {
  id: string;
  source: SessionStepSource;
  itemId: string;
  /**
   * Watch-case index when this unit is one separately advanced case of a
   * watch lesson. Absent for cards, guided lessons, and practice items.
   */
  unitIndex?: number;
};

export type SessionPlan = {
  id: string;
  kind: SessionKind;
  steps: SessionStep[];
  estimatedMinutes: number;
  /** True when the plan is a planner-composed prerequisite round. Never shown as planner copy. */
  preparation?: boolean;
};

export type OpeningKind = SessionKind | 'resume' | 'idle';

export type OpeningOffer = {
  kind: OpeningKind;
  plan: SessionPlan | null;
  resumeIndex?: number;
  nextReviewAt?: string;
};

export type PersistedSessionStatus = 'active' | 'completed';

export type PersistedSession = {
  plan: SessionPlan;
  currentIndex: number;
  /** When the bounded round first started. Not used for duration. */
  startedAt: string;
  /**
   * When the current active segment began. Resume starts a new segment so
   * time spent away is not counted.
   */
  segmentStartedAt?: string;
  status: PersistedSessionStatus;
};

export type SessionTelemetryAction = 'offered' | 'started' | 'completed' | 'interrupted';

export type SessionTelemetryEvent = {
  kind: OpeningKind;
  action: SessionTelemetryAction;
  stepCount: number;
  durationMs?: number;
  at: string;
};
