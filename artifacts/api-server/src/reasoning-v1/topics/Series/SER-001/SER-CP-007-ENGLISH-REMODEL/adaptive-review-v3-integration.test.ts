import assert from "node:assert/strict";
import {
  SER_CP007_TEMPORARY_TEMPLATES,
  generateSerCp007Question,
} from "../SER-CP-007/foundation";
import {
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATES,
  generateSerCp007WaveBQuestion,
} from "../SER-CP-007-WAVE-B/foundation-expanded";
import {
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATES,
  generateSerCp007WaveCQuestion,
} from "../SER-CP-007-WAVE-C/foundation-refined";
import {
  SER_CP007_WAVE_D_TEMPORARY_TEMPLATES,
  generateSerCp007WaveDQuestion,
} from "../SER-CP-007-WAVE-D/foundation";
import {
  SER_CP007_WAVE_E_TEMPORARY_TEMPLATES,
  generateSerCp007WaveEQuestion,
} from "../SER-CP-007-WAVE-E/foundation";
import {
  buildAdaptiveSerCp007Review,
  type SerCp007EditorialQuestion,
} from "./adaptive-review";
import { buildAdaptiveSerCp007ReviewV3 } from "./adaptive-review-v3";
import { validateSerCp007DistractorRole } from "../SER-CP-007-DISTRACTOR-AUDIT/distractor-candidate-v1";

type Probe = {
  readonly generate: (seed: number) => SerCp007EditorialQuestion;
};

const probes: readonly Probe[] = [
  ...SER_CP007_TEMPORARY_TEMPLATES.map((template) => ({
    generate: (seed: number) =>
      generateSerCp007Question(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007EditorialQuestion,
  })),
  ...SER_CP007_WAVE_B_TEMPORARY_TEMPLATES.map((template) => ({
    generate: (seed: number) =>
      generateSerCp007WaveBQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007EditorialQuestion,
  })),
  ...SER_CP007_WAVE_C_TEMPORARY_TEMPLATES.map((template) => ({
    generate: (seed: number) =>
      generateSerCp007WaveCQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007EditorialQuestion,
  })),
  ...SER_CP007_WAVE_D_TEMPORARY_TEMPLATES.map((template) => ({
    generate: (seed: number) =>
      generateSerCp007WaveDQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007EditorialQuestion,
  })),
  ...SER_CP007_WAVE_E_TEMPORARY_TEMPLATES.map((template) => ({
    generate: (seed: number) =>
      generateSerCp007WaveEQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007EditorialQuestion,
  })),
];

assert.equal(probes.length, 140);

function wordCount(value: string): number {
  return value
    .replace(/[`*_#✓]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

const reviewWords: number[] = [];
let sampledReviews = 0;
let proofPreservationChecks = 0;
let optionIntegrityChecks = 0;
let roleValidationChecks = 0;
let visibleCheckReviews = 0;
let checkAlignmentProofs = 0;
let reviewsWithoutCheck = 0;
let candidateOptionChanges = 0;
let reviewsOver180Words = 0;

for (const probe of probes) {
  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed);
    const v2 = buildAdaptiveSerCp007Review(question);
    const v3 = buildAdaptiveSerCp007ReviewV3(question);

    assert.equal(v3.editorialTaskKind, v2.editorialTaskKind);
    assert.equal(v3.proofModel, v2.proofModel);
    assert.equal(v3.stem, v2.stem);
    assert.deepEqual(v3.workedSteps, v2.workedSteps);
    assert.equal(v3.renderedShortcut, v2.renderedShortcut);
    assert.equal(v3.renderedCheck, v2.renderedCheck);
    proofPreservationChecks += 1;

    assert.equal(v3.options.length, 4);
    assert.equal(new Set(v3.options).size, 4);
    assert.equal(v3.options[question.correctIndex], question.correctAnswer);
    assert.equal(v3.distractors.length, 3);
    assert.equal(
      new Set(v3.distractors.map((entry) => entry.role)).size,
      3,
    );
    optionIntegrityChecks += 1;

    if (v3.options.join("|") !== question.options.join("|")) {
      candidateOptionChanges += 1;
    }

    for (const distractor of v3.distractors) {
      assert.ok(
        validateSerCp007DistractorRole(question.correctAnswer, distractor),
      );
      assert.ok(v3.review.includes(distractor.value));
      roleValidationChecks += 1;
    }

    if (v3.renderedCheck) {
      assert.ok(v3.visibleCheckRole);
      const represented = v3.distractors.find(
        (entry) => entry.role === v3.visibleCheckRole,
      );
      assert.ok(represented);
      assert.ok(v3.review.includes(`**Check:** ${represented!.learnerCheck}`));
      assert.equal(v3.review.split("**Check:**").length - 1, 1);
      visibleCheckReviews += 1;
      checkAlignmentProofs += 1;
    } else {
      assert.equal(v3.visibleCheckRole, null);
      assert.doesNotMatch(v3.review, /\*\*Check:\*\*/);
      reviewsWithoutCheck += 1;
    }

    assert.doesNotMatch(v3.review, /📌 \*\*Rule\*\*/);
    assert.doesNotMatch(v3.review, /📝 \*\*Solution\*\*/);
    assert.doesNotMatch(v3.review, /⚡ \*\*Quick Method\*\*/);
    assert.doesNotMatch(v3.review, /⚠️ \*\*Common Mistake\*\*/);
    assert.doesNotMatch(v3.review, /\[[A-Z][A-Z0-9_]*\]/);
    assert.doesNotMatch(
      v3.review,
      /editorial task|proof model|trap code|canonical authority|distractor role/i,
    );

    const words = wordCount(v3.review);
    reviewWords.push(words);
    if (words > 180) reviewsOver180Words += 1;
    sampledReviews += 1;
  }
}

assert.equal(sampledReviews, 420);
assert.equal(proofPreservationChecks, 420);
assert.equal(optionIntegrityChecks, 420);
assert.equal(roleValidationChecks, 1_260);
assert.equal(visibleCheckReviews, 102);
assert.equal(checkAlignmentProofs, 102);
assert.equal(reviewsWithoutCheck, 318);
assert.ok(candidateOptionChanges > 350);

const averageReviewWords =
  reviewWords.reduce((sum, value) => sum + value, 0) / reviewWords.length;
assert.ok(averageReviewWords < 125);
assert.ok(Math.max(...reviewWords) < 210);
assert.ok(reviewsOver180Words < 40);
assert.ok(Math.min(...reviewWords) >= 35);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_ADAPTIVE_ENGLISH_DISTRACTOR_CANDIDATE_V3",
      temporaryTemplates: probes.length,
      sampledSeedsPerTemplate: 3,
      sampledReviews,
      proofPreservationChecks,
      optionIntegrityChecks,
      roleValidationChecks,
      visibleCheckReviews,
      checkAlignmentProofs,
      reviewsWithoutCheck,
      candidateOptionChanges,
      averageReviewWords: Number(averageReviewWords.toFixed(2)),
      minimumReviewWords: Math.min(...reviewWords),
      maximumReviewWords: Math.max(...reviewWords),
      reviewsOver180Words,
      candidateStatus: "EXECUTABLE_PENDING_FULL_MANUAL_REVIEW",
      authorityRecommendation: "13_WITH_14_FALLBACK",
      permanentQls: 0,
      englishDiscoveryFreeze: "BLOCKED",
      nextAuthority:
        "SER_CP007_ADAPTIVE_ENGLISH_V3_FULL_MANUAL_REVIEW",
    },
    null,
    2,
  ),
);
