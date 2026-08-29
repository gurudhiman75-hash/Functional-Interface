import assert from "node:assert/strict";
import {
  NUM_CP014_ADVANCED_HOLDS,
  NUM_CP014_AUTHORITY_PROPOSAL,
  NUM_CP014_DISCOVERY_PROTOTYPE_IDS,
  NUM_CP014_OWNERSHIP_CLOSURES,
} from "./merge-split-proposal.ts";

assert.equal(NUM_CP014_DISCOVERY_PROTOTYPE_IDS.length, 20, "CP014 discovery should contain 20 positive prototypes");
assert.equal(new Set(NUM_CP014_DISCOVERY_PROTOTYPE_IDS).size, 20, "CP014 discovery prototype IDs must be unique");
assert.equal(NUM_CP014_AUTHORITY_PROPOSAL.length, 6, "CP014 should collapse to six topology authorities before permanent allocation");

const allSources = NUM_CP014_AUTHORITY_PROPOSAL.flatMap((authority) => [...authority.sourcePrototypeIds]);
assert.equal(allSources.length, 20, "Every positive discovery prototype must be disposed exactly once");
assert.equal(new Set(allSources).size, 20, "A discovery prototype was assigned to more than one authority");
assert.deepEqual([...new Set(allSources)].sort(), [...NUM_CP014_DISCOVERY_PROTOTYPE_IDS].sort(), "Authority proposal does not cover the complete discovery corpus");

const byId = Object.fromEntries(NUM_CP014_AUTHORITY_PROPOSAL.map((authority) => [authority.authorityId, authority]));
assert.equal(byId["NUM-CP014-AUTH-001"]?.sourcePrototypeIds.length, 13);
assert.deepEqual(byId["NUM-CP014-AUTH-002"]?.sourcePrototypeIds, ["NUM-CP014-PROT-007", "NUM-CP014-PROT-008"]);
assert.deepEqual(byId["NUM-CP014-AUTH-003"]?.sourcePrototypeIds, ["NUM-CP014-PROT-009", "NUM-CP014-PROT-012"]);
assert.deepEqual(byId["NUM-CP014-AUTH-004"]?.sourcePrototypeIds, ["NUM-CP014-PROT-010"]);
assert.deepEqual(byId["NUM-CP014-AUTH-005"]?.sourcePrototypeIds, ["NUM-CP014-PROT-011"]);
assert.deepEqual(byId["NUM-CP014-AUTH-006"]?.sourcePrototypeIds, ["NUM-CP014-PROT-020"]);

assert.deepEqual(byId["NUM-CP014-AUTH-002"]?.answerSemantics, ["LEAST_VALUE", "GREATEST_VALUE"], "least/greatest should be one extremum authority with a direction parameter");
assert.deepEqual(byId["NUM-CP014-AUTH-003"]?.answerSemantics, ["COUNT"], "count authority drift");
assert.deepEqual(byId["NUM-CP014-AUTH-004"]?.answerSemantics, ["NO_SOLUTION", "ONE_SOLUTION"], "solution-class modes drift");
assert.deepEqual(byId["NUM-CP014-AUTH-006"]?.answerSemantics, ["COMPLETE_VALID_SET"], "complete-set output must remain separate");

const hiddenScalarSemantics = new Set(byId["NUM-CP014-AUTH-001"]?.answerSemantics ?? []);
for (const semantic of ["DIGIT", "HIDDEN_NUMBER", "HIDDEN_BASE", "HIDDEN_EXPONENT", "HIDDEN_DIVISOR"]) {
  assert.ok(hiddenScalarSemantics.has(semantic), `two-engine hidden-scalar authority missing ${semantic}`);
}

assert.ok(NUM_CP014_OWNERSHIP_CLOSURES.includes("DATA_SUFFICIENCY_RETURNS_TO_DSF_001"));
assert.ok(NUM_CP014_OWNERSHIP_CLOSURES.includes("DECORATIVE_OR_IMPLIED_SECOND_COMPONENT_IS_REJECTED"));
assert.ok(NUM_CP014_OWNERSHIP_CLOSURES.includes("EQUIVALENT_RESTATEMENT_OF_ONE_INVARIANT_IS_REJECTED"));
assert.ok(NUM_CP014_ADVANCED_HOLDS.includes("NON_MONOTONE_MULTI_SOLUTION_CLASS_TOPOLOGIES_WITHOUT_ANSWER_IMPACT_PROOF"));

const serialized = JSON.stringify({
  authorities: NUM_CP014_AUTHORITY_PROPOSAL,
  ownership: NUM_CP014_OWNERSHIP_CLOSURES,
  holds: NUM_CP014_ADVANCED_HOLDS,
});
assert.ok(!serialized.includes("NUM-QL-248"), "Wave04 proposal must not allocate QL248 before certified discovery freeze");

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_WAVE04_MERGE_SPLIT",
  discoveryPrototypes: NUM_CP014_DISCOVERY_PROTOTYPE_IDS.length,
  proposedAuthorities: NUM_CP014_AUTHORITY_PROPOSAL.length,
  topologyMerge: {
    uniqueTwoEngineHiddenScalar: 13,
    twoEngineExtremum: 2,
    twoEngineCount: 2,
    twoEngineSolutionClass: 1,
    uniqueThreeEngineHiddenScalar: 1,
    twoEngineCompleteSet: 1,
  },
  ownershipClosures: NUM_CP014_OWNERSHIP_CLOSURES.length,
  advancedHolds: NUM_CP014_ADVANCED_HOLDS.length,
  permanentQlAllocated: false,
  nextFreeQlReservedButUnallocated: "NUM-QL-248",
}, null, 2));
