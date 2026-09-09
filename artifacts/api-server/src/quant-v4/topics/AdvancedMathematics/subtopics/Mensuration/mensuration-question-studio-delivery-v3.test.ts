import assert from "node:assert/strict";

import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../../../../lib/admin-question-conversion";
import {
  QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1,
  QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
} from "../../../../../question-studio/standard-lifecycle";
import {
  MENSURATION_BANK_ONLY_ENGLISH_CP_IDS,
  MENSURATION_LOCALIZED_LANGUAGES,
  MENSURATION_QUESTION_STUDIO_EXAM_PROFILES_V3,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  centralProfileForMensurationV3,
  generateMensurationDeliveredQuestionV3,
} from "./mensuration-question-studio-delivery-v3";
import { getQuantV4ExamProfileContract } from "../../../../common/exam-profile";

const BANK_ONLY = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;
const REVIEW_ONLY = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

function conversionPayload(question: ReturnType<typeof generateMensurationDeliveredQuestionV3>) {
  return {
    text: question.stem,
    stem: question.stem,
    options: question.options,
    optionDetails: question.optionDetails,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: question.explanation.steps.join("\n"),
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    qlId: question.qlId,
    permanentQlId: question.qlId,
    packageId: question.packageId,
    canonicalProblemId: question.cpId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Advanced Mathematics",
    subtopic: "Mensuration",
    subject: "Quantitative Aptitude",
    language: question.language,
    locale: question.locale,
    seed: question.seed,
    solveMode: question.solveMode,
    examProfile: question.examProfile,
    centralExamProfile: question.centralExamProfile,
    optionCount: question.optionCount,
    lifecycleId: question.lifecycleId,
    lifecycleStage: question.lifecycleStage,
    reviewSurfaceRequired: question.reviewSurfaceRequired,
    manualApprovalRequired: question.manualApprovalRequired,
    questionBankStatus: question.questionBankStatus,
    questionBankWritable: question.questionBankWritable,
    questionBankAcceptanceMode: question.questionBankAcceptanceMode,
    questionBankAcceptanceAuthority: question.questionBankAcceptanceAuthority,
    testEligibility: question.testEligibility,
    testEligible: question.testEligible,
    mockTestEligible: question.mockTestEligible,
    publiclyPublishable: question.publiclyPublishable,
    automaticStudentPublication: question.automaticStudentPublication,
    productionReleaseAuthorized: question.productionReleaseAuthorized,
    generationContext: {
      packageId: question.packageId,
      canonicalProblemId: question.cpId,
      qlId: question.qlId,
      questionBankStatus: question.questionBankStatus,
      questionBankWritable: question.questionBankWritable,
      questionBankAcceptanceMode: question.questionBankAcceptanceMode,
      questionBankAcceptanceAuthority: question.questionBankAcceptanceAuthority,
      testEligibility: question.testEligibility,
      testEligible: question.testEligible,
      mockTestEligible: question.mockTestEligible,
      publiclyPublishable: question.publiclyPublishable,
      automaticStudentPublication: question.automaticStudentPublication,
    },
  };
}

let generated = 0;
let bankOnly = 0;
let reviewOnly = 0;
let bankingFiveOptionCases = 0;
let converterNormalizationChecks = 0;
const bankOnlyCps = new Set<string>();
const reviewOnlyCps = new Set<string>();

