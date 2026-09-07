import { learnUi, getLessonCopy, getExerciseCopy } from '../i18n';
import type { Locale } from '../i18n';
import { renderShellHeader } from './shell-render';
import { renderCardLesson } from './lesson-render';
import { renderClassifyChoiceActions, renderClassifyChoiceBody } from './classify-choice-render';
import type { LessonState } from './lesson-state';
import type { AppState } from './state';
import type { PlannedIntervention } from './planner';
import type { RouteDepth } from './curriculum';
import { renderRoutePicker } from './route-picker-render';
import { getConcept } from './concepts';
import { LOGIC_AND_THEISM_SOURCE_PACK } from './source-route';

export function renderDepthToggle(locale: Locale, depth: RouteDepth): string {
  const learn = learnUi(locale);
  return `
    <div class="depth-toggle" role="group" aria-label="${learn.depthGroupAria}">
      <button type="button" class="lang-button ${depth === 'reading' ? 'active' : ''}" data-action="set-route-depth" data-depth="reading" aria-pressed="${depth === 'reading'}">${learn.readingDepth}</button>
      <button type="button" class="lang-button ${depth === 'mastery' ? 'active' : ''}" data-action="set-route-depth" data-depth="mastery" aria-pressed="${depth === 'mastery'}">${learn.masteryDepth}</button>
    </div>
  `;
}

function renderPlannerBanner(locale: Locale, plan: PlannedIntervention[]): string {
  const learn = learnUi(locale);
  const active = plan.filter((item) => item.kind !== 'skip');
  if (active.length === 0) {
    return '';
  }
  const lines = active.map((item) => {
    const conceptLabel =
      getConcept(item.requirement.concept)?.label[locale] ?? item.requirement.concept;
    if (item.kind === 'retrieve') {
      return `<li>${learn.plannerRetrieve} (${conceptLabel})</li>`;
    }
    return `<li>${learn.plannerTeach} (${conceptLabel})</li>`;
  });
  return `
    <section class="planner-banner" data-testid="planner-banner">
      <h2 class="panel-title">${learn.beforeYouContinue}</h2>
      <ul>${lines.join('')}</ul>
    </section>
  `;
}

export function renderSourceLearnView(options: {
  locale: Locale;
  practiceUnlocked: boolean;
  activeRouteId: string;
  depth: RouteDepth;
  plan: PlannedIntervention[];
  itemIndex: number;
  itemTotal: number;
  lessonState?: LessonState;
  practiceState?: AppState;
}): string {
  const learn = learnUi(options.locale);
  const anchor = LOGIC_AND_THEISM_SOURCE_PACK.anchors[0];
  const locator = `${learn.sourceLocator}: ${anchor.locator}`;
  let body = '';
  let actions = '';
  let title = learn.routeSobel;
  if (options.lessonState) {
    const copy = getLessonCopy(options.locale, options.lessonState.lesson.id);
    title = copy.title;
    body = renderCardLesson(options.lessonState);
    actions = `<button type="button" class="primary" data-action="lesson-next">${learn.nextStep}</button>`;
  } else if (options.practiceState) {
    const copy = getExerciseCopy(options.locale, options.practiceState.exercise.id);
    title = copy.prompt;
    const feedback = options.practiceState.message
      ? `<p class="feedback ${options.practiceState.feedback?.correct ? 'feedback-correct' : options.practiceState.feedback ? 'feedback-wrong' : 'feedback-info'}" role="status">${options.practiceState.message}</p>`
      : '';
    body = `<article class="lesson-card"><p class="exercise-prompt">${copy.prompt}</p>${renderClassifyChoiceBody(options.practiceState)}${feedback}</article>`;
    const nextAction =
      options.practiceState.attempt.status === 'finalized'
        ? `<button type="button" class="primary" data-action="source-next">${learn.nextStep}</button>`
        : renderClassifyChoiceActions(options.practiceState, true).replace(
            'next-exercise',
            'source-next',
          );
    actions = nextAction;
  }

  return `
    <main class="app" lang="${options.locale}">
      ${renderShellHeader({
        locale: options.locale,
        mode: 'learn',
        practiceUnlocked: options.practiceUnlocked,
        title,
        meta: `${locator} · ${learn.lessonProgress(options.itemIndex, options.itemTotal)}`,
      })}
      ${renderRoutePicker(options.locale, options.activeRouteId)}
      ${renderDepthToggle(options.locale, options.depth)}
      ${renderPlannerBanner(options.locale, options.plan)}
      ${body}
      <div class="actions">${actions}</div>
    </main>
  `;
}
