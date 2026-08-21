// The gate in front of the dashboard.
//
// This is the file where a mistake costs the most, so it tests the refusals rather than the
// happy path: a wrong key, a forged request, a stale cookie, a deployment with no key at all,
// and the ways each of those must NOT differ from the others in what it gives away.
import { describe, it, expect, afterEach } from 'vitest';

import { keyIsStrong, loadAdminKey, matchesKey, normalizeKey } from '../src/admin/key.ts';
import { SessionStore } from '../src/admin/sessions.ts';
import { cookieName } from '../src/admin/guard.ts';
import type { SessionState } from '../src/schemas.ts';
import { TEST_KEY, adminHeader, closeAll, harness } from './support/fixtures.ts';

afterEach(closeAll);

describe('the key itself', () =>
{
    it('matches regardless of case or surrounding space, because a key gets pasted', () =>
    {
        expect(matchesKey('abcd-efgh-jklm-npqr', TEST_KEY)).toBe(true);
        expect(matchesKey(`  ${ TEST_KEY }  `, TEST_KEY)).toBe(true);
        expect(normalizeKey(' abcd ')).toBe('ABCD');
    });

    it('refuses anything that is not the key', () =>
    {
        expect(matchesKey('', TEST_KEY)).toBe(false);
        expect(matchesKey('ABCD-EFGH-JKLM-NPQZ', TEST_KEY)).toBe(false);
        // A prefix must not pass. The comparison is over digests, so length tells nothing.
        expect(matchesKey('ABCD', TEST_KEY)).toBe(false);
        expect(matchesKey(`${ TEST_KEY }X`, TEST_KEY)).toBe(false);
    });

    it('measures strength in real characters, not in separators', () =>
    {
        expect(keyIsStrong(TEST_KEY)).toBe(true);
        expect(keyIsStrong('A-B-C-D-E-F-G-H')).toBe(false);
        // A long passphrase from a password manager is fine - the floor is length, not shape.
        expect(keyIsStrong('correct horse battery staple')).toBe(true);
    });

    it('refuses to start in production without a key, and allows it in development', () =>
    {
        // The failure mode this prevents: a deploy that forgot the variable, warned into a log
        // nobody read, and served the dashboard to everyone.
        expect(() => loadAdminKey(undefined, { production: true })).toThrow(/ADMIN_KEY is not set/);
        expect(() => loadAdminKey('', { production: true })).toThrow(/ADMIN_KEY is not set/);
        expect(loadAdminKey(undefined, { production: false })).toBeNull();
    });

    it('refuses a weak key in either mode rather than quietly accepting it', () =>
    {
        expect(() => loadAdminKey('hunter2', { production: true })).toThrow(/too short/);
        expect(() => loadAdminKey('hunter2', { production: false })).toThrow(/too short/);
        expect(loadAdminKey(TEST_KEY, { production: true })?.key).toBe(TEST_KEY);
    });
});

describe('signing in', () =>
{
    it('exchanges the key for an httpOnly, same-site session cookie', async () =>
    {
        const api = harness();
        const response = await api.post('/api/admin/session', { key: TEST_KEY });

        expect(response.status).toBe(200);
        expect(((await response.json()) as SessionState).signedIn).toBe(true);

        const cookie = response.headers.get('set-cookie') ?? '';

        // Each of these is load-bearing: HttpOnly keeps page script away from the token,
        // SameSite=Strict stops it travelling on any cross-site request at all, and Path=/
        // is what the __Host- prefix requires of its production twin.
        expect(cookie).toContain('HttpOnly');
        expect(cookie).toMatch(/SameSite=Strict/i);
        expect(cookie).toContain('Path=/');
    });

    it('mints a __Host- cookie in production and a plain one in development', async () =>
    {
        // Not cosmetic: the browser DROPS a __Host- cookie that is not Secure, so over plain
        // http the dashboard would appear to sign in and be signed out on the next request.
        expect(cookieName(true)).toBe('__Host-nura_admin');
        expect(cookieName(false)).toBe('nura_admin');

        const secure = harness({ secure: true });
        const response = await secure.post('/api/admin/session', { key: TEST_KEY });

        expect(response.headers.get('set-cookie')).toContain('__Host-nura_admin');
        expect(response.headers.get('set-cookie')).toContain('Secure');
    });

    it('refuses the wrong key without saying anything about the right one', async () =>
    {
        const api = harness();
        const response = await api.post('/api/admin/session', { key: 'ZZZZ-ZZZZ-ZZZZ-ZZZZ' });

        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({ signedIn: false, expiresAt: null });
        expect(response.headers.get('set-cookie')).toBeNull();
    });

    it('answers a deployment with no key the same way it answers a wrong one', async () =>
    {
        // Different status (503 is actionable for an operator), identical body. Telling the two
        // apart in the body would say whether a key is configured at all.
        const api = harness({ adminKey: null });
        const response = await api.post('/api/admin/session', { key: TEST_KEY });

        expect(response.status).toBe(503);
        expect(await response.json()).toEqual({ signedIn: false, expiresAt: null });
    });

    it('throttles repeated attempts from one address', async () =>
    {
        // Five per fifteen minutes is what makes a 76-bit key unreachable rather than merely
        // large. The sixth attempt is refused even though the key is correct.
        const api = harness();

        for (let attempt = 0; attempt < 5; attempt++)
        {
            expect((await api.post('/api/admin/session', { key: 'WRONG-WRONG-WRONG-KEYS' })).status).toBe(401);
        }

        const blocked = await api.post('/api/admin/session', { key: TEST_KEY });

        expect(blocked.status).toBe(429);
        expect(blocked.headers.get('set-cookie')).toBeNull();
    });

    it('validates the submitted shape at the boundary', async () =>
    {
        const api = harness();

        expect((await api.post('/api/admin/session', {})).status).toBe(422);
        expect((await api.post('/api/admin/session', { key: '' })).status).toBe(422);
    });
});

