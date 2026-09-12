import { strict as assert } from "node:assert";

import { COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1 } from "../knowledge-v1/computer-awareness/com003-localization-v2-chapter-freeze-v1";
import {
  COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V2,
  runCom003QuestionStudioPreRegistrationV2,
} from "../knowledge-v1/computer-awareness/com003-question-studio-pre-registration-adapter-v2";
import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
} from "../lib/admin-question-conversion";
import { COM003_BANK_ONLY_ACTIVATION_AUTHORITY_V1 } from "./engines/com003-bank-only-activation-authority-v1";
import {
  COM003_STANDARD_BANK_ONLY_PACKAGE_V2,
  knowledgeV1Com003QuestionStudioAdapterV2,
} from "./engines/knowledge-v1-com003-adapter-v2";
import { knowledgeV1QuestionStudioAdapter } from "./engines/knowledge-v1-adapter";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "./standard-lifecycle";

const freeze = COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1;
const capability = COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V2;
const pkg = COM003_STANDARD_BANK_ONLY_PACKAGE_V2;
const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;
const bankAuthority = COM003_BANK_ONLY_ACTIVATION_AUTHORITY_V1;

// Frozen source integrity remains unchanged. The old freeze deliberately did not
// itself grant Question Bank writes; the downstream BANK_ONLY authority does so
// without mutating any frozen question-language artifact.
assert.equal(freeze.authorityId, "COM-003-LOCALIZATION-V2-CHAPTER-FREEZE-V1");
assert.equal(freeze.qlCount, 19);
assert.equal(freeze.englishQuestionCount, 228);
assert.equal(freeze.hindiQuestionCount, 228);
assert.equal(freeze.punjabiQuestionCount, 228);
assert.equal(freeze.questionLanguageArtifactCount, 684);
assert.equal(freeze.questionsPerQlPerLanguage, 12);
assert.deepEqual(freeze.frozenLanguages, ["en", "hi", "pa"]);
assert.equal(freeze.semanticEditorialAudit.conclusion, "success");
assert.equal(freeze.governance.localizationFrozen, true);
assert.equal(freeze.governance.localizationMutationAllowed, false);
assert.equal(freeze.governance.correctionRequiresNewVersion, true);
assert.equal(freeze.governance.questionStudioRuntimeAuthorized, true);
assert.equal(freeze.governance.questionBankWritesAuthorized, false);
assert.equal(freeze.governance.testEligibilityAuthorized, false);
assert.equal(freeze.governance.mockTestEligibilityAuthorized, false);
assert.equal(freeze.governance.automaticPublicationAuthorized, false);
assert.equal(freeze.governance.publiclyPublishable, false);
assert.equal(freeze.governance.productionReleased, false);

assert.equal(capability.corpus.authorityId, freeze.authorityId);
assert.equal(capability.corpus.qlCount, 19);
assert.equal(capability.corpus.englishQuestionCount, 228);
assert.equal(capability.corpus.hindiQuestionCount, 228);
assert.equal(capability.corpus.punjabiQuestionCount, 228);
assert.equal(capability.corpus.questionsPerQlPerLanguage, 12);
assert.equal(capability.corpus.immutable, true);
assert.equal(capability.corpus.deterministicSelection, true);
assert.equal(capability.corpus.selectionWithoutReplacement, true);
assert.equal(capability.difficultySelection.hardAuthorized, false);
assert.equal(capability.difficultySelection.productionDifficultyClaimsAuthorized, false);

// The active runtime overlay has advanced to the shared BANK_ONLY lifecycle.
// Manual Question Bank acceptance is permitted, but every scored-test and public
// release gate remains fail-closed.
assert.equal(bankAuthority.status, "ACTIVE_INTERNAL_BANK_ONLY");
assert.equal(bankAuthority.corpus.frozenQuestionLanguageArtifactCount, 684);
assert.equal(bankAuthority.corpus.immutable, true);
assert.equal(bankAuthority.authorization.hardDifficultyAuthorized, false);
assert.equal(bankAuthority.locks.contentMutationAuthorized, false);
assert.equal(bankAuthority.locks.testEligible, false);
assert.equal(bankAuthority.locks.testBuilderEligible, false);
assert.equal(bankAuthority.locks.mockTestEligible, false);
assert.equal(bankAuthority.locks.publiclyPublishable, false);
assert.equal(bankAuthority.locks.productionReleaseAuthorized, false);

