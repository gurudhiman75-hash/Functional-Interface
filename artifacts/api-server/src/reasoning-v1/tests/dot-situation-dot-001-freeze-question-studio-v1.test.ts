import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { normalizeGeneratedQuestionPayload } from "../../lib/admin-question-conversion";
import { productionPayloadV5 } from "../../routes/admin-question-studio-spatial-v5";
import {
  DOT_SITUATION_FREEZE_AUTHORITY_V1,
  DOT_SITUATION_INTERNAL_ACTIVATION_V1,
  DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1,
} from "../foundation/spatial/dot-situation-freeze-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V7,
  SPATIAL_QUESTION_STUDIO_QLS_V7,
} from "../foundation/spatial/spatial-question-studio-integration-v7";
import {
  generateSpatialProductionStudioBatchV7,
  generateSpatialProductionStudioQuestionV7,
} from "../foundation/spatial/spatial-question-studio-production-v7";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V1 } from "../foundation/spatial/spatial-question-studio-integration-v6";
import { generateSpatialProductionStudioQuestionV1 } from "../foundation/spatial/spatial-question-studio-production-v6";

assert.equal(DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1.approved, true);
assert.equal(DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1.reviewedPullRequest, 1421);
assert.equal(DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1.reviewedCi.workflowRunId, 33961956914);
assert.equal(DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1.reviewedCi.artifactId, 9968230353);
assert.equal(
  DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1.reviewedCi.artifactDigest,
  "sha256:e0575676cea7bc58f079d081256824929fe5e349b93b9b8abd7bc152d6706c4d",
);
assert.equal(DOT_SITUATION_FREEZE_AUTHORITY_V1.learnerContentFrozen, true);
assert.equal(DOT_SITUATION_FREEZE_AUTHORITY_V1.semanticSignatureContractFrozen, true);
assert.equal(DOT_SITUATION_FREEZE_AUTHORITY_V1.geometryFrozen, true);
assert.equal(DOT_SITUATION_FREEZE_AUTHORITY_V1.rendererFrozen, true);
assert.equal(DOT_SITUATION_FREEZE_AUTHORITY_V1.explanationVisualContractFrozen, true);
assert.equal(DOT_SITUATION_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable, true);
assert.equal(DOT_SITUATION_INTERNAL_ACTIVATION_V1.persistenceAllowed, true);
assert.equal(DOT_SITUATION_INTERNAL_ACTIVATION_V1.questionBankWritable, true);
assert.equal(DOT_SITUATION_INTERNAL_ACTIVATION_V1.testBuilderEligible, true);
assert.equal(DOT_SITUATION_INTERNAL_ACTIVATION_V1.mockTestEligible, false);
assert.equal(DOT_SITUATION_INTERNAL_ACTIVATION_V1.publicReleaseAuthorized, false);
assert.equal(DOT_SITUATION_INTERNAL_ACTIVATION_V1.studentDeliveryAuthorized, false);
assert.equal(DOT_SITUATION_INTERNAL_ACTIVATION_V1.automaticStudentPublication, false);

assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V7.permanentQlCount, 49);
assert.equal(SPATIAL_QUESTION_STUDIO_QLS_V7.at(-1)?.permanentQlId, "SPA-QL-054");
assert.ok(SPATIAL_QUESTION_STUDIO_PACKAGE_V7.chapters.includes("DOT-001"));
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V7.dotSituationPermanentQlCount, 1);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V7.integrationAuthority);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount, 49);

let checked = 0;
for (const language of ["en", "hi", "pa"] as const) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `DOT-FREEZE:${language}:${index}`;
    const question = generateSpatialProductionStudioQuestionV7({
      qlId: "SPA-QL-054",
      language,
      seed,
    });
    const viaCurrentAlias = generateSpatialProductionStudioQuestionV1({
      qlId: "SPA-QL-054",
      language,
      seed,
    });
    assert.deepEqual(viaCurrentAlias, question, `current production alias must resolve DOT-001 for ${language}/${index}`);
    assert.equal(question.qlId, "SPA-QL-054");
    assert.equal(question.chapterCode, "DOT-001");
    assert.equal(question.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V7.integrationAuthority);
    assert.equal(question.sourceFreezeAuthority, DOT_SITUATION_FREEZE_AUTHORITY_V1.authorityId);
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
    assert.ok(question.explanation.membershipTable.length >= 1);
    assert.equal(question.explanation.membershipTable.length, question.solveFacts.dotCount);
    assert.equal(question.validation.uniqueAnswer, true);
    assert.equal(question.validation.signaturesRecomputedFromGeometry, true);
    assert.equal(question.validation.completeInsideOutsideSignature, true);
    checked += 1;
  }
}

