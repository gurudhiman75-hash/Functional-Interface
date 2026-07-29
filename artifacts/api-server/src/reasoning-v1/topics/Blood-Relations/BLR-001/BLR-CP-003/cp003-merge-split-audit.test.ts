import assert from "node:assert/strict";

import { BLR_CP001_PERMANENT_CONTRACTS } from "../BLR-CP-001/cp001-permanent-contracts";
import {
  BLR_CP003_MERGE_SPLIT_MATRIX_V1,
  cp003ProvisionalAuthorities,
} from "./cp003-merge-split-audit";
import { generateBlrCp003EditorialReviewV2Records } from "./cp003-editorial-upgrader";

const reviewPrototypeIds = new Set(
  generateBlrCp003EditorialReviewV2Records().map(
    (record) => record.prototypeId,
  ),
);
const matrixPrototypeIds = new Set(
  BLR_CP003_MERGE_SPLIT_MATRIX_V1.map((entry) => entry.prototypeId),
);

assert.equal(reviewPrototypeIds.size, 18);
assert.equal(BLR_CP003_MERGE_SPLIT_MATRIX_V1.length, 19);
assert.equal(matrixPrototypeIds.size, 19);
for (const prototypeId of reviewPrototypeIds) {
  assert.ok(
    matrixPrototypeIds.has(prototypeId as never),
    `Merge/split matrix is missing ${prototypeId}.`,
  );
}
assert.ok(matrixPrototypeIds.has("BLR-CP003-PROT-MULTI-ITEM-GROUP"));

const existingContractById = new Map(
  BLR_CP001_PERMANENT_CONTRACTS.map((contract) => [contract.qlId, contract]),
);
const merges = BLR_CP003_MERGE_SPLIT_MATRIX_V1.filter(
  (entry) => entry.decision === "MERGE_EXISTING",
);
const provisional = BLR_CP003_MERGE_SPLIT_MATRIX_V1.filter(
  (entry) => entry.decision === "PROVISIONAL_NEW",
);
const assembly = BLR_CP003_MERGE_SPLIT_MATRIX_V1.filter(
  (entry) => entry.decision === "ASSEMBLY_ONLY",
);

assert.equal(merges.length, 10);
assert.equal(provisional.length, 8);
assert.equal(assembly.length, 1);

for (const entry of merges) {
  const contract = existingContractById.get(entry.existingQlId);
  assert.ok(contract, `Unknown frozen QL ${entry.existingQlId}.`);
  assert.equal(contract?.solveAuthority, entry.existingAuthority);
  assert.equal(contract?.answerType, entry.answerType);
  assert.ok(entry.rationale.length >= 50);
}
for (const entry of provisional) {
  assert.ok(entry.rationale.length >= 50);
  assert.ok(!("existingQlId" in entry));
}

assert.deepEqual(
  [...new Set(merges.map((entry) => entry.existingQlId))].sort(),
  [
    "BLR-QL-001",
    "BLR-QL-002",
    "BLR-QL-003",
    "BLR-QL-005",
    "BLR-QL-006",
    "BLR-QL-007",
  ],
);
assert.ok(
  merges.some(
    (entry) =>
      entry.prototypeId ===
        "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON-BY-GENDER" &&
      entry.existingQlId === "BLR-QL-003",
  ),
);
assert.ok(!merges.some((entry) => entry.existingQlId === "BLR-QL-004"));

assert.deepEqual(
  cp003ProvisionalAuthorities().sort(),
  [
    "DETERMINE_MEMBER_GENDER",
    "DETERMINE_MEMBER_MARITAL_STATUS",
    "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
    "SELECT_UNORDERED_FAMILY_PAIR",
  ],
);

const pairEntries = provisional.filter(
  (entry) => entry.provisionalAuthority === "SELECT_UNORDERED_FAMILY_PAIR",
);
assert.deepEqual(
  pairEntries.map((entry) => entry.prototypeId).sort(),
  [
    "BLR-CP003-PROT-SHARED-MARRIED-PAIR",
    "BLR-CP003-PROT-SHARED-PARENT-CHILD-PAIR",
    "BLR-CP003-PROT-SHARED-SIBLING-PAIR",
  ],
);
assert.equal(
  assembly[0]?.prototypeId,
  "BLR-CP003-PROT-MULTI-ITEM-GROUP",
);
assert.equal(assembly[0]?.answerType, "NONE");

const serialized = JSON.stringify(BLR_CP003_MERGE_SPLIT_MATRIX_V1);
assert.ok(!serialized.includes("BLR-QL-009"));
assert.ok(!serialized.includes("permanentQlId"));

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-003",
      gate: "MERGE_SPLIT_AUDIT_V1",
      temporaryItemHandles: reviewPrototypeIds.size,
      assemblyHandles: assembly.length,
      mergedHandles: merges.length,
      existingQlTargets: [
        ...new Set(merges.map((entry) => entry.existingQlId)),
      ].sort(),
      provisionalNewHandles: provisional.length,
      provisionalNewAuthorities: cp003ProvisionalAuthorities().sort(),
      provisionalNewAuthorityCount: cp003ProvisionalAuthorities().length,
      permanentQlAllocated: false,
      nextAvailableQlClaimed: false,
    },
    null,
    2,
  ),
);
