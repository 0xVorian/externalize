import { mergeProgress } from './progress-merge';
import type { ProgressStore } from './storage';

export const CAS_MAX_ATTEMPTS = 5;

export type StoredProgressRow = {
  snapshot: ProgressStore;
  revision: number;
};

export class CasConflictError extends Error {
  readonly code = 'cas-conflict';

  constructor() {
    super('cas-conflict');
    this.name = 'CasConflictError';
  }
}

/**
 * Read–merge–write with compare-and-swap on a numeric revision.
 * `write` must return false when the expected revision no longer matches
 * so the caller retries against the latest stored snapshot.
 */
export async function mergeWithCasRetry(input: {
  incoming: ProgressStore;
  read: () => Promise<StoredProgressRow | null>;
  write: (snapshot: ProgressStore, expectedRevision: number | null) => Promise<boolean>;
  maxAttempts?: number;
}): Promise<ProgressStore> {
  const maxAttempts = input.maxAttempts ?? CAS_MAX_ATTEMPTS;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const stored = await input.read();
    const merged = stored ? mergeProgress(input.incoming, stored.snapshot) : input.incoming;
    const expected = stored ? stored.revision : null;
    const written = await input.write(merged, expected);
    if (written) {
      return merged;
    }
  }
  throw new CasConflictError();
}
