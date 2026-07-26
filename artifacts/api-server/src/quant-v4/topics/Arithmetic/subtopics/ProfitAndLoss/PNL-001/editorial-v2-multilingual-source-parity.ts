import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildAllNormalizedMultilingualEditorialLibraries,
  type EditorialLibraryFile,
} from "./foundation";

const root = dirname(fileURLToPath(import.meta.url));
const generatedLibraries = buildAllNormalizedMultilingualEditorialLibraries();

function canonicalize(library: EditorialLibraryFile): EditorialLibraryFile {
  return JSON.parse(JSON.stringify(library)) as EditorialLibraryFile;
}

for (const generated of generatedLibraries) {
  const cp = generated.cpId.replace("PNL-CP-", "CP-");
  const path = join(root, cp, `editorial-content.${generated.language}.json`);
  const committed = JSON.parse(readFileSync(path, "utf8")) as EditorialLibraryFile;
  assert.deepEqual(
    committed,
    canonicalize(generated),
    `${cp} ${generated.language}: committed Editorial V2 source has drifted from the validated generator.`,
  );
}

console.log(JSON.stringify({
  ok: true,
  librariesChecked: generatedLibraries.length,
  entriesChecked: generatedLibraries.reduce((total, library) => total + library.entryCount, 0),
}, null, 2));
