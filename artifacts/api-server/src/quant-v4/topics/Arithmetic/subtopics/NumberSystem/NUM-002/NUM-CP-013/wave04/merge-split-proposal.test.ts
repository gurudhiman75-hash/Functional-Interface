import assert from "node:assert/strict";

import {
  NUM_CP013_AUTHORITY_PROPOSAL,
  NUM_CP013_DESIGN_FAMILY_COVERAGE,
  NUM_CP013_DISCOVERY_PROTOTYPE_IDS,
  NUM_CP013_MERGE_SPLIT_STATUS,
  NUM_CP013_OWNERSHIP_CLOSURES,
} from "./merge-split-proposal.ts";

const sourceAssignments = new Map<string, string[]>();
for (const authority of NUM_CP013_AUTHORITY_PROPOSAL) {
  assert.ok(authority.sourcePrototypes.length >= 1, `${authority.authorityId}: empty authority`);
  assert.ok(authority.invariant.length >= 30, `${authority.authorityId}: invariant too thin`);
  assert.ok(authority.canonicalRoute.length >= 25, `${authority.authorityId}: canonical route too thin`);
  for (const prototype of authority.sourcePrototypes) {
    assert.ok(NUM_CP013_DISCOVERY_PROTOTYPE_IDS.includes(prototype as any), `${authority.authorityId}: unknown prototype ${prototype}`);
    const owners = sourceAssignments.get(prototype) ?? [];
    owners.push(authority.authorityId);
    sourceAssignments.set(prototype, owners);
  }
}

assert.equal(NUM_CP013_AUTHORITY_PROPOSAL.length, 11, "Authority proposal count drift");
assert.equal(NUM_CP013_DISCOVERY_PROTOTYPE_IDS.length, 22, "Discovery prototype count drift");
for (const prototype of NUM_CP013_DISCOVERY_PROTOTYPE_IDS) {
  assert.deepEqual(sourceAssignments.get(prototype), [sourceAssignments.get(prototype)?.[0]], `${prototype}: prototype must map to exactly one authority`);
  assert.equal(sourceAssignments.get(prototype)?.length, 1, `${prototype}: merge-split ownership must be singular`);
}
assert.equal(sourceAssignments.size, 22, "Not every discovery prototype reached merge-split disposition");

const requiredFamilies = [
  "BASE_B_TO_DECIMAL",
  "DECIMAL_INTEGER_TO_BASE_B",
  "BETWEEN_NON_DECIMAL_BASES",
  "BINARY_OCTAL_HEX_GROUPING",
  "COMPARE_NUMERALS_ACROSS_BASES",
  "PLACE_VALUE_IN_BASE_B",
  "NUMBER_OF_DIGITS_IN_BASE_B",
  "LARGEST_SMALLEST_N_DIGIT_NUMERAL",
  "MINIMUM_BASE_AND_DIGIT_VALIDITY",
  "COUNT_SET_VALID_BASES",
  "UNKNOWN_DIGIT_IN_NUMERAL_EQUALITY",
  "UNKNOWN_BASE_FROM_DECIMAL_EQUALITY",
  "UNKNOWN_BASE_FROM_ARITHMETIC_STATEMENT",
  "UNKNOWN_BASE_ONE_MANY_NO_SOLUTION",
  "ADDITION_IN_BASE",
  "SUBTRACTION_IN_BASE",
  "MULTIPLICATION_IN_BASE",
  "CARRY_INTO_NEW_DIGIT",
  "BORROW_CHAIN_ACROSS_ZEROES",
  "REMAINDER_DIVISIBILITY_IN_BASE_B",
  "TERMINAL_DIGIT_IN_STATED_BASE",
  "HEX_A_TO_F_TERMINOLOGY",
  "ZERO_VALUE_BOUNDARY",
  "STATEMENT_CLAIM_REPRESENTATION",
  "DATA_SUFFICIENCY",
  "FRACTIONAL_TERMINATING_BASE_CONVERSION",
  "RECURRING_FRACTIONAL_BASE_EXPANSION",
  "LARGE_SYMBOLIC_BASE_EQUATIONS",
] as const;

