import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { renderFriendlyExplanationMarkdown, type StructuredEditorialEntry } from "./foundation/editorial-content";
import { PNL_001_CANONICAL_REVIEW_LIBRARY } from "./question-studio-review.library";

type EditorialLibrary = Readonly<{ entries: Readonly<Record<string, StructuredEditorialEntry>> }>;
type ReviewEntry = Readonly<{ explanation: string; answer: string }>;
type ReviewLibrary = Readonly<{ entries: Readonly<Record<string, ReviewEntry>> }>;

const root = dirname(fileURLToPath(import.meta.url));
const editorial = JSON.parse(
  readFileSync(join(root, "CP-001", "editorial-content.en.json"), "utf8"),
) as EditorialLibrary;
const review = PNL_001_CANONICAL_REVIEW_LIBRARY as ReviewLibrary;
const qlId = "PNL-QL-003";
const entry = review.entries[qlId]!;
const suffix = `\n\n**Final answer:** ${entry.answer}`;
const canonical = entry.explanation.endsWith(suffix)
  ? entry.explanation.slice(0, -suffix.length)
  : entry.explanation;
const structured = renderFriendlyExplanationMarkdown(editorial.entries[qlId]!.explanation, {});
let firstDifference = 0;
while (
  firstDifference < structured.length &&
  firstDifference < canonical.length &&
  structured[firstDifference] === canonical[firstDifference]
) {
  firstDifference += 1;
}

console.log(
  JSON.stringify(
    {
      qlId,
      suffixPresent: entry.explanation.endsWith(suffix),
      firstDifference,
      structuredLength: structured.length,
      canonicalLength: canonical.length,
      structured,
      canonical,
      structuredDifferenceWindow: structured.slice(Math.max(0, firstDifference - 100), firstDifference + 220),
      canonicalDifferenceWindow: canonical.slice(Math.max(0, firstDifference - 100), firstDifference + 220),
    },
    null,
    2,
  ),
);

throw new Error(`${qlId}: explanation diagnostic complete.`);
