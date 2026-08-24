import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
} from "../../lib/admin-question-conversion";
import { COM001_DIFFICULTY_CLASSIFIER_VERSION_V2 } from "../../knowledge-v1/computer-awareness/com001-difficulty-routing-v2";
import { COM001_ENGLISH_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com001-english-freeze-v2";
import { COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com001-hi-pa-localization-freeze-v2";
import { listCom001ReviewV2QlIds } from "../../knowledge-v1/computer-awareness/com001-review-synthesis-v2";
import {
  COM001_QUESTION_BANK_ACCEPTANCE_AUTHORITY_ID,
  COM001_QUESTION_BANK_ACCEPTANCE_MODE,
  COM001_QUESTION_BANK_TEST_ELIGIBILITY,
} from "./com001-question-bank-acceptance-contract-v1";
import {
  COM001_BANK_ONLY_PACKAGE,
  COM001_QUESTION_BANK_STATUS,
  COM001_QUESTION_STUDIO_PACKAGE_ID,
  COM001_QUESTION_STUDIO_RUNTIME_MODE,
  COM001_REVIEW_CONTENT_AUTHORITY_VERSION,
  knowledgeV1Com001QuestionStudioAdapter,
} from "./knowledge-v1-com001-adapter";

assert.equal(COM001_BANK_ONLY_PACKAGE.enabled, true);
assert.equal(COM001_BANK_ONLY_PACKAGE.engineId, "knowledge-v1");
assert.equal(COM001_BANK_ONLY_PACKAGE.runtimeMode, "review-only");
assert.equal(COM001_BANK_ONLY_PACKAGE.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(COM001_BANK_ONLY_PACKAGE.testEligibility, "INELIGIBLE");
assert.equal(COM001_BANK_ONLY_PACKAGE.publiclyPublishable, false);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.reviewOnly, false);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.reviewSurfaceRequired, true);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.contentAuthorityVersion, "V2");
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.humanReviewApproved, true);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.reviewRunPersistenceAllowed, true);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.canonicalQuestionPersistenceAllowed, true);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.manualApprovalRequired, true);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.questionBankWritable, true);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(
  COM001_BANK_ONLY_PACKAGE.metadata?.questionBankAcceptanceAuthority,
  COM001_QUESTION_BANK_ACCEPTANCE_AUTHORITY_ID,
);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.testEligibility, COM001_QUESTION_BANK_TEST_ELIGIBILITY);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.testEligible, false);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.mockTestEligible, false);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.publiclyPublishable, false);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.automaticStudentPublication, false);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.productionReleaseAuthorized, false);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.difficultyFilterSupported, true);
assert.equal(
  COM001_BANK_ONLY_PACKAGE.metadata?.difficultySelectionStatus,
  "REVIEW_ONLY_TOPOLOGY_FILTER_ACTIVE",
);
assert.equal(
  COM001_BANK_ONLY_PACKAGE.metadata?.difficultyClassifierVersion,
  COM001_DIFFICULTY_CLASSIFIER_VERSION_V2,
);
assert.equal(COM001_BANK_ONLY_PACKAGE.metadata?.productionDifficultyClaimsAuthorized, false);
assert.deepEqual(COM001_BANK_ONLY_PACKAGE.metadata?.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(
  COM001_BANK_ONLY_PACKAGE.metadata?.englishFreezeAuthorityId,
  COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
);
assert.equal(
  COM001_BANK_ONLY_PACKAGE.metadata?.englishCombinedFingerprint,
  COM001_ENGLISH_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
);
assert.equal(
  COM001_BANK_ONLY_PACKAGE.metadata?.localizationFreezeAuthorityId,
  COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
);
assert.equal(
  COM001_BANK_ONLY_PACKAGE.metadata?.localizationCombinedFingerprint,
  COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
);

const qlIds = listCom001ReviewV2QlIds();
assert.equal(qlIds.length, 9);

let auditedQuestions = 0;
let bankApprovalChecks = 0;
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
      difficulty: "Mixed" as const,
    };
    const first = await knowledgeV1Com001QuestionStudioAdapter.generate(request);
    const replay = await knowledgeV1Com001QuestionStudioAdapter.generate(request);
    assert.deepEqual(first, replay, `${qlId}/${language}: adapter replay changed`);
    assert.equal(first.questions.length, 40);
    assert.equal(first.generationContext?.reviewOnly, false);
    assert.equal(first.generationContext?.reviewSurfaceRequired, true);
    assert.equal(first.generationContext?.contentAuthorityVersion, COM001_REVIEW_CONTENT_AUTHORITY_VERSION);
    assert.equal(first.generationContext?.humanReviewApproved, true);
    assert.equal(first.generationContext?.difficultyFilterApplied, false);
    assert.equal(first.generationContext?.requestedDifficulty, "Mixed");
    assert.equal(
      first.generationContext?.difficultyClassifierVersion,
      COM001_DIFFICULTY_CLASSIFIER_VERSION_V2,
    );
    assert.equal(first.generationContext?.productionDifficultyClaimAuthorized, false);
    assert.equal(first.generationContext?.canonicalQuestionPersistenceAllowed, true);
    assert.equal(first.generationContext?.manualApprovalRequired, true);
    assert.equal(first.generationContext?.questionBankStatus, "READY_FOR_STORAGE");
    assert.equal(first.generationContext?.questionBankWritable, true);
    assert.equal(first.generationContext?.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(
      first.generationContext?.questionBankAcceptanceAuthority,
      COM001_QUESTION_BANK_ACCEPTANCE_AUTHORITY_ID,
    );
    assert.equal(first.generationContext?.testEligibility, "INELIGIBLE");
    assert.equal(first.generationContext?.testEligible, false);
    assert.equal(first.generationContext?.mockTestEligible, false);
    assert.equal(first.generationContext?.publiclyPublishable, false);
    assert.equal(first.generationContext?.automaticStudentPublication, false);
    assert.equal(first.generationContext?.productionReleaseAuthorized, false);
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
    const observedDifficulties = new Set<string>();
    for (const rawQuestion of first.questions) {
      auditedQuestions += 1;
      const question = rawQuestion as Record<string, any>;
      assert.equal(question.packageId, "COM-001");
      assert.equal(question.patternId, qlId);
      assert.equal(question.qlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.runtimeRegistered, false);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
      assert.equal(question.correct, question.correctIndex);
      assert.equal(question.text, question.stem);
      assert.equal(["Easy", "Medium", "Hard"].includes(question.difficulty), true);
      assert.equal(question.difficultyLabel, question.difficulty);
      assert.equal(question.difficultyDecisionV2?.difficulty, question.difficulty);
      assert.equal(
        question.difficultyDecisionV2?.classifierVersion,
        COM001_DIFFICULTY_CLASSIFIER_VERSION_V2,
      );
      assert.equal(question.difficultyDecisionV2?.productionClaimAuthorized, false);

      // Current adapter lifecycle: BANK_ONLY acceptance is enabled.
      assert.equal(question.questionBankStatus, COM001_QUESTION_BANK_STATUS);
      assert.equal(question.questionBankWritable, true);
      assert.equal(question.questionBankAcceptanceMode, COM001_QUESTION_BANK_ACCEPTANCE_MODE);
      assert.equal(question.questionBankAcceptanceAuthority, COM001_QUESTION_BANK_ACCEPTANCE_AUTHORITY_ID);
      assert.equal(question.testEligibility, "INELIGIBLE");
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.automaticStudentPublication, false);
      assert.equal(question.productionReleaseAuthorized, false);

      // Frozen V2 lifecycle metadata is historical evidence and remains immutable.
      assert.equal(question.localizationV2?.englishFreezeAuthorityId, COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId);
      assert.equal(question.localizationV2?.correctIndexInvariant, true);
      assert.equal(question.localizationV2?.optionOrderInvariant, true);
      assert.equal(question.lifecycleV2?.questionStudioV2Active, false);
      assert.equal(question.lifecycleV2?.questionBankWritable, false);

      assert.equal(question.questionStudioReview.registrationStatus, "BANK_ONLY_ACCEPTANCE_REGISTERED");
      assert.equal(question.questionStudioReview.runtimeMode, "review-only");
      assert.equal(question.questionStudioReview.contentAuthorityVersion, "V2");
      assert.equal(question.questionStudioReview.humanReviewApproved, true);
      assert.equal(question.questionStudioReview.reviewRunPersistenceAllowed, true);
      assert.equal(question.questionStudioReview.canonicalQuestionPersistenceAllowed, true);
      assert.equal(question.questionStudioReview.manualApprovalRequired, true);
      assert.equal(question.questionStudioReview.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(question.questionStudioReview.questionBankWritable, true);
      assert.equal(question.questionStudioReview.questionBankAcceptanceMode, "BANK_ONLY");
      assert.equal(
        question.questionStudioReview.questionBankAcceptanceAuthority,
        COM001_QUESTION_BANK_ACCEPTANCE_AUTHORITY_ID,
      );
      assert.equal(question.questionStudioReview.testEligibility, "INELIGIBLE");
      assert.equal(question.questionStudioReview.testEligible, false);
      assert.equal(question.questionStudioReview.mockTestEligible, false);
      assert.equal(question.questionStudioReview.publiclyPublishable, false);
      assert.equal(question.questionStudioReview.automaticStudentPublication, false);
      assert.equal(question.questionStudioReview.productionReleaseAuthorized, false);
      assert.equal(question.questionStudioReview.difficultyFilterApplied, false);
      assert.equal(question.questionStudioReview.requestedDifficulty, "Mixed");
      assert.equal(question.questionStudioReview.classifiedDifficulty, question.difficulty);
      assert.equal(
        question.questionStudioReview.difficultyClassifierVersion,
        COM001_DIFFICULTY_CLASSIFIER_VERSION_V2,
      );
      assert.equal(question.questionStudioReview.productionDifficultyClaimAuthorized, false);
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

      assert.equal(getGeneratedQuestionBankAcceptanceMode(question), "BANK_ONLY");
      assert.equal(getGeneratedQuestionBankEligibilityIssue(question), null);
      assert.deepEqual(getGeneratedItemApprovalDisposition(question), {
        mode: "question_bank",
        reason: null,
      });
      bankApprovalChecks += 1;

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
      observedDifficulties.add(question.difficulty);
      if (question.relationalSurfaceMode) relationalModes.add(question.relationalSurfaceMode);
      if (question.capacityConvention) capacityConventions.add(question.capacityConvention);
    }
    assert.equal(stems.size >= 3, true, `${qlId}/${language}: thin stem diversity`);
    assert.equal(correctPositions.size >= 3, true, `${qlId}/${language}: narrow answer-position spread`);
    if (["COM-001-QL-001", "COM-001-QL-002", "COM-001-QL-003", "COM-001-QL-004", "COM-001-QL-005"].includes(qlId)) {
      assert.equal(relationalModes.size >= 2, true, `${qlId}/${language}: V2 relational surfaces collapsed`);
      assert.deepEqual([...observedDifficulties].sort(), ["Easy", "Medium"]);
    }
    if (qlId === "COM-001-QL-006") assert.deepEqual([...observedDifficulties], ["Medium"]);
    if (["COM-001-QL-007", "COM-001-QL-008"].includes(qlId)) {
      assert.deepEqual([...observedDifficulties], ["Hard"]);
    }
    if (qlId === "COM-001-QL-009") {
      assert.deepEqual(
        [...capacityConventions].sort(),
        ["SI_IEC_EXPLICIT", "TRADITIONAL_EXAM_1024"],
        `${qlId}/${language}: both capacity conventions must remain available`,
      );
      assert.deepEqual([...observedDifficulties].sort(), ["Easy", "Medium"]);
    }
  }
}

