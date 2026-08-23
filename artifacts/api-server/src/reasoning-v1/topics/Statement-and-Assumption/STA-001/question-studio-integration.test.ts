import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const reasoningRegistryModulePath = "../../../question-studio-review-registry.ts";
const reasoningRegistry = await import(reasoningRegistryModulePath);
const {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} = reasoningRegistry;

const sharedGenerationEngineModulePath = "../../../../question-studio/shared-generation-engine.ts";
const sharedGenerationEngine = await import(sharedGenerationEngineModulePath);
const {
  generateQuestion: generateSharedQuestionStudioQuestion,
  isSta001QuestionStudioRequest,
  listQuestionStudioPackages,
} = sharedGenerationEngine;

import { STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST } from "./multilingual-freeze-manifest.ts";
import { buildSta001QuestionStudioPayload } from "./question-studio-payload.ts";
import {
  STA_001_QUESTION_STUDIO_RELEASE_FREEZE,
  STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  STA_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewSta001QuestionStudioReview,
} from "./question-studio-review.ts";

function source(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function assertReviewOnlyPayload(payload: Record<string, any>) {
  assert.equal(payload.packageId, "STA-001");
  assert.equal(payload.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(payload.questionStudioStagingStatus, "REVIEW_QUEUE_ENABLED");
  assert.equal(payload.questionBankStatus, "NOT_STORED");
  assert.equal(payload.questionBankWritable, false);
  assert.equal(payload.testEligibility, "INELIGIBLE");
  assert.equal(payload.testEligible, false);
  assert.equal(payload.mockTestEligible, false);
  assert.equal(payload.publiclyPublishable, false);
  assert.equal(payload.automaticStudentPublication, false);
  assert.equal(payload.manualApprovalRequired, true);
  assert.equal(payload.generationContext.multilingualChapterFrozen, true);
  assert.equal(payload.generationContext.sourceRuntimeQuestionStudioDiscoverable, false);
}

assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.multilingualChapterFrozen, true);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.sourceQuestionStudioDiscoverable, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.questionBankWritable, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.testEligible, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.mockTestEligible, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.publiclyPublishable, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.automaticStudentPublication, false);

