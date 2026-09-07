import extraConcepts from '../../content/concepts-extra.json';
import { PREREQUISITES_GRAPH } from './prerequisites';
import type { ConceptDefinition, ConceptId } from './curriculum';

export type { ConceptDefinition, ConceptId };

const EXTRA_CONCEPTS = extraConcepts.concepts as ConceptDefinition[];

export function canonicalConcepts(): ConceptDefinition[] {
  const fromGraph = PREREQUISITES_GRAPH.concepts.map((concept) => ({
    id: concept.id,
    requires: concept.requires,
    label: concept.label,
  }));
  const seen = new Set(fromGraph.map((concept) => concept.id));
  const extras = EXTRA_CONCEPTS.filter((concept) => !seen.has(concept.id));
  return [...fromGraph, ...extras];
}

export function getConcept(id: ConceptId): ConceptDefinition | undefined {
  return canonicalConcepts().find((concept) => concept.id === id);
}

export function isCanonicalConcept(id: string): boolean {
  return canonicalConcepts().some((concept) => concept.id === id);
}
