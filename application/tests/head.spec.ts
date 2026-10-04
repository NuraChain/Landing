// index.html's head, and the manifest hanging off it.
//
// Nothing in here is rendered by a component, so no other spec sees it: the shell is a literal
// file that the kit splices markup into, and its head is what a crawler, a link preview and an
// "Add to Home screen" prompt all read first. The failure mode is the quiet kind - a manifest
// whose icons were renamed, or a robots directive somebody removed - so it is asserted against
// the file itself.
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, it, expect } from 'vitest';

// Resolved from the project root rather than from `import.meta.url`, for the same reason
// prepaint.spec.ts is: under happy-dom that URL is an http:// one and `fileURLToPath` refuses.
const ROOT = process.cwd();
const HTML = readFileSync(resolve(ROOT, 'index.html'), 'utf8');

/** The `href` of the first `<link rel="...">` in the shell, or null. */
const linkHref = (rel: string): string | null =>
    new RegExp(`<link[^>]*rel="${ rel }"[^>]*>`, 'u').exec(HTML)?.[0].match(/href="([^"]*)"/u)?.[1] ?? null;

interface Manifest
{
    name: string;
    short_name: string;
    start_url: string;
    display: string;
    background_color: string;
    theme_color: string;
    icons: { src: string; sizes: string; type: string; purpose?: string }[];
}

/** A PNG's width, height and colour type, read from its IHDR chunk. */
const png = (path: string): { width: number; height: number; colorType: number } =>
{
    const bytes = readFileSync(resolve(ROOT, 'public', path.replace(/^\//u, '')));

    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), colorType: bytes.readUInt8(25) };
};

/** Every `<link rel="...">` of one kind in the shell, as its href and its declared size. */
const links = (rel: string): { href: string; sizes: string }[] =>
    [...HTML.matchAll(new RegExp(`<link[^>]*rel="${ rel }"[^>]*>`, 'gu'))].map(([tag]) => ({
        href: /href="([^"]*)"/u.exec(tag)?.[1] ?? '',
        sizes: /sizes="([^"]*)"/u.exec(tag)?.[1] ?? ''
    }));

describe('the shell head', () =>
{
    /*
     * Stated rather than omitted. A crawler reads an absent directive as `index, follow`
     * already, so this is not about the crawler - it is about the difference between a page
     * that is deliberately indexable and one nobody thought about, which is invisible in
     * served markup when the tag is missing.
     */
    it('declares the site indexable', () =>
    {
        const robots = /<meta\s+name="robots"[^>]*content="([^"]*)"/u.exec(HTML)?.[1];

        expect(robots).toBe('index, follow');
    });

    // Exactly one. The server strips this line before splicing a page's own head in, and two
    // in a document resolve to the most restrictive - so a duplicate here would be /about's
    // `noindex` quietly applying to the whole site.
    it('declares it exactly once', () =>
    {
        expect([...HTML.matchAll(/<meta\s+name="robots"/gu)]).toHaveLength(1);
    });

    it('links a manifest and an apple-touch-icon', () =>
    {
        expect(linkHref('manifest')).toBe('/manifest.json');
        expect(linkHref('apple-touch-icon')).toBe('/apple-touch-icon.png');
    });

    /*
     * `.webmanifest` is the conventional extension and it is the wrong one here: the server
     * maps an extension to a Content-Type from a fixed table and does not carry that one, so
     * the file would be served `application/octet-stream` and every browser would drop the
     * manifest silently. `.json` lands on a JSON MIME type, which is what the spec asks for.
     */
    it('names the manifest with an extension the server has a type for', () =>
    {
        expect(linkHref('manifest')!.endsWith('.json')).toBe(true);
    });
});

