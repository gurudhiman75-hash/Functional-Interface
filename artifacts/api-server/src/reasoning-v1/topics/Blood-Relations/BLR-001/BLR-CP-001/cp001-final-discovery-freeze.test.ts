import assert from "node:assert/strict";

import {
  BLR_CP001_ENGLISH_DISCOVERY_FREEZE_VERSION,
  BLR_CP001_FROZEN_PROTOTYPE_IDS,
  BLR_CP001_FROZEN_SOLVE_AUTHORITIES,
  BLR_CP001_INSTANCE_PROPERTIES,
  BLR_CP001_OWNERSHIP_DISPOSITIONS,
  BLR_CP001_PERMANENT_QL_IDS,
  BLR_CP001_RELEASE_LOCK,
  BLR_CP001_SECOND_GAP_RELATIONS,
  BLR_CP001_SOURCE_EVIDENCE_LEDGER,
} from "./cp001-final-discovery-freeze";
import { BLR_CP001_PERMANENT_CONTRACTS } from "./cp001-permanent-contracts";
import { BLR_CP001_REVIEW_REGISTRY } from "./cp001-review-registry";
import { generateBlrCp001Question } from "./cp001-runtime";

assert.equal(
  BLR_CP001_ENGLISH_DISCOVERY_FREEZE_VERSION,
  "BLR_CP001_ENGLISH_DISCOVERY_FREEZE_V1",
);

assert.equal(BLR_CP001_REVIEW_REGISTRY.length, 11);
assert.deepEqual(
  [...BLR_CP001_REVIEW_REGISTRY.map((entry) => entry.prototypeId)].sort(),
  [...BLR_CP001_FROZEN_PROTOTYPE_IDS].sort(),
  "Runtime prototype registry drifted from the frozen eleven-prototype inventory.",
);
assert.deepEqual(
  [...new Set(BLR_CP001_REVIEW_REGISTRY.map((entry) => entry.authority))].sort(),
  [...BLR_CP001_FROZEN_SOLVE_AUTHORITIES].sort(),
  "Runtime authorities drifted from the frozen seven-authority inventory.",
);

assert.equal(BLR_CP001_PERMANENT_CONTRACTS.length, 7);
assert.deepEqual(
  BLR_CP001_PERMANENT_CONTRACTS.map((contract) => contract.qlId),
  BLR_CP001_PERMANENT_QL_IDS,
);
assert.deepEqual(
  BLR_CP001_PERMANENT_CONTRACTS.map((contract) => contract.solveAuthority),
  BLR_CP001_FROZEN_SOLVE_AUTHORITIES,
);
assert.equal(
  new Set(
    BLR_CP001_PERMANENT_CONTRACTS.flatMap(
      (contract) => contract.sourcePrototypeIds,
    ),
  ).size,
  11,
);
assert.ok(
  BLR_CP001_PERMANENT_CONTRACTS.every(
    (contract) =>
      contract.reviewOnly &&
      !contract.publiclyPublishable &&
      !contract.questionStudioVisible &&
      !contract.mockTestEligible,
  ),
);

assert.ok(BLR_CP001_INSTANCE_PROPERTIES.includes("QUERY_DIRECTION"));
assert.ok(BLR_CP001_INSTANCE_PROPERTIES.includes("PATH_LENGTH"));
assert.ok(BLR_CP001_INSTANCE_PROPERTIES.includes("CLAIM_POLARITY"));
assert.ok(BLR_CP001_INSTANCE_PROPERTIES.includes("MATERNAL_OR_PATERNAL_SIDE"));
assert.deepEqual(BLR_CP001_SECOND_GAP_RELATIONS, [
  "GREAT_GRANDFATHER",
  "GREAT_GRANDMOTHER",
  "GREAT_GRANDSON",
  "GREAT_GRANDDAUGHTER",
]);