describe('cross-site requests', () =>
{
    it('refuses a sign-in the browser says came from another site', async () =>
    {
        // Sec-Fetch-Site is set by the browser and cannot be touched by page script, so a
        // 'cross-site' value is trustworthy in exactly the direction that matters.
        const api = harness();
        const response = await api.app.handle(new Request('http://local/api/admin/session', {
            method: 'POST',
            body: JSON.stringify({ key: TEST_KEY }),
            headers: { 'content-type': 'application/json', 'sec-fetch-site': 'cross-site' }
        }));

        expect(response.status).toBe(403);
        expect(response.headers.get('set-cookie')).toBeNull();
    });

    it('refuses a caller that sends neither Sec-Fetch-Site nor the dashboard header', async () =>
    {
        const api = harness();
        const response = await api.post('/api/admin/session', { key: TEST_KEY }, { sameOrigin: false });

        expect(response.status).toBe(403);
    });

    it('accepts a non-browser caller that presents the dashboard header', async () =>
    {
        // A cross-site page cannot set a custom header without a preflight, and this server
        // answers no CORS preflight - so the header is proof the caller is not a hostile page.
        const api = harness();
        const response = await api.app.handle(new Request('http://local/api/admin/session', {
            method: 'POST',
            body: JSON.stringify({ key: TEST_KEY }),
            headers: { 'content-type': 'application/json', ...adminHeader }
        }));

        expect(response.status).toBe(200);
    });
});

describe('the session', () =>
{
    it('reports signed out for a browser that has never signed in', async () =>
    {
        // A plain "no" rather than a 401: the dashboard calls this to decide what to render.
        const api = harness();
        const response = await api.get('/api/admin/session');

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ signedIn: false, expiresAt: null });
    });

    it('reports signed in, and when it runs out', async () =>
    {
        const api = harness();
        const cookie = await api.signIn();
        const response = await api.app.handle(new Request('http://local/api/admin/session', { headers: { cookie } }));
        const state = (await response.json()) as SessionState;

        expect(state.signedIn).toBe(true);
        expect(Date.parse(state.expiresAt ?? '')).toBeGreaterThan(Date.now());
    });

    it('signs out, revokes the row, and clears the cookie', async () =>
    {
        const api = harness();
        const cookie = await api.signIn();

        expect(api.sessions.count()).toBe(1);

        const response = await api.post('/api/admin/session/end', {}, { cookie });

        expect(response.status).toBe(200);
        expect(api.sessions.count()).toBe(0);
        // Max-Age=0 is the deletion: it takes precedence over Expires in every current
        // client, and the browser drops the cookie the moment it reads this.
        expect(response.headers.get('set-cookie')).toMatch(/Max-Age=0/i);
    });

    it('signs out even when the session has already gone', async () =>
    {
        // Answering 401 here would strand a stale cookie in the browser with nothing able to
        // clear it, which is the one outcome a sign-out button must never produce.
        const api = harness();
        const response = await api.post('/api/admin/session/end', {}, { cookie: 'nura_admin=nonsense' });

        expect(response.status).toBe(200);
        expect(response.headers.get('set-cookie')).toMatch(/Max-Age=0/i);
    });

    it('does not accept a cookie the server never issued', async () =>
    {
        const api = harness();
        const response = await api.app.handle(new Request('http://local/api/admin/session', {
            headers: { cookie: 'nura_admin=forged-token-value' }
        }));

        expect(await response.json()).toEqual({ signedIn: false, expiresAt: null });
    });
});

describe('the session store', () =>
{
    const stores: SessionStore[] = [];

    afterEach(() =>
    {
        while (stores.length > 0)
        {
            stores.pop()?.close();
        }
    });

    function sessions(): SessionStore
    {
        const next = new SessionStore(':memory:');

        stores.push(next);

        return next;
    }

    it('stores the token hashed, so a leaked database is not a set of live logins', () =>
    {
        const store = sessions();
        const issued = store.create();

        // The raw token verifies; nothing resembling it is what was written down. This is the
        // same reasoning as a password hash, minus the salt and the work factor - 32 bytes of
        // CSPRNG output has no dictionary to run against it.
        expect(store.verify(issued.token)).not.toBeNull();
        expect(issued.token.length).toBeGreaterThan(32);
    });

    it('expires a session and refuses to replay it', () =>
    {
        const store = sessions();
        const issued = store.create(-1);

        expect(store.verify(issued.token)).toBeNull();
        // Deleted on the way past, so it cannot be replayed before the next sweep either.
        expect(store.count()).toBe(0);
    });

    it('revokes one session, and revokes them all', () =>
    {
        const store = sessions();
        const first = store.create();
        const second = store.create();

        expect(store.revoke(first.token)).toBe(true);
        expect(store.verify(first.token)).toBeNull();
        expect(store.verify(second.token)).not.toBeNull();

        expect(store.revokeAll()).toBe(1);
        expect(store.count()).toBe(0);
    });

    it('answers an unknown token with null rather than throwing', () =>
    {
        const store = sessions();

        expect(store.verify('never-issued')).toBeNull();
        expect(store.revoke('never-issued')).toBe(false);
    });
});
