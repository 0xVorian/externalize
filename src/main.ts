import './styles/main.css';
import { getExerciseDefinition } from './app/exercises';
import {
  loadProgress,
  saveProgress,
  selectNextExerciseId,
  beginPracticeAttempt,
  persistPracticeDraft,
  recordCheckedPracticeState,
  clearPracticeDraft,
  completeLesson,
  isPracticeUnlocked,
  getUnlockedExerciseIds,
  updateResume,
  serializeProgressExport,
  importProgress,
  completeOnboarding,
  needsOnboarding,
  type ProgressStore,
} from './app/storage';
import {
  firstIncompleteLesson,
  firstIncompleteLessonInUnit,
  nextLessonId,
  getLessonDefinition,
  isLearnPathComplete,
  lessonUnit,
} from './app/lessons';
import {
  createState,
  selectNode,
  checkScope,
  setAtomValue,
  submitCellValue,
  submitTautologyAnswer,
  applyLocale,
  paletteInsertToken,
  paletteBackspace,
  paletteUndo,
  checkTranslation,
  checkCounterexample,
  selectProofRule,
  toggleProofCitation,
  checkProofStep,
  selectEvaluationPrediction,
  selectLearnerNodeValue,
  checkEvaluation,
  showHint,
  tryAgainPractice,
  practiceDraftSnapshot,
  type AppState,
} from './app/state';
import {
  createLessonState,
  advanceWatchStep,
  setGuidedAtom,
  isGuidedAtomEnabled,
  applyLessonLocale,
  lessonResumeSnapshot,
  type LessonState,
} from './app/lesson-state';
import { renderApp, type PracticeViewContext } from './app/render';
import { renderExploreView } from './app/explore-render';
import {
  createExploreState,
  selectExploreFormula,
  setExploreAtom,
  applyExploreLocale,
  type ExploreState,
} from './app/explore-state';
import { handleTreeKeydown } from './app/tree-keyboard';
import { renderLessonView } from './app/lesson-render';
import { renderProgressView } from './app/progress-render';
import { renderOnboarding } from './app/onboarding-render';
import type { AppMode } from './app/shell-render';
import { loadLocale, saveLocale, progressUi, learnUi, type Locale } from './i18n';
import { getProofExerciseConfig } from './app/proof/exercise-config';
import type { RuleId } from '../engine';
import { skillForExercise } from './app/progress-tracker';
import {
  deriveLearnProgress,
  diffProgressVisibility,
  selectProgressMoment,
  snapshotProgressVisibility,
  type ProgressMoment,
} from './app/progress-visibility';
import {
  createPracticeSession,
  isPracticeSessionComplete,
  recordFinalizedAttempt,
  summarizePracticeSession,
  type PracticeSession,
} from './app/practice-session';
import { currentScaffoldLevel } from './app/evaluation-scaffold';

const appRoot = document.querySelector<HTMLDivElement>('#app');
if (!appRoot) {
  throw new Error('Missing #app root element');
}

const root: HTMLDivElement = appRoot;

let locale: Locale = loadLocale();
let progress: ProgressStore = loadProgress();
let mode: AppMode = resolveInitialMode(progress);

let lessonState: LessonState = loadLessonFromProgress(progress);
let practiceState: AppState | null = null;
let exploreState: ExploreState = createExploreState(locale);
let onboardingStep = 0;
let importNotice: { kind: 'success' | 'error'; message: string } | null = null;
let practiceSession: PracticeSession = createPracticeSession();
let pendingProgressMoment: { moment: ProgressMoment; attemptId: string; live: boolean } | null =
  null;
let unitCompleteNotice: string | null = null;
let unitCompleteNoticeLive = false;
let sessionCompleteLive = false;

const importInput = document.createElement('input');
importInput.type = 'file';
importInput.accept = 'application/json,.json';
importInput.hidden = true;
document.body.appendChild(importInput);

