import assert from "node:assert/strict";

import {
  RNK_CP004_OWNERSHIP_BOUNDARY,
  RNK_CP004_CONSOLIDATED_AUTHORITY_IDS,
} from "../RNK-CP-004/cp004-authority-consolidation-v1";
import {
  buildRnkCp006ConsolidatedEditorialQuestions,
  RNK_CP006_AUTHORITY_CONSOLIDATION_VERSION,
  RNK_CP006_PROVISIONAL_AUTHORITY_IDS,
} from "./cp006-authority-consolidation-v1";

const questions = buildRnkCp006ConsolidatedEditorialQuestions();

assert.equal(questions.length, 144);
assert.equal(RNK_CP006_PROVISIONAL_AUTHORITY_IDS.length, 3);
assert.equal(
  RNK_CP004_OWNERSHIP_BOUNDARY.tiedOrNonStrictRanking,
  "RNK-CP-006_SOURCE_AUDIT",
);

const cp004AuthorityIds = new Set<string>(RNK_CP004_CONSOLIDATED_AUTHORITY_IDS);
const cp006AuthorityIds = new Set<string>(RNK_CP006_PROVISIONAL_AUTHORITY_IDS);
for (const authorityId of cp006AuthorityIds) {
  assert.equal(
    cp004AuthorityIds.has(authorityId),
    false,
    `${authorityId}: equality-aware authority must not silently widen a frozen CP-004 authority`,
  );
}

const countsByAuthority = Object.fromEntries(
  RNK_CP006_PROVISIONAL_AUTHORITY_IDS.map((authorityId) => [authorityId, 0]),
) as Record<(typeof RNK_CP006_PROVISIONAL_AUTHORITY_IDS)[number], number>;
const answerSemantics = new Map<string, string>();
const proofContracts = new Map<string, string>();
const cp004Analogues = new Map<string, string>();

for (const question of questions) {
  const profile = question.authorityProfile;
  assert.equal(profile.version, RNK_CP006_AUTHORITY_CONSOLIDATION_VERSION);
  assert.equal(profile.stateContract, "ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY");
  assert.equal(profile.decision, "KEEP_DISTINCT_PROVISIONAL_AUTHORITY");
  assert.equal(profile.whyNotCp004, "CP004_REQUIRES_ONE_UNIQUE_STRICT_TOTAL_ORDER");
  assert.equal(profile.permanentQlId, null);
  assert.equal(profile.freezeEligible, false);
  assert.equal(question.lifecycle.permanentQlAllocated, false);

  const tieGroups = question.state.orderedGroups.filter((group) => group.length > 1);
  assert.equal(tieGroups.length, 1);
  assert.equal(tieGroups[0]!.length, 2);

  countsByAuthority[profile.provisionalAuthorityId] += 1;

  const previousAnswerSemantic = answerSemantics.get(profile.provisionalAuthorityId);
  if (previousAnswerSemantic) {
    assert.equal(previousAnswerSemantic, profile.answerSemantic);
  } else {
    answerSemantics.set(profile.provisionalAuthorityId, profile.answerSemantic);
  }

  const previousProofContract = proofContracts.get(profile.provisionalAuthorityId);
  if (previousProofContract) {
    assert.equal(previousProofContract, profile.proofContract);
  } else {
    proofContracts.set(profile.provisionalAuthorityId, profile.proofContract);
  }

  const previousAnalogue = cp004Analogues.get(profile.provisionalAuthorityId);
  if (previousAnalogue) {
    assert.equal(previousAnalogue, profile.cp004Analogue);
  } else {
    cp004Analogues.set(profile.provisionalAuthorityId, profile.cp004Analogue);
  }
}

for (const authorityId of RNK_CP006_PROVISIONAL_AUTHORITY_IDS) {
  assert.equal(countsByAuthority[authorityId], 48);
}
assert.equal(new Set(answerSemantics.values()).size, 3);
assert.equal(new Set(proofContracts.values()).size, 3);
assert.deepEqual(new Set(cp004Analogues.values()), new Set(["RNK-QL-027", "RNK-QL-030", "RNK-QL-031"]));

assert.deepEqual(
  questions
    .filter((question) => question.sourceForm === "PAIR_RELATION_THROUGH_EQUALITY")
    .map((question) => question.authorityProfile.provisionalAuthorityId)
    .filter((value, index, all) => all.indexOf(value) === index),
  ["EQUALITY_AWARE_PAIR_RELATION"],
);
assert.deepEqual(
  questions
    .filter((question) => question.sourceForm === "ENDPOINT_ENTITY_THROUGH_EQUALITY")
    .map((question) => question.authorityProfile.provisionalAuthorityId)
    .filter((value, index, all) => all.indexOf(value) === index),
  ["EQUALITY_AWARE_ENDPOINT"],
);
assert.deepEqual(
  questions
    .filter((question) => question.sourceForm === "COMPLETE_WEAK_ORDER")
    .map((question) => question.authorityProfile.provisionalAuthorityId)
    .filter((value, index, all) => all.indexOf(value) === index),
  ["COMPLETE_WEAK_ORDER"],
);

console.log(JSON.stringify({
  status: "PASS",
  consolidationVersion: RNK_CP006_AUTHORITY_CONSOLIDATION_VERSION,
  editorialQuestionsChecked: questions.length,
  provisionalAuthorityCount: RNK_CP006_PROVISIONAL_AUTHORITY_IDS.length,
  countsByAuthority,
  answerSemantics: Object.fromEntries(answerSemantics),
  proofContracts: Object.fromEntries(proofContracts),
  cp004Analogues: Object.fromEntries(cp004Analogues),
  cp004Boundary: RNK_CP004_OWNERSHIP_BOUNDARY.tiedOrNonStrictRanking,
  decision: "KEEP_THREE_DISTINCT_PROVISIONAL_AUTHORITIES",
  permanentQlAllocated: false,
  nextAvailableQl: "RNK-QL-039",
}, null, 2));
