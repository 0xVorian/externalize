import type { ConnectiveKind, Formula } from '../ast/types';
import { atom, not, and, or, imp, iff } from '../ast/types';

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

type Token =
  | { type: 'atom'; value: string }
  | { type: 'op'; value: string }
  | { type: 'lparen' }
  | { type: 'rparen' }
  | { type: 'eof' };

const OPERATORS = new Set(['¬', '!', '∧', '&', '∨', '|', '→', '->', '↔', '<->']);

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'lparen' });
      i += 1;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'rparen' });
      i += 1;
      continue;
    }

    if (input.startsWith('->', i) || input.startsWith('<->', i)) {
      tokens.push({ type: 'op', value: input.startsWith('<->', i) ? '<->' : '->' });
      i += input.startsWith('<->', i) ? 3 : 2;
      continue;
    }

    if (OPERATORS.has(ch)) {
      tokens.push({ type: 'op', value: ch });
      i += 1;
      continue;
    }

    if (/[A-Za-z]/.test(ch)) {
      let name = ch;
      i += 1;
      while (i < input.length && /[A-Za-z0-9_]/.test(input[i])) {
        name += input[i];
        i += 1;
      }
      tokens.push({ type: 'atom', value: name });
      continue;
    }

    throw new ParseError(`Unexpected character '${ch}' at position ${i}`);
  }

  tokens.push({ type: 'eof' });
  return tokens;
}

class Parser {
  private index = 0;
  private readonly tokens: Token[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): Formula {
    const formula = this.parseIff();
    this.expect('eof');
    return formula;
  }

  private parseIff(): Formula {
    let left = this.parseImp();

    while (this.matchOp('↔', '<->')) {
      const right = this.parseImp();
      left = iff(left, right);
    }

    return left;
  }

  private parseImp(): Formula {
    let left = this.parseOr();

    while (this.matchOp('→', '->')) {
      const right = this.parseOr();
      left = imp(left, right);
    }

    return left;
  }

  private parseOr(): Formula {
    let left = this.parseAnd();

    while (this.matchOp('∨', '|')) {
      const right = this.parseAnd();
      left = or(left, right);
    }

    return left;
  }

  private parseAnd(): Formula {
    let left = this.parseNot();

    while (this.matchOp('∧', '&')) {
      const right = this.parseNot();
      left = and(left, right);
    }

    return left;
  }

  private parseNot(): Formula {
    if (this.matchOp('¬', '!')) {
      return not(this.parseNot());
    }

    return this.parsePrimary();
  }

  private parsePrimary(): Formula {
    if (this.match('lparen')) {
      const formula = this.parseIff();
      this.expect('rparen');
      return formula;
    }

    const token = this.peek();
    if (token.type === 'atom') {
      this.index += 1;
      return atom(token.value);
    }

    throw new ParseError(`Expected formula, got ${token.type}`);
  }

  private peek(): Token {
    return this.tokens[this.index];
  }

  private match(type: Token['type']): boolean {
    if (this.peek().type === type) {
      this.index += 1;
      return true;
    }
    return false;
  }

  private matchOp(...values: string[]): boolean {
    const token = this.peek();
    if (token.type === 'op' && values.includes(token.value)) {
      this.index += 1;
      return true;
    }
    return false;
  }

  private expect(type: Token['type']): void {
    if (!this.match(type)) {
      throw new ParseError(`Expected ${type}, got ${this.peek().type}`);
    }
  }
}

export function parse(input: string): Formula {
  const tokens = tokenize(input.trim());
  return new Parser(tokens).parse();
}

export function mainConnective(formula: Formula): ConnectiveKind | 'atom' {
  return formula.kind;
}