describe('the web app manifest', () =>
{
    const manifest = JSON.parse(readFileSync(resolve(ROOT, 'public', 'manifest.json'), 'utf8')) as Manifest;

    it('carries what an install prompt needs', () =>
    {
        expect(manifest.name).toBeTruthy();
        expect(manifest.short_name).toBeTruthy();
        expect(manifest.start_url).toBe('/');
        expect(manifest.display).toBe('minimal-ui');
    });

    // Every icon is a file that actually ships. A renamed favicon takes the install prompt's
    // artwork with it and nothing else on the site notices.
    it('points every icon at a file in public/', () =>
    {
        expect(manifest.icons.length).toBeGreaterThan(0);

        for (const entry of manifest.icons)
        {
            expect(existsSync(resolve(ROOT, 'public', entry.src.replace(/^\//u, ''))), entry.src).toBe(true);
        }
    });

    // Chrome wants 192px or larger before it will offer to install anything.
    it('ships an icon large enough to install with', () =>
    {
        const largest = Math.max(...manifest.icons.map((entry) => Number(entry.sizes.split('x')[0])));

        expect(largest).toBeGreaterThanOrEqual(192);
    });

    /*
     * The manifest's colours and the shell's dark `theme-color` are the same token, `--bg`
     * from styles.css. They paint adjacent surfaces - the splash screen and the browser's own
     * chrome - so a drift between them shows up as a seam on first launch.
     */
    it('paints the same background the shell declares', () =>
    {
        const dark = /<meta\s+name="theme-color"[^>]*prefers-color-scheme:\s*dark[^>]*content="([^"]*)"/u.exec(HTML)?.[1];

        expect(dark).toBeTruthy();
        expect(manifest.background_color).toBe(dark);
        expect(manifest.theme_color).toBe(dark);
    });
});

describe('the icon set', () =>
{
    const manifest = JSON.parse(readFileSync(resolve(ROOT, 'public', 'manifest.json'), 'utf8')) as Manifest;

    /** Every PNG a platform is pointed at: the shell's links and the manifest's entries. */
    const declared = [
        ...links('icon').filter((link) => link.href.endsWith('.png')),
        ...links('apple-touch-icon'),
        ...manifest.icons.map((entry) => ({ href: entry.src, sizes: entry.sizes }))
    ];

    /*
     * `npm run icons` derives every one of these from public/icon.png. The size a platform is
     * TOLD is the size it lays out at before the file arrives, so a declared 192 over a 180
     * file is a blurred icon nothing reports.
     */
    it('ships every file at the size it is declared at, and square', () =>
    {
        expect(declared.length).toBeGreaterThan(0);

        for (const { href, sizes } of declared)
        {
            const { width, height } = png(href);

            expect(`${ width }x${ height }`, href).toBe(sizes);
            expect(width, href).toBe(height);
        }
    });

    /*
     * Colour type 2 is truecolour with NO alpha channel, so there is nowhere for a rounded
     * corner to be. The hand-exported favicons and apple-touch-icon carried one: iOS, Android
     * and Windows each mask the icon themselves, and a corner the file already rounded shows
     * through as a notch inside that mask.
     */
    it('ships none of them with an alpha channel', () =>
    {
        for (const { href } of declared)
        {
            expect(png(href).colorType, href).toBe(2);
        }
    });

    // Android guarantees only the middle of a maskable icon. Without one it letterboxes the
    // `any` icon inside a white circle, which is the launcher's way of saying nobody drew one.
    it('offers Android a maskable icon as well as a plain one', () =>
    {
        const purposes = manifest.icons.map((entry) => entry.purpose);

        expect(purposes).toContain('any');
        expect(purposes).toContain('maskable');
    });

    it('answers /favicon.ico for clients that never read the markup', () =>
    {
        const bytes = readFileSync(resolve(ROOT, 'public', 'favicon.ico'));

        // The ICONDIR header: reserved 0, type 1 (an icon, not a cursor), then the image count.
        expect(bytes.readUInt16LE(0)).toBe(0);
        expect(bytes.readUInt16LE(2)).toBe(1);
        expect(bytes.readUInt16LE(4)).toBeGreaterThanOrEqual(2);
    });
});

describe('the social card', () =>
{
    /*
     * 1200x630 and committed. `npm run og:image` renders it; `server/src/seo/pages.ts` names it
     * for every page with no picture of its own. It was /icon.png, a 512x512 square, which
     * every card layout around here either pillarboxes or crops - and which is small enough
     * that X drops the preview to its text-only `summary` form.
     */
    it('ships at the size every card layout expects', () =>
    {
        const file = resolve(ROOT, 'public', 'og-image.png');

        expect(existsSync(file), 'run `npm run og:image`').toBe(true);

        // The IHDR chunk: width and height are the two big-endian words at byte 16.
        const bytes = readFileSync(file);

        expect(bytes.readUInt32BE(16)).toBe(1200);
        expect(bytes.readUInt32BE(20)).toBe(630);
        // Facebook and X both refuse anything over 5 MB outright.
        expect(bytes.length).toBeLessThan(5 * 1024 * 1024);
    });
});
