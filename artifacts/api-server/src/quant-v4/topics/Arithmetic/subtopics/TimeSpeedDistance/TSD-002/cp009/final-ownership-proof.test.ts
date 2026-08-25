import { TSD_CP009_FINAL_NEW_AUTHORITY_CANDIDATES } from "./final-ownership-candidate";
import { TSD_CP009_LEARNER_AUTHORITIES, TSD_CP009_SOURCE_ACCOUNTING } from "./source-saturation-final";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-009 final ownership proof failed: ${message}`);
}

assert(TSD_CP009_FINAL_NEW_AUTHORITY_CANDIDATES.length === 11, "expected 11 final authority candidates");
assert(JSON.stringify(TSD_CP009_FINAL_NEW_AUTHORITY_CANDIDATES.map((entry) => entry.authorityKey)) === JSON.stringify(TSD_CP009_LEARNER_AUTHORITIES.map((entry) => entry.authorityKey)), "final ownership order differs from source-saturated authority order");
assert(TSD_CP009_FINAL_NEW_AUTHORITY_CANDIDATES.every((entry) => entry.examRepresentations.length >= 4), "one or more CP009 authorities has fewer than four exam representations");
assert(TSD_CP009_FINAL_NEW_AUTHORITY_CANDIDATES.every((entry) => entry.underlyingSolveModes.length >= 1), "one or more CP009 authorities lacks underlying source modes");
assert(TSD_CP009_FINAL_NEW_AUTHORITY_CANDIDATES.every((entry) => entry.permanentQlId === null), "permanent QL allocated before executable gate");
assert(TSD_CP009_FINAL_NEW_AUTHORITY_CANDIDATES.every((entry) => entry.ownershipStatus === "SOURCE_SATURATED_EXECUTABLE_FEASIBILITY_CANDIDATE"), "ownership lifecycle changed before executable gate");

for (const authority of TSD_CP009_FINAL_NEW_AUTHORITY_CANDIDATES) {
  const expectedModes = TSD_CP009_SOURCE_ACCOUNTING
    .filter((entry) => (entry.disposition === "LEARNER_AUTHORITY" || entry.disposition === "MERGED") && entry.target === authority.authorityKey)
    .map((entry) => entry.candidate);
  assert(JSON.stringify(authority.underlyingSolveModes) === JSON.stringify(expectedModes), `${authority.authorityKey}: underlying source-mode coverage drifted`);
  assert(authority.executableInvariant.trim().split(/\s+/).length >= 5, `${authority.authorityKey}: executable invariant lacks a meaningful statement`);
  assert(/=|speed|time|distance|medium|ground|frame|current|average|ratio|trip|drift|meeting/i.test(authority.executableInvariant), `${authority.authorityKey}: executable invariant lacks an equation or motion-domain semantic marker`);
}

const representationCount = TSD_CP009_FINAL_NEW_AUTHORITY_CANDIDATES.reduce((sum, entry) => sum + entry.examRepresentations.length, 0);
assert(representationCount >= 44, `expected at least 44 total representation descriptions, got ${representationCount}`);

console.log("TSD-CP-009 FINAL OWNERSHIP / REPRESENTATION SATURATION PROOF: PASS");
console.log(JSON.stringify({
  authorities: 11,
  minimumRepresentationsPerAuthority: Math.min(...TSD_CP009_FINAL_NEW_AUTHORITY_CANDIDATES.map((entry) => entry.examRepresentations.length)),
  totalRepresentationDescriptions: representationCount,
  permanentQlAllocation: "LOCKED",
}, null, 2));
