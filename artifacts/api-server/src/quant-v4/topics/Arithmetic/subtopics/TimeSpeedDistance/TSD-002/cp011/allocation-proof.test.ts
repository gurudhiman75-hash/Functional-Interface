import { TSD_CP011_LEARNER_AUTHORITIES } from "./source-saturation";
import {
  TSD_CP011_NEXT_QL_ID,
  TSD_CP011_PROVISIONAL_QL_IDS,
  TSD_CP011_QL_ALLOCATION,
  TSD_CP011_QL_ALLOCATION_STATUS,
  TSD_CP011_QL_LIFECYCLE,
} from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-011 allocation proof failed: ${message}`);
}

assert(TSD_CP011_QL_ALLOCATION_STATUS === "PROVISIONAL_EXECUTABLE_DISCOVERY_CANDIDATE", "allocation must remain provisional");
assert(TSD_CP011_QL_ALLOCATION.length === 7, "expected seven provisional QLs");
assert(new Set(TSD_CP011_PROVISIONAL_QL_IDS).size === 7, "QL IDs must be unique");
assert(new Set(TSD_CP011_QL_ALLOCATION.map((x) => x.authorityKey)).size === 7, "each learner authority must have one QL");

for (let index = 0; index < TSD_CP011_QL_ALLOCATION.length; index += 1) {
  assert(TSD_CP011_QL_ALLOCATION[index]!.qlId === `TSD-QL-${125 + index}`, `QL sequence broke at index ${index}`);
}
for (const authorityKey of TSD_CP011_LEARNER_AUTHORITIES) {
  assert(TSD_CP011_QL_ALLOCATION.some((x) => x.authorityKey === authorityKey), `${authorityKey}: QL allocation missing`);
}
assert(TSD_CP011_NEXT_QL_ID === "TSD-QL-132", "next QL must remain 132");
assert(!TSD_CP011_QL_LIFECYCLE.productOwnerApproved, "discovery cannot assert product-owner approval");
assert(!TSD_CP011_QL_LIFECYCLE.frozen, "discovery cannot freeze QLs");
assert(!TSD_CP011_QL_LIFECYCLE.productionRegistered, "discovery cannot register production QLs");
assert(!TSD_CP011_QL_LIFECYCLE.questionBankWritable, "discovery cannot enable bank writes");
assert(!TSD_CP011_QL_LIFECYCLE.testEligible, "discovery cannot enable test eligibility");
assert(!TSD_CP011_QL_LIFECYCLE.publiclyPublishable, "discovery cannot enable public publishing");

console.log("TSD-CP-011 PROVISIONAL QL ALLOCATION PROOF: PASS");
console.log(JSON.stringify({
  allocationStatus: TSD_CP011_QL_ALLOCATION_STATUS,
  provisionalQlIds: TSD_CP011_PROVISIONAL_QL_IDS,
  nextQlId: TSD_CP011_NEXT_QL_ID,
}, null, 2));