import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V3 } from "../foundation/spatial/spatial-question-studio-integration-v3";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V4,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "../foundation/spatial/spatial-question-studio-integration-v4";
import { generateSpatialProductionStudioQuestionV3 } from "../foundation/spatial/spatial-question-studio-production-v3";
import {
  generateSpatialProductionStudioBatchV4,
  generateSpatialProductionStudioQuestionV4,
  isSpatialCountingFiguresQuestionStudioQlIdV4,
  type SpatialCountingFiguresProductionStudioQuestionV4,
} from "../foundation/spatial/spatial-question-studio-production-v4";
import { FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/counting-figures-question-studio-product-owner-approval-v1";

const LANGUAGES = ["en", "hi", "pa"] as const;
const FCT_QL = "SPA-QL-042" as const;
const EMB_QL = "SPA-QL-041" as const;

assert.equal(FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approved, true);
assert.equal(FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.productOwnerVerdict, "APPROVED");
assert.equal(FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvedSeededRuntimeCi.result, "SUCCESS");
assert.equal(FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvedOperatorReviewCi.result, "SUCCESS");
assert.equal(FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.directArtifactReview.desktopReviewPassed, true);
assert.equal(FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.directArtifactReview.mobile390ReviewPassed, true);
assert.equal(FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.directArtifactReview.horizontalOverflowObserved, false);
assert.equal(FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.currentNewMainCompatibilityCheck.permanentQlConflictObserved, false);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.permanentQlCount, 41, "Frozen pre-FCT package must remain 41 QLs.");
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.permanentQlCount, 42);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.qlIds.length, 42);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.qlIds.at(-1), FCT_QL);
assert.ok(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.chapters.includes("FCT-001"));
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.registrationStatus, "REGISTERED");
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.questionStudioDiscoverable, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.persistenceAllowed, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.testEligibility, "ELIGIBLE");
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.manualApprovalRequired, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.futureGeneratedItemsAutomaticallyApproved, false);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V4.automaticStudentPublication, false);
assert.equal(isSpatialCountingFiguresQuestionStudioQlIdV4(FCT_QL), true);
assert.equal(isSpatialCountingFiguresQuestionStudioQlIdV4(EMB_QL), false);

function asFct(question: ReturnType<typeof generateSpatialProductionStudioQuestionV4>): SpatialCountingFiguresProductionStudioQuestionV4 {
  assert.equal(question.qlId, FCT_QL);
  return question as SpatialCountingFiguresProductionStudioQuestionV4;
}

function fctProjection(question: SpatialCountingFiguresProductionStudioQuestionV4) {
  return {
    qlId: question.qlId,
    chapterCode: question.chapterCode,
    mode: question.mode,
    targetShape: question.targetShape,
    motifFamily: question.motifFamily,
    structuralVariant: question.structuralVariant,
    stimulusSvgs: question.stimulusSvgs,
    options: question.options,
    correctIndex: question.correctIndex,
    answer: question.answer,
    contentFingerprint: question.contentFingerprint,
    geometryFingerprint: question.geometryFingerprint,
    structuralFingerprint: question.structuralFingerprint,
  };
}

const canonicalIds = new Set<string>();
const contentFingerprints = new Set<string>();
let visualParityChecks = 0;
let standardLifecycleChecks = 0;
let exactValidationChecks = 0;

for (let index = 0; index < 24; index += 1) {
  const seed = `FCT-STANDARD-${index}`;
  const byLanguage = LANGUAGES.map((language) =>
    asFct(generateSpatialProductionStudioQuestionV4({ qlId: FCT_QL, seed, language })),
  );
  const replay = asFct(generateSpatialProductionStudioQuestionV4({ qlId: FCT_QL, seed, language: "en" }));
  assert.deepEqual(replay, byLanguage[0], `${seed}: deterministic replay failed.`);

  for (const question of byLanguage) {
    assert.equal(question.qlId, FCT_QL);
    assert.equal(question.chapterCode, "FCT-001");
    assert.equal(question.mode, "SYSTEMATIC_CLOSED_FIGURE_ENUMERATION");
    assert.equal(question.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority);
    assert.equal(question.lifecycle.questionStudioDiscoverable, true);
    assert.equal(question.lifecycle.registrationStatus, "REGISTERED");
    assert.equal(question.lifecycle.persistenceAllowed, true);
    assert.equal(question.lifecycle.questionBankStatus, "READY_FOR_STORAGE");
    assert.equal(question.lifecycle.testEligibility, "ELIGIBLE");
    assert.equal(question.lifecycle.testEligible, true);
    assert.equal(question.lifecycle.publiclyPublishable, true);
    assert.equal(question.lifecycle.mockTestEligible, true);
    assert.equal(question.lifecycle.manualApprovalRequired, true);
    assert.equal(question.lifecycle.automaticStudentPublication, false);
    standardLifecycleChecks += 10;

    assert.equal(question.renderer.kind, "SVG_WITH_NUMERIC_OPTIONS");
    assert.equal(question.stimulusSvgs.length, 1);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.answer, question.optionLabels[question.correctIndex]);
    assert.equal(question.validation.exactGraphSolverBacked, true);
    assert.equal(question.validation.constructionCountMatched, true);
    assert.equal(question.validation.uniqueNumericOptions, true);
    assert.equal(question.validation.uniqueAnswer, true);
    exactValidationChecks += 4;
  }

  const enProjection = fctProjection(byLanguage[0]!);
  assert.deepEqual(fctProjection(byLanguage[1]!), enProjection, `${seed}: Hindi visual/count parity failed.`);
  assert.deepEqual(fctProjection(byLanguage[2]!), enProjection, `${seed}: Punjabi visual/count parity failed.`);
  visualParityChecks += 2;
  canonicalIds.add(byLanguage[0]!.canonicalItemId);
  contentFingerprints.add(byLanguage[0]!.contentFingerprint);
}

