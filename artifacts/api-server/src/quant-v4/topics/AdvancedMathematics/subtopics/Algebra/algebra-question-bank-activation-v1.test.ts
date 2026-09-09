import assert from "node:assert/strict";

import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../../../../lib/admin-question-conversion";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../../../../../question-studio/standard-lifecycle";
import {
  ALGEBRA_QUESTION_STUDIO_LANGUAGES,
  ALGEBRA_QUESTION_STUDIO_PATTERNS,
} from "./algebra-question-studio-runtime-v1";
import {
  ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES_V5,
  generateAlgebraStudioQuestionV5,
} from "./algebra-question-studio-runtime-v5";
import {
  ALGEBRA_QUESTION_BANK_ACTIVATION_V1_AUTHORITY,
  ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1,
  buildAlgebraBankOnlyReviewPayload,
} from "./algebra-question-bank-activation-v1";

const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;
assert.equal(ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.activationStatus, "ACTIVE_INTERNAL_BANK_ONLY");
assert.equal(ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.lifecycleId, lifecycle.lifecycleId);
assert.equal(ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.lifecycleStage, "BANK_ONLY");
assert.equal(ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.questionBankWritable, true);
assert.equal(ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.manualApprovalRequired, true);
assert.equal(ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.testEligible, false);
assert.equal(ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.mockTestEligible, false);
assert.equal(ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.publiclyPublishable, false);
assert.equal(ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.automaticStudentPublication, false);
assert.equal(ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.productionReleaseAuthorized, false);

const firstPatternByQl = Array.from(
  new Map(ALGEBRA_QUESTION_STUDIO_PATTERNS.map((pattern) => [pattern.qlId, pattern])).values(),
);
assert.equal(firstPatternByQl.length, 43);

let generated = 0;
let converterEligibilityChecks = 0;
let normalizedPayloadChecks = 0;
let bankingFiveOptionPayloads = 0;

for (const pattern of firstPatternByQl) {
  for (const examProfile of ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES_V5) {
    for (const language of ALGEBRA_QUESTION_STUDIO_LANGUAGES) {
      const question = generateAlgebraStudioQuestionV5({
        pattern,
        language,
        examProfile,
        seed: `algebra-bank-only:${pattern.qlId}:${examProfile}:${language}`,
      });
      const payload = buildAlgebraBankOnlyReviewPayload(question);
      generated += 1;

      assert.equal(question.validation.valid, true);
      assert.equal(question.validation.questionBankLocked, true, "Frozen Algebra source lifecycle must remain locked");
      assert.equal(payload.bankActivationAuthority, ALGEBRA_QUESTION_BANK_ACTIVATION_V1_AUTHORITY);
      assert.equal(payload.lifecycleId, lifecycle.lifecycleId);
      assert.equal(payload.lifecycleStage, "BANK_ONLY");
      assert.equal(payload.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(payload.questionBankWritable, true);
      assert.equal(payload.questionBankAcceptanceMode, "BANK_ONLY");
      assert.equal(payload.questionBankAcceptanceAuthority, lifecycle.questionBankAcceptanceAuthority);
      assert.equal(payload.manualApprovalRequired, true);
      assert.equal(payload.testEligibility, "INELIGIBLE");
      assert.equal(payload.testEligible, false);
      assert.equal(payload.mockTestEligible, false);
      assert.equal(payload.publiclyPublishable, false);
      assert.equal(payload.automaticStudentPublication, false);
      assert.equal(payload.productionReleaseAuthorized, false);
      assert.equal(payload.generationContext.questionBankWritable, true);
      assert.equal(payload.generationContext.testEligible, false);
      assert.equal(payload.generationContext.publiclyPublishable, false);

      assert.equal(getGeneratedQuestionBankAcceptanceMode(payload), "BANK_ONLY");
      assert.equal(getGeneratedQuestionBankEligibilityIssue(payload), null);
      converterEligibilityChecks += 1;

      const normalized = normalizeGeneratedQuestionPayload(payload, {
        itemId: `audit-${generated}`,
        generationRunCode: "ALG-P2-BANK-ONLY-AUDIT",
      });
      assert.equal(normalized.options.length, question.optionCount);
      assert.equal(normalized.options[normalized.correctIndex], question.answer);
      const generation = normalized.answerModel.generation as Record<string, unknown>;
      assert.equal(generation.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(generation.questionBankWritable, true);
      assert.equal(generation.questionBankAcceptanceMode, "BANK_ONLY");
      assert.equal(generation.testEligibility, "INELIGIBLE");
      assert.equal(generation.testEligible, false);
      assert.equal(generation.mockTestEligible, false);
      assert.equal(generation.publiclyPublishable, false);
      assert.equal(generation.automaticStudentPublication, false);
      normalizedPayloadChecks += 1;

      if (examProfile === "BANKING_PRELIMS" || examProfile === "BANKING_MAINS") {
        assert.equal(payload.optionCount, 5);
        assert.equal(payload.options.length, 5);
        bankingFiveOptionPayloads += 1;
      }
    }
  }
}

const blockedFullRelease = {
  ...buildAlgebraBankOnlyReviewPayload(generateAlgebraStudioQuestionV5({
    pattern: firstPatternByQl[0]!,
    examProfile: "SSC_CORE",
    language: "en",
    seed: "algebra-bank-only:full-release-negative-control",
  })),
  questionBankAcceptanceMode: "FULL_RELEASE",
};
assert.match(
  getGeneratedQuestionBankEligibilityIssue(blockedFullRelease) ?? "",
  /testEligibility is INELIGIBLE/,
  "Algebra BANK_ONLY activation must not imply full scored/public release",
);

assert.equal(generated, 43 * 5 * 3);
assert.equal(converterEligibilityChecks, generated);
assert.equal(normalizedPayloadChecks, generated);
assert.equal(bankingFiveOptionPayloads, 43 * 2 * 3);

console.log("PASS_ALGEBRA_BANK_ONLY_ACTIVATION_V1", {
  activationAuthority: ALGEBRA_QUESTION_BANK_ACTIVATION_V1_AUTHORITY,
  lifecycleId: lifecycle.lifecycleId,
  permanentQlCount: 43,
  supportedProfiles: ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES_V5,
  supportedLanguages: ALGEBRA_QUESTION_STUDIO_LANGUAGES,
  generated,
  converterEligibilityChecks,
  normalizedPayloadChecks,
  bankingFiveOptionPayloads,
  manualApprovalRequired: true,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  productionReleaseAuthorized: false,
});
