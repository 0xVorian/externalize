import {
  collectAtoms,
  generateTruthTable,
  parse,
  type Assignment,
} from '../../engine';

export function assignmentKey(assignment: Assignment, atoms: string[]): string {
  return atoms.map((atom) => (assignment[atom] ? 'T' : 'F')).join('');
}

export function allAssignmentsForFormula(formula: string): Assignment[] {
  const ast = parse(formula);
  const atoms = [...collectAtoms(ast)].sort();
  const table = generateTruthTable(ast, atoms);
  return table.rows.map((row) => row.assignment);
}

function formulaHasImplication(formula: string): boolean {
  return formula.includes('→') || formula.includes('->');
}

function isDiagnosticFalsifyingCase(
  assignment: Assignment,
  atoms: string[],
  formula: string,
): boolean {
  if (!formulaHasImplication(formula) || atoms.length < 2) {
    return false;
  }
  const [first, second] = atoms;
  return assignment[first] === true && assignment[second] === false;
}

export type EvaluationCaseContext = {
  formula: string;
  seenKeys: string[];
  emphasizeErrors?: boolean;
};

export function selectEvaluationAssignment(context: EvaluationCaseContext): Assignment {
  const pool = allAssignmentsForFormula(context.formula);
  const atoms = Object.keys(pool[0] ?? {}).sort();
  const unseen = pool.filter(
    (assignment) => !context.seenKeys.includes(assignmentKey(assignment, atoms)),
  );
  const candidates = unseen.length > 0 ? unseen : pool;

  const weights = candidates.map((assignment) => {
    let weight = 1;
    const key = assignmentKey(assignment, atoms);
    if (!context.seenKeys.includes(key)) {
      weight += 10;
    }
    if (context.emphasizeErrors && isDiagnosticFalsifyingCase(assignment, atoms, context.formula)) {
      weight += 4;
    }
    return weight;
  });

  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = Math.random() * total;
  for (let index = 0; index < candidates.length; index += 1) {
    roll -= weights[index];
    if (roll <= 0) {
      return { ...candidates[index] };
    }
  }
  return { ...candidates[candidates.length - 1] };
}
