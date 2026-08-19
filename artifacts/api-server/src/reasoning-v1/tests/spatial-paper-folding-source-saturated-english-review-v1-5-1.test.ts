import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_1,
  countNormalizedStagesV1_5_1,
  generatePfcTpfSourceSaturatedEnglishReviewV1_5_1,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_1,
} from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-5-1";
import {
  PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE,
  minimumPatternOptionDistanceV1_5,
} from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-5";
import { generatePfcTpfSourceSaturatedEnglishReviewV1_4_1 } from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-4-1";

const prior = generatePfcTpfSourceSaturatedEnglishReviewV1_4_1();
const questions = generatePfcTpfSourceSaturatedEnglishReviewV1_5_1();
assert.equal(questions.length, 48);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_1.reviewQuestionCount, 48);
assert.deepEqual(questions.map((q) => q.semanticFingerprint), prior.map((q) => q.semanticFingerprint));
assert.deepEqual(questions.map((q) => q.correctOptionId), prior.map((q) => q.correctOptionId));

let remediatedPatternQuestions = 0;
let minimumDistance = 1;
for (let index = 0; index < questions.length; index += 1) {
  const question = questions[index];
  const markup = [question.stimulusSvg, ...question.options.map((option) => option.svg)].join("\n");
  assert.equal(/data-(?:perceptual|distinct)-distractor/.test(markup), false);
  if (question.taskKind !== "REVERSE_INFERENCE") {
    const distance = minimumPatternOptionDistanceV1_5(question);
    minimumDistance = Math.min(minimumDistance, distance);
    assert.ok(distance + 1e-9 >= PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE, `${question.reviewQuestionId} remains too similar at ${distance.toFixed(3)}.`);
    if (question.options.some((option, optionIndex) => option.svg !== prior[index].options[optionIndex].svg)) remediatedPatternQuestions += 1;
  }
}
assert.ok(remediatedPatternQuestions >= 8, `Expected broad choice cleanup; only ${remediatedPatternQuestions} questions changed.`);

const threeStepForward = questions.filter((question) => question.taskKind === "MULTISHAPE_FORWARD" && (question.stimulusSvg.match(/data-stage-normalized="true"/g) ?? []).length >= 4);
assert.ok(threeStepForward.length >= 4);
for (const question of threeStepForward) {
  assert.ok((question.stimulusSvg.match(/class="fixed-stage"/g) ?? []).length >= 4, `${question.reviewQuestionId} is missing fixed stage cards.`);
}

for (const question of questions.filter((question) => question.taskKind === "REVERSE_INFERENCE")) {
  for (const option of question.options) {
    assert.ok((option.svg.match(/data-stage-normalized="true"/g) ?? []).length >= 2, `${question.reviewQuestionId}/${option.optionId} reverse stages are not independently zoomed.`);
  }
}

const normalizedStageCount = countNormalizedStagesV1_5_1(questions);
assert.ok(normalizedStageCount >= 100, `Expected >=100 independently normalized stage SVGs; got ${normalizedStageCount}.`);

const html = renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_1(questions);
assert.ok(html.includes("PFC / TPF Source-Saturated English Learner Review V1.5.1"));
assert.ok(html.includes(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_1.authorityId));
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
  authority: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_1,
  status: "PASS_PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_V1_5_1",
  reviewQuestionCount: questions.length,
  remediatedPatternQuestionCount: remediatedPatternQuestions,
  minimumPatternPairwiseDistance: minimumDistance,
  minimumPatternDistanceGate: PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE,
  normalizedStageSvgCount: normalizedStageCount,
  threeStepForwardQuestionIds: threeStepForward.map((question) => question.reviewQuestionId),
  retainedSemanticFingerprints: questions.map((question) => question.semanticFingerprint),
  retainedCorrectOptionIds: questions.map((question) => question.correctOptionId),
  governance: {
    humanLearnerReviewRequired: true,
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-5-1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-5-1.html", html, "utf8");
console.log(JSON.stringify(evidence));
