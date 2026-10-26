/** Frozen session-first contracts. SessionPlan implementation lives in session-plan.ts. */

export const SESSION_TARGET = 6;
export const SESSION_MIN = 5;
export const SESSION_MAX = 7;

export type SessionKind = 'start' | 'continue' | 'quick-review' | 'lapse-recovery';

export type SessionStepSource = 'route' | 'practice';

export type SessionStepRole = 'warmup' | 'repair';

export type SessionStep = {
  id: string;
  source: SessionStepSource;
  itemId: string;
  /**
   * Watch-case index when this unit is one separately advanced case of a
   * watch lesson. Absent for cards, guided lessons, and practice items.
   */
  unitIndex?: number;
  /** Warm-up recall or post-miss repair. Absent for ordinary planned steps. */
  role?: SessionStepRole;
  /** Concept the warm-up or repair is recalling. */
  conceptId?: string;
};

export type SessionPlan = {
  id: string;
  kind: SessionKind;
  steps: SessionStep[];
  estimatedMinutes: number;
  /** True when the plan is a planner-composed prerequisite round. Never shown as planner copy. */
  preparation?: boolean;
  /** Concept recalled by the opening warm-up step, when present. */
  warmupConceptId?: string;
  /** Precomputed repair tail; applied only after a warm-up miss. */
  repairSteps?: SessionStep[];
  /**
   * True after a warm-up Check miss, before the repair tail replaces the
   * remaining steps. Advertised `n / m` stays unchanged until the learner
   * leaves the Try again screen and the first repair step begins.
   */
  repairPending?: boolean;
  /** True after a warm-up miss replaced the remaining planned steps. */
  repairApplied?: boolean;
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
