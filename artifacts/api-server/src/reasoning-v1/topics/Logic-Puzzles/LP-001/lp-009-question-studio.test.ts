import assert from "node:assert/strict";
import { LP_009_MULTILINGUAL_QUESTION_STUDIO_V1 } from "./lp-009-question-studio-multilingual-v1.ts";
import { generateLogicPuzzleQuestionStudioBatch, isLogicPuzzleQuestionStudioRequest, listLogicPuzzleQuestionStudioPackages } from "./question-studio.ts";

assert.equal(isLogicPuzzleQuestionStudioRequest({ packageId: "LP-009" }), true);
assert.equal(isLogicPuzzleQuestionStudioRequest({ cpId: "LP-CP-009" }), true);
assert.equal(isLogicPuzzleQuestionStudioRequest({ patternId: "LP-QL-036" }), true);

assert.equal(LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.status, "REVIEW_ONLY_MULTILINGUAL_ACTIVE");
assert.deepEqual(LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.permanentQlIds, ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"]);
assert.equal(LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.questionBankWritable, false);
assert.equal(LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.testEligible, false);
assert.equal(LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.mockTestEligible, false);
assert.equal(LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.publiclyPublishable, false);

const packages = listLogicPuzzleQuestionStudioPackages();
const packageEntry = packages.find((entry) => entry.packageId === "LP-009");
assert.ok(packageEntry);
assert.deepEqual(packageEntry.cpIds, ["LP-CP-009"]);
assert.deepEqual(packageEntry.patternIds, ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"]);
assert.deepEqual(packageEntry.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(packageEntry.runtimeMode, "REVIEW_ONLY");
assert.equal(packageEntry.permanentQlCount, 4);
assert.deepEqual(packageEntry.permanentQlIds, ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"]);
assert.equal(packageEntry.permanentQlAllocationStatus, "ALLOCATED");
assert.equal(packageEntry.questionBankWritable, false);
assert.equal(packageEntry.testEligible, false);
assert.equal(packageEntry.mockTestEligible, false);
assert.equal(packageEntry.publiclyPublishable, false);

const lp008 = packages.find((entry) => entry.packageId === "LP-008");
assert.ok(lp008);
assert.deepEqual(lp008.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(lp008.permanentQlCount, 4);
assert.equal(lp008.permanentQlAllocationStatus, "ALLOCATED");
assert.equal(lp008.localizationFreezeStatus, "FROZEN_V4");

const seed = "lp-009-question-studio-multilingual-proof";
const english = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-009", language: "en", seed, count: 8 });
const hindi = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-009", language: "hi", seed, count: 8 });
const punjabi = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-009", language: "pa", seed, count: 8 });

for (const [language, result] of [["en", english], ["hi", hindi], ["pa", punjabi]] as const) {
  assert.equal(result.questions.length, 32);
  assert.equal(result.generationContext.packageId, "LP-009");
  assert.equal(result.generationContext.checkpointId, "LP-CP-009");
  assert.equal(result.generationContext.language, language);
  assert.equal(result.generationContext.runtimeMode, "REVIEW_ONLY");
  assert.equal(result.generationContext.permanentQlCount, 4);
  assert.deepEqual(result.generationContext.permanentQlIds, ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"]);
  assert.equal(result.generationContext.permanentQlAllocationStatus, "ALLOCATED");
  assert.equal(result.generationContext.questionBankWritable, false);
  assert.equal(result.generationContext.testEligible, false);
  assert.equal(result.generationContext.mockTestEligible, false);
  assert.equal(result.generationContext.publiclyPublishable, false);
  assert.equal(result.generationContext.automaticStudentPublication, false);

  for (const question of result.questions) {
    assert.equal(question.packageId, "LP-009");
    assert.equal(question.language, language);
    assert.equal(question.runtimeMode, "REVIEW_ONLY");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.answer, question.options[question.correctIndex]);
    assert.match(question.questionLanguageId, new RegExp(`-${language.toUpperCase()}$`, "u"));
    assert.ok(question.packageExplanation.lines.every((line) => line.includes("|---|---|")));
  }
}

assert.ok(english.questions.some((question) => /six months/u.test(question.text)));
assert.ok(english.questions.some((question) => /six different years/u.test(question.text)));
assert.ok(hindi.questions.every((question) => /[\u0900-\u097F]/u.test(question.text)));
assert.ok(punjabi.questions.every((question) => /[\u0A00-\u0A7F]/u.test(question.text)));

const englishById = new Map(english.questions.map((question) => [question.questionId, question]));
for (const localized of [...hindi.questions, ...punjabi.questions]) {
  const source = englishById.get(localized.questionId);
  assert.ok(source, `Missing frozen English source for ${localized.questionId}`);
  assert.equal(localized.patternId, source.patternId);
  assert.equal(localized.correctIndex, source.correctIndex);
  assert.deepEqual(localized.logic.assignment, source.logic.assignment);
}

const hindiAlias = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-009", language: "Hindi", seed: "alias-hi", count: 1 });
const punjabiAlias = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-009", language: "Punjabi", seed: "alias-pa", count: 1 });
assert.equal(hindiAlias.generationContext.language, "hi");
assert.equal(punjabiAlias.generationContext.language, "pa");

const lp008Hindi = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-008", language: "hi", seed: "lp008-multilingual-regression", count: 1 });
assert.equal(lp008Hindi.generationContext.packageId, "LP-008");
assert.equal(lp008Hindi.generationContext.language, "hi");
assert.equal(lp008Hindi.generationContext.localizationFreezeStatus, "FROZEN_V4");

await assert.rejects(
  () => generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-009", language: "fr", count: 1 }),
  /LP-009 does not support Question Studio language/u,
);

console.log("Question Studio LP-009 multilingual route passed: en/hi/pa generation, permanent QL metadata, frozen semantic parity and downstream lifecycle locks are green.");
