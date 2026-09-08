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
  LOGIC_AND_THEISM_READING_ROUTE_ID,
  LOGIC_FOUNDATIONS_ROUTE_ID,
} from './app/routes';
import {
  completeSourceItem,
  currentSourceItemId,
  isPlannedSourceSequenceComplete,
  nextSourceItemId,
  plannedSourceItems,
  routeDepth,
  setActiveRoute,
  setRouteDepth,
  sourcePlan,
  sourceItemKind,
  isSourceExerciseId,
  isSourceItemId,
} from './app/source-route';
import { renderSourceLearnView } from './app/source-learn-render';
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
  selectClassificationChoice,
  checkClassification,
  type AppState,
} from './app/state';
import {
  createLessonState,
  advanceWatchStep,
  selectGuidedValue,
  checkGuidedSelection,
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
} from './app/progress-visibility';
import {
  announceUnitComplete,
  clearPracticeProgressMoment,
  clearUnitCompleteNotice,
  createPracticeUiState,
  disarmLiveAnnouncements,
  isPracticeUiSessionComplete,
  practiceUiContext,
  preparePracticeEntry,
  recordPracticeFinalization,
  resetPracticeUiState,
  restartPracticeSession,
} from './app/practice-ui-state';
import { currentScaffoldLevel } from './app/evaluation-scaffold';
import {
  offerOpening,
  startSession,
  resumeSession,
  completeCurrentStep,
  currentSessionStep,
  sessionPosition,
  isSessionComplete,
  sessionSegmentMs,
  type PersistedSession,
} from './app/session-plan';
import {
  loadActiveSession,
  saveActiveSession,
  clearActiveSession,
} from './app/session-persistence';
import { recordSessionEvent } from './app/session-telemetry';
import { renderSessionOpening } from './app/session-opening-render';
import { renderRoundComplete } from './app/session-complete-render';
import { isLastWatchUnit } from './app/session-units';

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
let sourcePracticeState: AppState | null = null;
let exploreState: ExploreState = createExploreState(locale);
let onboardingStep = 0;
let importNotice: { kind: 'success' | 'error'; message: string } | null = null;
let practiceUi = createPracticeUiState();
type ShellSurface = 'opening' | 'session' | 'complete' | 'browse';
let surface: ShellSurface = 'opening';
let activeSession: PersistedSession | null = loadActiveSession();
let recordedOpeningOffer = false;

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

function isSourceLearn(store: ProgressStore = progress): boolean {
  return store.activeRouteId === LOGIC_AND_THEISM_READING_ROUTE_ID;
}

function loadLessonFromProgress(store: ProgressStore): LessonState {
  if (isSourceLearn(store)) {
    const itemId = currentSourceItemId(store);
    const lesson = getLessonDefinition(itemId);
    if (lesson) {
      return createLessonState(locale, lesson);
    }
    return createLessonState(locale, getLessonDefinition('lat-ii-26-context')!);
  }
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

function loadSourcePracticeState(): AppState | null {
  if (!isSourceLearn()) {
    return null;
  }
  const itemId = currentSourceItemId(progress);
  if (sourceItemKind(itemId) !== 'exercise') {
    return null;
  }
  const exercise = getExerciseDefinition(itemId);
  if (!exercise) {
    return null;
  }
  const withAttempt = beginPracticeAttempt(progress, itemId);
  persistProgress(withAttempt);
  return createState(locale, exercise, withAttempt.practiceDraft);
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
    ...practiceUiContext(practiceUi, state.attempt.id),
    scaffoldLevel: currentScaffoldLevel(progress.exerciseStats[state.exercise.id]?.scaffoldLevel),
    session: sessionChrome(),
    ...(surface === 'session' ? { sessionComplete: false } : {}),
  };
}

function persistProgress(next: ProgressStore): void {
  progress = saveProgress(next);
}

function currentOffer() {
  return offerOpening(progress, activeSession);
}

