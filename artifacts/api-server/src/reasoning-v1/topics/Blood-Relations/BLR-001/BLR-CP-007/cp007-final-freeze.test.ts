import { strict as assert } from "node:assert";
import { BLR_CP007_FINAL_FREEZE, buildBlrCp007FinalFreezeSummary } from "./cp007-final-freeze";

assert.equal(BLR_CP007_FINAL_FREEZE.packageId, "BLR-001");
assert.equal(BLR_CP007_FINAL_FREEZE.checkpointId, "BLR-CP-007");
assert.equal(BLR_CP007_FINAL_FREEZE.approvalStatus, "ENGLISH_DISCOVERY_FROZEN");
assert.equal(BLR_CP007_FINAL_FREEZE.recordCount, 168);
assert.equal(BLR_CP007_FINAL_FREEZE.prototypeCount, 21);
assert.equal(BLR_CP007_FINAL_FREEZE.topologyCount, 21);
assert.equal(BLR_CP007_FINAL_FREEZE.authorityCount, 5);
assert.equal(BLR_CP007_FINAL_FREEZE.permanentQlCount, 5);
assert.equal(BLR_CP007_FINAL_FREEZE.statementCount, 296);
assert.equal(BLR_CP007_FINAL_FREEZE.contracts.length, 5);
assert.equal(BLR_CP007_FINAL_FREEZE.sourcePrototypeIds.length, 21);
assert.equal(BLR_CP007_FINAL_FREEZE.consolidationDecisions.length, 5);
assert.equal(BLR_CP007_FINAL_FREEZE.boundaryDecisions.length, 5);
assert.equal(BLR_CP007_FINAL_FREEZE.qualityGuarantees.nameBasedGenderAssumptions, 0);
assert.equal(BLR_CP007_FINAL_FREEZE.nextAvailableChapterQlId, "BLR-QL-036");

console.log(JSON.stringify(buildBlrCp007FinalFreezeSummary(), null, 2));
