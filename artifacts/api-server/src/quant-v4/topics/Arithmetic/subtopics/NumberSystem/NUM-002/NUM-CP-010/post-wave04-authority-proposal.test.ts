import assert from "node:assert/strict";

import {
  NUM_CP010_ID_FREE_AUTHORITY_PROPOSAL,
  NUM_CP010_PROPOSED_AUTHORITY_COUNT,
} from "./post-wave04-authority-proposal.ts";

const expectedPrototypes = Array.from({ length: 26 }, (_, index) =>
  `NUM-CP010-PROT-${String(index + 1).padStart(3, "0")}`,
);

assert.equal(NUM_CP010_PROPOSED_AUTHORITY_COUNT, 15, "CP010 proposed authority count drift");
assert.equal(NUM_CP010_ID_FREE_AUTHORITY_PROPOSAL.length, 15, "Expected exactly 15 proposed authorities");

const authorityKeys = NUM_CP010_ID_FREE_AUTHORITY_PROPOSAL.map((authority) => authority.authorityKey);
assert.equal(new Set(authorityKeys).size, authorityKeys.length, "Duplicate CP010 authority key");

const assigned = NUM_CP010_ID_FREE_AUTHORITY_PROPOSAL.flatMap((authority) => [...authority.prototypes]);
assert.equal(assigned.length, 26, "Expected exactly 26 prototype assignments");
assert.equal(new Set(assigned).size, 26, "A discovery prototype is assigned to more than one proposed authority");

assert.deepEqual(
  [...assigned].sort(),
  [...expectedPrototypes].sort(),
  "Every CP010 discovery prototype P001..P026 must be covered exactly once",
);

for (const authority of NUM_CP010_ID_FREE_AUTHORITY_PROPOSAL) {
  assert.match(authority.authorityKey, /^CP010-AUTH-\d{3}$/u, `${authority.authorityKey}: malformed temporary authority key`);
  assert.ok(authority.label.trim().length >= 8, `${authority.authorityKey}: authority label is too thin`);
  assert.ok(authority.prototypes.length >= 1, `${authority.authorityKey}: authority has no prototype ancestry`);
  assert.doesNotMatch(
    JSON.stringify(authority),
    /NUM-QL-\d+/u,
    `${authority.authorityKey}: permanent QL identity allocated before product-owner count approval`,
  );
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP010_ID_FREE_MERGE_SPLIT_PROPOSAL",
  proposedAuthorities: NUM_CP010_PROPOSED_AUTHORITY_COUNT,
  prototypeAssignments: assigned.length,
  uniquePrototypeAssignments: new Set(assigned).size,
  permanentQlAllocations: 0,
  coverage: `${expectedPrototypes[0]}..${expectedPrototypes.at(-1)}`,
}, null, 2));