function sessionChrome(): { current: number; total: number } | undefined {
  if (surface !== 'session' || !activeSession) {
    return undefined;
  }
  return sessionPosition(activeSession);
}

function isSourceSessionItem(): boolean {
  if (surface !== 'session' || !activeSession) {
    return false;
  }
  const step = currentSessionStep(activeSession);
  return Boolean(step && isSourceItemId(step.itemId));
}

function loadStepItem(itemId: string, unitIndex?: number): void {
  if (getExerciseDefinition(itemId)) {
    if (isSourceExerciseId(itemId) || isSourceItemId(itemId)) {
      const exercise = getExerciseDefinition(itemId)!;
      const withAttempt = beginPracticeAttempt(progress, itemId);
      persistProgress(withAttempt);
      sourcePracticeState = createState(locale, exercise, withAttempt.practiceDraft);
      practiceState = null;
      mode = 'learn';
      return;
    }
    practiceUi = preparePracticeEntry(practiceUi);
    practiceState = loadPracticeState(itemId);
    sourcePracticeState = null;
    mode = 'practice';
    return;
  }
  const lesson = getLessonDefinition(itemId);
  if (lesson) {
    lessonState = createLessonState(
      locale,
      lesson,
      unitIndex !== undefined ? { watchStep: unitIndex } : undefined,
    );
    sourcePracticeState = null;
    mode = 'learn';
    if (!isSourceItemId(itemId)) {
      persistLessonResume();
    }
  }
}

function enterSession(session: PersistedSession, action: 'started' | 'interrupted' = 'started'): void {
  activeSession = session;
  saveActiveSession(session);
  if (action === 'started') {
    recordSessionEvent({
      kind: action === 'started' && session.currentIndex > 0 ? 'resume' : session.plan.kind,
      action: 'started',
      stepCount: session.plan.steps.length,
    });
  }
  surface = 'session';
  const step = currentSessionStep(session);
  if (step) {
    loadStepItem(step.itemId, step.unitIndex);
  }
}

function beginOfferedSession(): void {
  const offer = currentOffer();
  if (!offer.plan) {
    return;
  }
  if (offer.kind === 'resume' && activeSession) {
    enterSession(resumeSession(activeSession, new Date().toISOString()));
    render();
    return;
  }
  enterSession(startSession(offer.plan, new Date().toISOString()));
  render();
}

function finishSessionRound(): void {
  if (activeSession) {
    recordSessionEvent({
      kind: activeSession.plan.kind,
      action: 'completed',
      stepCount: activeSession.plan.steps.length,
      durationMs: sessionSegmentMs(activeSession),
    });
  }
  surface = 'complete';
  render();
}

function advanceActiveSession(): void {
  if (!activeSession) {
    render();
    return;
  }
  activeSession = completeCurrentStep(activeSession);
  saveActiveSession(activeSession);
  if (isSessionComplete(activeSession)) {
    finishSessionRound();
    return;
  }
  const step = currentSessionStep(activeSession);
  if (step) {
    loadStepItem(step.itemId, step.unitIndex);
  }
  render();
}

function completeSessionItem(itemId: string): void {
  const step = activeSession ? currentSessionStep(activeSession) : undefined;
  const unitIndex = step?.itemId === itemId ? step.unitIndex : undefined;
  const lesson = getLessonDefinition(itemId);
  if (isSourceItemId(itemId) || isSourceExerciseId(itemId)) {
    persistProgress(completeSourceItem(progress, itemId));
  } else if (lesson && !getExerciseDefinition(itemId)) {
    if (lesson.type === 'watch' && unitIndex !== undefined && !isLastWatchUnit(itemId, unitIndex)) {
      persistProgress(
        updateResume(progress, {
          mode: 'learn',
          lessonId: itemId,
          watchStep: unitIndex + 1,
          watchComplete: false,
        }),
      );
    } else {
      persistProgress(completeLesson(progress, itemId));
    }
  }
  advanceActiveSession();
}

