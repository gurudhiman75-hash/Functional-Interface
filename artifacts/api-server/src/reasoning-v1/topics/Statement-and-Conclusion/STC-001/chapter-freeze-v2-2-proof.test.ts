import assert from "node:assert/strict";
import { STC_001_CHAPTER_FREEZE_V2_2 } from "./chapter-freeze-v2-2-manifest.ts";
import {
  STC_001_V22_QUESTION_STUDIO_PACKAGE_ID,
  STC_001_V22_QUESTION_STUDIO_REVIEW_AUTHORITY,
  STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE,
  STC_001_V22_QUESTION_STUDIO_REVIEW_STATUS,
  assertStc001V22QuestionStudioPersistenceAllowed,
  previewStc001V22QuestionStudioReview,
} from "./question-studio-review-v2-2.ts";
import {
  STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL,
  STC_V22_TEMPLATE_COUNT_PER_QL,
  STC_V22_VARIANTS_PER_TEMPLATE,
  generateStcV22Question,
} from "./editorial-v2-2-generator.ts";
import { STC_V22_TEMPLATES_BY_QL } from "./editorial-v2-2-templates.ts";
import { STC_QL_IDS } from "./types.ts";

const freeze = STC_001_CHAPTER_FREEZE_V2_2;
const pkg = STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE;

assert.equal(freeze.freezeId, "STC-001-V2-2-GENERATION-READY-REVIEW-FROZEN");
assert.equal(freeze.version, "V2.2");
assert.equal(freeze.certifiedContentHead, "6f13df7f72dd8c7c851d9681d8cbb2af1c584ef1");
assert.equal(freeze.certificationScope, "QUESTION_STUDIO_GENERATION_READY_REVIEW_AUTHORITY_ONLY");
assert.equal(freeze.certification.workflowName, "Validate STC-001 V2.2 Variableized Saturation");
assert.equal(freeze.certification.runId, 33318934355);
assert.equal(freeze.certification.runNumber, 4);
assert.equal(freeze.certification.conclusion, "success");
assert.equal(freeze.certification.strictTypeScript, "PASS");
assert.equal(freeze.certification.productionApiBuild, "PASS");
assert.equal(freeze.certification.productionAdminBuild, "PASS");

assert.deepEqual(freeze.permanentQlIds, STC_QL_IDS);
assert.equal(freeze.permanentQlCount, 6);
assert.deepEqual(freeze.locales, ["en-IN", "hi-IN", "pa-IN"]);
assert.equal(freeze.templatesPerQl, STC_V22_TEMPLATE_COUNT_PER_QL);
assert.equal(freeze.variantsPerTemplate, STC_V22_VARIANTS_PER_TEMPLATE);
assert.equal(freeze.semanticSurfaceCapacityPerQl, STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL);
assert.equal(freeze.semanticSurfaceCapacityPerQl, 2048);
assert.ok(freeze.semanticSurfaceCapacityPerQl >= freeze.minimumDistinctQuestionsPerQlForGenerationReady);
assert.equal(freeze.fullEnglishCycleSurfaceCount, 12288);
assert.deepEqual(freeze.answerClassCountPerQlPerCycle, {
  ONLY_I: 512,
  ONLY_II: 512,
  BOTH: 512,
  NEITHER: 512,
});
assert.deepEqual(freeze.presentationProfiles, ["FOUR_WAY"]);
assert.equal(freeze.bankingFiveWayEitherStatus, "REMOVED_FROM_ACTIVE_NON_SYLLOGISTIC_STC");
assert.equal(freeze.ql005TaxonomyBoundary, "COMPARATIVE_METRIC_INTERPRETATION_NOT_RANKING_ORDER");

