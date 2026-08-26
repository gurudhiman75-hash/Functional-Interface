import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { pfcDiscoveryOptionIsReadableV1 } from "../foundation/spatial/paper-folding-discovery-v1";
import {
  PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V2_3,
  generatePfcPermanentEnglishCorpusV2_3,
  generatePfcPermanentEnglishQlV2_3,
  generatePfcPermanentEnglishReviewQuestionsV2_3,
  renderPfcPermanentEnglishReviewHtmlV2_3,
} from "../foundation/spatial/paper-folding-permanent-english-runtime-v2-3";
import { PFC_001_EXAM_STANDARD_AUTHORITY_V5, renderPfcExamStimulusSvgV5 } from "../foundation/spatial/paper-folding-exam-standard-v5";

const qlIds = ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038"] as const;
const corpus = generatePfcPermanentEnglishCorpusV2_3();
assert.equal(corpus.length, 320);
assert.equal(PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V2_3.questionsPerQl, 80);
assert.equal(PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V2_3.totalQuestions, 320);
assert.equal(PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V2_3.semanticAuthority, "PFC-001-VISUAL-TAXONOMY-REMEDIATION-V4.2");
assert.equal(PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V2_3.presentationAuthority, PFC_001_EXAM_STANDARD_AUTHORITY_V5.authorityId);
assert.equal(PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V2_3.priorFreezeStatus, "SUPERSEDED_FOR_INTEGRATION_PENDING_V2_3_LEARNER_REVIEW");

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
const canonicalIds = new Set<string>();
const semanticFingerprints = new Set<string>();
const deliveryFingerprints = new Set<string>();
const sourceIds = new Set<string>();
const coverageEvidence: Record<string, string[]> = {};

for (const qlId of qlIds) {
  const questions = generatePfcPermanentEnglishQlV2_3(qlId);
  assert.equal(questions.length, 80);
  const answerCounts = { A: 0, B: 0, C: 0, D: 0 };
  const coverage = new Set<string>();

  for (const question of questions) {
    assert.equal(question.permanentQlId, qlId);
    assert.equal(question.language, "en");
    assert.equal(question.locale, "en-IN");
    assert.equal(question.examStandardAuthorityId, PFC_001_EXAM_STANDARD_AUTHORITY_V5.authorityId);
    assert.ok(question.stem.includes("folded in the arrow direction"));
    assert.ok(question.explanation.includes(`option ${question.correctOptionId}`));
    assert.ok(!/\(\d+(?:\.\d+)?,\s*\d/.test(question.explanation));
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.fingerprint)).size, 4);
    assert.equal(question.options[question.correctOptionIndex].misconception, "CORRECT");
    assert.ok(question.options.every(pfcDiscoveryOptionIsReadableV1));
    assert.ok(renderPfcExamStimulusSvgV5(question, 680).includes("marker-end="));

    answerCounts[question.correctOptionId] += 1;
    for (const tag of question.coverageTags) coverage.add(tag);
    assert.ok(!permanentIds.has(question.permanentQuestionId));
    assert.ok(!canonicalIds.has(question.canonicalQuestionId));
    assert.ok(!semanticFingerprints.has(question.semanticFingerprint));
    assert.ok(!deliveryFingerprints.has(question.deliveryFingerprint));
    assert.ok(!sourceIds.has(question.sourceDiscoveryQuestionId));
    permanentIds.add(question.permanentQuestionId);
    canonicalIds.add(question.canonicalQuestionId);
    semanticFingerprints.add(question.semanticFingerprint);
    deliveryFingerprints.add(question.deliveryFingerprint);
    sourceIds.add(question.sourceDiscoveryQuestionId);
  }

  assert.deepEqual(answerCounts, { A: 20, B: 20, C: 20, D: 20 });
  for (const expected of expectedCoverageByQl[qlId]) {
    assert.ok(coverage.has(expected), `${qlId} missing ${expected}`);
  }
  coverageEvidence[qlId] = [...coverage].sort();
}

assert.equal(permanentIds.size, 320);
assert.equal(canonicalIds.size, 320);
assert.equal(semanticFingerprints.size, 320);
assert.equal(deliveryFingerprints.size, 320);
assert.equal(sourceIds.size, 320);

