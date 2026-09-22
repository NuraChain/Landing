// Launching the browsers the QA scripts drive, with one fallback that matters.
//
// Playwright downloads its own pinned builds, and that download is the part most likely to be
// unavailable - a locked-down network, a proxy, an offline machine. When the bundled Chromium
// is not on disk but a real Chrome or Edge is, driving that is far better than skipping the
// engine entirely: the point of these scripts is to exercise a browser, and a stable channel
// is a browser. The run says which binary it used, so a result is never ambiguous about it.
import { chromium, firefox } from 'playwright';

/** The stable channels to try, in order, when the pinned Chromium is missing. */
const CHANNELS = ['chrome', 'msedge'];

/**
 * Launches one engine.
 *
 * @param {'chromium' | 'firefox'} engine
 * @returns {Promise<{ browser: import('playwright').Browser, using: string }>}
 * @throws when neither the pinned build nor any stable channel can be launched.
 */
export async function launchBrowser(engine)
{
    if (engine === 'firefox')
    {
        return { browser: await firefox.launch(), using: 'firefox (playwright build)' };
    }

    if (engine !== 'chromium')
    {
        throw new Error(`unknown browser "${ engine }" - use chromium, firefox or all`);
    }

    try
    {
        return { browser: await chromium.launch(), using: 'chromium (playwright build)' };
    }
    catch (bundled)
    {
        for (const channel of CHANNELS)
        {
            try
            {
                return { browser: await chromium.launch({ channel }), using: `chromium (${ channel } channel)` };
            }
            catch
            {
                // Try the next channel; the bundled failure is the one worth reporting.
            }
        }

        throw new Error(`${ bundled.message.split('\n')[0] } - run \`npx playwright install chromium\`, `
            + 'or install Chrome or Edge so the run can use the stable channel');
    }
}
