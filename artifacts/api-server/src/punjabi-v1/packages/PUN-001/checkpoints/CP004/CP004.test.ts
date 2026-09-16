import { CP004_FAMILIES } from "./generator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(CP004_FAMILIES.length === 9, `Expected 9 CP004 families, got ${CP004_FAMILIES.length}`);

for (const family of CP004_FAMILIES) {
  assert(family.targetDifficulties.length === 1, `${family.familyId}: expected one review difficulty`);
  const difficulty = family.targetDifficulties[0]!;
  const fingerprints = new Set<string>();
  for (let seed = 1; seed <= 80; seed++) {
    const q = family.generate(seed, difficulty);
    assert(q.metadata.cpId === "PUN-001-CP004", `${family.familyId}: wrong cpId`);
    assert(q.metadata.familyId === family.familyId, `${family.familyId}: wrong metadata family`);
    assert(q.metadata.lifecycle === "REVIEW_ONLY", `${family.familyId}: lifecycle must remain review-only`);
    assert(q.metadata.language === "pa-Guru", `${family.familyId}: wrong language`);
    assert(q.metadata.authorityIds.length > 0, `${family.familyId}: missing authority provenance`);
    assert(q.options.length === 4, `${family.familyId}: expected four options`);
    assert(new Set(q.options).size === 4, `${family.familyId}: duplicate options`);
    assert(q.correctIndex >= 0 && q.correctIndex < 4, `${family.familyId}: invalid correct index`);
    assert(q.options[q.correctIndex] !== undefined, `${family.familyId}: missing correct option`);
    assert(q.stem.trim().length > 0, `${family.familyId}: blank stem`);
    assert(q.explanation.trim().length > 0, `${family.familyId}: blank explanation`);
    assert(!/[A-Za-z]{4,}/.test(q.stem), `${family.familyId}: English leakage in stem: ${q.stem}`);
    fingerprints.add(q.metadata.fingerprint);
  }
  assert(fingerprints.size >= 4, `${family.familyId}: insufficient semantic variety (${fingerprints.size})`);
}

console.log(`CP004 semantic proof passed: ${CP004_FAMILIES.length} families × 80 seeds`);
