import { strict as assert } from "node:assert";

import { auditSea001DistributionRealness } from "./realness/distribution-audit.ts";
import { buildSea001SaturationCorpus } from "./saturation/corpus.ts";

const corpus = buildSea001SaturationCorpus(80);
const audit = auditSea001DistributionRealness(corpus.caselets);

assert.equal(audit.caseletCount, 1600);
assert.equal(audit.childQuestionCount, 6400);
assert.equal(audit.measurementPolicy, "OBSERVE_FIRST_SET_LANE_TARGETS_AFTER_EVIDENCE");
assert.equal(audit.thresholdStatus, "UNSET_PENDING_MEASUREMENT_AND_EXAM_PROFILES");
assert.equal(Object.keys(audit.checkpointDistribution).length, 5);
assert.equal(Object.keys(audit.answerPositionDistribution).length, 4);
assert(audit.queryContracts.categoryCount > 0);
assert(audit.seatCountCells.categoryCount > 0);

for (const [childIndex, positions] of Object.entries(audit.answerPositionByChildIndexMatrix)) {
  const total = Object.values(positions).reduce((sum, value) => sum + value, 0);
  assert(total > 0, `child index ${childIndex}: empty answer-position row`);
}

console.log("PASS_SEA_001_DISTRIBUTION_REALNESS_MEASUREMENT");
console.log("caselets", audit.caseletCount);
console.log("child questions", audit.childQuestionCount);
console.log("thresholds", audit.thresholdStatus);
console.log("query concentration", JSON.stringify(audit.queryContracts));
console.log("answer-position concentration", JSON.stringify(audit.answerPositions));
console.log("seat-count-cell concentration", JSON.stringify(audit.seatCountCells));
console.log("answer-position distribution", JSON.stringify(audit.answerPositionDistribution));
console.log("answer-position by child index", JSON.stringify(audit.answerPositionByChildIndexMatrix));
console.log("child-index answer-position spread", JSON.stringify(audit.childIndexAnswerPositionSpread));
console.log("seat-count distribution", JSON.stringify(audit.seatCountDistribution));
console.log("query contracts by checkpoint", JSON.stringify(audit.queryContractsByCheckpoint));
