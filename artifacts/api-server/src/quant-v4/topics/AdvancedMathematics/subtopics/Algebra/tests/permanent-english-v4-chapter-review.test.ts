import assert from "node:assert/strict";

import { ALGEBRA_QUESTION_STUDIO_PATTERNS } from "../algebra-question-studio-runtime-v1";
import { generateAlgPermanentEnglishV3Frozen } from "../permanent/english-freeze-v3";
import {
  ALG_ENGLISH_V4_CHAPTER_REVIEW_AUTHORITY,
  ALG_ENGLISH_V4_CHAPTER_TARGET_COUNT,
  generateAlgPermanentEnglishV4ChapterReview,
  isAlgEnglishV4TargetPrototype,
} from "../permanent/english-review-v4-chapter";

assert.equal(ALGEBRA_QUESTION_STUDIO_PATTERNS.length, 109);
assert.equal(ALG_ENGLISH_V4_CHAPTER_TARGET_COUNT, 31);

let targeted = 0;
let untouched = 0;
let samples = 0;

for (const pattern of ALGEBRA_QUESTION_STUDIO_PATTERNS) {
  for (let seed = 1; seed <= 12; seed += 1) {
    const baseline = generateAlgPermanentEnglishV3Frozen(pattern.qlId, seed, pattern.variantIndex);
    const review = generateAlgPermanentEnglishV4ChapterReview(pattern.qlId, seed, pattern.variantIndex);
    samples += 1;

    assert.equal(review.chapterReviewAuthority, ALG_ENGLISH_V4_CHAPTER_REVIEW_AUTHORITY);
    assert.equal(review.qlId, baseline.qlId, `${pattern.prototypeId}/${seed}: QL identity drifted`);
    assert.equal(review.prototypeId, baseline.prototypeId, `${pattern.prototypeId}/${seed}: prototype identity drifted`);
    assert.equal(review.packageId, baseline.packageId, `${pattern.prototypeId}/${seed}: package drifted`);
    assert.equal(review.cpId, baseline.cpId, `${pattern.prototypeId}/${seed}: CP drifted`);
    assert.equal(review.prototypeSolveMode, baseline.prototypeSolveMode, `${pattern.prototypeId}/${seed}: solve mode drifted`);
    assert.equal(review.active, false);
    assert.equal(review.questionStudioDiscoverable, false);
    assert.equal(review.questionBankWritable, false);
    assert.equal(review.testEligible, false);
    assert.equal(review.publiclyPublishable, false);
    assert.ok(review.question.trim().length >= 12);
    assert.ok(review.explanation.trim().length >= 45);
    assert.doesNotMatch(review.question, /TODO|TBD|undefined|NaN|oracle|runtime|prototype|canonical/i);
    assert.doesNotMatch(review.explanation, /TODO|TBD|undefined|NaN|oracle|runtime|prototype|canonical/i);

    if (isAlgEnglishV4TargetPrototype(pattern.prototypeId)) {
      targeted += 1;
      assert.equal(review.chapterReviewCandidate, true);
      assert.equal(review.chapterReviewSource, "V4_CONTROLLED_REOPEN");
      assert.equal(review.learnerContentFrozen, false);
      assert.equal(review.englishImplementationFrozen, false);
      assert.equal(review.reviewStatus, "CHAPTER_V4_REVIEW_REQUIRED");
      assert.ok(review.v4ReviewAuthority);
      assert.ok(review.v4RawCandidate);
    } else {
      untouched += 1;
      assert.equal(review.chapterReviewCandidate, false);
      assert.equal(review.chapterReviewSource, "V3_FROZEN_UNCHANGED");
      assert.equal(review.question, baseline.question);
      assert.equal(review.explanation, baseline.explanation);
      assert.deepEqual(review.canonicalAnswer, baseline.canonicalAnswer);
    }
  }
}

assert.equal(targeted, 31 * 12);
assert.equal(untouched, (109 - 31) * 12);
assert.equal(samples, 109 * 12);

console.log("PASS_ALGEBRA_ENGLISH_V4_CHAPTER_REVIEW", {
  authority: ALG_ENGLISH_V4_CHAPTER_REVIEW_AUTHORITY,
  patterns: 109,
  targetPatterns: 31,
  untouchedPatterns: 78,
  samples,
});
