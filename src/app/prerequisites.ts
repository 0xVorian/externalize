import graph from '../../content/prerequisites.json';
import type { Locale } from '../i18n';

export type PrerequisitesGraph = typeof graph;
export type ConceptNode = PrerequisitesGraph['concepts'][number];
export const PREREQUISITES_GRAPH: PrerequisitesGraph = graph;

export function conceptLabel(locale: Locale, conceptId: string): string {
  const concept = PREREQUISITES_GRAPH.concepts.find((entry) => entry.id === conceptId);
  return concept?.label[locale] ?? conceptId;
}

export function conceptForLesson(lessonId: string): string | undefined {
  return PREREQUISITES_GRAPH.lessons.find((lesson) => lesson.id === lessonId)?.concept;
}

export function requiredLessonsForExercise(exerciseId: string): string[] {
  return PREREQUISITES_GRAPH.exercises.find((entry) => entry.id === exerciseId)?.requiresLessons ?? [];
}

export function conceptPrerequisites(conceptId: string): string[] {
  return PREREQUISITES_GRAPH.concepts.find((entry) => entry.id === conceptId)?.requires ?? [];
}

export function orderedConcepts(): ConceptNode[] {
  const byId = new Map(PREREQUISITES_GRAPH.concepts.map((concept) => [concept.id, concept]));
  const visited = new Set<string>();
  const ordered: ConceptNode[] = [];

  function visit(id: string): void {
    if (visited.has(id)) return;
    visited.add(id);
    const concept = byId.get(id);
    if (!concept) return;
    for (const req of concept.requires ?? []) visit(req);
    ordered.push(concept);
  }

  for (const concept of PREREQUISITES_GRAPH.concepts) visit(concept.id);
  return ordered;
}
