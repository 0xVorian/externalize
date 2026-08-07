export type Atom = {
  kind: 'atom';
  name: string;
};

export type Not = {
  kind: 'not';
  operand: Formula;
};

export type And = {
  kind: 'and';
  left: Formula;
  right: Formula;
};

export type Or = {
  kind: 'or';
  left: Formula;
  right: Formula;
};

export type Imp = {
  kind: 'imp';
  left: Formula;
  right: Formula;
};

export type Iff = {
  kind: 'iff';
  left: Formula;
  right: Formula;
};

export type Formula = Atom | Not | And | Or | Imp | Iff;

export type ConnectiveKind = Exclude<Formula['kind'], 'atom'>;

export type Assignment = Record<string, boolean>;

export type TreeNode = {
  id: string;
  kind: Formula['kind'];
  label: string;
  value?: boolean;
  children: TreeNode[];
};

export function isAtom(formula: Formula): formula is Atom {
  return formula.kind === 'atom';
}

export function atom(name: string): Atom {
  return { kind: 'atom', name };
}

export function not(operand: Formula): Not {
  return { kind: 'not', operand };
}

export function and(left: Formula, right: Formula): And {
  return { kind: 'and', left, right };
}

export function or(left: Formula, right: Formula): Or {
  return { kind: 'or', left, right };
}

export function imp(left: Formula, right: Formula): Imp {
  return { kind: 'imp', left, right };
}

export function iff(left: Formula, right: Formula): Iff {
  return { kind: 'iff', left, right };
}

export function collectAtoms(formula: Formula): Set<string> {
  const atoms = new Set<string>();

  const visit = (node: Formula): void => {
    switch (node.kind) {
      case 'atom':
        atoms.add(node.name);
        break;
      case 'not':
        visit(node.operand);
        break;
      default:
        visit(node.left);
        visit(node.right);
    }
  };

  visit(formula);
  return atoms;
}
