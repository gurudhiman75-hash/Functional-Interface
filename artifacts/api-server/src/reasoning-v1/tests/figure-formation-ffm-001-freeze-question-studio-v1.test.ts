import assert from "node:assert/strict";

import { normalizeGeneratedQuestionPayload } from "../../lib/admin-question-conversion";
import { productionPayloadV5 } from "../../routes/admin-question-studio-spatial-v5";
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

const conversionQuestion = generateSpatialProductionStudioQuestionV6({
  qlId: "SPA-QL-051",
  language: "en",
  seed: "FFM-001:QUESTION-BANK:ILLUSTRATION-PRESERVATION",
});
const persistedPayload = productionPayloadV5(conversionQuestion);
assert.equal(typeof persistedPayload.explanationIllustrationSvg, "string");
assert.match(persistedPayload.explanationIllustrationSvg!, /data-assembly-stage="joined"/);
assert.match(persistedPayload.explanationIllustrationSvg!, /data-seam="true"/);

const normalized = normalizeGeneratedQuestionPayload(persistedPayload, {
  itemId: "ffm-001-illustration-preservation",
  generationRunCode: "FFM-001-QB-PROOF",
});
assert.match(normalized.explanation, /data:image\/svg\+xml;base64,/);
assert.match(normalized.explanation, /alt="Figure formation assembly explanation"/);
assert.equal(
  (normalized.answerModel.generation as Record<string, unknown>).explanationVisualContent,
  "spatial_svg_data_image_v1",
);

assert.throws(
  () => normalizeGeneratedQuestionPayload(
    {
      ...persistedPayload,
      explanationIllustrationSvg: '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
    },
    { itemId: "ffm-001-unsafe-svg", generationRunCode: "FFM-001-QB-PROOF" },
  ),
  /disallowed active SVG content/,
);

console.log(JSON.stringify({
  status: "PASS_FFM_001_APPROVED_FREEZE_QUESTION_STUDIO_V1",
  checkedQuestions: checked,
  packageQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V6.permanentQlCount,
  ffmQlIds: FIGURE_FORMATION_FREEZE_AUTHORITY_V1.permanentQlIds,
  explanationIllustrationPersisted: true,
  explanationIllustrationQuestionBankSafe: true,
  unsafeExplanationSvgRejected: true,
}, null, 2));
