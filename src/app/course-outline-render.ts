import type { Locale } from '../i18n';
import { getLessonCopy, learnUi, progressUi } from '../i18n';
import { conceptLabel } from './prerequisites';
import {
  buildCourseOutline,
  type CourseOutlineLesson,
  type CourseOutlineUnit,
  type OutlineLessonStatus,
} from './course-outline';
import type { ProgressStore } from './storage';

function unitTitle(locale: Locale, unit: 0 | 1 | 2): string {
  const learn = learnUi(locale);
  if (unit === 0) return learn.level0Title;
  if (unit === 1) return learn.level1Title;
  return learn.level2Title;
}

function lessonStatusLabel(
  copy: ReturnType<typeof progressUi>,
  status: OutlineLessonStatus,
): string {
  if (status === 'done') return copy.lessonDone;
  if (status === 'here') return copy.youAreHere;
  if (status === 'upcoming') return copy.lessonUpcoming;
  return copy.exerciseLocked;
}

function renderLesson(
  locale: Locale,
  copy: ReturnType<typeof progressUi>,
  lesson: CourseOutlineLesson,
  waitingOn?: string,
): string {
  const title = getLessonCopy(locale, lesson.id).title;
  const status = lessonStatusLabel(copy, lesson.status);
  const waiting =
    lesson.status === 'locked' && waitingOn ? `, ${copy.waitingOn(waitingOn)}` : '';
  const here =
    lesson.status === 'here'
      ? `<span class="course-outline-here-marker">${copy.youAreHere}</span>`
      : `<span class="progress-item-status" aria-hidden="true">${status}</span>`;
  const testId =
    lesson.status === 'here' ? ' data-testid="course-outline-here"' : '';
  return `
    <li
      class="progress-item course-outline-lesson${lesson.status === 'done' ? ' done' : ''}${lesson.status === 'here' ? ' is-here' : ''}"
      data-lesson-id="${lesson.id}"
      data-status="${lesson.status}"
      ${testId}
      aria-label="${copy.progressItemAria(title, `${status}${waiting}`)}"
    >
      <span class="progress-item-label">${title}</span>
      ${here}
    </li>
  `;
}

function renderUnit(locale: Locale, copy: ReturnType<typeof progressUi>, unit: CourseOutlineUnit): string {
  const title = unitTitle(locale, unit.unit);
  const waitingTitle =
    unit.waitingOnUnit === undefined ? undefined : unitTitle(locale, unit.waitingOnUnit);
  const waitingLine =
    unit.status === 'locked' && waitingTitle
      ? `<p class="course-outline-waiting">${copy.waitingOn(waitingTitle)}</p>`
      : '';
  const currentAttr = unit.current ? ` aria-current="true"` : '';
  const currentLabel = unit.current
    ? ` <span class="sr-only">${copy.currentUnitAria}</span>`
    : '';
  const concepts = unit.concepts
    .map((group) => {
      const concept = conceptLabel(locale, group.conceptId);
      const lessons = group.lessons
        .map((lesson) => renderLesson(locale, copy, lesson, waitingTitle))
        .join('');
      return `
        <li class="course-outline-concept" data-concept-id="${group.conceptId}">
          <h4 class="course-outline-concept-title">${concept}</h4>
          <ul class="progress-list course-outline-lessons">${lessons}</ul>
        </li>
      `;
    })
    .join('');

  return `
    <section
      class="course-outline-unit course-outline-unit-${unit.status}"
      data-testid="course-outline-unit-${unit.unit}"
      data-unit="${unit.unit}"
      data-status="${unit.status}"
      ${currentAttr}
      aria-labelledby="course-outline-unit-${unit.unit}-heading"
    >
      <header class="course-outline-unit-header">
        <h3 class="course-outline-unit-title" id="course-outline-unit-${unit.unit}-heading">${title}${currentLabel}</h3>
        <p class="course-outline-unit-count">${copy.lessonsStatus(unit.done, unit.total)}</p>
      </header>
      ${waitingLine}
      <ol class="course-outline-concepts">${concepts}</ol>
    </section>
  `;
}

export function renderCourseOutline(locale: Locale, store: ProgressStore): string {
  const copy = progressUi(locale);
  const outline = buildCourseOutline(store);
  const units = outline.map((unit) => renderUnit(locale, copy, unit)).join('');
  return `
    <section class="progress-card course-outline" data-testid="course-outline" aria-labelledby="course-outline-heading">
      <h2 class="panel-title" id="course-outline-heading">${copy.outlineHeading}</h2>
      ${units}
    </section>
  `;
}
