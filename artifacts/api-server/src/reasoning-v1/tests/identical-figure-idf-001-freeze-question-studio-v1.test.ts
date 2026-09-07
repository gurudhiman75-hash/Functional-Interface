import assert from "node:assert/strict";
import {
  IDENTICAL_FIGURE_FREEZE_AUTHORITY_V1,
  IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1,
  IDENTICAL_FIGURE_PRODUCT_OWNER_APPROVAL_V1,
} from "../foundation/spatial/identical-figure-freeze-v1";
import { generateIdenticalFigureQuestionStudioV1 } from "../foundation/spatial/identical-figure-question-studio-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V9,
  SPATIAL_QUESTION_STUDIO_QLS_V9,
} from "../foundation/spatial/spatial-question-studio-integration-v9";
import {
  generateSpatialProductionStudioBatchV9,
  generateSpatialProductionStudioQuestionV9,
} from "../foundation/spatial/spatial-question-studio-production-v9";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1 as CURRENT_SPATIAL_PACKAGE,
} from "../foundation/spatial/spatial-question-studio-integration-v6";
import {
  generateSpatialProductionStudioQuestionV1 as generateCurrentSpatialQuestion,
} from "../foundation/spatial/spatial-question-studio-production-v6";
import { listQuestionStudioPackages } from "../../question-studio/shared-generation-engine-sri";
import { productionPayloadV5 } from "../../routes/admin-question-studio-spatial-v5";

assert.equal(IDENTICAL_FIGURE_PRODUCT_OWNER_APPROVAL_V1.approved, true);
assert.equal(IDENTICAL_FIGURE_PRODUCT_OWNER_APPROVAL_V1.reviewedCi.result, "SUCCESS");
assert.deepEqual(IDENTICAL_FIGURE_PRODUCT_OWNER_APPROVAL_V1.approvedQlIds, ["SPA-QL-061", "SPA-QL-062", "SPA-QL-063"]);
assert.equal(IDENTICAL_FIGURE_FREEZE_AUTHORITY_V1.learnerContentFrozen, true);
assert.equal(IDENTICAL_FIGURE_FREEZE_AUTHORITY_V1.sourceRuntimeVersion, "SPA-IDF-001-REVIEW-QUESTION-V1.1");
assert.equal(IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable, true);
assert.equal(IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.persistenceAllowed, true);
assert.equal(IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.questionBankWritable, true);
assert.equal(IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.testBuilderEligible, true);
assert.equal(IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.mockTestEligible, false);
assert.equal(IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.publicReleaseAuthorized, false);
assert.equal(IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.studentDeliveryAuthorized, false);
assert.equal(IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.automaticStudentPublication, false);

assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V9.permanentQlCount, 58);
assert.equal(SPATIAL_QUESTION_STUDIO_QLS_V9.length, 58);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V9.identicalFigurePermanentQlCount, 3);
assert.deepEqual(SPATIAL_QUESTION_STUDIO_PACKAGE_V9.identicalFigureQlIds, ["SPA-QL-061", "SPA-QL-062", "SPA-QL-063"]);
assert.ok(SPATIAL_QUESTION_STUDIO_PACKAGE_V9.chapters.includes("IDF-001"));
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V9.mockTestEligible, false);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V9.publicReleaseAuthorized, false);
assert.equal(CURRENT_SPATIAL_PACKAGE.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V9.integrationAuthority);
assert.equal(CURRENT_SPATIAL_PACKAGE.permanentQlCount, 58);

const sharedSpatialPackage = listQuestionStudioPackages().find((entry: any) => entry.packageId === "SPA-001");
assert.ok(sharedSpatialPackage, "Shared Question Studio package registry must expose SPA-001.");
assert.equal(sharedSpatialPackage.permanentQlCount, 58);
assert.ok(sharedSpatialPackage.permanentQlIds.includes("SPA-QL-063"));

const qlIds = ["SPA-QL-061", "SPA-QL-062", "SPA-QL-063"] as const;
const languages = ["en", "hi", "pa"] as const;
const geometryByQlSeed = new Map<string, string>();
let checks = 0;

