import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { COM001_ENGLISH_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com001-english-freeze-v2";
import { COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com001-hi-pa-localization-freeze-v2";
import { listCom001ReviewV2QlIds } from "../../knowledge-v1/computer-awareness/com001-review-synthesis-v2";
import {
  COM001_QUESTION_BANK_STATUS,
  COM001_QUESTION_STUDIO_PACKAGE_ID,
  COM001_QUESTION_STUDIO_RUNTIME_MODE,
  COM001_REVIEW_CONTENT_AUTHORITY_VERSION,
  COM001_REVIEW_ONLY_PACKAGE,
  knowledgeV1Com001QuestionStudioAdapter,
} from "./knowledge-v1-com001-adapter";

assert.equal(COM001_REVIEW_ONLY_PACKAGE.enabled, true);
assert.equal(COM001_REVIEW_ONLY_PACKAGE.engineId, "knowledge-v1");
assert.equal(COM001_REVIEW_ONLY_PACKAGE.runtimeMode, "review-only");
assert.equal(COM001_REVIEW_ONLY_PACKAGE.questionBankStatus, "NOT_STORED");
assert.equal(COM001_REVIEW_ONLY_PACKAGE.publiclyPublishable, false);
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.reviewOnly, true);
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.contentAuthorityVersion, "V2");
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.humanReviewApproved, true);
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.reviewRunPersistenceAllowed, true);
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.canonicalQuestionPersistenceAllowed, false);
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.questionBankStatus, "NOT_STORED");
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.questionBankWritable, false);
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.testEligible, false);
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.automaticStudentPublication, false);
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.difficultyFilterSupported, false);
assert.equal(
  COM001_REVIEW_ONLY_PACKAGE.metadata?.englishFreezeAuthorityId,
  COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
);
assert.equal(
  COM001_REVIEW_ONLY_PACKAGE.metadata?.englishCombinedFingerprint,
  COM001_ENGLISH_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
);
assert.equal(
  COM001_REVIEW_ONLY_PACKAGE.metadata?.localizationFreezeAuthorityId,
  COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
);
assert.equal(
  COM001_REVIEW_ONLY_PACKAGE.metadata?.localizationCombinedFingerprint,
  COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
);

const qlIds = listCom001ReviewV2QlIds();
assert.equal(qlIds.length, 9);

