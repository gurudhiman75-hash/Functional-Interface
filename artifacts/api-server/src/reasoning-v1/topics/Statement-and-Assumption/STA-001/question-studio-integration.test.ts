import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../question-studio-review-registry.ts";
import {
  generateQuestion as generateSharedQuestionStudioQuestion,
  isSta001QuestionStudioRequest,
  listQuestionStudioPackages,
} from "../../../../question-studio/shared-generation-engine.ts";
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

assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.multilingualChapterFrozen, true);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.sourceQuestionStudioDiscoverable, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.questionBankWritable, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.testEligible, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.mockTestEligible, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.publiclyPublishable, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.automaticStudentPublication, false);

const registryPackages = listReasoningV1QuestionStudioReviewPackages();
assert.ok(registryPackages.some((entry) => entry.packageId === "STA-001"), "STA-001 missing from Reasoning V1 review registry");
const enabledPackages = listEnabledReasoningV1QuestionStudioPackages();
assert.ok(enabledPackages.some((entry) => entry.packageId === "STA-001"), "STA-001 not enabled for review discovery");

assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId, "STA-001");
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioVisible, true);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 4);
assert.deepEqual(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds, ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004"]);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.presentationProfiles.length, 9);
assert.deepEqual(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.sourceRuntimeQuestionStudioDiscoverable, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankStatus, "NOT_STORED");
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

const canonicalByLanguage = new Map<string, string[]>();
for (const language of ["en", "hi", "pa"] as const) {
  const ids: string[] = [];
  for (const qlId of STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds) {
    const preview = previewSta001QuestionStudioReview({
      language,
      qlId,
      count: 2,
      seed: `sta-integration:${language}:${qlId}`,
    });
    assert.equal(preview.questions.length, 2);
    for (const question of preview.questions) {
      assert.equal(question.packageId, "STA-001");
      assert.equal(question.chapterId, "REAS-STA");
      assert.equal(question.permanentQlId, qlId);
      assert.equal(question.qlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.lifecycleStatus, "REVIEW_ONLY");
      assert.equal(question.questionStudioVisible, true);
      assert.equal(question.integrationAuthority, STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY);
      assert.equal(question.source.freezeId, STA_001_QUESTION_STUDIO_RELEASE_FREEZE);
      assert.equal(question.validation.valid, true);
      assert.equal(question.validation.oracleParity, true);
      assert.equal(question.validation.optionsDistinct, true);
      assert.equal(question.validation.exactlyOneCorrect, true);
      assert.equal(question.validation.multilingualFrozen, true);
      assert.equal(question.options.length, question.optionCount);
      assert.ok(question.candidateCount >= 2 && question.candidateCount <= 5);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < question.optionCount);
      assert.equal(question.options[question.correctIndex], question.answer);
      assert.ok(question.displayStem.includes(question.statement));
      if (language === "hi") assert.match(`${question.instruction} ${question.statement}`, /[\u0900-\u097F]/u);
      if (language === "pa") assert.match(`${question.instruction} ${question.statement}`, /[\u0A00-\u0A7F]/u);

      const payload = buildSta001QuestionStudioPayload(question);
      assert.equal(payload.packageId, "STA-001");
      assert.equal(payload.permanentQlId, qlId);
      assert.equal(payload.patternId, question.presentationProfile);
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
      ids.push(question.canonicalItemId);
    }
  }
  canonicalByLanguage.set(language, ids);
}
assert.equal(canonicalByLanguage.size, 3);

