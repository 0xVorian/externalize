import type { Locale } from '../i18n';
import { progressUi, formatResumeTime, sessionUi, visibilityUi } from '../i18n';
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
import { renderAccountPanel, type AccountView } from './account-render';
import { countReviewDue, getUnlockedExerciseIds, exerciseLockReason } from './storage';
import { renderShellHeader } from './shell-render';
import { renderConceptMap } from './concept-map-render';
import { exerciseLabel } from './exercise-label';
import {
  deriveCapabilityStates,
  nextReadySkillId,
  type CapabilityState,
} from './progress-visibility';
import { TRACKED_SKILL_IDS, type SkillId } from './progress-tracker';
import { renderCourseOutline } from './course-outline-render';
import { openingTopic } from './opening-topic';
import { sessionPrimaryLabel } from './session-opening-render';
import { offerOpening, type OpeningOffer } from './session-plan';

function capabilityStateLabel(
  copy: ReturnType<typeof visibilityUi>,
  state: CapabilityState,
): string {
  if (state === 'consistent') return copy.stateConsistent;
  if (state === 'developing') return copy.stateDeveloping;
  if (state === 'ready') return copy.stateReady;
  return copy.stateLocked;
}

function renderCapabilityItems(
  locale: Locale,
  ids: SkillId[],
  states: Record<SkillId, CapabilityState>,
  empty: string,
): string {
  const progressCopy = progressUi(locale);
  const vis = visibilityUi(locale);
  if (ids.length === 0) {
    return `<p class="progress-empty">${empty}</p>`;
  }
  return `<ul class="capability-summary-list">${ids
    .map((id) => {
      const name = progressCopy.skillLabel(id);
      const state = capabilityStateLabel(vis, states[id]);
      return `<li><strong>${name}</strong> <span class="capability-chip">${state}</span></li>`;
    })
    .join('')}</ul>`;
}

