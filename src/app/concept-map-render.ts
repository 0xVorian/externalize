import type { Locale } from '../i18n';
import { getLessonCopy } from '../i18n';
import type { ProgressStore } from './storage';
import {
  conceptLabel,
  conceptPrerequisites,
  orderedConcepts,
  requiredLessonsForExercise,
  PREREQUISITES_GRAPH,
} from './prerequisites';
import { PRACTICE_UNLOCK_ORDER } from './lessons';

type ConceptMapUiCopy = {
  heading: string;
  hint: string;
  lessonColumn: string;
  exerciseColumn: string;
  ready: string;
  blocked: string;
  noPrerequisites: string;
};

const CONCEPT_MAP_UI: Record<Locale, ConceptMapUiCopy> = {
  en: {
    heading: 'Concept map',
    hint: 'Concepts build on one another; exercises unlock after the listed course sections.',
    lessonColumn: 'Course sections',
    exerciseColumn: 'Exercises',
    ready: 'ready',
    blocked: 'needs sections',
    noPrerequisites: 'No prior concepts',
  },
  fr: {
    heading: 'Carte des concepts',
    hint: "Les concepts s'enchaînent ; les exercices s'ouvrent après les sections indiquées.",
    lessonColumn: 'Sections du cours',
    exerciseColumn: 'Exercices',
    ready: 'prêt',
    blocked: 'sections requises',
    noPrerequisites: 'Aucun prérequis',
  },
};

function lessonTitle(locale: Locale, lessonId: string): string {
  return getLessonCopy(locale, lessonId).title;
}

function isLessonDone(store: ProgressStore, lessonId: string): boolean {
  return store.lessonsCompleted.includes(lessonId);
}

function exerciseReady(store: ProgressStore, exerciseId: string): boolean {
  return requiredLessonsForExercise(exerciseId).every((id) => isLessonDone(store, id));
}

function renderConceptRow(
  locale: Locale,
  copy: ConceptMapUiCopy,
  store: ProgressStore,
  conceptId: string,
): string {
  const reqs = conceptPrerequisites(conceptId);
  const reqLabels =
    reqs.length === 0 ? copy.noPrerequisites : reqs.map((id) => conceptLabel(locale, id)).join(', ');
  const lessonItems = PREREQUISITES_GRAPH.lessons
    .filter((lesson) => lesson.concept === conceptId)
    .map((lesson) => {
      const done = isLessonDone(store, lesson.id);
      return `<li class="concept-map-lesson ${done ? 'done' : ''}">${lessonTitle(locale, lesson.id)}</li>`;
    })
    .join('');
  const exerciseItems =
    PREREQUISITES_GRAPH.exercises
      .filter((exercise) => exercise.concept === conceptId)
      .map((exercise) => {
        const ready = exerciseReady(store, exercise.id);
        const done = store.completed.includes(exercise.id);
        const status = done ? '✓' : ready ? copy.ready : copy.blocked;
        return `<li class="concept-map-exercise ${done ? 'done' : ''} ${ready ? 'ready' : 'blocked'}"><span>${exercise.id}</span><span class="concept-map-status">${status}</span></li>`;
      })
      .join('') || '<li class="concept-map-muted">—</li>';

  return `
    <article class="concept-map-row">
      <h3 class="concept-map-title">${conceptLabel(locale, conceptId)}</h3>
      <p class="concept-map-reqs">${reqLabels}</p>
      <div class="concept-map-columns">
        <div>
          <h4 class="concept-map-col-title">${copy.lessonColumn}</h4>
          <ul class="concept-map-lessons">${lessonItems}</ul>
        </div>
        <div>
          <h4 class="concept-map-col-title">${copy.exerciseColumn}</h4>
          <ul class="concept-map-exercises">${exerciseItems}</ul>
        </div>
      </div>
    </article>`;
}

export function renderConceptMap(locale: Locale, store: ProgressStore): string {
  const copy = CONCEPT_MAP_UI[locale];
  const rows = orderedConcepts().map((c) => renderConceptRow(locale, copy, store, c.id)).join('');
  return `
    <section class="progress-card concept-map-card">
      <h2 class="panel-title">${copy.heading}</h2>
      <p class="progress-meta">${copy.hint}</p>
      <div class="concept-map">${rows}</div>
    </section>`;
}

export function renderExercisePrerequisiteList(locale: Locale, store: ProgressStore): string {
  const copy = CONCEPT_MAP_UI[locale];
  if (!store.level0Complete) return '';

  const blocked = PRACTICE_UNLOCK_ORDER.filter(
    (id) => !store.completed.includes(id) && !exerciseReady(store, id),
  ).slice(0, 5);
  if (blocked.length === 0) return '';

  const items = blocked
    .map((exerciseId) => {
      const pending = requiredLessonsForExercise(exerciseId).filter((id) => !isLessonDone(store, id));
      const labels = pending.map((id) => lessonTitle(locale, id)).join(', ');
      return `<li><strong>${exerciseId}</strong> — ${labels || copy.ready}</li>`;
    })
    .join('');

  return `
    <section class="progress-card">
      <h2 class="panel-title">${locale === 'fr' ? 'Prochains exercices' : 'Up next'}</h2>
      <p class="progress-meta">${copy.hint}</p>
      <ul class="progress-stats">${items}</ul>
    </section>`;
}
