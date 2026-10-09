import { TSD_CP009_EXECUTABLE_AUTHORITIES } from "./executable-generator";
import { TSD_CP009_NEXT_PERMANENT_QL, TSD_CP009_PERMANENT_QL_IDS, TSD_CP009_QL_ALLOCATION } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-009 allocation proof failed: ${message}`);
}

assert(TSD_CP009_QL_ALLOCATION.length === 11, "expected 11 permanent QLs");
assert(TSD_CP009_PERMANENT_QL_IDS.length === 11, "permanent QL ID count changed");
assert(new Set(TSD_CP009_PERMANENT_QL_IDS).size === 11, "permanent QL IDs are not unique");
assert(JSON.stringify(TSD_CP009_QL_ALLOCATION.map((entry) => entry.authorityKey)) === JSON.stringify(TSD_CP009_EXECUTABLE_AUTHORITIES), "allocation authority order differs from executable order");

const numericIds = TSD_CP009_PERMANENT_QL_IDS.map((qlId) => Number(qlId.split("-").at(-1)));
assert(JSON.stringify(numericIds) === JSON.stringify(Array.from({ length: 11 }, (_, index) => 104 + index)), "CP009 permanent QLs must be contiguous 104..114");
assert(TSD_CP009_NEXT_PERMANENT_QL === "TSD-QL-115", "next permanent QL must be 115");

console.log("TSD-CP-009 PERMANENT QL ALLOCATION PROOF: PASS");
console.log(JSON.stringify({
  allocated: TSD_CP009_PERMANENT_QL_IDS,
  nextPermanentQl: TSD_CP009_NEXT_PERMANENT_QL,
}, null, 2));
