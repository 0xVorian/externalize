/** Individual constants and variables (terms). */
export type Const = { kind: 'const'; name: string };
export type Var = { kind: 'var'; name: string };
export type Term = Const | Var;
export type Pred = { kind: 'pred'; name: string; args: Term[] };
export type Not = { kind: 'not'; operand: Formula };
export type And = { kind: 'and'; left: Formula; right: Formula };
export type Or = { kind: 'or'; left: Formula; right: Formula };
export type Imp = { kind: 'imp'; left: Formula; right: Formula };
export type Iff = { kind: 'iff'; left: Formula; right: Formula };
export type ForAll = { kind: 'forall'; var: string; body: Formula };
export type Exists = { kind: 'exists'; var: string; body: Formula };
export type Formula = Pred | Not | And | Or | Imp | Iff | ForAll | Exists;
export type Atom = Pred;
export type ConnectiveKind = Exclude<Formula['kind'], 'pred'>;
export type Assignment = Record<string, boolean>;
export type TreeNode = { id: string; kind: Formula['kind']; label: string; value?: boolean; children: TreeNode[] };
const CONSTANT_NAMES = new Set(['a', 'b', 'c', 'd', 'e']);
export function isConstTerm(term: Term): term is Const { return term.kind === 'const'; }
export function isVarTerm(term: Term): term is Var { return term.kind === 'var'; }
export function constTerm(name: string): Const { return { kind: 'const', name }; }
export function varTerm(name: string): Var { return { kind: 'var', name }; }
export function termFromName(name: string): Term { return CONSTANT_NAMES.has(name) ? constTerm(name) : varTerm(name); }
export function pred(name: string, args: Term[] = []): Pred { return { kind: 'pred', name, args }; }
export function isPred(formula: Formula): formula is Pred { return formula.kind === 'pred'; }
export function isAtom(formula: Formula): formula is Pred { return formula.kind === 'pred' && formula.args.length === 0; }
export function atom(name: string): Pred { return pred(name, []); }
export function not(operand: Formula): Not { return { kind: 'not', operand }; }
export function and(left: Formula, right: Formula): And { return { kind: 'and', left, right }; }
export function or(left: Formula, right: Formula): Or { return { kind: 'or', left, right }; }
export function imp(left: Formula, right: Formula): Imp { return { kind: 'imp', left, right }; }
export function iff(left: Formula, right: Formula): Iff { return { kind: 'iff', left, right }; }
export function forall(v: string, body: Formula): ForAll { return { kind: 'forall', var: v, body }; }
export function exists(v: string, body: Formula): Exists { return { kind: 'exists', var: v, body }; }
export function collectAtoms(formula: Formula): Set<string> {
  const atoms = new Set<string>();
  const visit = (node: Formula): void => {
    switch (node.kind) {
      case 'pred': if (node.args.length === 0) atoms.add(node.name); break;
      case 'not': visit(node.operand); break;
      case 'forall': case 'exists': visit(node.body); break;
      default: visit(node.left); visit(node.right);
    }
  };
  visit(formula); return atoms;
}
export function collectPredicateSymbols(formula: Formula): Map<string, Set<number>> {
  const symbols = new Map<string, Set<number>>();
  const visit = (node: Formula): void => {
    switch (node.kind) {
      case 'pred': { const arities = symbols.get(node.name) ?? new Set<number>(); arities.add(node.args.length); symbols.set(node.name, arities); break; }
      case 'not': visit(node.operand); break;
      case 'forall': case 'exists': visit(node.body); break;
      default: visit(node.left); visit(node.right);
    }
  };
  visit(formula); return symbols;
}
export function collectFreeVariables(formula: Formula): Set<string> {
  const free = new Set<string>();
  const visit = (node: Formula, bound: Set<string>): void => {
    switch (node.kind) {
      case 'pred': for (const arg of node.args) if (arg.kind === 'var' && !bound.has(arg.name)) free.add(arg.name); break;
      case 'not': visit(node.operand, bound); break;
      case 'forall': case 'exists': { const next = new Set(bound); next.add(node.var); visit(node.body, next); break; }
      default: visit(node.left, bound); visit(node.right, bound);
    }
  };
  visit(formula, new Set<string>()); return free;
}
