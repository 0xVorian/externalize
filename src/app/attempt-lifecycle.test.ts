import { describe, expect, it } from 'vitest';
import type { Formula } from '../../engine';
import { getExerciseDefinition } from './exercises';
import {
  beginPracticeAttempt,
  finalizePracticeAttempt,
  loadProgress,
  persistPracticeDraft,
  recordCheckedPracticeState,
  type ProgressStore,
} from './storage';
import {
  checkCounterexample,
  checkEvaluation,
  checkProofStep,
  checkScope,
  checkTranslation,
  createState,
  paletteInsertToken,
  practiceDraftSnapshot,
  selectEvaluationPrediction,
  selectNode,
  selectProofRule,
  setAtomValue,
  submitCellValue,
  submitTautologyAnswer,
  toggleProofCitation,
  tryAgainPractice,
  type AppState,
} from './state';

type Harness = { store: ProgressStore; state: AppState };

function open(exerciseId: string): Harness {
  const store = beginPracticeAttempt(loadProgress(), exerciseId);
  return {
    store,
    state: createState('en', getExerciseDefinition(exerciseId)!, store.practiceDraft),
  };
}

function commit(harness: Harness, state: AppState): Harness {
  const store = recordCheckedPracticeState(
    harness.store,
    practiceDraftSnapshot(state),
  );
  return {
    store,
    state: { ...state, attempt: store.practiceDraft!.attempt },
  };
}

function repair(harness: Harness): Harness {
  const state = tryAgainPractice(harness.state);
  const store = persistPracticeDraft(
    harness.store,
    practiceDraftSnapshot(state),
  );
  return { store, state };
}

function formula(kind: 'imp', left: string, right: string): Formula {
  return {
    kind,
    left: { kind: 'pred', name: left, args: [] },
    right: { kind: 'pred', name: right, args: [] },
  };
}

const cleanChecks: Array<[string, (state: AppState) => AppState]> = [
  ['identify-main-connective', (state) => checkScope(selectNode(state, state.tree.id))],
  ['evaluate-formula', (state) => checkEvaluation(selectEvaluationPrediction(state, false))],
  ['fill-truth-table-cell', (state) => submitCellValue(state, false)],
  ['find-counterexample', (state) => checkCounterexample(setAtomValue(state, 'Q', false))],
  ['classify-tautology', (state) => submitTautologyAnswer(state, true)],
  ['translate-en-to-formula', (state) => checkTranslation({
    ...state,
    builder: { ...state.builder, formula: formula('imp', 'P', 'Q') },
  })],
  ['proof-fill-step', (state) =>
    checkProofStep(
      toggleProofCitation(
        toggleProofCitation(selectProofRule(state, 'mp'), 1),
        2,
      ),
    )],
];

const exerciseForFamily: Record<string, string> = {
  'identify-main-connective': 'scope-001',
  'evaluate-formula': 'eval-001',
  'fill-truth-table-cell': 'tt-002',
  'find-counterexample': 'counter-001',
  'classify-tautology': 'val-001',
  'translate-en-to-formula': 'translate-001',
  'proof-fill-step': 'nd-001',
};

const repairedChecks: Array<[
  string,
  (state: AppState) => AppState,
  (state: AppState) => AppState,
]> = [
  [
    'identify-main-connective',
    (state) => checkScope(selectNode(state, state.tree.children[0]!.id)),
    (state) => checkScope(selectNode(state, state.tree.id)),
  ],
  [
    'evaluate-formula',
    (state) => checkEvaluation(selectEvaluationPrediction(state, true)),
    (state) => checkEvaluation(selectEvaluationPrediction(state, false)),
  ],
  [
    'fill-truth-table-cell',
    (state) => submitCellValue(state, true),
    (state) => submitCellValue(state, false),
  ],
  [
    'find-counterexample',
    (state) => checkCounterexample(state),
    (state) => checkCounterexample(setAtomValue(state, 'Q', false)),
  ],
  [
    'classify-tautology',
    (state) => submitTautologyAnswer(state, false),
    (state) => submitTautologyAnswer(state, true),
  ],
  [
    'translate-en-to-formula',
    (state) => checkTranslation({
      ...state,
      builder: { ...state.builder, formula: formula('imp', 'Q', 'P') },
    }),
    (state) => checkTranslation({
      ...state,
      builder: { ...state.builder, formula: formula('imp', 'P', 'Q') },
    }),
  ],
  [
    'proof-fill-step',
    (state) => checkProofStep(toggleProofCitation(selectProofRule(state, 'mp'), 1)),
    (state) => checkProofStep(toggleProofCitation(state, 2)),
  ],
];

