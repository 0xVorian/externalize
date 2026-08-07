import './styles/main.css';
import { getExerciseDefinition } from './app/exercises';
import {
  loadProgress,
  saveProgress,
  seedQueue,
  pickNextExerciseId,
  recordResult,
  completeLesson,
  isPracticeUnlocked,
  getUnlockedExerciseIds,
} from './app/storage';
import {
  firstIncompleteLesson,
  nextLessonId,
  getLessonDefinition,
} from './app/lessons';
import {
  createState,
  selectNode,
  toggleAtom,
  applyLocale,
  isExerciseComplete,
  type AppState,
} from './app/state';
import {
  createLessonState,
  advanceWatchStep,
  toggleGuidedAtom,
  applyLessonLocale,
  type LessonState,
} from './app/lesson-state';
import { renderApp } from './app/render';
import { renderLessonView } from './app/lesson-render';
import { loadLocale, saveLocale, type Locale } from './i18n';

const appRoot = document.querySelector<HTMLDivElement>('#app');
if (!appRoot) {
  throw new Error('Missing #app root element');
}

const root: HTMLDivElement = appRoot;

type AppMode = 'learn' | 'practice';

let locale: Locale = loadLocale();
let progress = loadProgress();
let mode: AppMode = progress.level0Complete ? 'practice' : 'learn';

let lessonState: LessonState = createLessonState(locale, firstIncompleteLesson(progress.lessonsCompleted));
let practiceState: AppState | null = null;

function unlockedExerciseIds(): string[] {
  return getUnlockedExerciseIds(progress);
}

function refreshPracticeQueue(): void {
  progress = seedQueue(progress, unlockedExerciseIds());
  saveProgress(progress);
}

function loadPracticeState(): AppState {
  refreshPracticeQueue();
  const pool = unlockedExerciseIds();
  if (pool.length === 0) {
    throw new Error('No practice exercises unlocked');
  }
  const id = pickNextExerciseId(progress, pool);
  const exercise = getExerciseDefinition(id);
  if (!exercise) {
    throw new Error(`Unknown exercise: ${id}`);
  }
  return createState(locale, exercise);
}

function ensurePracticeState(): AppState {
  practiceState = loadPracticeState();
  return practiceState;
}

function render(): void {
  document.documentElement.lang = locale;
  const practiceUnlocked = isPracticeUnlocked(progress);

  if (mode === 'learn') {
    root.innerHTML = renderLessonView(lessonState, {
      practiceUnlocked,
      level0Complete: progress.level0Complete,
    });
    return;
  }

  root.innerHTML = renderApp(ensurePracticeState(), progress.queue.length, practiceUnlocked);
}

function setLocale(nextLocale: Locale): void {
  if (nextLocale === locale) {
    return;
  }
  locale = nextLocale;
  saveLocale(locale);
  lessonState = applyLessonLocale(lessonState, locale);
  if (practiceState) {
    practiceState = applyLocale(practiceState, locale);
  }
  render();
}

function setMode(nextMode: AppMode): void {
  if (nextMode === 'practice' && !isPracticeUnlocked(progress)) {
    return;
  }
  mode = nextMode;
  if (mode === 'practice') {
    practiceState = loadPracticeState();
  } else {
    lessonState = createLessonState(locale, firstIncompleteLesson(progress.lessonsCompleted));
  }
  render();
}

function completeCurrentLesson(): void {
  progress = completeLesson(progress, lessonState.lesson.id);
  saveProgress(progress);
  refreshPracticeQueue();

  if (progress.level0Complete) {
    mode = 'practice';
    practiceState = loadPracticeState();
    render();
    return;
  }

  const nextId = nextLessonId(lessonState.lesson.id);
  if (nextId) {
    const lesson = getLessonDefinition(nextId);
    if (lesson) {
      lessonState = createLessonState(locale, lesson);
    }
  }
  render();
}

function handleLessonNext(): void {
  if (lessonState.lesson.type === 'watch' && !lessonState.complete) {
    lessonState = advanceWatchStep(lessonState);
    render();
    return;
  }

  completeCurrentLesson();
}

function advancePractice(): void {
  const state = ensurePracticeState();
  if (state.feedback) {
    progress = recordResult(progress, state.exercise.id, state.feedback.correct);
    saveProgress(progress);
    refreshPracticeQueue();
  }

  practiceState = loadPracticeState();
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

  if (action === 'set-mode') {
    const nextMode = button.dataset.mode;
    if (nextMode === 'learn' || nextMode === 'practice') {
      setMode(nextMode);
    }
    return;
  }

  if (action === 'lesson-next') {
    handleLessonNext();
    return;
  }

  if (mode === 'learn') {
    if (action === 'guided-toggle') {
      const atom = button.dataset.atom;
      if (!atom) {
        return;
      }
      lessonState = toggleGuidedAtom(lessonState, atom);
      render();
    }
    return;
  }

  if (action === 'select-node') {
    const nodeId = button.dataset.nodeId;
    if (!nodeId) {
      return;
    }
    practiceState = selectNode(ensurePracticeState(), nodeId);
    if (isExerciseComplete(practiceState)) {
      progress = recordResult(progress, practiceState.exercise.id, true);
      saveProgress(progress);
      refreshPracticeQueue();
    }
    render();
    return;
  }

  if (action === 'toggle-atom') {
    const atom = button.dataset.atom;
    if (!atom) {
      return;
    }
    practiceState = toggleAtom(ensurePracticeState(), atom);
    render();
    return;
  }

  if (action === 'next') {
    advancePractice();
  }
});

render();