function exitActiveSession(): void {
  if (activeSession && !isSessionComplete(activeSession)) {
    saveActiveSession(activeSession);
    recordSessionEvent({
      kind: activeSession.plan.kind,
      action: 'interrupted',
      stepCount: activeSession.plan.steps.length,
      durationMs: sessionSegmentMs(activeSession),
    });
  }
  surface = 'opening';
  recordedOpeningOffer = false;
  render();
}

function closeCompletedSession(): void {
  clearActiveSession();
  activeSession = null;
  surface = 'opening';
  recordedOpeningOffer = false;
  render();
}

function startAnotherRound(): void {
  clearActiveSession();
  activeSession = null;
  const offer = offerOpening(progress, null);
  if (!offer.plan) {
    surface = 'opening';
    recordedOpeningOffer = false;
    render();
    return;
  }
  enterSession(startSession(offer.plan, new Date().toISOString()));
  render();
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
    practiceUi = recordPracticeFinalization(
      practiceUi,
      nextState.attempt.id,
      skillForExercise(nextState.exercise),
      moments,
      primary,
    );
  }
}

function ensurePracticeState(): AppState {
  if (!practiceState) {
    practiceState = loadPracticeState();
  }
  return practiceState;
}

function updatePracticeState(update: (state: AppState) => AppState): void {
  practiceState = update(ensurePracticeState());
  persistPracticeState();
  render();
}

function checkPracticeState(check: (state: AppState) => AppState): void {
  commitCheckedPracticeState(check(ensurePracticeState()));
  render();
}

function render(): void {
  document.documentElement.lang = locale;
  const practiceUnlocked = isPracticeUnlocked(progress);

  if (needsOnboarding(progress)) { root.innerHTML = renderOnboarding(locale, onboardingStep); return; }

  if (surface === 'opening') {
    const offer = currentOffer();
    if (!recordedOpeningOffer) {
      recordSessionEvent({
        kind: offer.kind,
        action: 'offered',
        stepCount: offer.plan?.steps.length ?? 0,
      });
      recordedOpeningOffer = true;
    }
    root.innerHTML = renderSessionOpening({ locale, offer, practiceUnlocked });
    return;
  }

  if (surface === 'complete') {
    root.innerHTML = renderRoundComplete({
      locale,
      nextReviewAt: currentOffer().nextReviewAt,
    });
    return;
  }

  const session = sessionChrome();
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
    if (isSourceLearn() || isSourceSessionItem()) {
      const items = plannedSourceItems(progress);
      const itemId =
        surface === 'session' && currentSessionStep(activeSession!)
          ? currentSessionStep(activeSession!)!.itemId
          : currentSourceItemId(progress);
      if (sourceItemKind(itemId) === 'exercise') {
        sourcePracticeState = sourcePracticeState?.exercise.id === itemId
          ? sourcePracticeState
          : (() => {
              const exercise = getExerciseDefinition(itemId);
              if (!exercise) return null;
              const withAttempt = beginPracticeAttempt(progress, itemId);
              persistProgress(withAttempt);
              return createState(locale, exercise, withAttempt.practiceDraft);
            })();
      } else {
        sourcePracticeState = null;
        if (lessonState.lesson.id !== itemId) {
          const lesson = getLessonDefinition(itemId);
          if (lesson) {
            lessonState = createLessonState(locale, lesson);
          }
        }
      }
      const itemIndex = Math.max(1, items.indexOf(itemId) + 1);
      root.innerHTML = renderSourceLearnView({
        locale,
        practiceUnlocked,
        activeRouteId: progress.activeRouteId,
        depth: routeDepth(progress),
        plan: sourcePlan(progress),
        itemIndex,
        itemTotal: items.length,
        isTerminal: surface === 'session' ? false : !nextSourceItemId(progress, itemId),
        routeComplete: isPlannedSourceSequenceComplete(progress),
        lessonState: sourcePracticeState ? undefined : lessonState,
        practiceState: sourcePracticeState ?? undefined,
        session,
      });
      practiceUi = disarmLiveAnnouncements(practiceUi);
      return;
    }
    root.innerHTML = renderLessonView(lessonState, {
      practiceUnlocked,
      level0Complete: progress.level0Complete,
      level1Complete: progress.level1Complete,
      learnPathComplete: isLearnPathComplete(progress.lessonsCompleted),
      activeRouteId: progress.activeRouteId,
      learnProgress: deriveLearnProgress(lessonState.lesson.id, progress.lessonsCompleted),
      unitCompleteNotice: practiceUi.unitCompleteNotice,
      unitCompleteNoticeLive: practiceUi.unitCompleteNoticeLive,
      session,
    });
    practiceUi = disarmLiveAnnouncements(practiceUi);
    return;
  }

  const context = practiceViewContext();
  root.innerHTML = renderApp(ensurePracticeState(), progress.queue.length, practiceUnlocked, context);
  practiceUi = disarmLiveAnnouncements(practiceUi);
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
  if (sourcePracticeState) {
    sourcePracticeState = applyLocale(sourcePracticeState, locale);
  }
  render();
}

