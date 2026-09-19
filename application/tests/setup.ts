import { Storage } from 'happy-dom';

/*
 * Give the suite a working Web Storage.
 *
 * Node 22+ ships its own experimental `globalThis.localStorage`, and under vitest's happy-dom
 * environment `window` IS `globalThis` - so that getter occupies the only slot there is. It is
 * inert without the `--localstorage-file` process flag: reading it throws, and `clear` is not
 * even a function.
 *
 * The damage went past a spec's own cleanup. Every store in this app reaches for the BARE
 * global - `localStorage.getItem('nura.locale')` - so the code under test was talking to that
 * broken object while each store's `try/catch` quietly swallowed the failure into its default.
 * The persistence those specs describe was never exercised; they passed because nothing threw.
 *
 * happy-dom's own Storage is installed over it instead: the real implementation the browser
 * environment is built from, not a shim written to satisfy the assertions. A fresh pair per
 * test FILE, which is the isolation boundary vitest already gives - specs that care about a
 * clean slate between cases clear it themselves in `beforeEach`.
 */
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: new Storage() });
Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: new Storage() });

/*
 * Nothing in this suite reaches the network, and this is what makes that true rather than
 * hoped for - the same bargain the server harness makes by defaulting its price gateway to
 * one that always refuses.
 *
 * `api.ts` reads its manifest from a script tag the kit embeds in a served page, and falls
 * back to `GET /api/_manifest` when there is none - which in a spec there never is. A
 * relative url resolves against the happy-dom environment's own origin, and vitest's default
 * for that is `http://localhost:3000`, which is also the port `npm run dev` listens on. So
 * every run of the browser half opened a real socket to it: harmless-looking when nothing
 * answered, beyond an ECONNREFUSED dumped into the output, and quietly NOT harmless when a
 * dev server was up, because then the client under test held a real manifest and the suite
 * behaved differently depending on what else was running on the machine.
 *
 * Refusing by default costs a spec nothing - every one of them installs its own `fetch`, and
 * `vi.unstubAllGlobals` restores this one - and a spec that forgets now fails by name
 * instead of reaching out.
 */
globalThis.fetch = ((input: RequestInfo | URL): Promise<Response> =>
{
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

    return Promise.reject(new Error(`the suite reached the network: ${ url } - stub fetch in this spec`));
}) as typeof fetch;
