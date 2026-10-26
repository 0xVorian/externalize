import {
  availabilityFromProbe,
  CHALLENGE_RATE_WINDOW_MS,
  planChallengeRate,
} from '../../src/app/account-policy';
import {
  challengeRateCutoffIso,
  DELETE_CHALLENGE_SQL,
  INSERT_CHALLENGE_IF_ROOM_SQL,
  insertChallengeBindings,
  SCHEMA_PROBE_SQL,
  TAKE_CHALLENGE_SQL,
  takeChallengeBindings,
  UPSERT_CHALLENGE_RATE_SQL,
  upsertChallengeRateBindings,
} from '../../src/app/account-challenge-sql';
import { CHALLENGE_TTL_MS, laterIso, nowIso } from './http';
import { randomId, sha256Base64Url } from './crypto';

export async function requireDb(env: Env): Promise<D1Database | null> {
  return env.DB ?? null;
}

export async function probeDatabase(db: D1Database | undefined | null): Promise<boolean> {
  if (!db) {
    return false;
  }
  try {
    const row = await db.prepare(SCHEMA_PROBE_SQL).first<{ ok: number }>();
    return availabilityFromProbe(row, false);
  } catch {
    return availabilityFromProbe(null, true);
  }
}

export async function purgeExpired(db: D1Database): Promise<void> {
  const now = nowIso();
  const staleRate = new Date(Date.now() - CHALLENGE_RATE_WINDOW_MS * 2).toISOString();
  await db.batch([
    db.prepare('DELETE FROM challenges WHERE expires_at < ?').bind(now),
    db.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(now),
    db.prepare('DELETE FROM challenge_rate WHERE window_start < ?').bind(staleRate),
  ]);
}

export async function peekChallengeQuota(db: D1Database, clientKey: string): Promise<boolean> {
  const hashed = await sha256Base64Url(clientKey);
  const nowMs = Date.now();
  const row = await db
    .prepare('SELECT window_start, count FROM challenge_rate WHERE client_key = ?')
    .bind(hashed)
    .first<{ window_start: string; count: number }>();
  const windowStartMs = row ? Date.parse(row.window_start) : Number.NaN;
  return planChallengeRate({
    nowMs,
    windowStartMs: Number.isFinite(windowStartMs) ? windowStartMs : null,
    count: typeof row?.count === 'number' ? row.count : 0,
  }).allowed;
}

export async function consumeChallengeQuota(db: D1Database, clientKey: string): Promise<boolean> {
  const hashed = await sha256Base64Url(clientKey);
  const nowMs = Date.now();
  const now = new Date(nowMs).toISOString();
  const result = await db
    .prepare(UPSERT_CHALLENGE_RATE_SQL)
    .bind(...upsertChallengeRateBindings({
      clientKey: hashed,
      nowIso: now,
      cutoffIso: challengeRateCutoffIso(nowMs),
    }))
    .run();
  return (result.meta.changes ?? 0) > 0;
}

export async function countChallenges(db: D1Database): Promise<number> {
  const row = await db
    .prepare('SELECT COUNT(*) AS n FROM challenges WHERE expires_at >= ?')
    .bind(nowIso())
    .first<{ n: number }>();
  return typeof row?.n === 'number' ? row.n : 0;
}

export async function insertChallenge(
  db: D1Database,
  input: {
    challenge: string;
    type: string;
    userId?: string | null;
    origin: string;
    rpId: string;
  },
): Promise<string | null> {
  const id = randomId();
  const now = nowIso();
  const result = await db
    .prepare(INSERT_CHALLENGE_IF_ROOM_SQL)
    .bind(
      ...insertChallengeBindings({
        id,
        challenge: input.challenge,
        type: input.type,
        userId: input.userId ?? null,
        expiresAt: laterIso(CHALLENGE_TTL_MS),
        origin: input.origin,
        rpId: input.rpId,
        nowIso: now,
      }),
    )
    .run();
  if ((result.meta.changes ?? 0) < 1) {
    return null;
  }
  return id;
}

export async function deleteChallenge(db: D1Database, id: string): Promise<void> {
  await db.prepare(DELETE_CHALLENGE_SQL).bind(id).run();
}

export async function admitChallenge(
  db: D1Database,
  input: {
    challenge: string;
    type: string;
    userId?: string | null;
    origin: string;
    rpId: string;
  },
  clientKey: string,
): Promise<string | null> {
  const id = await insertChallenge(db, input);
  if (!id) {
    return null;
  }
  if (!(await consumeChallengeQuota(db, clientKey))) {
    await deleteChallenge(db, id);
    return null;
  }
  return id;
}

export async function takeChallenge(
  db: D1Database,
  id: string,
  type: string,
  userId?: string | null,
): Promise<ChallengeRow | null> {
  const row = await db
    .prepare(TAKE_CHALLENGE_SQL)
    .bind(...takeChallengeBindings({ id, type, nowIso: nowIso(), userId }))
    .first<ChallengeRow>();
  return row ?? null;
}

export async function createUser(db: D1Database, userId: string): Promise<void> {
  const at = nowIso();
  await db
    .prepare('INSERT INTO users (id, created_at, updated_at) VALUES (?, ?, ?)')
    .bind(userId, at, at)
    .run();
}

