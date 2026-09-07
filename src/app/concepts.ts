import { PREREQUISITES_GRAPH } from './prerequisites';
import type { ConceptDefinition, ConceptId } from './curriculum';

export type { ConceptDefinition, ConceptId };

export function canonicalConcepts(): ConceptDefinition[] {
  return PREREQUISITES_GRAPH.concepts.map((concept) => ({
    id: concept.id,
    requires: concept.requires,
    label: concept.label,
  }));
}

export function getConcept(id: ConceptId): ConceptDefinition | undefined {
  return canonicalConcepts().find((concept) => concept.id === id);
}

export function isCanonicalConcept(id: string): boolean {
  return PREREQUISITES_GRAPH.concepts.some((concept) => concept.id === id);
}
