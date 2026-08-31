/**
 * Nura Wallet over `nurawallet://`.
 *
 * Every other wallet this site talks to is a browser extension, so it can inject a provider
 * into this page and `lib/wallet.ts` hands it an EIP-1193 request directly. Nura Wallet is a
 * Tauri application - Windows, Linux and Android - and no application can inject anything into
 * a browser it does not own. Inside the wallet's OWN in-app browser it does inject one and
 * announces it under EIP-6963 like any extension, and then none of this file runs. In Chrome,
 * Safari or the Android browser there is nothing to inject into, and the only channel left is
 * the URL scheme the app registers with the operating system.
 *
 * The protocol is the wallet's, declared in its `src/core/deeplink.ts` and implemented for
 * dApps by the connector it ships (`sdk/nura-connector.js`). It is written out here rather than
 * pulled in as that script for two reasons: the connector announces itself over EIP-6963 the
 * moment it loads, which would put "Detected" beside Nura Wallet in the picker for every
 * visitor alive including the ones who have never installed it - and this repository has one
 * file that talks to a wallet, on purpose, in TypeScript the compiler checks.
 *
 * One request out:
 *
 *     nurawallet://dapp?request=<base64url({ id, method, params, callback })>
 *
 * One answer back. The app has no handle on the tab that asked - it opens `callback` in the
 * system browser with `#nura=<base64url({ id, result?, error? })>` appended, which arrives as a
 * FRESH tab of this site. That tab is not the one waiting, so the reply is passed sideways over
 * a BroadcastChannel (a `storage` write for a browser without one) and the fragment is wiped
 * from the address bar. The fragment, and not the query, is what keeps the answer out of the
 * server's logs.
 *
 * The callback must be `https:`. The wallet parses it and drops anything else on the floor
 * without a word, so a request sent from `http://localhost` is never answered and presents here
 * as `unanswered` - deep links can only be exercised end to end against a TLS origin.
 */

/** Registered by the desktop build (`tauri.conf.json`) and by the Android manifest. */
const SCHEME = 'nurawallet';

/**
 * Both names are the connector's own and are deliberately identical to it. A page that ever
 * loads `nura-connector.js` as well must not end up with two private channels, one of which
 * the returning tab writes to while the other is the one being read.
 */
const CHANNEL = 'nura-wallet-connector';
const REPLY_KEY = 'nura-connector/reply/';

/**
 * How long a request waits before it is called unanswered.
 *
 * Long enough to leave the browser, unlock a wallet and read a prompt; short enough that
 * somebody who does not have the app installed is told so while they are still looking at the
 * page that sent them. The connector waits five minutes, which is the right call for a swap
 * mid-trade and the wrong one for a button on a landing page: nothing here is worth a stuck
 * spinner that outlives the visit.
 */
const WAIT_MS = 120_000;

/** The answer, exactly as the wallet's `answerDapp` shapes it. */
interface DeepLinkReply
{
    id: string;
    result?: unknown;
    error?: { code?: number; message?: string; data?: unknown };
}

/**
 * What came of one deep link.
 *
 * Three states and not a thrown error, for the same reason `AddChainOutcome` is not a boolean:
 * "the wallet said no" and "nothing on this machine answered at all" are different sentences,
 * and only the first of them is the wallet talking.
 */
export type LinkOutcome =
    | { status: 'answered'; result: unknown }
    | { status: 'failed'; error: unknown }
    | { status: 'unanswered' };

interface Waiting
{
    settle: (outcome: LinkOutcome) => void;
    timer: number;
}

/** Requests this tab is still waiting on, by the id it sent. */
const waiting = new Map<string, Waiting>();

let channel: BroadcastChannel | null = null;

const toBase64Url = (value: string): string =>
{
    const bytes = new TextEncoder().encode(value);

    let raw = '';

    for (const byte of bytes)
    {
        raw += String.fromCodePoint(byte);
    }

    return btoa(raw).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
};

const fromBase64Url = (value: string): string =>
    new TextDecoder().decode(
        Uint8Array.from(atob(value.replaceAll('-', '+').replaceAll('_', '/')), (char) => char.codePointAt(0) ?? 0)
    );

/**
 * A reply, or null.
 *
 * The text arrives from a URL fragment and from other tabs, so it is parsed and not trusted.
 * The `id` is the whole gate: an answer whose id is not one this tab is waiting on is dropped
 * by `deliver`, which is what stops a stale fragment - a bookmark, a shared link, a back
 * button - from settling a request made minutes later.
 */