const ql038 = generatePfcPermanentEnglishQlV2_3("SPA-QL-038");
const triangleQuestion = ql038.find((question) => question.sourceDiscoveryIndex === 562);
assert.ok(triangleQuestion);
assert.deepEqual(triangleQuestion.coverageTags, ["MIXED_HOLE_TRIANGLE_CUT"]);
const triangleImprints = triangleQuestion.options[triangleQuestion.correctOptionIndex].imprints
  .filter((imprint) => imprint.visualKind === "TRIANGLE_CUT");
assert.equal(triangleImprints.length, 4);
assert.ok(triangleImprints.every((imprint) => imprint.visualDirection));
assert.deepEqual([...new Set(triangleImprints.map((imprint) => Math.sign(imprint.visualDirection!.y)))].sort(), [-1, 1]);

const slitQuestion = ql038.find((question) => question.sourceDiscoveryIndex === 563);
assert.ok(slitQuestion);
assert.deepEqual(slitQuestion.coverageTags, ["MIXED_TRIANGLE_SLIT"]);
assert.equal(slitQuestion.options[slitQuestion.correctOptionIndex].imprints.filter((imprint) => imprint.visualKind === "STRAIGHT_SLIT").length, 4);

const reviewQuestions = generatePfcPermanentEnglishReviewQuestionsV2_3();
assert.equal(reviewQuestions.length, 64);
const reviewCoverage = new Set(reviewQuestions.flatMap((question) => question.coverageTags));
assert.equal(reviewCoverage.size, 30);
for (const expected of Object.values(expectedCoverageByQl).flat()) {
  assert.ok(reviewCoverage.has(expected), `V2.3 review pack missing ${expected}`);
}
const reviewHtml = renderPfcPermanentEnglishReviewHtmlV2_3(reviewQuestions);
assert.ok(reviewHtml.includes("PFC-001 Permanent English Review V2.3"));
assert.ok(reviewHtml.includes("background:#fff"));
assert.ok(!reviewHtml.includes("background:#f5f5f5"));
assert.ok(reviewHtml.includes("MIXED_HOLE_TRIANGLE_CUT"));
assert.ok(reviewHtml.includes("MIXED_TRIANGLE_SLIT"));
assert.ok(reviewHtml.includes("FOLD_LINE_V_NOTCH"));
assert.ok(reviewHtml.includes("width=\"132\""));
assert.ok(reviewHtml.includes("marker-end="));
assert.ok(reviewHtml.includes("stroke=\"white\" stroke-width=\"5.2\""));
assert.ok(!reviewHtml.includes("<script"));

const evidence = {
  authority: PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V2_3,
  status: "PASS_PFC_001_PERMANENT_ENGLISH_RUNTIME_V2_3_REVIEW_CANDIDATE",
  corpus: {
    totalQuestions: corpus.length,
    questionsPerQl: 80,
    uniquePermanentQuestionIds: permanentIds.size,
    uniqueCanonicalQuestionIds: canonicalIds.size,
    uniqueSemanticQuestions: semanticFingerprints.size,
    uniqueDeliveryFingerprints: deliveryFingerprints.size,
    sourceDiscoveryQuestionsUsed: sourceIds.size,
    exactAnswerBalancePerQl: { A: 20, B: 20, C: 20, D: 20 },
    coverageByQl: coverageEvidence,
  },
  presentation: {
    authority: PFC_001_EXAM_STANDARD_AUTHORITY_V5.authorityId,
    whiteExamSurface: true,
    openBoundaryNotches: true,
    orientedTrianglePropagation: true,
    orientedSlitPropagation: true,
    packetFitTransform: true,
  },
  review: {
    retainedQuestions: reviewQuestions.length,
    coverageModesRepresented: reviewCoverage.size,
    optionPixels: 132,
    stimulusPixels: 680,
    file: "spa-pfc-001-permanent-english-runtime-v2-3-review.html",
  },
  governance: {
    priorEnglishFreezeSupersededForIntegration: true,
    v2_3LearnerReviewRequired: true,
    v2_3Frozen: false,
    hindiPunjabiV2_3Generated: false,
    questionStudioRegistered: false,
    questionBankWrites: false,
    testEligible: false,
    automaticPublication: false,
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-permanent-english-runtime-v2-3-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-permanent-english-runtime-v2-3-review.html",
  reviewHtml,
  "utf8",
);
console.log(JSON.stringify(evidence));
