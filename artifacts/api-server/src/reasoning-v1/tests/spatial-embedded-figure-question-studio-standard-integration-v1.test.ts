import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../lib/admin-question-conversion";
import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V2 } from "../foundation/spatial/spatial-question-studio-integration-v2";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V3,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "../foundation/spatial/spatial-question-studio-integration-v3";
import {
  generateSpatialProductionStudioBatchV3,
  generateSpatialProductionStudioQuestionV3,
} from "../foundation/spatial/spatial-question-studio-production-v3";
import { EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/embedded-figure-question-studio-product-owner-approval-v1";

const LANGUAGES = ["en", "hi", "pa"] as const;
const EMB_QL = "SPA-QL-041" as const;

assert.equal(EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approved, true);
assert.equal(EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.productOwnerVerdict, "APPROVED");
assert.equal(EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvedSeededRuntimeCi.result, "SUCCESS");
assert.equal(EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvedOperatorReviewCi.result, "SUCCESS");
assert.equal(EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.directArtifactReview.desktopReviewPassed, true);
assert.equal(EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.directArtifactReview.mobileReviewPassed, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V2.permanentQlCount, 40, "Frozen pre-EMB package must remain 40 QLs.");
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.permanentQlCount, 41);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.qlIds.length, 41);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.qlIds.at(-1), EMB_QL);
assert.ok(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.chapters.includes("EMB-001"));
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.registrationStatus, "REGISTERED");
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.questionStudioDiscoverable, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.persistenceAllowed, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.testEligibility, "ELIGIBLE");
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.manualApprovalRequired, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.futureGeneratedItemsAutomaticallyApproved, false);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.automaticStudentPublication, false);

function visualProjection(question: ReturnType<typeof generateSpatialProductionStudioQuestionV3>) {
  return {
    qlId: question.qlId,
    chapterCode: question.chapterCode,
    mode: question.mode,
    stimulusSvgs: question.stimulusSvgs,
    optionSvgs: question.optionSvgs,
    correctIndex: question.correctIndex,
    answer: question.answer,
    contentFingerprint: question.contentFingerprint,
  };
}

function eligibilityPayload(question: ReturnType<typeof generateSpatialProductionStudioQuestionV3>) {
  return {
    ...question,
    text: question.stem,
    options: [...question.optionLabels],
    correct: question.correctIndex,
    canonicalAnswer: question.answer,
    explanation: [
      question.explanation.observation,
      question.explanation.rule,
      question.explanation.application,
      question.explanation.check,
    ].join("\n\n"),
    difficulty: question.difficultyBand,
    runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
    reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
    questionBankStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
    testEligibility: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
    publiclyPublishable: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
    mockTestEligible: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
    manualApprovalRequired: true,
    automaticStudentPublication: false,
    releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
  };
}

const canonicalIds = new Set<string>();
const contentFingerprints = new Set<string>();
let questionBankNormalizationCount = 0;
let visualParityChecks = 0;
let standardLifecycleChecks = 0;

