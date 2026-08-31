import { TSD_CP010_AUTHORITY_KEYS } from "./source-saturation";
import { TSD_CP010_NEXT_PERMANENT_QL, TSD_CP010_QL_ALLOCATION } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 allocation proof failed: ${message}`);
}

assert(TSD_CP010_QL_ALLOCATION.length === 10, "expected 10 permanent QLs");
assert(new Set(TSD_CP010_QL_ALLOCATION.map((x) => x.qlId)).size === 10, "QL ids must be unique");
assert(new Set(TSD_CP010_QL_ALLOCATION.map((x) => x.authorityKey)).size === 10, "authority allocations must be one-to-one");
assert(TSD_CP010_QL_ALLOCATION[0]?.qlId === "TSD-QL-115", "allocation must begin at TSD-QL-115");
assert(TSD_CP010_QL_ALLOCATION.at(-1)?.qlId === "TSD-QL-124", "allocation must end at TSD-QL-124");
assert(TSD_CP010_NEXT_PERMANENT_QL === "TSD-QL-125", "next QL must be TSD-QL-125");
for (const key of TSD_CP010_AUTHORITY_KEYS) {
  assert(TSD_CP010_QL_ALLOCATION.some((x) => x.authorityKey === key), `${key} missing permanent QL`);
}

console.log("TSD-CP-010 PERMANENT QL ALLOCATION PROOF: PASS");
console.log(JSON.stringify({
  allocated: TSD_CP010_QL_ALLOCATION.map((x) => x.qlId),
  nextPermanentQl: TSD_CP010_NEXT_PERMANENT_QL,
}, null, 2));