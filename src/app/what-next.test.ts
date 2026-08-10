import { describe, expect, it } from 'vitest';
import { computeWhatNext } from './what-next';
import { buildSummaryFromStore } from './progress-render';
import {
  beginPracticeAttempt,
  clearPracticeDraft,
  completeLesson,
  loadProgress,
  persistPracticeDraft,
  recordCheckedPracticeState,
} from './storage';
import { recordAttemptCheck } from './practice-attempt';
const L0=['level0-01-letters','level0-02-truth','level0-03-and','level0-04-watch','level0-05-guided'] as const;
const cl=(s:ReturnType<typeof loadProgress>)=>{let n=s;for(const id of L0)n=completeLesson(n,id);return n;};
const attempt=(s:ReturnType<typeof loadProgress>,clean:boolean)=>{let n=beginPracticeAttempt(clearPracticeDraft(s),'eval-001');let d=n.practiceDraft!;if(!clean){n=recordCheckedPracticeState(n,{...d,phase:'answered',feedbackTag:'incorrect-evaluation',attempt:recordAttemptCheck(d.attempt,false,'incorrect-evaluation')});n=persistPracticeDraft(n,{...n.practiceDraft!,phase:'ready',feedbackTag:undefined});d=n.practiceDraft!;}return recordCheckedPracticeState(n,{...d,phase:'answered',feedbackTag:'correct',attempt:recordAttemptCheck(d.attempt,true)});};
describe('computeWhatNext',()=>{
  it('resume for new learner',()=>{const s=loadProgress();expect(computeWhatNext('en',s,buildSummaryFromStore(s)).kind).toBe('resume');});
  it('weakest skill',()=>{let s=cl(loadProgress());for(let i=0;i<3;i++)s=attempt(s,false);expect(computeWhatNext('en',s,buildSummaryFromStore(s)).kind).toBe('weakest-skill');});
  it('next exercise',()=>{let s=cl(loadProgress());s=attempt(s,true);const next=computeWhatNext('en',s,buildSummaryFromStore(s));expect(next.exerciseId).toBe('eval-011');expect(next.detail).not.toContain('eval-011');expect(next.detail).toContain('P ∧ Q');});
});
