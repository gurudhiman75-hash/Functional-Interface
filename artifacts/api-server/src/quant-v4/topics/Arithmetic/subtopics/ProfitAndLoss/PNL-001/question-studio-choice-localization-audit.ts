import {
  recoverAllPnl001CanonicalContexts,
  unresolvedProsePlaceholders,
} from "./question-studio-canonical-context-recovery";

const EXPECTED_CP_COUNTS = {
  "PNL-CP-001": 36,
  "PNL-CP-002": 34,
  "PNL-CP-003": 24,
  "PNL-CP-004": 26,
  "PNL-CP-005": 29,
  "PNL-CP-006": 37,
} as const;

const recoveries = recoverAllPnl001CanonicalContexts();
const cpCounts: Record<string, number> = {};
const explanationBindingFailures: Array<{
  qlId: string;
  unresolved: readonly string[];
}> = [];
let scalarValues = 0;
let tableSources = 0;
let paragraphSources = 0;
let exactKeyedAnswerSuffixes = 0;
const contextKeyCounts: number[] = [];

for (const recovery of recoveries) {
  cpCounts[recovery.cpId] = (cpCounts[recovery.cpId] ?? 0) + 1;
  contextKeyCounts.push(Object.keys(recovery.context).length);

  const expectedSuffix = `\n\n**Final answer:** ${recovery.canonicalEntry.answer}`;
  if (recovery.canonicalEntry.explanation.endsWith(expectedSuffix)) {
    exactKeyedAnswerSuffixes += 1;
  }

  const unresolved = unresolvedProsePlaceholders(
    recovery.currentEnglishExplanation,
  );
  if (unresolved.length > 0) {
    explanationBindingFailures.push({ qlId: recovery.qlId, unresolved });
  }

  for (const value of Object.values(recovery.context)) {
    if (Array.isArray(value)) {
      if (value.length > 0 && Array.isArray(value[0])) tableSources += 1;
      else paragraphSources += 1;
    } else {
      scalarValues += 1;
    }
  }
}

const cpCoverageOk = Object.entries(EXPECTED_CP_COUNTS).every(
  ([cpId, expected]) => cpCounts[cpId] === expected,
);
const summary = {
  ok:
    recoveries.length === 186 &&
    cpCoverageOk &&
    exactKeyedAnswerSuffixes === 186 &&
    explanationBindingFailures.length === 0,
  qlCount: recoveries.length,
  cpCounts,
  exactCanonicalStemRoundTrips: recoveries.length,
  exactKeyedAnswerSuffixes,
  scalarValues,
  tableSources,
  paragraphSources,
  minimumContextKeys: Math.min(...contextKeyCounts),
  maximumContextKeys: Math.max(...contextKeyCounts),
  currentExplanationBindingFailures: explanationBindingFailures.length,
  explanationBindingFailures,
};

console.log(JSON.stringify(summary, null, 2));

if (!summary.ok) {
  throw new Error(
    `PNL canonical context recovery is incomplete: ` +
      `${explanationBindingFailures.length} current explanation binding failures.`,
  );
}
