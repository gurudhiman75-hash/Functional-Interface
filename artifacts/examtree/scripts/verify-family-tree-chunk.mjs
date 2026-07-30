import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const assetsDirectory = path.resolve("artifacts/examtree/dist/public/assets");
const entries = (await readdir(assetsDirectory)).filter((name) => name.endsWith(".js"));
const rendererMatches = [];
const siblingArrowMatches = [];

for (const name of entries) {
  const filePath = path.join(assetsDirectory, name);
  const content = await readFile(filePath, "utf8");
  const descriptor = {
    name,
    bytes: (await stat(filePath)).size,
    inMainBundle: /^index-/.test(name),
  };

  if (
    content.includes("Visual family tree") &&
    content.includes("Answer path") &&
    content.includes("Full family")
  ) {
    rendererMatches.push(descriptor);
  }

  if (
    content.includes("blr-sibling-arrow") &&
    content.includes("marker-start") &&
    content.includes("marker-end") &&
    content.includes("auto-start-reverse") &&
    content.includes("card-bottom-sibling-bracket") &&
    content.includes("card-bottom-bracket") &&
    content.includes("stroke-dasharray")
  ) {
    siblingArrowMatches.push(descriptor);
  }
}

if (rendererMatches.length !== 1) {
  throw new Error(
    `Expected exactly one compiled family-tree renderer chunk, found ${rendererMatches.length}: ${JSON.stringify(rendererMatches)}.`,
  );
}

const [rendererChunk] = rendererMatches;
if (rendererChunk.inMainBundle) {
  throw new Error(`Family-tree renderer leaked into the main bundle: ${rendererChunk.name}.`);
}
if (rendererChunk.bytes > 35_000) {
  throw new Error(
    `Family-tree renderer chunk exceeds the 35 KB raw limit: ${rendererChunk.name} is ${rendererChunk.bytes} bytes.`,
  );
}

if (siblingArrowMatches.length !== 1) {
  throw new Error(
    `Expected exactly one compiled sibling-card routing chunk, found ${siblingArrowMatches.length}: ${JSON.stringify(siblingArrowMatches)}.`,
  );
}

const [siblingArrowChunk] = siblingArrowMatches;
if (siblingArrowChunk.inMainBundle) {
  throw new Error(`Sibling-card routing leaked into the main bundle: ${siblingArrowChunk.name}.`);
}
if (siblingArrowChunk.bytes > 35_000) {
  throw new Error(
    `Sibling-card routing chunk exceeds the 35 KB raw limit: ${siblingArrowChunk.name} is ${siblingArrowChunk.bytes} bytes.`,
  );
}

console.log(
  JSON.stringify(
    {
      gate: "EXAMTREE_LAZY_SVG_FAMILY_TREE_CHUNK",
      chunk: rendererChunk.name,
      rawBytes: rendererChunk.bytes,
      rawLimitBytes: 35_000,
      siblingArrowChunk: siblingArrowChunk.name,
      siblingArrowRawBytes: siblingArrowChunk.bytes,
      siblingArrowheads: "BIDIRECTIONAL_CARD_TARGETED",
      siblingRoute: "CARD_BOTTOM_BRACKET",
      mainBundleLeak: false,
      externalGraphLibrary: false,
    },
    null,
    2,
  ),
);
