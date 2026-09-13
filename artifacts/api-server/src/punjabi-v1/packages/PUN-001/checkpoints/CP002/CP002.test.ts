import assert from "node:assert/strict";
import { CP002_AUTHORITIES } from "./CP002-authorities";
import { CP002_FAMILIES } from "./generator";

const seenFingerprints = new Set<string>();

for (const authority of CP002_AUTHORITIES) {
  assert.equal(authority.correct, authority.correct.normalize("NFC"));
  assert.equal(new Set(authority.incorrect).size, 3);
  assert(!authority.incorrect.includes(authority.correct as never));
  assert(authority.contextPa.includes(authority.correct), `${authority.id}: context must contain correct form`);
  assert.equal(authority.sourceStatus, "REVIEW_PENDING");
}

for (const family of CP002_FAMILIES) {
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
      assert(!seenFingerprints.has(q.metadata.fingerprint), `${q.id}: duplicate semantic fingerprint`);
      seenFingerprints.add(q.metadata.fingerprint);
    }
  }
}

const easy = CP002_FAMILIES.find((x) => x.familyId === "F01")!.generate(7, "Easy");
const hard = CP002_FAMILIES.find((x) => x.familyId === "F04")!.generate(7, "Hard");
assert(hard.metadata.authorityIds.length > easy.metadata.authorityIds.length, "Hard must require broader semantic operation than Easy");
assert(hard.stem.length > easy.stem.length, "Hard should contain actual multi-context work");

console.log(`CP002 forward-port semantic gates passed: ${seenFingerprints.size} generated questions`);
