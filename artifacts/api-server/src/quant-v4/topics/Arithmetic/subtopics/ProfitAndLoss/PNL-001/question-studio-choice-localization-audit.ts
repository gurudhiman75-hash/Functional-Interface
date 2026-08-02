import {
  recoverPnl001CanonicalContext,
  unresolvedPnl001ProsePlaceholders,
} from "./question-studio-canonical-context";

const EXPECTED_CP_COUNTS = {
  "PNL-CP-001": 36,
  "PNL-CP-002": 34,
  "PNL-CP-003": 24,
  "PNL-CP-004": 26,
  "PNL-CP-005": 29,
  "PNL-CP-006": 37,
} as const;

const recoveries = [];
const recoveryFailures: Array<{ qlId: string; message: string }> = [];
for (let index = 1; index <= 186; index += 1) {
  const qlId = `PNL-QL-${String(index).padStart(3, "0")}`;
  try {
    recoveries.push(recoverPnl001CanonicalContext(qlId));
  } catch (error) {
    recoveryFailures.push({
      qlId,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

const cpCounts: Record<string, number> = {};
const explanationBindingFailures: Array<{
  qlId: string;
  unresolved: readonly string[];
}> = [];
let scalarValues = 0;
let tableSources = 0;
let paragraphSources = 0;
let exactCurrentStemRoundTrips = 0;
let legacyDataSufficiencyStems = 0;
const contextKeyCounts: number[] = [];

for (const recovery of recoveries) {
  cpCounts[recovery.cpId] = (cpCounts[recovery.cpId] ?? 0) + 1;
  contextKeyCounts.push(Object.keys(recovery.context).length);
  if (recovery.canonicalStemMode === "CURRENT_STRUCTURED") {
    exactCurrentStemRoundTrips += 1;
  } else {
    legacyDataSufficiencyStems += 1;
  }

  const unresolved = unresolvedPnl001ProsePlaceholders(
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

const cpCoverageOk = recoveryFailures.length === 0 && Object.entries(EXPECTED_CP_COUNTS).every(
  ([cpId, expected]) => cpCounts[cpId] === expected,
);
const summary = {
  ok:
    recoveries.length === 186 &&
    recoveryFailures.length === 0 &&
    cpCoverageOk &&
    exactCurrentStemRoundTrips + legacyDataSufficiencyStems === 186 &&
    explanationBindingFailures.length === 0,
  qlCount: recoveries.length,
  recoveryFailureCount: recoveryFailures.length,
  recoveryFailures,
  cpCounts,
  exactCanonicalKeyedAnswers: recoveries.length,
  exactCurrentStemRoundTrips,
  legacyDataSufficiencyStems,
  scalarValues,
  tableSources,
  paragraphSources,
  minimumContextKeys: contextKeyCounts.length ? Math.min(...contextKeyCounts) : 0,
  maximumContextKeys: contextKeyCounts.length ? Math.max(...contextKeyCounts) : 0,
  currentExplanationBindingFailures: explanationBindingFailures.length,
  explanationBindingFailures,
};

console.log(JSON.stringify(summary, null, 2));

if (!summary.ok) {
  throw new Error(
    `PNL canonical context recovery has ${recoveryFailures.length} stem failures and ` +
      `${explanationBindingFailures.length} explanation binding failures.`,
  );
}
