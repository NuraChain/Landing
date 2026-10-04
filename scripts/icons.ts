// Renders the icon set.
//
//   npm run icons
//
// One master, application/public/icon.png - the mark on its own plate, 512x512, edge to edge -
// and every other file a platform asks for is derived from it and committed, the way the social
// card and the whitepaper PDFs are. The sizes used to be exported by hand, and the hand-made
// ones had drifted from the master: the favicons and the apple-touch-icon carried a rounded
// corner baked into an alpha channel, which is the one thing an icon file must not decide.
//
// SQUARE AND OPAQUE, every one of them. Each platform cuts its own shape - iOS a superellipse,
// Android a circle, a squircle or a teardrop depending on the launcher, Windows a tile - and it
// cuts that shape out of a full square. A corner the file rounded for itself shows up as a dark
// notch inside the platform's own mask on iOS, and as a transparent hole over whatever is behind
// a browser tab. So nothing here has an alpha channel at all: the screenshot is RGB, and
// `tests/head.spec.ts` reads the colour type out of every file's header.
//
// Chromium comes from Playwright, the same dev dependency `npm run og:image` drives, and never
// a runtime one. Nothing on a deploy runs a browser.
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { launchBrowser } from './browsers.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'application', 'public');
const MASTER = join(PUBLIC, 'icon.png');

/** The master's own size, and the largest thing derived from it - nothing here upscales. */
const MASTER_SIZE = 512;

interface Target
{
    file: string;
    size: number;

    /**
     * How much of the canvas the artwork spans; the rest is plate.
     *
     * 1 everywhere except the maskable pair. Android guarantees only the middle of a maskable
     * icon - a circle 80% of the width - and the master's larger sparkle reaches 87% of the way
     * from the centre to the edge, so drawn full-size a round launcher shears its tip off. At
     * 0.8 that tip lands at 70% and the whole mark clears every mask shape in use.
     */
    span: number;
}

/**
 * Every file, and the one consumer each exists for.
 *
 * The names `icon.png`, `favicon-16.png`, `favicon-32.png` and `apple-touch-icon.png` are the
 * ones index.html, the manifest, the header and `ICON_URL` already point at, so they stay.
 */
const TARGETS: readonly Target[] =
[
    // Browser tabs, bookmarks and history rows, at 1x and 2x.
    { file: 'favicon-16.png', size: 16, span: 1 },
    { file: 'favicon-32.png', size: 32, span: 1 },
    // iOS and iPadOS "Add to Home Screen". 180 is the 3x iPhone size; the system downsamples
    // it for everything smaller and masks the corners itself.
    { file: 'apple-touch-icon.png', size: 180, span: 1 },
    // Android and desktop install prompts, the app switcher and the splash screen. 192 is also
    // the favicon Google Search reads: it wants a multiple of 48 and ignores the 16 and the 32.
    { file: 'icon-192.png', size: 192, span: 1 },
    // Android adaptive icons - the same two sizes, with the mark pulled into the safe zone.
    { file: 'icon-maskable-192.png', size: 192, span: 0.8 },
    { file: 'icon-maskable-512.png', size: 512, span: 0.8 }
];

/**
 * The sizes inside favicon.ico: a taskbar pin, a desktop shortcut, and every client that asks
 * for `/favicon.ico` without reading the markup - feed readers, link unfurlers, older crawlers.
 */
const ICO_SIZES = [16, 32, 48] as const;

/** A PNG's width, height and colour type, read from its IHDR chunk. */
function header(png: Buffer): { width: number; height: number; colorType: number }
{
    return { width: png.readUInt32BE(16), height: png.readUInt32BE(20), colorType: png.readUInt8(25) };
}

/**
 * Wraps PNGs in an ICO container.
 *
 * The format has carried PNG entries since Windows Vista and every browser reads them, so no
 * BMP encoding is needed: a six-byte header, sixteen bytes of directory per image, then the
 * files themselves, untouched.
 */
