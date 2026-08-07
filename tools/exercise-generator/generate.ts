import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectAtoms, generateTruthTable, parse, ParseError } from '../../engine';
import { presentationForExercise } from './presentation';
import type {
  EvalTemplate,
  ExercisePattern,
  ExerciseTemplateFile,
  FillTruthTableTemplate,
  GenerateOptions,
  GenerateResult,
  GeneratedExercise,
  ExerciseComparable,
  ScopeTemplate,
} from './types';

const DEFAULT_PATTERNS: ExercisePattern[] = ['scope', 'eval', 'fill-truth-table'];

export function loadExerciseTemplates(path?: string): ExerciseTemplateFile {
  const filePath =
    path ??
    join(dirname(fileURLToPath(import.meta.url)), '../../content/exercise-templates.json');
  const raw = readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as ExerciseTemplateFile;
}

function padId(prefix: 'scope' | 'eval' | 'tt', index: number): string {
  return `${prefix}-${String(index).padStart(3, '0')}`;
}

function validateFormula(formula: string, context: string): void {
  try {
    parse(formula);
  } catch (error) {
    const message = error instanceof ParseError ? error.message : String(error);
    throw new Error(`${context}: invalid formula "${formula}" — ${message}`);
  }
}

function validateEvalTemplate(template: EvalTemplate, context: string): void {
  validateFormula(template.formula, context);
  const atoms = new Set([...collectAtoms(parse(template.formula))].sort());
  for (const key of Object.keys(template.initialAssignment)) {
    if (!atoms.has(key)) {
      throw new Error(`${context}: assignment key "${key}" is not an atom in "${template.formula}"`);
    }
  }
}

function validateFillTruthTableTemplate(template: FillTruthTableTemplate, context: string): void {
  validateFormula(template.formula, context);
  const formula = parse(template.formula);
  const rowCount = generateTruthTable(formula, [...collectAtoms(formula)].sort()).rows.length;
  if (template.hiddenRowIndex < 0 || template.hiddenRowIndex >= rowCount) {
    throw new Error(
      `${context}: hiddenRowIndex ${template.hiddenRowIndex} out of range [0, ${rowCount - 1}] for "${template.formula}"`,
    );
  }
}

function scopeExercise(template: ScopeTemplate, id: string): GeneratedExercise {
  validateFormula(template.formula, id);
  return { id, type: 'identify-main-connective', formula: template.formula };
}

function evalExercise(template: EvalTemplate, id: string): GeneratedExercise {
  validateEvalTemplate(template, id);
  return {
    id,
    type: 'evaluate-formula',
    formula: template.formula,
    initialAssignment: template.initialAssignment,
  };
}

function fillTruthTableExercise(template: FillTruthTableTemplate, id: string): GeneratedExercise {
  validateFillTruthTableTemplate(template, id);
  return {
    id,
    type: 'fill-truth-table-cell',
    formula: template.formula,
    hiddenRowIndex: template.hiddenRowIndex,
  };
}

export function generateExercises(
  templates: ExerciseTemplateFile,
  options: GenerateOptions = {},
): GenerateResult {
  const patterns = new Set(options.patterns ?? DEFAULT_PATTERNS);
  const startIds = {
    scope: options.startIds?.scope ?? 1,
    eval: options.startIds?.eval ?? 1,
    tt: options.startIds?.tt ?? 1,
  };

  const exercises: GeneratedExercise[] = [];
  const presentation: Record<string, string> = {};
  const warnings: string[] = [];

  if (patterns.has('scope')) {
    let index = startIds.scope;
    for (const template of templates.scope) {
      const id = template.id ?? padId('scope', index++);
      if (template.id) index = Math.max(index, Number(template.id.slice('scope-'.length)) + 1);
      const exercise = scopeExercise(template, id);
      exercises.push(exercise);
      presentation[id] = presentationForExercise(exercise);
    }
  }

  if (patterns.has('eval')) {
    let index = startIds.eval;
    for (const template of templates.eval) {
      const id = template.id ?? padId('eval', index++);
      if (template.id) index = Math.max(index, Number(template.id.slice('eval-'.length)) + 1);
      const exercise = evalExercise(template, id);
      exercises.push(exercise);
      presentation[id] = presentationForExercise(exercise);
    }
  }

  if (patterns.has('fill-truth-table')) {
    let index = startIds.tt;
    for (const template of templates.fillTruthTable) {
      const id = template.id ?? padId('tt', index++);
      if (template.id) index = Math.max(index, Number(template.id.slice('tt-'.length)) + 1);
      const exercise = fillTruthTableExercise(template, id);
      exercises.push(exercise);
      presentation[id] = presentationForExercise(exercise);
    }
  }

  const ids = exercises.map((exercise) => exercise.id);
  const duplicates = ids.filter((id, position) => ids.indexOf(id) !== position);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate exercise IDs: ${[...new Set(duplicates)].join(', ')}`);
  }

  if (exercises.length === 0) {
    warnings.push('No exercises generated for the selected patterns.');
  }

  return { exercises, presentation, warnings };
}

export function diffAgainstExisting(
  generated: GeneratedExercise[],
  existing: ReadonlyArray<ExerciseComparable>,
): { onlyInTemplates: GeneratedExercise[]; onlyInApp: ExerciseComparable[] } {
  const key = (exercise: ExerciseComparable) =>
    JSON.stringify({
      type: exercise.type,
      formula: exercise.formula,
      initialAssignment: exercise.initialAssignment ?? null,
      hiddenRowIndex: exercise.hiddenRowIndex ?? null,
    });

  const existingKeys = new Set(existing.map(key));
  const generatedKeys = new Set(generated.map(key));

  return {
    onlyInTemplates: generated.filter((exercise) => !existingKeys.has(key(exercise))),
    onlyInApp: existing.filter((exercise) => !generatedKeys.has(key(exercise))),
  };
}
