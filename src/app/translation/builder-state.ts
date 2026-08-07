import type { ConnectiveKind } from '../../../engine';
import type { BuilderToken, FormulaBuilderState } from './types';
import { compileBuilderState } from './compile';

export type BuilderReducerState = FormulaBuilderState & {
  past: BuilderToken[][];
};

export function createBuilderReducerState(): BuilderReducerState {
  return { tokens: [], past: [] };
}

function withCompiled(tokens: BuilderToken[]): FormulaBuilderState {
  return { tokens, ...compileBuilderState(tokens) };
}

function pushPast(state: BuilderReducerState): BuilderToken[][] {
  return [...state.past, state.tokens.map((token) => ({ ...token }))].slice(-20);
}

export function builderInsert(state: BuilderReducerState, token: BuilderToken): BuilderReducerState {
  const tokens = [...state.tokens, token];
  return { ...withCompiled(tokens), past: pushPast(state) };
}

export function builderBackspace(state: BuilderReducerState): BuilderReducerState {
  if (state.tokens.length === 0) {
    return state;
  }
  const tokens = state.tokens.slice(0, -1);
  return { ...withCompiled(tokens), past: pushPast(state) };
}

export function builderUndo(state: BuilderReducerState): BuilderReducerState {
  if (state.past.length === 0) {
    return state;
  }
  const past = [...state.past];
  const tokens = past.pop() ?? [];
  return { ...withCompiled(tokens), past };
}

export function parsePaletteInsert(
  tokenKind: string | undefined,
  value: string | undefined,
): BuilderToken | null {
  if (!tokenKind || value === undefined) {
    return null;
  }
  if (tokenKind === 'atom') {
    return { kind: 'atom', name: value };
  }
  if (tokenKind === 'connective') {
    return { kind: 'connective', connective: value as ConnectiveKind };
  }
  if (tokenKind === 'paren' && (value === 'open' || value === 'close')) {
    return { kind: 'paren', side: value };
  }
  return null;
}
