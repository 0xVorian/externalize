import logicFoundationsRoute from '../../content/routes/logic-foundations.json';
import {
  ALL_LEARN_LESSONS,
  LEVEL_0_LESSONS,
  LEVEL_0_PRACTICE_UNLOCK_ORDER,
  LEVEL_1_LESSONS,
  LEVEL_1_PRACTICE_UNLOCK_ORDER,
  LEVEL_2_LESSONS,
  LEVEL_2_PRACTICE_UNLOCK_ORDER,
  PRACTICE_UNLOCK_ORDER,
  getLessonDefinition,
  type LessonDefinition,
} from './lessons';
import type {
  RouteDefinition,
  RouteProgress,
  RouteStep,
} from './curriculum';
import type { ResumePoint } from './progress-tracker';

export const LOGIC_FOUNDATIONS_ROUTE_ID = 'logic-foundations';

const ROUTES: RouteDefinition[] = [logicFoundationsRoute as RouteDefinition];

const ROUTES_BY_ID = new Map(ROUTES.map((route) => [route.id, route]));

export function listRoutes(): RouteDefinition[] {
  return ROUTES;
}

export function getRoute(routeId: string): RouteDefinition | undefined {
  return ROUTES_BY_ID.get(routeId);
}

export function requireRoute(routeId: string): RouteDefinition {
  const route = getRoute(routeId);
  if (!route) {
    throw new Error(`Unknown route: ${routeId}`);
  }
  return route;
}

export function routeSteps(routeId: string): RouteStep[] {
  return requireRoute(routeId).steps;
}

export function getRouteStep(routeId: string, stepId: string): RouteStep | undefined {
  return routeSteps(routeId).find((step) => step.id === stepId);
}

export function routeLessonIds(routeId: string): string[] {
  return routeSteps(routeId)
    .filter((step) => step.kind === 'learn')
    .flatMap((step) => step.items);
}

export function routePracticeIds(routeId: string): string[] {
  return routeSteps(routeId)
    .filter((step) => step.kind === 'practice' || step.kind === 'source')
    .flatMap((step) => step.items);
}

export function stepContainingItem(routeId: string, itemId: string): RouteStep | undefined {
  return routeSteps(routeId).find((step) => step.items.includes(itemId));
}

export function lessonsForRoute(routeId: string): LessonDefinition[] {
  if (routeId === LOGIC_FOUNDATIONS_ROUTE_ID) {
    return ALL_LEARN_LESSONS;
  }
  return routeLessonIds(routeId)
    .map((id) => getLessonDefinition(id))
    .filter((lesson): lesson is LessonDefinition => Boolean(lesson));
}

export function logicFoundationsLessonOrder(): string[] {
  return [
    ...LEVEL_0_LESSONS.map((lesson) => lesson.id),
    ...LEVEL_1_LESSONS.map((lesson) => lesson.id),
    ...LEVEL_2_LESSONS.map((lesson) => lesson.id),
  ];
}

export function logicFoundationsPracticeOrder(): string[] {
  return [
    ...LEVEL_0_PRACTICE_UNLOCK_ORDER,
    ...LEVEL_1_PRACTICE_UNLOCK_ORDER,
    ...LEVEL_2_PRACTICE_UNLOCK_ORDER,
  ];
}

export function deriveLogicFoundationsStepId(input: {
  lessonsCompleted: string[];
  resume?: ResumePoint;
}): string {
  const resumeItem = input.resume?.lessonId ?? input.resume?.exerciseId;
  if (resumeItem) {
    const step = stepContainingItem(LOGIC_FOUNDATIONS_ROUTE_ID, resumeItem);
    if (step) {
      return step.id;
    }
  }
  if (LEVEL_2_LESSONS.every((lesson) => input.lessonsCompleted.includes(lesson.id))) {
    return 'unit-2-practice';
  }
  if (LEVEL_1_LESSONS.every((lesson) => input.lessonsCompleted.includes(lesson.id))) {
    return 'unit-2-learn';
  }
  if (LEVEL_0_LESSONS.every((lesson) => input.lessonsCompleted.includes(lesson.id))) {
    return 'unit-1-learn';
  }
  return 'unit-0-learn';
}

export function initialRouteProgress(input: {
  lessonsCompleted: string[];
  passed?: string[];
  resume?: ResumePoint;
}): RouteProgress {
  const seen = new Set([
    ...input.lessonsCompleted,
    ...(input.passed ?? []),
  ]);
  if (input.resume?.lessonId) {
    seen.add(input.resume.lessonId);
  }
  if (input.resume?.exerciseId) {
    seen.add(input.resume.exerciseId);
  }
  return {
    currentStepId: deriveLogicFoundationsStepId(input),
    seenItems: [...seen],
  };
}

export function markRouteItemSeen(
  routes: Record<string, RouteProgress>,
  routeId: string,
  itemId: string,
): Record<string, RouteProgress> {
  const current = routes[routeId] ?? {};
  const seenItems = current.seenItems ?? [];
  return {
    ...routes,
    [routeId]: {
      ...current,
      seenItems: seenItems.includes(itemId) ? seenItems : [...seenItems, itemId],
    },
  };
}

export function setRouteCurrentItem(
  routes: Record<string, RouteProgress>,
  routeId: string,
  itemId: string,
): Record<string, RouteProgress> {
  const current = routes[routeId] ?? {};
  const step = stepContainingItem(routeId, itemId);
  return {
    ...routes,
    [routeId]: {
      ...current,
      currentStepId: step?.id ?? current.currentStepId,
    },
  };
}

export { PRACTICE_UNLOCK_ORDER };
