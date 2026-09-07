/** Canonical curriculum types for routes, evidence, and portable concept state. */

export type ConceptId = string;

export type Capability = 'recognize' | 'apply' | 'debug' | 'transfer';

export const CAPABILITIES: readonly Capability[] = [
  'recognize',
  'apply',
  'debug',
  'transfer',
];

export type ConceptDefinition = {
  id: ConceptId;
  requires?: ConceptId[];
  label: { en: string; fr: string };
};

export type EvidenceTag = {
  concept: ConceptId;
  capability: Capability;
  role?: 'primary' | 'supporting';
};

export type Requirement = {
  concept: ConceptId;
  capability?: Capability;
};

export type RouteKind = 'canonical' | 'source';

export type RouteStepKind = 'learn' | 'practice' | 'source';

export type RouteUnlockPolicy = 'sequential' | 'clustered';

export type RouteDepth = 'reading' | 'mastery';

export type RouteStep = {
  id: string;
  kind?: RouteStepKind;
  anchor?: string;
  depth?: RouteDepth;
  requires?: Requirement[];
  requiresStep?: string;
  unlock?: RouteUnlockPolicy;
  items: string[];
};

export type RouteDefinition = {
  id: string;
  kind: RouteKind;
  label: { en: string; fr: string };
  sourcePackId?: string;
  defaultDepth?: RouteDepth;
  steps: RouteStep[];
};

export type SourceMode =
  | 'prerequisite'
  | 'derive'
  | 'predict'
  | 'interrogate'
  | 'formalize'
  | 'transfer';

export type SourceAnchor = {
  id: string;
  locator: string;
  requires: Requirement[];
  items: string[];
  modes: SourceMode[];
};

export type SourcePack = {
  id: string;
  title: { en: string; fr: string };
  citation: string;
  routes: string[];
  anchors: SourceAnchor[];
};

export type ConceptCapabilityStat = {
  attempts: number;
  cleanPasses: number;
  transferPasses: number;
  recentErrors: string[];
  lastSeenAt?: string;
};

export type RouteProgress = {
  currentStepId?: string;
  depthByStep?: Record<string, RouteDepth>;
  seenItems?: string[];
};

export function evidenceKey(concept: ConceptId, capability: Capability): string {
  return `${concept}:${capability}`;
}

export function parseEvidenceKey(
  key: string,
): { concept: ConceptId; capability: Capability } | undefined {
  const separator = key.lastIndexOf(':');
  if (separator <= 0 || separator === key.length - 1) {
    return undefined;
  }
  const concept = key.slice(0, separator);
  const capability = key.slice(separator + 1);
  if (!CAPABILITIES.includes(capability as Capability)) {
    return undefined;
  }
  return { concept, capability: capability as Capability };
}

export function emptyConceptStat(): ConceptCapabilityStat {
  return {
    attempts: 0,
    cleanPasses: 0,
    transferPasses: 0,
    recentErrors: [],
  };
}
