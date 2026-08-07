import type { Locale } from '../i18n';
import { progressUi, formatResumeTime, getLessonCopy } from '../i18n';
import {
  LEVEL_0_LESSONS,
  LEVEL_1_LESSONS,
  LEVEL_0_PRACTICE_UNLOCK_ORDER,
  LEVEL_1_PRACTICE_UNLOCK_ORDER,
} from './lessons';
import { buildProgressSummary, type ProgressSummary } from './progress-tracker';
import type { ProgressStore } from './storage';
import { countReviewDue, getUnlockedExerciseIds, exerciseLockReason } from './storage';
import { renderShellHeader } from './shell-render';
import { learnUi } from '../i18n';
import { renderConceptMap } from './concept-map-render';
import { computeWhatNext } from './what-next';

function renderListItem(
  locale: Locale,
  label: string,
  status: string,
  done: boolean,
): string {
  const itemCopy = progressUi(locale);
  return `
    <li class="progress-item ${done ? 'done' : ''}" aria-label="${itemCopy.progressItemAria(label, status)}">
      <span class="progress-item-label">${label}</span>
      <span class="progress-item-status" aria-hidden="true">${status}</span>
    </li>
  `;
}

function renderExerciseTier(
  locale: Locale,
  store: ProgressStore,
  copy: ReturnType<typeof progressUi>,
  order: readonly string[],
): string {
  const unlocked = new Set(getUnlockedExerciseIds(store));
  return order
    .map((id) => {
      const done = store.completed.includes(id);
      const reason = exerciseLockReason(store, id);
      const locked = !unlocked.has(id);
      const status = done
        ? copy.exerciseDone
        : reason === 'unit1'
          ? copy.exerciseLockedUnit1
          : locked
            ? copy.exerciseLocked
            : copy.lessonTodo;
      return renderListItem(locale, id, status, done);
    })
    .join('');
}

export function buildSummaryFromStore(store: ProgressStore): ProgressSummary {
  const level0Done = LEVEL_0_LESSONS.filter((lesson) =>
    store.lessonsCompleted.includes(lesson.id),
  ).length;
  const level1Done = LEVEL_1_LESSONS.filter((lesson) =>
    store.lessonsCompleted.includes(lesson.id),
  ).length;
  return buildProgressSummary({
    level0Done,
    level0Total: LEVEL_0_LESSONS.length,
    level1Done,
    level1Total: LEVEL_1_LESSONS.length,
    lessonsCompleted: store.lessonsCompleted,
    exercisesUnlocked: getUnlockedExerciseIds(store),
    exercisesCompleted: store.completed,
    reviewDue: countReviewDue(store),
    resume: store.resume,
    skills: store.skills,
    errorCounts: store.errorCounts,
  });
}

export type ProgressViewOptions = {
  importNotice?: { kind: 'success' | 'error'; message: string };
};

