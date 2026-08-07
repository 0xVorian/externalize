import type { Locale } from '../i18n';
import { progressUi, formatResumeTime, getLessonCopy } from '../i18n';
import { LEVEL_0_LESSONS, PRACTICE_UNLOCK_ORDER } from './lessons';
import { buildProgressSummary, type ProgressSummary } from './progress-tracker';
import type { ProgressStore } from './storage';
import { countReviewDue, getUnlockedExerciseIds } from './storage';
import { renderShellHeader } from './shell-render';

function renderListItem(label: string, status: string, done: boolean): string {
  return `
    <li class="progress-item ${done ? 'done' : ''}">
      <span class="progress-item-label">${label}</span>
      <span class="progress-item-status">${status}</span>
    </li>
  `;
}

export function buildSummaryFromStore(store: ProgressStore): ProgressSummary {
  return buildProgressSummary({
    level0Total: LEVEL_0_LESSONS.length,
    lessonsCompleted: store.lessonsCompleted,
    exercisesUnlocked: getUnlockedExerciseIds(store),
    exercisesCompleted: store.completed,
    reviewDue: countReviewDue(store),
    resume: store.resume,
    skills: store.skills,
    errorCounts: store.errorCounts,
  });
}

export function renderProgressView(
  locale: Locale,
  store: ProgressStore,
  practiceUnlocked: boolean,
): string {
  const copy = progressUi(locale);
  const summary = buildSummaryFromStore(store);
  const resume = store.resume;

  const lessonItems = LEVEL_0_LESSONS.map((lesson) => {
    const title = getLessonCopy(locale, lesson.id).title;
    const done = store.lessonsCompleted.includes(lesson.id);
    return renderListItem(title, done ? copy.lessonDone : copy.lessonTodo, done);
  });

  const unlocked = new Set(summary.exercisesUnlocked);
  const exerciseItems = PRACTICE_UNLOCK_ORDER.map((id) => {
    const done = store.completed.includes(id);
    const locked = !unlocked.has(id);
    const status = done ? copy.exerciseDone : locked ? copy.exerciseLocked : copy.lessonTodo;
    return renderListItem(id, status, done);
  });

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

      <section class="progress-card continue-card">
        <h2 class="panel-title">${copy.continueTitle}</h2>
        <p class="progress-meta">${copy.lastSeen(formatResumeTime(locale, resume.updatedAt))}</p>
        <button type="button" class="primary" data-action="continue-resume">
          ${resume.mode === 'learn' ? copy.continueLearn : resume.mode === 'practice' ? copy.continuePractice : copy.continueProgress}
        </button>
      </section>

      <section class="progress-card">
        <h2 class="panel-title">${copy.level0Heading}</h2>
        <p class="progress-meta">${copy.level0Status(summary.level0Done, summary.level0Total)}</p>
        <ul class="progress-list">${lessonItems.join('')}</ul>
      </section>

      <section class="progress-card">
        <h2 class="panel-title">${copy.exercisesHeading}</h2>
        <p class="progress-meta">${copy.exercisesStatus(store.completed.length, summary.exercisesUnlocked.length)}</p>
        ${summary.reviewDue > 0 ? `<p class="progress-meta review-due">${copy.reviewDue(summary.reviewDue)}</p>` : ''}
        <ul class="progress-list">${exerciseItems.join('')}</ul>
      </section>

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