const replyFrom = (text: string): DeepLinkReply | null =>
{
    let body: unknown;

    try
    {
        body = JSON.parse(text);
    }
    catch
    {
        return null;
    }

    return typeof body === 'object' && body !== null && typeof (body as { id?: unknown }).id === 'string'
        ? body as DeepLinkReply
        : null;
};

const deliver = (reply: DeepLinkReply | null): void =>
{
    const held = reply === null ? undefined : waiting.get(reply.id);

    if (reply === null || held === undefined)
    {
        return;
    }

    waiting.delete(reply.id);
    window.clearTimeout(held.timer);

    held.settle(reply.error === undefined
        ? { status: 'answered', result: reply.result }
        : { status: 'failed', error: reply.error });
};

/** `#nura=<base64url>`, wherever in the fragment the wallet appended it. */
const CARRIED = /[#&]nura=([A-Za-z0-9_-]+)/;

/**
 * This tab is the one the WALLET opened, carrying an answer for a tab that is still waiting.
 *
 * It runs on a page load that arrived with a fragment and does nothing on almost all of them.
 * When it does find one it delivers the reply three ways - to this tab, over the channel, and
 * through a `storage` write that fires in every OTHER tab for a browser with no
 * BroadcastChannel - and then clears the address bar either way. The fragment is a one-shot
 * token: a reader who bookmarks or shares the URL should not be carrying a wallet reply in it.
 */
const catchReply = (): void =>
{
    const carried = CARRIED.exec(window.location.hash);

    if (carried !== null)
    {
        try
        {
            const reply = replyFrom(fromBase64Url(carried[1]));

            if (reply !== null)
            {
                deliver(reply);
                channel?.postMessage(reply);

                // Written and immediately removed: `storage` fires on the write, and leaving
                // the key behind would hand a later visit an answer to nothing it asked.
                localStorage.setItem(`${ REPLY_KEY }${ reply.id }`, JSON.stringify(reply));
                localStorage.removeItem(`${ REPLY_KEY }${ reply.id }`);
            }
        }
        catch
        {
            // A truncated fragment, or storage the browser will not hand over. There is
            // nothing to deliver and nothing to say - the address is still cleaned below.
        }

        try
        {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        catch
        {
            // A document that will not take a history entry keeps its fragment. Harmless.
        }
    }
};

if (typeof window !== 'undefined')
{
    if ('BroadcastChannel' in window)
    {
        channel = new BroadcastChannel(CHANNEL);

        channel.onmessage = (event: MessageEvent<unknown>): void =>
        {
            // Structured clone hands back the object the other tab posted; a browser that
            // stringified it on the way through is read the same way the storage key is.
            deliver(typeof event.data === 'string'
                ? replyFrom(event.data)
                : replyFrom(JSON.stringify(event.data ?? null)));
        };
    }

    window.addEventListener('storage', (event: StorageEvent) =>
    {
        if (event.key === null || !event.key.startsWith(REPLY_KEY) || event.newValue === null)
        {
            return;
        }

        deliver(replyFrom(event.newValue));
    });

    catchReply();
}

/** Test seam: drops what this tab is waiting on, so one spec's request cannot settle the next. */
export const forgetLinks = (): void =>
{
    for (const held of waiting.values())
    {
        window.clearTimeout(held.timer);
    }

    waiting.clear();
};

/**
 * Ask Nura Wallet one thing, over the link.
 *
 * The callback is this page without its query string or fragment: the wallet reopens it, and a
 * reader who arrived on a campaign URL should not have that URL rebuilt for them by a wallet.
 */
export const nuraRequest = (method: string, params: readonly unknown[]): Promise<LinkOutcome> =>
    new Promise<LinkOutcome>((resolve) =>
    {
        const id = `${ Date.now().toString(36) }-${ Math.random().toString(36).slice(2) }`;

        const timer = window.setTimeout(() =>
        {
            waiting.delete(id);
            resolve({ status: 'unanswered' });
        }, WAIT_MS);

        waiting.set(id, { settle: resolve, timer });

        const request = {
            id,
            method,
            params: [...params],
            callback: `${ window.location.origin }${ window.location.pathname }`
        };

        // An assignment and not an anchor click: this is the shape the wallet's own connector
        // uses and therefore the one its handler has been exercised against. A registered
        // scheme hands the URL to the operating system and leaves this document where it is;
        // an unregistered one does nothing at all, which is the case `unanswered` reports.
        window.location.href = `${ SCHEME }://dapp?request=${ toBase64Url(JSON.stringify(request)) }`;
    });
