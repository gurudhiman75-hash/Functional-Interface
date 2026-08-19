import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4,
  countSyntheticDistractorMarksV1_4,
  generatePfcTpfSourceSaturatedEnglishReviewV1_4,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_4,
} from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-4";
import {
  PFC_TPF_REVIEW_V1_3_FORWARD_MIN_GEOMETRIC_DISTANCE,
  generatePfcTpfSourceSaturatedEnglishReviewV1_3,
  minimumForwardOptionGeometricDistanceV1_3,
} from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-3";

const prior = generatePfcTpfSourceSaturatedEnglishReviewV1_3();
const questions = generatePfcTpfSourceSaturatedEnglishReviewV1_4();
assert.equal(questions.length, 48);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4.reviewQuestionCount, 48);
assert.deepEqual(questions.map((q) => q.semanticFingerprint), prior.map((q) => q.semanticFingerprint));
assert.deepEqual(questions.map((q) => q.correctOptionId), prior.map((q) => q.correctOptionId));
assert.equal(countSyntheticDistractorMarksV1_4(questions), 0);

for (const question of questions) {
  assert.equal(question.stimulusSvg.includes("data-perceptual-distractor"), false);
  assert.equal(question.options.some((option) => /data-(?:perceptual|distinct)-distractor/.test(option.svg)), false);
  if (question.taskKind === "LEGACY_FORWARD" || question.taskKind === "MULTISHAPE_FORWARD") {
    const distance = minimumForwardOptionGeometricDistanceV1_3(question);
    assert.ok(distance + 1e-9 >= PFC_TPF_REVIEW_V1_3_FORWARD_MIN_GEOMETRIC_DISTANCE, `${question.reviewQuestionId} became ambiguous after V1.4 cleanup at ${distance.toFixed(3)}.`);
  }
}

const html = renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_4(questions);
assert.ok(html.includes("PFC / TPF Source-Saturated English Learner Review V1.4"));
assert.ok(html.includes(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4.authorityId));
assert.equal((html.match(/class="stimulus-stage /g) ?? []).length, 48);
assert.equal((html.match(/class="option-art /g) ?? []).length, 48 * 4);
assert.ok(html.includes(".stimulus-stage{height:250px;min-height:250px"));
assert.ok(html.includes(".stimulus-sequence>svg{height:210px!important;width:auto!important"));
assert.ok(html.includes(".stimulus-panels>div>svg{width:160px!important;height:160px!important"));
assert.ok(html.includes(".option-pattern>svg{width:150px!important;height:150px!important"));
assert.ok(!html.includes("data-perceptual-distractor"));
assert.ok(!html.includes("data-distinct-distractor"));

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length);
const idSet = new Set(ids);
for (const ref of [...html.matchAll(/url\(#([^\)]+)\)/g)].map((match) => match[1])) assert.ok(idSet.has(ref));

const evidence = {
  authority: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_4,
  status: "PASS_PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_V1_4",
  reviewQuestionCount: questions.length,
  syntheticDistractorMarks: countSyntheticDistractorMarksV1_4(questions),
  normalizedPresentation: {
    stimulusStageCount: 48,
    optionArtStageCount: 192,
    desktopStimulusStageHeightPx: 250,
    legacySequenceHeightPx: 210,
    multishapePanelSizePx: 160,
    singleStimulusSizePx: 210,
    optionPatternSizePx: 150,
  },
  retainedSemanticFingerprints: questions.map((question) => question.semanticFingerprint),
  retainedCorrectOptionIds: questions.map((question) => question.correctOptionId),
  governance: {
    semanticAnswersChangedFromV1_3: false,
    correctOptionsMoved: false,
    syntheticExtraMarksAllowed: false,
    humanLearnerReviewRequired: true,
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-4-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-4.html", html, "utf8");
console.log(JSON.stringify(evidence));
