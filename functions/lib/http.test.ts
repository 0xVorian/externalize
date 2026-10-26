import { describe, expect, it } from 'vitest';
import { HOST_SESSION_COOKIE, SESSION_COOKIE, clearCookieHeaders, cookieHeader } from './http';

describe('session cookies', () => {
  it('sets the host-only name on HTTPS and the plain name on HTTP', () => {
    expect(cookieHeader('tok', 'https://externalize.pages.dev')).toContain(`${HOST_SESSION_COOKIE}=tok`);
    expect(cookieHeader('tok', 'http://localhost:8788')).toContain(`${SESSION_COOKIE}=tok`);
  });

  it('clears both cookie names so leftover HTTP/HTTPS cookies cannot linger', () => {
    const https = clearCookieHeaders('https://externalize.pages.dev');
    expect(https.some((header) => header.startsWith(`${SESSION_COOKIE}=`))).toBe(true);
    expect(https.some((header) => header.startsWith(`${HOST_SESSION_COOKIE}=`))).toBe(true);
    expect(https.every((header) => header.includes('Max-Age=0'))).toBe(true);
    expect(https.find((header) => header.startsWith(`${HOST_SESSION_COOKIE}=`))).toContain('Secure');

    const http = clearCookieHeaders('http://localhost:8788');
    expect(http.some((header) => header.startsWith(`${SESSION_COOKIE}=`))).toBe(true);
    expect(http.some((header) => header.startsWith(`${HOST_SESSION_COOKIE}=`))).toBe(true);
  });
});
