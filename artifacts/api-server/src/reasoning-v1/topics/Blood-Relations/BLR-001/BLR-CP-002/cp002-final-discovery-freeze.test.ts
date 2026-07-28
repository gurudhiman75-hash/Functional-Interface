import assert from "node:assert/strict";

import { allBlrCp002CanonicalScenarios } from "./cp002-canonical-scenario-registry";
import { BLR_CP002_PROTOTYPE_CONTRACTS } from "./cp002-contracts";
import {
  BLR_CP002_ENGLISH_DISCOVERY_FREEZE_VERSION,
  BLR_CP002_FROZEN_PROTOTYPE_IDS,
  BLR_CP002_FROZEN_QUESTION_FORMS,
  BLR_CP002_FROZEN_SOLVE_AUTHORITIES,
  BLR_CP002_INSTANCE_PROPERTIES,
  BLR_CP002_OWNERSHIP_DISPOSITIONS,
  BLR_CP002_PERMANENT_QL_IDS,
  BLR_CP002_RELEASE_LOCK,
  BLR_CP002_SOURCE_EVIDENCE_LEDGER,
} from "./cp002-final-discovery-freeze";
import { BLR_CP002_PERMANENT_CONTRACTS } from "./cp002-permanent-contracts";
import { generateBlrCp002Question } from "./cp002-runtime";

assert.equal(
  BLR_CP002_ENGLISH_DISCOVERY_FREEZE_VERSION,
  "BLR_CP002_ENGLISH_DISCOVERY_FREEZE_V1",
);
assert.equal(BLR_CP002_PROTOTYPE_CONTRACTS.length, 6);
assert.deepEqual(
  [...BLR_CP002_PROTOTYPE_CONTRACTS.map((entry) => entry.prototypeId)].sort(),
  [...BLR_CP002_FROZEN_PROTOTYPE_IDS].sort(),
);
assert.equal(allBlrCp002CanonicalScenarios().length, 45);
assert.deepEqual(BLR_CP002_FROZEN_SOLVE_AUTHORITIES, [
  "RESOLVE_ANCHORED_ROLE_CHAIN_RELATION",
]);
assert.deepEqual(BLR_CP002_PERMANENT_QL_IDS, ["BLR-QL-008"]);
assert.deepEqual(BLR_CP002_FROZEN_QUESTION_FORMS, [
  "HOW_RELATED",
  "WHOSE_PHOTOGRAPH",
  "WHOSE_PORTRAIT",
]);

assert.equal(BLR_CP002_PERMANENT_CONTRACTS.length, 1);
assert.equal(BLR_CP002_PERMANENT_CONTRACTS[0]?.qlId, "BLR-QL-008");
assert.equal(
  BLR_CP002_PERMANENT_CONTRACTS[0]?.solveAuthority,
  "RESOLVE_ANCHORED_ROLE_CHAIN_RELATION",
);
assert.deepEqual(
  BLR_CP002_PERMANENT_CONTRACTS[0]?.sourcePrototypeIds,
  BLR_CP002_FROZEN_PROTOTYPE_IDS,
);
assert.deepEqual(
  BLR_CP002_PERMANENT_CONTRACTS[0]?.questionForms,
  BLR_CP002_FROZEN_QUESTION_FORMS,
);
assert.ok(
  BLR_CP002_PERMANENT_CONTRACTS.every(
    (contract) =>
      contract.reviewOnly &&
      !contract.publiclyPublishable &&
      !contract.questionStudioVisible &&
      !contract.questionBankEligible &&
      !contract.mockTestEligible,
  ),
);

for (const property of [
  "PRESENTATION_CONTEXT",
  "QUESTION_AND_OPTION_RENDERER",
  "ANCHOR_COUNT",
  "ONE_OR_BOTH_DERIVED_QUERY_ENDPOINTS",
  "ZERO_CARDINALITY_CONSTRAINT",
  "BLOOD_OR_AFFINAL_OUTPUT",
  "SELF_IDENTITY_COLLAPSE",
]) {
  assert.ok(BLR_CP002_INSTANCE_PROPERTIES.includes(property as never));
}

