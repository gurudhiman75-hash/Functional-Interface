import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { StructuredEditorialEntry } from "./foundation/editorial-content";
import { PNL_001_CANONICAL_REVIEW_LIBRARY } from "./question-studio-review.library";

type EditorialLibrary = Readonly<{
  entries: Readonly<Record<string, StructuredEditorialEntry>>;
}>;
type CanonicalLibrary = Readonly<{
  entries: Readonly<Record<string, Readonly<{
    stem: string;
    answer: string;
    options: readonly string[];
  }>>>;
}>;

const root = dirname(fileURLToPath(import.meta.url));
const editorial = JSON.parse(
  readFileSync(join(root, "CP-002", "editorial-content.en.json"), "utf8"),
) as EditorialLibrary;
const canonical = PNL_001_CANONICAL_REVIEW_LIBRARY as CanonicalLibrary;
const qlId = "PNL-QL-070";

console.log(JSON.stringify({
  qlId,
  canonical: canonical.entries[qlId],
  currentStructuredStem: editorial.entries[qlId]?.stem,
  currentStructuredExplanation: editorial.entries[qlId]?.explanation,
}, null, 2));

throw new Error(`${qlId}: canonical stem diagnostic complete.`);
