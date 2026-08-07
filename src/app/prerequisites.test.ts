import { describe, expect, it } from 'vitest';
import { EXERCISE_DEFINITIONS } from './exercises';
import { PRACTICE_UNLOCK_ORDER } from './lessons';
import {
  PREREQUISITES_GRAPH,
  conceptForLesson,
  orderedConcepts,
  requiredLessonsForExercise,
} from './prerequisites';
import { renderConceptMap } from './concept-map-render';
import { loadProgress } from './storage';

describe('prerequisites graph', () => {
  it('covers every lesson and exercise', () => {
    for (const lesson of PREREQUISITES_GRAPH.lessons) {
      expect(conceptForLesson(lesson.id), lesson.id).toBeTruthy();
    }
    for (const exercise of EXERCISE_DEFINITIONS) {
      expect(requiredLessonsForExercise(exercise.id).length, exercise.id).toBeGreaterThan(0);
    }
  });

  it('orders concepts without cycles', () => {
    const ordered = orderedConcepts();
    expect(ordered.length).toBe(PREREQUISITES_GRAPH.concepts.length);
    const index = new Map(ordered.map((concept, i) => [concept.id, i]));
    for (const concept of PREREQUISITES_GRAPH.concepts) {
      for (const req of concept.requires ?? []) {
        expect(index.get(req)!).toBeLessThan(index.get(concept.id)!);
      }
    }
  });

  it('maps practice unlock order exercises', () => {
    for (const id of PRACTICE_UNLOCK_ORDER) {
      expect(requiredLessonsForExercise(id).length).toBeGreaterThan(0);
    }
  });
});

describe('concept map render', () => {
  it('renders concept map section', () => {
    const html = renderConceptMap('en', loadProgress());
    expect(html).toContain('Concept map');
    expect(html).toContain('Conjunction');
  });
});