let auditedQuestions = 0;
let reviewOnlyApprovalChecks = 0;
for (const qlId of qlIds) {
  for (const language of ["en", "hi", "pa"] as const) {
    const request = {
      engineId: "knowledge-v1" as const,
      packageId: COM001_QUESTION_STUDIO_PACKAGE_ID,
      patternId: qlId,
      language,
      runtimeMode: COM001_QUESTION_STUDIO_RUNTIME_MODE,
      count: 40,
      seed: `question-studio-v2-batch:${qlId}:${language}`,
      difficulty: "Medium" as const,
    };
    const first = await knowledgeV1Com001QuestionStudioAdapter.generate(request);
    const replay = await knowledgeV1Com001QuestionStudioAdapter.generate(request);
    assert.deepEqual(first, replay, `${qlId}/${language}: adapter replay changed`);
    assert.equal(first.questions.length, 40);
    assert.equal(first.generationContext?.reviewOnly, true);
    assert.equal(first.generationContext?.contentAuthorityVersion, COM001_REVIEW_CONTENT_AUTHORITY_VERSION);
    assert.equal(first.generationContext?.humanReviewApproved, true);
    assert.equal(first.generationContext?.difficultyFilterApplied, false);
    assert.equal(first.generationContext?.canonicalQuestionPersistenceAllowed, false);
    assert.equal(first.generationContext?.questionBankStatus, "NOT_STORED");
    assert.equal(first.generationContext?.questionBankWritable, false);
    assert.equal(first.generationContext?.testEligible, false);
    assert.equal(first.generationContext?.publiclyPublishable, false);
    assert.equal(first.generationContext?.automaticStudentPublication, false);
    assert.equal(
      first.generationContext?.englishFreezeAuthorityId,
      COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
    );
    assert.equal(
      first.generationContext?.localizationCombinedFingerprint,
      COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
    );

    const stems = new Set<string>();
    const correctPositions = new Set<number>();
    const relationalModes = new Set<string>();
    const capacityConventions = new Set<string>();
    for (const rawQuestion of first.questions) {
      auditedQuestions += 1;
      const question = rawQuestion as Record<string, any>;
      assert.equal(question.packageId, "COM-001");
      assert.equal(question.patternId, qlId);
      assert.equal(question.qlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.reviewOnly, true);
      assert.equal(question.runtimeRegistered, false);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
      assert.equal(question.correct, question.correctIndex);
      assert.equal(question.text, question.stem);
      assert.equal(question.questionBankStatus, COM001_QUESTION_BANK_STATUS);
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.automaticStudentPublication, false);
      assert.equal(question.localizationV2?.englishFreezeAuthorityId, COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId);
      assert.equal(question.localizationV2?.correctIndexInvariant, true);
      assert.equal(question.localizationV2?.optionOrderInvariant, true);
      assert.equal(question.lifecycleV2?.questionStudioV2Active, false);
      assert.equal(question.lifecycleV2?.questionBankWritable, false);
      assert.equal(question.questionStudioReview.registrationStatus, "REVIEW_ONLY_REGISTERED");
      assert.equal(question.questionStudioReview.runtimeMode, "review-only");
      assert.equal(question.questionStudioReview.contentAuthorityVersion, "V2");
      assert.equal(question.questionStudioReview.humanReviewApproved, true);
      assert.equal(question.questionStudioReview.reviewRunPersistenceAllowed, true);
      assert.equal(question.questionStudioReview.canonicalQuestionPersistenceAllowed, false);
      assert.equal(question.questionStudioReview.questionBankStatus, "NOT_STORED");
      assert.equal(question.questionStudioReview.questionBankWritable, false);
      assert.equal(question.questionStudioReview.testEligible, false);
      assert.equal(question.questionStudioReview.publiclyPublishable, false);
      assert.equal(question.questionStudioReview.automaticStudentPublication, false);
      assert.equal(question.questionStudioReview.difficultyFilterApplied, false);
      assert.equal(
        question.questionStudioReview.englishFreezeAuthorityId,
        COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
      );
      assert.equal(
        question.questionStudioReview.localizationFreezeAuthorityId,
        COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
      );
      assert.equal(
        question.questionStudioReview.localizationCombinedFingerprint,
        COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
      );
      const disposition = getGeneratedItemApprovalDisposition(question);
      assert.equal(disposition.mode, "review_only");
      assert.match(String(disposition.reason), /disables Question Bank storage/);
      reviewOnlyApprovalChecks += 1;
      assert.equal(question.sourceFactIds.includes("com001-sram-layer"), false);
      assert.equal(
        question.sourceFactIds.some((factId: string) => /windows-pagefile|windows-paging/i.test(factId)),
        false,
      );
      if (qlId === "COM-001-QL-007") {
        assert.equal(question.options.includes("RDX removable disk"), false);
        assert.equal(question.options.includes("RDX रिमूवेबल डिस्क"), false);
        assert.equal(question.options.includes("RDX ਰਿਮੂਵੇਬਲ ਡਿਸਕ"), false);
      }
      stems.add(question.stem);
      correctPositions.add(question.correctIndex);
      if (question.relationalSurfaceMode) relationalModes.add(question.relationalSurfaceMode);
      if (question.capacityConvention) capacityConventions.add(question.capacityConvention);
    }
    assert.equal(stems.size >= 3, true, `${qlId}/${language}: thin stem diversity`);
    assert.equal(correctPositions.size >= 3, true, `${qlId}/${language}: narrow answer-position spread`);
    if (["COM-001-QL-001", "COM-001-QL-002", "COM-001-QL-003", "COM-001-QL-004", "COM-001-QL-005"].includes(qlId)) {
      assert.equal(relationalModes.size >= 2, true, `${qlId}/${language}: V2 relational surfaces collapsed`);
    }
    if (qlId === "COM-001-QL-009") {
      assert.deepEqual(
        [...capacityConventions].sort(),
        ["SI_IEC_EXPLICIT", "TRADITIONAL_EXAM_1024"],
        `${qlId}/${language}: both capacity conventions must remain available`,
      );
    }
  }
}

assert.equal(auditedQuestions, 1080);
assert.equal(reviewOnlyApprovalChecks, 1080);

const mixedRequest = {
  engineId: "knowledge-v1" as const,
  packageId: COM001_QUESTION_STUDIO_PACKAGE_ID,
  language: "en" as const,
  runtimeMode: COM001_QUESTION_STUDIO_RUNTIME_MODE,
  count: 50,
  seed: "question-studio-v2-mixed-review",
};
const mixed = await knowledgeV1Com001QuestionStudioAdapter.generate(mixedRequest);
assert.equal(mixed.questions.length, 50);
assert.equal(
  new Set(mixed.questions.map((question) => String(question.qlId))).size >= 6,
  true,
  "mixed COM-001 V2 review batch did not cover enough permanent QLs",
);

await assert.rejects(
  () => knowledgeV1Com001QuestionStudioAdapter.generate({
    packageId: "COM-001",
    runtimeMode: "production",
    count: 1,
  }),
  /only supports review-only runtime/,
);
await assert.rejects(
  () => knowledgeV1Com001QuestionStudioAdapter.generate({
    packageId: "COM-001",
    patternId: "COM-001-QL-999",
    count: 1,
  }),
  /Unknown COM-001 QL/,
);
await assert.rejects(
  () => knowledgeV1Com001QuestionStudioAdapter.generate({
    packageId: "COM-001",
    count: 51,
  }),
  /count between 1 and 50/,
);
