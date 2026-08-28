import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { pfcDiscoveryOptionIsReadableV1 } from "../foundation/spatial/paper-folding-discovery-v1";
import {
  PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_1,
  generatePfcDiscoveryCorpusV4_1,
  generatePfcDiscoveryQuestionV4_1,
  pfcV4_1CoverageTags,
  pfcV4_1RepresentationCoverage,
  renderPfcDiscoveryOptionSvgV4,
  renderPfcDiscoveryReviewHtmlV4,
  renderPfcDiscoveryStimulusSvgV4,
} from "../foundation/spatial/paper-folding-visual-taxonomy-remediation-v4-1";

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

const corpus = generatePfcDiscoveryCorpusV4_1();
assert.equal(corpus.length, 800);
assert.equal(PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_1.executableCoverageModeCount, 30);
assert.equal(PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_1.status, "REMEDIATED_REVIEW_CANDIDATE");

const coverage = new Set(pfcV4_1CoverageTags());
assert.equal(coverage.size, 30);
for (const tag of REQUIRED_COVERAGE) assert.ok(coverage.has(tag), `missing PFC V4.1 coverage ${tag}`);

const semantic = new Set<string>();
const answerCounts = { A: 0, B: 0, C: 0, D: 0 };
for (const question of corpus) {
  assert.equal(question.options.length, 4);
  assert.equal(question.options[question.correctOptionIndex].optionId, question.correctOptionId);
  assert.equal(question.options[question.correctOptionIndex].misconception, "CORRECT");
  assert.equal(question.remediationPatchAuthorityId, PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_1.authorityId);
  assert.ok(question.coverageTags.length >= 1);
  assert.ok(!semantic.has(question.semanticFingerprint), `duplicate V4.1 semantic question ${question.questionId}`);
  semantic.add(question.semanticFingerprint);
  answerCounts[question.correctOptionId] += 1;
  for (const option of question.options) assert.ok(pfcDiscoveryOptionIsReadableV1(option));
  assert.ok(!/\(\d+(?:\.\d+)?,\s*\d/.test(question.explanation));
}
assert.equal(semantic.size, 800);
assert.deepEqual(answerCounts, { A: 200, B: 200, C: 200, D: 200 });

for (let index = 2; index < 80; index += 4) {
  const question = generatePfcDiscoveryQuestionV4_1(index);
  assert.deepEqual(question.coverageTags, ["OFF_CENTER_VERTICAL"]);
  assert.equal(question.folds[0].line.a.x, 40);
  assert.ok(question.cuts[0].center.x >= 8 && question.cuts[0].center.x <= 27);
  assert.equal(question.options[question.correctOptionIndex].imprints.length, 2);
}

const foldLineSingle = generatePfcDiscoveryQuestionV4_1(82);
assert.deepEqual(foldLineSingle.coverageTags, ["FOLD_LINE_V_NOTCH"]);
assert.equal(foldLineSingle.cuts[0].center.x, 50);
assert.equal(foldLineSingle.options[foldLineSingle.correctOptionIndex].imprints.length, 1);
assert.equal(foldLineSingle.options[foldLineSingle.correctOptionIndex].imprints[0].contact, "INTERIOR");

const fourCorners = [320, 321, 322, 323].map((index) => generatePfcDiscoveryQuestionV4_1(index));
assert.deepEqual(fourCorners.map((question) => question.coverageTags[0]), [
  "CORNER_TOP_LEFT",
  "CORNER_TOP_RIGHT",
  "CORNER_BOTTOM_RIGHT",
  "CORNER_BOTTOM_LEFT",
]);

const mixedCuts = generatePfcDiscoveryQuestionV4_1(561);
assert.deepEqual(mixedCuts.coverageTags, ["MIXED_HOLE_EDGE_NOTCH"]);
assert.deepEqual(mixedCuts.cuts.map((cut) => cut.visualKind), ["CIRCLE_HOLE", "V_NOTCH"]);

const shapedCuts = generatePfcDiscoveryQuestionV4_1(563);
assert.deepEqual(shapedCuts.coverageTags, ["MIXED_TRIANGLE_SLIT"]);
assert.deepEqual(shapedCuts.cuts.map((cut) => cut.visualKind), ["TRIANGLE_CUT", "STRAIGHT_SLIT"]);

const foldEdgeMulti = generatePfcDiscoveryQuestionV4_1(642);
assert.deepEqual(foldEdgeMulti.coverageTags, ["MULTIFOLD_FOLD_EDGE_V_NOTCH"]);
assert.ok(foldEdgeMulti.options[foldEdgeMulti.correctOptionIndex].imprints.length < foldEdgeMulti.foldedLayerCounts.at(-1)!);
assert.ok(foldEdgeMulti.options[foldEdgeMulti.correctOptionIndex].imprints.every((imprint) => imprint.contact === "INTERIOR"));

const stimulus = renderPfcDiscoveryStimulusSvgV4(mixedCuts, 640);
assert.ok(stimulus.includes("marker-end="));
assert.ok(stimulus.includes("stroke-dasharray=\"4 3\""));
assert.ok(stimulus.includes("fill=\"#eeeeee\""));
assert.ok(stimulus.includes("<path"));
assert.ok(stimulus.includes("Fold 1"));
assert.ok(!stimulus.includes("<script"));

const shapedOption = renderPfcDiscoveryOptionSvgV4(shapedCuts.options[shapedCuts.correctOptionIndex], 124);
assert.ok(shapedOption.includes("<polygon"));
assert.ok(shapedOption.includes("stroke-linecap=\"round\""));

const firstByCoverage = new Map<string, (typeof corpus)[number]>();
for (const question of corpus) {
  for (const tag of question.coverageTags) if (!firstByCoverage.has(tag)) firstByCoverage.set(tag, question);
}
const reviewQuestions = REQUIRED_COVERAGE.map((tag) => firstByCoverage.get(tag)!);
assert.equal(reviewQuestions.length, 30);
const reviewHtml = renderPfcDiscoveryReviewHtmlV4(reviewQuestions);
assert.ok(reviewHtml.includes("background:#fff"));
assert.ok(!reviewHtml.includes("background:#f5f5f5"));
assert.ok(reviewHtml.includes("FOLD_LINE_V_NOTCH"));
assert.ok(reviewHtml.includes("MIXED_TRIANGLE_SLIT"));
assert.ok(!reviewHtml.includes("<script"));

const evidence = {
  authority: PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_1,
  status: "PASS_PFC_001_VISUAL_TAXONOMY_REMEDIATION_V4_1",
  corpus: {
    totalQuestions: corpus.length,
    uniqueSemanticQuestions: semantic.size,
    answerBalance: answerCounts,
    coverageModeCount: coverage.size,
    requiredCoverageModes: REQUIRED_COVERAGE,
    representationCoverage: pfcV4_1RepresentationCoverage(),
  },
  presentation: {
    whiteExamSurface: true,
    preFoldStateShown: true,
    movingSideShaded: true,
    foldDirectionArrow: true,
    dashedCrease: true,
    vNotchPath: true,
    semicircleNotch: true,
    triangleCut: true,
    straightSlit: true,
    foldLineCutCoalescing: true,
    offCenterFoldReachabilityCorrected: true,
  },
  review: {
    questions: reviewQuestions.length,
    onePerCoverageMode: true,
    file: "spa-pfc-001-visual-taxonomy-v4-1-review.html",
  },
  governance: {
    oldEnglishFreezeSupersededForIntegration: true,
    newEnglishReviewRequired: true,
    questionStudioRegistered: false,
    automaticPublication: false,
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-visual-taxonomy-v4-1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-visual-taxonomy-v4-1-review.html",
  reviewHtml,
  "utf8",
);
console.log(JSON.stringify(evidence));
