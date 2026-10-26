import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { afterEach, describe, expect, it } from 'vitest';
import {
  CHALLENGE_GLOBAL_CAP,
  CHALLENGE_RATE_MAX,
  CHALLENGE_RATE_WINDOW_MS,
  availabilityFromProbe,
} from './account-policy';
import {
  DELETE_CHALLENGE_SQL,
  INSERT_CHALLENGE_IF_ROOM_SQL,
  SCHEMA_PROBE_SQL,
  TAKE_CHALLENGE_SQL,
  UPSERT_CHALLENGE_RATE_SQL,
  challengeRateCutoffIso,
  insertChallengeBindings,
  takeChallengeBindings,
  upsertChallengeRateBindings,
} from './account-challenge-sql';

const migrations = [
  readFileSync('migrations/0001_init.sql', 'utf8'),
  readFileSync('migrations/0002_challenge_origin_and_revision.sql', 'utf8'),
  readFileSync('migrations/0003_challenge_rate.sql', 'utf8'),
];

function migratedDb(): DatabaseSync {
  const db = new DatabaseSync(':memory:');
  for (const sql of migrations) {
    db.exec(sql);
  }
  return db;
}

function insertChallenge(
  db: DatabaseSync,
  input: { id: string; nowIso: string; type?: string; userId?: string | null },
): number {
  const result = db
    .prepare(INSERT_CHALLENGE_IF_ROOM_SQL)
    .run(
      ...insertChallengeBindings({
        id: input.id,
        challenge: `c-${input.id}`,
        type: input.type ?? 'register',
        userId: input.userId ?? null,
        expiresAt: new Date(Date.parse(input.nowIso) + 5 * 60 * 1000).toISOString(),
        origin: 'http://localhost:8788',
        rpId: 'localhost',
        nowIso: input.nowIso,
      }),
    );
  return Number(result.changes);
}

function consumeRate(db: DatabaseSync, clientKey: string, nowMs: number): number {
  return Number(
    db
      .prepare(UPSERT_CHALLENGE_RATE_SQL)
      .run(
        ...upsertChallengeRateBindings({
          clientKey,
          nowIso: new Date(nowMs).toISOString(),
          cutoffIso: challengeRateCutoffIso(nowMs),
        }),
      ).changes,
  );
}

let db: DatabaseSync | undefined;

afterEach(() => {
  db?.close();
  db = undefined;
});

describe('schema probe', () => {
  it('is false on an empty database and true after migrations', () => {
    const empty = new DatabaseSync(':memory:');
    expect(availabilityFromProbe(empty.prepare(SCHEMA_PROBE_SQL).get() as { ok?: unknown } | undefined, false)).toBe(
      false,
    );
    empty.close();

    db = migratedDb();
    expect(availabilityFromProbe(db.prepare(SCHEMA_PROBE_SQL).get() as { ok: number }, false)).toBe(true);
    expect(availabilityFromProbe({ ok: 1 }, false)).toBe(true);
    expect(availabilityFromProbe(null, false)).toBe(false);
  });
});

describe('atomic challenge admission', () => {
  it('admits exactly CHALLENGE_GLOBAL_CAP live rows and rejects the next insert', () => {
    db = migratedDb();
    const now = '2026-10-26T16:00:00.000Z';
    for (let i = 0; i < CHALLENGE_GLOBAL_CAP; i += 1) {
      expect(insertChallenge(db, { id: `c-${i}`, nowIso: now })).toBe(1);
    }
    expect(insertChallenge(db, { id: 'overflow', nowIso: now })).toBe(0);
    const count = db.prepare('SELECT COUNT(*) AS n FROM challenges').get() as { n: number };
    expect(count.n).toBe(CHALLENGE_GLOBAL_CAP);
  });

  it('does not count expired rows toward the live cap', () => {
    db = migratedDb();
    const nowMs = Date.parse('2026-10-26T16:00:00.000Z');
    const expiredNow = new Date(nowMs - 6 * 60 * 1000).toISOString();
    expect(insertChallenge(db, { id: 'old', nowIso: expiredNow })).toBe(1);
    const liveNow = new Date(nowMs).toISOString();
    for (let i = 0; i < CHALLENGE_GLOBAL_CAP; i += 1) {
      expect(insertChallenge(db, { id: `live-${i}`, nowIso: liveNow })).toBe(1);
    }
    expect(insertChallenge(db, { id: 'overflow', nowIso: liveNow })).toBe(0);
  });

  it('caps per-client quota in one UPSERT and resets after the window', () => {
    db = migratedDb();
    const start = Date.parse('2026-10-26T16:00:00.000Z');
    for (let i = 0; i < CHALLENGE_RATE_MAX; i += 1) {
      expect(consumeRate(db, 'ip-a', start)).toBe(1);
    }
    expect(consumeRate(db, 'ip-a', start + 1_000)).toBe(0);
    expect(consumeRate(db, 'ip-b', start + 1_000)).toBe(1);
    expect(consumeRate(db, 'ip-a', start + CHALLENGE_RATE_WINDOW_MS)).toBe(1);
  });

  it('consumes an add-passkey challenge only for the owning user_id', () => {
    db = migratedDb();
    const now = '2026-10-26T16:00:00.000Z';
    expect(insertChallenge(db, { id: 'add-1', nowIso: now, type: 'add-passkey', userId: 'user-a' })).toBe(1);
    const stolen = db
      .prepare(TAKE_CHALLENGE_SQL)
      .get(...takeChallengeBindings({ id: 'add-1', type: 'add-passkey', nowIso: now, userId: 'user-b' }));
    expect(stolen).toBeUndefined();
    const owner = db
      .prepare(TAKE_CHALLENGE_SQL)
      .get(...takeChallengeBindings({ id: 'add-1', type: 'add-passkey', nowIso: now, userId: 'user-a' })) as {
      id: string;
      user_id: string;
    };
    expect(owner).toMatchObject({ id: 'add-1', user_id: 'user-a' });
    const replay = db
      .prepare(TAKE_CHALLENGE_SQL)
      .get(...takeChallengeBindings({ id: 'add-1', type: 'add-passkey', nowIso: now, userId: 'user-a' }));
    expect(replay).toBeUndefined();
  });

  it('frees a slot when a rate-limit rollback deletes the just-inserted row', () => {
    db = migratedDb();
    const now = '2026-10-26T16:00:00.000Z';
    expect(insertChallenge(db, { id: 'temp', nowIso: now })).toBe(1);
    expect(Number(db.prepare(DELETE_CHALLENGE_SQL).run('temp').changes)).toBe(1);
    expect(insertChallenge(db, { id: 'next', nowIso: now })).toBe(1);
  });
});
