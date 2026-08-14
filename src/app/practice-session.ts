import type { SkillId } from './progress-tracker';
import type { ProgressMoment } from './progress-visibility';

export const PRACTICE_SESSION_TARGET = 5;

export type PracticeSessionItem = {
  attemptId: string;
  skillId: SkillId;
  moments: ProgressMoment[];
};

export type PracticeSession = {
  target: number;
  completedAttemptIds: string[];
  items: PracticeSessionItem[];
};

export type PracticeSessionSummary = {
  completedCount: number;
  moments: ProgressMoment[];
  skillIds: SkillId[];
};

export function createPracticeSession(
  target = PRACTICE_SESSION_TARGET,
): PracticeSession {
  return {
    target,
    completedAttemptIds: [],
    items: [],
  };
}

export function recordFinalizedAttempt(
  session: PracticeSession,
  attemptId: string,
  skillId: SkillId,
  moments: ProgressMoment[] = [],
): PracticeSession {
  if (session.completedAttemptIds.includes(attemptId)) {
    return session;
  }
  if (isPracticeSessionComplete(session)) {
    return session;
  }
  return {
    ...session,
    completedAttemptIds: [...session.completedAttemptIds, attemptId],
    items: [...session.items, { attemptId, skillId, moments }],
  };
}

export function isPracticeSessionComplete(session: PracticeSession): boolean {
  return session.completedAttemptIds.length >= session.target;
}

function momentKey(moment: ProgressMoment): string {
  switch (moment.kind) {
    case 'capability-reliable':
    case 'capability-first-pass':
    case 'capability-unlocked':
      return `${moment.kind}:${moment.skillId}`;
    case 'exercise-unlocked':
      return `${moment.kind}:${moment.exerciseId}`;
    case 'scaffold-advanced':
      return `${moment.kind}:${moment.exerciseId}:${moment.from}:${moment.to}`;
  }
}

export function summarizePracticeSession(
  session: PracticeSession,
): PracticeSessionSummary {
  const seen = new Set<string>();
  const moments: ProgressMoment[] = [];
  for (const item of session.items) {
    for (const moment of item.moments) {
      const key = momentKey(moment);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      moments.push(moment);
    }
  }
  const skillIds: SkillId[] = [];
  for (const item of session.items) {
    if (!skillIds.includes(item.skillId)) {
      skillIds.push(item.skillId);
    }
  }
  return {
    completedCount: session.completedAttemptIds.length,
    moments,
    skillIds,
  };
}