for (let index = 0; index < 10; index += 1) {
  const seed = `DOT-LANGUAGE-PARITY:${index}`;
  const en = generateSpatialProductionStudioQuestionV7({ qlId: "SPA-QL-054", language: "en", seed });
  for (const language of ["hi", "pa"] as const) {
    const localized = generateSpatialProductionStudioQuestionV7({ qlId: "SPA-QL-054", language, seed });
    assert.equal(localized.geometryFingerprint, en.geometryFingerprint);
    assert.equal(localized.correctIndex, en.correctIndex);
    assert.deepEqual(localized.solveFacts.requiredSignatures, en.solveFacts.requiredSignatures);
  }
}

const batch = generateSpatialProductionStudioBatchV7({
  seed: "DOT-001:QUESTION-STUDIO:APPROVED-BATCH",
  chapterCode: "DOT-001",
  count: 12,
  language: "en",
});
assert.equal(batch.questions.length, 12);
assert.ok(batch.questions.every((question) => question.chapterCode === "DOT-001"));
assert.ok(batch.questions.every((question) => question.qlId === "SPA-QL-054"));
assert.equal(batch.generationContext.mockTestEligible, false);
assert.equal(batch.generationContext.publicReleaseAuthorized, false);
assert.equal(batch.generationContext.studentDeliveryAuthorized, false);
assert.equal(batch.generationContext.automaticStudentPublication, false);

const conversionQuestion = generateSpatialProductionStudioQuestionV7({
  qlId: "SPA-QL-054",
  language: "en",
  seed: "DOT-001:QUESTION-BANK:SOLUTION-ILLUSTRATION",
});
const persistedPayload = productionPayloadV5(conversionQuestion);
assert.equal(typeof persistedPayload.explanationIllustrationSvg, "string");
assert.equal(persistedPayload.optionSvgs?.length, 4);
assert.ok(Array.isArray(persistedPayload.richExplanation.membershipTable));
assert.equal(
  persistedPayload.richExplanation.membershipTable.length,
  conversionQuestion.solveFacts.dotCount,
  "Question Studio payload must retain the approved per-dot membership table.",
);
assert.equal(persistedPayload.questionBankWritable, true);
assert.equal(persistedPayload.testBuilderEligible, true);
assert.equal(persistedPayload.mockTestEligible, false);
assert.equal(persistedPayload.publicReleaseAuthorized, false);
assert.equal(persistedPayload.studentDeliveryAuthorized, false);

const normalized = normalizeGeneratedQuestionPayload(persistedPayload, {
  itemId: "dot-001-solution-preservation",
  generationRunCode: "DOT-001-QB-PROOF",
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
assert.ok(spatialApi.includes("'DOT-001'"), "Spatial admin API type must expose Dot Situation.");
assert.ok(spatialPanel.includes("'DOT-001': 'Dot Situation'"), "Spatial panel must expose the Dot Situation chapter filter.");
assert.ok(spatialPanel.includes("question.explanation.membershipTable"), "Spatial panel must render the approved DOT membership table.");
assert.ok(spatialPanel.includes("Solution: one valid placement preserving every dot-region relation"), "Spatial panel must label the DOT solution illustration correctly.");
assert.ok(spatialWorkflow.includes("SPATIAL_QUESTION_STUDIO_PACKAGE_V1 as SPATIAL_QUESTION_STUDIO_PACKAGE_V6"), "Shared SPA workflow must use the compatibility-safe current 49-QL alias.");

console.log(JSON.stringify({
  status: "PASS_DOT_001_APPROVED_FREEZE_QUESTION_STUDIO_V1",
  checkedQuestions: checked,
  packageQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V7.permanentQlCount,
  dotQlIds: DOT_SITUATION_FREEZE_AUTHORITY_V1.permanentQlIds,
  approvalRunId: DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1.reviewedCi.workflowRunId,
  approvalArtifactId: DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1.reviewedCi.artifactId,
  solutionIllustrationPersisted: true,
  membershipTablePersistedAndRendered: true,
  questionBankSafe: true,
  mockPublicStudentGatesRemainClosed: true,
}, null, 2));