function setMode(nextMode: AppMode): void {
  if (nextMode === 'practice' && !isPracticeUnlocked(progress)) {
    return;
  }
  if (nextMode === mode && surface === 'browse') {
    return;
  }
  surface = 'browse';
  if (nextMode !== 'progress') {
    importNotice = null;
  }
  if (nextMode !== 'learn') {
    practiceUi = clearUnitCompleteNotice(practiceUi);
  }
  mode = nextMode;
  if (needsOnboarding(progress)) { root.innerHTML = renderOnboarding(locale, onboardingStep); return; }
  if (mode === 'progress') {
    persistProgress(updateResume(progress, { mode: 'progress' }));
  } else if (mode === 'practice') {
    practiceUi = preparePracticeEntry(practiceUi);
    practiceState = loadPracticeState();
  } else if (mode === 'explore') {
    exploreState = createExploreState(locale, exploreState.formulaIndex);
    persistProgress(updateResume(progress, { mode: 'explore' }));
  } else {
    lessonState = loadLessonFromProgress(progress);
    sourcePracticeState = loadSourcePracticeState();
    if (!isSourceLearn()) {
      persistLessonResume();
    }
  }
  render();
}

function finishOnboarding(): void {
  persistProgress(completeOnboarding(progress));
  onboardingStep = 0;
  surface = 'opening';
  recordedOpeningOffer = false;
  render();
}
function startPracticeExercise(exerciseId: string): void {
  if (!isPracticeUnlocked(progress)) return;
  if (
    progress.practiceDraft?.attempt.exerciseId === exerciseId &&
    progress.practiceDraft.attempt.status === 'finalized'
  ) {
    persistProgress(clearPracticeDraft(progress));
  }
  practiceUi = preparePracticeEntry(practiceUi);
  surface = 'browse';
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
  practiceUi = clearUnitCompleteNotice(practiceUi);
  const before = {
    level0: progress.level0Complete,
    level1: progress.level1Complete,
    level2: progress.level2Complete,
  };
  persistProgress(completeLesson(progress, lessonState.lesson.id));
  if (!before.level0 && progress.level0Complete) {
    practiceUi = announceUnitComplete(practiceUi, unitCompleteMessage(0));
  } else if (!before.level1 && progress.level1Complete) {
    practiceUi = announceUnitComplete(practiceUi, unitCompleteMessage(1));
  } else if (!before.level2 && progress.level2Complete) {
    practiceUi = announceUnitComplete(practiceUi, unitCompleteMessage(2));
  }

  if (isLearnPathComplete(progress.lessonsCompleted)) {
    practiceUi = preparePracticeEntry(practiceUi);
    surface = 'browse';
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
  if (surface === 'session' && activeSession) {
    const step = currentSessionStep(activeSession);
    if (!step) {
      return;
    }
    completeSessionItem(step.itemId);
    return;
  }
  if (isSourceLearn()) {
    persistProgress(completeSourceItem(progress, currentSourceItemId(progress)));
    sourcePracticeState = null;
    lessonState = loadLessonFromProgress(progress);
    render();
    return;
  }
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
  if (surface === 'session' && activeSession) {
    const step = currentSessionStep(activeSession);
    if (step) {
      completeSessionItem(step.itemId);
    }
    return;
  }
  if (isPracticeUiSessionComplete(practiceUi)) {
    render();
    return;
  }
  practiceUi = clearPracticeProgressMoment(practiceUi);
  practiceUi = clearUnitCompleteNotice(practiceUi);
  const nextId = selectNextExerciseId(progress);
  persistProgress(clearPracticeDraft(progress));
  practiceState = loadPracticeState(nextId);
  render();
}

function keepPractising(): void {
  practiceUi = restartPracticeSession(practiceUi);
  const state = ensurePracticeState();
  if (state.attempt.status === 'finalized') {
    const nextId = selectNextExerciseId(progress);
    persistProgress(clearPracticeDraft(progress));
    practiceState = loadPracticeState(nextId);
  }
  render();
}

function finishPracticeSession(): void {
  practiceUi = clearUnitCompleteNotice(clearPracticeProgressMoment(practiceUi));
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

function invalidateEphemeralSession(): void {
  clearActiveSession();
  activeSession = null;
  recordedOpeningOffer = false;
}

function applyImportedProgress(imported: ProgressStore, importedLocale?: Locale): void {
  invalidateEphemeralSession();
  progress = saveProgress(imported);
  lessonState = loadLessonFromProgress(progress);
  practiceState = null;
  exploreState = createExploreState(locale);
  practiceUi = resetPracticeUiState();
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
    surface = 'browse';
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
  const raw = event.target;
  const el = raw instanceof Element ? raw : raw instanceof Node ? raw.parentElement : null;
  const button = el?.closest<HTMLElement>('[data-action]');
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

  if (action === 'session-begin') {
    beginOfferedSession();
    return;
  }
  if (action === 'session-exit') {
    exitActiveSession();
    return;
  }
  if (action === 'session-done') {
    closeCompletedSession();
    return;
  }
  if (action === 'session-another') {
    startAnotherRound();
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

  if (action === 'set-route') {
    const routeId = button.dataset.routeId;
    if (!routeId || (routeId !== LOGIC_FOUNDATIONS_ROUTE_ID && routeId !== LOGIC_AND_THEISM_READING_ROUTE_ID)) {
      return;
    }
    persistProgress(setActiveRoute(progress, routeId));
    sourcePracticeState = null;
    lessonState = loadLessonFromProgress(progress);
    sourcePracticeState = loadSourcePracticeState();
    mode = 'learn';
    render();
    return;
  }

  if (action === 'set-route-depth') {
    const depth = button.dataset.depth;
    if (depth !== 'reading' && depth !== 'mastery') {
      return;
    }
    persistProgress(setRouteDepth(progress, depth));
    sourcePracticeState = null;
    lessonState = loadLessonFromProgress(progress);
    render();
    return;
  }

  if (action === 'select-choice') {
    const choiceId = button.dataset.choiceId;
    if (!choiceId) {
      return;
    }
    if (isSourceLearn() && sourcePracticeState) {
      sourcePracticeState = selectClassificationChoice(sourcePracticeState, choiceId);
      persistProgress(persistPracticeDraft(progress, practiceDraftSnapshot(sourcePracticeState)));
      render();
      return;
    }
    updatePracticeState((state) => selectClassificationChoice(state, choiceId));
    return;
  }

  if (action === 'check-classification') {
    if (isSourceLearn() && sourcePracticeState) {
      const next = checkClassification(sourcePracticeState);
      sourcePracticeState = next;
      persistProgress(recordCheckedPracticeState(progress, practiceDraftSnapshot(next)));
      if (progress.practiceDraft) {
        sourcePracticeState = { ...next, attempt: progress.practiceDraft.attempt };
      }
      render();
      return;
    }
    checkPracticeState(checkClassification);
    return;
  }

  if (action === 'source-next' || action === 'source-complete') {
    if (surface === 'session' && activeSession) {
      const step = currentSessionStep(activeSession);
      if (step) {
        completeSessionItem(step.itemId);
      }
      return;
    }
    persistProgress(completeSourceItem(progress, currentSourceItemId(progress)));
    sourcePracticeState = null;
    lessonState = loadLessonFromProgress(progress);
    render();
    return;
  }

  if (action === 'try-again') {
    if (isSourceLearn()) {
      if (!sourcePracticeState) {
        sourcePracticeState = loadSourcePracticeState();
      }
      if (sourcePracticeState) {
        sourcePracticeState = tryAgainPractice(sourcePracticeState);
        persistProgress(persistPracticeDraft(progress, practiceDraftSnapshot(sourcePracticeState)));
        render();
      }
      return;
    }
    updatePracticeState(tryAgainPractice);
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

  if (action === 'select-guided-value') {
    if (mode !== 'learn') {
      return;
    }
    const value = button.dataset.value === 'true';
    lessonState = selectGuidedValue(lessonState, value);
    render();
    return;
  }

  if (action === 'check-guided-value') {
    if (mode !== 'learn') {
      return;
    }
    lessonState = checkGuidedSelection(lessonState);
    persistLessonResume();
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
      return;
    }
    if (mode === 'practice') {
      updatePracticeState((state) => setAtomValue(state, atom, value));
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
    updatePracticeState((state) => selectNode(state, nodeId));
    return;
  }

  if (action === 'check-scope') {
    checkPracticeState(checkScope);
    return;
  }

  if (action === 'submit-tautology-answer') {
    const value = button.dataset.value === 'true';
    checkPracticeState((state) => submitTautologyAnswer(state, value));
    return;
  }

  if (action === 'submit-cell-value') {
    const value = button.dataset.value === 'true';
    checkPracticeState((state) => submitCellValue(state, value));
    return;
  }

  if (action === 'select-evaluation-prediction') {
    const value = button.dataset.value === 'true';
    updatePracticeState((state) => selectEvaluationPrediction(state, value));
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
    checkPracticeState(checkEvaluation);
    return;
  }

  if (action === 'show-hint') {
    updatePracticeState(showHint);
    return;
  }

  if (action === 'palette-insert') {
    updatePracticeState((state) =>
      paletteInsertToken(state, button.dataset.token, button.dataset.value),
    );
    return;
  }
  if (action === 'palette-backspace') {
    updatePracticeState(paletteBackspace);
    return;
  }
  if (action === 'palette-undo') {
    updatePracticeState(paletteUndo);
    return;
  }
  if (action === 'proof-select-rule') {
    const state = ensurePracticeState();
    const config = getProofExerciseConfig(state.exercise.id);
    const rule = button.dataset.rule as RuleId | undefined;
    if (config && rule && config.allowedRules.includes(rule)) {
      updatePracticeState((current) => selectProofRule(current, rule));
    }
    return;
  }
  if (action === 'proof-toggle-cite') {
    const line = Number(button.dataset.line);
    if (Number.isInteger(line) && line > 0) {
      updatePracticeState((state) => toggleProofCitation(state, line));
    }
    return;
  }
  if (action === 'check-proof') {
    checkPracticeState(checkProofStep);
    return;
  }
  if (action === 'check-translation') {
    checkPracticeState(checkTranslation);
    return;
  }

  if (action === 'check-counterexample') {
    checkPracticeState(checkCounterexample);
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

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Externalize service worker registration failed', error);
    });
  });
}
