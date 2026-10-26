export const SESSION_COOKIE = 'ex_session';
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;
export const CHALLENGE_TTL_MS = 5 * 60 * 1000;
export const MAX_BODY_BYTES = 512 * 1024;

export function json(data: unknown, status = 200, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders,
    },
  });
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

export function cookieHeader(token: string, requestUrl: string): string {
  const secure = new URL(requestUrl).protocol === 'https:';
  const parts = [
    `${SESSION_COOKIE}=${token}`,
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

export function clearCookieHeader(requestUrl: string): string {
  const secure = new URL(requestUrl).protocol === 'https:';
  const parts = [
    `${SESSION_COOKIE}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
  ];
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

export function relyingParty(env: Env, request: Request): {
  rpName: string;
  rpID: string;
  origin: string;
} {
  const url = new URL(request.url);
  return {
    rpName: env.WEBAUTHN_RP_NAME || 'Externalize',
    rpID: env.WEBAUTHN_RP_ID || url.hostname,
    origin: env.WEBAUTHN_ORIGIN || url.origin,
  };
}
