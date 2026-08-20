import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_001_POLYGON_LEARNER_REVIEW_AUTHORITY_V1,
  generatePfcPolygonLearnerReviewV1,
  renderPfcPolygonLearnerReviewHtmlV1,
} from "../foundation/spatial/paper-folding-polygon-learner-review-v1";

const questions = generatePfcPolygonLearnerReviewV1();
assert.equal(questions.length, 12);
assert.equal(questions.filter((q) => q.task === "FORWARD_UNFOLD").length, 8);
assert.equal(questions.filter((q) => q.task === "REVERSE_INFERENCE").length, 4);
assert.equal(new Set(questions.map((q) => q.reviewId)).size, 12);

for (const question of questions) {
  assert.equal(question.options.length, 4);
  assert.ok(question.options.some((option) => option.optionId === question.correctOptionId));
  assert.equal(new Set(question.options.map((option) => option.svg)).size, 4, `${question.reviewId} contains duplicate option art.`);
  assert.ok(question.stimulusSvg.includes("<svg"));
  if (question.task === "FORWARD_UNFOLD") {
    const semantics = new Set(question.options.map((option) => option.semantic));
    assert.ok(semantics.has("FORGOT_TO_UNFOLD"));
    assert.ok(semantics.has("CORRECT_TWO_LAYER_REFLECTION"));
    assert.ok(semantics.has("WRONG_SYMMETRY_AXIS"));
    assert.ok(semantics.has("FALSE_FOUR_LAYER_PATTERN"));
  }
}

const html = renderPfcPolygonLearnerReviewHtmlV1(questions);
assert.ok(html.includes("PFC-001 Polygon Substrate Gap Review V1"));
assert.ok(html.includes("Triangle source sheet"));
assert.ok(html.includes("review only; no permanent QL"));
assert.ok(html.includes("min-width:max-content"));
assert.ok(!html.includes('fill="black" data-cutout'));
assert.ok(!html.includes('fill="#111" data-cutout'));
assert.equal((html.match(/<article class="question-card">/g) ?? []).length, 12);
assert.equal((html.match(/class="option"/g) ?? []).length, 48);

const evidence = {
  status: "PASS_PFC_POLYGON_TRIANGLE_LEARNER_REVIEW_V1",
  authority: PFC_001_POLYGON_LEARNER_REVIEW_AUTHORITY_V1,
  reviewQuestionCount: questions.length,
  forwardQuestionCount: questions.filter((q) => q.task === "FORWARD_UNFOLD").length,
  reverseQuestionCount: questions.filter((q) => q.task === "REVERSE_INFERENCE").length,
  sourceShape: "TRIANGLE",
  optionArtUniqueWithinEveryQuestion: true,
  conceptualForwardDistractors: ["FORGOT_TO_UNFOLD", "WRONG_SYMMETRY_AXIS", "FALSE_FOUR_LAYER_PATTERN"],
  transparentCutouts: true,
  fixedStageSizing: true,
  governance: {
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_001_POLYGON_TRIANGLE_HUMAN_REVIEW_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-polygon-triangle-review-v1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-polygon-triangle-review-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
