import { CHALLENGE_TTL_MS, laterIso, nowIso } from './http';
import { randomId } from './crypto';

export async function requireDb(env: Env): Promise<D1Database | null> {
  return env.DB ?? null;
}

export async function purgeExpired(db: D1Database): Promise<void> {
  const now = nowIso();
  await db.batch([
    db.prepare('DELETE FROM challenges WHERE expires_at < ?').bind(now),
    db.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(now),
  ]);
}

export async function insertChallenge(
  db: D1Database,
  input: { challenge: string; type: string; userId?: string | null },
): Promise<string> {
  const id = randomId();
  await db
    .prepare(
      'INSERT INTO challenges (id, challenge, type, user_id, expires_at) VALUES (?, ?, ?, ?, ?)',
    )
    .bind(id, input.challenge, input.type, input.userId ?? null, laterIso(CHALLENGE_TTL_MS))
    .run();
  return id;
}

export async function takeChallenge(
  db: D1Database,
  id: string,
  type: string,
): Promise<ChallengeRow | null> {
  const row = await db
    .prepare('SELECT id, challenge, type, user_id, expires_at FROM challenges WHERE id = ? AND type = ?')
    .bind(id, type)
    .first<ChallengeRow>();
  if (!row) {
    return null;
  }
  await db.prepare('DELETE FROM challenges WHERE id = ?').bind(id).run();
  if (row.expires_at < nowIso()) {
    return null;
  }
  return row;
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
    .prepare('SELECT user_id, snapshot, updated_at FROM progress WHERE user_id = ?')
    .bind(userId)
    .first<ProgressRow>();
}

export async function upsertProgress(
  db: D1Database,
  userId: string,
  snapshot: string,
): Promise<void> {
  const at = nowIso();
  await db
    .prepare(
      `INSERT INTO progress (user_id, snapshot, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET snapshot = excluded.snapshot, updated_at = excluded.updated_at`,
    )
    .bind(userId, snapshot, at)
    .run();
  await db.prepare('UPDATE users SET updated_at = ? WHERE id = ?').bind(at, userId).run();
}

export async function deleteAccount(db: D1Database, userId: string): Promise<void> {
  await db.batch([
    db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM credentials WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM challenges WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM progress WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM users WHERE id = ?').bind(userId),
  ]);
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
