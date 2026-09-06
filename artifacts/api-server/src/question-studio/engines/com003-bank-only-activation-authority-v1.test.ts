import { strict as assert } from "node:assert";

import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
} from "../../lib/admin-question-conversion";
import { COM003_BANK_ONLY_ACTIVATION_AUTHORITY_V1 } from "./com003-bank-only-activation-authority-v1";
import { COM003_CHAPTER_COMPLETION_AUTHORITY_V1 } from "./com003-chapter-completion-authority-v1";
import { knowledgeV1Com003QuestionStudioAdapterV2 } from "./knowledge-v1-com003-adapter-v2";

const authority = COM003_BANK_ONLY_ACTIVATION_AUTHORITY_V1;
assert.equal(authority.status, "ACTIVE_INTERNAL_BANK_ONLY");
assert.equal(
  authority.sourceAuthorities.chapterCompletionAuthorityId,
  COM003_CHAPTER_COMPLETION_AUTHORITY_V1.authorityId,
);
assert.equal(authority.authorization.lifecycleStage, "BANK_ONLY");
assert.equal(authority.authorization.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(authority.authorization.questionBankWritable, true);
assert.equal(authority.authorization.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(authority.authorization.manualApprovalRequired, true);
assert.deepEqual(authority.authorization.supportedDifficulties, ["Easy", "Medium"]);
assert.equal(authority.authorization.hardDifficultyAuthorized, false);
assert.equal(authority.corpus.frozenQuestionLanguageArtifactCount, 684);
assert.equal(authority.corpus.immutable, true);
assert.equal(authority.corpus.revisionPolicy, "SOURCE_GENERATOR_ONLY");
assert.equal(authority.locks.contentMutationAuthorized, false);
assert.equal(authority.locks.testEligibility, "INELIGIBLE");
assert.equal(authority.locks.testEligible, false);
assert.equal(authority.locks.testBuilderEligible, false);
assert.equal(authority.locks.mockTestEligible, false);
assert.equal(authority.locks.publiclyPublishable, false);
assert.equal(authority.locks.automaticStudentPublication, false);
assert.equal(authority.locks.productionReleaseAuthorized, false);

const artifactIds = new Set<string>();
let audited = 0;
for (let qlIndex = 1; qlIndex <= 19; qlIndex += 1) {
  const qlId = `COM-003-QL-${String(qlIndex).padStart(3, "0")}`;
  for (const language of ["en", "hi", "pa"] as const) {
    const result = await knowledgeV1Com003QuestionStudioAdapterV2.generate({
      packageId: "COM-003",
      runtimeMode: "review-only",
      patternId: qlId,
      language,
      difficulty: "Mixed",
      seed: `com003-bank-only-full-audit:${qlId}:${language}`,
      count: 12,
    });

    assert.equal(result.questions.length, 12, `${qlId}/${language} must expose 12 frozen artifacts`);
    assert.equal(result.generationContext?.stage, "BANK_ONLY");
    assert.equal(result.generationContext?.questionBankStatus, "READY_FOR_STORAGE");
    assert.equal(result.generationContext?.questionBankWritable, true);
    assert.equal(result.generationContext?.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(
      result.generationContext?.questionBankAcceptanceAuthority,
      authority.authorityId,
    );
    assert.equal(result.generationContext?.testEligible, false);
    assert.equal(result.generationContext?.mockTestEligible, false);
    assert.equal(result.generationContext?.publiclyPublishable, false);
    assert.equal(result.generationContext?.productionReleaseAuthorized, false);

    for (const question of result.questions as any[]) {
      audited += 1;
      artifactIds.add(question.id);
      assert.equal(question.qlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.registrationStatus, "REGISTERED_BANK_ONLY_INTERNAL");
      assert.equal(question.readOnly, true);
      assert.equal(question.revisionPolicy, "SOURCE_GENERATOR_ONLY");
      assert.equal(question.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(question.questionBankWritable, true);
      assert.equal(question.questionBankAcceptanceMode, "BANK_ONLY");
      assert.equal(question.questionBankAcceptanceAuthority, authority.authorityId);
      assert.equal(getGeneratedQuestionBankAcceptanceMode(question), "BANK_ONLY");
      assert.equal(getGeneratedQuestionBankEligibilityIssue(question), null);
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.automaticStudentPublication, false);
      assert.equal(question.productionReleaseAuthorized, false);
    }
  }
}

assert.equal(audited, 684);
assert.equal(artifactIds.size, 684, "BANK_ONLY audit must cover every frozen question-language artifact exactly once");

await assert.rejects(
  knowledgeV1Com003QuestionStudioAdapterV2.generate({
    packageId: "COM-003",
    runtimeMode: "review-only",
    language: "en",
    difficulty: "Hard",
    seed: "com003-bank-only-hard-must-remain-closed",
    count: 1,
  }),
  /Hard difficulty is not authorized/,
);

console.log("[COM003-BANK-ONLY-ACTIVATION-V1]", {
  authorityId: authority.authorityId,
  lifecycleStage: authority.authorization.lifecycleStage,
  auditedQuestionLanguageArtifacts: audited,
  uniqueQuestionLanguageArtifacts: artifactIds.size,
  questionBankWritable: authority.authorization.questionBankWritable,
  manualApprovalRequired: authority.authorization.manualApprovalRequired,
  hardDifficultyAuthorized: authority.authorization.hardDifficultyAuthorized,
  testEligible: authority.locks.testEligible,
  mockTestEligible: authority.locks.mockTestEligible,
  publiclyPublishable: authority.locks.publiclyPublishable,
  productionReleaseAuthorized: authority.locks.productionReleaseAuthorized,
});