assert.equal(canonicalIds.size, 24);
assert.equal(contentFingerprints.size, 24);

const fctBatch = generateSpatialProductionStudioBatchV4({
  seed: "FCT-STANDARD-BATCH",
  chapterCode: "FCT-001",
  count: 24,
  language: "pa",
});
assert.equal(fctBatch.questions.length, 24);
assert.ok(fctBatch.questions.every((question) => question.qlId === FCT_QL));
assert.ok(fctBatch.questions.every((question) => question.chapterCode === "FCT-001"));
assert.equal(new Set(fctBatch.questions.map((question) => question.contentFingerprint)).size, 24);
assert.equal(fctBatch.generationContext.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority);
assert.equal(fctBatch.generationContext.manualApprovalRequired, true);
assert.equal(fctBatch.generationContext.automaticStudentPublication, false);

const fullBatch = generateSpatialProductionStudioBatchV4({
  seed: "SPA-FULL-42",
  count: 42,
  language: "en",
});
assert.equal(fullBatch.questions.length, 42);
assert.equal(
  new Set(fullBatch.questions.map((question) => question.qlId)).size,
  42,
  "Full Spatial batch did not exercise every permanent QL once.",
);
assert.ok(fullBatch.questions.some((question) => question.qlId === FCT_QL));
assert.ok(fullBatch.questions.some((question) => question.qlId === EMB_QL));

const legacyV3 = generateSpatialProductionStudioQuestionV3({ qlId: EMB_QL, seed: "FCT-V4-LEGACY-EMB", language: "pa" });
const legacyV4 = generateSpatialProductionStudioQuestionV4({ qlId: EMB_QL, seed: "FCT-V4-LEGACY-EMB", language: "pa" });
const { integrationAuthority: _v3Authority, ...legacyV3Projection } = legacyV3;
const { integrationAuthority: _v4Authority, ...legacyV4Projection } = legacyV4;
assert.deepEqual(legacyV4Projection, legacyV3Projection, "V4 changed the pre-FCT EMB runtime surface.");
assert.equal(legacyV4.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority);

const result = {
  status: "PASS_FCT_001_STANDARD_QUESTION_STUDIO_INTEGRATION_V1",
  approvalAuthority: FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  approvedSeededRuntimeHeadSha: FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvedSeededRuntimeHeadSha,
  approvedOperatorReviewHeadSha: FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvedOperatorReviewHeadSha,
  integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority,
  previousPermanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V3.permanentQlCount,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V4.permanentQlCount,
  addedPermanentQlId: FCT_QL,
  languages: LANGUAGES,
  reviewedSeedCount: 24,
  reviewedLanguageSurfaceCount: 72,
  visualParityChecks,
  standardLifecycleChecks,
  exactValidationChecks,
  fctBatchCount: fctBatch.questions.length,
  fullSpatialBatchCount: fullBatch.questions.length,
  legacyV3DelegationPreserved: true,
  standardLifecycle: {
    questionStudioDiscoverable: true,
    registrationStatus: "REGISTERED",
    persistenceAllowed: true,
    questionBankStatus: "READY_FOR_STORAGE",
    testEligibility: "ELIGIBLE",
    manualApprovalRequired: true,
    futureGeneratedItemsAutomaticallyApproved: false,
    automaticStudentPublication: false,
  },
  adminRouteActivation: "NOT_CHANGED_BY_THIS_GATE",
  numericOptionQuestionBankConversion: "NEXT_ROUTE_ACTIVATION_GATE",
  nextGate: "FCT_001_ADMIN_QUESTION_STUDIO_ROUTE_AND_NUMERIC_CONVERSION_ACTIVATION_V1",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fct-001-standard-question-studio-integration-v1-evidence.json",
  `${JSON.stringify(result, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(result, null, 2));
