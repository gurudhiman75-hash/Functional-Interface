import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { normalizeGeneratedQuestionPayload } from "../../lib/admin-question-conversion";
import { productionPayloadV5 } from "../../routes/admin-question-studio-spatial-v5";
import {
  FIGURE_MATRIX_FREEZE_AUTHORITY_V1,
  FIGURE_MATRIX_INTERNAL_ACTIVATION_V1,
  FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1,
} from "../foundation/spatial/figure-matrix-freeze-v1";
import type { FigureMatrixQuestionStudioV1 } from "../foundation/spatial/figure-matrix-question-studio-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V8,
  SPATIAL_QUESTION_STUDIO_QLS_V8,
} from "../foundation/spatial/spatial-question-studio-integration-v8";
import {
  generateSpatialProductionStudioBatchV8,
  generateSpatialProductionStudioQuestionV8,
} from "../foundation/spatial/spatial-question-studio-production-v8";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V1 } from "../foundation/spatial/spatial-question-studio-integration-v6";
import { generateSpatialProductionStudioQuestionV1 } from "../foundation/spatial/spatial-question-studio-production-v6";

type FrozenFmtQuestion = FigureMatrixQuestionStudioV1 & Readonly<{
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V8.integrationAuthority;
}>;

const FMT_QLS = [
  "SPA-QL-055", "SPA-QL-056", "SPA-QL-057", "SPA-QL-058", "SPA-QL-059", "SPA-QL-060",
] as const;

assert.equal(FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1.approved, true);
assert.equal(FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1.reviewedPullRequest, 1432);
assert.equal(FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1.reviewedHeadSha, "f4c13d4be6d190d8f64737f26749aea157ae916f");
assert.equal(FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1.reviewedCi.workflowRunId, 34017570536);
assert.equal(FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1.reviewedCi.artifactId, 9984396659);
assert.equal(
  FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1.reviewedCi.artifactDigest,
  "sha256:fc5c5844e9d06ff0cd8e4ac949da537287a41db39f242c351a89520a7659d4a2",
);
assert.equal(FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1.reviewedCi.reviewedHtmlSha256, "9d3d0cddae1332830228ebf27ee7d299cabbb8e2af9db23fafca4c9931d4bd85");
assert.equal(FIGURE_MATRIX_FREEZE_AUTHORITY_V1.learnerContentFrozen, true);
assert.equal(FIGURE_MATRIX_FREEZE_AUTHORITY_V1.semanticMatrixRuleContractFrozen, true);
assert.equal(FIGURE_MATRIX_FREEZE_AUTHORITY_V1.sourceVariantCoverageFrozen, true);
assert.equal(FIGURE_MATRIX_FREEZE_AUTHORITY_V1.geometryFrozen, true);
assert.equal(FIGURE_MATRIX_FREEZE_AUTHORITY_V1.rendererFrozen, true);
assert.equal(FIGURE_MATRIX_FREEZE_AUTHORITY_V1.perceptualEquivalenceGuardFrozen, true);
assert.equal(FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable, true);
assert.equal(FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.persistenceAllowed, true);
assert.equal(FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.questionBankWritable, true);
assert.equal(FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.testBuilderEligible, true);
assert.equal(FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.mockTestEligible, false);
assert.equal(FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.publicReleaseAuthorized, false);
assert.equal(FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.studentDeliveryAuthorized, false);
assert.equal(FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.automaticStudentPublication, false);

assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V8.permanentQlCount, 55);
assert.deepEqual(SPATIAL_QUESTION_STUDIO_QLS_V8.slice(-6).map((item) => item.permanentQlId), [...FMT_QLS]);
assert.ok(SPATIAL_QUESTION_STUDIO_PACKAGE_V8.chapters.includes("FMT-001"));
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V8.figureMatrixPermanentQlCount, 6);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V8.integrationAuthority);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount, 55);