importInput.addEventListener('change', () => {
  const file = importInput.files?.[0];
  importInput.value = '';
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    handleImportRaw(String(reader.result ?? ''));
  };
  reader.readAsText(file);
});

function resolveInitialMode(store: ProgressStore): AppMode {
  if (store.resume.mode === 'progress') {
    return 'progress';
  }
  if (store.resume.mode === 'explore') {
    return 'explore';
  }
  if (store.resume.mode === 'practice' && store.level0Complete) {
    return 'practice';
  }
  return 'learn';
}

function loadLessonFromProgress(store: ProgressStore): LessonState {
  const lessonId = store.resume.lessonId ?? firstIncompleteLesson(store.lessonsCompleted).id;
  const lesson = getLessonDefinition(lessonId) ?? firstIncompleteLesson(store.lessonsCompleted);
  return createLessonState(locale, lesson, {
    watchStep: store.resume.watchStep,
    watchComplete: store.resume.watchComplete,
    guidedStep: store.resume.guidedStep,
    guidedAssignment: store.resume.guidedAssignment,
    guidedComplete: store.resume.guidedComplete,
  });
}

function resetEphemeralProgressUi(): void {
  practiceSession = createPracticeSession();
  pendingProgressMoment = null;
  sessionCompleteLive = false;
  clearUnitCompleteNotice();
}

function preparePracticeEntry(): void {
  if (!isPracticeSessionComplete(practiceSession)) {
    return;
  }
  practiceSession = createPracticeSession();
  pendingProgressMoment = null;
  sessionCompleteLive = false;
}

function clearUnitCompleteNotice(): void {
  unitCompleteNotice = null;
  unitCompleteNoticeLive = false;
}

function announceUnitComplete(unit: 0 | 1 | 2): void {
  unitCompleteNotice = unitCompleteMessage(unit);
  unitCompleteNoticeLive = true;
}

function disarmLiveAnnouncements(): void {
  if (pendingProgressMoment) {
    pendingProgressMoment = { ...pendingProgressMoment, live: false };
  }
  unitCompleteNoticeLive = false;
  sessionCompleteLive = false;
}

function unitCompleteMessage(unit: 0 | 1 | 2): string {
  const learn = learnUi(locale);
  if (unit === 0) return learn.level0Complete;
  if (unit === 1) return learn.level1Complete;
  return learn.level2Complete;
}

function practiceViewContext(): PracticeViewContext {
  const state = ensurePracticeState();
  const skillId = skillForExercise(state.exercise);
  const snapshot = snapshotProgressVisibility(progress);
  return {
    capabilityState: snapshot.capabilities[skillId],
    sessionCompleted: practiceSession.completedAttemptIds.length,
    sessionTarget: practiceSession.target,
    sessionComplete: isPracticeSessionComplete(practiceSession),
    sessionCompleteLive,
    sessionSummary: isPracticeSessionComplete(practiceSession)
      ? summarizePracticeSession(practiceSession)
      : null,
    progressMoment:
      pendingProgressMoment && pendingProgressMoment.attemptId === state.attempt.id
        ? pendingProgressMoment.moment
        : null,
    progressMomentLive: pendingProgressMoment?.live === true,
    scaffoldLevel: currentScaffoldLevel(progress.exerciseStats[state.exercise.id]?.scaffoldLevel),
    unitCompleteNotice,
    unitCompleteNoticeLive,
  };
}

function persistProgress(next: ProgressStore): void {
  progress = saveProgress(next);
}

function persistLessonResume(): void {
  persistProgress(
    updateResume(progress, {
      mode: 'learn',
      lessonId: lessonState.lesson.id,
      ...lessonResumeSnapshot(lessonState),
    }),
  );
}

function unlockedExerciseIds(): string[] {
  return getUnlockedExerciseIds(progress);
}

