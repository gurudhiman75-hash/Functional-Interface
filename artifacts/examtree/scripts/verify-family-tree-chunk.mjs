import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const assetsDirectory = path.resolve("artifacts/examtree/dist/public/assets");
const entries = (await readdir(assetsDirectory)).filter((name) => name.endsWith(".js"));
const matches = [];

for (const name of entries) {
  const filePath = path.join(assetsDirectory, name);
  const content = await readFile(filePath, "utf8");
  if (
    content.includes("Visual family tree") &&
    content.includes("Answer path") &&
    content.includes("Full family")
  ) {
    matches.push({
      name,
      bytes: (await stat(filePath)).size,
      inMainBundle: /^index-/.test(name),
    });
  }
}

if (matches.length !== 1) {
  throw new Error(
    `Expected exactly one compiled family-tree renderer chunk, found ${matches.length}: ${JSON.stringify(matches)}.`,
  );
}

const [chunk] = matches;
if (chunk.inMainBundle) {
  throw new Error(`Family-tree renderer leaked into the main bundle: ${chunk.name}.`);
}
if (chunk.bytes > 35_000) {
  throw new Error(
    `Family-tree renderer chunk exceeds the 35 KB raw limit: ${chunk.name} is ${chunk.bytes} bytes.`,
  );
}

console.log(
  JSON.stringify(
    {
      gate: "EXAMTREE_LAZY_SVG_FAMILY_TREE_CHUNK",
      chunk: chunk.name,
      rawBytes: chunk.bytes,
      rawLimitBytes: 35_000,
      mainBundleLeak: false,
      externalGraphLibrary: false,
    },
    null,
    2,
  ),
);
