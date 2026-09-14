import assert from "node:assert/strict";
import { CP003_NOUN_AUTHORITIES } from "./CP003-noun-corpus";
import { CP003_PRONOUN_CONTEXTS } from "./CP003-pronoun-corpus";
import { CP003_NOUN_DEFINITIONS, CP003_PRONOUN_DEFINITIONS, CP003_PRONOUN_INFLECTION_AUTHORITY_COUNT, CP003_PRONOUN_PARADIGMS } from "./CP003-authorities";
import { CP003_FAMILIES, getCP003BreadthReport } from "./generator";

assert.equal(CP003_NOUN_AUTHORITIES.length, 225, "CP003 must expose 225 noun authorities");
assert.equal(CP003_PRONOUN_CONTEXTS.length, 60, "CP003 must expose 60 contextual pronoun authorities");
assert.equal(CP003_PRONOUN_INFLECTION_AUTHORITY_COUNT, 40, "CP003 must expose 40 pronoun-inflection relations");
assert.equal(CP003_NOUN_DEFINITIONS.length, 5, "Punjabi noun taxonomy must use five semantic noun classes");
assert.equal(CP003_PRONOUN_DEFINITIONS.length, 6, "CP003 must cover six pronoun classes");
assert.equal(CP003_PRONOUN_PARADIGMS.length, 8, "CP003 must cover eight core inflection paradigms");

const nounIds = new Set<string>();
const nounWords = new Set<string>();
const nounCounts = new Map<string, number>();
for (const item of CP003_NOUN_AUTHORITIES) {
  assert(!nounIds.has(item.id), `${item.id}: duplicate noun authority id`);
  nounIds.add(item.id);
  assert(!nounWords.has(item.word), `${item.word}: duplicate noun authority word`);
  nounWords.add(item.word);
  assert.equal(item.word, item.word.normalize("NFC"), `${item.id}: noun must be NFC`);
  assert(!/[A-Za-z]/.test(item.word), `${item.id}: English leakage in noun authority`);
  assert.equal(item.sourceStatus, "REVIEW_PENDING");
  nounCounts.set(item.category, (nounCounts.get(item.category) ?? 0) + 1);
}
assert.deepEqual([...nounCounts.values()].sort((a, b) => a - b), [45, 45, 45, 45, 45]);
assert(!nounCounts.has("DRAVMAN"), "duplicate donor material-noun category must remain rejected");
assert(!nounCounts.has("MISHRAT"), "word-formation category must not be mixed into semantic noun types");
for (const ambiguousCollective of ["ਦਰਬਾਰ", "ਬੈਂਡ", "ਪੱਖ", "ਪਾਰਟੀ", "ਕੌਂਸਲ", "ਬੋਰਡ"]) {
  assert(!CP003_NOUN_AUTHORITIES.some((x) => x.category === "IKATH" && x.word === ambiguousCollective), `${ambiguousCollective}: context-sensitive noun must not be forced into isolated collective classification`);
}

const pronounIds = new Set<string>();
const pronounSentences = new Set<string>();
const pronounCounts = new Map<string, number>();
const rejectedAdverbialTargets = new Set(["ਕਿੱਥੋਂ", "ਕਦੋਂ", "ਕਿਵੇਂ"]);
for (const item of CP003_PRONOUN_CONTEXTS) {
  assert(!pronounIds.has(item.id), `${item.id}: duplicate pronoun authority id`);
  pronounIds.add(item.id);
  assert(!pronounSentences.has(item.sentence), `${item.id}: duplicate pronoun sentence`);
  pronounSentences.add(item.sentence);
  assert(item.sentence.includes(item.target), `${item.id}: sentence must contain target pronoun`);
  assert.equal(item.sentence, item.sentence.normalize("NFC"), `${item.id}: sentence must be NFC`);
  assert(!/[A-Za-z]/.test(item.sentence), `${item.id}: English leakage in pronoun context`);
  assert(!rejectedAdverbialTargets.has(item.target), `${item.id}: adverbial interrogative leaked into pronoun target corpus`);
  assert.equal(item.sourceStatus, "REVIEW_PENDING");
  pronounCounts.set(item.category, (pronounCounts.get(item.category) ?? 0) + 1);
}
assert.deepEqual([...pronounCounts.values()].sort((a, b) => a - b), [10, 10, 10, 10, 10, 10]);

for (const paradigm of CP003_PRONOUN_PARADIGMS) {
  assert.equal(paradigm.labelPa, paradigm.labelPa.normalize("NFC"));
  assert(!/[A-Za-z]/.test(paradigm.labelPa));
  assert.equal(paradigm.sourceStatus, "REVIEW_PENDING");
  for (const form of Object.values(paradigm.forms)) {
    assert.equal(form, form.normalize("NFC"), `${paradigm.id}: non-NFC pronoun form`);
    assert(!/[A-Za-z]/.test(form), `${paradigm.id}: English leakage in pronoun form`);
  }
}

assert.equal(CP003_FAMILIES.length, 12);
const sampleSizes: Record<string, number> = {
  F01: 225, F02: 60, F03: 4, F04: 225, F05: 1000, F06: 60,
  F07: 40, F08: 32, F09: 1000, F10: 1000, F11: 1000, F12: 1000,
};
const globalFingerprints = new Set<string>();
for (const family of CP003_FAMILIES) {
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
      assert.equal(q.metadata.cpId, "PUN-001-CP003");
      assert(q.metadata.authorityIds.length >= 1);
      assert(!/[A-Za-z]/.test(q.stem), `${q.id}: English leakage in stem`);
      assert(!/[A-Za-z]/.test(q.explanation), `${q.id}: English leakage in explanation`);
      assert(!q.explanation.includes("ਬਾਕੀ ਵਿਕਲਪ"), `${q.id}: option-analysis filler leaked`);
      assert(!q.explanation.includes("ਬਾਕੀ ਤਿੰਨੇ"), `${q.id}: option-by-option explanation analysis leaked`);
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

const f03 = CP003_FAMILIES.find((x) => x.familyId === "F03")!;
const f03Ids = new Set<string>();
for (let seed = 1; seed <= 4; seed++) for (const id of f03.generate(seed, "Easy").metadata.authorityIds) f03Ids.add(id);
assert.deepEqual([...f03Ids].sort(), ["PAR-01", "PAR-02", "PAR-03", "PAR-04"], "bare third-person ਇਹ/ਉਹ must not be used for singular/plural person-number questions");

const easy = CP003_FAMILIES.find((x) => x.familyId === "F01")!.generate(7, "Easy");
const hard = CP003_FAMILIES.find((x) => x.familyId === "F12")!.generate(7, "Hard");
assert(hard.metadata.authorityIds.length > easy.metadata.authorityIds.length, "Hard CP003 operation must require more semantic decisions than Easy");

const breadth = getCP003BreadthReport();
assert.equal(breadth.nounAuthorityCount, 225);
assert.equal(breadth.pronounContextAuthorityCount, 60);
assert.equal(breadth.pronounInflectionAuthorityCount, 40);
assert.equal(breadth.totalAtomicAuthorities, 325);
assert.equal(breadth.nounCategoryCount, 5);
assert.equal(breadth.pronounCategoryCount, 6);
assert.equal(breadth.familyCount, 12);
assert.equal(breadth.capacities.F03, 4);
assert.equal(breadth.totalSemanticCapacity, 13_702_846);

console.log(`CP003 exhaustive semantic gates passed: ${globalFingerprints.size} generated proof questions`);
console.log(JSON.stringify(breadth, null, 2));