const registryPreview = previewReasoningV1QuestionStudioReview({
  packageId: "STA-001",
  language: "hi",
  qlId: "STA-QL-004",
  count: 1,
  seed: "sta-registry-preview",
});
assert.equal(registryPreview.questions.length, 1);
assert.equal(registryPreview.questions[0]!.permanentQlId, "STA-QL-004");
assert.equal(registryPreview.questions[0]!.language, "hi");
assert.throws(
  () => persistReasoningV1QuestionStudioReview({
    packageId: "STA-001",
    language: "en",
    qlId: "STA-QL-001",
    count: 1,
    seed: "sta-persistence-boundary",
  }),
  /authenticated shared Question Studio review-run route/u,
  "STA registry must not bypass authenticated review-run persistence",
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

const deterministicA = previewSta001QuestionStudioReview({
  language: "pa",
  qlId: "STA-QL-003",
  count: 3,
  seed: "sta-deterministic-contract",
});
const deterministicB = previewSta001QuestionStudioReview({
  language: "pa",
  qlId: "STA-QL-003",
  count: 3,
  seed: "sta-deterministic-contract",
});
assert.deepEqual(deterministicB, deterministicA, "STA Question Studio preview is not deterministic for a fixed seed");

const cockpitPackages = listQuestionStudioPackages();
const cockpitSta = cockpitPackages.find((entry: any) => entry.packageId === "STA-001") as any;
assert.ok(cockpitSta, "STA-001 missing from shared Question Studio capabilities");
assert.equal(cockpitSta.enabled, true);
assert.equal(cockpitSta.permanentQlCount, 4);
assert.deepEqual(cockpitSta.permanentQlIds, ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004"]);
assert.equal(cockpitSta.presentationProfiles.length, 9);
assert.deepEqual(cockpitSta.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(cockpitSta.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(cockpitSta.questionBankStatus, "NOT_STORED");
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
  });
  assert.equal(generated.questions.length, 3);
  assert.equal(generated.questionPackages.length, 3);
  for (const raw of generated.questions as Array<Record<string, any>>) {
    assert.equal(raw.packageId, "STA-001");
    assert.equal(raw.permanentQlId, "STA-QL-002");
    assert.equal(raw.language, language);
    assert.equal(raw.questionBankWritable, false);
    assert.equal(raw.testEligible, false);
    assert.equal(raw.mockTestEligible, false);
    assert.equal(raw.publiclyPublishable, false);
    assert.equal(raw.automaticStudentPublication, false);
  }
  assert.equal((generated.generationContext as any).generationDomain, "reasoning-v1");
  assert.equal((generated.generationContext as any).packageId, "STA-001");
  assert.equal((generated.generationContext as any).permanentQlCount, 4);
  assert.equal((generated.generationContext as any).multilingualChapterFrozen, true);
  assert.equal((generated.generationContext as any).questionBankWritable, false);
  assert.equal((generated.generationContext as any).testEligible, false);
  assert.equal((generated.generationContext as any).mockTestEligible, false);
  assert.equal((generated.generationContext as any).publiclyPublishable, false);
}

const cp001 = await generateSharedQuestionStudioQuestion({
  packageId: "STA-001",
  cpId: "STA-CP-001",
  language: "en",
  count: 4,
  seed: "sta-cp001-filter",
});
assert.ok((cp001.questionPackages as Array<{ checkpointId: string }>).every((entry) => entry.checkpointId === "STA-CP-001"));
const cp002 = await generateSharedQuestionStudioQuestion({
  packageId: "STA-001",
  cpId: "STA-CP-002",
  language: "en",
  count: 4,
  seed: "sta-cp002-filter",
});
assert.ok((cp002.questionPackages as Array<{ checkpointId: string }>).every((entry) => entry.checkpointId === "STA-CP-002"));

const routeSource = source("../../../../routes/admin-question-studio-average.ts");
for (const marker of [
  "isSta001QuestionStudioRequest",
  "const staRequest = isSta001QuestionStudioRequest",
  "? \"STA-001\"",
  "reasoning-v1-sta-001",
  "cpId,",
  "generationSystem: reasoningRequest ? \"reasoning-v1\" : \"quant-v4\"",
  "presentationProfiles",
  "canonicalProblems",
]) {
  assert.ok(routeSource.includes(marker), `authenticated Question Studio route missing STA marker: ${marker}`);
}

const operationsSource = source("../../../../../admin-app/src/pages/content/QuestionStudioOperationsPage.tsx");
assert.ok(operationsSource.includes("QuestionStudioStatementAssumptionReviewPanel"), "STA admin review panel is not mounted in Question Studio Operations");
const panelSource = source("../../../../../admin-app/src/pages/content/QuestionStudioStatementAssumptionReviewPanel.tsx");
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
  assert.ok(panelSource.includes(marker), `STA admin review panel missing marker: ${marker}`);
}

console.log("PASS_STA_001_FINAL_MULTILINGUAL_QUESTION_STUDIO_INTEGRATION_V1");
console.log(`freeze ${STA_001_QUESTION_STUDIO_RELEASE_FREEZE}`);
console.log(`integration authority ${STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY}`);
console.log(`permanent QLs ${STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount}`);
console.log(`presentation profiles ${STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.presentationProfiles.length}`);
console.log(`languages ${STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLanguages.join(",")}`);
console.log("Reasoning registry/cockpit/authenticated route/admin panel PASS");
console.log("Question Bank/test/mock/public/automatic publication all false");