assert.equal(pkg.packageId, STC_001_V22_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(pkg.packageId, freeze.packageId);
assert.equal(pkg.integrationAuthority, STC_001_V22_QUESTION_STUDIO_REVIEW_AUTHORITY);
assert.equal(pkg.integrationAuthority, freeze.questionStudio.integrationAuthority);
assert.equal(pkg.reviewStatus, STC_001_V22_QUESTION_STUDIO_REVIEW_STATUS);
assert.equal(pkg.reviewStatus, freeze.questionStudio.reviewStatus);
assert.equal(pkg.saturationStatus, freeze.questionStudio.saturationStatus);
assert.equal(pkg.templatesPerQl, 8);
assert.equal(pkg.variantsPerTemplate, 256);
assert.equal(pkg.semanticSurfaceCapacityPerQl, 2048);
assert.equal(pkg.minimumDistinctQuestionsPerQlForGenerationReady, 1000);
assert.equal(pkg.currentGenerationReady, true);
assert.equal(pkg.reviewOnly, true);
assert.equal(pkg.bankingFiveWayEitherStatus, "REMOVED_FROM_ACTIVE_NON_SYLLOGISTIC_STC");
assert.deepEqual(pkg.presentationProfiles, ["FOUR_WAY"]);
assert.equal(pkg.antiGamingScheduler, "STC_V2_2_BIJECTIVE_2048_SURFACE");
assert.equal(pkg.v21AuditSnapshotPreserved, true);
assert.equal(pkg.v1AuditSnapshotPreserved, true);

for (const qlId of STC_QL_IDS) {
  assert.equal(STC_V22_TEMPLATES_BY_QL[qlId].length, 8, `${qlId}: freeze requires exactly 8 V2.2 templates`);
  const archetypes = new Set(STC_V22_TEMPLATES_BY_QL[qlId].map((entry) => entry.surfaceArchetype));
  assert.equal(archetypes.size, 8, `${qlId}: freeze requires 8 distinct surface archetypes`);

  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
    for (const seed of [0, 1, 17, 255, 256, 511, 1023, 1536, 2047]) {
      const direct = generateStcV22Question({ qlId, locale, seed });
      const preview = previewStc001V22QuestionStudioReview({ qlId, locale, seed });
      assert.equal(preview.packageId, freeze.packageId);
      assert.equal(preview.reviewOnly, true);
      assert.equal(preview.generationReady, true);
      assert.equal(preview.presentationProfile, "FOUR_WAY");
      assert.equal(preview.question.scenarioId, direct.scenarioId);
      assert.equal(preview.question.correctOptionIndex, direct.correctOptionIndex);
      assert.equal(preview.question.qlId, qlId);
      assert.equal(preview.question.locale, locale);
    }
  }
}

assert.equal(freeze.lifecycle.questionStudioStatus, "GENERATION_READY_REVIEW_ONLY_FROZEN");
assert.equal(freeze.lifecycle.questionStudioReviewOnly, true);
assert.equal(freeze.lifecycle.questionBankWritable, false);
assert.equal(freeze.lifecycle.testEligible, false);
assert.equal(freeze.lifecycle.mockTestEligible, false);
assert.equal(freeze.lifecycle.publiclyPublishable, false);
assert.equal(freeze.lifecycle.automaticStudentPublication, false);
assert.equal(freeze.lifecycle.separateLearnerReleaseApprovalRequired, true);
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.automaticStudentPublication, false);
assert.equal(pkg.manualReleaseApprovalRequired, true);

assert.throws(
  () => assertStc001V22QuestionStudioPersistenceAllowed(),
  /generation-ready inside Question Studio review.*delivery remains locked.*separate explicit learner-release approval/i,
);

assert.deepEqual(freeze.preservedAuditBaselines, [
  "STC-001-V2.1-ANTI-GAMING-SATURATION-BOUNDARY",
  "STC-001-V1-SIX-QL-FROZEN",
]);

assert.equal(freeze.certifiedContentBlobLocks["./editorial-v2-2-generator.ts"], "521ff303f6acef43bb5add02f0d70f71ed31ab52");
assert.equal(freeze.certifiedContentBlobLocks["./editorial-v2-2-saturation-proof.test.ts"], "514057f06b8f9a490a735ffab5547edb48799227");
assert.equal(freeze.certifiedContentBlobLocks["./question-studio-review-v2-2.ts"], "0dc97afff067f467e156b3f7365db59fa8f1fcfb");
assert.equal(freeze.integrationBlobLocks["../../../../question-studio-review-registry.ts"], "93932cc31b00a19f4d4a4ed44b89319b8dbf6513");
assert.equal(freeze.integrationBlobLocks[".github/workflows/stc-001-v2-2-saturation.yml"], "4873dec44fb99aaebe59de1511c852e9549ef20c");

console.log(
  "PASS_STC_001_V2_2_REVIEW_FREEZE freeze=STC-001-V2-2-GENERATION-READY-REVIEW-FROZEN surfaces_per_ql=2048 learner_release=LOCKED",
);
