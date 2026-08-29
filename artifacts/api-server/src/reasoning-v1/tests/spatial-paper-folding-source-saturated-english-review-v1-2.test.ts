import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_TPF_REVIEW_V1_2_FORWARD_MIN_VISUAL_DISTANCE,
  PFC_TPF_REVIEW_V1_2_REVERSE_MIN_VISUAL_DISTANCE,
  PFC_TPF_REVIEW_V1_2_TPF_MIN_VISUAL_DISTANCE,
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_2,
  generatePfcTpfSourceSaturatedEnglishReviewV1_2,
  minimumOptionVisualDistanceV1_2,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_2,
} from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-2";
import { generatePfcTpfSourceSaturatedEnglishReviewV1_1 } from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-1";

const prior = generatePfcTpfSourceSaturatedEnglishReviewV1_1();
const questions = generatePfcTpfSourceSaturatedEnglishReviewV1_2();
assert.equal(questions.length, 48);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_2.reviewQuestionCount, 48);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_2.questionsPerProposal, 8);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_2.permanentQlIdsUsed, false);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_2.englishFreezeAllowed, false);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_2.questionStudioAllowed, false);
assert.deepEqual(
  questions.map((question) => question.semanticFingerprint),
  prior.map((question) => question.semanticFingerprint),
  "V1.2 presentation/distractor remediation must not change correct-answer semantic fingerprints.",
);
assert.deepEqual(
  questions.map((question) => question.correctOptionId),
  prior.map((question) => question.correctOptionId),
  "V1.2 must not move the correct option.",
);

let transparentCutoutCount = 0;
let minimumObservedDistance = 1;
for (const question of questions) {
  const threshold = question.taskKind === "LEGACY_FORWARD" || question.taskKind === "MULTISHAPE_FORWARD"
    ? PFC_TPF_REVIEW_V1_2_FORWARD_MIN_VISUAL_DISTANCE
    : question.taskKind === "REVERSE_INFERENCE"
      ? PFC_TPF_REVIEW_V1_2_REVERSE_MIN_VISUAL_DISTANCE
      : PFC_TPF_REVIEW_V1_2_TPF_MIN_VISUAL_DISTANCE;
  const distance = minimumOptionVisualDistanceV1_2(question);
  minimumObservedDistance = Math.min(minimumObservedDistance, distance);
  assert.ok(
    distance + 1e-9 >= threshold,
    `${question.reviewQuestionId} minimum pairwise option distance ${distance.toFixed(3)} is below ${threshold}.`,
  );
  assert.equal(new Set(question.options.map((option) => option.svg)).size, 4, `${question.reviewQuestionId} contains duplicate option SVGs.`);

  const markup = [question.stimulusSvg, ...question.options.map((option) => option.svg)].join("\n");
  if (question.chapterCode === "PFC-001") {
    assert.equal(
      /<(?:circle|polygon)\b[^>]*fill="(?:#111|black)"/i.test(markup),
      false,
      `${question.reviewQuestionId} still contains a black-filled opaque-paper cutout.`,
    );
    transparentCutoutCount += (markup.match(/data-cutout="transparent"/g) ?? []).length;
  }
}
assert.ok(transparentCutoutCount > 100, "Expected transparent cutout rendering to be exercised broadly across the review pack.");

const html = renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_2(questions);
assert.ok(html.includes("PFC / TPF Source-Saturated English Learner Review V1.2"));
assert.ok(html.includes(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_2.authorityId));
assert.ok(html.includes("background:#fff"));
assert.ok(!html.includes("background:#0"));
assert.ok(!html.includes('id="arrow"'));

const svgOpenTags = html.match(/<svg\b[^>]*>/g) ?? [];
assert.ok(svgOpenTags.length > 300);
assert.equal(svgOpenTags.every((tag) => tag.includes('xmlns="http://www.w3.org/2000/svg"')), true, "Every inline SVG must carry an xmlns for browser-safe rendering.");

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, "All inline SVG ids must be document-unique.");
const idSet = new Set(ids);
const urlRefs = [...html.matchAll(/url\(#([^\)]+)\)/g)].map((match) => match[1]);
for (const ref of urlRefs) assert.ok(idSet.has(ref), `Broken inline SVG url(#${ref}) reference.`);

const evidence = {
  authority: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_2,
  status: "PASS_PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_V1_2",
  reviewQuestionCount: questions.length,
  transparentCutoutCount,
  minimumObservedPairwiseOptionVisualDistance: minimumObservedDistance,
  inlineSvgCount: svgOpenTags.length,
  inlineSvgIdCount: ids.length,
  duplicateInlineSvgIdCount: ids.length - new Set(ids).size,
  brokenInlineSvgUrlReferenceCount: urlRefs.filter((ref) => !idSet.has(ref)).length,
  retainedSemanticFingerprints: questions.map((question) => question.semanticFingerprint),
  retainedCorrectOptionIds: questions.map((question) => question.correctOptionId),
  governance: {
    semanticAnswersChangedFromV1_1: false,
    humanLearnerReviewRequired: true,
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-2-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-2.html",
  html,
  "utf8",
);
console.log(JSON.stringify(evidence));
