import { TSD_CP010_AUTHORITY_KEYS } from "./source-saturation";
import { TSD_CP010_FINAL_OWNERSHIP_CANDIDATE, TSD_CP010_REPRESENTATION_SUMMARY } from "./final-ownership-candidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 representation proof failed: ${message}`);
}

assert(TSD_CP010_FINAL_OWNERSHIP_CANDIDATE.length === 10, "expected 10 ownership candidates");
assert(TSD_CP010_REPRESENTATION_SUMMARY.minimumRepresentationsPerAuthority >= 4, "every authority needs >=4 representations");
assert(TSD_CP010_REPRESENTATION_SUMMARY.totalRepresentationDescriptions >= 45, "representation pool is too thin");
assert(new Set(TSD_CP010_FINAL_OWNERSHIP_CANDIDATE.map((x) => x.authorityKey)).size === 10, "authority keys must be unique");
for (const key of TSD_CP010_AUTHORITY_KEYS) {
  assert(TSD_CP010_FINAL_OWNERSHIP_CANDIDATE.some((x) => x.authorityKey === key), `${key} missing from ownership candidate`);
}
for (const entry of TSD_CP010_FINAL_OWNERSHIP_CANDIDATE) {
  assert(entry.learnerContract.length >= 40, `${entry.authorityKey} learner contract too thin`);
  assert(new Set(entry.representations).size === entry.representations.length, `${entry.authorityKey} has duplicate representations`);
}

console.log("TSD-CP-010 FINAL OWNERSHIP / REPRESENTATION SATURATION PROOF: PASS");
console.log(JSON.stringify(TSD_CP010_REPRESENTATION_SUMMARY, null, 2));