let checked = 0;
for (const language of ["en", "hi", "pa"] as const) {
  for (const qlId of FMT_QLS) {
    for (let index = 1; index <= 2; index += 1) {
      const seed = `FMT-FREEZE:${qlId}:${language}:${index}`;
      const question = generateSpatialProductionStudioQuestionV8({ qlId, language, seed }) as FrozenFmtQuestion;
      const viaCurrentAlias = generateSpatialProductionStudioQuestionV1({ qlId, language, seed }) as FrozenFmtQuestion;
      assert.deepEqual(viaCurrentAlias, question, `current production alias must resolve FMT-001 for ${qlId}/${language}/${index}`);
      assert.equal(question.qlId, qlId);
      assert.equal(question.chapterCode, "FMT-001");
      assert.equal(question.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V8.integrationAuthority);
      assert.equal(question.sourceFreezeAuthority, FIGURE_MATRIX_FREEZE_AUTHORITY_V1.authorityId);
      assert.equal(question.review.productOwnerApproved, true);
      assert.equal(question.review.learnerContentFrozen, true);
      assert.equal(question.lifecycle.questionStudioDiscoverable, true);
      assert.equal(question.lifecycle.persistenceAllowed, true);
      assert.equal(question.lifecycle.questionBankWritable, true);
      assert.equal(question.lifecycle.testBuilderEligible, true);
      assert.equal(question.lifecycle.mockTestEligible, false);
      assert.equal(question.lifecycle.publicReleaseAuthorized, false);
      assert.equal(question.lifecycle.studentDeliveryAuthorized, false);
      assert.equal(question.lifecycle.automaticStudentPublication, false);
      assert.equal(question.renderer.kind, "SVG_WITH_IMAGE_OPTIONS");
      assert.equal(question.stimulusSvgs.length, 1);
      assert.equal(question.optionSvgs.length, 4);
      assert.equal(new Set(question.optionSvgs).size, 4);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
      assert.equal(question.answer, question.optionLabels[question.correctIndex]);
      assert.match(question.explanationIllustrationSvg, /^<svg\b/);
      assert.ok(question.explanation.observation.length > 10);
      assert.ok(question.explanation.rule.length > 10);
      assert.ok(question.explanation.application.length > 10);
      assert.ok(question.explanation.check.length > 10);
      assert.equal(question.validation.uniqueAnswer, true);
      assert.equal(question.validation.semanticCellStateIsAuthority, true);
      assert.equal(question.validation.solverRecomputedMissingCell, true);
      assert.equal(question.validation.everyDistractorHasSemanticFailure, true);
      assert.equal(question.validation.approvedV2_4RuntimePreserved, true);
      checked += 1;
    }
  }
}

for (const qlId of FMT_QLS) {
  const seed = `FMT-LANGUAGE-PARITY:${qlId}:7`;
  const en = generateSpatialProductionStudioQuestionV8({ qlId, language: "en", seed }) as FrozenFmtQuestion;
  for (const language of ["hi", "pa"] as const) {
    const localized = generateSpatialProductionStudioQuestionV8({ qlId, language, seed }) as FrozenFmtQuestion;
    assert.equal(localized.geometryFingerprint, en.geometryFingerprint);
    assert.equal(localized.correctIndex, en.correctIndex);
    assert.deepEqual(localized.solveFacts.semanticOptionKeys, en.solveFacts.semanticOptionKeys);
    assert.equal(localized.solveFacts.semanticAnswerKey, en.solveFacts.semanticAnswerKey);
  }
}

const orientation = generateSpatialProductionStudioQuestionV8({
  qlId: "SPA-QL-058",
  language: "en",
  seed: "FMT-ORIENTATION-CYCLE-3",
}) as FrozenFmtQuestion;
assert.equal(orientation.solveFacts.sourceVariant, "ORIENTATION_CYCLE");
assert.equal(orientation.solveFacts.orientationVisualMotif, "ASYMMETRIC_ARROW");
assert.equal(orientation.validation.rotationalSymmetryNormalizedBeforeOptionUniqueness, true);
assert.equal(orientation.validation.orientationCycleUsesAsymmetricDirectionalGlyph, true);
assert.equal(orientation.validation.perceptualOptionEquivalenceRejected, true);
assert.equal(new Set(orientation.solveFacts.perceptualOrientationKeys).size, 4);

