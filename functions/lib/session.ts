import { HOST_SESSION_COOKIE, SESSION_COOKIE, SESSION_MAX_AGE_SEC, laterIso, readCookie } from './http';
import { randomToken, sha256Base64Url } from './crypto';
import { deleteSession, getSession, insertSession } from './db';

export async function createSessionCookie(
  db: D1Database,
  userId: string,
  _requestUrl: string,
): Promise<{ token: string; userId: string }> {
  const token = randomToken();
  const tokenHash = await sha256Base64Url(token);
  await insertSession(db, {
    tokenHash,
    userId,
    expiresAt: laterIso(SESSION_MAX_AGE_SEC * 1000),
  });
  return { token, userId };
}

export async function readSessionUser(
  db: D1Database,
  request: Request,
): Promise<string | null> {
  const token = readCookie(request, HOST_SESSION_COOKIE) ?? readCookie(request, SESSION_COOKIE);
  if (!token) {
    return null;
  }
  const tokenHash = await sha256Base64Url(token);
  const row = await getSession(db, tokenHash);
  if (!row) {
    return null;
  }
  if (row.expires_at < new Date().toISOString()) {
    await deleteSession(db, tokenHash);
    return null;
  }
  return row.user_id;
}

export async function clearSession(db: D1Database, request: Request): Promise<void> {
  const token = readCookie(request, HOST_SESSION_COOKIE) ?? readCookie(request, SESSION_COOKIE);
  if (!token) {
    return;
  }
  await deleteSession(db, await sha256Base64Url(token));
}
