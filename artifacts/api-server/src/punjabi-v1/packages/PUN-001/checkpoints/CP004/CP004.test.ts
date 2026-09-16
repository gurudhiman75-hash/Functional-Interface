import assert from "node:assert/strict";
import {
  CP004_AGREEMENT_CONTEXTS,
  CP004_GENDER_PAIRS,
  CP004_NUMBER_PAIRS,
  CP004_TRANSFORM_SAFE_GENDER_PAIRS,
} from "./CP004-authorities";
import { CP004_FAMILIES, getCP004BreadthReport } from "./generator";

assert.equal(CP004_GENDER_PAIRS.length, 26, "CP004 must expose 26 audited gender pairs");
assert.equal(CP004_NUMBER_PAIRS.length, 32, "CP004 must expose 32 audited number pairs");
assert.equal(CP004_AGREEMENT_CONTEXTS.length, 12, "CP004 must expose 12 audited agreement contexts");
assert.equal(CP004_TRANSFORM_SAFE_GENDER_PAIRS.length, 20, "CP004 must keep lexical counterparts out of rule-safe transformation pool");

const genderIds = new Set<string>();
const masculine = new Set<string>();
const feminine = new Set<string>();
for (const item of CP004_GENDER_PAIRS) {
  assert(!genderIds.has(item.id), `${item.id}: duplicate gender authority id`);
  genderIds.add(item.id);
  assert(!masculine.has(item.masculine), `${item.id}: duplicate masculine headword`);
  masculine.add(item.masculine);
  assert(!feminine.has(item.feminine), `${item.id}: duplicate feminine headword`);
  feminine.add(item.feminine);
  assert.equal(item.masculine, item.masculine.normalize("NFC"));
  assert.equal(item.feminine, item.feminine.normalize("NFC"));
  assert(!/[A-Za-z]/.test(item.masculine));
  assert(!/[A-Za-z]/.test(item.feminine));
  assert.equal(item.sourceStatus, "REVIEW_PENDING");
}

const numberIds = new Set<string>();
const singulars = new Set<string>();
const plurals = new Set<string>();
for (const item of CP004_NUMBER_PAIRS) {
  assert(!numberIds.has(item.id), `${item.id}: duplicate number authority id`);
  numberIds.add(item.id);
  assert(!singulars.has(item.singular), `${item.id}: duplicate singular headword`);
  singulars.add(item.singular);
  assert(!plurals.has(item.plural), `${item.id}: duplicate plural headword`);
  plurals.add(item.plural);
  assert.equal(item.singular, item.singular.normalize("NFC"));
  assert.equal(item.plural, item.plural.normalize("NFC"));
  assert(!/[A-Za-z]/.test(item.singular));
  assert(!/[A-Za-z]/.test(item.plural));
  assert.equal(item.sourceStatus, "REVIEW_PENDING");
}

const contextIds = new Set<string>();
const contextSentences = new Set<string>();
for (const item of CP004_AGREEMENT_CONTEXTS) {
  assert(!contextIds.has(item.id), `${item.id}: duplicate agreement context id`);
  contextIds.add(item.id);
  assert(!contextSentences.has(item.correct), `${item.id}: duplicate correct context`);
  contextSentences.add(item.correct);
  assert.equal(item.correct, item.correct.normalize("NFC"));
  assert(!/[A-Za-z]/.test(item.correct));
  assert(!/[A-Za-z]/.test(item.principlePa));
  assert.equal(item.incorrect.length, 4);
  assert.equal(new Set(item.incorrect).size, 4);
  assert(!item.incorrect.includes(item.correct));
  assert.equal(item.sourceStatus, "REVIEW_PENDING");
}

