import {
  CHALLENGE_GLOBAL_CAP,
  CHALLENGE_RATE_MAX,
  CHALLENGE_RATE_WINDOW_MS,
} from './account-policy';

/**
 * Latest table from `migrations/0003_challenge_rate.sql`. A bound D1 that has
 * not been migrated has sqlite_master but not this table, so `/api/status`
 * stays `{ available: false }`.
 */
export const SCHEMA_PROBE_SQL =
  "SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = 'challenge_rate' LIMIT 1";

/**
 * Insert one challenge only when live (unexpired) rows are below the global cap.
 * SQLite evaluates this as a single statement, so concurrent isolates cannot
 * each observe COUNT < 40 and all write.
 */
export const INSERT_CHALLENGE_IF_ROOM_SQL = `INSERT INTO challenges (id, challenge, type, user_id, expires_at, origin, rp_id)
SELECT ?, ?, ?, ?, ?, ?, ?
WHERE (SELECT COUNT(*) FROM challenges WHERE expires_at >= ?) < ?`;

/**
 * Per-client quota as one UPSERT. The WHERE clause skips the update when the
 * current window is still open and `count` is already at the cap, so
 * `changes = 0` means rejected with no increment.
 */
export const UPSERT_CHALLENGE_RATE_SQL = `INSERT INTO challenge_rate (client_key, window_start, count)
VALUES (?, ?, 1)
ON CONFLICT(client_key) DO UPDATE SET
  window_start = CASE
    WHEN challenge_rate.window_start <= ? THEN excluded.window_start
    ELSE challenge_rate.window_start
  END,
  count = CASE
    WHEN challenge_rate.window_start <= ? THEN 1
    ELSE challenge_rate.count + 1
  END
WHERE challenge_rate.window_start <= ? OR challenge_rate.count < ?`;

export const TAKE_CHALLENGE_SQL = `DELETE FROM challenges
WHERE id = ? AND type = ? AND expires_at >= ?
  AND (? IS NULL OR user_id = ?)
RETURNING id, challenge, type, user_id, expires_at, origin, rp_id`;

export const DELETE_CHALLENGE_SQL = 'DELETE FROM challenges WHERE id = ?';

export function challengeRateCutoffIso(nowMs: number): string {
  return new Date(nowMs - CHALLENGE_RATE_WINDOW_MS).toISOString();
}

type SqlValue = string | number | null;

export function insertChallengeBindings(input: {
  id: string;
  challenge: string;
  type: string;
  userId: string | null;
  expiresAt: string;
  origin: string;
  rpId: string;
  nowIso: string;
}): SqlValue[] {
  return [
    input.id,
    input.challenge,
    input.type,
    input.userId,
    input.expiresAt,
    input.origin,
    input.rpId,
    input.nowIso,
    CHALLENGE_GLOBAL_CAP,
  ];
}

export function upsertChallengeRateBindings(input: {
  clientKey: string;
  nowIso: string;
  cutoffIso: string;
}): SqlValue[] {
  return [input.clientKey, input.nowIso, input.cutoffIso, input.cutoffIso, input.cutoffIso, CHALLENGE_RATE_MAX];
}

export function takeChallengeBindings(input: {
  id: string;
  type: string;
  nowIso: string;
  userId?: string | null;
}): SqlValue[] {
  const userId = input.userId ?? null;
  return [input.id, input.type, input.nowIso, userId, userId];
}
