import './styles/main.css';
import { EXERCISES, getExercise } from './app/exercises';
import {
  loadProgress,
  saveProgress,
  seedQueue,
  pickNextExerciseId,
  recordResult,
} from './app/storage';
import { createState, selectNode, toggleAtom, isExerciseComplete } from './app/state';
import { renderApp } from './app/render';

const appRoot = document.querySelector<HTMLDivElement>('#app');
if (!appRoot) {
  throw new Error('Missing #app root element');
}

const root: HTMLDivElement = appRoot;

let progress = seedQueue(
  loadProgress(),
  EXERCISES.map((exercise) => exercise.id),
);

function currentExerciseId(): string {
  return pickNextExerciseId(
    progress,
    EXERCISES.map((exercise) => exercise.id),
  );
}

function loadExercise(id: string) {
  const exercise = getExercise(id);
  if (!exercise) {
    throw new Error(`Unknown exercise: ${id}`);
  }
  return createState(exercise);
}

let state = loadExercise(currentExerciseId());

function render(): void {
  root.innerHTML = renderApp(state, progress.queue.length);
}

function advance(): void {
  if (state.feedback) {
    progress = recordResult(progress, state.exercise.id, state.feedback.correct);
    saveProgress(progress);
  }

  const nextId = pickNextExerciseId(
    progress,
    EXERCISES.map((exercise) => exercise.id),
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
