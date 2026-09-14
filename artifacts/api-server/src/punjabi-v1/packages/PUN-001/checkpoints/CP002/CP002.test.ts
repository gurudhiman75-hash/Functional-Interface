import assert from "node:assert/strict";
import { CP002_ACTIVE_AUTHORITIES, CP002_CONTEXT_AUTHORITIES, getCP002CategoryCounts } from "./CP002-authority-pool";
import { CP002_KNOWN_VALID_DISTRACTOR_QUARANTINE } from "./CP002-distractor-hardening";
import { CP002_LOANWORD_VARIANT_QUARANTINE } from "./CP002-loanword-hardening";
import { CP002_FAMILIES, getCP002BreadthReport } from "./generator";

const canonicalForms = new Set(CP002_ACTIVE_AUTHORITIES.map((x) => x.correct));
const authorityIds = new Set<string>();
const disallowedDistractors = new Set([
  ...CP002_KNOWN_VALID_DISTRACTOR_QUARANTINE,
  ...CP002_LOANWORD_VARIANT_QUARANTINE,
]);

assert.equal(CP002_ACTIVE_AUTHORITIES.length, 375, "CP002 active review corpus must contain exactly 375 authorities");
assert.equal(canonicalForms.size, CP002_ACTIVE_AUTHORITIES.length, "canonical spelling forms must be unique");
assert.equal(CP002_CONTEXT_AUTHORITIES.length, 252, "contextual families must expose all 45 original + 207 editorial contextual authorities");

for (const authority of CP002_ACTIVE_AUTHORITIES) {
  assert(!authorityIds.has(authority.id), `${authority.id}: duplicate forward-port authority id`);
  authorityIds.add(authority.id);
  assert.equal(authority.correct, authority.correct.normalize("NFC"), `${authority.id}: canonical form must be NFC`);
  assert.equal(new Set(authority.incorrect).size, 3, `${authority.id}: incorrect variants must be unique`);
  assert(!authority.incorrect.includes(authority.correct as never), `${authority.id}: canonical form leaked into incorrect variants`);
  for (const wrong of authority.incorrect) {
    assert.equal(wrong, wrong.normalize("NFC"), `${authority.id}: non-NFC incorrect variant`);
    assert(!canonicalForms.has(wrong), `${authority.id}: incorrect variant '${wrong}' is canonical elsewhere in CP002`);
    assert(
      !disallowedDistractors.has(wrong),
      `${authority.id}: valid or orthographically contested Punjabi form '${wrong}' cannot be labelled a generic spelling error`,
    );
  }
  assert(["DONOR_CP002", "DONOR_CP002_CURATED", "EDITORIAL_CURATED"].includes(authority.provenance));
  assert.equal(authority.sourceStatus, "REVIEW_PENDING");
}

for (const authority of CP002_CONTEXT_AUTHORITIES) {
  assert(authority.contextPa?.includes(authority.correct), `${authority.id}: context must contain canonical form`);
}

const categoryCounts = getCP002CategoryCounts();
assert.equal(Object.keys(categoryCounts).length, 8, "CP002 must cover eight active orthographic categories");
for (const [category, count] of Object.entries(categoryCounts)) {
  assert(count >= 30, `${category}: category is too shallow (${count})`);
}

const sampleSizes: Record<string, number> = {
  F01: 375,
  F02: 756,
  F03: 252,
  F04: 1000,
  F05: 1000,
  F06: 2000,
  F07: 1000,
};
const seenFingerprints = new Set<string>();

for (const family of CP002_FAMILIES) {
  for (const difficulty of family.targetDifficulties) {
    const local = new Set<string>();
    const sampleSize = sampleSizes[family.familyId] ?? 100;
    for (let seed = 1; seed <= sampleSize; seed++) {
      const q = family.generate(seed, difficulty);
      assert.equal(q.options.length, 4, `${q.id}: must have exactly four options`);
      assert.equal(new Set(q.options).size, 4, `${q.id}: duplicate options`);
      assert(q.correctIndex >= 0 && q.correctIndex < 4);
      assert.equal(q.metadata.lifecycle, "REVIEW_ONLY");
      assert.equal(q.metadata.subtype, family.subtype);
      assert(q.metadata.authorityIds.length >= 1);
      assert(!q.explanation.includes("ਬਾਕੀ ਵਿਕਲਪ"), `${q.id}: option-analysis filler leaked`);
      assert(!q.stem.includes("ਟਕਸਾਲੀ"), `${q.id}: unnecessary formal stem wording`);
      assert(!q.stem.includes("ਪ੍ਰਮਾਣਿਤ"), `${q.id}: unnecessary formal stem wording`);
      assert(!/^FINGERPRINT-/.test(q.metadata.fingerprint), `${q.id}: seed-only fake fingerprint`);
      assert(!local.has(q.metadata.fingerprint), `${q.id}: duplicate semantic fingerprint inside ${family.familyId}`);
      local.add(q.metadata.fingerprint);
      assert(!seenFingerprints.has(q.metadata.fingerprint), `${q.id}: cross-family duplicate semantic fingerprint`);
      seenFingerprints.add(q.metadata.fingerprint);
    }
    assert.equal(local.size, sampleSize, `${family.familyId}: sample must be semantically unique`);
  }
}

const easy = CP002_FAMILIES.find((x) => x.familyId === "F01")!.generate(7, "Easy");
const hard = CP002_FAMILIES.find((x) => x.familyId === "F04")!.generate(7, "Hard");
assert(hard.metadata.authorityIds.length > easy.metadata.authorityIds.length, "Hard must require broader semantic operation than Easy");

const breadth = getCP002BreadthReport();
assert.equal(breadth.authorityCount, 375);
assert.equal(breadth.contextualAuthorityCount, 252);
assert.equal(breadth.categoryCount, 8);
assert(breadth.capacities.F06 > 9_700_000_000, "four-word detection must exploit the 375-authority combinatorial corpus");
assert(breadth.totalSemanticCapacity > 9_730_000_000, "CP002 semantic capacity must exceed 9.73 billion content combinations");
assert.equal(breadth.quarantinedDonorCategory, "TATSAM_TADBHAV");

console.log(`CP002 forward-port semantic gates passed: ${seenFingerprints.size} generated proof questions`);
console.log(JSON.stringify(breadth, null, 2));
