// One Word From Your Ex — make.fun entry (u-brave-eagle-12-one-word-from-your-ex-cfd97ba2)
// Constant-writer: writes exactly one word to /output/entry.txt.
// Node 22, stdlib only. Deterministic: no network, no Date, no randomness.
// The word is the entrant's ex's word for them — a self-own, not an insult
// aimed at the ex: the narrator is the one who never picks up.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname } from "node:path";

// The entry: exactly one word. "voicemail" —
// she stopped calling because talking to me was like leaving a voicemail:
// a message recorded, never answered, never called back.
const ENTRY = "voicemail";

// Output path: the grader's /output/entry.txt; overridable only for local
// verification runs. The default is the competition's required path.
const OUT_PATH =
  process.env.OUTPUT_PATH ?? "/output/entry.txt";

// Exactly one word: one token, letters only.
const WORD_PATTERN = /^[A-Za-z]+$/;

function codePointLength(text: string): number {
  // Array.from iterates code points, so astral characters count once.
  return Array.from(text).length;
}

function selfCheck(text: string): void {
  // Gate (RULES.txt): UTF-8 text of 1 to 24 characters, not only whitespace,
  // and exactly one word — a single token with no whitespace at all.
  if (typeof text !== "string") {
    throw new Error("entry is not a string");
  }
  const length = codePointLength(text);
  if (length < 1 || length > 24) {
    throw new Error(`entry length ${length} code points is outside 1-24`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (/\s/.test(text)) {
    throw new Error("entry must be exactly one word (no whitespace)");
  }
  // Exactly one word: one token, letters only.
  if (!WORD_PATTERN.test(text)) {
    throw new Error("entry must be a single alphabetic word");
  }
}

function main(): void {
  selfCheck(ENTRY);
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  // No trailing newline: exactly one word and nothing else.
  writeFileSync(OUT_PATH, ENTRY, "utf8");
  // Verify the round-trip: bytes on disk must equal the entry exactly.
  const written = readFileSync(OUT_PATH, "utf8");
  if (written !== ENTRY) {
    throw new Error("round-trip mismatch: file does not equal the entry");
  }
  selfCheck(written);
  const sha256 = createHash("sha256").update(written, "utf8").digest("hex");
  console.log(`entry: ${written}`);
  console.log(`characters: ${codePointLength(written)}`);
  console.log(`bytes: ${Buffer.byteLength(written, "utf8")}`);
  console.log(`sha256: ${sha256}`);
  console.log(`wrote: ${OUT_PATH}`);
}

main();
