import assert from "node:assert/strict";

import {
  COD_CP007_CANDIDATE_DECISIONS,
  COD_CP007_DISCOVERY_FREEZE,
  COD_CP007_FINAL_DISCOVERY_FREEZE_VERSION,
  COD_CP007_FROZEN_SOLVE_CONTRACTS,
} from "./cp007-final-discovery-freeze";

assert.equal(COD_CP007_FINAL_DISCOVERY_FREEZE_VERSION, "COD_CP007_ENGLISH_DISCOVERY_FREEZE_V1");
assert.equal(COD_CP007_DISCOVERY_FREEZE.status, "ENGLISH_DISCOVERY_FROZEN");
assert.deepEqual(COD_CP007_DISCOVERY_FREEZE.retainedRuleFamilies, ["UNIFORM_MODULAR_DIGIT_TRANSLATION"]);
assert.equal(COD_CP007_DISCOVERY_FREEZE.solveContractCount, 4);
assert.equal(COD_CP007_DISCOVERY_FREEZE.permanentQlCount, 0);
assert.equal(COD_CP007_DISCOVERY_FREEZE.nextAvailableQlId, "COD-QL-169");
assert.equal(COD_CP007_DISCOVERY_FREEZE.questionStudioVisible, false);
assert.equal(COD_CP007_DISCOVERY_FREEZE.publiclyPublishable, false);
assert.equal(COD_CP007_DISCOVERY_FREEZE.localisationStarted, false);

assert.equal(COD_CP007_CANDIDATE_DECISIONS.length, 8);
assert.equal(COD_CP007_CANDIDATE_DECISIONS.filter((entry) => entry.disposition === "RETAIN").length, 1);
assert.equal(new Set(COD_CP007_CANDIDATE_DECISIONS.map((entry) => entry.candidateId)).size, 8);

assert.deepEqual(
  COD_CP007_FROZEN_SOLVE_CONTRACTS.map((entry) => entry.solveContractId),
  [
    "CP007-UNIFORM-EXPLICIT-FORWARD",
    "CP007-UNIFORM-INVERSE-DECODE",
    "CP007-UNIFORM-MISSING-DIGIT",
    "CP007-UNIFORM-INFERRED-FORWARD",
  ],
);
assert.equal(new Set(COD_CP007_FROZEN_SOLVE_CONTRACTS.map((entry) => entry.solveContractId)).size, 4);
assert.ok(COD_CP007_FROZEN_SOLVE_CONTRACTS.every((entry) => entry.permanentQlId === null));
assert.equal(
  COD_CP007_FROZEN_SOLVE_CONTRACTS.find((entry) => entry.solveContractId === "CP007-UNIFORM-INFERRED-FORWARD")
    ?.mergedPrototypeIds.length,
  2,
);
assert.ok(
  COD_CP007_FROZEN_SOLVE_CONTRACTS.some(
    (entry) => entry.queryDirection === "INVERSE" && entry.taskKind === "DECODE_TARGET",
  ),
);
assert.ok(
  COD_CP007_FROZEN_SOLVE_CONTRACTS.some(
    (entry) => entry.answerType === "SINGLE_CODE_TOKEN" && entry.taskKind === "RECOVER_MISSING_TOKEN",
  ),
);

console.log("COD-CP-007 final English discovery freeze passed.", {
  freezeVersion: COD_CP007_FINAL_DISCOVERY_FREEZE_VERSION,
  candidateDecisions: COD_CP007_CANDIDATE_DECISIONS.length,
  retainedFamilies: COD_CP007_DISCOVERY_FREEZE.retainedRuleFamilies,
  frozenSolveContracts: COD_CP007_FROZEN_SOLVE_CONTRACTS.length,
  permanentQlCount: COD_CP007_DISCOVERY_FREEZE.permanentQlCount,
});