assert.equal(CP004_FAMILIES.length, 9);
const breadth = getCP004BreadthReport();
const sampleSizes: Record<string, number> = { ...breadth.capacities };
const globalFingerprints = new Set<string>();
for (const family of CP004_FAMILIES) {
  for (const difficulty of family.targetDifficulties) {
    const local = new Set<string>();
    const sampleSize = sampleSizes[family.familyId]!;
    for (let seed = 1; seed <= sampleSize; seed++) {
      const q = family.generate(seed, difficulty);
      assert.equal(q.options.length, 4, `${q.id}: expected four options`);
      assert.equal(new Set(q.options).size, 4, `${q.id}: options must be unique`);
      assert(q.correctIndex >= 0 && q.correctIndex < 4, `${q.id}: invalid correct index`);
      assert.equal(q.metadata.lifecycle, "REVIEW_ONLY");
      assert.equal(q.metadata.subtype, family.subtype);
      assert.equal(q.metadata.cpId, "PUN-001-CP004");
      assert(q.metadata.authorityIds.length >= 1);
      assert(!/[A-Za-z]/.test(q.stem), `${q.id}: English leakage in stem`);
      assert(!/[A-Za-z]/.test(q.explanation), `${q.id}: English leakage in explanation`);
      assert(!q.explanation.includes("ਬਾਕੀ ਵਿਕਲਪ"), `${q.id}: option-analysis filler leaked`);
      assert(!q.explanation.includes("ਬਾਕੀ ਤਿੰਨੇ"), `${q.id}: option-by-option explanation leaked`);
      assert(!q.stem.includes("ਸਿੱਧੇ ਅਰਥ"), `${q.id}: generic stem clutter leaked`);
      assert(!q.stem.includes("ਟਕਸਾਲੀ"), `${q.id}: unnecessary formal wording`);
      assert(!q.stem.includes("ਪ੍ਰਮਾਣਿਤ"), `${q.id}: unnecessary formal wording`);
      assert(!/^FINGERPRINT-/.test(q.metadata.fingerprint), `${q.id}: seed-only fingerprint leaked`);
      assert(!local.has(q.metadata.fingerprint), `${q.id}: duplicate semantic fingerprint inside ${family.familyId}`);
      local.add(q.metadata.fingerprint);
      assert(!globalFingerprints.has(q.metadata.fingerprint), `${q.id}: cross-family semantic fingerprint collision`);
      globalFingerprints.add(q.metadata.fingerprint);
    }
    assert.equal(local.size, sampleSize, `${family.familyId}: semantic sample must be unique`);
  }
}

const f01 = CP004_FAMILIES.find((x) => x.familyId === "F01")!;
for (let seed = 1; seed <= breadth.capacities.F01; seed++) {
  const q = f01.generate(seed, "Easy");
  assert(q.metadata.authorityIds.every((id) => CP004_TRANSFORM_SAFE_GENDER_PAIRS.some((x) => x.id === id)), `${q.id}: lexical-only counterpart leaked into transformation family`);
  const allMasculine = q.options.every((option) => masculine.has(option));
  const allFeminine = q.options.every((option) => feminine.has(option));
  assert(allMasculine || allFeminine, `${q.id}: fabricated gender form leaked into direct options`);
}

const f04 = CP004_FAMILIES.find((x) => x.familyId === "F04")!;
for (let seed = 1; seed <= breadth.capacities.F04; seed++) {
  const q = f04.generate(seed, "Easy");
  assert(q.options.every((option) => plurals.has(option)), `${q.id}: non-canonical plural leaked into direct options`);
}

const f05 = CP004_FAMILIES.find((x) => x.familyId === "F05")!;
for (let seed = 1; seed <= breadth.capacities.F05; seed++) {
  const q = f05.generate(seed, "Easy");
  assert(q.options.every((option) => singulars.has(option)), `${q.id}: non-canonical singular leaked into direct options`);
}

const easy = CP004_FAMILIES.find((x) => x.familyId === "F01")!.generate(1, "Easy");
const hard = CP004_FAMILIES.find((x) => x.familyId === "F09")!.generate(1, "Hard");
assert(hard.metadata.authorityIds.length > easy.metadata.authorityIds.length, "Hard CP004 operation must require more semantic decisions than Easy");

assert.equal(breadth.genderAuthorityCount, 26);
assert.equal(breadth.transformSafeGenderCount, 20);
assert.equal(breadth.numberAuthorityCount, 32);
assert.equal(breadth.agreementContextCount, 12);
assert.equal(breadth.totalAtomicAuthorities, 70);
assert.equal(breadth.familyCount, 9);
assert.equal(breadth.capacities.F01, 40);
assert.equal(breadth.capacities.F03, 650);
assert.equal(breadth.capacities.F09, 528);
assert.equal(breadth.totalSemanticCapacity, 1400);

console.log(`CP004 exhaustive semantic gates passed: ${globalFingerprints.size} generated proof questions`);
console.log(JSON.stringify(breadth, null, 2));