function loadPracticeState(exerciseId?: string): AppState {
  const pool = unlockedExerciseIds();
  if (pool.length === 0) {
    throw new Error('No practice exercises unlocked');
  }
  const id =
    exerciseId ??
    (progress.resume.exerciseId && pool.includes(progress.resume.exerciseId)
      ? progress.resume.exerciseId
      : undefined) ??
    selectNextExerciseId(progress);
  const exercise = getExerciseDefinition(id);
  if (!exercise) {
    throw new Error(`Unknown exercise: ${id}`);
  }
  const withAttempt = beginPracticeAttempt(progress, id);
  persistProgress(updateResume(withAttempt, { mode: 'practice', exerciseId: id }));
  const scaffoldLevel = withAttempt.exerciseStats[id]?.scaffoldLevel ?? 0;
  return createState(locale, exercise, withAttempt.practiceDraft, scaffoldLevel);
}

function persistPracticeState(): void {
  if (!practiceState) return;
  persistProgress(persistPracticeDraft(progress, practiceDraftSnapshot(practiceState)));
}

function commitCheckedPracticeState(nextState: AppState): void {
  const before = snapshotProgressVisibility(progress);
  const wasFinalized = practiceState?.attempt.status === 'finalized';
  practiceState = nextState;
  const nextProgress = recordCheckedPracticeState(
    progress,
    practiceDraftSnapshot(nextState),
  );
  persistProgress(nextProgress);
  if (progress.practiceDraft?.attempt.id === nextState.attempt.id) {
    practiceState = {
      ...nextState,
      attempt: progress.practiceDraft.attempt,
    };
  }
  const nowFinalized = practiceState.attempt.status === 'finalized';
  if (!wasFinalized && nowFinalized) {
    const after = snapshotProgressVisibility(progress);
    const moments = diffProgressVisibility(before, after, nextState.exercise.id);
    const primary = selectProgressMoment(moments);
    pendingProgressMoment = primary
      ? { moment: primary, attemptId: nextState.attempt.id, live: true }
      : null;
    const sessionWasComplete = isPracticeSessionComplete(practiceSession);
    practiceSession = recordFinalizedAttempt(
      practiceSession,
      nextState.attempt.id,
      skillForExercise(nextState.exercise),
      moments,
    );
    if (!sessionWasComplete && isPracticeSessionComplete(practiceSession)) {
      sessionCompleteLive = true;
    }
  }
}

function ensurePracticeState(): AppState {
  if (!practiceState) {
    practiceState = loadPracticeState();
  }
  return practiceState;
}

function render(): void {
  document.documentElement.lang = locale;
  const practiceUnlocked = isPracticeUnlocked(progress);

  if (needsOnboarding(progress)) { root.innerHTML = renderOnboarding(locale, onboardingStep); return; }
  if (mode === 'progress') {
    root.innerHTML = renderProgressView(locale, progress, practiceUnlocked, {
      importNotice: importNotice ?? undefined,
    });
    return;
  }

  if (mode === 'explore') {
    root.innerHTML = renderExploreView(exploreState, practiceUnlocked);
    return;
  }

  if (mode === 'learn') {
    root.innerHTML = renderLessonView(lessonState, {
      practiceUnlocked,
      level0Complete: progress.level0Complete,
      level1Complete: progress.level1Complete,
      learnPathComplete: isLearnPathComplete(progress.lessonsCompleted),
      learnProgress: deriveLearnProgress(lessonState.lesson.id, progress.lessonsCompleted),
      unitCompleteNotice,
      unitCompleteNoticeLive,
    });
    disarmLiveAnnouncements();
    return;
  }

  const context = practiceViewContext();
  root.innerHTML = renderApp(ensurePracticeState(), progress.queue.length, practiceUnlocked, context);
  disarmLiveAnnouncements();
}

function setLocale(nextLocale: Locale): void {
  if (nextLocale === locale) {
    return;
  }
  locale = nextLocale;
  saveLocale(locale);
  lessonState = applyLessonLocale(lessonState, locale);
  exploreState = applyExploreLocale(exploreState, locale);
  if (practiceState) {
    practiceState = applyLocale(practiceState, locale);
  }
  render();
}

