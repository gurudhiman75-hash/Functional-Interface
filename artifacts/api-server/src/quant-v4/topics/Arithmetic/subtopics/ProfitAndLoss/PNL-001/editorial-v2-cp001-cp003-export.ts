import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAllNormalizedLegacyEditorialLibraries } from "./foundation";

const root = dirname(fileURLToPath(import.meta.url));
const outputRoot = join(root, ".editorial-v2-generated");
mkdirSync(outputRoot, { recursive: true });

for (const library of buildAllNormalizedLegacyEditorialLibraries()) {
  const folder = library.cpId.replace("PNL-CP-", "CP-");
  writeFileSync(join(outputRoot, `${folder}.editorial-content.en.json`), `${JSON.stringify(library, null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({ ok: true, outputRoot }, null, 2));
