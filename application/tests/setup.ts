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