const batch = generateSpatialProductionStudioBatchV8({
  seed: "FMT-001:QUESTION-STUDIO:APPROVED-BATCH",
  chapterCode: "FMT-001",
  count: 18,
  language: "en",
});
assert.equal(batch.questions.length, 18);
assert.ok(batch.questions.every((question) => question.chapterCode === "FMT-001"));
assert.ok(new Set(batch.questions.map((question) => question.qlId)).size >= 5);
assert.equal(batch.generationContext.mockTestEligible, false);
assert.equal(batch.generationContext.publicReleaseAuthorized, false);
assert.equal(batch.generationContext.studentDeliveryAuthorized, false);
assert.equal(batch.generationContext.automaticStudentPublication, false);

const conversionQuestion = generateSpatialProductionStudioQuestionV8({
  qlId: "SPA-QL-060",
  language: "en",
  seed: "FMT-001:QUESTION-BANK:COMPLETED-MATRIX",
}) as FrozenFmtQuestion;
const persistedPayload = productionPayloadV5(conversionQuestion);
assert.equal(typeof persistedPayload.explanationIllustrationSvg, "string");
assert.equal(persistedPayload.optionSvgs?.length, 4);
assert.equal(persistedPayload.questionBankWritable, true);
assert.equal(persistedPayload.testBuilderEligible, true);
assert.equal(persistedPayload.mockTestEligible, false);
assert.equal(persistedPayload.publicReleaseAuthorized, false);
assert.equal(persistedPayload.studentDeliveryAuthorized, false);

const normalized = normalizeGeneratedQuestionPayload(persistedPayload, {
  itemId: "fmt-001-completed-matrix",
  generationRunCode: "FMT-001-QB-PROOF",
});
assert.match(normalized.explanation, /data:image\/svg\+xml;base64,/);
assert.equal(
  (normalized.answerModel.generation as Record<string, unknown>).explanationVisualContent,
  "spatial_svg_data_image_v1",
);

const repoRoot = resolve(import.meta.dirname, "../../../../..");
const spatialPanel = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioSpatialReviewPanel.tsx"), "utf8");
const spatialApi = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/features/question-studio/spatial-review-api.ts"), "utf8");
const spatialWorkflow = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-spatial-workflow.ts"), "utf8");
assert.ok(spatialApi.includes("'FMT-001'"), "Spatial admin API type must expose Figure Matrix.");
assert.ok(spatialPanel.includes("'FMT-001': 'Figure Matrix'"), "Spatial panel must expose the Figure Matrix chapter filter.");
assert.ok(spatialPanel.includes("Solution: completed matrix with the missing cell filled"), "Spatial panel must label the FMT completed-matrix illustration correctly.");
assert.ok(spatialWorkflow.includes("SPATIAL_QUESTION_STUDIO_PACKAGE_V1 as SPATIAL_QUESTION_STUDIO_PACKAGE_V6"), "Shared SPA workflow must retain the compatibility-safe current alias.");

console.log(JSON.stringify({
  status: "PASS_FMT_001_APPROVED_FREEZE_QUESTION_STUDIO_V1",
  checkedQuestions: checked,
  packageQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V8.permanentQlCount,
  fmtQlIds: FIGURE_MATRIX_FREEZE_AUTHORITY_V1.permanentQlIds,
  approvalRunId: FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1.reviewedCi.workflowRunId,
  approvalArtifactId: FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1.reviewedCi.artifactId,
  completedMatrixIllustrationPersisted: true,
  perceptualOrientationGuardFrozen: true,
  questionBankSafe: true,
  mockPublicStudentGatesRemainClosed: true,
}, null, 2));
