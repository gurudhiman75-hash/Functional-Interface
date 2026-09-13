import assert from "node:assert/strict";
import {
  assertNoNormalizationCollisions,
  assertPunjabiDisplayText,
  hasSubjoinedLetter,
  normalizePunjabiText,
  splitGurmukhiGraphemes,
} from "../../../../../foundation/unicode/gurmukhi";
import {
  CARRIER_AUTHORITIES,
  LAGA_AUTHORITIES,
  LAGAKHAR_AUTHORITIES,
  NAVEEN_LETTERS,
  SUBJOINED_AUTHORITIES,
  TRADITIONAL_GURMUKHI_ORDER,
  VARG_AUTHORITIES,
  WORD_ORTHOGRAPHY_AUTHORITIES,
} from "./authorities";
import {
  CP001_FAMILIES,
  generateCP001,
  generateCP001ByFamily,
} from "./generator";

function assertThrowsWith(value: () => unknown, fragment: string): void {
  assert.throws(value, (error: unknown) => error instanceof Error && error.message.includes(fragment));
}

function unicodeFoundationContract(): void {
  assert.equal(normalizePunjabiText("ਖ\u0A3C"), "ਖ\u0A3C".normalize("NFC"));
  assertThrowsWith(() => normalizePunjabiText("ਪੰ\u200Bਜਾਬ"), "forbidden invisible");
  assertThrowsWith(() => assertPunjabiDisplayText("Punjabi ਪੰਜਾਬੀ"), "non-Punjabi script");
  assert.equal(assertPunjabiDisplayText("ਪੰਜਾਬੀ").normalized, "ਪੰਜਾਬੀ");

  const clusters = splitGurmukhiGraphemes("ਪ੍ਰਸ਼ਨ");
  assert.ok(clusters.length >= 2, "grapheme segmentation should return clusters, not UTF-16 units");
  assert.ok(clusters.some((cluster) => cluster.includes("੍ਰ")), "pairin rara must stay attached to its grapheme context");

  assert.equal(hasSubjoinedLetter("ਹ", "ਹ"), false, "base ਹ must not be classified as pairin ਹ");
  assert.equal(hasSubjoinedLetter("ਰ", "ਰ"), false, "base ਰ must not be classified as pairin ਰ");
  assert.equal(hasSubjoinedLetter("ਵ", "ਵ"), false, "base ਵ must not be classified as pairin ਵ");
  assert.equal(hasSubjoinedLetter("ੜ੍ਹ", "ਹ"), true);
  assert.equal(hasSubjoinedLetter("ਪ੍ਰ", "ਰ"), true);
  assert.equal(hasSubjoinedLetter("ਸ੍ਵ", "ਵ"), true);

  assertThrowsWith(
    () => assertNoNormalizationCollisions(["ਖ਼", "ਖ\u0A3C"], "nukta forms"),
    "normalization collision",
  );
}

function authorityContract(): void {
  assert.equal(TRADITIONAL_GURMUKHI_ORDER.length, 35);
  assert.equal(new Set(TRADITIONAL_GURMUKHI_ORDER).size, 35);
  assert.equal(NAVEEN_LETTERS.length, 6);
  assert.equal(VARG_AUTHORITIES.length, 5);
  assert.equal(LAGA_AUTHORITIES.length, 9);
  assert.equal(CARRIER_AUTHORITIES.length, 9);
  assert.equal(LAGAKHAR_AUTHORITIES.length, 3);

  for (const varg of VARG_AUTHORITIES) {
    assert.equal(varg.letters.length, 5);
    assert.ok(varg.letters.includes(varg.nasal), `${varg.id} nasal must belong to its own varg`);
  }

  for (const authority of SUBJOINED_AUTHORITIES) {
    assert.ok(authority.word.includes(authority.visibleSegment), `${authority.id} segment must occur in word`);
    assert.equal(hasSubjoinedLetter(authority.visibleSegment, authority.subjoinedLetter), true, `${authority.id} must prove contextual subjoined use`);
  }

  for (const authority of WORD_ORTHOGRAPHY_AUTHORITIES) {
    assert.ok(authority.word.includes(authority.focus), `${authority.id} focus must occur in word`);
    assertPunjabiDisplayText(authority.explanationPa);
  }

  assertNoNormalizationCollisions(TRADITIONAL_GURMUKHI_ORDER, "traditional alphabet");
  assertNoNormalizationCollisions(NAVEEN_LETTERS, "naveen letters");
  assertNoNormalizationCollisions(LAGA_AUTHORITIES.map((item) => item.symbol), "laga symbols");
}

function generatedQuestionContract(): void {
  assert.equal(CP001_FAMILIES.length, 10, "CP001 must expose narrow semantic families");

  for (const family of CP001_FAMILIES) {
    for (const difficulty of family.allowedDifficulties) {
      for (let seed = 1; seed <= 12; seed += 1) {
        const question = generateCP001ByFamily(family.familyId, seed, difficulty);
        assert.equal(question.metadata.familyId, family.familyId);
        assert.equal(question.metadata.subtype, family.subtype);
        assert.equal(question.metadata.lifecycle, "REVIEW_ONLY");
        assert.equal(question.options.length, 4);
        assert.equal(new Set(question.options.map((option) => option.normalize("NFC"))).size, 4);
        assert.ok(question.metadata.authorityIds.length > 0);
        assert.match(question.metadata.semanticFingerprint, /^PUN-[0-9a-f]{8}$/);
        assert.doesNotMatch(question.metadata.semanticFingerprint, /seed/i);
        assert.doesNotMatch(question.stem, /[A-Za-z]/, "ordinary CP001 stems must not leak English");
        assert.doesNotMatch(question.explanation, /[A-Za-z]/, "ordinary CP001 explanations must not leak English");
        assert.doesNotMatch(question.stem, /ਨਹੀਂ|ਨਹੀ/, "difficulty must not be created with negative wording");
      }
    }
  }

  for (const difficulty of ["easy", "medium", "hard"] as const) {
    const seenFamilies = new Set<string>();
    for (let seed = 1; seed <= 180; seed += 1) {
      const first = generateCP001(seed, difficulty);
      const replay = generateCP001(seed, difficulty);
      assert.deepEqual(first, replay, `seed replay failed for ${difficulty}/${seed}`);
      seenFamilies.add(first.metadata.familyId);
    }
    const eligibleCount = CP001_FAMILIES.filter((family) => family.allowedDifficulties.includes(difficulty)).length;
    assert.equal(seenFamilies.size, eligibleCount, `${difficulty} scheduler must reach every eligible semantic family`);
  }

  const fingerprintsBySemanticAuthority = new Map<string, string>();
  for (let seed = 1; seed <= 300; seed += 1) {
    const question = generateCP001ByFamily("F03", seed, "medium");
    const key = `${question.metadata.authorityIds.join("|")}:${question.stem}`;
    const prior = fingerprintsBySemanticAuthority.get(key);
    if (prior) {
      assert.equal(prior, question.metadata.semanticFingerprint, "fingerprint must follow semantic content, not seed");
    } else {
      fingerprintsBySemanticAuthority.set(key, question.metadata.semanticFingerprint);
    }
  }
}

unicodeFoundationContract();
authorityContract();
generatedQuestionContract();
console.log("PUN-001 CP001 forward-port contracts: PASS");