assert.ok(BLR_CP001_SOURCE_EVIDENCE_LEDGER.length >= 4);
assert.ok(
  BLR_CP001_SOURCE_EVIDENCE_LEDGER.some(
    (entry) => entry.strength === "HUMAN_REVIEW",
  ),
);
assert.ok(
  BLR_CP001_SOURCE_EVIDENCE_LEDGER.some((entry) =>
    entry.supports.includes("GREAT_GENERATION_RELATIONS"),
  ),
);

const includedOwnership = BLR_CP001_OWNERSHIP_DISPOSITIONS.filter(
  (entry) => entry.disposition === "INCLUDE",
);
assert.deepEqual(includedOwnership, [
  {
    format: "direct declarative named-person relations",
    owner: "BLR-CP-001",
    disposition: "INCLUDE",
  },
]);
for (const owner of [
  "BLR-CP-002",
  "BLR-CP-003",
  "BLR-CP-004",
  "BLR-CP-005",
  "BLR-CP-006",
  "BLR-CP-007",
  "Puzzle",
  "Data Sufficiency",
]) {
  assert.ok(
    BLR_CP001_OWNERSHIP_DISPOSITIONS.some((entry) => entry.owner === owner),
    `Missing frozen ownership disposition for ${owner}.`,
  );
}

assert.equal(BLR_CP001_RELEASE_LOCK.permanentQlRange, "BLR-QL-001..007");
assert.equal(BLR_CP001_RELEASE_LOCK.permanentQlCount, 7);
assert.equal(BLR_CP001_RELEASE_LOCK.nextAvailableChapterQlId, "BLR-QL-008");
assert.equal(BLR_CP001_RELEASE_LOCK.prototypeCount, 11);
assert.equal(BLR_CP001_RELEASE_LOCK.solveAuthorityCount, 7);
assert.equal(BLR_CP001_RELEASE_LOCK.englishReviewOnly, true);
assert.equal(BLR_CP001_RELEASE_LOCK.questionStudioAllowed, false);
assert.equal(BLR_CP001_RELEASE_LOCK.questionBankWriteAllowed, false);
assert.equal(BLR_CP001_RELEASE_LOCK.mockTestAllowed, false);
assert.equal(BLR_CP001_RELEASE_LOCK.publicPublicationAllowed, false);
assert.equal(BLR_CP001_RELEASE_LOCK.localisationAllowed, false);

for (const [index, qlId] of BLR_CP001_PERMANENT_QL_IDS.entries()) {
  const question = generateBlrCp001Question(qlId, index + 17);
  assert.equal(question.qlId, qlId);
  assert.equal(question.permanentQlId, qlId);
  assert.equal(question.checkpointId, "BLR-CP-001");
  assert.equal(question.prototypeOnly, false);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.mockTestEligible, false);
  assert.ok(!("prototypeId" in question));
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.isCorrect, true);
  assert.ok(question.explanation.familyTreeGrid);
  assert.ok(question.explanation.examShortcut);
  assert.equal(question.metadata.runtimeVersion, "blr-cp001-runtime-v1");
  assert.equal(
    question.metadata.solveAuthority,
    BLR_CP001_PERMANENT_CONTRACTS[index]!.solveAuthority,
  );
}

console.log(
  JSON.stringify(
    {
      freezeVersion: BLR_CP001_ENGLISH_DISCOVERY_FREEZE_VERSION,
      prototypeContracts: BLR_CP001_FROZEN_PROTOTYPE_IDS.length,
      solveAuthorities: BLR_CP001_FROZEN_SOLVE_AUTHORITIES.length,
      permanentQlRange: BLR_CP001_RELEASE_LOCK.permanentQlRange,
      permanentQlCount: BLR_CP001_RELEASE_LOCK.permanentQlCount,
      nextAvailableQlId: BLR_CP001_RELEASE_LOCK.nextAvailableChapterQlId,
      secondGapRelations: BLR_CP001_SECOND_GAP_RELATIONS,
      verdict:
        "BLR-CP-001 ENGLISH DISCOVERY FROZEN AND PERMANENT IDENTITIES ALLOCATED; RELEASE SURFACES REMAIN LOCKED",
    },
    null,
    2,
  ),
);
