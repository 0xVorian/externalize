import { describe, expect, it } from 'vitest';
import { evidenceKey } from './curriculum';
import { LEVEL_0_LESSONS, LEVEL_1_LESSONS, ALL_LEARN_LESSONS } from './lessons';
import {
  LOGIC_AND_THEISM_READING_ROUTE_ID,
  LOGIC_FOUNDATIONS_ROUTE_ID,
} from './routes';
import {
  completeCurrentStep,
  composeSessionPlan,
  offerOpening,
  sessionPosition,
  startSession,
  takeEnvelope,
} from './session-plan';
import { completeLesson, loadProgress, type ProgressStore } from './storage';
import { plannedSourceItems, setActiveRoute } from './source-route';

function cloneStore(store: ProgressStore): ProgressStore {
  return structuredClone(store);
}

function withLevel0Complete(store: ProgressStore): ProgressStore {
  let next = store;
  for (const lesson of LEVEL_0_LESSONS) {
    next = completeLesson(next, lesson.id);
  }
  return next;
}

describe('session envelope', () => {
  it('keeps 1–7 items and caps longer lists at 6', () => {
    expect(takeEnvelope(['a', 'b', 'c', 'd', 'e'])).toHaveLength(5);
    expect(takeEnvelope(['a', 'b', 'c', 'd', 'e', 'f', 'g'])).toHaveLength(7);
    expect(takeEnvelope(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])).toEqual([
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
    ]);
  });
});