assert.equal(pkg.packageId, "COM-003");
assert.equal(pkg.engineId, "knowledge-v1");
assert.equal(pkg.lifecycleId, lifecycle.lifecycleId);
assert.equal(pkg.lifecycleStage, "BANK_ONLY");
assert.equal(pkg.runtimeMode, "review-only");
assert.equal(pkg.reviewSurfaceRequired, true);
assert.equal(pkg.manualApprovalRequired, true);
assert.equal(pkg.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(pkg.questionBankWritable, true);
assert.equal(pkg.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(pkg.questionBankAcceptanceAuthority, bankAuthority.authorityId);
assert.equal(pkg.testEligibility, "INELIGIBLE");
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.automaticStudentPublication, false);
assert.equal(pkg.productionReleaseAuthorized, false);
assert.equal(pkg.metadata?.canonicalQuestionPersistenceAllowed, true);
assert.equal(pkg.metadata?.reviewRunPersistenceAllowed, true);
assert.equal(pkg.metadata?.reviewOnly, false);
assert.equal(pkg.metadata?.humanReviewApproved, true);
assert.equal(pkg.metadata?.frozenCorpusOnly, true);
assert.equal(pkg.metadata?.immutableCorpus, true);
assert.equal(pkg.metadata?.hardDifficultyAuthorized, false);
assert.equal(pkg.metadata?.productionDifficultyClaimsAuthorized, false);

// Composite engine registration must expose COM-001/2/3 exactly once and route
// COM-003 through its V2 frozen-corpus adapter without stealing another package.
const knowledgePackages = knowledgeV1QuestionStudioAdapter.listPackages();
const ids = knowledgePackages.map((item) => item.packageId);
assert.equal(ids.filter((id) => id === "COM-001").length, 1);
assert.equal(ids.filter((id) => id === "COM-002").length, 1);
assert.equal(ids.filter((id) => id === "COM-003").length, 1);
assert.equal(new Set(ids).size, ids.length);
assert.equal(knowledgeV1Com003QuestionStudioAdapterV2.listPackages()[0]?.packageId, "COM-003");

// The pre-registration source view remains read-only/NOT_STORED. The registered
// runtime overlays BANK_ONLY acceptance only after generation into a review run.
for (const language of ["en", "hi", "pa"] as const) {
  const preview = runCom003QuestionStudioPreRegistrationV2({
    packageId: "COM-003",
    language,
    seed: `computer-integration-v2-${language}`,
    count: 3,
  });
  assert.equal(preview.questions.length, 3);
  assert.equal(new Set(preview.questions.map((question) => question.id)).size, 3);
  assert.equal(preview.questions.every((question) => question.language === language), true);
  assert.equal(preview.questions.every((question) => question.corpusStatus === "FROZEN_V2"), true);
  assert.equal(preview.questions.every((question) => question.readOnly === true), true);
  assert.equal(preview.questions.every((question) => question.questionBankStatus === "NOT_STORED"), true);
  assert.equal(preview.questions.every((question) => question.testEligibility === "INELIGIBLE"), true);
  assert.equal(preview.questions.every((question) => question.publiclyPublishable === false), true);
  assert.equal(preview.questions.every((question) => question.productionReleased === false), true);

  const generated = await knowledgeV1Com003QuestionStudioAdapterV2.generate({
    packageId: "COM-003",
    language,
    runtimeMode: "review-only",
    seed: `computer-runtime-bank-only-v1-${language}`,
    count: 2,
  });
  assert.equal(generated.questions.length, 2);
  assert.equal(generated.generationContext.stage, "BANK_ONLY");
  assert.equal(generated.generationContext.reviewRunPersistenceAllowed, true);
  assert.equal(generated.generationContext.canonicalQuestionPersistenceAllowed, true);
  assert.equal(generated.generationContext.questionBankStatus, "READY_FOR_STORAGE");
  assert.equal(generated.generationContext.questionBankWritable, true);
  assert.equal(generated.generationContext.questionBankAcceptanceMode, "BANK_ONLY");
  assert.equal(generated.generationContext.questionBankAcceptanceAuthority, bankAuthority.authorityId);
  assert.equal(generated.generationContext.testEligible, false);
  assert.equal(generated.generationContext.mockTestEligible, false);
  assert.equal(generated.generationContext.publiclyPublishable, false);
  assert.equal(generated.generationContext.automaticStudentPublication, false);
  assert.equal(generated.generationContext.productionReleaseAuthorized, false);
  assert.equal(generated.generationContext.hardDifficultyAuthorized, false);
  assert.equal(generated.generationContext.productionDifficultyClaimAuthorized, false);
  for (const question of generated.questions as any[]) {
    assert.equal(question.registrationStatus, "REGISTERED_BANK_ONLY_INTERNAL");
    assert.equal(question.readOnly, true);
    assert.equal(question.revisionPolicy, "SOURCE_GENERATOR_ONLY");
    assert.equal(question.questionBankWritable, true);
    assert.equal(getGeneratedQuestionBankAcceptanceMode(question), "BANK_ONLY");
    assert.equal(getGeneratedQuestionBankEligibilityIssue(question), null);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.productionReleaseAuthorized, false);
  }
}

await assert.rejects(
  () =>
    knowledgeV1Com003QuestionStudioAdapterV2.generate({
      packageId: "COM-003",
      language: "en",
      runtimeMode: "review-only",
      difficulty: "Hard",
      seed: "computer-integration-v2-hard-rejection",
      count: 1,
    }),
  /Hard difficulty is not authorized/,
);

await assert.rejects(
  () =>
    knowledgeV1Com003QuestionStudioAdapterV2.generate({
      packageId: "COM-003",
      language: "en",
      runtimeMode: "production",
      seed: "computer-integration-v2-production-rejection",
      count: 1,
    }),
  /only supports review-only runtime/,
);

console.log(
  "[COMPUTER-CONTENT-ENGINE-INTEGRATION-V2] PASS COM-003=684-frozen-artifacts lifecycle=BANK_ONLY bank-acceptance=manual test/mock/publication=locked languages=en,hi,pa",
);