assert.ok(BLR_CP002_SOURCE_EVIDENCE_LEDGER.length >= 4);
assert.ok(
  BLR_CP002_SOURCE_EVIDENCE_LEDGER.some(
    (entry) => entry.strength === "HUMAN_REVIEW",
  ),
);
assert.ok(
  BLR_CP002_SOURCE_EVIDENCE_LEDGER.some((entry) =>
    entry.supports.includes("FORTY_FIVE_CANONICAL_SCENARIOS"),
  ),
);

const includedOwnership = BLR_CP002_OWNERSHIP_DISPOSITIONS.filter(
  (entry) => entry.disposition === "INCLUDE",
);
assert.equal(includedOwnership.length, 1);
assert.equal(includedOwnership[0]?.owner, "BLR-CP-002");
for (const owner of [
  "BLR-CP-003",
  "BLR-CP-004",
  "BLR-CP-005",
  "BLR-CP-006",
  "BLR-CP-007",
  "Puzzle",
  "Data Sufficiency",
]) {
  assert.ok(
    BLR_CP002_OWNERSHIP_DISPOSITIONS.some((entry) => entry.owner === owner),
    `Missing frozen ownership disposition for ${owner}.`,
  );
}

assert.equal(BLR_CP002_RELEASE_LOCK.permanentQlRange, "BLR-QL-008");
assert.equal(BLR_CP002_RELEASE_LOCK.permanentQlCount, 1);
assert.equal(BLR_CP002_RELEASE_LOCK.nextAvailableChapterQlId, "BLR-QL-009");
assert.equal(BLR_CP002_RELEASE_LOCK.prototypeCount, 6);
assert.equal(BLR_CP002_RELEASE_LOCK.canonicalScenarioCount, 45);
assert.equal(BLR_CP002_RELEASE_LOCK.solveAuthorityCount, 1);
assert.equal(BLR_CP002_RELEASE_LOCK.questionFormCount, 3);
assert.equal(BLR_CP002_RELEASE_LOCK.englishReviewOnly, true);
assert.equal(BLR_CP002_RELEASE_LOCK.questionStudioAllowed, false);
assert.equal(BLR_CP002_RELEASE_LOCK.questionBankWriteAllowed, false);
assert.equal(BLR_CP002_RELEASE_LOCK.mockTestAllowed, false);
assert.equal(BLR_CP002_RELEASE_LOCK.publicPublicationAllowed, false);
assert.equal(BLR_CP002_RELEASE_LOCK.localisationAllowed, false);

for (const seed of [0, 1, 2, 3, 17, 44, 89, 179]) {
  const question = generateBlrCp002Question("BLR-QL-008", seed);
  assert.equal(question.qlId, "BLR-QL-008");
  assert.equal(question.permanentQlId, "BLR-QL-008");
  assert.equal(question.checkpointId, "BLR-CP-002");
  assert.equal(question.prototypeOnly, false);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.questionBankEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.ok(!("prototypeId" in question));
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.answerId)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.isCorrect, true);
  assert.ok(question.explanation.familyTreeGrid);
  assert.ok(question.explanation.examShortcut);
  assert.equal(question.metadata.runtimeVersion, "blr-cp002-runtime-v1");
  assert.equal(
    question.metadata.solveAuthority,
    "RESOLVE_ANCHORED_ROLE_CHAIN_RELATION",
  );
}

console.log(
  JSON.stringify(
    {
      freezeVersion: BLR_CP002_ENGLISH_DISCOVERY_FREEZE_VERSION,
      prototypeContracts: BLR_CP002_FROZEN_PROTOTYPE_IDS.length,
      canonicalScenarios: BLR_CP002_RELEASE_LOCK.canonicalScenarioCount,
      solveAuthorities: BLR_CP002_FROZEN_SOLVE_AUTHORITIES.length,
      permanentQlRange: BLR_CP002_RELEASE_LOCK.permanentQlRange,
      permanentQlCount: BLR_CP002_RELEASE_LOCK.permanentQlCount,
      nextAvailableQlId: BLR_CP002_RELEASE_LOCK.nextAvailableChapterQlId,
      verdict:
        "BLR-CP-002 ENGLISH DISCOVERY FROZEN AT BLR-QL-008; RELEASE SURFACES REMAIN LOCKED",
    },
    null,
    2,
  ),
);
