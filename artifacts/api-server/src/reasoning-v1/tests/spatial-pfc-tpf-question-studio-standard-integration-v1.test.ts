import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { getGeneratedQuestionBankEligibilityIssue } from "../../lib/admin-question-conversion";
import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V1 as LEGACY_SPATIAL_PACKAGE } from "../foundation/spatial/spatial-question-studio-integration-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V2,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "../foundation/spatial/spatial-question-studio-integration-v2";
import {
  generateSpatialProductionStudioBatchV2,
  generateSpatialProductionStudioQuestionV2,
} from "../foundation/spatial/spatial-question-studio-production-v2";
import { PFC_TPF_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/paper-folding-question-studio-product-owner-approval-v1";

const PFC_TPF_QLS = ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038", "SPA-QL-039", "SPA-QL-040"] as const;
const LANGUAGES = ["en", "hi", "pa"] as const;
const DIRECTION_CUE = 'data-fold-direction-cue="true"';

assert.equal(PFC_TPF_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approved, true);
assert.equal(PFC_TPF_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.productOwnerVerdict, "APPROVED");
assert.equal(PFC_TPF_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvedExactHeadCi.result, "SUCCESS");
assert.equal(LEGACY_SPATIAL_PACKAGE.permanentQlCount, 34, "Frozen pre-PFC package must remain 34 QLs.");
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V2.permanentQlCount, 40);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V2.qlIds.length, 40);
assert.deepEqual(SPATIAL_QUESTION_STUDIO_PACKAGE_V2.qlIds.slice(-6), [...PFC_TPF_QLS]);
assert.ok(SPATIAL_QUESTION_STUDIO_PACKAGE_V2.chapters.includes("PFC-001"));
assert.ok(SPATIAL_QUESTION_STUDIO_PACKAGE_V2.chapters.includes("TPF-001"));
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V2.registrationStatus, "REGISTERED");
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V2.questionStudioDiscoverable, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V2.persistenceAllowed, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V2.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V2.testEligibility, "ELIGIBLE");
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V2.manualApprovalRequired, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V2.automaticStudentPublication, false);

function visualProjection(question: ReturnType<typeof generateSpatialProductionStudioQuestionV2>) {
  return {
    qlId: question.qlId,
    mode: question.mode,
    representation: question.representation,
    stimulusSvgs: question.stimulusSvgs,
    optionSvgs: question.optionSvgs,
    correctIndex: question.correctIndex,
    answer: question.answer,
    contentFingerprint: question.contentFingerprint,
  };
}

function eligibilityPayload(question: ReturnType<typeof generateSpatialProductionStudioQuestionV2>) {
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

const evidence: Record<string, unknown> = {};
for (const qlId of PFC_TPF_QLS) {
  const seed = `PFC-TPF-STANDARD:${qlId}`;
  const byLanguage = LANGUAGES.map((language) => generateSpatialProductionStudioQuestionV2({ qlId, seed, language }));
  const replay = generateSpatialProductionStudioQuestionV2({ qlId, seed, language: "en" });
  assert.deepEqual(replay, byLanguage[0], `${qlId}: deterministic replay failed.`);

  for (const question of byLanguage) {
    assert.equal(question.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V2.integrationAuthority);
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
    assert.equal(question.answer, question.optionLabels[question.correctIndex]);
    assert.equal(question.optionSvgs.length, 4);
    assert.equal(new Set(question.optionSvgs).size, 4);
    assert.equal(getGeneratedQuestionBankEligibilityIssue(eligibilityPayload(question)), null, `${qlId}/${question.language}: Question Bank eligibility blocked.`);
    assert.equal(getGeneratedItemApprovalDisposition(eligibilityPayload(question)).mode, "question_bank", `${qlId}/${question.language}: approval flow did not use Question Bank conversion.`);
    if (qlId === "SPA-QL-040") {
      assert.ok(question.stimulusSvgs[0]?.includes(DIRECTION_CUE), `${qlId}/${question.language}: direction cue missing.`);
      assert.ok(question.stimulusSvgs[0]?.includes("data-fold-direction="), `${qlId}/${question.language}: direction semantics missing.`);
      for (const option of question.optionSvgs) assert.ok(!option.includes(DIRECTION_CUE), `${qlId}/${question.language}: direction cue leaked into option.`);
    }
  }

  const enProjection = visualProjection(byLanguage[0]);
  assert.deepEqual(visualProjection(byLanguage[1]), enProjection, `${qlId}: Hindi visual/answer parity failed.`);
  assert.deepEqual(visualProjection(byLanguage[2]), enProjection, `${qlId}: Punjabi visual/answer parity failed.`);
  evidence[qlId] = {
    answer: byLanguage[0].answer,
    mode: byLanguage[0].mode,
    representation: byLanguage[0].representation,
    contentFingerprint: byLanguage[0].contentFingerprint,
    languages: byLanguage.map((question) => question.language),
  };
}

const pfcBatch = generateSpatialProductionStudioBatchV2({ seed: "PFC-STANDARD-BATCH", chapterCode: "PFC-001", count: 12, language: "en" });
assert.equal(pfcBatch.questions.length, 12);
assert.ok(pfcBatch.questions.every((question) => question.chapterCode === "PFC-001"));
assert.equal(new Set(pfcBatch.questions.map((question) => question.contentFingerprint)).size, 12);

const tpfBatch = generateSpatialProductionStudioBatchV2({ seed: "TPF-STANDARD-BATCH", chapterCode: "TPF-001", count: 8, language: "pa" });
assert.equal(tpfBatch.questions.length, 8);
assert.ok(tpfBatch.questions.every((question) => question.chapterCode === "TPF-001"));
assert.ok(tpfBatch.questions.every((question) => question.stimulusSvgs[0]?.includes(DIRECTION_CUE)));

const fullBatch = generateSpatialProductionStudioBatchV2({ seed: "SPA-FULL-40", count: 40, language: "en" });
assert.equal(fullBatch.questions.length, 40);
assert.equal(new Set(fullBatch.questions.map((question) => question.qlId)).size, 40, "Full Spatial batch did not exercise every permanent QL once.");
assert.ok(fullBatch.questions.some((question) => question.chapterCode === "PFC-001"));
assert.ok(fullBatch.questions.some((question) => question.chapterCode === "TPF-001"));

const result = {
  status: "PASS_PFC_TPF_STANDARD_QUESTION_STUDIO_INTEGRATION_V1",
  approvalAuthority: PFC_TPF_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V2.integrationAuthority,
  legacyPermanentQlCount: LEGACY_SPATIAL_PACKAGE.permanentQlCount,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V2.permanentQlCount,
  addedPermanentQlRange: "SPA-QL-035..SPA-QL-040",
  languages: LANGUAGES,
  pfcTpfEvidence: evidence,
  standardLifecycle: {
    questionStudioDiscoverable: true,
    registrationStatus: "REGISTERED",
    persistenceAllowed: true,
    questionBankStatus: "READY_FOR_STORAGE",
    testEligibility: "ELIGIBLE",
    manualApprovalRequired: true,
    automaticStudentPublication: false,
  },
  directionCueRestoredForTpf: true,
  legacyPackagePreserved: true,
};
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-standard-question-studio-integration-v1-evidence.json", `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result));
