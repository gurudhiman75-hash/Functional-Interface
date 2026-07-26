import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { EditorialLibraryFile } from "./foundation/editorial-library";
import {
  compactEditorialEntry,
  type EditorialStemLanguage,
} from "./foundation/editorial-v2-exam-stems";

const root = dirname(fileURLToPath(import.meta.url));
const cpFolders = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006"] as const;
const languages = ["en", "hi", "pa"] as const;
let changedFiles = 0;
let changedEntries = 0;

for (const cp of cpFolders) {
  for (const language of languages) {
    const path = join(root, cp, `editorial-content.${language}.json`);
    const before = readFileSync(path, "utf8");
    const library = JSON.parse(before) as EditorialLibraryFile;
    const entries = Object.fromEntries(
      Object.entries(library.entries).map(([qlId, entry]) => {
        const compacted = compactEditorialEntry(language as EditorialStemLanguage, entry);
        if (JSON.stringify(compacted.stem) !== JSON.stringify(entry.stem)) changedEntries += 1;
        return [qlId, compacted];
      }),
    );
    const after = `${JSON.stringify({ ...library, entries }, null, 2)}\n`;
    if (after !== before) {
      writeFileSync(path, after, "utf8");
      changedFiles += 1;
    }
  }
}

console.log(JSON.stringify({ ok: true, changedFiles, changedEntries }, null, 2));