function ico(images: ReadonlyArray<{ size: number; png: Buffer }>): Buffer
{
    const DIRECTORY = 6;
    const ENTRY = 16;
    const head = Buffer.alloc(DIRECTORY + ENTRY * images.length);

    head.writeUInt16LE(0, 0);
    // 1 is an icon; 2 would be a cursor.
    head.writeUInt16LE(1, 2);
    head.writeUInt16LE(images.length, 4);

    let offset = head.length;

    images.forEach(({ size, png }, index) =>
    {
        const at = DIRECTORY + ENTRY * index;

        // One byte each, so 256 is written as 0. Nothing here is that large.
        head.writeUInt8(size, at);
        head.writeUInt8(size, at + 1);
        // No palette, reserved, one colour plane, 32 bits per pixel.
        head.writeUInt8(0, at + 2);
        head.writeUInt8(0, at + 3);
        head.writeUInt16LE(1, at + 4);
        head.writeUInt16LE(32, at + 6);
        head.writeUInt32LE(png.length, at + 8);
        head.writeUInt32LE(offset, at + 12);

        offset += png.length;
    });

    return Buffer.concat([head, ...images.map(({ png }) => png)]);
}

async function main(): Promise<void>
{
    const master = await readFile(MASTER);
    const shape = header(master);

    // Checked before anything is drawn: a master that is not a full opaque square would be
    // faithfully reproduced nine times, and the whole point of the script is that it cannot be.
    if (shape.width !== MASTER_SIZE || shape.height !== MASTER_SIZE)
    {
        throw new Error(`icon.png is ${ shape.width }x${ shape.height }; the master must be ${ MASTER_SIZE }x${ MASTER_SIZE }`);
    }

    const { browser, using } = await launchBrowser('chromium');

    console.log(`rendering with ${ using }`);

    try
    {
        // deviceScaleFactor 1: a canvas pixel IS an output pixel, so nothing is resampled twice.
        const page = await browser.newPage({ viewport: { width: MASTER_SIZE, height: MASTER_SIZE }, deviceScaleFactor: 1 });

        await page.setContent('<!doctype html><style>html,body{margin:0}canvas{display:block}</style><canvas></canvas>');

        const render = async (size: number, span: number): Promise<Buffer> =>
        {
            await page.evaluate(async ({ source, size, span }) =>
            {
                const image = new Image();

                image.src = source;
                await image.decode();

                const canvas = document.querySelector('canvas')!;
                const context = canvas.getContext('2d', { willReadFrequently: true })!;

                // The plate is whatever the master's own corner is, read rather than repeated
                // here as a literal - so a master redrawn on another colour pads its maskable
                // variants with that colour and not with last year's.
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                context.drawImage(image, 0, 0);

                const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;

                // Every fourth byte is an alpha. One translucent pixel anywhere in the master is
                // a rounded corner or a soft edge that every derived file would inherit.
                for (let at = 3; at < pixels.length; at += 4)
                {
                    if (pixels[at] !== 255)
                    {
                        throw new Error('icon.png has transparency; the master must be fully opaque');
                    }
                }

                const plate = `rgb(${ pixels[0] } ${ pixels[1] } ${ pixels[2] })`;
                const drawn = Math.round(size * span);
                const inset = Math.round((size - drawn) / 2);

                // `resizeQuality: 'high'` is a proper windowed filter. A plain `drawImage` from
                // 512 to 16 samples a handful of source pixels per output pixel and turns the
                // aperture blades into noise.
                const scaled = await createImageBitmap(image, { resizeWidth: drawn, resizeHeight: drawn, resizeQuality: 'high' });

                canvas.width = size;
                canvas.height = size;
                context.fillStyle = plate;
                context.fillRect(0, 0, size, size);
                context.drawImage(scaled, inset, inset);
            }, { source: `data:image/png;base64,${ master.toString('base64') }`, size, span });

            // A screenshot rather than `toDataURL`: Chromium writes it as RGB with no alpha
            // channel, which is the property the suite pins.
            return page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: size, height: size } });
        };

        for (const target of TARGETS)
        {
            const png = await render(target.size, target.span);

            await writeFile(join(PUBLIC, target.file), png);
            console.log(`${ target.file.padEnd(24) } ${ String(target.size).padStart(3) }x${ String(target.size).padEnd(3) } ${ String(png.length).padStart(6) } B`);
        }

        const entries: Array<{ size: number; png: Buffer }> = [];

        for (const size of ICO_SIZES)
        {
            entries.push({ size, png: await render(size, 1) });
        }

        const container = ico(entries);

        await writeFile(join(PUBLIC, 'favicon.ico'), container);
        console.log(`${ 'favicon.ico'.padEnd(24) } ${ ICO_SIZES.join('+').padEnd(7) } ${ String(container.length).padStart(6) } B`);

        await page.close();
    }
    finally
    {
        await browser.close();
    }
}

await main();
