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
import { LOGIC_AND_THEISM_SOURCE_PACK } from './source-route';
import { renderSessionFrame } from './session-chrome-render';

export function renderDepthToggle(locale: Locale, depth: RouteDepth): string {
  const learn = learnUi(locale);
  return `
    <div class="depth-toggle" role="group" aria-label="${learn.depthGroupAria}">
      <button type="button" class="lang-button ${depth === 'reading' ? 'active' : ''}" data-action="set-route-depth" data-depth="reading" aria-pressed="${depth === 'reading'}">${learn.readingDepth}</button>
      <button type="button" class="lang-button ${depth === 'mastery' ? 'active' : ''}" data-action="set-route-depth" data-depth="mastery" aria-pressed="${depth === 'mastery'}">${learn.masteryDepth}</button>
    </div>
  `;
}

function sourceBodyAndActions(options: {
  locale: Locale;
  isTerminal: boolean;
  routeComplete: boolean;
  lessonState?: LessonState;
  practiceState?: AppState;
}): { title: string; body: string; actions: string } {
  const learn = learnUi(options.locale);
  let body = '';
  let actions = '';
  let title = learn.routeSobel;
  const terminalButton = `<button type="button" class="primary" data-action="source-complete" data-testid="source-complete">${learn.returnToBook}</button>`;
  const terminalActions = options.isTerminal && !options.routeComplete ? terminalButton : '';
  if (options.lessonState) {
    const copy = getLessonCopy(options.locale, options.lessonState.lesson.id);
    title = copy.title;
    body = renderCardLesson(options.lessonState);
    actions = options.isTerminal
      ? terminalActions
      : `<button type="button" class="primary" data-action="lesson-next">${learn.nextStep}</button>`;
  } else if (options.practiceState) {
    const copy = getExerciseCopy(options.locale, options.practiceState.exercise.id);
    title = copy.prompt;
    const feedback = options.practiceState.message
      ? `<p class="feedback ${options.practiceState.feedback?.correct ? 'feedback-correct' : options.practiceState.feedback ? 'feedback-wrong' : 'feedback-info'}" role="status">${options.practiceState.message}</p>`
      : '';
    body = `<article class="lesson-card"><p class="exercise-prompt">${copy.prompt}</p>${renderClassifyChoiceBody(options.practiceState)}${feedback}</article>`;
    if (options.practiceState.attempt.status === 'finalized') {
      actions = options.isTerminal
        ? terminalActions
        : `<button type="button" class="primary" data-action="source-next">${learn.nextStep}</button>`;
    } else {
      actions = renderClassifyChoiceActions(options.practiceState, true).replace(
        'next-exercise',
        'source-next',
      );
    }
  }
  return { title, body, actions };
}

export function renderSourceLearnView(options: {
  locale: Locale;
  practiceUnlocked: boolean;
  activeRouteId: string;
  depth: RouteDepth;
  plan: PlannedIntervention[];
  itemIndex: number;
  itemTotal: number;
  isTerminal: boolean;
  routeComplete: boolean;
  lessonState?: LessonState;
  practiceState?: AppState;
  session?: { current: number; total: number };
}): string {
  const learn = learnUi(options.locale);
  const anchor = LOGIC_AND_THEISM_SOURCE_PACK.anchors[0];
  const locator = `${learn.sourceLocator}: ${anchor.locator}`;
  const { title, body, actions } = sourceBodyAndActions(options);
  const completeBanner = options.routeComplete
    ? `<section class="source-complete-banner" data-testid="source-route-complete" role="status"><p>${learn.sourceRouteComplete}</p><p class="source-locator">${locator}</p></section>`
    : '';
  void options.plan;

  if (options.session) {
    return renderSessionFrame({
      locale: options.locale,
      current: options.session.current,
      total: options.session.total,
      body: `${completeBanner}${body}`,
      actions,
    });
  }

  return `
    <main class="app" lang="${options.locale}">
      ${renderShellHeader({
        locale: options.locale,
        mode: 'learn',
        practiceUnlocked: options.practiceUnlocked,
        title,
        meta: options.routeComplete ? locator : title,
      })}
      ${renderRoutePicker(options.locale, options.activeRouteId)}
      ${renderDepthToggle(options.locale, options.depth)}
      ${completeBanner}
      ${body}
      <div class="actions">${actions}</div>
    </main>
  `;
}
