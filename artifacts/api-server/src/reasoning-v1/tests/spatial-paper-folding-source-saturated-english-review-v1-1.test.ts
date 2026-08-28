import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_1,
  generatePfcTpfSourceSaturatedEnglishReviewV1_1,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_1,
} from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-1";

const questions = generatePfcTpfSourceSaturatedEnglishReviewV1_1();
assert.equal(questions.length, 48);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_1.reviewQuestionCount, 48);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_1.questionsPerProposal, 8);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_1.permanentQlIdsUsed, false);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_1.englishFreezeAllowed, false);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_1.questionStudioAllowed, false);

const edgeNotchQuestions = questions.filter((question) => question.sourceId.includes("V-NOTCH"));
assert.equal(edgeNotchQuestions.length, 3);
for (const question of edgeNotchQuestions) {
  assert.ok(question.stimulusSvg.includes('stroke="white" stroke-width="5" stroke-linecap="round"/><polyline'));
}

const html = renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_1(questions);
assert.ok(html.includes("PFC / TPF Source-Saturated English Learner Review V1.1"));
assert.ok(html.includes(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_1.authorityId));
assert.ok(html.includes("background:#fff"));
assert.ok(!html.includes("background:#0"));

const evidence = {
  authority: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_1,
  status: "PASS_PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_V1_1",
  reviewQuestionCount: questions.length,
  notchStimulusOpenMouthCount: edgeNotchQuestions.length,
  retainedSemanticFingerprints: questions.map((question) => question.semanticFingerprint),
  governance: {
    semanticAnswersChangedFromV1: false,
    presentationOnlyRemediation: true,
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
  "dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-1.html",
  html,
  "utf8",
);
console.log(JSON.stringify(evidence));
