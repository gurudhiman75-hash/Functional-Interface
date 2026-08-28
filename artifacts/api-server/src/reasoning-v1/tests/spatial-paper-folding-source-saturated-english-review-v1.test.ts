import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1,
  generatePfcTpfSourceSaturatedEnglishReviewV1,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1,
} from "../foundation/spatial/paper-folding-source-saturated-english-review-v1";
import { PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1 } from "../foundation/spatial/paper-folding-merge-split-ql-proposal-v1";

const questions = generatePfcTpfSourceSaturatedEnglishReviewV1();
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1.reviewQuestionCount, 48);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1.questionsPerProposal, 8);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1.permanentQlIdsUsed, false);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1.englishFreezeAllowed, false);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1.localizationAllowed, false);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1.questionStudioAllowed, false);
assert.equal(questions.length, 48);
assert.equal(new Set(questions.map((question) => question.reviewQuestionId)).size, 48);
assert.equal(new Set(questions.map((question) => question.sourceId)).size, 48);

for (const proposal of PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1) {
  const slice = questions.filter((question) => question.proposalId === proposal.proposalId);
  assert.equal(slice.length, 8, `${proposal.proposalId} must have exactly eight learner-review questions.`);
  assert.equal(slice.every((question) => question.proposalName === proposal.name), true);
  assert.equal(slice.every((question) => question.options.length === 4), true);
  assert.equal(slice.every((question) => question.options.some((option) => option.optionId === question.correctOptionId)), true);
  assert.equal(slice.every((question) => question.semanticFingerprint.length > 0), true);
}

const shapes = new Set(questions.map((question) => question.sourceShape));
assert.ok(shapes.has("SQUARE"));
assert.ok(shapes.has("RECTANGLE"));
assert.ok(shapes.has("CIRCLE"));
assert.ok(shapes.has("TRANSPARENT_SQUARE"));

const taskKinds = new Set(questions.map((question) => question.taskKind));
assert.ok(taskKinds.has("LEGACY_FORWARD"));
assert.ok(taskKinds.has("MULTISHAPE_FORWARD"));
assert.ok(taskKinds.has("REVERSE_INFERENCE"));
assert.ok(taskKinds.has("TRANSPARENT_SUPERPOSITION"));

const reverse = questions.filter((question) => question.proposalId === "PFC-PROP-05");
assert.equal(reverse.length, 8);
assert.equal(new Set(reverse.map((question) => question.sourceShape)).size, 2);
assert.equal(reverse.every((question) => question.taskKind === "REVERSE_INFERENCE"), true);

const transparent = questions.filter((question) => question.proposalId === "TPF-PROP-01");
assert.equal(transparent.length, 8);
assert.equal(transparent.every((question) => question.sourceShape === "TRANSPARENT_SQUARE"), true);
assert.equal(transparent.every((question) => question.taskKind === "TRANSPARENT_SUPERPOSITION"), true);

const circleForward = questions.filter((question) => question.sourceShape === "CIRCLE");
assert.ok(circleForward.length >= 3, "Learner review must visibly exercise analytic circular-paper semantics.");
const rectangleForward = questions.filter((question) => question.sourceShape === "RECTANGLE" && question.taskKind === "MULTISHAPE_FORWARD");
assert.ok(rectangleForward.length >= 8, "Learner review must visibly exercise rectangular-paper forward semantics.");

const creaseTopology = questions.filter((question) => question.sourceId.includes("FOLD-EDGE-V-NOTCH"));
assert.equal(creaseTopology.length, 2);
const threeFold = questions.filter((question) => question.sourceId.includes("THREE-FOLD"));
assert.ok(threeFold.length >= 4);

for (const question of questions) {
  assert.equal(question.stimulusSvg.includes("<svg") || question.stimulusSvg.includes("<div"), true);
  assert.equal(question.options.every((option) => option.svg.includes("<svg") || option.svg.includes("<div")), true);
  assert.equal(question.explanation.length > 35, true);
}

const html = renderPfcTpfSourceSaturatedEnglishReviewHtmlV1(questions);
assert.ok(html.includes("PFC / TPF Source-Saturated English Learner Review V1"));
assert.ok(html.includes("48 deliberate learner-facing questions"));
assert.ok(html.includes("background:#fff"));
assert.ok(!html.includes("background:#0"));
assert.ok(!html.includes("SPA-QL-035</strong>"));
assert.ok(html.includes("PFC-PROP-05"));
assert.ok(html.includes("TPF-PROP-01"));

const countsByProposal = Object.fromEntries(
  PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1.map((proposal) => [
    proposal.proposalId,
    questions.filter((question) => question.proposalId === proposal.proposalId).length,
  ]),
);
const countsByShape = Object.fromEntries([...shapes].map((shape) => [shape, questions.filter((question) => question.sourceShape === shape).length]));
const countsByTask = Object.fromEntries([...taskKinds].map((kind) => [kind, questions.filter((question) => question.taskKind === kind).length]));

const evidence = {
  authority: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1,
  status: "PASS_PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_V1",
  reviewQuestionCount: questions.length,
  countsByProposal,
  countsByShape,
  countsByTask,
  sourceIds: questions.map((question) => question.sourceId),
  governance: {
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    humanLearnerReviewRequired: true,
    nextGate: "PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1.html",
  html,
  "utf8",
);
console.log(JSON.stringify(evidence));
