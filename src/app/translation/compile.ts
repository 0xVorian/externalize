import { connectiveLabel, parse, ParseError, type Formula } from '../../../engine';
import type { BuilderToken } from './types';

export type CompileResult =
  | { ok: true; formula: Formula }
  | { ok: false; error: string };

function tokenToText(token: BuilderToken): string {
  switch (token.kind) {
    case 'pred':
      return token.name;
    case 'connective':
      return connectiveLabel(token.connective);
    case 'paren':
      return token.side === 'open' ? '(' : ')';
  }
}

function parenBalance(tokens: BuilderToken[]): number | null {
  let depth = 0;
  for (const token of tokens) {
    if (token.kind === 'paren') {
      depth += token.side === 'open' ? 1 : -1;
      if (depth < 0) {
        return null;
      }
    }
  }
  return depth;
}

export function compileBuilderTokens(tokens: BuilderToken[]): CompileResult {
  if (tokens.length === 0) {
    return { ok: false, error: 'incomplete' };
  }

  const balance = parenBalance(tokens);
  if (balance === null || balance !== 0) {
    return { ok: false, error: 'unbalanced-parens' };
  }

  const text = tokens.map(tokenToText).join('');
  try {
    return { ok: true, formula: parse(text) };
  } catch (error) {
    if (error instanceof ParseError) {
      return { ok: false, error: 'incomplete' };
    }
    return { ok: false, error: 'incomplete' };
  }
}

export function compileBuilderState(tokens: BuilderToken[]): {
  formula?: Formula;
  compileError?: string;
} {
  const result = compileBuilderTokens(tokens);
  if (result.ok) {
    return { formula: result.formula };
  }
  return { compileError: result.error };
}
