import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { pfcDiscoveryOptionIsReadableV1 } from "../foundation/spatial/paper-folding-discovery-v1";
import {
  PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V2_2,
  generatePfcPermanentEnglishCorpusV2_2,
  generatePfcPermanentEnglishQlV2_2,
  generatePfcPermanentEnglishReviewQuestionsV2_2,
  renderPfcPermanentEnglishReviewHtmlV2_2,
} from "../foundation/spatial/paper-folding-permanent-english-runtime-v2-2";
import { renderPfcDiscoveryStimulusSvgV4 } from "../foundation/spatial/paper-folding-visual-taxonomy-remediation-v4-2";

const qlIds = ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038"] as const;
const corpus = generatePfcPermanentEnglishCorpusV2_2();
assert.equal(corpus.length, 320);
assert.equal(PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V2_2.questionsPerQl, 80);
assert.equal(PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V2_2.totalQuestions, 320);
assert.equal(PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V2_2.remediationAuthority, "PFC-001-VISUAL-TAXONOMY-REMEDIATION-V4.2");
assert.equal(PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V2_2.priorFreezeStatus, "SUPERSEDED_FOR_INTEGRATION_PENDING_V2_2_LEARNER_REVIEW");

const expectedCoverageByQl: Record<(typeof qlIds)[number], readonly string[]> = {
  "SPA-QL-035": [
    "SINGLE_VERTICAL_CENTER",
    "SINGLE_HORIZONTAL_CENTER",
    "OFF_CENTER_VERTICAL",
    "OFF_CENTER_HORIZONTAL",
    "REPEATED_VERTICAL",
    "REPEATED_HORIZONTAL",
  ],
  "SPA-QL-036": [
    "PERPENDICULAR_VERTICAL_THEN_HORIZONTAL",
    "PERPENDICULAR_HORIZONTAL_THEN_VERTICAL",
    "MIXED_AXIAL_THEN_DIAGONAL",
    "MIXED_DIAGONAL_THEN_AXIAL",
    "THREE_FOLD_VERTICAL_HORIZONTAL_VERTICAL",
    "THREE_FOLD_HORIZONTAL_VERTICAL_HORIZONTAL",
  ],
  "SPA-QL-037": [
    "CORNER_TOP_LEFT",
    "CORNER_TOP_RIGHT",
    "CORNER_BOTTOM_RIGHT",
    "CORNER_BOTTOM_LEFT",
    "DIAGONAL_MAIN",
    "DIAGONAL_ANTI",
  ],
  "SPA-QL-038": [
    "OUTER_V_NOTCH",
    "OUTER_SEMICIRCLE_NOTCH",
    "FOLD_LINE_V_NOTCH",
    "FOLD_LINE_SEMICIRCLE_NOTCH",
    "MULTI_TWO_HOLES",
    "MIXED_HOLE_EDGE_NOTCH",
    "MIXED_HOLE_TRIANGLE_CUT",
    "MIXED_TRIANGLE_SLIT",
    "MULTIFOLD_OUTER_V_NOTCH",
    "MULTIFOLD_OUTER_SEMICIRCLE_NOTCH",
    "MULTIFOLD_FOLD_EDGE_V_NOTCH",
    "MULTIFOLD_FOLD_EDGE_SEMICIRCLE_NOTCH",
  ],
};

const permanentIds = new Set<string>();
const semanticFingerprints = new Set<string>();
const deliveryFingerprints = new Set<string>();
const coverageEvidence: Record<string, string[]> = {};

