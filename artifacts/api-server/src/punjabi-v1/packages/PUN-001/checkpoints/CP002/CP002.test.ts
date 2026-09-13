import assert from "node:assert/strict";
import { CP002_AUTHORITIES } from "./CP002-authorities";
import { CP002_FAMILIES } from "./generator";

assert(CP002_AUTHORITIES.length >= 45, "CP002 review corpus must contain at least 45 authorities");
assert.equal(new Set(CP002_AUTHORITIES.map((x) => x.correct)).size, CP002_AUTHORITIES.length, "correct spellings must be unique");
assert(new Set(CP002_AUTHORITIES.map((x) => x.category)).size >= 6, "review corpus must cover all major spelling-confusion categories");

for (const authority of CP002_AUTHORITIES) {
  assert.equal(authority.correct, authority.correct.normalize("NFC"));
  assert.equal(new Set(authority.incorrect).size, 3, `${authority.id}: incorrect variants must be distinct`);
  assert(!authority.incorrect.includes(authority.correct as never), `${authority.id}: correct form leaked into incorrect variants`);
  assert(authority.contextPa.includes(authority.correct), `${authority.id}: context must contain correct form`);
  assert.equal(authority.provenance, "DONOR_CP002");
  assert.equal(authority.sourceStatus, "REVIEW_PENDING");
}

const seenFingerprints = new Set<string>();
for (const family of CP002_FAMILIES) {
  const familyFingerprints = new Set<string>();
  for (const difficulty of family.targetDifficulties) {
    for (let seed = 1; seed <= 40; seed++) {
      const q = family.generate(seed, difficulty);
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options).size, 4, `${q.id}: duplicate options`);
      assert(q.correctIndex >= 0 && q.correctIndex < 4);
      assert.equal(q.metadata.lifecycle, "REVIEW_ONLY");
      assert.equal(q.metadata.subtype, family.subtype);
      assert(q.metadata.authorityIds.length >= 1);
      assert(!q.explanation.includes("ਬਾਕੀ ਵਿਕਲਪ"), `${q.id}: option-analysis filler leaked`);
      assert(!q.stem.includes("ਟਕਸਾਲੀ"), `${q.id}: unnecessary formal stem wording`);
      assert(!q.stem.includes("ਪ੍ਰਮਾਣਿਤ"), `${q.id}: unnecessary formal stem wording`);
      assert(!/^FINGERPRINT-/.test(q.metadata.fingerprint), `${q.id}: seed-only fake fingerprint`);
      assert(!familyFingerprints.has(q.metadata.fingerprint), `${q.id}: duplicate semantic fingerprint inside family`);
      assert(!seenFingerprints.has(q.metadata.fingerprint), `${q.id}: duplicate semantic fingerprint across review sample`);
      familyFingerprints.add(q.metadata.fingerprint);
      seenFingerprints.add(q.metadata.fingerprint);
    }
  }
}

const f01 = CP002_FAMILIES.find((x) => x.familyId === "F01")!;
assert.deepEqual(f01.targetDifficulties, ["Easy"], "direct recognition must not be relabelled Medium");

const easy = f01.generate(7, "Easy");
const medium = CP002_FAMILIES.find((x) => x.familyId === "F02")!.generate(7, "Medium");
const hard = CP002_FAMILIES.find((x) => x.familyId === "F04")!.generate(7, "Hard");
assert(medium.stem.includes("“"), "Medium must require sentence/context resolution");
assert(hard.metadata.authorityIds.length > easy.metadata.authorityIds.length, "Hard must require broader semantic operation than Easy");
assert.equal(hard.metadata.authorityIds.length, 2, "Hard multi-error repair must resolve two authorities");
assert(hard.stem.length > medium.stem.length, "Hard should contain actual multi-context work");

console.log(`CP002 forward-port semantic gates passed: ${CP002_AUTHORITIES.length} authorities, ${seenFingerprints.size} unique generated questions`);
