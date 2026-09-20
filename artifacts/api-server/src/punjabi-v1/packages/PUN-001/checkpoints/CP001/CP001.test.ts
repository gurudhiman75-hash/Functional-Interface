import assert from "node:assert/strict";
import {
  CP001_ARTICULATION,
  CP001_DUTT,
  CP001_GROUPS,
  CP001_LAGAKHARS,
  CP001_LAGAAN,
  CP001_LETTERS,
  CP001_SYSTEM_AUTHORITY_COUNT,
} from "./CP001-authorities";
import { CP001_DUTT_WORDS, CP001_LAGAKHAR_WORDS, CP001_LAGA_WORDS, CP001_WORD_AUTHORITIES } from "./CP001-word-corpus";
import { CP001_FAMILIES, getCP001BreadthReport } from "./generator";

assert.equal(CP001_LETTERS.length, 41, "35 basic + 6 supplementary letters required");
assert.equal(CP001_GROUPS.length, 8);
assert.equal(CP001_ARTICULATION.length, 25);
assert.equal(CP001_LAGAAN.length, 10);
assert.equal(CP001_LAGAKHARS.length, 3);
assert.equal(CP001_DUTT.length, 3);
assert.equal(CP001_SYSTEM_AUTHORITY_COUNT, 100);
assert.equal(CP001_WORD_AUTHORITIES.length, 125);
assert.equal(CP001_LAGA_WORDS.length, 80);
assert.equal(CP001_LAGAKHAR_WORDS.length, 30);
assert.equal(CP001_DUTT_WORDS.length, 15);

const letterIds = new Set(CP001_LETTERS.map((x) => x.id));
const letters = new Set(CP001_LETTERS.map((x) => x.letter));
assert.equal(letterIds.size, 41);
assert.equal(letters.size, 41);
assert.deepEqual(CP001_LETTERS.slice(0, 3).map((x) => x.letter), ["ੳ", "ਅ", "ੲ"]);
assert.equal(CP001_LETTERS.filter((x) => x.class === "VOWEL_CARRIER").length, 3);
assert.equal(CP001_LETTERS.filter((x) => x.class === "SUPPLEMENTARY_CONSONANT").length, 6);

assert.deepEqual(CP001_ARTICULATION.filter((x) => x.isNasal).map((x) => x.letter), ["ਙ", "ਞ", "ਣ", "ਨ", "ਮ"]);
assert.deepEqual(CP001_LAGAAN.map((x) => x.independentVowel), ["ਅ", "ਆ", "ਇ", "ਈ", "ਉ", "ਊ", "ਏ", "ਐ", "ਓ", "ਔ"]);
assert.deepEqual(CP001_LAGAAN.filter((x) => x.carrier === "ੳ").map((x) => x.namePa), ["ਔਂਕੜ", "ਦੁਲੈਂਕੜ", "ਹੋੜਾ"]);
assert.deepEqual(CP001_LAGAAN.filter((x) => x.carrier === "ੲ").map((x) => x.namePa), ["ਸਿਹਾਰੀ", "ਬਿਹਾਰੀ", "ਲਾਂ"]);
assert.deepEqual(CP001_LAGAAN.filter((x) => x.carrier === "ਅ").map((x) => x.namePa), ["ਮੁਕਤਾ", "ਕੰਨਾ", "ਦੁਲਾਵਾਂ", "ਕਨੌੜਾ"]);
assert.equal(CP001_LAGAKHARS.find((x) => x.namePa === "ਬਿੰਦੀ")!.allowedLagaPa.length, 6);
assert.equal(CP001_LAGAKHARS.find((x) => x.namePa === "ਟਿੱਪੀ")!.allowedLagaPa.length, 4);
assert.equal(CP001_LAGAKHARS.find((x) => x.namePa === "ਅੱਧਕ")!.allowedLagaPa.length, 3);

// Modern pairin haha is a subjoined ਹ sequence, not U+0A75 Yakash.
assert.equal(CP001_DUTT.find((x) => x.id === "DUT-01")!.symbol, "੍ਹ");
assert(!CP001_DUTT.some((x) => x.symbol === "ੵ"), "Yakash must not be mislabeled as modern pairin haha");