assert.equal(auditedQuestions, 1080);
assert.equal(bankApprovalChecks, 1080);

const mixedRequest = {
  engineId: "knowledge-v1" as const,
  packageId: COM001_QUESTION_STUDIO_PACKAGE_ID,
  language: "en" as const,
  runtimeMode: COM001_QUESTION_STUDIO_RUNTIME_MODE,
  count: 50,
  seed: "question-studio-v2-mixed-review",
  difficulty: "Mixed" as const,
};
const mixed = await knowledgeV1Com001QuestionStudioAdapter.generate(mixedRequest);
assert.equal(mixed.questions.length, 50);
assert.equal(mixed.generationContext?.difficultyFilterApplied, false);
assert.equal(
  new Set(mixed.questions.map((question) => String(question.qlId))).size >= 6,
  true,
  "mixed COM-001 V2 review batch did not cover enough permanent QLs",
);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const request = {
    ...mixedRequest,
    count: 30,
    difficulty,
    seed: `question-studio-v2-filter:${difficulty}`,
  };
  const first = await knowledgeV1Com001QuestionStudioAdapter.generate(request);
  const replay = await knowledgeV1Com001QuestionStudioAdapter.generate(request);
  assert.deepEqual(first, replay, `${difficulty}: filtered replay changed`);
  assert.equal(first.questions.length, 30);
  assert.equal(first.generationContext?.difficultyFilterApplied, true);
  assert.equal(first.generationContext?.requestedDifficulty, difficulty);
  assert.equal(first.generationContext?.productionDifficultyClaimAuthorized, false);
  assert.equal(
    first.questions.every((question) => question.difficulty === difficulty),
    true,
    `${difficulty}: filtered batch leaked another difficulty`,
  );
  assert.equal(
    first.questions.every((question) => (question as any).questionBankWritable === true),
    true,
  );
  assert.equal(
    first.questions.every((question) => (question as any).questionBankAcceptanceMode === "BANK_ONLY"),
    true,
  );
  assert.equal(
    first.questions.every((question) => (question as any).testEligible === false),
    true,
  );
  assert.equal(
    first.questions.every((question) => (question as any).publiclyPublishable === false),
    true,
  );
}

