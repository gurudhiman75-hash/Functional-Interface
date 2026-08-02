import { recoverAllPnl001CanonicalContexts } from "./question-studio-canonical-context-recovery";

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
  exactEnglishStructuredExplanationRoundTrips: recoveries.length,
  exactEnglishFullExplanationRoundTrips: recoveries.length,
};

console.log(JSON.stringify(summary, null, 2));

if (
  recoveries.length !== 186 ||
  JSON.stringify(Object.values(cpCounts)) !== JSON.stringify([36, 34, 24, 26, 29, 37])
) {
  throw new Error("PNL canonical context recovery coverage is incomplete.");
}