assert.ok(listReasoningV1QuestionStudioReviewPackages().some((entry: any) => entry.packageId === "STA-001"));
assert.ok(listEnabledReasoningV1QuestionStudioPackages().some((entry: any) => entry.packageId === "STA-001"));
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioVisible, true);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 4);
assert.deepEqual(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds, ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004"]);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.presentationProfiles.length, 9);
assert.deepEqual(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.sourceRuntimeQuestionStudioDiscoverable, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

assert.equal(isSta001QuestionStudioRequest({ packageId: "STA-001" }), true);
assert.equal(isSta001QuestionStudioRequest({ topic: "Reasoning", subtopic: "Statement & Assumption" }), true);
assert.equal(isSta001QuestionStudioRequest({ canonicalProblemId: "STA-QL-004" }), true);
assert.equal(isSta001QuestionStudioRequest({ cpId: "STA-CP-002" }), true);
assert.equal(isSta001QuestionStudioRequest({ packageId: "WOR-001" }), false);

for (const language of ["en", "hi", "pa"] as const) {
  for (const qlId of STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds) {
    const preview = previewSta001QuestionStudioReview({
      language,
      qlId,
      count: 2,
      seed: `sta-integration:${language}:${qlId}`,
    });
    assert.equal(preview.questions.length, 2);
    for (const question of preview.questions) {
      assert.equal(question.permanentQlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.lifecycleStatus, "REVIEW_ONLY");
      assert.equal(question.integrationAuthority, STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY);
      assert.equal(question.source.freezeId, STA_001_QUESTION_STUDIO_RELEASE_FREEZE);
      assert.equal(question.validation.valid, true);
      assert.equal(question.options.length, question.optionCount);
      assert.equal(question.options[question.correctIndex], question.answer);
      if (language === "hi") assert.match(`${question.instruction} ${question.statement}`, /[\u0900-\u097F]/u);
      if (language === "pa") assert.match(`${question.instruction} ${question.statement}`, /[\u0A00-\u0A7F]/u);
      assertReviewOnlyPayload(buildSta001QuestionStudioPayload(question) as Record<string, any>);
    }
  }
}

const registryPreview = previewReasoningV1QuestionStudioReview({
  packageId: "STA-001",
  language: "hi",
  qlId: "STA-QL-004",
  count: 1,
  seed: "sta-registry-preview",
});
const registryQuestion = registryPreview.questions[0] as Record<string, any> | undefined;
assert.ok(registryQuestion, "STA registry preview returned no question");
assert.equal(registryQuestion.packageId, "STA-001");
assert.equal(registryQuestion.permanentQlId, "STA-QL-004");
assert.equal(registryQuestion.language, "hi");
assert.throws(
  () => persistReasoningV1QuestionStudioReview({
    packageId: "STA-001",
    language: "en",
    qlId: "STA-QL-001",
    count: 1,
    seed: "sta-persistence-boundary",
  }),
  /authenticated shared Question Studio review-run route/u,
);

for (const profileId of STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.presentationProfiles.map((entry) => entry.profileId)) {
  const preview = previewSta001QuestionStudioReview({
    language: "en",
    profileId,
    count: 1,
    seed: `sta-profile-reach:${profileId}`,
  });
  assert.equal(preview.questions.length, 1, `${profileId}: no review question generated`);
  assert.equal(preview.questions[0]!.presentationProfile, profileId);
}

const deterministicInput = {
  language: "pa" as const,
  qlId: "STA-QL-003" as const,
  count: 3,
  seed: "sta-deterministic-contract",
};
assert.deepEqual(
  previewSta001QuestionStudioReview(deterministicInput),
  previewSta001QuestionStudioReview(deterministicInput),
  "STA Question Studio preview is not deterministic",
);

const cockpitPackages = listQuestionStudioPackages();
const cockpitSta = cockpitPackages.find((entry: any) => entry.packageId === "STA-001") as any;
assert.ok(cockpitSta, "STA-001 missing from shared Question Studio capabilities");
assert.equal(cockpitSta.enabled, true);
assert.equal(cockpitSta.permanentQlCount, 4);
assert.equal(cockpitSta.presentationProfiles.length, 9);
assert.deepEqual(cockpitSta.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(cockpitSta.questionBankWritable, false);
assert.equal(cockpitSta.testEligible, false);
assert.equal(cockpitSta.mockTestEligible, false);
assert.equal(cockpitSta.publiclyPublishable, false);
assert.equal(cockpitSta.automaticStudentPublication, false);
assert.ok(cockpitPackages.some((entry: any) => entry.packageId === "WOR-001"), "WOR shared capability regressed");
assert.ok(cockpitPackages.some((entry: any) => entry.packageId === "NUM-002"), "NUM-002 shared capability regressed");

for (const language of ["en", "hi", "pa"] as const) {
  const generated = await generateSharedQuestionStudioQuestion({
    packageId: "STA-001",
    canonicalProblemId: "STA-QL-002",
    language,
    count: 3,
    seed: `sta-shared-engine:${language}`,
  }) as any;
  assert.equal(generated.questions.length, 3);
  assert.equal(generated.questionPackages.length, 3);
  for (const raw of generated.questions as Array<Record<string, any>>) {
    assert.equal(raw.permanentQlId, "STA-QL-002");
    assert.equal(raw.language, language);
    assertReviewOnlyPayload(raw);
  }
  assert.equal(generated.generationContext.generationDomain, "reasoning-v1");
  assert.equal(generated.generationContext.packageId, "STA-001");
  assert.equal(generated.generationContext.permanentQlCount, 4);
  assert.equal(generated.generationContext.multilingualChapterFrozen, true);
  assert.equal(generated.generationContext.questionBankWritable, false);
  assert.equal(generated.generationContext.testEligible, false);
  assert.equal(generated.generationContext.mockTestEligible, false);
  assert.equal(generated.generationContext.publiclyPublishable, false);
}

const cp001 = await generateSharedQuestionStudioQuestion({
  packageId: "STA-001",
  cpId: "STA-CP-001",
  language: "en",
  count: 4,
  seed: "sta-cp001-filter",
}) as any;
assert.ok(cp001.questionPackages.every((entry: any) => entry.checkpointId === "STA-CP-001"));
const cp002 = await generateSharedQuestionStudioQuestion({
  packageId: "STA-001",
  cpId: "STA-CP-002",
  language: "en",
  count: 4,
  seed: "sta-cp002-filter",
}) as any;
assert.ok(cp002.questionPackages.every((entry: any) => entry.checkpointId === "STA-CP-002"));

const routeSource = source("../../../../routes/admin-question-studio-average.ts");
for (const marker of [
  "isSta001QuestionStudioRequest",
  "const staRequest = isSta001QuestionStudioRequest",
  "reasoning-v1-sta-001",
  "generationSystem: reasoningRequest ? \"reasoning-v1\" : \"quant-v4\"",
  "presentationProfiles",
  "canonicalProblems",
]) {
  assert.ok(routeSource.includes(marker), `authenticated route missing STA marker: ${marker}`);
}

const operationsSource = source("../../../../../../admin-app/src/pages/content/QuestionStudioOperationsPage.tsx");
assert.ok(operationsSource.includes("QuestionStudioStatementAssumptionReviewPanel"));
const panelSource = source("../../../../../../admin-app/src/pages/content/QuestionStudioStatementAssumptionReviewPanel.tsx");
for (const marker of [
  "STA-QL-001",
  "STA-QL-002",
  "STA-QL-003",
  "STA-QL-004",
  "BANK_5X5",
  "PUNJAB_3X4",
  "canonicalProblemId: qlId",
  "patternId: selectedProfile",
  "Question Bank writes, tests, mocks, public publication and automatic student publication remain disabled",
]) {
  assert.ok(panelSource.includes(marker), `STA admin panel missing marker: ${marker}`);
}

console.log("PASS_STA_001_FINAL_MULTILINGUAL_QUESTION_STUDIO_INTEGRATION_V1");
console.log(`freeze ${STA_001_QUESTION_STUDIO_RELEASE_FREEZE}`);
console.log(`integration authority ${STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY}`);
console.log(`permanent QLs ${STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount}`);
console.log(`presentation profiles ${STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.presentationProfiles.length}`);
console.log(`languages ${STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLanguages.join(",")}`);
console.log("Reasoning registry/cockpit/authenticated route/admin panel PASS");
console.log("Question Bank/test/mock/public/automatic publication all false");
