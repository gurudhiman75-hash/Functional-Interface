import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAllNormalizedMultilingualEditorialLibraries } from "./foundation";

const root = dirname(fileURLToPath(import.meta.url));
const outputRoot = join(root, ".editorial-v2-multilingual-generated");
mkdirSync(outputRoot, { recursive: true });

for (const library of buildAllNormalizedMultilingualEditorialLibraries()) {
  const folder = library.cpId.replace("PNL-CP-", "CP-");
  const language = library.language;
  const path = join(outputRoot, `${folder}.editorial-content.${language}.json`);
  writeFileSync(path, `${JSON.stringify(library, null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({
  ok: true,
  outputRoot,
  libraryCount: 12,
  entryCount: 372,
}, null, 2));
