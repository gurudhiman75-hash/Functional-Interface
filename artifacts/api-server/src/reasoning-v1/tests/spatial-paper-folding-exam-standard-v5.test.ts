import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { pfcDiscoveryOptionIsReadableV1 } from "../foundation/spatial/paper-folding-discovery-v1";
import {
  PFC_001_EXAM_STANDARD_AUTHORITY_V5,
  generatePfcExamCorpusV5,
  generatePfcExamQuestionV5,
  renderPfcExamOptionSvgV5,
  renderPfcExamReviewHtmlV5,
  renderPfcExamStimulusSvgV5,
} from "../foundation/spatial/paper-folding-exam-standard-v5";

const REQUIRED_COVERAGE = [
  "SINGLE_VERTICAL_CENTER",
  "SINGLE_HORIZONTAL_CENTER",
  "OFF_CENTER_VERTICAL",
  "OFF_CENTER_HORIZONTAL",
  "OUTER_V_NOTCH",
  "OUTER_SEMICIRCLE_NOTCH",
  "FOLD_LINE_V_NOTCH",
  "FOLD_LINE_SEMICIRCLE_NOTCH",
  "PERPENDICULAR_VERTICAL_THEN_HORIZONTAL",
  "PERPENDICULAR_HORIZONTAL_THEN_VERTICAL",
  "REPEATED_VERTICAL",
  "REPEATED_HORIZONTAL",
  "CORNER_TOP_LEFT",
  "CORNER_TOP_RIGHT",
  "CORNER_BOTTOM_RIGHT",
  "CORNER_BOTTOM_LEFT",
  "DIAGONAL_MAIN",
  "DIAGONAL_ANTI",
  "MIXED_AXIAL_THEN_DIAGONAL",
  "MIXED_DIAGONAL_THEN_AXIAL",
  "MULTI_TWO_HOLES",
  "MIXED_HOLE_EDGE_NOTCH",
  "MIXED_HOLE_TRIANGLE_CUT",
  "MIXED_TRIANGLE_SLIT",
  "MULTIFOLD_OUTER_V_NOTCH",
  "MULTIFOLD_OUTER_SEMICIRCLE_NOTCH",
  "MULTIFOLD_FOLD_EDGE_V_NOTCH",
  "MULTIFOLD_FOLD_EDGE_SEMICIRCLE_NOTCH",
  "THREE_FOLD_VERTICAL_HORIZONTAL_VERTICAL",
  "THREE_FOLD_HORIZONTAL_VERTICAL_HORIZONTAL",
] as const;

const corpus = generatePfcExamCorpusV5();
assert.equal(corpus.length, 800);
assert.equal(PFC_001_EXAM_STANDARD_AUTHORITY_V5.coverageModeCount, 30);
assert.equal(PFC_001_EXAM_STANDARD_AUTHORITY_V5.semanticAuthority, "PFC-001-VISUAL-TAXONOMY-REMEDIATION-V4.2");

const semantic = new Set<string>();
const coverage = new Set<string>();
const answerCounts = { A: 0, B: 0, C: 0, D: 0 };
for (const question of corpus) {
  assert.equal(question.examStandardAuthorityId, PFC_001_EXAM_STANDARD_AUTHORITY_V5.authorityId);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.fingerprint)).size, 4);
  assert.equal(question.options[question.correctOptionIndex].misconception, "CORRECT");
  assert.ok(question.options.every(pfcDiscoveryOptionIsReadableV1));
  assert.ok(!semantic.has(question.semanticFingerprint), `duplicate PFC V5 semantic question ${question.questionId}`);
  semantic.add(question.semanticFingerprint);
  for (const tag of question.coverageTags) coverage.add(tag);
  answerCounts[question.correctOptionId] += 1;
}
assert.equal(semantic.size, 800);
assert.equal(coverage.size, 30);
for (const tag of REQUIRED_COVERAGE) assert.ok(coverage.has(tag));
assert.deepEqual(answerCounts, { A: 200, B: 200, C: 200, D: 200 });

const orientedTriangle = generatePfcExamQuestionV5(562);
assert.deepEqual(orientedTriangle.coverageTags, ["MIXED_HOLE_TRIANGLE_CUT"]);
const triangleImprints = orientedTriangle.options[orientedTriangle.correctOptionIndex].imprints
  .filter((imprint) => imprint.visualKind === "TRIANGLE_CUT");
assert.equal(triangleImprints.length, 4);
assert.ok(triangleImprints.every((imprint) => imprint.visualDirection));
const verticalDirections = new Set(triangleImprints.map((imprint) => Math.sign(imprint.visualDirection!.y)));
assert.deepEqual([...verticalDirections].sort(), [-1, 1]);

