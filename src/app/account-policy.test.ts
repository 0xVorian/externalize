import { afterEach, describe, expect, it } from 'vitest';
import {
  CHALLENGE_RATE_MAX,
  PRODUCTION_RP_ID,
  PURGE_INTERVAL_MS,
  allowChallengeCreation,
  assertSameOriginMutation,
  availabilityFromProbe,
  clientKeyFromHeaders,
  extraAllowedOrigins,
  isAllowedWebAuthnOrigin,
  nextStoredCounter,
  resetAccountPolicyForTests,
  resolveRelyingParty,
  shouldPurgeExpired,
} from './account-policy';

afterEach(() => {
  resetAccountPolicyForTests();
});

describe('resolveRelyingParty', () => {
  it('never derives RP ID or origin from a request Host', () => {
    const spoofed = resolveRelyingParty('https://evil.example', {
      WEBAUTHN_RP_ID: PRODUCTION_RP_ID,
      WEBAUTHN_ORIGIN: 'https://externalize.pages.dev',
    });
    expect(spoofed).toEqual({ error: 'origin-not-allowed' });
  });

  it('pins pages.dev hosts to the production RP ID and the request origin', () => {
    const preview = resolveRelyingParty('https://abc.externalize.pages.dev', {});
    expect(preview).toEqual({
      rpName: 'Externalize',
      rpID: PRODUCTION_RP_ID,
      origin: 'https://abc.externalize.pages.dev',
    });
    const production = resolveRelyingParty('https://externalize.pages.dev', {});
    expect(production).toMatchObject({ rpID: PRODUCTION_RP_ID, origin: 'https://externalize.pages.dev' });
  });

  it('uses localhost as RP ID for local wrangler and rejects IP origins', () => {
    expect(resolveRelyingParty('http://localhost:8788', {})).toEqual({
      rpName: 'Externalize',
      rpID: 'localhost',
      origin: 'http://localhost:8788',
    });
    expect(resolveRelyingParty('http://127.0.0.1:8788', {})).toEqual({ error: 'origin-not-allowed' });
    expect(isAllowedWebAuthnOrigin('http://127.0.0.1:8788')).toBe(false);
  });

  it('honours an explicit custom-domain allowlist', () => {
    const env = {
      WEBAUTHN_RP_ID: 'logic.example.org',
      WEBAUTHN_ORIGIN: 'https://logic.example.org',
      WEBAUTHN_ALLOWED_ORIGINS: 'https://preview.logic.example.org',
    };
    expect(extraAllowedOrigins(env)).toEqual([
      'https://logic.example.org',
      'https://preview.logic.example.org',
    ]);
    expect(resolveRelyingParty('https://logic.example.org', env)).toEqual({
      rpName: 'Externalize',
      rpID: 'logic.example.org',
      origin: 'https://logic.example.org',
    });
    expect(resolveRelyingParty('https://preview.logic.example.org', env)).toMatchObject({
      rpID: 'logic.example.org',
    });
  });
});

describe('assertSameOriginMutation', () => {
  it('rejects cross-origin POST/DELETE and missing Origin', () => {
    expect(assertSameOriginMutation('POST', 'https://evil.example', {})).toEqual({
      ok: false,
      error: 'csrf',
    });
    expect(assertSameOriginMutation('DELETE', null, {})).toEqual({ ok: false, error: 'csrf' });
    expect(assertSameOriginMutation('POST', 'http://localhost:8788', {})).toEqual({ ok: true });
    expect(assertSameOriginMutation('GET', null, {})).toEqual({ ok: true });
  });
});

describe('allowChallengeCreation', () => {
  it('caps unauthenticated challenge creation per client', () => {
    for (let i = 0; i < CHALLENGE_RATE_MAX; i += 1) {
      expect(allowChallengeCreation('203.0.113.8', 1_000)).toBe(true);
    }
    expect(allowChallengeCreation('203.0.113.8', 1_000)).toBe(false);
    expect(allowChallengeCreation('203.0.113.9', 1_000)).toBe(true);
  });
});

describe('shouldPurgeExpired', () => {
  it('purges on the first call and then only after the interval', () => {
    expect(shouldPurgeExpired(1_000)).toBe(true);
    expect(shouldPurgeExpired(1_000 + PURGE_INTERVAL_MS - 1)).toBe(false);
    expect(shouldPurgeExpired(1_000 + PURGE_INTERVAL_MS)).toBe(true);
  });
});

describe('nextStoredCounter', () => {
  it('accepts a reported 0 from synced passkeys and rejects a non-incrementing positive counter', () => {
    expect(nextStoredCounter(0, 0)).toBe(0);
    expect(nextStoredCounter(5, 0)).toBe(0);
    expect(nextStoredCounter(3, 4)).toBe(4);
    expect(nextStoredCounter(5, 5)).toBeNull();
    expect(nextStoredCounter(5, 3)).toBeNull();
  });
});

describe('availabilityFromProbe / client key', () => {
  it('hides accounts unless SELECT 1 actually succeeded', () => {
    expect(availabilityFromProbe({ ok: 1 }, false)).toBe(true);
    expect(availabilityFromProbe({ ok: 1 }, true)).toBe(false);
    expect(availabilityFromProbe(null, false)).toBe(false);
    expect(availabilityFromProbe({ ok: 0 }, false)).toBe(false);
  });

  it('prefers CF-Connecting-IP over X-Forwarded-For', () => {
    const headers = new Headers({
      'CF-Connecting-IP': '198.51.100.4',
      'X-Forwarded-For': '203.0.113.8, 192.0.2.1',
    });
    expect(clientKeyFromHeaders(headers)).toBe('198.51.100.4');
  });
});
