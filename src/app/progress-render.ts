import type { Locale } from '../i18n';
import { progressUi, formatResumeTime, getLessonCopy } from '../i18n';
import {
  LEVEL_0_LESSONS,
  LEVEL_1_LESSONS,
  LEVEL_2_LESSONS,
  LEVEL_0_PRACTICE_UNLOCK_ORDER,
  LEVEL_1_PRACTICE_UNLOCK_ORDER,
  LEVEL_2_PRACTICE_UNLOCK_ORDER,
} from './lessons';
import { buildProgressSummary, type ProgressSummary } from './progress-tracker';
import type { ProgressStore } from './storage';
import { countReviewDue, getUnlockedExerciseIds, exerciseLockReason } from './storage';
import { renderShellHeader } from './shell-render';
import { learnUi } from '../i18n';
import { renderConceptMap } from './concept-map-render';
import { computeWhatNext } from './what-next';
import { exerciseLabel } from './exercise-label';

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
      const done = store.passed.includes(id);
      const attempted = store.attempted.includes(id);
      const reason = exerciseLockReason(store, id);
      const locked = !unlocked.has(id);
      const status = done
        ? copy.exerciseDone
        : attempted
          ? copy.exerciseAttempted
        : reason === 'unit1'
          ? copy.exerciseLockedUnit1
          : reason === 'unit2'
            ? copy.exerciseLockedUnit2
            : locked
            ? copy.exerciseLocked
            : copy.lessonTodo;
      return renderListItem(locale, exerciseLabel(locale, id), status, done);
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
  const level2Done = LEVEL_2_LESSONS.filter((lesson) =>
    store.lessonsCompleted.includes(lesson.id),
  ).length;
  return buildProgressSummary({
    level0Done,
    level0Total: LEVEL_0_LESSONS.length,
    level1Done,
    level1Total: LEVEL_1_LESSONS.length,
    level2Done,
    level2Total: LEVEL_2_LESSONS.length,
    lessonsCompleted: store.lessonsCompleted,
    exercisesUnlocked: getUnlockedExerciseIds(store),
    exercisesCompleted: store.passed,
    reviewDue: countReviewDue(store),
    resume: store.resume,
    skills: store.skills,
    errorCounts: store.errorCounts,
  });
}

export type ProgressViewOptions = {
  importNotice?: { kind: 'success' | 'error'; message: string };
};

function renderDisclosure(
  title: string,
  summary: string,
  body: string,
  labelledBy?: string,
): string {
  return `
    <details class="progress-card progress-disclosure"${labelledBy ? ` aria-labelledby="${labelledBy}"` : ''}>
      <summary>
        <span class="panel-title"${labelledBy ? ` id="${labelledBy}"` : ''}>${title}</span>
        <span class="progress-summary-meta">${summary}</span>
      </summary>
      <div class="progress-disclosure-body">${body}</div>
    </details>
  `;
}

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
  const learn = learnUi(locale);
  const currentUnit =
    !store.level0Complete
      ? { title: learn.level0Title, done: summary.level0Done, total: summary.level0Total }
      : !store.level1Complete
        ? { title: learn.level1Title, done: summary.level1Done, total: summary.level1Total }
        : { title: learn.level2Title, done: summary.level2Done, total: summary.level2Total };

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
      ? renderDisclosure(
        learn.level1Title,
        copy.level0Status(
          LEVEL_1_LESSONS.filter((l) => store.lessonsCompleted.includes(l.id)).length,
          LEVEL_1_LESSONS.length,
        ),
        `<ul class="progress-list">${level1Items}</ul>`,
        'progress-level1-heading',
      )
      : '';

  const level2Items =
    store.level1Complete
      ? LEVEL_2_LESSONS.map((lesson) => {
          const title = getLessonCopy(locale, lesson.id).title;
          const done = store.lessonsCompleted.includes(lesson.id);
          return renderListItem(locale, title, done ? copy.lessonDone : copy.lessonTodo, done);
        }).join('')
      : '';

  const level2Section =
    store.level1Complete && level2Items
      ? renderDisclosure(
        learn.level2Title,
        copy.level0Status(summary.level2Done, summary.level2Total),
        `<ul class="progress-list">${level2Items}</ul>`,
      )
      : '';

  const unit0ExerciseItems = practiceUnlocked
    ? renderExerciseTier(locale, store, copy, LEVEL_0_PRACTICE_UNLOCK_ORDER)
    : '';
  const unit1ExerciseItems = practiceUnlocked
    ? renderExerciseTier(locale, store, copy, LEVEL_1_PRACTICE_UNLOCK_ORDER)
    : '';
  const unit2ExerciseItems = practiceUnlocked
    ? renderExerciseTier(locale, store, copy, LEVEL_2_PRACTICE_UNLOCK_ORDER)
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
    ? renderDisclosure(
      copy.exercisesHeading,
      copy.exercisesStatus(store.passed.length, summary.exercisesUnlocked.length),
      `
        ${summary.reviewDue > 0 ? `<p class="progress-meta review-due">${copy.reviewDue(summary.reviewDue)}</p>` : ''}
        <h3 class="progress-subheading">${copy.level0ExercisesHeading}</h3>
        <ul class="progress-list">${unit0ExerciseItems}</ul>
        <h3 class="progress-subheading">${copy.level1ExercisesHeading}</h3>
        <ul class="progress-list">${unit1ExerciseItems}</ul>
        <h3 class="progress-subheading">${copy.level2ExercisesHeading}</h3>
        <ul class="progress-list">${unit2ExerciseItems}</ul>
      `,
      'progress-exercises-heading',
    )
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

      <section class="progress-card progress-overview" aria-labelledby="progress-overview-heading">
        <h2 class="panel-title" id="progress-overview-heading">${currentUnit.title}</h2>
        <p class="progress-meta">${copy.level0Status(currentUnit.done, currentUnit.total)}</p>
        ${practiceUnlocked ? `<p class="progress-meta">${copy.exercisesStatus(store.passed.length, summary.exercisesUnlocked.length)}</p>` : ''}
        ${summary.reviewDue > 0 ? `<p class="progress-meta review-due">${copy.reviewDue(summary.reviewDue)}</p>` : ''}
      </section>

      ${renderDisclosure(
        copy.syncHeading,
        copy.syncHint,
        `
        ${
          options.importNotice
            ? `<p class="progress-notice progress-notice-${options.importNotice.kind}" role="status">${options.importNotice.message}</p>`
            : ''
        }
        <div class="progress-actions">
          <button type="button" class="secondary" data-action="export-progress">${copy.exportProgress}</button>
          <button type="button" class="secondary" data-action="import-progress">${copy.importProgress}</button>
        </div>
        `,
      )}

      ${renderDisclosure(
        copy.level0Heading,
        copy.level0Status(summary.level0Done, summary.level0Total),
        `<ul class="progress-list">${lessonItems.join('')}</ul>`,
        'progress-level0-heading',
      )}

      ${level1Section}

      ${level2Section}

      ${exerciseSection}

      ${renderConceptMap(locale, store)}

      ${renderDisclosure(copy.strugglesHeading, summary.struggles.length ? `${summary.struggles.length}` : copy.strugglesEmpty, struggleItems)}
      ${renderDisclosure(copy.comfortableHeading, summary.comfortable.length ? `${summary.comfortable.length}` : copy.comfortableEmpty, comfortableItems)}
      ${renderDisclosure(copy.errorsHeading, summary.frequentErrors.length ? `${summary.frequentErrors.length}` : copy.errorsEmpty, errorItems)}
    </main>
  `;
}
