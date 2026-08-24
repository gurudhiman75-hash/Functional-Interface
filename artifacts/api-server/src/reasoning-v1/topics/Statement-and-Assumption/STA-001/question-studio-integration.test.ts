import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const reasoningRegistry = await import("../../../question-studio-review-registry.ts");
const sharedGenerationEngine = await import("../../../../question-studio/shared-generation-engine.ts");
const {
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} = reasoningRegistry;
const {
  generateQuestion: generateSharedQuestionStudioQuestion,
  isSta001QuestionStudioRequest,
  listQuestionStudioPackages,
} = sharedGenerationEngine;

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

function assertReviewOnly(payload: Record<string, any>) {
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
}

assert.ok(listReasoningV1QuestionStudioReviewPackages().some((entry: any) => entry.packageId === "STA-001"));
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioVisible, true);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 6);
assert.deepEqual(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds, [
  "STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004", "STA-QL-005", "STA-QL-006",
]);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointCount, 4);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.presentationProfiles.length, 9);
assert.deepEqual(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualChapterFrozen, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);

assert.equal(isSta001QuestionStudioRequest({ packageId: "STA-001" }), true);
assert.equal(isSta001QuestionStudioRequest({ canonicalProblemId: "STA-QL-006" }), true);
assert.equal(isSta001QuestionStudioRequest({ cpId: "STA-CP-004" }), true);
assert.equal(isSta001QuestionStudioRequest({ packageId: "WOR-001" }), false);

for (const qlId of STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds) {
  const seed = `sta-v4-integration:${qlId}`;
  const byLanguage = Object.fromEntries((["en", "hi", "pa"] as const).map((language) => [language, previewSta001QuestionStudioReview({
    language,
    qlId,
    profileId: "BANK_3X5",
    count: 4,
    seed,
  }).questions]));
  for (let index = 0; index < 4; index += 1) {
    const en = byLanguage.en![index]!;
    assert.equal(en.permanentQlId, qlId);
    assert.equal(en.validation.valid, true);
    assert.equal(en.validation.crossLanguageSemanticParity, true);
    assert.equal(en.validation.antiCueV4, true);
    assert.equal(en.validation.multilingualFrozen, false);
    assertReviewOnly(buildSta001QuestionStudioPayload(en) as Record<string, any>);
    for (const language of ["hi", "pa"] as const) {
      const translated = byLanguage[language]![index]!;
      assert.equal(translated.canonicalItemId, en.canonicalItemId);
      assert.equal(translated.contentFingerprint, en.contentFingerprint);
      assert.deepEqual(translated.candidates.map((candidate) => candidate.candidateId), en.candidates.map((candidate) => candidate.candidateId));
      assert.deepEqual(translated.answerSet, en.answerSet);
      assert.equal(translated.source.freezeId, STA_001_QUESTION_STUDIO_RELEASE_FREEZE);
      assert.equal(translated.integrationAuthority, STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY);
      if (language === "hi") assert.match(`${translated.instruction} ${translated.statement}`, /[\u0900-\u097F]/u);
      if (language === "pa") assert.match(`${translated.instruction} ${translated.statement}`, /[\u0A00-\u0A7F]/u);
    }
  }
}

const registryPreview = previewReasoningV1QuestionStudioReview({
  packageId: "STA-001",
  language: "pa",
  qlId: "STA-QL-005",
  profileId: "SSC_2X4",
  count: 1,
  seed: "sta-v4-registry-preview",
});
assert.equal(registryPreview.questions[0]?.permanentQlId, "STA-QL-005");
assert.throws(
  () => persistReasoningV1QuestionStudioReview({ packageId: "STA-001", language: "en", qlId: "STA-QL-001" }),
  /V4 remains review-only/u,
);

for (const profile of STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.presentationProfiles) {
  const preview = previewSta001QuestionStudioReview({ language: "en", profileId: profile.profileId, count: 1, seed: `sta-v4-profile:${profile.profileId}` });
  assert.equal(preview.questions[0]?.presentationProfile, profile.profileId);
}

const cockpit = listQuestionStudioPackages().find((entry: any) => entry.packageId === "STA-001") as any;
assert.ok(cockpit);
assert.equal(cockpit.permanentQlCount, 6);
assert.equal(cockpit.presentationProfiles.length, 9);
assert.deepEqual(cockpit.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(cockpit.questionBankWritable, false);
assert.equal(cockpit.testEligible, false);
assert.equal(cockpit.mockTestEligible, false);
assert.equal(cockpit.publiclyPublishable, false);

for (const qlId of ["STA-QL-001", "STA-QL-005", "STA-QL-006"] as const) {
  const generated = await generateSharedQuestionStudioQuestion({
    packageId: "STA-001",
    canonicalProblemId: qlId,
    language: "en",
    count: 3,
    seed: `sta-v4-shared:${qlId}`,
  }) as any;
  assert.equal(generated.questions.length, 3);
  for (const raw of generated.questions as Array<Record<string, any>>) {
    assert.equal(raw.permanentQlId, qlId);
    assertReviewOnly(raw);
  }
}

for (const cpId of ["STA-CP-001", "STA-CP-002", "STA-CP-003", "STA-CP-004"] as const) {
  const generated = await generateSharedQuestionStudioQuestion({ packageId: "STA-001", cpId, language: "en", count: 3, seed: `sta-v4-${cpId}` }) as any;
  assert.ok(generated.questionPackages.every((entry: any) => entry.checkpointId === cpId));
}

const routeSource = source("../../../../routes/admin-question-studio-average.ts");
assert.ok(routeSource.includes("isSta001QuestionStudioRequest"));
assert.ok(routeSource.includes("reasoning-v1-sta-001"));
const panelSource = source("../../../../../../admin-app/src/pages/content/QuestionStudioStatementAssumptionReviewPanel.tsx");
for (const marker of ["STA-QL-005", "STA-QL-006", "BANK_5X5", "PUNJAB_3X4", "canonicalProblemId: qlId", "patternId: selectedProfile"]) {
  assert.ok(panelSource.includes(marker), `STA V4 admin panel missing marker: ${marker}`);
}

console.log("PASS_STA_001_QUESTION_STUDIO_INTEGRATION_V4");
console.log(`authority ${STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY}`);
console.log(`release state ${STA_001_QUESTION_STUDIO_RELEASE_FREEZE}`);
console.log("6 QLs / 4 checkpoints / 9 profiles / EN-HI-PA semantic identity / delivery locked");
