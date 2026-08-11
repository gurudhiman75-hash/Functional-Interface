import assert from "node:assert/strict";

import { reconstructUniqueOrder } from "../RNK-CP-004/cp004-foundation";
import {
  buildRnkCp004PermanentRuntime,
  RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS,
} from "../RNK-CP-004/cp004-permanent-runtime-v1";
import {
  buildRnkCp005EditorialV3ReleaseCorpus,
  buildRnkCp005EditorialV3State,
  classifyRnkCp005EditorialV3Relation,
} from "./cp005-partial-order-editorial-v3-release";
import {
  RNK_CP005_QL034_OWNERSHIP_AUDIT,
  RNK_CP005_QL034_OWNERSHIP_DECISION,
} from "./rnk-cp005-ql034-ownership-audit";

function parseRelation(label: string): { first: string; second: string } | undefined {
  const match = label.match(/^(.+?) ranks above (.+?)\.$/i);
  return match ? { first: match[1]!.trim(), second: match[2]!.trim() } : undefined;
}

const cp004 = buildRnkCp004PermanentRuntime();
const ql034 = cp004.filter(
  (question) => question.reviewMetadata.permanentProfile.permanentQlId === "RNK-QL-034",
);
assert.equal(ql034.length, 192);
assert.equal(
  RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS.some(({ qlId }) => qlId === "RNK-QL-036"),
  false,
);

for (const question of ql034) {
  assert.equal(
    question.reviewMetadata.permanentProfile.authorityId,
    "DEFINITELY_TRUE_RELATION",
  );
  assert.equal(
    question.reviewMetadata.authorityConsolidationProfile.proofContract,
    "TRANSITIVE_RELATION_PROOF",
  );
  assert.equal(question.displayedEvidence.query.kind, "VALID_RANK_STATEMENT");
  const unique = reconstructUniqueOrder(
    question.displayedEvidence.entities,
    question.displayedEvidence.clues,
  );
  assert.equal(unique.length, question.displayedEvidence.entities.length);
}

const cp005 = buildRnkCp005EditorialV3ReleaseCorpus(24);
const relation = cp005.filter(
  (question) => question.authorityCandidateId === "RELATION_TRUTH_STATUS",
);
assert.equal(relation.length, 96);

const sourceCounts = {
  DEFINITELY_TRUE_RELATION: 0,
  POSSIBLE_RELATION: 0,
  IMPOSSIBLE_RELATION: 0,
  PAIR_RELATION_CANNOT_BE_DETERMINED: 0,
};
const pairModes = { FIRST_ABOVE: 0, SECOND_ABOVE: 0, INDETERMINATE: 0 };
let mustAcrossSeveralOrders = 0;
let couldAcrossSeveralOrders = 0;
let cannotAcrossSeveralOrders = 0;

for (const question of relation) {
  assert.equal(question.lifecycle.permanentQlAllocated, false);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  const state = buildRnkCp005EditorialV3State(question.seed, question.v3Topology);
  assert.ok(state);
  assert.ok(state.validOrders.length >= 2);

  sourceCounts[question.prototypeId as keyof typeof sourceCounts] += 1;

  if (
    question.prototypeId === "DEFINITELY_TRUE_RELATION" ||
    question.prototypeId === "POSSIBLE_RELATION" ||
    question.prototypeId === "IMPOSSIBLE_RELATION"
  ) {
    const correct = question.options[question.correctIndex]!;
    const pair = parseRelation(correct.label);
    assert.ok(pair);
    const status = classifyRnkCp005EditorialV3Relation(state, pair.first, pair.second);
    if (question.prototypeId === "DEFINITELY_TRUE_RELATION") {
      assert.equal(status, "DEFINITE");
      mustAcrossSeveralOrders += 1;
    } else if (question.prototypeId === "POSSIBLE_RELATION") {
      assert.equal(status, "VARIABLE");
      couldAcrossSeveralOrders += 1;
    } else {
      assert.equal(status, "IMPOSSIBLE");
      cannotAcrossSeveralOrders += 1;
    }
  } else {
    assert.ok(question.pairStatusMode);
    pairModes[question.pairStatusMode] += 1;
  }
}

assert.deepEqual(sourceCounts, {
  DEFINITELY_TRUE_RELATION: 24,
  POSSIBLE_RELATION: 24,
  IMPOSSIBLE_RELATION: 24,
  PAIR_RELATION_CANNOT_BE_DETERMINED: 24,
});
assert.equal(mustAcrossSeveralOrders, 24);
assert.equal(couldAcrossSeveralOrders, 24);
assert.equal(cannotAcrossSeveralOrders, 24);
assert.deepEqual(pairModes, {
  FIRST_ABOVE: 8,
  SECOND_ABOVE: 8,
  INDETERMINATE: 8,
});

assert.equal(
  RNK_CP005_QL034_OWNERSHIP_DECISION,
  "KEEP_SEPARATE_PROVISIONAL_AUTHORITY",
);
assert.equal(
  RNK_CP005_QL034_OWNERSHIP_AUDIT.existingAuthority.stateContract,
  "ONE_UNIQUE_COMPLETE_ORDER",
);
assert.equal(
  RNK_CP005_QL034_OWNERSHIP_AUDIT.cp005Candidate.stateContract,
  "TWO_OR_MORE_VALID_COMPLETE_ORDERS",
);
assert.equal(
  RNK_CP005_QL034_OWNERSHIP_AUDIT.consequence.permanentQlAllocated,
  false,
);
assert.equal(
  RNK_CP005_QL034_OWNERSHIP_AUDIT.consequence.nextAvailableQl,
  "RNK-QL-036",
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      decision: RNK_CP005_QL034_OWNERSHIP_DECISION,
      ql034QuestionsChecked: ql034.length,
      ql034StateContract: "ONE_UNIQUE_COMPLETE_ORDER",
      cp005RelationQuestionsChecked: relation.length,
      cp005StateContract: "TWO_OR_MORE_VALID_COMPLETE_ORDERS",
      cp005RelationSourceCounts: sourceCounts,
      pairModes,
      permanentQlAllocated: false,
      nextAvailableQl: "RNK-QL-036",
    },
    null,
    2,
  ),
);
