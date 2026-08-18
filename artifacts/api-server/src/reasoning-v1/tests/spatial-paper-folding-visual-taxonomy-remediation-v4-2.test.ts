import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { pfcDiscoveryOptionIsReadableV1 } from "../foundation/spatial/paper-folding-discovery-v1";
import {
  PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_2,
  generatePfcDiscoveryCorpusV4_2,
  generatePfcDiscoveryQuestionV4_2,
  pfcV4_2CoverageTags,
  pfcV4_2RepresentationCoverage,
  renderPfcDiscoveryOptionSvgV4,
  renderPfcDiscoveryReviewHtmlV4,
  renderPfcDiscoveryStimulusSvgV4,
} from "../foundation/spatial/paper-folding-visual-taxonomy-remediation-v4-2";

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

const corpus = generatePfcDiscoveryCorpusV4_2();
assert.equal(corpus.length, 800);
assert.equal(PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_2.executableCoverageModeCount, 30);
assert.equal(PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_2.status, "REMEDIATED_REVIEW_CANDIDATE");

const coverage = new Set(pfcV4_2CoverageTags());
assert.equal(coverage.size, 30);
for (const tag of REQUIRED_COVERAGE) assert.ok(coverage.has(tag), `missing PFC V4.2 coverage ${tag}`);

const semantic = new Set<string>();
const questionIds = new Set<string>();
const answerCounts = { A: 0, B: 0, C: 0, D: 0 };
const semanticByRepresentation = new Map<string, Set<string>>();
for (const question of corpus) {
  assert.equal(question.options.length, 4);
  assert.equal(question.options[question.correctOptionIndex].optionId, question.correctOptionId);
  assert.equal(question.options[question.correctOptionIndex].misconception, "CORRECT");
  assert.equal(question.remediationDiversityAuthorityId, PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_2.authorityId);
  assert.ok(question.coverageTags.length >= 1);
  assert.ok(!semantic.has(question.semanticFingerprint), `duplicate V4.2 semantic question ${question.questionId}`);
  assert.ok(!questionIds.has(question.questionId), `duplicate V4.2 question id ${question.questionId}`);
  semantic.add(question.semanticFingerprint);
  questionIds.add(question.questionId);
  if (!semanticByRepresentation.has(question.representationId)) semanticByRepresentation.set(question.representationId, new Set());
  semanticByRepresentation.get(question.representationId)!.add(question.semanticFingerprint);
  answerCounts[question.correctOptionId] += 1;
  assert.equal(new Set(question.options.map((option) => option.fingerprint)).size, 4);
  for (const option of question.options) assert.ok(pfcDiscoveryOptionIsReadableV1(option));
  assert.ok(!/\(\d+(?:\.\d+)?,\s*\d/.test(question.explanation));
}
assert.equal(semantic.size, 800);
assert.equal(questionIds.size, 800);
assert.deepEqual(answerCounts, { A: 200, B: 200, C: 200, D: 200 });
for (const [representationId, fingerprints] of semanticByRepresentation) {
  assert.equal(fingerprints.size, 80, `${representationId} must retain 80 distinct semantic questions`);
}

for (let index = 2; index < 80; index += 4) {
  const question = generatePfcDiscoveryQuestionV4_2(index);
  assert.deepEqual(question.coverageTags, ["OFF_CENTER_VERTICAL"]);
  assert.equal(question.folds[0].line.a.x, 40);
  assert.ok(question.cuts[0].center.x >= 8 && question.cuts[0].center.x <= 27);
  assert.equal(question.options[question.correctOptionIndex].imprints.length, 2);
}

const cornerFingerprints = new Set(Array.from({ length: 80 }, (_, offset) => generatePfcDiscoveryQuestionV4_2(320 + offset).semanticFingerprint));
assert.equal(cornerFingerprints.size, 80);
const diagonalFingerprints = new Set(Array.from({ length: 80 }, (_, offset) => generatePfcDiscoveryQuestionV4_2(400 + offset).semanticFingerprint));
assert.equal(diagonalFingerprints.size, 80);
const mixedFingerprints = new Set(Array.from({ length: 80 }, (_, offset) => generatePfcDiscoveryQuestionV4_2(480 + offset).semanticFingerprint));
assert.equal(mixedFingerprints.size, 80);
const multiNotchFingerprints = new Set(Array.from({ length: 80 }, (_, offset) => generatePfcDiscoveryQuestionV4_2(640 + offset).semanticFingerprint));
assert.equal(multiNotchFingerprints.size, 80);

const mixedCuts = generatePfcDiscoveryQuestionV4_2(561);
assert.deepEqual(mixedCuts.coverageTags, ["MIXED_HOLE_EDGE_NOTCH"]);
assert.deepEqual(mixedCuts.cuts.map((cut) => cut.visualKind), ["CIRCLE_HOLE", "V_NOTCH"]);
const shapedCuts = generatePfcDiscoveryQuestionV4_2(563);
assert.deepEqual(shapedCuts.coverageTags, ["MIXED_TRIANGLE_SLIT"]);
assert.deepEqual(shapedCuts.cuts.map((cut) => cut.visualKind), ["TRIANGLE_CUT", "STRAIGHT_SLIT"]);

const foldEdgeMulti = generatePfcDiscoveryQuestionV4_2(642);
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
  authority: PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_2,
  status: "PASS_PFC_001_VISUAL_TAXONOMY_REMEDIATION_V4_2",
  corpus: {
    totalQuestions: corpus.length,
    uniqueSemanticQuestions: semantic.size,
    uniqueQuestionIds: questionIds.size,
    answerBalance: answerCounts,
    coverageModeCount: coverage.size,
    requiredCoverageModes: REQUIRED_COVERAGE,
    representationCoverage: pfcV4_2RepresentationCoverage(),
    semanticQuestionsPerRepresentation: Object.fromEntries([...semanticByRepresentation].map(([id, set]) => [id, set.size])),
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
    file: "spa-pfc-001-visual-taxonomy-v4-2-review.html",
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
  "dist/reasoning-v1/spatial/spa-pfc-001-visual-taxonomy-v4-2-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-visual-taxonomy-v4-2-review.html",
  reviewHtml,
  "utf8",
);
console.log(JSON.stringify(evidence));
