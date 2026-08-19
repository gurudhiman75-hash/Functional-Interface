import { strict as assert } from "node:assert";

import { summarizeSea001DifficultyFeatures } from "./realness/difficulty-features.ts";
import { buildSea001SaturationCorpus } from "./saturation/corpus.ts";

const corpus = buildSea001SaturationCorpus(80);
const summary = summarizeSea001DifficultyFeatures(corpus.caselets);

assert.equal(summary.caseletCount, 1600);
assert.equal(summary.calibratedCaseletCount, 0);
assert.equal(summary.calibrationStatus, "NO_EMPIRICAL_SOLVE_TIME_OR_ACCURACY_CALIBRATION");

for (const checkpointId of ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"] as const) {
  const checkpoint = summary.checkpointSummary[checkpointId];
  assert(checkpoint.caseletCount > 0, `${checkpointId}: no measured caselets`);
  assert(checkpoint.seatCount.min > 0, `${checkpointId}: invalid seat-count range`);
  assert(checkpoint.clueCount.min > 0, `${checkpointId}: invalid clue-count range`);
  assert(checkpoint.clueCount.max >= checkpoint.clueCount.min);
  assert(checkpoint.proofEventCount.max >= checkpoint.proofEventCount.min);
}

console.log("PASS_SEA_001_DIFFICULTY_REALNESS_MEASUREMENT");
console.log("caselets", summary.caseletCount);
console.log("calibration", summary.calibrationStatus);
console.log("calibrated caselets", summary.calibratedCaseletCount);
console.log("CP001-vs-CP005 clue-count overlap", summary.clueCountRangeOverlapCp001VsCp005);
console.log("CP001-vs-CP005 proof-event overlap", summary.proofEventRangeOverlapCp001VsCp005);
console.log("checkpoint feature ranges", JSON.stringify(summary.checkpointSummary));
