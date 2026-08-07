import type { Locale } from '../i18n';
import { getLessonCopy, progressUi } from '../i18n';
import { EXERCISE_DEFINITIONS } from './exercises';
import { firstIncompleteLesson } from './lessons';
import type { ProgressSummary } from './progress-tracker';
import { skillForExercise } from './progress-tracker';
import type { ProgressStore } from './storage';
import { countReviewDue, getUnlockedExerciseIds, isPracticeUnlocked } from './storage';

export type WhatNextKind = 'resume' | 'weakest-skill' | 'next-exercise';
export type WhatNextSuggestion = { kind: WhatNextKind; title: string; detail: string; buttonLabel: string; action: 'continue-resume' | 'practice-exercise'; exerciseId?: string };

function pickExerciseForSkill(store: ProgressStore, skillId: string): string | undefined {
  const unlocked = new Set(getUnlockedExerciseIds(store));
  const candidates = EXERCISE_DEFINITIONS.filter((e) => unlocked.has(e.id) && skillForExercise(e) === skillId);
  if (!candidates.length) return undefined;
  const pool = candidates.filter((e) => !store.completed.includes(e.id));
  const list = pool.length ? pool : candidates;
  list.sort((a, b) => (store.exerciseStats[a.id]?.attempts ? store.exerciseStats[a.id].successes / store.exerciseStats[a.id].attempts : 0) - (store.exerciseStats[b.id]?.attempts ? store.exerciseStats[b.id].successes / store.exerciseStats[b.id].attempts : 0));
  return list[0]?.id;
}
function pickPreferredExercise(store: ProgressStore, incomplete: string[]): string {
  const now = Date.now();
  const due = store.queue.filter((e) => incomplete.includes(e.exerciseId) && new Date(e.due).getTime() <= now).sort((a,b)=>new Date(a.due).getTime()-new Date(b.due).getTime());
  return due.length ? due[0].exerciseId : incomplete[0];
}
export function computeWhatNext(locale: Locale, store: ProgressStore, summary: ProgressSummary): WhatNextSuggestion {
  const copy = progressUi(locale);
  if (isPracticeUnlocked(store) && summary.struggles.length) {
    const w = summary.struggles[0]; const ex = pickExerciseForSkill(store, w.id);
    if (ex) return { kind:'weakest-skill', title:copy.whatNextTitle, detail:copy.whatNextWeakestSkill(copy.skillLabel(w.id), Math.round(w.rate*100)), buttonLabel:copy.whatNextPracticeSkill, action:'practice-exercise', exerciseId:ex };
  }
  if (isPracticeUnlocked(store)) {
    const inc = getUnlockedExerciseIds(store).filter((id)=>!store.completed.includes(id));
    if (inc.length) { const rd=countReviewDue(store), ex=pickPreferredExercise(store,inc); return { kind:'next-exercise', title:copy.whatNextTitle, detail: rd>0?copy.whatNextReviewDue(rd):copy.whatNextNextExercise(ex), buttonLabel:copy.whatNextStartExercise, action:'practice-exercise', exerciseId:ex }; }
  }
  const r = store.resume;
  if (r.mode==='learn') { const lid=r.lessonId??firstIncompleteLesson(store.lessonsCompleted).id; return { kind:'resume', title:copy.whatNextTitle, detail:copy.whatNextResumeLesson(getLessonCopy(locale,lid).title), buttonLabel:copy.continueLearn, action:'continue-resume' }; }
  if (r.mode==='practice') return { kind:'resume', title:copy.whatNextTitle, detail:copy.whatNextResumePractice, buttonLabel:copy.continuePractice, action:'continue-resume' };
  return { kind:'resume', title:copy.whatNextTitle, detail:copy.whatNextResumeProgress, buttonLabel:copy.continueLearn, action:'continue-resume' };
}
