import assert from "node:assert/strict";
import { buildSta001QuestionStudioPayload } from "./question-studio-payload.ts";
import {
  STA_001_QUESTION_STUDIO_RELEASE_FREEZE,
  STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  STA_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewSta001QuestionStudioReview,
} from "./question-studio-review-v4-1.ts";

const registry = await import("../../../question-studio-review-registry.ts");
const shared = await import("../../../../question-studio/shared-generation-engine.ts");

assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 6);
assert.deepEqual(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds, ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004", "STA-QL-005", "STA-QL-006"]);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointCount, 4);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.presentationProfiles.length, 9);
assert.deepEqual(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualChapterFrozen, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioVisible, true);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

assert.ok(registry.listReasoningV1QuestionStudioReviewPackages().some((entry: { packageId: string }) => entry.packageId === "STA-001"));
assert.ok(registry.listEnabledReasoningV1QuestionStudioPackages().some((entry: { packageId: string }) => entry.packageId === "STA-001"));
assert.equal(shared.isSta001QuestionStudioRequest({ packageId: "STA-001" }), true);
assert.equal(shared.isSta001QuestionStudioRequest({ canonicalProblemId: "STA-QL-006" }), true);
assert.equal(shared.isSta001QuestionStudioRequest({ cpId: "STA-CP-004" }), true);

function assertLockedPayload(payload: Record<string, any>): void {
  assert.equal(payload.packageId, "STA-001");
  assert.equal(payload.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(payload.questionStudioStagingStatus, "REVIEW_QUEUE_ENABLED");
  assert.equal(payload.multilingualChapterFrozen, false);
  assert.equal(payload.questionBankStatus, "NOT_STORED");
  assert.equal(payload.questionBankWritable, false);
  assert.equal(payload.testEligibility, "INELIGIBLE");
  assert.equal(payload.testEligible, false);
  assert.equal(payload.mockTestEligible, false);
  assert.equal(payload.publiclyPublishable, false);
  assert.equal(payload.automaticStudentPublication, false);
  assert.equal(payload.manualApprovalRequired, true);
  assert.equal(payload.generationContext.multilingualChapterFrozen, false);
  assert.equal(payload.generationContext.persistenceAllowed, false);
}

for (const qlId of STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds) {
  const seed = `sta-v41-integration:${qlId}`;
  const byLanguage = Object.fromEntries((["en", "hi", "pa"] as const).map((language) => [language, previewSta001QuestionStudioReview({
    language, qlId, profileId: "BANK_5X5", count: 3, seed,
  }).questions]));
  for (let index = 0; index < 3; index += 1) {
    const en = byLanguage.en[index]!;
    assert.equal(en.permanentQlId, qlId);
    assert.equal(en.integrationAuthority, STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY);
    assert.equal(en.source.freezeId, STA_001_QUESTION_STUDIO_RELEASE_FREEZE);
    assert.equal(en.validation.multilingualFrozen, false);
    assertLockedPayload(buildSta001QuestionStudioPayload(en) as Record<string, any>);
    for (const language of ["hi", "pa"] as const) {
      const translated = byLanguage[language][index]!;
      assert.equal(translated.canonicalItemId, en.canonicalItemId);
      assert.equal(translated.contentFingerprint, en.contentFingerprint);
      assert.deepEqual(translated.candidates.map((candidate) => candidate.candidateId), en.candidates.map((candidate) => candidate.candidateId));
      assert.deepEqual(translated.answerSet, en.answerSet);
    }
  }
}

for (const checkpointId of ["STA-CP-001", "STA-CP-002", "STA-CP-003", "STA-CP-004"] as const) {
  const preview = previewSta001QuestionStudioReview({ language: "en", checkpointId, count: 4, seed: `sta-v41-cp:${checkpointId}` });
  assert.ok(preview.questions.every((question) => question.checkpointId === checkpointId));
}

for (const profile of STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.presentationProfiles) {
  const preview = previewSta001QuestionStudioReview({ language: "en", profileId: profile.profileId, count: 1, seed: `sta-v41-profile:${profile.profileId}` });
  assert.equal(preview.questions[0]!.presentationProfile, profile.profileId);
}

const capabilities = shared.listQuestionStudioPackages();
const sta = capabilities.find((entry: any) => entry.packageId === "STA-001");
assert.ok(sta, "STA-001 missing from shared Question Studio capabilities");
assert.equal(sta.permanentQlCount, 6);
assert.equal(sta.multilingualChapterFrozen, false);
assert.equal(sta.questionBankWritable, false);
assert.equal(sta.testEligible, false);
assert.equal(sta.mockTestEligible, false);
assert.equal(sta.publiclyPublishable, false);

for (const language of ["en", "hi", "pa"] as const) {
  const generated = await shared.generateQuestion({
    packageId: "STA-001",
    canonicalProblemId: "STA-QL-006",
    patternId: "BANK_4X5",
    language,
    count: 3,
    seed: "sta-v41-shared-engine",
  }) as any;
  assert.equal(generated.questions.length, 3);
  assert.equal(generated.questionPackages.length, 3);
  assert.equal(generated.generationContext.permanentQlCount, 6);
  assert.equal(generated.generationContext.multilingualChapterFrozen, false);
  assert.equal(generated.generationContext.questionBankWritable, false);
  assert.equal(generated.generationContext.testEligible, false);
  assert.equal(generated.generationContext.mockTestEligible, false);
  assert.equal(generated.generationContext.publiclyPublishable, false);
  for (const payload of generated.questions as Record<string, any>[]) {
    assert.equal(payload.permanentQlId, "STA-QL-006");
    assert.equal(payload.language, language);
    assertLockedPayload(payload);
  }
}

assert.throws(() => registry.persistReasoningV1QuestionStudioReview({
  packageId: "STA-001", language: "en", qlId: "STA-QL-001", count: 1, seed: "sta-v41-lock",
}), /review-only|delivery stays locked/u);

console.log("PASS_STA_001_QUESTION_STUDIO_V4_1_INTEGRATION");
