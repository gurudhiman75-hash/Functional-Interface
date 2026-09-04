import assert from "node:assert/strict";

import {
  FIGURE_FORMATION_FREEZE_AUTHORITY_V1,
  FIGURE_FORMATION_INTERNAL_ACTIVATION_V2,
  FIGURE_FORMATION_PRODUCT_OWNER_APPROVAL_V1,
} from "../foundation/spatial/figure-formation-freeze-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V6,
  SPATIAL_QUESTION_STUDIO_QLS_V6,
} from "../foundation/spatial/spatial-question-studio-integration-v6";
import {
  generateSpatialProductionStudioBatchV6,
  generateSpatialProductionStudioQuestionV6,
} from "../foundation/spatial/spatial-question-studio-production-v6";

assert.equal(FIGURE_FORMATION_PRODUCT_OWNER_APPROVAL_V1.approved, true);
assert.equal(FIGURE_FORMATION_FREEZE_AUTHORITY_V1.learnerContentFrozen, true);
assert.equal(FIGURE_FORMATION_FREEZE_AUTHORITY_V1.geometryFrozen, true);
assert.equal(FIGURE_FORMATION_FREEZE_AUTHORITY_V1.rendererFrozen, true);
assert.equal(FIGURE_FORMATION_FREEZE_AUTHORITY_V1.explanationVisualContractFrozen, true);
assert.equal(FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.questionStudioDiscoverable, true);
assert.equal(FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.persistenceAllowed, true);
assert.equal(FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.testBuilderEligible, true);
assert.equal(FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.mockTestEligible, false);
assert.equal(FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.publicReleaseAuthorized, false);
assert.equal(FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.studentDeliveryAuthorized, false);

assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V6.permanentQlCount, 48);
assert.deepEqual(
  SPATIAL_QUESTION_STUDIO_QLS_V6.slice(-3).map((entry) => entry.permanentQlId),
  ["SPA-QL-051", "SPA-QL-052", "SPA-QL-053"],
);
assert.ok(SPATIAL_QUESTION_STUDIO_PACKAGE_V6.chapters.includes("FFM-001"));

let checked = 0;
for (const qlId of ["SPA-QL-051", "SPA-QL-052", "SPA-QL-053"] as const) {
  for (const language of ["en", "hi", "pa"] as const) {
    for (let index = 0; index < 8; index += 1) {
      const question = generateSpatialProductionStudioQuestionV6({
        qlId,
        language,
        seed: `FFM-FREEZE:${qlId}:${language}:${index}`,
      }) as any;
      assert.equal(question.qlId, qlId);
      assert.equal(question.chapterCode, "FFM-001");
      assert.equal(question.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V6.integrationAuthority);
      assert.equal(question.sourceFreezeAuthority, FIGURE_FORMATION_FREEZE_AUTHORITY_V1.authorityId);
      assert.equal(question.review.productOwnerApproved, true);
      assert.equal(question.review.learnerContentFrozen, true);
      assert.equal(question.lifecycle.questionStudioDiscoverable, true);
      assert.equal(question.lifecycle.persistenceAllowed, true);
      assert.equal(question.lifecycle.questionBankWritable, true);
      assert.equal(question.lifecycle.testBuilderEligible, true);
      assert.equal(question.lifecycle.mockTestEligible, false);
      assert.equal(question.lifecycle.publicReleaseAuthorized, false);
      assert.equal(question.lifecycle.studentDeliveryAuthorized, false);
      assert.match(question.explanationIllustrationSvg, /data-assembly-stage="joined"/);
      assert.match(question.explanationIllustrationSvg, /data-seam="true"/);
      checked += 1;
    }
  }
}

const batch = generateSpatialProductionStudioBatchV6({
  seed: "FFM-001:QUESTION-STUDIO:APPROVED-BATCH",
  chapterCode: "FFM-001",
  count: 9,
  language: "en",
});
assert.equal(batch.questions.length, 9);
assert.ok(batch.questions.every((question) => question.chapterCode === "FFM-001"));
assert.ok(batch.questions.every((question) => question.integrationAuthority === SPATIAL_QUESTION_STUDIO_PACKAGE_V6.integrationAuthority));
assert.equal(batch.generationContext.mockTestEligible, false);
assert.equal(batch.generationContext.publicReleaseAuthorized, false);
assert.equal(batch.generationContext.studentDeliveryAuthorized, false);

console.log(JSON.stringify({
  status: "PASS_FFM_001_APPROVED_FREEZE_QUESTION_STUDIO_V1",
  checkedQuestions: checked,
  packageQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V6.permanentQlCount,
  ffmQlIds: FIGURE_FORMATION_FREEZE_AUTHORITY_V1.permanentQlIds,
}, null, 2));
