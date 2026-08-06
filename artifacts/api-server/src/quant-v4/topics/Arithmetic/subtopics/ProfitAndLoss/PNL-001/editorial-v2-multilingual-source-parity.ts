import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { EditorialLibraryFile } from "./foundation/editorial-library";
import { buildAllWave03MultilingualEditorialLibraries } from "./foundation/editorial-v2-multilingual-reconstruction-wave03";

const root = dirname(fileURLToPath(import.meta.url));
const generatedLibraries = buildAllWave03MultilingualEditorialLibraries();

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
    `${cp} ${generated.language}: committed Editorial V2 source has drifted from Wave 03 authority.`,
  );
}

console.log(JSON.stringify({
  ok: true,
  authority: "PNL-001 multilingual editorial reconstruction Wave 03",
  librariesChecked: generatedLibraries.length,
  entriesChecked: generatedLibraries.reduce((total, library) => total + library.entryCount, 0),
}, null, 2));
