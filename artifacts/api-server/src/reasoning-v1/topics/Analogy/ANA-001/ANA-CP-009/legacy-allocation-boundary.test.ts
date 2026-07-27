import assert from "node:assert/strict";
import { ANA_CP009_LEGACY_FAMILY_DECISIONS } from "./legacy-allocation-boundary";

assert.equal(ANA_CP009_LEGACY_FAMILY_DECISIONS.length, 12);
assert.equal(
  new Set(ANA_CP009_LEGACY_FAMILY_DECISIONS.map((entry) => entry.legacyFamilyId)).size,
  ANA_CP009_LEGACY_FAMILY_DECISIONS.length,
);
assert.ok(ANA_CP009_LEGACY_FAMILY_DECISIONS.every((entry) => entry.legacyTitles.length === 2));
assert.ok(ANA_CP009_LEGACY_FAMILY_DECISIONS.every((entry) => entry.permanentQlIds.length === 0));
assert.ok(ANA_CP009_LEGACY_FAMILY_DECISIONS.every((entry) => entry.rationale.length >= 120));
assert.ok(ANA_CP009_LEGACY_FAMILY_DECISIONS.every((entry) => entry.destination.length >= 20));

const delegated = ANA_CP009_LEGACY_FAMILY_DECISIONS.filter(
  (entry) => entry.verdict === "DELEGATE_EXISTING_AUTHORITY",
);
const presentationOnly = ANA_CP009_LEGACY_FAMILY_DECISIONS.filter(
  (entry) => entry.verdict === "PRESENTATION_NOT_AUTHORITY",
);
const sourceRequired = ANA_CP009_LEGACY_FAMILY_DECISIONS.filter(
  (entry) => entry.verdict === "QUARANTINE_SOURCE_REQUIRED",
);

assert.equal(delegated.length, 8);
assert.equal(presentationOnly.length, 3);
assert.equal(sourceRequired.length, 1);
assert.equal(sourceRequired[0]?.legacyFamilyId, "ADV_CONDITIONAL_BRANCH");

const formerRanges = ANA_CP009_LEGACY_FAMILY_DECISIONS.map((entry) => entry.formerQlRange);
assert.equal(new Set(formerRanges).size, formerRanges.length);
assert.deepEqual(formerRanges, [
  "ANA-QL-237..238",
  "ANA-QL-239..240",
  "ANA-QL-241..242",
  "ANA-QL-243..244",
  "ANA-QL-245..246",
  "ANA-QL-247..248",
  "ANA-QL-249..250",
  "ANA-QL-251..252",
  "ANA-QL-253..254",
  "ANA-QL-255..256",
  "ANA-QL-257..258",
  "ANA-QL-259..260",
]);

console.log("ANA-CP-009 legacy allocation boundary audit passed.", {
  historicalFamilies: ANA_CP009_LEGACY_FAMILY_DECISIONS.length,
  delegatedToExistingAuthorities: delegated.length,
  presentationOnlyFamilies: presentationOnly.length,
  quarantinedForSourceProof: sourceRequired.length,
  permanentQlIdsAssigned: 0,
});