for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS) {
  for (const examProfile of MENSURATION_QUESTION_STUDIO_EXAM_PROFILES_V3) {
    const question = generateMensurationDeliveredQuestionV3({
      patternId: pattern.patternId,
      language: "en",
      examProfile,
      seed: `men-v3:${pattern.patternId}:${examProfile}`,
    });
    generated += 1;

    const expectedOptionCount = getQuantV4ExamProfileContract(centralProfileForMensurationV3(examProfile)).optionCount;
    assert.equal(question.optionCount, expectedOptionCount, `${pattern.patternId}/${examProfile}: declared option count`);
    assert.equal(question.options.length, expectedOptionCount, `${pattern.patternId}/${examProfile}: rendered option count`);
    assert.equal(new Set(question.options).size, expectedOptionCount, `${pattern.patternId}/${examProfile}: options must be unique`);
    assert.equal(question.optionDetails.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.productionReleaseAuthorized, false);

    if (examProfile === "BANKING_PRELIMS" || examProfile === "BANKING_MAINS") {
      assert.equal(question.optionCount, 5);
      bankingFiveOptionCases += 1;
    }

    const payload = conversionPayload(question);
    if (question.lifecycleStage === "BANK_ONLY") {
      bankOnly += 1;
      bankOnlyCps.add(question.cpId);
      assert.equal(question.language, "en");
      assert.equal(question.patternKind, "QL");
      assert.ok(question.qlId);
      assert.equal(question.bankOnlyEligibility.eligible, true);
      assert.equal(question.lifecycleId, BANK_ONLY.lifecycleId);
      assert.equal(question.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(question.questionBankWritable, true);
      assert.equal(question.questionBankAcceptanceMode, "BANK_ONLY");
      assert.equal(getGeneratedQuestionBankAcceptanceMode(payload), "BANK_ONLY");
      assert.equal(getGeneratedQuestionBankEligibilityIssue(payload), null);
      const normalized = normalizeGeneratedQuestionPayload(payload, {
        itemId: `mensuration-p2-${generated}`,
        generationRunCode: "MEN-P2-MIXED-LIFECYCLE",
      });
      assert.equal(normalized.options.length, expectedOptionCount);
      assert.equal(normalized.options[normalized.correctIndex], question.answer);
      const generation = normalized.answerModel.generation as Record<string, unknown>;
      assert.equal(generation.questionBankWritable, true);
      assert.equal(generation.questionBankAcceptanceMode, "BANK_ONLY");
      assert.equal(generation.testEligible, false);
      assert.equal(generation.publiclyPublishable, false);
      converterNormalizationChecks += 1;
    } else {
      reviewOnly += 1;
      reviewOnlyCps.add(question.cpId);
      assert.equal(question.lifecycleId, REVIEW_ONLY.lifecycleId);
      assert.equal(question.questionBankStatus, "NOT_STORED");
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.questionBankAcceptanceMode, null);
      assert.notEqual(getGeneratedQuestionBankEligibilityIssue(payload), null);
    }
  }
}

assert.deepEqual([...bankOnlyCps].sort(), [...MENSURATION_BANK_ONLY_ENGLISH_CP_IDS].sort());
for (const cpId of ["MEN-CP-001", "MEN-CP-002", "MEN-CP-003", "MEN-CP-004", "MEN-CP-005", "MEN-CP-006", "MEN-CP-011", "MEN-CP-012"]) {
  assert.ok(reviewOnlyCps.has(cpId), `${cpId} must remain review-only`);
}

for (const cpId of MENSURATION_BANK_ONLY_ENGLISH_CP_IDS) {
  const pattern = MENSURATION_QUESTION_STUDIO_PATTERNS.find((row) => row.cpId === cpId && row.patternKind === "QL");
  assert.ok(pattern, `${cpId} needs a permanent QL sample`);
  for (const language of MENSURATION_LOCALIZED_LANGUAGES.filter((value) => value !== "en")) {
    const localized = generateMensurationDeliveredQuestionV3({
      patternId: pattern!.patternId,
      language,
      examProfile: "BANKING_PRELIMS",
      seed: `men-v3-localized-lock:${cpId}:${language}`,
    });
    assert.equal(localized.optionCount, 5);
    assert.equal(localized.lifecycleStage, "REVIEW_ONLY");
    assert.equal(localized.questionBankWritable, false);
    assert.equal(localized.bankOnlyEligibility.reason, "LOCALIZATION_REMAINS_CONTROLLED_REVIEW");
  }
}

assert.ok(bankOnly > 0, "At least one frozen approved English permanent QL must reach BANK_ONLY");
assert.ok(reviewOnly > 0, "Mixed lifecycle must retain review-only content");
assert.equal(converterNormalizationChecks, bankOnly);

console.log("PASS_MENSURATION_DELIVERY_V3_MIXED_LIFECYCLE", {
  patterns: MENSURATION_QUESTION_STUDIO_PATTERNS.length,
  profiles: MENSURATION_QUESTION_STUDIO_EXAM_PROFILES_V3.length,
  generated,
  bankOnly,
  reviewOnly,
  bankOnlyCps: [...bankOnlyCps].sort(),
  reviewOnlyCps: [...reviewOnlyCps].sort(),
  bankingFiveOptionCases,
  converterNormalizationChecks,
  nonEnglishLifecycle: "REVIEW_ONLY",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
});
