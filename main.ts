import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// One-sentence childhood memory: afternoon rain on a tin roof,
// counted drop by drop beside my father. A different scene from v1
// (no kitchen, no grandmother, no rice, no woodsmoke) — same proven
// shape: one vivid sensory moment, then a bridge to the present.
// The bridge lands on a sound (his voice in the rain), not a place,
// so the memory stays with the listener after the sentence ends.
const ENTRY =
  "When the afternoon rain drummed on our tin roof, I pressed my ear to the cool wall and counted the drops with my father until the storm softened into a lullaby, and now every sudden downpour still finds me listening for his voice in the rain.";

const MAX_CHARS = 280;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv;
  return join(here(), "out");
}

function checks(entry: string): void {
  if (entry.length === 0) fail("entry is empty");
  if (entry.length > MAX_CHARS) {
    fail(`entry is ${entry.length} chars, over the ${MAX_CHARS} limit`);
  }
  const sentences = entry.split(".").filter((part) => part.trim().length > 0);
  if (sentences.length !== 1) {
    fail(`entry must be exactly one sentence, found ${sentences.length}`);
  }
}

function main(): void {
  checks(ENTRY);
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  writeFileSync(target, ENTRY + "\n", "utf8");
  console.log(`wrote ${ENTRY.length} chars to ${target}`);
}

main();
