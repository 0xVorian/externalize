export const PRODUCTION_RP_ID = 'externalize.pages.dev';
export const CHALLENGE_TTL_MS = 5 * 60 * 1000;
export const CHALLENGE_RATE_WINDOW_MS = 60 * 60 * 1000;
export const CHALLENGE_RATE_MAX = 10;
export const CHALLENGE_GLOBAL_CAP = 40;
export const CHALLENGE_WRITES_PER_SLOT = 3;
export const D1_FREE_DAILY_WRITES = 100_000;
export const PURGE_INTERVAL_MS = 10 * 60 * 1000;
export const CSRF_ERROR = 'csrf';
export const RATE_LIMIT_ERROR = 'rate-limited';
export const ORIGIN_ERROR = 'origin-not-allowed';

export type RelyingPartyConfig = {
  WEBAUTHN_RP_NAME?: string;
  WEBAUTHN_RP_ID?: string;
  WEBAUTHN_ORIGIN?: string;
  WEBAUTHN_ALLOWED_ORIGINS?: string;
};

export type RelyingParty = {
  rpName: string;
  rpID: string;
  origin: string;
};

type ChallengeBucket = {
  createdAt: number[];
};

const challengeBuckets = new Map<string, ChallengeBucket>();
let lastPurgeAt = 0;

export function resetAccountPolicyForTests(now = 0): void {
  challengeBuckets.clear();
  lastPurgeAt = now;
}

export function extraAllowedOrigins(env: RelyingPartyConfig): string[] {
  const extras: string[] = [];
  for (const origin of [env.WEBAUTHN_ORIGIN, ...(env.WEBAUTHN_ALLOWED_ORIGINS ?? '').split(',')]) {
    const trimmed = origin?.trim();
    if (!trimmed) {
      continue;
    }
    const url = parseOrigin(trimmed);
    if (!url || url.protocol !== 'https:') {
      continue;
    }
    extras.push(trimmed);
  }
  return extras;
}

export function isAllowedMutationOrigin(origin: string, extra: readonly string[] = []): boolean {
  const url = parseOrigin(origin);
  if (!url) {
    return false;
  }
  if (url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
    return true;
  }
  if (url.protocol !== 'https:') {
    return false;
  }
  if (extra.includes(origin)) {
    return true;
  }
  return isPagesDevHost(url.hostname);
}

export function isAllowedWebAuthnOrigin(origin: string, extra: readonly string[] = []): boolean {
  const url = parseOrigin(origin);
  if (!url || url.hostname === '127.0.0.1' || isIpHostname(url.hostname)) {
    return false;
  }
  return isAllowedMutationOrigin(origin, extra);
}

export function resolveRelyingParty(
  originHeader: string | null,
  env: RelyingPartyConfig,
): RelyingParty | { error: string } {
  if (!originHeader) {
    return { error: ORIGIN_ERROR };
  }
  const extra = extraAllowedOrigins(env);
  if (!isAllowedWebAuthnOrigin(originHeader, extra)) {
    return { error: ORIGIN_ERROR };
  }
  const url = parseOrigin(originHeader);
  if (!url) {
    return { error: ORIGIN_ERROR };
  }
  const rpID = rpIdForHostname(url.hostname, env.WEBAUTHN_RP_ID);
  if (!rpID || !rpIdCompatible(url.hostname, rpID)) {
    return { error: ORIGIN_ERROR };
  }
  return {
    rpName: env.WEBAUTHN_RP_NAME || 'Externalize',
    rpID,
    origin: originHeader,
  };
}

export function assertSameOriginMutation(
  method: string,
  originHeader: string | null,
  env: RelyingPartyConfig,
): { ok: true } | { ok: false; error: string } {
  const verb = method.toUpperCase();
  if (verb === 'GET' || verb === 'HEAD' || verb === 'OPTIONS') {
    return { ok: true };
  }
  if (!originHeader) {
    return { ok: false, error: CSRF_ERROR };
  }
  const extra = extraAllowedOrigins(env);
  if (!isAllowedMutationOrigin(originHeader, extra)) {
    return { ok: false, error: CSRF_ERROR };
  }
  return { ok: true };
}