describe('offerOpening', () => {
  it('offers a start round of the five Unit 0 lessons for a fresh learner', () => {
    const store = loadProgress();
    const offer = offerOpening(store, null);
    expect(offer.kind).toBe('start');
    expect(offer.plan?.steps.map((step) => step.itemId)).toEqual(
      LEVEL_0_LESSONS.map((lesson) => lesson.id),
    );
    expect(offer.plan?.steps).toHaveLength(5);
    expect(offer.plan?.estimatedMinutes).toBe(3);
  });

  it('continues with unseen Unit 1 lessons after Unit 0', () => {
    const store = withLevel0Complete(loadProgress());
    const offer = offerOpening(store, null);
    expect(offer.kind).toBe('continue');
    expect(offer.plan?.steps[0]?.itemId).toBe(LEVEL_1_LESSONS[0]!.id);
    expect(offer.plan?.steps.some((step) => step.itemId === LEVEL_0_LESSONS[0]!.id)).toBe(false);
  });

  it('offers a fixed quick-review of due SRS items only', () => {
    const now = Date.parse('2026-09-07T12:00:00.000Z');
    const store = withLevel0Complete(loadProgress());
    store.passed = ['eval-001', 'eval-011'];
    store.queue = [
      { exerciseId: 'eval-001', due: '2026-09-07T11:00:00.000Z', intervalDays: 1, ease: 2.5 },
      { exerciseId: 'eval-011', due: '2026-09-07T11:30:00.000Z', intervalDays: 1, ease: 2.5 },
      { exerciseId: 'tt-001', due: '2026-09-08T12:00:00.000Z', intervalDays: 1, ease: 2.5 },
    ];
    const offer = offerOpening(store, null, now);
    expect(offer.kind).toBe('quick-review');
    expect(offer.plan?.steps.map((step) => step.itemId)).toEqual(['eval-001', 'eval-011']);
    expect(offer.nextReviewAt).toBe('2026-09-08T12:00:00.000Z');
  });

  it('does not expand a started plan when new work becomes due', () => {
    const store = loadProgress();
    const offer = offerOpening(store, null);
    const session = startSession(offer.plan!, '2026-09-07T12:00:00.000Z');
    const frozen = session.plan.steps.map((step) => step.itemId);
    const later = withLevel0Complete(store);
    later.queue = [
      { exerciseId: 'eval-001', due: '2026-09-07T11:00:00.000Z', intervalDays: 1, ease: 2.5 },
    ];
    expect(session.plan.steps.map((step) => step.itemId)).toEqual(frozen);
    expect(offerOpening(later, session).kind).toBe('resume');
    expect(offerOpening(later, session).plan?.steps.map((step) => step.itemId)).toEqual(frozen);
  });

  it('resumes an interrupted active session with the same steps', () => {
    const store = loadProgress();
    const plan = offerOpening(store, null).plan!;
    let session = startSession(plan, '2026-09-07T12:00:00.000Z');
    session = completeCurrentStep(session);
    const offer = offerOpening(store, session);
    expect(offer.kind).toBe('resume');
    expect(offer.resumeIndex).toBe(1);
    expect(offer.plan?.steps.map((step) => step.itemId)).toEqual(plan.steps.map((step) => step.itemId));
  });

  it('walks position 1/n through completion without mutating mastery fields', () => {
    const store = loadProgress();
    const before = cloneStore(store);
    let session = startSession(offerOpening(store, null).plan!, '2026-09-07T12:00:00.000Z');
    const total = session.plan.steps.length;
    expect(sessionPosition(session)).toEqual({ current: 1, total });
    for (let i = 0; i < total; i += 1) {
      session = completeCurrentStep(session);
    }
    expect(session.status).toBe('completed');
    expect(store.conceptEvidence).toEqual(before.conceptEvidence);
    expect(store.queue).toEqual(before.queue);
    expect(store.passed).toEqual(before.passed);
  });

  it('starts a Sobel preparation round with injected items first', () => {
    const store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    const offer = offerOpening(store, null);
    expect(offer.kind).toBe('start');
    expect(offer.plan?.preparation).toBe(true);
    expect(offer.plan?.steps[0]?.itemId).toBe(plannedSourceItems(store)[0]);
    expect(offer.plan?.steps).toHaveLength(6);
  });

  it('skips the conditional bridge when evidence is already strong', () => {
    let store = setActiveRoute(loadProgress(), LOGIC_AND_THEISM_READING_ROUTE_ID);
    store = {
      ...store,
      conceptEvidence: {
        [evidenceKey('conditional', 'apply')]: {
          attempts: 4,
          cleanPasses: 4,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: new Date().toISOString(),
        },
      },
    };
    const offer = offerOpening(store, null);
    expect(offer.plan?.steps.some((step) => step.itemId === 'lat-conditional-bridge')).toBe(false);
    expect(offer.plan?.steps.map((step) => step.itemId)).toEqual(
      takeEnvelope(plannedSourceItems(store)),
    );
  });

  it('idles when the learn path is done and nothing is due', () => {
    let store = loadProgress();
    for (const lesson of ALL_LEARN_LESSONS) {
      store = completeLesson(store, lesson.id);
    }
    store = {
      ...store,
      passed: ['eval-001', 'eval-011', 'tt-001', 'counter-001'],
      queue: [
        {
          exerciseId: 'eval-001',
          due: '2026-09-10T12:00:00.000Z',
          intervalDays: 3,
          ease: 2.5,
        },
      ],
    };
    const offer = offerOpening(store, null, Date.parse('2026-09-07T12:00:00.000Z'));
    expect(offer.kind).toBe('idle');
    expect(offer.plan).toBeNull();
    expect(offer.nextReviewAt).toBe('2026-09-10T12:00:00.000Z');
  });

  it('offers lapse recovery from stale evidence when nothing remains or is due', () => {
    let store = loadProgress();
    for (const lesson of ALL_LEARN_LESSONS) {
      store = completeLesson(store, lesson.id);
    }
    store = {
      ...store,
      passed: ['eval-001', 'eval-011', 'tt-001', 'counter-001'],
      queue: [],
      conceptEvidence: {
        [evidenceKey('conditional', 'apply')]: {
          attempts: 4,
          cleanPasses: 4,
          transferPasses: 0,
          recentErrors: [],
          lastSeenAt: '2025-01-01T00:00:00.000Z',
        },
      },
    };
    const offer = offerOpening(store, null, Date.parse('2026-09-07T12:00:00.000Z'));
    expect(offer.kind).toBe('lapse-recovery');
    expect(offer.plan?.steps.some((step) => step.itemId === 'lat-retrieve-conditional')).toBe(true);
  });
});

describe('composeSessionPlan', () => {
  it('is a pure function', () => {
    const store = loadProgress();
    const before = cloneStore(store);
    composeSessionPlan(store, 'start', LEVEL_0_LESSONS.map((lesson) => lesson.id));
    expect(store).toEqual(before);
    expect(store.activeRouteId).toBe(LOGIC_FOUNDATIONS_ROUTE_ID);
  });
});
