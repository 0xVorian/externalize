import {
  firstIncompleteLesson,
  isLearnPathComplete,
  lessonsForUnit,
} from './lessons';
import { conceptForLesson } from './prerequisites';
import type { ProgressStore } from './storage';

export type OutlineLessonStatus = 'done' | 'here' | 'upcoming' | 'locked';
export type OutlineUnitStatus = 'done' | 'current' | 'locked';

export type CourseOutlineLesson = {
  id: string;
  conceptId: string;
  status: OutlineLessonStatus;
};

export type CourseOutlineConceptGroup = {
  conceptId: string;
  lessons: CourseOutlineLesson[];
};

export type CourseOutlineUnit = {
  unit: 0 | 1 | 2;
  done: number;
  total: number;
  status: OutlineUnitStatus;
  current: boolean;
  waitingOnUnit?: 0 | 1;
  concepts: CourseOutlineConceptGroup[];
};

export function currentFoundationsUnit(store: ProgressStore): 0 | 1 | 2 {
  if (!store.level0Complete) {
    return 0;
  }
  if (!store.level1Complete) {
    return 1;
  }
  return 2;
}

export function hereLessonId(store: ProgressStore): string | undefined {
  if (isLearnPathComplete(store.lessonsCompleted)) {
    return undefined;
  }
  const lesson = firstIncompleteLesson(store.lessonsCompleted);
  if (store.lessonsCompleted.includes(lesson.id)) {
    return undefined;
  }
  return lesson.id;
}

function unitUnlocked(store: ProgressStore, unit: 0 | 1 | 2): boolean {
  if (unit === 0) {
    return true;
  }
  if (unit === 1) {
    return store.level0Complete;
  }
  return store.level1Complete;
}

function waitingOnUnit(unit: 0 | 1 | 2): 0 | 1 | undefined {
  if (unit === 1) {
    return 0;
  }
  if (unit === 2) {
    return 1;
  }
  return undefined;
}

export function groupUnitLessonsByConcept(
  unit: 0 | 1 | 2,
): { conceptId: string; lessonIds: string[] }[] {
  const groups: { conceptId: string; lessonIds: string[] }[] = [];
  for (const lesson of lessonsForUnit(unit)) {
    const conceptId = conceptForLesson(lesson.id) ?? lesson.id;
    const last = groups[groups.length - 1];
    if (last && last.conceptId === conceptId) {
      last.lessonIds.push(lesson.id);
    } else {
      groups.push({ conceptId, lessonIds: [lesson.id] });
    }
  }
  return groups;
}

export function buildCourseOutline(store: ProgressStore): CourseOutlineUnit[] {
  const current = currentFoundationsUnit(store);
  const hereId = hereLessonId(store);
  const completed = new Set(store.lessonsCompleted);
  const units: Array<0 | 1 | 2> = [0, 1, 2];

  return units.map((unit) => {
    const lessons = lessonsForUnit(unit);
    const done = lessons.filter((lesson) => completed.has(lesson.id)).length;
    const unlocked = unitUnlocked(store, unit);
    const allDone = done === lessons.length;
    const isCurrent = unit === current && !isLearnPathComplete(store.lessonsCompleted);
    const status: OutlineUnitStatus = allDone ? 'done' : isCurrent ? 'current' : 'locked';
    const waiting = unlocked ? undefined : waitingOnUnit(unit);

    return {
      unit,
      done,
      total: lessons.length,
      status,
      current: isCurrent,
      waitingOnUnit: waiting,
      concepts: groupUnitLessonsByConcept(unit).map((group) => ({
        conceptId: group.conceptId,
        lessons: group.lessonIds.map((id) => {
          if (completed.has(id)) {
            return { id, conceptId: group.conceptId, status: 'done' as const };
          }
          if (id === hereId) {
            return { id, conceptId: group.conceptId, status: 'here' as const };
          }
          if (!unlocked) {
            return { id, conceptId: group.conceptId, status: 'locked' as const };
          }
          return { id, conceptId: group.conceptId, status: 'upcoming' as const };
        }),
      })),
    };
  });
}