export function clientKeyFromHeaders(headers: {
  get(name: string): string | null;
}): string {
  const cf = headers.get('CF-Connecting-IP')?.trim();
  if (cf) {
    return cf;
  }
  const forwarded = headers.get('X-Forwarded-For')?.trim();
  if (forwarded) {
    return forwarded.split(',')[0]!.trim();
  }
  return 'unknown';
}

export function allowChallengeCreation(clientKey: string, now = Date.now()): boolean {
  const bucket = challengeBuckets.get(clientKey) ?? { createdAt: [] };
  bucket.createdAt = bucket.createdAt.filter((stamp) => now - stamp < CHALLENGE_RATE_WINDOW_MS);
  if (bucket.createdAt.length >= CHALLENGE_RATE_MAX) {
    challengeBuckets.set(clientKey, bucket);
    return false;
  }
  bucket.createdAt.push(now);
  challengeBuckets.set(clientKey, bucket);
  return true;
}

export function planChallengeRate(input: {
  nowMs: number;
  windowStartMs: number | null;
  count: number;
}): { allowed: boolean; windowStartMs: number; count: number } {
  if (input.windowStartMs === null || input.nowMs - input.windowStartMs >= CHALLENGE_RATE_WINDOW_MS) {
    return { allowed: true, windowStartMs: input.nowMs, count: 1 };
  }
  if (input.count >= CHALLENGE_RATE_MAX) {
    return { allowed: false, windowStartMs: input.windowStartMs, count: input.count };
  }
  return { allowed: true, windowStartMs: input.windowStartMs, count: input.count + 1 };
}

/**
 * Worst-case D1 writes/day if an attacker keeps the live-challenge table full.
 * Admission checks the 40-row cap with a SELECT first, so a full table does
 * not write. Each admitted slot is one INSERT, one rate UPSERT, and one
 * DELETE (consume or TTL purge) per five-minute window:
 * 288 windows × 40 × 3 = 34_560, under the free-tier 100k/day cap.
 * The in-memory limiter is only a same-isolate first filter.
 */
export function dailyChallengeWriteCeiling(): number {
  const dayMs = 24 * 60 * 60 * 1000;
  const cycles = Math.ceil(dayMs / CHALLENGE_TTL_MS);
  return cycles * CHALLENGE_GLOBAL_CAP * CHALLENGE_WRITES_PER_SLOT;
}

export function shouldPurgeExpired(now = Date.now()): boolean {
  if (lastPurgeAt !== 0 && now - lastPurgeAt < PURGE_INTERVAL_MS) {
    return false;
  }
  lastPurgeAt = now;
  return true;
}

export function availabilityFromProbe(
  row: { ok?: unknown } | null | undefined,
  failed: boolean,
): boolean {
  return !failed && row?.ok === 1;
}

/**
 * Synced passkeys often report signature counter 0 forever. Treat 0 as
 * "counter not supported" and keep the stored high-water mark. A positive
 * reported counter that did not advance is a clone.
 */
export function nextStoredCounter(stored: number, reported: number): number | null {
  if (!Number.isFinite(stored) || !Number.isFinite(reported) || stored < 0 || reported < 0) {
    return null;
  }
  if (reported === 0) {
    return stored;
  }
  if (reported > stored) {
    return reported;
  }
  return null;
}

function parseOrigin(origin: string): URL | null {
  try {
    const url = new URL(origin);
    if (url.origin !== origin) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

function isPagesDevHost(hostname: string): boolean {
  if (hostname === PRODUCTION_RP_ID) {
    return true;
  }
  return hostname.endsWith(`.${PRODUCTION_RP_ID}`) && hostname.length > PRODUCTION_RP_ID.length + 1;
}

function isIpHostname(hostname: string): boolean {
  if (hostname === '127.0.0.1' || hostname === '::1' || hostname === '[::1]') {
    return true;
  }
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname);
}

function rpIdForHostname(hostname: string, configured?: string): string | null {
  if (hostname === 'localhost') {
    return 'localhost';
  }
  if (configured && rpIdCompatible(hostname, configured)) {
    return configured;
  }
  if (isPagesDevHost(hostname)) {
    return PRODUCTION_RP_ID;
  }
  return configured ?? null;
}

function rpIdCompatible(hostname: string, rpId: string): boolean {
  return hostname === rpId || hostname.endsWith(`.${rpId}`);
}
