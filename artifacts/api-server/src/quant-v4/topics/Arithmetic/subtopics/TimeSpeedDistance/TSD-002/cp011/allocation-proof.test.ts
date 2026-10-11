import { TSD_CP011_LEARNER_AUTHORITIES } from "./source-saturation";
import {
  TSD_CP011_NEXT_PERMANENT_QL,
  TSD_CP011_PERMANENT_QL_IDS,
  TSD_CP011_PROVISIONAL_QL_IDS,
  TSD_CP011_QL_ALLOCATION,
  TSD_CP011_QL_ALLOCATION_STATUS,
  TSD_CP011_QL_LIFECYCLE,
} from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-011 allocation proof failed: ${message}`);
}

assert(TSD_CP011_QL_ALLOCATION_STATUS === "PERMANENT_FROZEN", "allocation must be permanent and frozen");
assert(TSD_CP011_QL_ALLOCATION.length === 7, "expected seven permanent QLs");
assert(new Set(TSD_CP011_PERMANENT_QL_IDS).size === 7, "permanent QL IDs must be unique");
assert(TSD_CP011_PROVISIONAL_QL_IDS === TSD_CP011_PERMANENT_QL_IDS, "stack compatibility alias must reference permanent QLs exactly");
assert(new Set(TSD_CP011_QL_ALLOCATION.map((x) => x.authorityKey)).size === 7, "each learner authority must have one QL");

for (let index = 0; index < TSD_CP011_QL_ALLOCATION.length; index += 1) {
  assert(TSD_CP011_QL_ALLOCATION[index]!.qlId === `TSD-QL-${125 + index}`, `QL sequence broke at index ${index}`);
}
for (const authorityKey of TSD_CP011_LEARNER_AUTHORITIES) {
  assert(TSD_CP011_QL_ALLOCATION.some((x) => x.authorityKey === authorityKey), `${authorityKey}: QL allocation missing`);
}
assert(TSD_CP011_NEXT_PERMANENT_QL === "TSD-QL-132", "next permanent QL must remain 132");
assert(TSD_CP011_QL_LIFECYCLE.productOwnerApproved, "frozen allocation must record product-owner approval");
assert(TSD_CP011_QL_LIFECYCLE.frozen, "frozen allocation lost freeze authority");
assert(!TSD_CP011_QL_LIFECYCLE.productionRegistered, "content freeze must not register production QLs");
assert(!TSD_CP011_QL_LIFECYCLE.questionBankWritable, "content freeze must not enable bank writes");
assert(!TSD_CP011_QL_LIFECYCLE.testEligible, "content freeze must not enable test eligibility");
assert(!TSD_CP011_QL_LIFECYCLE.publiclyPublishable, "content freeze must not enable public publishing");

console.log("TSD-CP-011 PERMANENT FROZEN QL ALLOCATION PROOF: PASS");
console.log(JSON.stringify({
  allocationStatus: TSD_CP011_QL_ALLOCATION_STATUS,
  permanentQlIds: TSD_CP011_PERMANENT_QL_IDS,
  nextPermanentQl: TSD_CP011_NEXT_PERMANENT_QL,
  productionRegistered: TSD_CP011_QL_LIFECYCLE.productionRegistered,
}, null, 2));