function setMode(nextMode: AppMode): void {
  if (nextMode === 'practice' && !isPracticeUnlocked(progress)) {
    return;
  }
  if (nextMode === mode) {
    return;
  }
  if (nextMode !== 'progress') {
    importNotice = null;
  }
  if (nextMode !== 'learn') {
    clearUnitCompleteNotice();
  }
  mode = nextMode;
  if (needsOnboarding(progress)) { root.innerHTML = renderOnboarding(locale, onboardingStep); return; }
  if (mode === 'progress') {
    persistProgress(updateResume(progress, { mode: 'progress' }));
  } else if (mode === 'practice') {
    preparePracticeEntry();
    practiceState = loadPracticeState();
  } else if (mode === 'explore') {
    exploreState = createExploreState(locale, exploreState.formulaIndex);
    persistProgress(updateResume(progress, { mode: 'explore' }));
  } else {
    lessonState = loadLessonFromProgress(progress);
    persistLessonResume();
  }
  render();
}

function finishOnboarding(): void { persistProgress(completeOnboarding(progress)); onboardingStep = 0; render(); }
function startPracticeExercise(exerciseId: string): void {
  if (!isPracticeUnlocked(progress)) return;
  if (
    progress.practiceDraft?.attempt.exerciseId === exerciseId &&
    progress.practiceDraft.attempt.status === 'finalized'
  ) {
    persistProgress(clearPracticeDraft(progress));
  }
  preparePracticeEntry();
  mode = 'practice';
  practiceState = loadPracticeState(exerciseId);
  render();
}
function continueFromResume(): void {
  const target = progress.resume.mode;
  if (target === 'practice' && !progress.level0Complete) {
    setMode('learn');
    return;
  }
  setMode(target);
}

function switchLearnUnit(unit: 0 | 1 | 2): void {
  if (unit === 1 && !progress.level0Complete) {
    return;
  }
  if (unit === 2 && !progress.level1Complete) {
    return;
  }
  lessonState = createLessonState(locale, firstIncompleteLessonInUnit(unit, progress.lessonsCompleted));
  persistLessonResume();
  render();
}

function completeCurrentLesson(): void {
  clearUnitCompleteNotice();
  const before = {
    level0: progress.level0Complete,
    level1: progress.level1Complete,
    level2: progress.level2Complete,
  };
  persistProgress(completeLesson(progress, lessonState.lesson.id));
  if (!before.level0 && progress.level0Complete) {
    announceUnitComplete(0);
  } else if (!before.level1 && progress.level1Complete) {
    announceUnitComplete(1);
  } else if (!before.level2 && progress.level2Complete) {
    announceUnitComplete(2);
  }

  if (isLearnPathComplete(progress.lessonsCompleted)) {
    preparePracticeEntry();
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
      persistLessonResume();
    }
  }
  render();
}

function handleLessonNext(): void {
  if (lessonState.lesson.type === 'watch' && !lessonState.complete) {
    lessonState = advanceWatchStep(lessonState);
    persistLessonResume();
    render();
    return;
  }

  completeCurrentLesson();
}

function advancePractice(): void {
  const state = ensurePracticeState();
  if (state.attempt.status !== 'finalized') {
    return;
  }
  if (isPracticeSessionComplete(practiceSession)) {
    render();
    return;
  }
  pendingProgressMoment = null;
  clearUnitCompleteNotice();
  const nextId = selectNextExerciseId(progress);
  persistProgress(clearPracticeDraft(progress));
  practiceState = loadPracticeState(nextId);
  render();
}

function keepPractising(): void {
  practiceSession = createPracticeSession();
  pendingProgressMoment = null;
  sessionCompleteLive = false;
  clearUnitCompleteNotice();
  const state = ensurePracticeState();
  if (state.attempt.status === 'finalized') {
    const nextId = selectNextExerciseId(progress);
    persistProgress(clearPracticeDraft(progress));
    practiceState = loadPracticeState(nextId);
  }
  render();
}

