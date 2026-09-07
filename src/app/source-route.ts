import sourcePack from '../../content/sources/logic-and-theism.json';
import {
  LOGIC_AND_THEISM_READING_ROUTE_ID,
  LOGIC_FOUNDATIONS_ROUTE_ID,
  getRoute,
  getRouteStep,
  markRouteItemSeen,
  requireRoute,
  setRouteCurrentItem,
  type RouteDefinition,
} from './routes';
import {
  planPrerequisites,
  plannedItemIds,
  type PlannedIntervention,
} from './planner';
import type { RouteDepth, RouteProgress, SourcePack } from './curriculum';
import { getLessonDefinition } from './lessons';
import { getExerciseDefinition } from './exercises';
import type { ProgressStore } from './storage';
import { getSourceLesson, isSourceLessonId } from './source-lessons';
import type { ResumePoint } from './progress-tracker';

function withLearnResume(
  store: ProgressStore,
  resume: Pick<ResumePoint, 'lessonId' | 'exerciseId'>,
): ProgressStore {
  return {
    ...store,
    resume: {
      ...store.resume,
      mode: 'learn',
      lessonId: resume.lessonId,
      exerciseId: resume.exerciseId,
      updatedAt: new Date().toISOString(),
    },
  };
}

export const LOGIC_AND_THEISM_SOURCE_PACK = sourcePack as SourcePack;

export const SOURCE_EXERCISE_IDS = [
  'lat-retrieve-conditional',
  'lat-check-universal',
  'lat-check-existential',
  'lat-classify-triangle',
  'lat-classify-visitor',
  'lat-formalize-readings',
  'lat-predict-descartes',
  'lat-interrogate-premises',
  'lat-transfer-kind',
  'lat-mastery-empty-domain',
] as const;

export function isSourceExerciseId(id: string): boolean {
  return (SOURCE_EXERCISE_IDS as readonly string[]).includes(id);
}

export function isSourceItemId(id: string): boolean {
  return isSourceLessonId(id) || isSourceExerciseId(id);
}

export function getSourcePack(id: string): SourcePack | undefined {
  if (id === LOGIC_AND_THEISM_SOURCE_PACK.id) {
    return LOGIC_AND_THEISM_SOURCE_PACK;
  }
  return undefined;
}

export function sourceAnchorForStep(route: RouteDefinition, stepId: string) {
  const step = route.steps.find((entry) => entry.id === stepId);
  if (!step?.anchor || !route.sourcePackId) {
    return undefined;
  }
  const pack = getSourcePack(route.sourcePackId);
  return pack?.anchors.find((anchor) => anchor.id === step.anchor);
}

export function routeDepth(
  store: ProgressStore,
  routeId = store.activeRouteId,
): RouteDepth {
  const route = getRoute(routeId);
  const readingStep = route?.steps.find((step) => step.depth === 'reading') ?? route?.steps[0];
  const recorded = readingStep
    ? store.routes[routeId]?.depthByStep?.[readingStep.id]
    : undefined;
  return recorded ?? route?.defaultDepth ?? 'reading';
}

export function sourcePlan(store: ProgressStore): PlannedIntervention[] {
  const route = requireRoute(LOGIC_AND_THEISM_READING_ROUTE_ID);
  const readingStep = route.steps.find((step) => step.depth === 'reading') ?? route.steps[0];
  return planPrerequisites(store.conceptEvidence, readingStep.requires ?? []);
}

export function plannedSourceItems(store: ProgressStore): string[] {
  const route = requireRoute(LOGIC_AND_THEISM_READING_ROUTE_ID);
  const readingStep = route.steps.find((step) => step.depth === 'reading') ?? route.steps[0];
  const masteryStep = route.steps.find((step) => step.depth === 'mastery');
  const injected = plannedItemIds(sourcePlan(store));
  const core = readingStep.items;
  const mastery =
    routeDepth(store) === 'mastery' && masteryStep ? masteryStep.items : [];
  return [...injected, ...core, ...mastery];
}

