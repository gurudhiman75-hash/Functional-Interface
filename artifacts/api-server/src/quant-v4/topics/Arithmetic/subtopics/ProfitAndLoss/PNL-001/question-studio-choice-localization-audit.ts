import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { renderFriendlyExplanationMarkdown, type StructuredEditorialEntry } from "./foundation/editorial-content";
import { PNL_001_CANONICAL_REVIEW_LIBRARY } from "./question-studio-review.library";
import { recoverAllPnl001CanonicalContexts } from "./question-studio-canonical-context-recovery";

type EditorialLibrary = Readonly<{ entries: Readonly<Record<string, StructuredEditorialEntry>> }>;
type ReviewLibrary = Readonly<{ entries: Readonly<Record<string, Readonly<{ explanation: string }>>> }>;

const root = dirname(fileURLToPath(import.meta.url));
const cp001 = JSON.parse(
  readFileSync(join(root, "CP-001", "editorial-content.en.json"), "utf8"),
) as EditorialLibrary;
const review = PNL_001_CANONICAL_REVIEW_LIBRARY as ReviewLibrary;
const qlId = "PNL-QL-001";
const structured = renderFriendlyExplanationMarkdown(cp001.entries[qlId]!.explanation, {});
const canonical = review.entries[qlId]!.explanation;

if (structured !== canonical) {
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
        diagnosticQlId: qlId,
        firstDifference,
        structuredLength: structured.length,
        canonicalLength: canonical.length,
        structured,
        canonical,
        structuredDifferenceWindow: structured.slice(Math.max(0, firstDifference - 80), firstDifference + 160),
        canonicalDifferenceWindow: canonical.slice(Math.max(0, firstDifference - 80), firstDifference + 160),
      },
      null,
      2,
    ),
  );
  throw new Error(`${qlId}: canonical explanation differs from current structured English authority.`);
}

const recoveries = recoverAllPnl001CanonicalContexts();
const cpCounts: Record<string, number> = {};
let scalarValues = 0;
let tableSources = 0;
let paragraphSources = 0;
const contextKeyCounts: number[] = [];

for (const recovery of recoveries) {
  cpCounts[recovery.cpId] = (cpCounts[recovery.cpId] ?? 0) + 1;
  contextKeyCounts.push(Object.keys(recovery.context).length);
  for (const value of Object.values(recovery.context)) {
    if (Array.isArray(value)) {
      if (value.length > 0 && Array.isArray(value[0])) tableSources += 1;
      else paragraphSources += 1;
    } else {
      scalarValues += 1;
    }
  }
}

const summary = {
  ok: true,
  qlCount: recoveries.length,
  cpCounts,
  scalarValues,
  tableSources,
  paragraphSources,
  minimumContextKeys: Math.min(...contextKeyCounts),
  maximumContextKeys: Math.max(...contextKeyCounts),
  exactEnglishStemRoundTrips: recoveries.length,
  exactEnglishExplanationRoundTrips: recoveries.length,
};

console.log(JSON.stringify(summary, null, 2));

if (
  recoveries.length !== 186 ||
  JSON.stringify(Object.values(cpCounts)) !== JSON.stringify([36, 34, 24, 26, 29, 37])
) {
  throw new Error("PNL canonical context recovery coverage is incomplete.");
}
