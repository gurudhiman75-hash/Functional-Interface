import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildAllWave03MultilingualEditorialLibraries } from "./foundation/editorial-v2-multilingual-reconstruction-wave03";

const root = dirname(fileURLToPath(import.meta.url));
const libraries = buildAllWave03MultilingualEditorialLibraries();

for (const library of libraries) {
  const cpFolder = library.cpId.replace("PNL-CP-", "CP-");
  const path = join(root, cpFolder, `editorial-content.${library.language}.json`);
  writeFileSync(path, `${JSON.stringify(library, null, 2)}\n`);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      librariesWritten: libraries.length,
      entriesWritten: libraries.reduce(
        (total, library) => total + library.entryCount,
        0,
      ),
    },
    null,
    2,
  ),
);