export function currentSourceItemId(store: ProgressStore): string {
  const items = plannedSourceItems(store);
  const progress = store.routes[LOGIC_AND_THEISM_READING_ROUTE_ID];
  const resumeId = store.resume.lessonId ?? store.resume.exerciseId;
  if (resumeId && items.includes(resumeId)) {
    return resumeId;
  }
  const seen = new Set(progress?.seenItems ?? []);
  return items.find((itemId) => !seen.has(itemId)) ?? items[0]!;
}

export function nextSourceItemId(store: ProgressStore, currentId: string): string | undefined {
  const items = plannedSourceItems(store);
  const index = items.indexOf(currentId);
  if (index < 0 || index >= items.length - 1) {
    return undefined;
  }
  return items[index + 1];
}

export function emptySourceRouteProgress(): RouteProgress {
  return {
    currentStepId: 'ii-26-28',
    depthByStep: { 'ii-26-28': 'reading' },
    seenItems: [],
  };
}

export function setActiveRoute(store: ProgressStore, routeId: string): ProgressStore {
  if (routeId === store.activeRouteId) {
    return store;
  }
  requireRoute(routeId);
  const routes = { ...store.routes };
  if (routeId === LOGIC_AND_THEISM_READING_ROUTE_ID && !routes[routeId]) {
    routes[routeId] = emptySourceRouteProgress();
  }
  const next: ProgressStore = { ...store, activeRouteId: routeId, routes };
  if (routeId === LOGIC_FOUNDATIONS_ROUTE_ID) {
    const keepLesson =
      store.resume.lessonId &&
      getLessonDefinition(store.resume.lessonId) &&
      !isSourceItemId(store.resume.lessonId)
        ? store.resume.lessonId
        : undefined;
    return withLearnResume(next, { lessonId: keepLesson, exerciseId: undefined });
  }
  const itemId = currentSourceItemId({ ...next, activeRouteId: routeId });
  const isExercise = Boolean(getExerciseDefinition(itemId));
  return withLearnResume(
    {
      ...next,
      routes: setRouteCurrentItem(next.routes, routeId, itemId),
    },
    {
      lessonId: isExercise ? undefined : itemId,
      exerciseId: isExercise ? itemId : undefined,
    },
  );
}

export function setRouteDepth(store: ProgressStore, depth: RouteDepth): ProgressStore {
  const routeId = LOGIC_AND_THEISM_READING_ROUTE_ID;
  const current = store.routes[routeId] ?? emptySourceRouteProgress();
  return {
    ...store,
    routes: {
      ...store.routes,
      [routeId]: {
        ...current,
        depthByStep: { ...current.depthByStep, 'ii-26-28': depth },
      },
    },
  };
}

export function completeSourceItem(store: ProgressStore, itemId: string): ProgressStore {
  const lessonsCompleted = isSourceLessonId(itemId) && !store.lessonsCompleted.includes(itemId)
    ? [...store.lessonsCompleted, itemId]
    : store.lessonsCompleted;
  const withSeen: ProgressStore = {
    ...store,
    lessonsCompleted,
    routes: markRouteItemSeen(store.routes, store.activeRouteId, itemId),
  };
  const nextId = nextSourceItemId(withSeen, itemId);
  const currentId = nextId ?? itemId;
  const isExercise = Boolean(getExerciseDefinition(currentId));
  return withLearnResume(
    {
      ...withSeen,
      routes: setRouteCurrentItem(withSeen.routes, withSeen.activeRouteId, currentId),
    },
    {
      lessonId: isExercise ? undefined : currentId,
      exerciseId: isExercise ? currentId : undefined,
    },
  );
}

export function sourceItemKind(itemId: string): 'lesson' | 'exercise' | undefined {
  if (getSourceLesson(itemId) || getLessonDefinition(itemId)) {
    if (getExerciseDefinition(itemId)) {
      return 'exercise';
    }
    return 'lesson';
  }
  if (getExerciseDefinition(itemId)) {
    return 'exercise';
  }
  return undefined;
}

export { getRouteStep };
