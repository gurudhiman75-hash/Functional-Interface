import { TSD_CP008_EXECUTABLE_AUTHORITIES } from "./executable-generator";
import { TSD_CP008_FINAL_NEW_AUTHORITY_CANDIDATES } from "./final-ownership-candidate";
import { TSD_CP008_NEXT_PERMANENT_QL_ID, TSD_CP008_PERMANENT_QL_ALLOCATIONS, TSD_CP008_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-008 allocation proof failed: ${message}`);
}

assert(TSD_CP008_FINAL_NEW_AUTHORITY_CANDIDATES.length === 9, "source-saturated authority count changed");
assert(TSD_CP008_EXECUTABLE_AUTHORITIES.length === 9, "executable authority count changed");
assert(TSD_CP008_PERMANENT_QL_ALLOCATIONS.length === 9, "expected nine permanent CP008 QLs");
const expected = Array.from({ length: 9 }, (_, index) => `TSD-QL-${String(95 + index).padStart(3, "0")}`);
assert(JSON.stringify(TSD_CP008_PERMANENT_QL_IDS) === JSON.stringify(expected), "CP008 QLs must be contiguous TSD-QL-095..103");
assert(TSD_CP008_NEXT_PERMANENT_QL_ID === "TSD-QL-104", "next permanent QL must be TSD-QL-104");
assert(new Set(TSD_CP008_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.authorityKey)).size === 9, "authority allocation contains duplicates");
assert(JSON.stringify(TSD_CP008_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.authorityKey)) === JSON.stringify(TSD_CP008_EXECUTABLE_AUTHORITIES), "QL allocation order differs from executable authority order");

console.log("TSD-CP-008 PERMANENT QL ALLOCATION PROOF: PASS");
console.log(JSON.stringify({
  permanentQlRange: "TSD-QL-095..TSD-QL-103",
  permanentQlCount: 9,
  nextPermanentQl: TSD_CP008_NEXT_PERMANENT_QL_ID,
  sourceSaturatedAuthorities: 9,
  executableAuthorities: 9,
  englishFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
