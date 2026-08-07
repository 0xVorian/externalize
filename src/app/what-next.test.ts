import { describe, expect, it } from 'vitest';
import { computeWhatNext } from './what-next';
import { buildSummaryFromStore } from './progress-render';
import { completeLesson, loadProgress, recordResult } from './storage';
const L0=['level0-01-letters','level0-02-truth','level0-03-and','level0-04-watch','level0-05-guided'] as const;
const cl=(s:ReturnType<typeof loadProgress>)=>{let n=s;for(const id of L0)n=completeLesson(n,id);return n;};
describe('computeWhatNext',()=>{
  it('resume for new learner',()=>{const s=loadProgress();expect(computeWhatNext('en',s,buildSummaryFromStore(s)).kind).toBe('resume');});
  it('weakest skill',()=>{let s=cl(loadProgress());for(let i=0;i<3;i++)s=recordResult(s,'eval-001',false,'selected-subconnective');expect(computeWhatNext('en',s,buildSummaryFromStore(s)).kind).toBe('weakest-skill');});
  it('next exercise',()=>{let s=cl(loadProgress());s=recordResult(s,'eval-001',true);expect(computeWhatNext('en',s,buildSummaryFromStore(s)).exerciseId).toBe('scope-012');});
});