for (const qlId of qlIds) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `idf-freeze-${qlId}-${index + 1}`;
    let answerIndex: number | null = null;
    for (const language of languages) {
      const question = generateIdenticalFigureQuestionStudioV1({ qlId, seed, language });
      assert.equal(question.chapterCode, "IDF-001");
      assert.equal(question.packageId, "SPA-001");
      assert.equal(question.lifecycle.questionStudioDiscoverable, true);
      assert.equal(question.lifecycle.questionBankWritable, true);
      assert.equal(question.lifecycle.testBuilderEligible, true);
      assert.equal(question.lifecycle.mockTestEligible, false);
      assert.equal(question.lifecycle.publicReleaseAuthorized, false);
      assert.equal(question.review.productOwnerApproved, true);
      assert.equal(question.review.learnerContentFrozen, true);
      assert.equal(question.optionSvgs.length, 4);
      assert.equal(question.optionTexts.length, 4);
      assert.ok(question.optionSvgs.every((svg) => svg.includes("<svg") && svg.includes("<text")));
      assert.ok(question.stimulusSvgs[0].includes('data-idf-number-overlay="true"'));
      for (let number = 1; number <= 9; number += 1) {
        assert.ok(question.stimulusSvgs[0].includes(`data-idf-number-label="${number}"`));
      }
      assert.ok(question.explanationIllustrationSvg.includes("<svg"));
      assert.equal(question.solveFacts.bankSize, 9);
      assert.equal(question.solveFacts.groupCount, 3);
      assert.equal(question.solveFacts.figuresPerGroup, 3);
      assert.equal(question.validation.correctPartitionUnique, true);
      assert.equal(question.validation.allNineNumberLabelsVisibleByConstruction, true);
      assert.equal(question.validation.approvedV1_1RuntimePreserved, true);
      if (answerIndex === null) answerIndex = question.correctIndex;
      assert.equal(question.correctIndex, answerIndex, `${qlId}/${seed} answer must be language-neutral`);

      const geometryKey = `${qlId}:${seed}`;
      const earlierGeometry = geometryByQlSeed.get(geometryKey);
      if (earlierGeometry) assert.equal(question.geometryFingerprint, earlierGeometry);
      else geometryByQlSeed.set(geometryKey, question.geometryFingerprint);
      checks += 1;
    }
  }
}

const routed = generateSpatialProductionStudioQuestionV9({ qlId: "SPA-QL-063", seed: "idf-route-proof", language: "en" });
assert.equal(routed.chapterCode, "IDF-001");
assert.equal(routed.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V9.integrationAuthority);
assert.equal(routed.lifecycle.questionStudioDiscoverable, true);

const currentRouted = generateCurrentSpatialQuestion({ qlId: "SPA-QL-061", seed: "idf-current-alias-proof", language: "en" });
assert.equal(currentRouted.chapterCode, "IDF-001");
assert.equal(currentRouted.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V9.integrationAuthority);

const batch = generateSpatialProductionStudioBatchV9({
  seed: "idf-batch-proof",
  chapterCode: "IDF-001",
  language: "pa",
  count: 9,
});
assert.equal(batch.questions.length, 9);
assert.ok(batch.questions.every((question) => question.chapterCode === "IDF-001"));
assert.equal(new Set(batch.questions.map((question) => question.contentFingerprint)).size, 9);
assert.equal(batch.generationContext.questionBankWritable, true);
assert.equal(batch.generationContext.testBuilderEligible, true);
assert.equal(batch.generationContext.mockTestEligible, false);
assert.equal(batch.generationContext.publicReleaseAuthorized, false);

const payloadQuestion = generateSpatialProductionStudioQuestionV9({ qlId: "SPA-QL-062", seed: "idf-payload-proof", language: "en" });
const payload = productionPayloadV5(payloadQuestion as Parameters<typeof productionPayloadV5>[0]);
assert.equal(payload.qlId, "SPA-QL-062");
assert.equal(payload.canonicalProblemId, "IDF-001");
assert.equal(payload.questionBankWritable, true);
assert.equal(payload.testBuilderEligible, true);
assert.equal(payload.mockTestEligible, false);
assert.equal(payload.publicReleaseAuthorized, false);
assert.ok(Array.isArray(payload.optionSvgs) && payload.optionSvgs.length === 4);
assert.equal(typeof payload.explanationIllustrationSvg, "string");
assert.ok(payload.explanation.includes("Observe:"));

console.log(JSON.stringify({
  authority: "SPA-IDF-001-FREEZE-QUESTION-STUDIO-V1",
  approvedReviewHead: IDENTICAL_FIGURE_PRODUCT_OWNER_APPROVAL_V1.reviewedHeadSha,
  qlIds,
  languages,
  deterministicQuestionStudioChecks: checks,
  spatialProductionQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.permanentQlCount,
  sharedPackageRegistryAdvanced: true,
  currentAliasAdvanced: true,
  questionBankPersistencePayloadChecked: true,
  internalTestBuilderEligible: true,
  releaseGatesRemainClosed: true,
}, null, 2));