const wordIds = new Set<string>();
const words = new Set<string>();
for (const authority of CP001_WORD_AUTHORITIES) {
  assert(!wordIds.has(authority.id), `${authority.id}: duplicate word authority id`);
  wordIds.add(authority.id);
  assert(!words.has(authority.word), `${authority.id}: duplicate word '${authority.word}'`);
  words.add(authority.word);
  assert.equal(authority.word, authority.word.normalize("NFC"), `${authority.id}: word must be NFC`);
  assert.equal(authority.sourceStatus, "REVIEW_PENDING");
  if (authority.kind === "LAGA" && authority.targetNamePa !== "ਮੁਕਤਾ") {
    assert(
      authority.word.includes(authority.targetSymbol) || authority.word.startsWith(CP001_LAGAAN.find((x) => x.namePa === authority.targetNamePa)!.independentVowel),
      `${authority.id}: laga evidence missing from word`,
    );
  }
  if (authority.kind === "LAGAKHAR") assert(authority.word.includes(authority.targetSymbol), `${authority.id}: lagakhar symbol missing`);
}

const sampleSizes: Record<string, number> = {
  F01: 68,
  F02: 41,
  F03: 25,
  F04: 10,
  F05: 30,
  F06: 80,
  F07: 13,
  F08: 30,
  F09: 15,
  F10: 500,
  F11: 2000,
  F12: 1500,
};

const globalFingerprints = new Set<string>();
for (const family of CP001_FAMILIES) {
  for (const difficulty of family.targetDifficulties) {
    const local = new Set<string>();
    const size = sampleSizes[family.familyId]!;
    for (let seed = 1; seed <= size; seed++) {
      const q = family.generate(seed, difficulty);
      assert.equal(q.options.length, 4, `${q.id}: exactly four options required`);
      assert.equal(new Set(q.options).size, 4, `${q.id}: options must be unique`);
      assert(q.correctIndex >= 0 && q.correctIndex < 4);
      assert.equal(q.metadata.lifecycle, "REVIEW_ONLY");
      assert.equal(q.metadata.subtype, family.subtype);
      assert.equal(q.metadata.language, "pa-Guru");
      assert(!/^FINGERPRINT-/.test(q.metadata.fingerprint), `${q.id}: seed-only fingerprint forbidden`);
      assert(!/[A-Za-z]/.test(q.stem), `${q.id}: English leakage in stem`);
      assert(!/[A-Za-z]/.test(q.explanation), `${q.id}: English leakage in explanation`);
      assert(!q.explanation.includes("ਬਾਕੀ ਵਿਕਲਪ"), `${q.id}: option-by-option filler forbidden`);
      assert(!q.stem.includes("ਟਕਸਾਲੀ") && !q.stem.includes("ਪ੍ਰਮਾਣਿਤ"), `${q.id}: formal stem padding forbidden`);
      assert(!local.has(q.metadata.fingerprint), `${q.id}: duplicate fingerprint within ${family.familyId}`);
      local.add(q.metadata.fingerprint);
      assert(!globalFingerprints.has(q.metadata.fingerprint), `${q.id}: cross-family fingerprint collision`);
      globalFingerprints.add(q.metadata.fingerprint);
    }
    assert.equal(local.size, size, `${family.familyId}: semantic sample must be unique`);
  }
}

const breadth = getCP001BreadthReport();
assert.equal(breadth.systemAuthorityCount, 100);
assert.equal(breadth.wordAuthorityCount, 125);
assert.equal(breadth.totalAtomicAuthorities, 225);
assert.equal(breadth.basicLetterCount, 35);
assert.equal(breadth.supplementaryLetterCount, 6);
assert.equal(breadth.vowelCarrierCount, 3);
assert.equal(breadth.lagaCount, 10);
assert.equal(breadth.lagakharCount, 3);
assert.equal(breadth.duttCount, 3);
assert.equal(breadth.familyCount, 12);
assert(breadth.capacities.F11 > 9_600_000);
assert(breadth.totalSemanticCapacity > 9_700_000);

console.log(`CP001 exhaustive semantic gates passed: ${globalFingerprints.size} generated proof questions`);
console.log(JSON.stringify(breadth, null, 2));
