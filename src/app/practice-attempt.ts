import type { Assignment, FeedbackTag, RuleId } from '../../engine';
import type { BuilderToken } from './translation';

export type PracticeErrorTag =
  | FeedbackTag
  | 'incorrect-evaluation'
  | 'incorrect-truth-table-cell'
  | 'incorrect-tautology';

export type PracticeAttempt = {
  id: string;
  exerciseId: string;
  status: 'active' | 'finalized';
  checkedAnswers: number;
  firstCheckedCorrect: boolean | null;
  lastCheckCorrect: boolean | null;
  repairOccurred: boolean;
  errorTags: PracticeErrorTag[];
  startedAt: string;
  finalizedAt?: string;
};

export type PracticeDraft = {
  attempt: PracticeAttempt;
  phase: 'ready' | 'answered';
  assignment?: Assignment;
  prediction?: boolean | null;
  selectedNodeId?: string | null;
  submittedCell?: boolean | null;
  builderTokens?: BuilderToken[];
  proofRule?: RuleId | null;
  proofCites?: number[];
  proofDerivedFormula?: string | null;
  feedbackTag?: PracticeErrorTag;
};

let fallbackAttemptSequence = 0;

function attemptId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  fallbackAttemptSequence += 1;
  return `attempt-${Date.now()}-${fallbackAttemptSequence}`;
}

export function createPracticeAttempt(exerciseId: string): PracticeAttempt {
  return {
    id: attemptId(),
    exerciseId,
    status: 'active',
    checkedAnswers: 0,
    firstCheckedCorrect: null,
    lastCheckCorrect: null,
    repairOccurred: false,
    errorTags: [],
    startedAt: new Date().toISOString(),
  };
}

export function recordAttemptCheck(
  attempt: PracticeAttempt,
  correct: boolean,
  errorTag?: PracticeErrorTag,
): PracticeAttempt {
  if (attempt.status === 'finalized') {
    return attempt;
  }
  const firstCheckedCorrect =
    attempt.checkedAnswers === 0 ? correct : attempt.firstCheckedCorrect;
  const errorTags =
    !correct && errorTag && !attempt.errorTags.includes(errorTag)
      ? [...attempt.errorTags, errorTag]
      : attempt.errorTags;

  return {
    ...attempt,
    checkedAnswers: attempt.checkedAnswers + 1,
    firstCheckedCorrect,
    lastCheckCorrect: correct,
    repairOccurred: attempt.repairOccurred || (correct && attempt.checkedAnswers > 0),
    errorTags,
  };
}
