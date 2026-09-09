import { strict as assert } from "node:assert";

import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../lib/admin-question-conversion";
import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { knowledgeV1Com001QuestionStudioAdapter } from "./knowledge-v1-com001-adapter";
import { knowledgeV1Com005QuestionStudioAdapterV1 } from "./knowledge-v1-com005-adapter-v1";
import { knowledgeV1Com007QuestionStudioAdapterV1 } from "./knowledge-v1-com007-adapter-v1";
import { COMPUTER_GAP_BANK_ONLY_ACTIVATION_AUTHORITY_V1 as authority } from "./computer-gap-bank-only-acceptance-authority-v1";

assert.equal(authority.status, "ACTIVE_INTERNAL_BANK_ONLY");
assert.equal(authority.authorization.lifecycleStage, "BANK_ONLY");
assert.equal(authority.authorization.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(authority.authorization.questionBankWritable, true);
assert.equal(authority.authorization.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(authority.authorization.manualApprovalRequired, true);
assert.deepEqual(authority.authorization.supportedDifficulties, ["Easy", "Medium"]);
assert.equal(authority.authorization.hardDifficultyAuthorized, false);
assert.equal(authority.corpus.frozenQuestionLanguageArtifactCount, 168);
assert.equal(authority.corpus.immutable, true);
assert.equal(authority.corpus.revisionPolicy, "SOURCE_GENERATOR_ONLY");
assert.equal(authority.locks.contentMutationAuthorized, false);
assert.equal(authority.locks.testEligible, false);
assert.equal(authority.locks.testBuilderEligible, false);
assert.equal(authority.locks.mockTestEligible, false);
assert.equal(authority.locks.publiclyPublishable, false);
assert.equal(authority.locks.automaticStudentPublication, false);
assert.equal(authority.locks.productionReleaseAuthorized, false);

const cases = [
  {
    packageId: "COM-001",
    cpId: "COM-001-CP-007",
    qlIds: [
      "COM-001-CP-007-QL-001",
      "COM-001-CP-007-QL-002",
      "COM-001-CP-007-QL-003",
      "COM-001-CP-007-QL-004",
    ],
    adapter: knowledgeV1Com001QuestionStudioAdapter,
  },
  {
    packageId: "COM-005",
    cpId: "COM-005-CP-002",
    qlIds: ["COM-005-QL-008", "COM-005-QL-009", "COM-005-QL-010", "COM-005-QL-011"],
    adapter: knowledgeV1Com005QuestionStudioAdapterV1,
  },
  {
    packageId: "COM-007",
    cpId: "COM-007-CP-002",
    qlIds: ["COM-007-QL-009", "COM-007-QL-010", "COM-007-QL-011", "COM-007-QL-012", "COM-007-QL-013"],
    adapter: knowledgeV1Com007QuestionStudioAdapterV1,
  },
] as const;

let audited = 0;
const languages = ["en", "hi", "pa"] as const;
for (const item of cases) {
  for (const qlId of item.qlIds) {
    for (const language of languages) {
      const generated = await item.adapter.generate({
        packageId: item.packageId,
        patternId: qlId,
        language,
        runtimeMode: "review-only",
        difficulty: "Mixed",
        seed: `computer-gap-bank-only:${item.packageId}:${qlId}:${language}`,
        count: 1,
      });
      const question = generated.questions[0] as any;
      assert.ok(question, `${item.packageId}/${qlId}/${language} must generate a question`);
      audited += 1;
      assert.equal(question.cpId, item.cpId);
      assert.equal(question.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(question.questionBankWritable, true);
      assert.equal(question.questionBankAcceptanceMode, "BANK_ONLY");
      assert.equal(question.questionBankAcceptanceAuthority, authority.authorityId);
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.productionReleaseAuthorized, false);
      assert.equal(getGeneratedItemApprovalDisposition(question).mode, "question_bank");
      assert.equal(getGeneratedQuestionBankAcceptanceMode(question), "BANK_ONLY");
      assert.equal(getGeneratedQuestionBankEligibilityIssue(question), null);

      const normalized = normalizeGeneratedQuestionPayload(
        question,
        generated.generationContext as Record<string, unknown>,
      );
      const generation = normalized.answerModel.generation as Record<string, unknown>;
      assert.equal(generation.questionBankAcceptanceAuthority, authority.authorityId);
      assert.equal(generation.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(generation.questionBankWritable, true);
      assert.equal(generation.testEligible, false);
      assert.equal(generation.mockTestEligible, false);
      assert.equal(generation.publiclyPublishable, false);
      assert.equal(generation.automaticStudentPublication, false);
      assert.equal(generation.productionReleaseAuthorized, false);
    }
  }
}

assert.equal(audited, 39);
console.log("[COMPUTER-GAP-BANK-ONLY-ACTIVATION-V1]", {
  authorityId: authority.authorityId,
  auditedQlLanguageRoutes: audited,
  frozenQuestionLanguageArtifactCount: authority.corpus.frozenQuestionLanguageArtifactCount,
  questionBankWritable: authority.authorization.questionBankWritable,
  manualApprovalRequired: authority.authorization.manualApprovalRequired,
  testEligible: authority.locks.testEligible,
  mockTestEligible: authority.locks.mockTestEligible,
  publiclyPublishable: authority.locks.publiclyPublishable,
  productionReleaseAuthorized: authority.locks.productionReleaseAuthorized,
});