for (let index = 0; index < 24; index += 1) {
  const seed = `EMB-STANDARD-${index}`;
  const byLanguage = LANGUAGES.map((language) =>
    generateSpatialProductionStudioQuestionV3({ qlId: EMB_QL, seed, language }),
  );
  const replay = generateSpatialProductionStudioQuestionV3({ qlId: EMB_QL, seed, language: "en" });
  assert.deepEqual(replay, byLanguage[0], `${seed}: deterministic replay failed.`);

  for (const question of byLanguage) {
    assert.equal(question.qlId, EMB_QL);
    assert.equal(question.chapterCode, "EMB-001");
    assert.equal(question.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V3.integrationAuthority);
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

    assert.equal(question.answer, question.optionLabels[question.correctIndex]);
    assert.equal(question.optionSvgs.length, 4);
    assert.equal(new Set(question.optionSvgs).size, 4);

    const payload = eligibilityPayload(question);
    assert.equal(
      getGeneratedQuestionBankEligibilityIssue(payload),
      null,
      `${seed}/${question.language}: Question Bank eligibility blocked.`,
    );
    assert.equal(
      getGeneratedItemApprovalDisposition(payload).mode,
      "question_bank",
      `${seed}/${question.language}: manual approval did not route to Question Bank conversion.`,
    );
    const normalized = normalizeGeneratedQuestionPayload(payload, {
      itemId: `${seed}-${question.language}`,
      generationRunCode: "EMB-STANDARD-INTEGRATION-GATE",
    });
    questionBankNormalizationCount += 1;
    assert.equal(normalized.correctIndex, question.correctIndex);
    assert.equal(normalized.options.length, 4);
    assert.ok(
      normalized.options.every((option) => option.startsWith('<img src="data:image/svg+xml;base64,')),
      `${seed}/${question.language}: option SVG did not normalize to a safe image.`,
    );
    assert.ok(
      normalized.stem.includes('<img src="data:image/svg+xml;base64,'),
      `${seed}/${question.language}: target SVG did not normalize to a safe image.`,
    );
  }

  const enProjection = visualProjection(byLanguage[0]);
  assert.deepEqual(visualProjection(byLanguage[1]), enProjection, `${seed}: Hindi visual/answer parity failed.`);
  assert.deepEqual(visualProjection(byLanguage[2]), enProjection, `${seed}: Punjabi visual/answer parity failed.`);
  visualParityChecks += 2;
  canonicalIds.add(byLanguage[0].canonicalItemId);
  contentFingerprints.add(byLanguage[0].contentFingerprint);
}

assert.equal(canonicalIds.size, 24);
assert.equal(contentFingerprints.size, 24);
assert.equal(questionBankNormalizationCount, 72);

const embBatch = generateSpatialProductionStudioBatchV3({
  seed: "EMB-STANDARD-BATCH",
  chapterCode: "EMB-001",
  count: 24,
  language: "pa",
});
assert.equal(embBatch.questions.length, 24);
assert.ok(embBatch.questions.every((question) => question.qlId === EMB_QL));
assert.ok(embBatch.questions.every((question) => question.chapterCode === "EMB-001"));
assert.equal(new Set(embBatch.questions.map((question) => question.contentFingerprint)).size, 24);
assert.equal(embBatch.generationContext.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V3.integrationAuthority);
assert.equal(embBatch.generationContext.manualApprovalRequired, true);
assert.equal(embBatch.generationContext.automaticStudentPublication, false);

const fullBatch = generateSpatialProductionStudioBatchV3({
  seed: "SPA-FULL-41",
  count: 41,
  language: "en",
});
assert.equal(fullBatch.questions.length, 41);
assert.equal(
  new Set(fullBatch.questions.map((question) => question.qlId)).size,
  41,
  "Full Spatial batch did not exercise every permanent QL once.",
);
assert.ok(fullBatch.questions.some((question) => question.qlId === EMB_QL));

const result = {
  status: "PASS_EMB_001_STANDARD_QUESTION_STUDIO_INTEGRATION_V1",
  approvalAuthority: EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  approvedHeadSha: EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvedHeadSha,
  integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V3.integrationAuthority,
  previousPermanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V2.permanentQlCount,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V3.permanentQlCount,
  addedPermanentQlId: EMB_QL,
  languages: LANGUAGES,
  reviewedSeedCount: 24,
  reviewedLanguageSurfaceCount: 72,
  visualParityChecks,
  standardLifecycleChecks,
  questionBankNormalizationCount,
  embBatchCount: embBatch.questions.length,
  fullSpatialBatchCount: fullBatch.questions.length,
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
  routeActivation: "NOT_CHANGED_BY_THIS_GATE",
  nextGate: "EMB_001_ADMIN_QUESTION_STUDIO_ROUTE_ACTIVATION_V1",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-emb-001-standard-question-studio-integration-v1-evidence.json",
  `${JSON.stringify(result, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(result, null, 2));
