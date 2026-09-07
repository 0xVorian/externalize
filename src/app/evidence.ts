import evidenceGraph from '../../content/exercise-evidence.json' with { type: 'json' };
import { isCanonicalConcept } from './concepts';
import {
  CAPABILITIES,
  emptyConceptStat,
  evidenceKey,
  type Capability,
  type ConceptCapabilityStat,
  type EvidenceTag,
} from './curriculum';
import { EXERCISE_DEFINITIONS } from './exercises';
import type { ExerciseStat } from './progress-tracker';

export type { EvidenceTag };

type EvidenceGraph = {
  version: number;
  exercises: Record<string, EvidenceTag[]>;
};

const GRAPH = evidenceGraph as EvidenceGraph;

export function evidenceForExercise(exerciseId: string): EvidenceTag[] {
  return GRAPH.exercises[exerciseId] ?? [];
}

export function primaryEvidence(exerciseId: string): EvidenceTag | undefined {
  const tags = evidenceForExercise(exerciseId);
  return tags.find((tag) => (tag.role ?? 'primary') === 'primary') ?? tags[0];
}

export type ConceptEvidenceResult = {
  cleanPass: boolean;
  isTransfer?: boolean;
  errorTags?: string[];
  at?: string;
};

export function recordConceptEvidence(
  current: Record<string, ConceptCapabilityStat>,
  tags: EvidenceTag[],
  result: ConceptEvidenceResult,
): Record<string, ConceptCapabilityStat> {
  if (tags.length === 0) {
    return current;
  }
  const next = { ...current };
  for (const tag of tags) {
    const key = evidenceKey(tag.concept, tag.capability);
    const prev = next[key] ?? emptyConceptStat();
    const countsTransfer = result.isTransfer === true || tag.capability === 'transfer';
    const recentErrors =
      result.errorTags && result.errorTags.length > 0
        ? [
            ...result.errorTags.slice().reverse(),
            ...prev.recentErrors.filter((tagId) => !result.errorTags?.includes(tagId)),
          ].slice(0, 5)
        : prev.recentErrors;
    next[key] = {
      attempts: prev.attempts + 1,
      cleanPasses: prev.cleanPasses + (result.cleanPass ? 1 : 0),
      transferPasses:
        prev.transferPasses + (result.cleanPass && countsTransfer ? 1 : 0),
      recentErrors,
      lastSeenAt: result.at ?? prev.lastSeenAt,
    };
  }
  return next;
}

function mergeConceptStats(
  left: ConceptCapabilityStat,
  right: ConceptCapabilityStat,
): ConceptCapabilityStat {
  return {
    attempts: left.attempts + right.attempts,
    cleanPasses: left.cleanPasses + right.cleanPasses,
    transferPasses: left.transferPasses + right.transferPasses,
    recentErrors: [...right.recentErrors, ...left.recentErrors]
      .filter((tag, index, all) => all.indexOf(tag) === index)
      .slice(0, 5),
    lastSeenAt: right.lastSeenAt ?? left.lastSeenAt,
  };
}

/** Backfill portable concept evidence from explicit activity tags + exerciseStats only. */
export function backfillConceptEvidence(
  exerciseStats: Record<string, ExerciseStat>,
): Record<string, ConceptCapabilityStat> {
  const evidence: Record<string, ConceptCapabilityStat> = {};
  for (const [exerciseId, stat] of Object.entries(exerciseStats)) {
    const tags = evidenceForExercise(exerciseId);
    if (tags.length === 0 || stat.attempts <= 0) {
      continue;
    }
    for (const tag of tags) {
      const key = evidenceKey(tag.concept, tag.capability);
      const incoming: ConceptCapabilityStat = {
        attempts: stat.attempts,
        cleanPasses: stat.successes,
        transferPasses: tag.capability === 'transfer' ? stat.successes : 0,
        recentErrors: stat.lastErrorTag ? [stat.lastErrorTag] : [],
      };
      evidence[key] = evidence[key]
        ? mergeConceptStats(evidence[key], incoming)
        : incoming;
    }
  }
  return evidence;
}

export function assertEvidenceIntegrity(): void {
  for (const exercise of EXERCISE_DEFINITIONS) {
    const tags = evidenceForExercise(exercise.id);
    if (tags.length === 0) {
      throw new Error(`Missing evidence tags for ${exercise.id}`);
    }
    for (const tag of tags) {
      if (!isCanonicalConcept(tag.concept)) {
        throw new Error(`Unknown concept ${tag.concept} on ${exercise.id}`);
      }
      if (!CAPABILITIES.includes(tag.capability as Capability)) {
        throw new Error(`Unknown capability ${tag.capability} on ${exercise.id}`);
      }
    }
  }
}