const familyMap = new Map(NUM_CP013_DESIGN_FAMILY_COVERAGE.map((entry) => [entry.family, entry]));
for (const family of requiredFamilies) assert.ok(familyMap.has(family), `Missing family disposition: ${family}`);
assert.equal(familyMap.size, requiredFamilies.length, "Unexpected/duplicate design family disposition");

for (const entry of NUM_CP013_DESIGN_FAMILY_COVERAGE) {
  if (entry.disposition.startsWith("IMPLEMENTED")) {
    assert.ok(entry.prototypes.length >= 1, `${entry.family}: implemented family has no prototype evidence`);
    for (const prototype of entry.prototypes) {
      assert.ok(NUM_CP013_DISCOVERY_PROTOTYPE_IDS.includes(prototype as any), `${entry.family}: unknown prototype evidence ${prototype}`);
    }
  } else {
    assert.equal(entry.prototypes.length, 0, `${entry.family}: external/hold family should not claim CP013 prototype ownership`);
  }
}

assert.equal(familyMap.get("DATA_SUFFICIENCY")?.disposition, "EXTERNAL_OWNER_DSF_001");
assert.equal(familyMap.get("FRACTIONAL_TERMINATING_BASE_CONVERSION")?.disposition, "ADVANCED_HOLD");
assert.equal(familyMap.get("RECURRING_FRACTIONAL_BASE_EXPANSION")?.disposition, "ADVANCED_HOLD");
assert.equal(familyMap.get("LARGE_SYMBOLIC_BASE_EQUATIONS")?.disposition, "ADVANCED_HOLD");

assert.ok(NUM_CP013_OWNERSHIP_CLOSURES.includes("ORDINARY_DECIMAL_DIGIT_EQUATION -> NUM-CP-010"));
assert.ok(NUM_CP013_OWNERSHIP_CLOSURES.includes("DECIMAL_TERMINAL_DIGITS_OF_POWERS -> NUM-CP-009"));
assert.ok(NUM_CP013_OWNERSHIP_CLOSURES.includes("GENERAL_DECIMAL_REMAINDER_WITHOUT_BASE_ESSENTIALITY -> NUM-CP-008"));
assert.ok(NUM_CP013_OWNERSHIP_CLOSURES.includes("DATA_SUFFICIENCY_WRAPPER -> DSF-001"));

assert.equal(NUM_CP013_MERGE_SPLIT_STATUS.discoveryPrototypeCount, 22);
assert.equal(NUM_CP013_MERGE_SPLIT_STATUS.proposedAuthorityCount, 11);
assert.equal(NUM_CP013_MERGE_SPLIT_STATUS.permanentQlAllocated, false);
assert.equal(NUM_CP013_MERGE_SPLIT_STATUS.questionStudioDiscoverable, false);
assert.equal(NUM_CP013_MERGE_SPLIT_STATUS.questionBankWritable, false);
assert.equal(NUM_CP013_MERGE_SPLIT_STATUS.testEligible, false);
assert.equal(NUM_CP013_MERGE_SPLIT_STATUS.mockTestEligible, false);
assert.equal(NUM_CP013_MERGE_SPLIT_STATUS.publiclyPublishable, false);
assert.equal(NUM_CP013_MERGE_SPLIT_STATUS.automaticStudentPublication, false);

console.log(JSON.stringify({
  status: "PASS_NUM_CP013_WAVE04_MERGE_SPLIT",
  discoveryPrototypes: NUM_CP013_DISCOVERY_PROTOTYPE_IDS.length,
  proposedAuthorities: NUM_CP013_AUTHORITY_PROPOSAL.length,
  designFamiliesDisposed: NUM_CP013_DESIGN_FAMILY_COVERAGE.length,
  ownershipClosures: NUM_CP013_OWNERSHIP_CLOSURES.length,
  advancedHolds: NUM_CP013_DESIGN_FAMILY_COVERAGE.filter((entry) => entry.disposition === "ADVANCED_HOLD").map((entry) => entry.family),
  permanentQlAllocated: false,
  downstreamGatesLocked: true,
}, null, 2));
