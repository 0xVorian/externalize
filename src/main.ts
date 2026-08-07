import './styles/main.css';
import { EXERCISE_DEFINITIONS, getExerciseDefinition } from './app/exercises';
import {
  loadProgress,
  saveProgress,
  seedQueue,
  pickNextExerciseId,
  recordResult,
} from './app/storage';
import { createState, selectNode, toggleAtom, applyLocale, isExerciseComplete } from './app/state';
import { renderApp } from './app/render';
import { loadLocale, saveLocale, type Locale } from './i18n';

const appRoot = document.querySelector<HTMLDivElement>('#app');
if (!appRoot) {
  throw new Error('Missing #app root element');
}

const root: HTMLDivElement = appRoot;

let locale: Locale = loadLocale();

let progress = seedQueue(
  loadProgress(),
  EXERCISE_DEFINITIONS.map((exercise) => exercise.id),
);

function currentExerciseId(): string {
  return pickNextExerciseId(
    progress,
    EXERCISE_DEFINITIONS.map((exercise) => exercise.id),
  );
}

function loadExercise(id: string) {
  const exercise = getExerciseDefinition(id);
  if (!exercise) {
    throw new Error(`Unknown exercise: ${id}`);
  }
  return createState(locale, exercise);
}

let state = loadExercise(currentExerciseId());

function render(): void {
  document.documentElement.lang = state.locale;
  root.innerHTML = renderApp(state, progress.queue.length);
}

function setLocale(nextLocale: Locale): void {
  if (nextLocale === locale) {
    return;
  }
  locale = nextLocale;
  saveLocale(locale);
  state = applyLocale(state, locale);
  render();
}

function advance(): void {
  if (state.feedback) {
    progress = recordResult(progress, state.exercise.id, state.feedback.correct);
    saveProgress(progress);
  }

  const nextId = pickNextExerciseId(
    progress,
    EXERCISE_DEFINITIONS.map((exercise) => exercise.id),
  );
  state = loadExercise(nextId);
  render();
}

root.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest<HTMLElement>('[data-action]');
  if (!button) {
    return;
  }

  const action = button.dataset.action;

  if (action === 'set-locale') {
    const nextLocale = button.dataset.locale;
    if (nextLocale === 'en' || nextLocale === 'fr') {
      setLocale(nextLocale);
    }
    return;
  }

  if (action === 'select-node') {
    const nodeId = button.dataset.nodeId;
    if (!nodeId) {
      return;
    }
    state = selectNode(state, nodeId);
    if (isExerciseComplete(state)) {
      progress = recordResult(progress, state.exercise.id, true);
      saveProgress(progress);
    }
    render();
    return;
  }

  if (action === 'toggle-atom') {
    const atom = button.dataset.atom;
    if (!atom) {
      return;
    }
    state = toggleAtom(state, atom);
    render();
    return;
  }

  if (action === 'next') {
    advance();
  }
});

render();