describe('centralized practice attempt lifecycle', () => {
  it.each(cleanChecks)(
    'finalizes %s exactly once',
    (family, check) => {
      let harness = open(exerciseForFamily[family]);
      const before = harness.store;
      expect(before.attempted).toEqual([]);
      expect(before.passed).toEqual([]);
      expect(before.exerciseStats).toEqual({});

      harness = commit(harness, check(harness.state));
      const exerciseId = exerciseForFamily[family];
      expect(harness.store.attempted).toContain(exerciseId);
      expect(harness.store.passed).toContain(exerciseId);
      expect(harness.store.exerciseStats[exerciseId]?.attempts).toBe(1);
      expect(harness.store.exerciseStats[exerciseId]?.successes).toBe(1);
      expect(harness.store.queue.filter((entry) => entry.exerciseId === exerciseId)).toHaveLength(1);

      const once = harness.store;
      const replayed = finalizePracticeAttempt(
        harness.store,
        practiceDraftSnapshot(harness.state),
      );
      expect(replayed.exerciseStats).toEqual(once.exerciseStats);
      expect(replayed.skills).toEqual(once.skills);
      expect(replayed.queue).toEqual(once.queue);
    },
  );

  it('keeps wrong evaluation and repair in one persisted attempt', () => {
    let harness = open('eval-001');
    const attemptId = harness.state.attempt.id;

    harness = commit(
      harness,
      checkEvaluation(selectEvaluationPrediction(harness.state, true)),
    );
    expect(harness.store.attempted).toEqual(['eval-001']);
    expect(harness.store.passed).toEqual([]);
    expect(harness.store.exerciseStats).toEqual({});
    expect(harness.store.queue).toEqual([]);
    expect(harness.state.attempt.id).toBe(attemptId);

    harness = repair(harness);
    harness = commit(
      harness,
      checkEvaluation(selectEvaluationPrediction(harness.state, false)),
    );
    expect(harness.state.attempt.id).toBe(attemptId);
    expect(harness.store.exerciseStats['eval-001']).toMatchObject({
      attempts: 1,
      successes: 0,
      repairedPasses: 1,
    });
    expect(harness.store.errorCounts['incorrect-evaluation']).toBe(1);
    expect(harness.store.queue[0]?.intervalDays).toBe(0);
    expect(harness.store.passed).toEqual(['eval-001']);
  });

  it.each(repairedChecks)(
    'keeps %s repair inside one finalized attempt',
    (family, wrongCheck, correctCheck) => {
      const exerciseId = exerciseForFamily[family];
      let harness = open(exerciseId);
      const attemptId = harness.state.attempt.id;
      harness = commit(harness, wrongCheck(harness.state));
      expect(harness.store.attempted).toContain(exerciseId);
      expect(harness.store.passed).not.toContain(exerciseId);
      expect(harness.store.exerciseStats[exerciseId]).toBeUndefined();

      harness = repair(harness);
      harness = commit(harness, correctCheck(harness.state));
      expect(harness.state.attempt.id).toBe(attemptId);
      expect(harness.store.exerciseStats[exerciseId]).toMatchObject({
        attempts: 1,
        successes: 0,
        repairedPasses: 1,
      });
      expect(harness.store.passed).toContain(exerciseId);
    },
  );

  it('does not change learning metrics during evaluation exploration', () => {
    const opened = open('eval-001');
    const manipulated = setAtomValue(opened.state, 'P', false);
    const withPrediction = selectEvaluationPrediction(manipulated, true);
    const persisted = persistPracticeDraft(
      opened.store,
      practiceDraftSnapshot(withPrediction),
    );
    expect(persisted.attempted).toEqual([]);
    expect(persisted.passed).toEqual([]);
    expect(persisted.exerciseStats).toEqual({});
    expect(persisted.skills).toEqual({});
    expect(persisted.queue).toEqual([]);
  });

  it('hydrates a finalized draft without replaying finalization', () => {
    let harness = open('eval-001');
    harness = commit(
      harness,
      checkEvaluation(selectEvaluationPrediction(harness.state, false)),
    );
    const restored = createState(
      'en',
      getExerciseDefinition('eval-001')!,
      harness.store.practiceDraft,
    );
    const replayed = recordCheckedPracticeState(
      harness.store,
      practiceDraftSnapshot(restored),
    );
    expect(restored.attempt.status).toBe('finalized');
    expect(replayed.exerciseStats['eval-001']?.attempts).toBe(1);
    expect(replayed.queue).toEqual(harness.store.queue);
  });

  it('hydrates compact translation, proof, and counterexample drafts', () => {
    let translation = open('translate-001');
    translation.state = paletteInsertToken(translation.state, 'pred', 'P');
    translation.state = paletteInsertToken(translation.state, 'connective', 'imp');
    translation.state = paletteInsertToken(translation.state, 'pred', 'Q');
    translation.store = persistPracticeDraft(
      translation.store,
      practiceDraftSnapshot(translation.state),
    );
    const restoredTranslation = createState(
      'en',
      getExerciseDefinition('translate-001')!,
      translation.store.practiceDraft,
    );
    expect(restoredTranslation.builder.tokens).toHaveLength(3);
    expect(restoredTranslation.builder.formula?.kind).toBe('imp');

    let proof = open('nd-002');
    proof.state = toggleProofCitation(
      selectProofRule(proof.state, 'and-elim'),
      1,
    );
    proof.store = persistPracticeDraft(
      proof.store,
      practiceDraftSnapshot(proof.state),
    );
    const restoredProof = createState(
      'en',
      getExerciseDefinition('nd-002')!,
      proof.store.practiceDraft,
    );
    expect(restoredProof.proofRule).toBe('and-elim');
    expect(restoredProof.proofCites).toEqual([1]);
    proof = commit(proof, checkProofStep(proof.state));
    const restoredCheckedProof = createState(
      'en',
      getExerciseDefinition('nd-002')!,
      proof.store.practiceDraft,
    );
    expect(restoredCheckedProof.proofDerivedFormula).toBe('P');

    let counter = open('counter-001');
    counter.state = setAtomValue(counter.state, 'Q', false);
    counter.store = persistPracticeDraft(
      counter.store,
      practiceDraftSnapshot(counter.state),
    );
    const restoredCounter = createState(
      'en',
      getExerciseDefinition('counter-001')!,
      counter.store.practiceDraft,
    );
    expect(restoredCounter.assignment.Q).toBe(false);
  });

  it('preserves an active draft when another exercise is opened', () => {
    let translation = open('translate-001');
    translation.state = paletteInsertToken(translation.state, 'pred', 'P');
    translation.store = persistPracticeDraft(
      translation.store,
      practiceDraftSnapshot(translation.state),
    );

    let store = beginPracticeAttempt(translation.store, 'nd-002');
    store = beginPracticeAttempt(store, 'translate-001');
    const restored = createState(
      'en',
      getExerciseDefinition('translate-001')!,
      store.practiceDraft,
    );
    expect(restored.builder.tokens).toHaveLength(1);
    expect(restored.builder.tokens[0]).toMatchObject({ kind: 'pred', name: 'P' });
  });
});
