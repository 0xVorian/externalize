import { CHALLENGE_TTL_MS as POLICY_CHALLENGE_TTL_MS } from '../../src/app/account-policy';

export const SESSION_COOKIE = 'ex_session';
export const HOST_SESSION_COOKIE = '__Host-ex_session';
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;
export const CHALLENGE_TTL_MS = POLICY_CHALLENGE_TTL_MS;
export const MAX_BODY_BYTES = 512 * 1024;

export function json(
  data: unknown,
  status = 200,
  extraHeaders?: Record<string, string | string[]>,
): Response {
  const headers = new Headers({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  if (extraHeaders) {
    for (const [key, value] of Object.entries(extraHeaders)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          headers.append(key, item);
        }
      } else {
        headers.set(key, value);
      }
    }
  }
  return new Response(JSON.stringify(data), { status, headers });
}

export function errorJson(message: string, status: number): Response {
  return json({ error: message }, status);
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function laterIso(ms: number): string {
  return new Date(Date.now() + ms).toISOString();
}

export function sessionCookieName(requestUrl: string): string {
  return new URL(requestUrl).protocol === 'https:' ? HOST_SESSION_COOKIE : SESSION_COOKIE;
}

export function cookieHeader(token: string, requestUrl: string): string {
  const secure = new URL(requestUrl).protocol === 'https:';
  const name = sessionCookieName(requestUrl);
  const parts = [
    `${name}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_MAX_AGE_SEC}`,
  ];
  if (secure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

/**
 * Expire every session cookie name this API might have set. `readSessionUser`
 * accepts either `ex_session` or `__Host-ex_session`; logout must clear both.
 */
export function clearCookieHeaders(requestUrl: string): string[] {
  const https = new URL(requestUrl).protocol === 'https:';
  return [
    clearNamedCookie(SESSION_COOKIE, https),
    clearNamedCookie(HOST_SESSION_COOKIE, true),
  ];
}

function clearNamedCookie(name: string, secure: boolean): string {
  const parts = [`${name}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
  if (secure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('Cookie');
  if (!header) {
    return null;
  }
  for (const part of header.split(';')) {
    const [rawName, ...rest] = part.trim().split('=');
    if (rawName === name) {
      return rest.join('=') || null;
    }
  }
  return null;
}

export async function readJsonBody(request: Request): Promise<unknown> {
  const lengthHeader = request.headers.get('content-length');
  if (lengthHeader) {
    const length = Number(lengthHeader);
    if (Number.isFinite(length) && length > MAX_BODY_BYTES) {
      throw new BodyTooLargeError();
    }
  }
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    throw new BodyTooLargeError();
  }
  if (!text) {
    return {};
  }
  return JSON.parse(text) as unknown;
}

export class BodyTooLargeError extends Error {
  constructor() {
    super('body-too-large');
  }
}

export function routeKey(path: string | string[] | undefined): string {
  if (!path) {
    return '';
  }
  return (Array.isArray(path) ? path : [path]).join('/');
}
