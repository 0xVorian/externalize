import type { Locale } from '../i18n';
import { getLessonCopy, learnUi, progressUi } from '../i18n';
import { conceptLabel } from './prerequisites';
import {
  buildCourseOutline,
  splitCurrentUnitGroups,
  type CourseOutlineConceptGroup,
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

/** True when the lesson title repeats the concept name, including `Name (symbol)`. */
export function lessonTitleMatchesConcept(concept: string, lessonTitle: string): boolean {
  const conceptName = concept.trim().toLowerCase();
  const title = lessonTitle.trim().toLowerCase();
  return conceptName === title || conceptName.startsWith(`${title} (`);
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
      ? `<span class="course-outline-here-marker" aria-hidden="true">${copy.youAreHere}</span>`
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

function renderConceptGroup(
  locale: Locale,
  copy: ReturnType<typeof progressUi>,
  group: CourseOutlineConceptGroup,
  waitingOn?: string,
): string {
  const concept = conceptLabel(locale, group.conceptId);
  const first = group.lessons[0];
  const firstTitle = first ? getLessonCopy(locale, first.id).title : '';
  const skipHeading = Boolean(first && lessonTitleMatchesConcept(concept, firstTitle));
  const lessons = group.lessons
    .map((lesson) => renderLesson(locale, copy, lesson, waitingOn))
    .join('');
  const heading = skipHeading
    ? ''
    : `<h4 class="course-outline-concept-title">${concept}</h4>`;

  return `
    <li class="course-outline-concept" data-concept-id="${group.conceptId}">
      ${heading}
      <ul class="progress-list course-outline-lessons">${lessons}</ul>
    </li>
  `;
}

function renderConceptList(
  locale: Locale,
  copy: ReturnType<typeof progressUi>,
  groups: CourseOutlineConceptGroup[],
  waitingOn?: string,
): string {
  const items = groups
    .map((group) => renderConceptGroup(locale, copy, group, waitingOn))
    .join('');
  return `<ol class="course-outline-concepts">${items}</ol>`;
}

function renderCollapsedLessons(summary: string, body: string, testId: string): string {
  return `<details class="course-outline-details" data-testid="${testId}"><summary>${summary}</summary>${body}</details>`;
}

function renderUnit(locale: Locale, copy: ReturnType<typeof progressUi>, unit: CourseOutlineUnit): string {
  const title = unitTitle(locale, unit.unit);
  const waitingTitle =
    unit.waitingOnUnit === undefined ? undefined : unitTitle(locale, unit.waitingOnUnit);
  const countLine =
    unit.status === 'locked' && waitingTitle
      ? `${copy.lessonsStatus(unit.done, unit.total)} · ${copy.waitingOn(waitingTitle)}`
      : copy.lessonsStatus(unit.done, unit.total);
  const currentAttr = unit.current ? ` aria-current="true"` : '';
  const currentLabel = unit.current
    ? ` <span class="sr-only">${copy.currentUnitAria}</span>`
    : '';

  let body: string;
  if (unit.status === 'current') {
    const split = splitCurrentUnitGroups(unit);
    const doneBlock =
      split.doneCount > 0
        ? renderCollapsedLessons(
            copy.doneLessonsSummary(split.doneCount),
            renderConceptList(locale, copy, split.doneGroups, waitingTitle),
            'course-outline-done-lessons',
          )
        : '';
    const remainingBlock =
      split.remainingCount > 0
        ? renderCollapsedLessons(
            copy.remainingLessonsSummary(split.remainingCount),
            renderConceptList(locale, copy, split.remainingGroups, waitingTitle),
            'course-outline-remaining-lessons',
          )
        : '';
    body = `${doneBlock}${renderConceptList(locale, copy, split.visibleGroups, waitingTitle)}${remainingBlock}`;
  } else {
    const conceptsList = renderConceptList(locale, copy, unit.concepts, waitingTitle);
    body = renderCollapsedLessons(
      copy.showLessons,
      conceptsList,
      `course-outline-unit-${unit.unit}-lessons`,
    );
  }

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
        <p class="course-outline-unit-count">${countLine}</p>
      </header>
      ${body}
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
