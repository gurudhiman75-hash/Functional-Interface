import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE,
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5,
  countNormalizedStageSvgsV1_5,
  countSyntheticDistractorMarksV1_5,
  generatePfcTpfSourceSaturatedEnglishReviewV1_5,
  minimumPatternOptionDistanceV1_5,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5,
} from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-5";
import { generatePfcTpfSourceSaturatedEnglishReviewV1_4_1 } from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-4-1";

const prior = generatePfcTpfSourceSaturatedEnglishReviewV1_4_1();
const questions = generatePfcTpfSourceSaturatedEnglishReviewV1_5();
assert.equal(questions.length, 48);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5.reviewQuestionCount, 48);
assert.deepEqual(questions.map((q) => q.semanticFingerprint), prior.map((q) => q.semanticFingerprint));
assert.deepEqual(questions.map((q) => q.correctOptionId), prior.map((q) => q.correctOptionId));
assert.equal(countSyntheticDistractorMarksV1_5(questions), 0);

let remediatedPatternQuestionCount = 0;
let minimumPatternDistance = 1;
for (let index = 0; index < questions.length; index += 1) {
  const question = questions[index];
  if (question.taskKind === "REVERSE_INFERENCE") continue;
  const distance = minimumPatternOptionDistanceV1_5(question);
  minimumPatternDistance = Math.min(minimumPatternDistance, distance);
  assert.ok(
    distance + 1e-9 >= PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE,
    `${question.reviewQuestionId} remains too similar at ${distance.toFixed(3)}.`,
  );
  if (question.options.some((option, optionIndex) => option.svg !== prior[index].options[optionIndex].svg)) {
    remediatedPatternQuestionCount += 1;
  }
}
assert.ok(remediatedPatternQuestionCount >= 10, `Expected broad visual separation remediation, got ${remediatedPatternQuestionCount}.`);

const threeStepStimulusQuestions = questions.filter((question) =>
  question.taskKind === "MULTISHAPE_FORWARD" && (question.stimulusSvg.match(/data-stage-normalized="true"/g) ?? []).length >= 4,
);
assert.ok(threeStepStimulusQuestions.length >= 4, `Expected at least four normalized 3-step forward questions, got ${threeStepStimulusQuestions.length}.`);
for (const question of threeStepStimulusQuestions) {
  const normalized = question.stimulusSvg.match(/data-stage-normalized="true"/g) ?? [];
  assert.ok(normalized.length >= 4, `${question.reviewQuestionId} does not keep each 3-step stage independently normalized.`);
}

for (const question of questions.filter((question) => question.taskKind === "REVERSE_INFERENCE")) {
  for (const option of question.options) {
    const stageCount = (option.svg.match(/data-stage-normalized="true"/g) ?? []).length;
    assert.ok(stageCount >= 2, `${question.reviewQuestionId}/${option.optionId} reverse sequence is not stage-normalized.`);
  }
}

const normalizedStageSvgCount = countNormalizedStageSvgsV1_5(questions);
assert.ok(normalizedStageSvgCount >= 100, `Expected broad stage normalization, got ${normalizedStageSvgCount}.`);

const html = renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5(questions);
assert.ok(html.includes("PFC / TPF Source-Saturated English Learner Review V1.5"));
assert.ok(html.includes(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5.authorityId));
assert.ok(html.includes(".fixed-stage{width:178px;flex:0 0 178px"));
assert.ok(html.includes(".stimulus-panels .fixed-stage svg{width:156px!important;height:156px!important"));
assert.ok(html.includes(".stimulus-sequence>svg{height:240px!important"));
assert.ok(html.includes(".option-process .fixed-stage svg{width:96px!important;height:96px!important"));
assert.ok(html.includes("min-width:max-content!important"));
assert.ok(!html.includes("data-perceptual-distractor"));
assert.ok(!html.includes("data-distinct-distractor"));

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length);
const idSet = new Set(ids);
for (const ref of [...html.matchAll(/url\(#([^\)]+)\)/g)].map((match) => match[1])) assert.ok(idSet.has(ref));

const evidence = {
  authority: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5,
  status: "PASS_PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_V1_5",
  reviewQuestionCount: questions.length,
  remediatedPatternQuestionCount,
  minimumPatternPairwiseDistance: minimumPatternDistance,
  minimumPatternDistanceGate: PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE,
  normalizedStageSvgCount,
  threeStepForwardQuestionIds: threeStepStimulusQuestions.map((question) => question.reviewQuestionId),
  retainedSemanticFingerprints: questions.map((question) => question.semanticFingerprint),
  retainedCorrectOptionIds: questions.map((question) => question.correctOptionId),
  presentation: {
    fixedStageCardWidthPx: 178,
    forwardStageSvgPx: 156,
    legacySequenceHeightPx: 240,
    reverseStageSvgPx: 96,
    progressivePacketShrinkingAllowed: false,
    horizontalScrollInsteadOfShrink: true,
    randomExtraDistractorMarksAllowed: false,
  },
  governance: {
    semanticAnswersChangedFromV1_4_1: false,
    correctOptionIdsChanged: false,
    humanLearnerReviewRequired: true,
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-5-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-5.html", html, "utf8");
console.log(JSON.stringify(evidence));