const ql007Hard = await knowledgeV1Com001QuestionStudioAdapter.generate({
  packageId: "COM-001",
  patternId: "COM-001-QL-007",
  runtimeMode: "review-only",
  language: "en",
  difficulty: "Hard",
  count: 10,
  seed: "ql007-hard-review-filter",
});
assert.equal(ql007Hard.questions.every((question) => question.difficulty === "Hard"), true);

const ql006Medium = await knowledgeV1Com001QuestionStudioAdapter.generate({
  packageId: "COM-001",
  patternId: "COM-001-QL-006",
  runtimeMode: "review-only",
  language: "en",
  difficulty: "Medium",
  count: 10,
  seed: "ql006-medium-review-filter",
});
assert.equal(ql006Medium.questions.every((question) => question.difficulty === "Medium"), true);

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
    patternId: "COM-001-QL-007",
    difficulty: "Easy",
    count: 1,
  }),
  /does not produce Easy questions/,
);
await assert.rejects(
  () => knowledgeV1Com001QuestionStudioAdapter.generate({
    packageId: "COM-001",
    difficulty: "Extreme",
    count: 1,
  }),
  /difficulty must be Easy, Medium, Hard, or Mixed/,
);
await assert.rejects(
  () => knowledgeV1Com001QuestionStudioAdapter.generate({
    packageId: "COM-001",
    count: 51,
  }),
  /count between 1 and 50/,
);