export function renderProgressView(
  locale: Locale,
  store: ProgressStore,
  practiceUnlocked: boolean,
  options: ProgressViewOptions = {},
): string {
  const copy = progressUi(locale);
  const summary = buildSummaryFromStore(store);
  const resume = store.resume;
  const suggestion = computeWhatNext(locale, store, summary);

  const lessonItems = LEVEL_0_LESSONS.map((lesson) => {
    const title = getLessonCopy(locale, lesson.id).title;
    const done = store.lessonsCompleted.includes(lesson.id);
    return renderListItem(locale, title, done ? copy.lessonDone : copy.lessonTodo, done);
  });

  const level1Items =
    store.level0Complete
      ? LEVEL_1_LESSONS.map((lesson) => {
          const title = getLessonCopy(locale, lesson.id).title;
          const done = store.lessonsCompleted.includes(lesson.id);
          return renderListItem(locale, title, done ? copy.lessonDone : copy.lessonTodo, done);
        }).join('')
      : '';

  const level1Section =
    store.level0Complete && level1Items
      ? `
      <section class="progress-card" aria-labelledby="progress-level1-heading">
        <h2 class="panel-title" id="progress-level1-heading">${learnUi(locale).level1Title}</h2>
        <p class="progress-meta">${copy.level0Status(
          LEVEL_1_LESSONS.filter((l) => store.lessonsCompleted.includes(l.id)).length,
          LEVEL_1_LESSONS.length,
        )}</p>
        <ul class="progress-list">${level1Items}</ul>
      </section>`
      : '';

  const unit0ExerciseItems = practiceUnlocked
    ? renderExerciseTier(locale, store, copy, LEVEL_0_PRACTICE_UNLOCK_ORDER)
    : '';
  const unit1ExerciseItems = practiceUnlocked
    ? renderExerciseTier(locale, store, copy, LEVEL_1_PRACTICE_UNLOCK_ORDER)
    : '';

  const struggleItems =
    summary.struggles.length === 0
      ? `<p class="progress-empty">${copy.strugglesEmpty}</p>`
      : `<ul class="progress-stats">${summary.struggles
          .map(
            (s) =>
              `<li><strong>${copy.skillLabel(s.id)}</strong> — ${copy.rateLabel(s.rate, s.attempts)}</li>`,
          )
          .join('')}</ul>`;

  const comfortableItems =
    summary.comfortable.length === 0
      ? `<p class="progress-empty">${copy.comfortableEmpty}</p>`
      : `<ul class="progress-stats">${summary.comfortable
          .map(
            (s) =>
              `<li><strong>${copy.skillLabel(s.id)}</strong> — ${copy.rateLabel(s.rate, s.attempts)}</li>`,
          )
          .join('')}</ul>`;

  const errorItems =
    summary.frequentErrors.length === 0
      ? `<p class="progress-empty">${copy.errorsEmpty}</p>`
      : `<ul class="progress-stats">${summary.frequentErrors
          .map((e) => `<li>${copy.errorLabel(e.tag)} (${e.count}×)</li>`)
          .join('')}</ul>`;

  const exerciseSection = practiceUnlocked
    ? `
      <section class="progress-card" aria-labelledby="progress-exercises-heading">
        <h2 class="panel-title" id="progress-exercises-heading">${copy.exercisesHeading}</h2>
        <p class="progress-meta">${copy.exercisesStatus(store.completed.length, summary.exercisesUnlocked.length)}</p>
        ${summary.reviewDue > 0 ? `<p class="progress-meta review-due">${copy.reviewDue(summary.reviewDue)}</p>` : ''}
        <h3 class="progress-subheading">${copy.level0ExercisesHeading}</h3>
        <ul class="progress-list">${unit0ExerciseItems}</ul>
        <h3 class="progress-subheading">${copy.level1ExercisesHeading}</h3>
        <ul class="progress-list">${unit1ExerciseItems}</ul>
      </section>`
    : '';

  return `
    <main class="app" lang="${locale}">
      ${renderShellHeader({
        locale,
        mode: 'progress',
        practiceUnlocked,
        title: copy.progress,
        meta: copy.lastSeen(formatResumeTime(locale, store.lastVisitedAt)),
        referenceOpen: false,
      })}

      <section class="progress-card what-next-card" aria-labelledby="progress-what-next-heading">
        <h2 class="panel-title" id="progress-what-next-heading">${suggestion.title}</h2>
        <p class="what-next-detail">${suggestion.detail}</p>
        <p class="progress-meta">${copy.lastSeen(formatResumeTime(locale, resume.updatedAt))}</p>
        <button type="button" class="primary" data-action="${suggestion.action}" ${suggestion.exerciseId ? `data-exercise-id="${suggestion.exerciseId}"` : ''}>${suggestion.buttonLabel}</button>
      </section>

      <section class="progress-card">
        <h2 class="panel-title">${copy.syncHeading}</h2>
        <p class="progress-meta">${copy.syncHint}</p>
        ${
          options.importNotice
            ? `<p class="progress-notice progress-notice-${options.importNotice.kind}" role="status">${options.importNotice.message}</p>`
            : ''
        }
        <div class="progress-actions">
          <button type="button" class="secondary" data-action="export-progress">${copy.exportProgress}</button>
          <button type="button" class="secondary" data-action="import-progress">${copy.importProgress}</button>
        </div>
      </section>

      <section class="progress-card" aria-labelledby="progress-level0-heading">
        <h2 class="panel-title" id="progress-level0-heading">${copy.level0Heading}</h2>
        <p class="progress-meta">${copy.level0Status(summary.level0Done, summary.level0Total)}</p>
        <ul class="progress-list">${lessonItems.join('')}</ul>
      </section>

      ${level1Section}

      ${exerciseSection}

      ${renderConceptMap(locale, store)}

      <section class="progress-card">
        <h2 class="panel-title">${copy.strugglesHeading}</h2>
        ${struggleItems}
      </section>

      <section class="progress-card">
        <h2 class="panel-title">${copy.comfortableHeading}</h2>
        ${comfortableItems}
      </section>

      <section class="progress-card">
        <h2 class="panel-title">${copy.errorsHeading}</h2>
        ${errorItems}
      </section>
    </main>
  `;
}
