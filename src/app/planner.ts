import {
  CONSISTENT_MIN_ATTEMPTS,
  CONSISTENT_MIN_RATE,
} from './progress-tracker';
import {
  emptyConceptStat,
  evidenceKey,
  type ConceptCapabilityStat,
  type Requirement,
} from './curriculum';

export type PlannedIntervention =
  | { kind: 'skip'; requirement: Requirement }
  | { kind: 'retrieve'; requirement: Requirement; itemId: string }
  | { kind: 'teach'; requirement: Requirement; itemIds: string[] }
  | { kind: 'unsupported'; requirement: Requirement; reason: 'missing-bridge' };

export type PrerequisiteBridge = {
  retrieve: string;
  teach: string[];
};

export const PREREQUISITE_BRIDGES: Record<string, PrerequisiteBridge> = {
  'conditional:apply': {
    retrieve: 'lat-retrieve-conditional',
    teach: [
      'lat-conditional-bridge',
      'lat-empty-no-counterexample',
      'lat-name-vacuity',
      'lat-retrieve-conditional',
    ],
  },
  'universal-quantifier:recognize': {
    retrieve: 'lat-check-universal',
    teach: ['lat-quantifier-universal', 'lat-check-universal'],
  },
  'existential-quantifier:recognize': {
    retrieve: 'lat-check-existential',
    teach: [
      'lat-existential-meaning',
      'lat-name-existential',
      'lat-quantifier-existential',
      'lat-existential-conjunction',
      'lat-check-existential',
    ],
  },
};

const STALE_AFTER_MS = 30 * 24 * 60 * 60 * 1000;

export function isEvidenceConsistent(stat?: ConceptCapabilityStat): boolean {
  if (!stat || stat.attempts <= 0) {
    return false;
  }
  return (
    stat.attempts >= CONSISTENT_MIN_ATTEMPTS &&
    stat.cleanPasses / stat.attempts >= CONSISTENT_MIN_RATE
  );
}

/** True when graded attempts exist but lastSeenAt is missing or unparseable. */
export function hasUnknownRecency(stat?: ConceptCapabilityStat): boolean {
  if (!stat || stat.attempts <= 0) {
    return false;
  }
  if (!stat.lastSeenAt) {
    return true;
  }
  return Number.isNaN(Date.parse(stat.lastSeenAt));
}

export function isEvidenceStale(
  stat?: ConceptCapabilityStat,
  now = Date.now(),
): boolean {
  if (!stat || stat.attempts <= 0) {
    return false;
  }
  if (hasUnknownRecency(stat)) {
    return true;
  }
  const seen = Date.parse(stat.lastSeenAt!);
  return now - seen > STALE_AFTER_MS;
}

export function missingPrerequisiteBridges(requirements: Requirement[]): Requirement[] {
  return requirements.filter((requirement) => {
    const capability = requirement.capability ?? 'apply';
    return !PREREQUISITE_BRIDGES[evidenceKey(requirement.concept, capability)];
  });
}

export function evidenceForRequirement(
  evidence: Record<string, ConceptCapabilityStat>,
  requirement: Requirement,
): ConceptCapabilityStat | undefined {
  const capability = requirement.capability ?? 'apply';
  return evidence[evidenceKey(requirement.concept, capability)];
}

export function planRequirement(
  evidence: Record<string, ConceptCapabilityStat>,
  requirement: Requirement,
  now = Date.now(),
): PlannedIntervention {
  const capability = requirement.capability ?? 'apply';
  const key = evidenceKey(requirement.concept, capability);
  const stat = evidence[key] ?? emptyConceptStat();
  const bridge = PREREQUISITE_BRIDGES[key];
  const consistent = isEvidenceConsistent(stat);
  const stale = isEvidenceStale(stat, now);
  const hasTransfer = stat.transferPasses > 0;
  const skipAllowed =
    consistent &&
    !stale &&
    (capability !== 'transfer' || hasTransfer);

  if (skipAllowed) {
    return { kind: 'skip', requirement };
  }

  if (!bridge) {
    return { kind: 'unsupported', requirement, reason: 'missing-bridge' };
  }

  if (stat.attempts > 0) {
    return { kind: 'retrieve', requirement, itemId: bridge.retrieve };
  }

  return { kind: 'teach', requirement, itemIds: [...bridge.teach] };
}

export function planPrerequisites(
  evidence: Record<string, ConceptCapabilityStat>,
  requirements: Requirement[],
  now = Date.now(),
): PlannedIntervention[] {
  return requirements.map((requirement) => planRequirement(evidence, requirement, now));
}

export function plannedItemIds(plan: PlannedIntervention[]): string[] {
  const items: string[] = [];
  for (const intervention of plan) {
    if (intervention.kind === 'retrieve' && !items.includes(intervention.itemId)) {
      items.push(intervention.itemId);
    }
    if (intervention.kind === 'teach') {
      for (const itemId of intervention.itemIds) {
        if (!items.includes(itemId)) {
          items.push(itemId);
        }
      }
    }
  }
  return items;
}
