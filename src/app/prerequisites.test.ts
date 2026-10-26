import { describe, expect, it } from 'vitest';
import { EXERCISE_DEFINITIONS } from './exercises';
import {
  ALL_LEARN_LESSONS,
  LEVEL_0_LESSONS,
  LEVEL_1_LESSONS,
  PRACTICE_UNLOCK_ORDER,
} from './lessons';
import {
  PREREQUISITES_GRAPH,
  conceptForExercise,
  conceptForLesson,
  orderedConcepts,
  requiredLessonsForExercise,
} from './prerequisites';
import {
  conceptStatus,
  isConceptCompleted,
  renderConceptMap,
} from './concept-map-render';
import { SOURCE_LESSONS, isSourceLessonId } from './source-lessons';
import { completeLesson, loadProgress } from './storage';

function completeIds(ids: readonly string[]) {
  let store = loadProgress();
  for (const id of ids) {
    store = completeLesson(store, id);
  }
  return store;
}

function conceptStatuses(store: ReturnType<typeof loadProgress>) {
  return Object.fromEntries(
    PREREQUISITES_GRAPH.concepts.map((concept) => [concept.id, conceptStatus(store, concept.id)]),
  );
}

describe('prerequisites graph', () => {
  it('maps every card, watch, and guided unit to a concept', () => {
    const units = [...ALL_LEARN_LESSONS, ...SOURCE_LESSONS];
    expect(units.length).toBeGreaterThan(0);
    for (const lesson of units) {
      expect(['card', 'watch', 'guided']).toContain(lesson.type);
      expect(conceptForLesson(lesson.id), lesson.id).toBeTruthy();
    }
  });

  it('maps every exercise to a concept and required lessons', () => {
    for (const exercise of EXERCISE_DEFINITIONS) {
      expect(conceptForExercise(exercise.id), exercise.id).toBeTruthy();
      expect(requiredLessonsForExercise(exercise.id).length, exercise.id).toBeGreaterThan(0);
    }
  });

  it('clusters Unit 1 nesting explanation with its guided practice', () => {
    expect(conceptForLesson('level1-13-nesting')).toBe('scope');
    expect(conceptForLesson('level1-14-nesting-guided')).toBe('scope');
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
  it('renders SVG graph with concept nodes and edges', () => {
    const store = loadProgress();
    const html = renderConceptMap('en', store);
    expect(html).toContain('Concept map');
    expect(html).toContain('<svg');
    expect(html).toContain('concept-map-edge');
    expect(html).toContain('data-concept-id="conjunction"');
    expect(html).toContain('Conjunction');
  });

  it('marks root concept available on fresh progress', () => {
    const store = loadProgress();
    expect(conceptStatus(store, 'proposition')).toBe('available');
    expect(isConceptCompleted(store, 'proposition')).toBe(false);
  });

  it('uses French labels', () => {
    const html = renderConceptMap('fr', loadProgress());
    expect(html).toContain('Carte des concepts');
    expect(html).toContain('Conjonction');
  });

  it('includes the translation concept on the map', () => {
    const html = renderConceptMap('en', loadProgress());
    expect(PREREQUISITES_GRAPH.concepts.some((concept) => concept.id === 'translation')).toBe(
      true,
    );
    expect(html).toContain('data-concept-id="translation"');
    expect(html).toContain('Translation');
  });

  it('does not let optional lat-* lessons block main-route concept completion', () => {
    const latConditional = PREREQUISITES_GRAPH.lessons.filter(
      (lesson) => lesson.concept === 'conditional' && isSourceLessonId(lesson.id),
    );
    expect(latConditional.length).toBe(5);
    const store = completeIds([
      ...LEVEL_0_LESSONS.map((lesson) => lesson.id),
      ...LEVEL_1_LESSONS.map((lesson) => lesson.id),
    ]);
    expect(store.lessonsCompleted.some((id) => isSourceLessonId(id))).toBe(false);
    expect(isConceptCompleted(store, 'conditional')).toBe(true);
    expect(conceptStatus(store, 'conditional')).toBe('completed');
  });

  it('locks in concept-map statuses after Unit 0', () => {
    const store = completeIds(LEVEL_0_LESSONS.map((lesson) => lesson.id));
    expect(conceptStatuses(store)).toEqual({
      proposition: 'completed',
      'truth-values': 'completed',
      conjunction: 'completed',
      negation: 'available',
      disjunction: 'locked',
      conditional: 'locked',
      biconditional: 'locked',
      translation: 'locked',
      scope: 'locked',
      'double-negation': 'locked',
      precedence: 'locked',
      demorgan: 'locked',
    });
  });

  it('locks in concept-map statuses after Unit 1', () => {
    const store = completeIds([
      ...LEVEL_0_LESSONS.map((lesson) => lesson.id),
      ...LEVEL_1_LESSONS.map((lesson) => lesson.id),
    ]);
    expect(conceptStatuses(store)).toEqual({
      proposition: 'completed',
      'truth-values': 'completed',
      conjunction: 'completed',
      negation: 'completed',
      disjunction: 'completed',
      conditional: 'completed',
      biconditional: 'completed',
      translation: 'completed',
      scope: 'available',
      'double-negation': 'available',
      precedence: 'locked',
      demorgan: 'locked',
    });
  });
});
