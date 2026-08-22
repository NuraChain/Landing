/**
 * Publishes the articles in `content/blog/` into the blog database.
 *
 * The database is gitignored - it IS the blog, restored from a backup rather than a clone - so
 * the content in this repository has to be replayable into a fresh one. That is what this
 * script is: the reproducible half of publishing, run once against whichever database
 * `DB_PATH` names.
 *
 * IDEMPOTENT, by slug. A second run updates the post that is already there instead of failing
 * on the UNIQUE index or writing a duplicate under a suffixed slug. That matters more than it
 * sounds: correcting a typo in one translation should be an edit to this repository followed by
 * a re-run, not a hand edit in the dashboard that the repository then disagrees with.
 *
 *   node scripts/seed-blog.ts
 *   DB_PATH=../.data/blog.db node scripts/seed-blog.ts
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ARTICLES } from '../content/blog/index.ts';
import { BlogStore } from '../src/blog/store.ts';
import { POST_LOCALES, type PostLocale } from '../src/schemas.ts';

try
{
    process.loadEnvFile();
}
catch
{
    // No .env - the ambient environment is the configuration, same as main.ts.
}

const CONTENT = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'blog');
const dbPath = process.env.DB_PATH ?? '../.data/blog.db';

/**
 * Constructs the parser in `application/src/lib/markdown.ts` will not render.
 *
 * The server cannot import that parser - the application imports the server, and reversing it
 * would put a browser module in the API's dependency graph - so this is a deliberate, narrow
 * copy of the two rules an author actually trips over. It is not a markdown validator. It
 * exists because a table silently renders as literal pipe characters in ten languages at once,
 * and nobody reads all ten.
 */
const UNSUPPORTED: ReadonlyArray<{ test: RegExp; why: string }> = [
    { test: /^\s*\|.*\|\s*$/m, why: 'a markdown table - the renderer has no table block' },
    { test: /^\s{2,}[-*]\s/m, why: 'a nested list - the renderer flattens only one level' },
    { test: /<[a-z][a-z0-9]*(\s[^>]*)?>/i, why: 'raw HTML - the renderer emits text, never markup' }
];

function bodyOf(slug: string, locale: PostLocale): string
{
    const path = join(CONTENT, slug, `${ locale }.md`);

    // Refuses rather than skipping. A missing file would otherwise publish a post in nine
    // languages and leave the tenth reading a fallback nobody chose.
    if (!existsSync(path))
    {
        throw new Error(`${ slug }: no body for "${ locale }" (expected ${ path })`);
    }

    const body = readFileSync(path, 'utf8').trim();

    if (body === '')
    {
        throw new Error(`${ slug }/${ locale }.md is empty`);
    }

    /*
     * Checked with fenced code REMOVED.
     *
     * Inside a fence every one of these is legitimate: a shell continuation indents `-H`, a
     * JSON payload contains angle brackets, and a table drawn in a code sample is meant to be
     * literal pipes. The parser passes fenced content through verbatim, so scanning it would
     * reject bodies that render perfectly.
     */
    const prose = body.replace(/```[\s\S]*?(?:```|$)/g, '\n');

    for (const rule of UNSUPPORTED)
    {
        if (rule.test.test(prose))
        {
            throw new Error(`${ slug }/${ locale }.md contains ${ rule.why }`);
        }
    }

    return body;
}

const store = new BlogStore(dbPath);
let created = 0;
let updated = 0;

try
{
    // One transaction for the whole cluster: a run that fails halfway leaves the database as it
    // was rather than half-seeded, which is the state that is genuinely hard to reason about.
    store.transaction(() =>
    {
        for (const article of ARTICLES)
        {
            const bodies = new Map<PostLocale, string>(
                POST_LOCALES.map((locale) => [locale, bodyOf(article.slug, locale)]));

            const fields = {
                slug: article.slug,
                status: article.status,
                coverImage: article.coverImage,
                tags: article.tags,
                defaultLocale: article.defaultLocale
            };

            const translationFor = (locale: PostLocale): { title: string; summary: string; body: string } => ({
                title: article.heads[locale].title,
                summary: article.heads[locale].summary,
                body: bodies.get(locale)!
            });

            // Drafts included: a post that was seeded as a draft still has to be findable by
            // slug, or a re-run would try to create a second post with the same one.
            const existing = store.bySlug(article.slug, { includeDrafts: true });
            let id: number;

            if (existing === null)
            {
                id = store.create(fields, article.defaultLocale, translationFor(article.defaultLocale)).post.id;
                created++;
            }
            else
            {
                id = existing.post.id;
                store.update(id, fields);
                updated++;
            }

            for (const locale of POST_LOCALES)
            {
                store.upsertTranslation(id, locale, translationFor(locale));
            }

            console.log(`  ${ existing === null ? 'created' : 'updated' }  /blog/${ article.slug }  (${ POST_LOCALES.length } languages)`);
        }
    });

    console.log(`\n${ created } created, ${ updated } updated, in ${ resolve(dbPath) }`);
}
finally
{
    // The database holds a file handle and a write-ahead log; leaving them open keeps the
    // process alive and the file locked against the server's next boot.
    store.close();
}
