// Generates an admin key in the shape the dashboard asks for: XXXX-XXXX-XXXX-XXXX.
//
// Run it rather than inventing one. A key somebody thought of is a key somebody can think of,
// and this is the only credential the dashboard has.
import { randomInt } from 'node:crypto';

// I, O, 0 and 1 are absent on purpose: a key is read off one screen and typed into another, and
// those are the four that get transcribed wrong. Twenty-eight symbols over sixteen positions is
// about 76 bits - not reachable through a login that allows five attempts every fifteen minutes.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// `randomInt` and not `Math.random()`: the second is a PRNG seeded from something guessable and
// has no business generating a credential. It is also unbiased over the range, which a naive
// `randomBytes(1)[0] % 32` would not be for an alphabet whose size does not divide 256.
const pick = () => ALPHABET[randomInt(ALPHABET.length)];
const group = () => Array.from({ length: 4 }, pick).join('');

const key = Array.from({ length: 4 }, group).join('-');

process.stdout.write(`${ key }\n`);
process.stderr.write('\nPut it in server/.env as:\n\n');
process.stderr.write(`    ADMIN_KEY=${ key }\n\n`);
process.stderr.write('That file is gitignored. It is the only thing between a visitor and the dashboard.\n');
