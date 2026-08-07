import type { Locale } from '../i18n';
import { getLessonCopy } from '../i18n';
import type { LessonDefinition } from './lessons';
import { parse, evaluateWithNodes, collectAtoms, type TreeNode, type Assignment } from '../../engine';

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

import type { ResumePoint } from './progress-tracker';

export type LessonResume = Pick<
  ResumePoint,
  'watchStep' | 'watchComplete' | 'guidedStep' | 'guidedAssignment' | 'guidedComplete'
>;

function defaultAssignment(formula?: string): Assignment {
  if (!formula) {
    return { P: false, Q: false };
  }
  const assignment: Assignment = {};
  for (const atom of collectAtoms(parse(formula))) {
    assignment[atom] = false;
  }
  return assignment;
}

function assignmentForFormula(formula: string, source?: Assignment): Assignment {
  const assignment = defaultAssignment(formula);
  if (source) {
    for (const atom of Object.keys(assignment)) {
      assignment[atom] = source[atom] ?? false;
    }
  }
  return assignment;
}

export function createLessonState(
  locale: Locale,
  lesson: LessonDefinition,
  resume?: LessonResume,
): LessonState {
  const assignment = lesson.formula
    ? assignmentForFormula(lesson.formula, resume?.guidedAssignment)
    : (resume?.guidedAssignment ?? defaultAssignment());
  const base: LessonState = {
    locale,
    lesson,
    watchStep: resume?.watchStep ?? 0,
    guidedStep: resume?.guidedStep ?? 0,
    assignment,
    tree: evaluateWithNodes(parse('P'), { P: false }).tree,
    message: null,
    complete: resume?.guidedComplete ?? false,
  };

  if (lesson.type === 'watch' && lesson.formula) {
    const copy = getLessonCopy(locale, lesson.id);
    const stepIndex = resume?.watchStep ?? 0;
    const step = copy.watchSteps?.[stepIndex] ?? copy.watchSteps?.[0];
    if (!step) {
      return base;
    }
    const { tree } = evaluateWithNodes(parse(lesson.formula), step.assignment);
    return {
      ...base,
      watchStep: stepIndex,
      assignment: step.assignment,
      tree,
      message: step.explanation,
      complete: resume?.watchComplete ?? false,
    };
  }

  if (lesson.type === 'guided' && lesson.formula) {
    const { tree } = evaluateWithNodes(parse(lesson.formula), assignment);
    const merged = {
      ...base,
      tree,
      guidedStep: resume?.guidedStep ?? 0,
      complete: resume?.guidedComplete ?? false,
    };
    return { ...merged, message: currentGuidedHint(merged) };
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
  return setGuidedAtom(state, atom, !state.assignment[atom]);
}

function advanceGuidedStep(state: LessonState, assignment: Assignment, tree: TreeNode): LessonState {
  const copy = getLessonCopy(state.locale, state.lesson.id);
  const steps = copy.guidedSteps ?? [];
  const nextIndex = state.guidedStep + 1;
  const nextStep = steps[nextIndex];

  if (!nextStep || nextStep.kind === 'done') {
    const doneStep = steps.find((step) => step.kind === 'done');
    return {
      ...state,
      assignment,
      tree,
      guidedStep: nextIndex,
      complete: true,
      message: doneStep?.text ?? null,
    };
  }

  return {
    ...state,
    assignment,
    tree,
    guidedStep: nextIndex,
    complete: false,
    message: nextStep.text,
  };
}

export function setGuidedAtom(state: LessonState, atom: string, value: boolean): LessonState {
  if (state.lesson.type !== 'guided' || !state.lesson.formula || state.complete) {
    return state;
  }

  const copy = getLessonCopy(state.locale, state.lesson.id);
  const steps = copy.guidedSteps ?? [];
  const current = steps[state.guidedStep];
  const assignment = { ...state.assignment, [atom]: value };
  const { tree } = evaluateWithNodes(parse(state.lesson.formula), assignment);

  if (
    current?.kind === 'hint' &&
    current.atom === atom &&
    assignment[atom] === current.value
  ) {
    return advanceGuidedStep(state, assignment, tree);
  }

  return {
    ...state,
    assignment,
    tree,
    message: current?.text ?? null,
  };
}

export function currentGuidedHint(state: LessonState): string {
  const copy = getLessonCopy(state.locale, state.lesson.id);
  const steps = copy.guidedSteps ?? [];
  if (state.complete) {
    const done = steps.find((step) => step.kind === 'done');
    return done?.text ?? steps[steps.length - 1]?.text ?? '';
  }
  return steps[state.guidedStep]?.text ?? '';
}

export function lessonResumeSnapshot(state: LessonState): LessonResume {
  return {
    watchStep: state.watchStep,
    watchComplete: state.complete && state.lesson.type === 'watch',
    guidedStep: state.guidedStep,
    guidedAssignment: {
      P: state.assignment.P ?? false,
      Q: state.assignment.Q ?? false,
    },
    guidedComplete: state.complete && state.lesson.type === 'guided',
  };
}

export function isGuidedAtomEnabled(state: LessonState, atom: string): boolean {
  if (state.lesson.type !== 'guided' || state.complete) {
    return false;
  }
  const copy = getLessonCopy(state.locale, state.lesson.id);
  const current = copy.guidedSteps?.[state.guidedStep];
  if (current?.kind !== 'hint') {
    return false;
  }
  return atom === current.atom;
}
