import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_TPF_REVIEW_V1_3_FORWARD_MIN_GEOMETRIC_DISTANCE,
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_3,
  generatePfcTpfSourceSaturatedEnglishReviewV1_3,
  minimumForwardOptionGeometricDistanceV1_3,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_3,
} from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-3";
import { generatePfcTpfSourceSaturatedEnglishReviewV1_2 } from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-2";

const prior = generatePfcTpfSourceSaturatedEnglishReviewV1_2();
const questions = generatePfcTpfSourceSaturatedEnglishReviewV1_3();
assert.equal(questions.length, 48);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_3.reviewQuestionCount, 48);
assert.deepEqual(questions.map((q) => q.semanticFingerprint), prior.map((q) => q.semanticFingerprint));
assert.deepEqual(questions.map((q) => q.correctOptionId), prior.map((q) => q.correctOptionId));

let remediatedForwardCount = 0;
let minimumForwardDistance = 1;
for (let index = 0; index < questions.length; index += 1) {
  const question = questions[index];
  if (question.taskKind !== "LEGACY_FORWARD" && question.taskKind !== "MULTISHAPE_FORWARD") continue;
  const distance = minimumForwardOptionGeometricDistanceV1_3(question);
  minimumForwardDistance = Math.min(minimumForwardDistance, distance);
  assert.ok(
    distance + 1e-9 >= PFC_TPF_REVIEW_V1_3_FORWARD_MIN_GEOMETRIC_DISTANCE,
    `${question.reviewQuestionId} forward options remain too visually similar at ${distance.toFixed(3)}.`,
  );
  if (question.options.some((option, optionIndex) => option.svg !== prior[index].options[optionIndex].svg)) remediatedForwardCount += 1;
}
assert.ok(remediatedForwardCount > 0);

const html = renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_3(questions);
assert.ok(html.includes("PFC / TPF Source-Saturated English Learner Review V1.3"));
assert.ok(html.includes(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_3.authorityId));
assert.ok(!html.includes('id="arrow"'));
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length);
const idSet = new Set(ids);
for (const ref of [...html.matchAll(/url\(#([^\)]+)\)/g)].map((match) => match[1])) assert.ok(idSet.has(ref));

for (const question of questions.filter((question) => question.chapterCode === "PFC-001")) {
  const markup = [question.stimulusSvg, ...question.options.map((option) => option.svg)].join("\n");
  assert.equal(/<(?:circle|polygon)\b[^>]*fill="(?:#111|black)"/i.test(markup), false);
}

const evidence = {
  authority: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_3,
  status: "PASS_PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_V1_3",
  reviewQuestionCount: questions.length,
  remediatedForwardQuestionCount: remediatedForwardCount,
  minimumForwardPairwiseGeometricDistance: minimumForwardDistance,
  retainedSemanticFingerprints: questions.map((question) => question.semanticFingerprint),
  retainedCorrectOptionIds: questions.map((question) => question.correctOptionId),
  governance: {
    semanticAnswersChangedFromV1_2: false,
    correctOptionsMoved: false,
    humanLearnerReviewRequired: true,
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-3-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-3.html", html, "utf8");
console.log(JSON.stringify(evidence));
