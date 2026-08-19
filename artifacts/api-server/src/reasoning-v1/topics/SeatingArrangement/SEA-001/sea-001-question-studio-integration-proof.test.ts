import { strict as assert } from "node:assert";
import { getGeneratedQuestionBankEligibilityIssue } from "../../../../lib/admin-question-conversion.ts";
import { SEA001_MULTILINGUAL_FREEZE_AUTHORITY } from "./localization/multilingual-freeze.ts";
import { SEA001_PERMANENT_QL_IDS } from "./permanent/registry.ts";
import {
  SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  SEA001_QUESTION_STUDIO_PACKAGE,
  SEA001_QUESTION_STUDIO_PACKAGE_ID,
  SEA001_QUESTION_STUDIO_RUNTIME_MODE,
  generateSea001QuestionStudioBatch,
} from "./question-studio/seating-question-studio-runtime.ts";

assert.equal(SEA001_QUESTION_STUDIO_PACKAGE.packageId, SEA001_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(SEA001_QUESTION_STUDIO_PACKAGE.integrationAuthority, SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY);
assert.equal(SEA001_QUESTION_STUDIO_PACKAGE.runtimeMode, SEA001_QUESTION_STUDIO_RUNTIME_MODE);
assert.equal(SEA001_QUESTION_STUDIO_PACKAGE.permanentQlCount, 20);
assert.deepEqual(SEA001_QUESTION_STUDIO_PACKAGE.qlIds, [...SEA001_PERMANENT_QL_IDS]);
assert.equal(SEA001_QUESTION_STUDIO_PACKAGE.questionStudioVisible, true);
assert.equal(SEA001_QUESTION_STUDIO_PACKAGE.questionStudioDiscoverable, true);
assert.equal(SEA001_QUESTION_STUDIO_PACKAGE.registrationStatus, "REGISTERED");
assert.equal(SEA001_QUESTION_STUDIO_PACKAGE.generationRunPersistenceAllowed, true);
assert.equal(SEA001_QUESTION_STUDIO_PACKAGE.databaseWriteEnabled, true);
assert.equal(SEA001_QUESTION_STUDIO_PACKAGE.questionBankEligible, false);
assert.equal(SEA001_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(SEA001_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(SEA001_QUESTION_STUDIO_PACKAGE.productionStagingApproved, false);
assert.equal(SEA001_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(SEA001_QUESTION_STUDIO_PACKAGE.sourceLocalizationAuthority, SEA001_MULTILINGUAL_FREEZE_AUTHORITY);

let totalQuestions = 0;
const contentFingerprints = new Set<string>();
const questionIds = new Set<string>();
const checkpointCoverage = new Set<string>();
const qlCoverage = new Set<string>();
const languageCoverage = new Set<string>();

for (const language of ["en", "hi", "pa"] as const) {
  const batch = generateSea001QuestionStudioBatch({
    language,
    count: 20,
    seed: `sea001-question-studio-proof:${language}`,
  });
  assert.equal(batch.questions.length, 20);
  assert.equal(batch.generationContext.runtimeMode, "DYNAMIC_CANDIDATE");
  assert.equal(batch.generationContext.seedSource, "EXPLICIT");
  assert.equal(batch.generationContext.persistenceAllowed, true);
  assert.equal(batch.generationContext.questionBankStatus, "NOT_STORED");
  assert.equal(batch.generationContext.testEligibility, "INELIGIBLE");
  assert.equal(batch.generationContext.publiclyPublishable, false);

  for (const question of batch.questions) {
    totalQuestions += 1;
    languageCoverage.add(question.language);
    checkpointCoverage.add(question.checkpointId);
    qlCoverage.add(question.qlId);
    contentFingerprints.add(question.contentFingerprint);
    questionIds.add(question.questionId);

    assert.equal(question.packageId, SEA001_QUESTION_STUDIO_PACKAGE_ID);
    assert.equal(question.validation.valid, true);
    assert.equal(question.validation.solverOracleAgreement, true);
    assert.equal(question.validation.fourOptions, true);
    assert.equal(question.validation.singleCorrectAnswer, true);
    assert.equal(question.validation.frozenQueryContract, true);
    assert.equal(question.validation.canonicalParityPreserved, true);
    assert.equal(question.options.length, 4);
    assert.equal(question.optionDetails.length, 4);
    assert.equal(question.optionDetails.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.optionDetails[question.correctIndex]?.isCorrect, true);
    assert.equal(question.safety.reviewOnly, true);
    assert.equal(question.safety.questionStudioVisible, true);
    assert.equal(question.safety.persistenceAllowed, true);
    assert.equal(question.safety.questionBankEligible, false);
    assert.equal(question.safety.mockTestEligible, false);
    assert.equal(question.safety.productionStagingApproved, false);
    assert.equal(question.safety.publiclyPublishable, false);
    assert.notEqual(question.traceability.clueSetFingerprint, null);

    const conversionIssue = getGeneratedQuestionBankEligibilityIssue({
      runtimeMode: question.parameters.runtimeMode,
      reviewStatus: question.parameters.reviewStatus,
      questionBankStatus: question.parameters.questionBankStatus,
      testEligibility: question.parameters.testEligibility,
      publiclyPublishable: question.parameters.publiclyPublishable,
    });
    assert.notEqual(conversionIssue, null, `${question.questionId} must remain blocked from Question Bank conversion`);

    if (language !== "en") {
      const learnerSurface = [
        question.sharedPrompt,
        question.stem,
        ...question.options,
        ...question.optionDetails.map((option) => option.studentExplanation),
        ...question.explanation.steps,
        question.explanation.conclusion,
      ].join("\n");
      assert.equal(/[A-Za-z]/u.test(learnerSurface), false, `${question.questionId} contains Latin residue`);
    }
  }
}

for (const qlId of SEA001_PERMANENT_QL_IDS) {
  const batch = generateSea001QuestionStudioBatch({
    language: "en",
    qlId,
    count: 4,
    seed: `sea001-question-studio-ql-proof:${qlId}`,
  });
  assert.equal(batch.questions.length, 4);
  assert(batch.questions.every((question) => question.qlId === qlId));
  assert.equal(new Set(batch.questions.map((question) => question.caseletId)).size, 4);
  assert.equal(new Set(batch.questions.map((question) => question.traceability.clueSetFingerprint)).size, 4);
  qlCoverage.add(qlId);
}

assert.equal(totalQuestions, 60);
assert.equal(languageCoverage.size, 3);
assert.equal(checkpointCoverage.size, 5);
assert.equal(qlCoverage.size, 20);
assert.equal(contentFingerprints.size, 60);
assert.equal(questionIds.size, 60);

const replayA = generateSea001QuestionStudioBatch({ language: "en", qlId: "SEA-QL-020", count: 4, seed: "sea001-replay" });
const replayB = generateSea001QuestionStudioBatch({ language: "en", qlId: "SEA-QL-020", count: 4, seed: "sea001-replay" });
assert.equal(replayA.generationContext.seedSource, "EXPLICIT");
assert.equal(replayB.generationContext.seedSource, "EXPLICIT");
assert.deepEqual(
  replayA.questions.map((question) => question.contentFingerprint),
  replayB.questions.map((question) => question.contentFingerprint),
);

const freshA = generateSea001QuestionStudioBatch({ language: "en", count: 4 });
const freshB = generateSea001QuestionStudioBatch({ language: "en", count: 4 });
assert.equal(freshA.generationContext.seedSource, "FRESH_NONCE");
assert.equal(freshB.generationContext.seedSource, "FRESH_NONCE");
assert.notEqual(freshA.generationContext.seed, freshB.generationContext.seed);
assert.notDeepEqual(
  freshA.questions.map((question) => question.contentFingerprint),
  freshB.questions.map((question) => question.contentFingerprint),
  "unseeded Question Studio requests must not replay the same deterministic batch",
);
assert.equal(new Set(freshA.questions.map((question) => question.qlId)).size, 4);
assert.equal(new Set(freshA.questions.map((question) => question.caseletId)).size, 4);
assert.equal(new Set(freshA.questions.map((question) => question.traceability.clueSetFingerprint)).size, 4);

const firstFreshFingerprints = freshA.questions
  .map((question) => question.traceability.clueSetFingerprint)
  .filter((value): value is string => typeof value === "string");
const historyAware = generateSea001QuestionStudioBatch({
  language: "en",
  count: 4,
  excludeClueSetFingerprints: firstFreshFingerprints,
});
assert.equal(historyAware.generationContext.recentHistoryExclusionCount, firstFreshFingerprints.length);
assert.equal(
  historyAware.questions.some((question) => firstFreshFingerprints.includes(question.traceability.clueSetFingerprint ?? "")),
  false,
  "fresh generation must reject recent clue-set fingerprints",
);

const explicitIgnoresHistory = generateSea001QuestionStudioBatch({
  language: "en",
  count: 4,
  seed: freshA.generationContext.seed,
  excludeClueSetFingerprints: firstFreshFingerprints,
});
const explicitReplayOfFreshA = generateSea001QuestionStudioBatch({
  language: "en",
  count: 4,
  seed: freshA.generationContext.seed,
});
assert.deepEqual(
  explicitIgnoresHistory.questions.map((question) => question.contentFingerprint),
  explicitReplayOfFreshA.questions.map((question) => question.contentFingerprint),
  "explicit seeds must remain reproducible even when recent-history exclusions are supplied",
);

console.log("PASS_SEA_001_QUESTION_STUDIO_INTEGRATION");
console.log("package", SEA001_QUESTION_STUDIO_PACKAGE_ID);
console.log("permanent QLs", SEA001_QUESTION_STUDIO_PACKAGE.permanentQlCount);
console.log("languages", [...languageCoverage].join(","));
console.log("checkpoints", [...checkpointCoverage].sort().join(","));
console.log("validated dynamic questions", totalQuestions + 80 + freshA.questions.length + freshB.questions.length + historyAware.questions.length);
console.log("default freshness", freshA.generationContext.freshnessPolicy);
console.log("default caselet mix", freshA.generationContext.caseletMixPolicy);
console.log("Question Studio visible", SEA001_QUESTION_STUDIO_PACKAGE.questionStudioVisible);
console.log("generation-run persistence", SEA001_QUESTION_STUDIO_PACKAGE.generationRunPersistenceAllowed);
console.log("Question Bank eligible", SEA001_QUESTION_STUDIO_PACKAGE.questionBankEligible);
console.log("mock-test eligible", SEA001_QUESTION_STUDIO_PACKAGE.mockTestEligible);
console.log("publicly publishable", SEA001_QUESTION_STUDIO_PACKAGE.publiclyPublishable);