const triangleAndSlit = generatePfcExamQuestionV5(563);
const shapedCorrect = triangleAndSlit.options[triangleAndSlit.correctOptionIndex].imprints;
assert.equal(shapedCorrect.filter((imprint) => imprint.visualKind === "TRIANGLE_CUT").length, 4);
assert.equal(shapedCorrect.filter((imprint) => imprint.visualKind === "STRAIGHT_SLIT").length, 4);
assert.ok(shapedCorrect.filter((imprint) => imprint.visualKind === "STRAIGHT_SLIT").every((imprint) => imprint.visualDirection));

const vNotchQuestion = generatePfcExamQuestionV5(80);
const vNotchSvg = renderPfcExamStimulusSvgV5(vNotchQuestion, 680);
assert.ok(vNotchSvg.includes("stroke=\"white\" stroke-width=\"5.2\""));
assert.ok(vNotchSvg.includes("fill=\"none\" stroke=\"black\""));
assert.ok(vNotchSvg.includes("stroke-linejoin=\"round\""));

const roundedNotchQuestion = generatePfcExamQuestionV5(81);
const roundedSvg = renderPfcExamStimulusSvgV5(roundedNotchQuestion, 680);
assert.ok(roundedSvg.includes(" Q "));
assert.ok(roundedSvg.includes("stroke=\"white\" stroke-width=\"5.2\""));

const offCenterQuestion = generatePfcExamQuestionV5(2);
const offCenterSvg = renderPfcExamStimulusSvgV5(offCenterQuestion, 680);
assert.ok(offCenterSvg.includes("transform=\"translate("));
assert.ok(offCenterSvg.includes("scale("));
assert.ok(offCenterSvg.includes("Cut / Punch"));

const foldQuestion = generatePfcExamQuestionV5(160);
const foldSvg = renderPfcExamStimulusSvgV5(foldQuestion, 680);
assert.ok(foldSvg.includes("stroke-dasharray=\"4 3\""));
assert.ok(foldSvg.includes("marker-end="));
const shadeIndex = foldSvg.indexOf("fill=\"#d9d9d9\"");
const outlineIndex = foldSvg.indexOf("fill=\"white\" fill-opacity=\"0.01\"");
assert.ok(shadeIndex >= 0 && outlineIndex > shadeIndex, "moving-side shade must render behind the paper outline");

const circleOption = renderPfcExamOptionSvgV5(generatePfcExamQuestionV5(0).options[generatePfcExamQuestionV5(0).correctOptionIndex], 132);
assert.ok(circleOption.includes("fill=\"black\""));
const triangleOption = renderPfcExamOptionSvgV5(orientedTriangle.options[orientedTriangle.correctOptionIndex], 132);
assert.ok(triangleOption.includes("<polygon"));

const firstByCoverage = new Map<string, (typeof corpus)[number]>();
for (const question of corpus) {
  for (const tag of question.coverageTags) if (!firstByCoverage.has(tag)) firstByCoverage.set(tag, question);
}
const reviewQuestions = REQUIRED_COVERAGE.map((tag) => firstByCoverage.get(tag)!);
assert.equal(reviewQuestions.length, 30);
const reviewHtml = renderPfcExamReviewHtmlV5(reviewQuestions);
assert.ok(reviewHtml.includes("PFC-001 Exam Standard Review V5"));
assert.ok(reviewHtml.includes("background:#fff"));
assert.ok(!reviewHtml.includes("background:#f5f5f5"));
assert.ok(reviewHtml.includes("width=\"132\""));
assert.ok(reviewHtml.includes("marker-end="));
assert.ok(!reviewHtml.includes("<script"));

const evidence = {
  authority: PFC_001_EXAM_STANDARD_AUTHORITY_V5,
  status: "PASS_PFC_001_EXAM_STANDARD_V5",
  corpus: {
    totalQuestions: corpus.length,
    uniqueSemanticQuestions: semantic.size,
    coverageModeCount: coverage.size,
    answerBalance: answerCounts,
  },
  visualProofs: {
    pureWhiteSurface: true,
    packetFitTransform: true,
    movingShadeBehindOutline: true,
    dashedCrease: true,
    foldArrow: true,
    openVNotchMouth: true,
    openRoundedNotchMouth: true,
    triangleOrientationReflected: true,
    slitOrientationTracked: true,
    blackInteriorExamMarks: true,
  },
  review: {
    questions: reviewQuestions.length,
    allCoverageModesRepresented: true,
    file: "spa-pfc-001-exam-standard-v5-review.html",
  },
  governance: {
    learnerReviewRequired: true,
    frozen: false,
    questionStudioRegistered: false,
    automaticPublication: false,
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-exam-standard-v5-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-exam-standard-v5-review.html",
  reviewHtml,
  "utf8",
);
console.log(JSON.stringify(evidence));
