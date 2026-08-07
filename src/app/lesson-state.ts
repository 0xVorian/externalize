import type { Locale } from '../i18n';
import { getLessonCopy } from '../i18n';
import type { LessonDefinition } from './lessons';
import { parse, evaluateWithNodes, type TreeNode, type Assignment } from '../../engine';

export type LessonState = {
  locale: Locale;
  lesson: LessonDefinition;
  watchStep: number;
  guidedStep: number;
  assignment: Assignment;
  tree: TreeNode;
  message: string | null;
  complete: boolean;
};

export function createLessonState(locale: Locale, lesson: LessonDefinition): LessonState {
  const base: LessonState = {
    locale,
    lesson,
    watchStep: 0,
    guidedStep: 0,
    assignment: { P: false, Q: false },
    tree: evaluateWithNodes(parse('P'), { P: false }).tree,
    message: null,
    complete: false,
  };

  if (lesson.type === 'watch' && lesson.formula) {
    return initWatchLesson(base);
  }

  if (lesson.type === 'guided' && lesson.formula) {
    const { tree } = evaluateWithNodes(parse(lesson.formula), base.assignment);
    return {
      ...base,
      tree,
      message: currentGuidedHint({ ...base, tree }),
    };
  }

  return base;
}

export function applyLessonLocale(state: LessonState, locale: Locale): LessonState {
  if (locale === state.locale) {
    return state;
  }

  const preserved = {
    watchStep: state.watchStep,
    guidedStep: state.guidedStep,
    assignment: { ...state.assignment },
    complete: state.complete,
  };

  if (state.lesson.type === 'watch' && state.lesson.formula) {
    const copy = getLessonCopy(locale, state.lesson.id);
    const step = copy.watchSteps?.[preserved.watchStep] ?? copy.watchSteps?.[0];
    if (!step) {
      return { ...state, locale };
    }
    const { tree } = evaluateWithNodes(parse(state.lesson.formula), step.assignment);
    return {
      ...state,
      locale,
      watchStep: preserved.watchStep,
      assignment: step.assignment,
      tree,
      message: step.explanation,
      complete: preserved.complete,
    };
  }

  if (state.lesson.type === 'guided' && state.lesson.formula) {
    const { tree } = evaluateWithNodes(parse(state.lesson.formula), preserved.assignment);
    const merged: LessonState = {
      ...state,
      locale,
      guidedStep: preserved.guidedStep,
      assignment: preserved.assignment,
      complete: preserved.complete,
      tree,
    };
    return { ...merged, message: currentGuidedHint(merged) };
  }

  return { ...state, locale };
}

export function advanceWatchStep(state: LessonState): LessonState {
  const copy = getLessonCopy(state.locale, state.lesson.id);
  const steps = copy.watchSteps ?? [];
  const nextStep = state.watchStep + 1;

  if (nextStep >= steps.length) {
    return { ...state, complete: true, message: null };
  }

  const step = steps[nextStep];
  const { tree } = evaluateWithNodes(parse(state.lesson.formula!), step.assignment);
  return {
    ...state,
    watchStep: nextStep,
    assignment: step.assignment,
    tree,
    message: step.explanation,
    complete: false,
  };
}

export function initWatchLesson(state: LessonState): LessonState {
  const copy = getLessonCopy(state.locale, state.lesson.id);
  const step = copy.watchSteps?.[0];
  if (!step || !state.lesson.formula) {
    return state;
  }
  const { tree } = evaluateWithNodes(parse(state.lesson.formula), step.assignment);
  return {
    ...state,
    watchStep: 0,
    assignment: step.assignment,
    tree,
    message: step.explanation,
  };
}

export function toggleGuidedAtom(state: LessonState, atom: string): LessonState {
  if (state.lesson.type !== 'guided' || !state.lesson.formula || state.complete) {
    return state;
  }

  const copy = getLessonCopy(state.locale, state.lesson.id);
  const steps = copy.guidedSteps ?? [];
  const assignment = { ...state.assignment, [atom]: !state.assignment[atom] };
  const { tree } = evaluateWithNodes(parse(state.lesson.formula), assignment);

  let guidedStep = state.guidedStep;
  let complete: boolean = state.complete;
  let message = steps[guidedStep]?.text ?? null;

  if (guidedStep === 0 && atom === 'P' && assignment.P === true) {
    guidedStep = 1;
    message = steps[1]?.text ?? message;
  } else if (guidedStep === 1 && atom === 'Q' && assignment.Q === false) {
    guidedStep = 2;
    complete = true;
    message = steps[2]?.text ?? message;
  }

  return {
    ...state,
    assignment,
    tree,
    guidedStep,
    complete,
    message,
  };
}

export function currentGuidedHint(state: LessonState): string {
  const copy = getLessonCopy(state.locale, state.lesson.id);
  const steps = copy.guidedSteps ?? [];
  if (state.complete) {
    return steps[steps.length - 1]?.text ?? '';
  }
  return steps[state.guidedStep]?.text ?? '';
}

export function isGuidedAtomEnabled(state: LessonState, atom: string): boolean {
  if (state.lesson.type !== 'guided' || state.complete) {
    return false;
  }
  if (state.guidedStep === 0) {
    return atom === 'P';
  }
  if (state.guidedStep === 1) {
    return atom === 'Q';
  }
  return false;
}