export async function insertCredential(
  db: D1Database,
  input: {
    id: string;
    userId: string;
    publicKey: string;
    counter: number;
    deviceType?: string;
    backedUp: boolean;
    transports?: string[];
  },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO credentials
        (id, user_id, public_key, counter, device_type, backed_up, transports, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      input.id,
      input.userId,
      input.publicKey,
      input.counter,
      input.deviceType ?? null,
      input.backedUp ? 1 : 0,
      input.transports ? JSON.stringify(input.transports) : null,
      nowIso(),
    )
    .run();
}

export async function createUserWithCredential(
  db: D1Database,
  userId: string,
  input: {
    id: string;
    publicKey: string;
    counter: number;
    deviceType?: string;
    backedUp: boolean;
    transports?: string[];
  },
): Promise<void> {
  // D1 batch() is sequential, not a rollback transaction. Insert the user,
  // then the credential; delete the user if the credential write fails.
  const at = nowIso();
  await db
    .prepare('INSERT INTO users (id, created_at, updated_at) VALUES (?, ?, ?)')
    .bind(userId, at, at)
    .run();
  try {
    await db
      .prepare(
        `INSERT INTO credentials
          (id, user_id, public_key, counter, device_type, backed_up, transports, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.id,
        userId,
        input.publicKey,
        input.counter,
        input.deviceType ?? null,
        input.backedUp ? 1 : 0,
        input.transports ? JSON.stringify(input.transports) : null,
        at,
      )
      .run();
  } catch (error) {
    await db.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();
    throw error;
  }
}

export async function listCredentials(db: D1Database, userId: string): Promise<CredentialRow[]> {
  const result = await db
    .prepare(
      'SELECT id, user_id, public_key, counter, device_type, backed_up, transports, created_at FROM credentials WHERE user_id = ?',
    )
    .bind(userId)
    .all<CredentialRow>();
  return result.results ?? [];
}

export async function getCredential(db: D1Database, id: string): Promise<CredentialRow | null> {
  return db
    .prepare(
      'SELECT id, user_id, public_key, counter, device_type, backed_up, transports, created_at FROM credentials WHERE id = ?',
    )
    .bind(id)
    .first<CredentialRow>();
}

export async function updateCredentialCounter(
  db: D1Database,
  id: string,
  counter: number,
): Promise<void> {
  await db.prepare('UPDATE credentials SET counter = ? WHERE id = ?').bind(counter, id).run();
}

export async function insertSession(
  db: D1Database,
  input: { tokenHash: string; userId: string; expiresAt: string },
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)',
    )
    .bind(input.tokenHash, input.userId, input.expiresAt, nowIso())
    .run();
}

export async function getSession(db: D1Database, tokenHash: string): Promise<SessionRow | null> {
  return db
    .prepare('SELECT token_hash, user_id, expires_at, created_at FROM sessions WHERE token_hash = ?')
    .bind(tokenHash)
    .first<SessionRow>();
}

export async function deleteSession(db: D1Database, tokenHash: string): Promise<void> {
  await db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(tokenHash).run();
}

export async function getProgress(db: D1Database, userId: string): Promise<ProgressRow | null> {
  return db
    .prepare('SELECT user_id, snapshot, updated_at, revision FROM progress WHERE user_id = ?')
    .bind(userId)
    .first<ProgressRow>();
}

export async function casInsertProgress(
  db: D1Database,
  userId: string,
  snapshot: string,
): Promise<boolean> {
  const at = nowIso();
  try {
    const result = await db
      .prepare('INSERT INTO progress (user_id, snapshot, updated_at, revision) VALUES (?, ?, ?, 1)')
      .bind(userId, snapshot, at)
      .run();
    if ((result.meta.changes ?? 0) < 1) {
      return false;
    }
    await db.prepare('UPDATE users SET updated_at = ? WHERE id = ?').bind(at, userId).run();
    return true;
  } catch {
    return false;
  }
}

export async function casUpdateProgress(
  db: D1Database,
  userId: string,
  snapshot: string,
  expectedRevision: number,
): Promise<boolean> {
  const at = nowIso();
  const result = await db
    .prepare(
      `UPDATE progress
       SET snapshot = ?, updated_at = ?, revision = revision + 1
       WHERE user_id = ? AND revision = ?`,
    )
    .bind(snapshot, at, userId, expectedRevision)
    .run();
  if ((result.meta.changes ?? 0) !== 1) {
    return false;
  }
  await db.prepare('UPDATE users SET updated_at = ? WHERE id = ?').bind(at, userId).run();
  return true;
}

export async function deleteAccount(db: D1Database, userId: string): Promise<void> {
  // D1 batch() does not roll back earlier statements. Delete children first
  // and keep going if one statement fails so a half-deleted account can still
  // be cleaned up on retry.
  const statements = [
    db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM credentials WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM challenges WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM progress WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM users WHERE id = ?').bind(userId),
  ];
  let firstError: unknown;
  for (const statement of statements) {
    try {
      await statement.run();
    } catch (error) {
      firstError ??= error;
    }
  }
  if (firstError) {
    throw firstError;
  }
}

export function parseTransports(raw: string | null): string[] | undefined {
  if (!raw) {
    return undefined;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      return parsed;
    }
  } catch {
    return undefined;
  }
  return undefined;
}
