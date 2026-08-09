import assert from "node:assert/strict";

import { generateBlrCp005FrozenBank } from "./cp005-bank";
import {
  BLR_CP005_AUTHORITY_DECISIONS,
  BLR_CP005_BOUNDARY_AUDIT,
  BLR_CP005_FINAL_FREEZE_MARKDOWN,
  BLR_CP005_INVERSE_AND_EDGE_AUDIT,
  BLR_CP005_PROTOTYPE_OWNERSHIP,
  BLR_CP005_SOURCE_AUDIT,
  buildBlrCp005FinalFreeze,
} from "./cp005-final-freeze";
import { BLR_CP005_PERMANENT_CONTRACTS } from "./cp005-model";
import { BLR_CP005_PROTOTYPE_CASES } from "./cp005-scenarios";

const freeze = buildBlrCp005FinalFreeze();
const bank = generateBlrCp005FrozenBank();

assert.equal(freeze.packageId, "BLR-001");
assert.equal(freeze.checkpointId, "BLR-CP-005");
assert.equal(freeze.structuralSaturationApproved, true);
assert.equal(freeze.finalDiscoveryFreezeApproved, true);
assert.equal(freeze.completeBoundedEnumerationRequired, true);
assert.equal(freeze.permanentQlRange, "BLR-QL-018..BLR-QL-025");
assert.equal(freeze.nextAvailableChapterQlId, "BLR-QL-026");
assert.equal(freeze.telemetry.recordCount, 184);
assert.equal(freeze.telemetry.groupCount, 80);
assert.equal(freeze.telemetry.prototypeCount, 23);
assert.equal(freeze.telemetry.authorityCount, 8);
assert.equal(freeze.telemetry.permanentQlCount, 8);
assert.equal(freeze.telemetry.totalEnumeratedModels, 432);
assert.equal(freeze.telemetry.questionSignatureUniquenessRatio, 1);
assert.equal(BLR_CP005_SOURCE_AUDIT.length, 5);
assert.equal(BLR_CP005_AUTHORITY_DECISIONS.length, 8);
assert.ok(BLR_CP005_BOUNDARY_AUDIT.length >= 7);
assert.ok(BLR_CP005_INVERSE_AND_EDGE_AUDIT.length >= 10);
assert.ok(BLR_CP005_FINAL_FREEZE_MARKDOWN.includes("BLR-QL-018"));
assert.ok(BLR_CP005_FINAL_FREEZE_MARKDOWN.includes("BLR-QL-025"));
assert.ok(BLR_CP005_FINAL_FREEZE_MARKDOWN.includes("Question Studio                          disabled"));

const prototypeIds = BLR_CP005_PROTOTYPE_CASES.map((entry) => entry.prototypeId);
assert.equal(new Set(prototypeIds).size, 23);
assert.deepEqual(
  [...new Set(Object.keys(BLR_CP005_PROTOTYPE_OWNERSHIP))].sort(),
  [...prototypeIds].sort(),
);
for (const prototypeId of prototypeIds) {
  assert.ok(BLR_CP005_PROTOTYPE_OWNERSHIP[prototypeId], `No frozen QL owns ${prototypeId}.`);
  assert.equal(bank.filter((question) => question.sourcePrototypeId === prototypeId).length, 8);
}

const owned = BLR_CP005_PERMANENT_CONTRACTS.flatMap((contract) => contract.sourcePrototypeIds);
assert.equal(owned.length, 23);
assert.equal(new Set(owned).size, 23);
for (const decision of BLR_CP005_AUTHORITY_DECISIONS) {
  const contract = BLR_CP005_PERMANENT_CONTRACTS.find((entry) => entry.qlId === decision.qlId);
  assert.equal(contract?.solveAuthority, decision.authority);
}

assert.deepEqual(freeze.releaseBoundary, {
  englishReviewOnly: true,
  questionStudio: "DISABLED",
  questionBank: "DISABLED",
  mockTests: "DISABLED",
  hindiPunjabi: "NOT_STARTED",
  publicPublication: "DISABLED",
  productionStaging: "DISABLED",
  merge: "NOT_AUTHORISED",
});

console.log(JSON.stringify({
  freezeVersion: freeze.freezeVersion,
  recordCount: freeze.telemetry.recordCount,
  prototypeCount: freeze.telemetry.prototypeCount,
  authorityCount: freeze.telemetry.authorityCount,
  permanentQlRange: freeze.permanentQlRange,
  nextAvailableChapterQlId: freeze.nextAvailableChapterQlId,
  verdict: "BLR-CP-005 FINAL SOURCE, BOUNDARY, MERGE-SPLIT, INVERSE AND OVERLAP FREEZE PASSED",
}, null, 2));
