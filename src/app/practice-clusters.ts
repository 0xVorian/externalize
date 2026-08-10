/** Practice clusters within Unit 1 — each cluster unlocks progressively on its own. */
export const UNIT_1_PRACTICE_CLUSTERS = {
  'eval-flat': [
    'eval-010',
    'eval-019',
    'eval-003',
    'eval-013',
    'eval-014',
    'eval-004',
    'eval-015',
    'eval-016',
    'eval-005',
    'eval-017',
    'eval-018',
    'eval-012',
  ],
  'truth-table': ['tt-002', 'tt-003', 'tt-004', 'tt-005'],
  'counterexample': ['counter-002', 'counter-003', 'counter-004'],
  'eval-nested': ['eval-020', 'eval-002', 'eval-006', 'eval-007', 'eval-008', 'eval-009'],
  'scope': [
    'scope-003',
    'scope-009',
    'scope-004',
    'scope-007',
    'scope-001',
    'scope-005',
    'scope-006',
    'scope-008',
    'scope-010',
    'scope-011',
    'scope-002',
  ],
  'tautology': ['val-001', 'val-002', 'val-003', 'val-004', 'val-005'],
  'translation': [
    'translate-001',
    'translate-002',
    'translate-003',
    'translate-004',
    'translate-005',
    'translate-006',
  ],
  'proof': ['nd-001', 'nd-002'],
} as const;

export const UNIT_1_CLUSTER_ORDER = Object.keys(UNIT_1_PRACTICE_CLUSTERS) as Array<
  keyof typeof UNIT_1_PRACTICE_CLUSTERS
>;

export function flattenUnit1Clusters(): string[] {
  return UNIT_1_CLUSTER_ORDER.flatMap((key) => [...UNIT_1_PRACTICE_CLUSTERS[key]]);
}