function finishPracticeSession(): void {
  pendingProgressMoment = null;
  clearUnitCompleteNotice();
  setMode('progress');
}

function exportProgressFile(): void {
  const json = serializeProgressExport(progress, locale);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `externalize-progress-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function applyImportedProgress(imported: ProgressStore, importedLocale?: Locale): void {
  progress = saveProgress(imported);
  lessonState = loadLessonFromProgress(progress);
  practiceState = null;
  exploreState = createExploreState(locale);
  resetEphemeralProgressUi();
  mode = resolveInitialMode(progress);

  if (importedLocale && importedLocale !== locale) {
    locale = importedLocale;
    saveLocale(locale);
    lessonState = applyLessonLocale(lessonState, locale);
  }
}

function handleImportRaw(raw: string): void {
  const copy = progressUi(locale);
  try {
    const { progress: imported, locale: importedLocale } = importProgress(raw);
    applyImportedProgress(imported, importedLocale);
    importNotice = { kind: 'success', message: copy.importSuccess };
    mode = 'progress';
    persistProgress(updateResume(progress, { mode: 'progress' }));
    render();
  } catch {
    importNotice = { kind: 'error', message: copy.importError };
    mode = 'progress';
    render();
  }
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
    if (nextMode === 'learn' || nextMode === 'practice' || nextMode === 'progress' || nextMode === 'explore') {
      setMode(nextMode);
    }
    return;
  }

  if (action === 'continue-resume') { continueFromResume(); return; }
  if (action === 'practice-exercise') { const e = button.dataset.exerciseId; if (e) startPracticeExercise(e); return; }
  if (action === 'onboarding-next') { onboardingStep++; render(); return; }
  if (action === 'onboarding-skip' || action === 'onboarding-finish') { finishOnboarding(); return; }

  if (action === 'export-progress') {
    exportProgressFile();
    return;
  }

  if (action === 'import-progress') {
    importInput.click();
    return;
  }

  if (action === 'select-unit') {
    const unitRaw = button.dataset.unit;
    const unit = unitRaw === '2' ? 2 : unitRaw === '1' ? 1 : unitRaw === '0' ? 0 : null;
    if (unit !== null && mode === 'learn' && lessonUnit(lessonState.lesson.id) !== unit) {
      switchLearnUnit(unit);
    }
    return;
  }

  if (action === 'lesson-next') {
    handleLessonNext();
    return;
  }

  if (action === 'set-explore-atom') {
    const atom = button.dataset.atom;
    const value = button.dataset.value === 'true';
    if (!atom || mode !== 'explore') {
      return;
    }
    exploreState = setExploreAtom(exploreState, atom, value);
    render();
    return;
  }

  if (action === 'select-explore-formula') {
    const indexRaw = button.dataset.formulaIndex;
    if (mode !== 'explore' || !indexRaw) {
      return;
    }
    exploreState = selectExploreFormula(exploreState, Number(indexRaw));
    render();
    return;
  }

  if (action === 'set-atom-value') {
    const atom = button.dataset.atom;
    const value = button.dataset.value === 'true';
    if (!atom) {
      return;
    }
    if (mode === 'learn') {
      if (!isGuidedAtomEnabled(lessonState, atom)) {
        return;
      }
      lessonState = setGuidedAtom(lessonState, atom, value);
      persistLessonResume();
      render();
      return;
    }
    if (mode === 'practice') {
      practiceState = setAtomValue(ensurePracticeState(), atom, value);
      persistPracticeState();
      render();
      return;
    }
    return;
  }

  if (mode === 'learn') {
    return;
  }

  if (needsOnboarding(progress)) { root.innerHTML = renderOnboarding(locale, onboardingStep); return; }
  if (mode === 'progress' || mode === 'explore') {
    return;
  }

  if (mode !== 'practice') {
    return;
  }

  if (action === 'select-node') {
    const nodeId = button.dataset.nodeId;
    if (!nodeId) {
      return;
    }
    practiceState = selectNode(ensurePracticeState(), nodeId);
    persistPracticeState();
    render();
    return;
  }

  if (action === 'check-scope') {
    commitCheckedPracticeState(checkScope(ensurePracticeState()));
    render();
    return;
  }

  if (action === 'submit-tautology-answer') {
    const value = button.dataset.value === 'true';
    commitCheckedPracticeState(submitTautologyAnswer(ensurePracticeState(), value));
    render();
    return;
  }

  if (action === 'submit-cell-value') {
    const value = button.dataset.value === 'true';
    commitCheckedPracticeState(submitCellValue(ensurePracticeState(), value));
    render();
    return;
  }

  if (action === 'select-evaluation-prediction') {
    const value = button.dataset.value === 'true';
    practiceState = selectEvaluationPrediction(ensurePracticeState(), value);
    persistPracticeState();
    render();
    return;
  }

  if (action === 'select-learner-node-value') {
    const nodeId = button.dataset.nodeId;
    if (!nodeId) {
      return;
    }
    const value = button.dataset.value === 'true';
    const currentState = ensurePracticeState();
    const nextState = selectLearnerNodeValue(currentState, nodeId, value);
    if (nextState.attempt.checkedAnswers > currentState.attempt.checkedAnswers) {
      commitCheckedPracticeState(nextState);
    } else {
      practiceState = nextState;
      persistPracticeState();
    }
    render();
    return;
  }

  if (action === 'check-evaluation') {
    commitCheckedPracticeState(checkEvaluation(ensurePracticeState()));
    render();
    return;
  }

  if (action === 'show-hint') {
    practiceState = showHint(ensurePracticeState());
    persistPracticeState();
    render();
    return;
  }

  if (action === 'palette-insert') {
    practiceState = paletteInsertToken(ensurePracticeState(), button.dataset.token, button.dataset.value);
    persistPracticeState();
    render();
    return;
  }
  if (action === 'palette-backspace') {
    practiceState = paletteBackspace(ensurePracticeState());
    persistPracticeState();
    render();
    return;
  }
  if (action === 'palette-undo') {
    practiceState = paletteUndo(ensurePracticeState());
    persistPracticeState();
    render();
    return;
  }
  if (action === 'proof-select-rule') {
    const state = ensurePracticeState();
    const config = getProofExerciseConfig(state.exercise.id);
    const rule = button.dataset.rule as RuleId | undefined;
    if (config && rule && config.allowedRules.includes(rule)) {
      practiceState = selectProofRule(state, rule);
      persistPracticeState();
      render();
    }
    return;
  }
  if (action === 'proof-toggle-cite') {
    const line = Number(button.dataset.line);
    if (Number.isInteger(line) && line > 0) {
      practiceState = toggleProofCitation(ensurePracticeState(), line);
      persistPracticeState();
      render();
    }
    return;
  }
  if (action === 'check-proof') {
    commitCheckedPracticeState(checkProofStep(ensurePracticeState()));
    render();
    return;
  }
  if (action === 'check-translation') {
    commitCheckedPracticeState(checkTranslation(ensurePracticeState()));
    render();
    return;
  }

  if (action === 'try-again') {
    practiceState = tryAgainPractice(ensurePracticeState());
    persistPracticeState();
    render();
    return;
  }

  if (action === 'check-counterexample') {
    commitCheckedPracticeState(checkCounterexample(ensurePracticeState()));
    render();
    return;
  }

  if (action === 'next') {
    advancePractice();
    return;
  }

  if (action === 'session-continue') {
    keepPractising();
    return;
  }

  if (action === 'session-finish') {
    finishPracticeSession();
  }
});

root.addEventListener('keydown', (event) => {
  if (handleTreeKeydown(event)) {
    event.preventDefault();
  }
});

render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
