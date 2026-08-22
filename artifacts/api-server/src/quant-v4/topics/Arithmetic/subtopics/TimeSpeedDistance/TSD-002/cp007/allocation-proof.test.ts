import { TSD_CP007_AUTHORITY_APPROVAL, TSD_CP007_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";
import {
  TSD_CP007_NEXT_PERMANENT_QL_ID,
  TSD_CP007_PERMANENT_QL_ALLOCATIONS,
  TSD_CP007_PERMANENT_QL_IDS,
} from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-007 allocation proof failed: ${message}`);
}

assert(TSD_CP007_AUTHORITY_APPROVAL.status === "PRODUCT_OWNER_APPROVED_AUTHORITY_BOUNDARY", "authority boundary is not approved");
assert(TSD_CP007_AUTHORITY_APPROVAL.learnerAuthorityCount === 11, "approved authority count must remain 11");
assert(TSD_CP007_APPROVED_LEARNER_AUTHORITIES.length === 11, "approved learner authority registry must contain 11 authorities");
assert(TSD_CP007_PERMANENT_QL_ALLOCATIONS.length === 11, "allocation registry must contain 11 permanent QLs");
assert(TSD_CP007_PERMANENT_QL_IDS[0] === "TSD-QL-084", "first permanent QL changed");
assert(TSD_CP007_PERMANENT_QL_IDS[10] === "TSD-QL-094", "last permanent QL changed");
assert(TSD_CP007_NEXT_PERMANENT_QL_ID === "TSD-QL-095", "next free QL must be TSD-QL-095");
assert(new Set(TSD_CP007_PERMANENT_QL_IDS).size === 11, "duplicate permanent QL IDs detected");

const approvedKeys = TSD_CP007_APPROVED_LEARNER_AUTHORITIES.map((entry) => entry.authorityKey);
const allocatedKeys = TSD_CP007_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.authorityKey);
assert(JSON.stringify(approvedKeys) === JSON.stringify(allocatedKeys), "QL allocation order no longer matches approved authority order");

for (let index = 0; index < TSD_CP007_PERMANENT_QL_IDS.length; index += 1) {
  const expected = 84 + index;
  const actual = Number(TSD_CP007_PERMANENT_QL_IDS[index]!.slice("TSD-QL-".length));
  assert(actual === expected, `expected contiguous QL ${expected}, received ${actual}`);
}

assert(TSD_CP007_AUTHORITY_APPROVAL.englishFreezeStatus === "UNFROZEN", "English content must remain unfrozen after identity allocation");
assert(TSD_CP007_AUTHORITY_APPROVAL.questionStudioEnabled === false, "Question Studio must remain disabled after identity allocation");
assert(TSD_CP007_AUTHORITY_APPROVAL.questionBankStatus === "NOT_STORED", "CP007 must remain outside the question bank after allocation");
assert(TSD_CP007_AUTHORITY_APPROVAL.testEligibility === "INELIGIBLE", "CP007 must remain test-ineligible after allocation");
assert(TSD_CP007_AUTHORITY_APPROVAL.publiclyPublishable === false, "CP007 must remain unpublished after allocation");

console.log("TSD-CP-007 PERMANENT QL ALLOCATION PROOF: PASS");
console.log(JSON.stringify({
  approvedAuthorities: approvedKeys.length,
  firstQl: TSD_CP007_PERMANENT_QL_IDS[0],
  lastQl: TSD_CP007_PERMANENT_QL_IDS[10],
  nextQl: TSD_CP007_NEXT_PERMANENT_QL_ID,
  englishFreezeStatus: TSD_CP007_AUTHORITY_APPROVAL.englishFreezeStatus,
  questionStudioEnabled: TSD_CP007_AUTHORITY_APPROVAL.questionStudioEnabled,
}, null, 2));