for (const qlId of qlIds) {
  const questions = generatePfcPermanentEnglishQlV2_2(qlId);
  assert.equal(questions.length, 80);
  const answerCounts = { A: 0, B: 0, C: 0, D: 0 };
  const coverage = new Set<string>();

  for (const question of questions) {
    assert.equal(question.permanentQlId, qlId);
    assert.equal(question.language, "en");
    assert.equal(question.locale, "en-IN");
    assert.ok(question.stem.includes("folded in the arrow direction"));
    assert.ok(question.explanation.includes(`option ${question.correctOptionId}`));
    assert.ok(!/\(\d+(?:\.\d+)?,\s*\d/.test(question.explanation));
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.fingerprint)).size, 4);
    assert.equal(question.options[question.correctOptionIndex].misconception, "CORRECT");
    assert.ok(question.options.every(pfcDiscoveryOptionIsReadableV1));
    assert.ok(renderPfcDiscoveryStimulusSvgV4(question, 640).includes("marker-end="));

    answerCounts[question.correctOptionId] += 1;
    for (const tag of question.coverageTags) coverage.add(tag);
    assert.ok(!permanentIds.has(question.permanentQuestionId));
    assert.ok(!semanticFingerprints.has(question.semanticFingerprint));
    assert.ok(!deliveryFingerprints.has(question.deliveryFingerprint));
    permanentIds.add(question.permanentQuestionId);
    semanticFingerprints.add(question.semanticFingerprint);
    deliveryFingerprints.add(question.deliveryFingerprint);
  }

  assert.deepEqual(answerCounts, { A: 20, B: 20, C: 20, D: 20 });
  for (const expected of expectedCoverageByQl[qlId]) {
    assert.ok(coverage.has(expected), `${qlId} missing ${expected}`);
  }
  coverageEvidence[qlId] = [...coverage].sort();
}

assert.equal(permanentIds.size, 320);
assert.equal(semanticFingerprints.size, 320);
assert.equal(deliveryFingerprints.size, 320);

const reviewQuestions = generatePfcPermanentEnglishReviewQuestionsV2_2();
assert.equal(reviewQuestions.length, 64);
const reviewCoverage = new Set(reviewQuestions.flatMap((question) => question.coverageTags));
assert.equal(reviewCoverage.size, 30);
for (const expected of Object.values(expectedCoverageByQl).flat()) {
  assert.ok(reviewCoverage.has(expected), `V2.2 review pack missing ${expected}`);
}
const reviewHtml = renderPfcPermanentEnglishReviewHtmlV2_2(reviewQuestions);
assert.ok(reviewHtml.includes("PFC-001 Permanent English Review V2.2"));
assert.ok(reviewHtml.includes("background:#fff"));
assert.ok(!reviewHtml.includes("background:#f5f5f5"));
assert.ok(reviewHtml.includes("MIXED_HOLE_TRIANGLE_CUT"));
assert.ok(reviewHtml.includes("MIXED_TRIANGLE_SLIT"));
assert.ok(reviewHtml.includes("FOLD_LINE_V_NOTCH"));
assert.ok(reviewHtml.includes("width=\"124\""));
assert.ok(reviewHtml.includes("marker-end="));
assert.ok(!reviewHtml.includes("<script"));

const evidence = {
  authority: PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V2_2,
  status: "PASS_PFC_001_PERMANENT_ENGLISH_RUNTIME_V2_2_REVIEW_CANDIDATE",
  corpus: {
    totalQuestions: corpus.length,
    questionsPerQl: 80,
    uniquePermanentQuestionIds: permanentIds.size,
    uniqueSemanticQuestions: semanticFingerprints.size,
    uniqueDeliveryFingerprints: deliveryFingerprints.size,
    exactAnswerBalancePerQl: { A: 20, B: 20, C: 20, D: 20 },
    coverageByQl: coverageEvidence,
  },
  review: {
    retainedQuestions: reviewQuestions.length,
    coverageModesRepresented: reviewCoverage.size,
    whiteExamSurface: true,
    optionPixels: 124,
    stimulusPixels: 640,
    file: "spa-pfc-001-permanent-english-runtime-v2-2-review.html",
  },
  governance: {
    priorEnglishFreezeSupersededForIntegration: true,
    v2_2LearnerReviewRequired: true,
    v2_2Frozen: false,
    questionStudioRegistered: false,
    questionBankWrites: false,
    testEligible: false,
    automaticPublication: false,
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-permanent-english-runtime-v2-2-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-permanent-english-runtime-v2-2-review.html",
  reviewHtml,
  "utf8",
);
console.log(JSON.stringify(evidence));
