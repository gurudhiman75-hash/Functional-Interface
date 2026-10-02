import assert from "node:assert/strict";

import { ALGEBRA_QUESTION_STUDIO_PATTERNS } from "../algebra-question-studio-runtime-v1";
import {
  generateAlgPermanentEnglishV4ChapterReview,
  isAlgEnglishV4TargetPrototype,
} from "../permanent/english-review-v4-chapter";
import {
  ALG_MULTILINGUAL_V3_CHAPTER_REVIEW_AUTHORITY,
  generateAlgPermanentMultilingualV3ChapterReview,
} from "../permanent/multilingual-review-v3-chapter";

const locales = ["hi-IN", "pa-IN"] as const;
let targeted = 0;
let untouched = 0;
let samples = 0;

for (const pattern of ALGEBRA_QUESTION_STUDIO_PATTERNS) {
  for (let seed = 1; seed <= 8; seed += 1) {
    const english = generateAlgPermanentEnglishV4ChapterReview(pattern.qlId, seed, pattern.variantIndex);

    for (const locale of locales) {
      const localized = generateAlgPermanentMultilingualV3ChapterReview(pattern.qlId, seed, locale, pattern.variantIndex);
      samples += 1;

      assert.equal(localized.chapterReviewAuthority, ALG_MULTILINGUAL_V3_CHAPTER_REVIEW_AUTHORITY);
      assert.equal(localized.qlId, english.qlId);
      assert.equal(localized.prototypeId, english.prototypeId);
      assert.equal(localized.packageId, english.packageId);
      assert.equal(localized.cpId, english.cpId);
      assert.equal(localized.active, false);
      assert.equal(localized.questionStudioDiscoverable, false);
      assert.equal(localized.questionBankWritable, false);
      assert.equal(localized.testEligible, false);
      assert.equal(localized.publiclyPublishable, false);
      assert.ok(localized.question.trim().length >= 8);
      assert.ok(localized.explanation.trim().length >= 20);

      if (isAlgEnglishV4TargetPrototype(pattern.prototypeId)) {
        targeted += 1;
        assert.equal(localized.chapterReviewCandidate, true);
        assert.equal(localized.chapterReviewSource, "V4_ENGLISH_TO_V3_MULTILINGUAL_DRAFT");
        assert.equal(localized.multilingualImplementationFrozen, false);
        assert.equal(localized.reviewStatus, "HUMAN_LOCALIZATION_REVIEW_REQUIRED");
        assert.deepEqual(localized.canonicalAnswer, english.canonicalAnswer, `${pattern.prototypeId}/${locale}/${seed}: canonical answer diverged from English V4`);
        if (locale === "hi-IN") assert.match(localized.question + localized.explanation, /[\u0900-\u097F]/u);
        else assert.match(localized.question + localized.explanation, /[\u0A00-\u0A7F]/u);
        const learnerText = `${localized.question} ${localized.explanation}`;
        assert.doesNotMatch(
          learnerText,
          /\b(?:find|given|determine|calculate|solve|therefore|hence|minimum|maximum|least|statement|equation|compare|value|relation|satisfies|factorise|factorization|defined|domain|solution|roots?|both|every|possible)\b/i,
          `${pattern.prototypeId}/${locale}/${seed}: residual English learner prose leaked`,
        );
      } else {
        untouched += 1;
        assert.equal(localized.chapterReviewCandidate, false);
        assert.equal(localized.chapterReviewSource, "V2_FROZEN_UNCHANGED");
      }
    }
  }
}

assert.equal(targeted, 31 * 8 * 2);
assert.equal(untouched, (109 - 31) * 8 * 2);
assert.equal(samples, 109 * 8 * 2);

console.log("PASS_ALGEBRA_MULTILINGUAL_V3_CHAPTER_REVIEW", {
  authority: ALG_MULTILINGUAL_V3_CHAPTER_REVIEW_AUTHORITY,
  patterns: 109,
  targetedPatterns: 31,
  untouchedPatterns: 78,
  locales,
  samples,
});