function renderCapabilitySummary(
  locale: Locale,
  store: ProgressStore,
): string {
  const vis = visibilityUi(locale);
  const progressCopy = progressUi(locale);
  const states = deriveCapabilityStates(store, getUnlockedExerciseIds(store));
  const consistent = TRACKED_SKILL_IDS.filter((id) => states[id] === 'consistent');
  const developing = TRACKED_SKILL_IDS.filter((id) => states[id] === 'developing');
  const readyId = nextReadySkillId(states);
  const upNextBody = readyId
    ? `<ul class="capability-summary-list"><li><strong>${progressCopy.skillLabel(readyId)}</strong> <span class="capability-chip">${vis.stateReady}</span></li></ul>`
    : `<p class="progress-empty">${vis.upNextEmpty}</p>`;

  return `
    <section class="progress-card capability-summary" data-testid="capability-summary" aria-labelledby="capability-summary-heading">
      <h2 class="panel-title" id="capability-summary-heading">${vis.youCanNowHeading}</h2>
      ${renderCapabilityItems(locale, consistent, states, vis.youCanNowEmpty)}
      <h3 class="progress-subheading">${vis.inProgressHeading}</h3>
      ${renderCapabilityItems(locale, developing, states, vis.inProgressEmpty)}
      <h3 class="progress-subheading">${vis.upNextHeading}</h3>
      ${upNextBody}
    </section>
  `;
}

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
): { items: string; lockedCount: number } {
  const unlocked = new Set(getUnlockedExerciseIds(store));
  let lockedCount = 0;
  const items = order
    .map((id) => {
      const done = store.passed.includes(id);
      const attempted = store.attempted.includes(id);
      const reason = exerciseLockReason(store, id);
      const locked = !unlocked.has(id);
      if (locked && !done && !attempted) {
        lockedCount += 1;
        return '';
      }
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
  return { items, lockedCount };
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
  account?: AccountView;
  offer?: OpeningOffer;
};

function renderDisclosure(
  title: string,
  summary: string,
  body: string,
  labelledBy?: string,
  open = false,
): string {
  return `
    <details class="progress-card progress-disclosure"${labelledBy ? ` aria-labelledby="${labelledBy}"` : ''}${open ? ' open' : ''}>
      <summary>
        <span class="panel-title" role="heading" aria-level="2"${labelledBy ? ` id="${labelledBy}"` : ''}>${title}</span>
        <span class="progress-summary-meta">${summary}</span>
      </summary>
      <div class="progress-disclosure-body">${body}</div>
    </details>
  `;
}

function renderProgressNextCard(
  locale: Locale,
  store: ProgressStore,
  offer: OpeningOffer,
): string {
  const copy = progressUi(locale);
  const session = sessionUi(locale);
  const lastSeen = `<p class="progress-meta">${copy.lastSeen(formatResumeTime(locale, store.lastVisitedAt))}</p>`;

  if (offer.kind === 'idle' || !offer.plan) {
    return `
      <section class="progress-card what-next-card" data-testid="progress-next" aria-labelledby="progress-what-next-heading">
        <h2 class="panel-title" id="progress-what-next-heading">${session.idleHeading}</h2>
        <p class="what-next-detail">${session.idleBody}</p>
        ${lastSeen}
      </section>
    `;
  }

  const detail = offer.plan.preparation ? session.preparationDetail : session.detail(offer.kind);
  const topic = openingTopic(locale, offer);
  const topicLine = topic
    ? `<p class="session-topic" data-testid="opening-topic">${topic}</p>`
    : '';
  return `
    <section class="progress-card what-next-card" data-testid="progress-next" aria-labelledby="progress-what-next-heading">
      <h2 class="panel-title" id="progress-what-next-heading">${session.heading(offer.kind)}</h2>
      ${topicLine}
      <p class="what-next-detail">${detail}</p>
      <p class="session-effort" data-testid="opening-effort">${session.effort(offer.plan.steps.length, offer.plan.estimatedMinutes)}</p>
      ${lastSeen}
      <button
        type="button"
        class="primary"
        data-action="session-begin"
        data-testid="progress-session-begin"
        aria-label="${session.primaryAria(offer.kind)}"
      >${sessionPrimaryLabel(locale, offer.kind)}</button>
    </section>
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
  const offer = options.offer ?? offerOpening(store, null);

  const unit0Exercises = practiceUnlocked
    ? renderExerciseTier(locale, store, copy, LEVEL_0_PRACTICE_UNLOCK_ORDER)
    : { items: '', lockedCount: 0 };
  const unit1Exercises = practiceUnlocked
    ? renderExerciseTier(locale, store, copy, LEVEL_1_PRACTICE_UNLOCK_ORDER)
    : { items: '', lockedCount: 0 };
  const unit2Exercises = practiceUnlocked
    ? renderExerciseTier(locale, store, copy, LEVEL_2_PRACTICE_UNLOCK_ORDER)
    : { items: '', lockedCount: 0 };
  const laterCount =
    unit0Exercises.lockedCount + unit1Exercises.lockedCount + unit2Exercises.lockedCount;

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

  const laterLine =
    laterCount > 0 ? `<p class="progress-meta">${copy.exercisesLater(laterCount)}</p>` : '';

  const exerciseSection = practiceUnlocked
    ? renderDisclosure(
      copy.exercisesHeading,
      copy.exercisesStatus(store.passed.length, summary.exercisesUnlocked.length),
      `
        ${summary.reviewDue > 0 ? `<p class="progress-meta review-due">${copy.reviewDue(summary.reviewDue)}</p>` : ''}
        ${laterLine}
        <h3 class="progress-subheading">${copy.level0ExercisesHeading}</h3>
        <ul class="progress-list">${unit0Exercises.items}</ul>
        <h3 class="progress-subheading">${copy.level1ExercisesHeading}</h3>
        <ul class="progress-list">${unit1Exercises.items}</ul>
        <h3 class="progress-subheading">${copy.level2ExercisesHeading}</h3>
        <ul class="progress-list">${unit2Exercises.items}</ul>
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

      ${renderProgressNextCard(locale, store, offer)}

      ${renderCourseOutline(locale, store)}

      ${renderConceptMap(locale, store)}

      ${renderCapabilitySummary(locale, store)}

      ${renderDisclosure(
        copy.syncHeading,
        copy.syncHint,
        `
        ${
          options.importNotice
            ? `<p class="progress-notice progress-notice-${options.importNotice.kind}" role="status">${options.importNotice.message}</p>`
            : ''
        }
        ${options.account ? renderAccountPanel(locale, options.account) : ''}
        <div class="progress-actions">
          <button type="button" class="secondary" data-action="export-progress">${copy.exportProgress}</button>
          <button type="button" class="secondary" data-action="import-progress">${copy.importProgress}</button>
        </div>
        `,
        undefined,
        Boolean(
          options.importNotice ||
            options.account?.notice ||
            options.account?.confirmDelete ||
            options.account?.busy,
        ),
      )}

      ${exerciseSection}

      ${renderDisclosure(copy.strugglesHeading, summary.struggles.length ? `${summary.struggles.length}` : copy.strugglesEmpty, struggleItems)}
      ${renderDisclosure(copy.comfortableHeading, summary.comfortable.length ? `${summary.comfortable.length}` : copy.comfortableEmpty, comfortableItems)}
      ${renderDisclosure(copy.errorsHeading, summary.frequentErrors.length ? `${summary.frequentErrors.length}` : copy.errorsEmpty, errorItems)}
    </main>
  `;
}
