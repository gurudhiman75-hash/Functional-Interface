import assert from "node:assert/strict";
import {
  ANA_CP009_CONDITIONAL_ADMISSION_REQUIREMENTS,
  ANA_CP009_CONDITIONAL_BRANCH_STATUS,
  ANA_CP009_CONDITIONAL_SOURCE_FINDINGS,
} from "./conditional-branch-admission";

assert.equal(ANA_CP009_CONDITIONAL_SOURCE_FINDINGS.length, 5);
assert.equal(
  new Set(ANA_CP009_CONDITIONAL_SOURCE_FINDINGS.map((entry) => entry.findingId)).size,
  ANA_CP009_CONDITIONAL_SOURCE_FINDINGS.length,
);
assert.ok(ANA_CP009_CONDITIONAL_SOURCE_FINDINGS.every((entry) => entry.notes.length >= 140));
assert.ok(ANA_CP009_CONDITIONAL_SOURCE_FINDINGS.every((entry) => entry.permanentQlIds.length === 0));
assert.deepEqual(
  ANA_CP009_CONDITIONAL_SOURCE_FINDINGS.map((entry) => Number(entry.findingId.slice(-3))),
  [1, 2, 3, 4, 5],
);

const noEvidence = ANA_CP009_CONDITIONAL_SOURCE_FINDINGS.filter(
  (entry) => entry.verdict === "NO_CONDITIONAL_ANALOGY_EVIDENCE",
);
const codingDelegations = ANA_CP009_CONDITIONAL_SOURCE_FINDINGS.filter(
  (entry) => entry.verdict === "DELEGATE_CODING_DECODING",
);
const operationDelegations = ANA_CP009_CONDITIONAL_SOURCE_FINDINGS.filter(
  (entry) => entry.verdict === "DELEGATE_SYMBOLIC_OPERATIONS",
);
const designOnly = ANA_CP009_CONDITIONAL_SOURCE_FINDINGS.filter(
  (entry) => entry.verdict === "DESIGN_LABEL_ONLY",
);

assert.equal(noEvidence.length, 2);
assert.equal(codingDelegations.length, 1);
assert.equal(operationDelegations.length, 1);
assert.equal(designOnly.length, 1);

assert.equal(ANA_CP009_CONDITIONAL_ADMISSION_REQUIREMENTS.length, 10);
assert.ok(ANA_CP009_CONDITIONAL_ADMISSION_REQUIREMENTS.every((requirement) => requirement.length >= 75));
assert.equal(ANA_CP009_CONDITIONAL_BRANCH_STATUS.status, "SOURCE_GAP");
assert.equal(ANA_CP009_CONDITIONAL_BRANCH_STATUS.recurringFixturesFound, 0);
assert.equal(ANA_CP009_CONDITIONAL_BRANCH_STATUS.formalRuleContractsAdmitted, 0);
assert.equal(ANA_CP009_CONDITIONAL_BRANCH_STATUS.permanentQlIds.length, 0);
assert.equal(ANA_CP009_CONDITIONAL_BRANCH_STATUS.publiclyPublishable, false);

console.log("ANA-CP-009 conditional-branch admission gate passed.", {
  sourceFindings: ANA_CP009_CONDITIONAL_SOURCE_FINDINGS.length,
  admissionRequirements: ANA_CP009_CONDITIONAL_ADMISSION_REQUIREMENTS.length,
  recurringFixturesFound: ANA_CP009_CONDITIONAL_BRANCH_STATUS.recurringFixturesFound,
  permanentQlIdsAssigned: ANA_CP009_CONDITIONAL_BRANCH_STATUS.permanentQlIds.length,
});
