import assert from "node:assert/strict";
import { LP_010_MULTILINGUAL_QUESTION_STUDIO_V1 } from "./lp-010-question-studio-multilingual-v1.ts";
import { generateLogicPuzzleQuestionStudioBatch, isLogicPuzzleQuestionStudioRequest, listLogicPuzzleQuestionStudioPackages } from "./question-studio.ts";

assert.equal(isLogicPuzzleQuestionStudioRequest({ packageId: "LP-010" }), true);
assert.equal(isLogicPuzzleQuestionStudioRequest({ cpId: "LP-CP-010" }), true);
assert.equal(isLogicPuzzleQuestionStudioRequest({ patternId: "LP-QL-040" }), true);

assert.equal(LP_010_MULTILINGUAL_QUESTION_STUDIO_V1.status, "REVIEW_ONLY_MULTILINGUAL_ACTIVE");
assert.deepEqual(LP_010_MULTILINGUAL_QUESTION_STUDIO_V1.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(LP_010_MULTILINGUAL_QUESTION_STUDIO_V1.permanentQlIds, ["LP-QL-037", "LP-QL-038", "LP-QL-039", "LP-QL-040"]);

const packages = listLogicPuzzleQuestionStudioPackages();
const packageEntry = packages.find((entry) => entry.packageId === "LP-010");
assert.ok(packageEntry);
assert.deepEqual(packageEntry.cpIds, ["LP-CP-010"]);
assert.deepEqual(packageEntry.patternIds, ["LP-QL-037", "LP-QL-038", "LP-QL-039", "LP-QL-040"]);
assert.deepEqual(packageEntry.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(packageEntry.runtimeMode, "REVIEW_ONLY");
assert.equal(packageEntry.permanentQlCount, 4);
assert.deepEqual(packageEntry.permanentQlIds, ["LP-QL-037", "LP-QL-038", "LP-QL-039", "LP-QL-040"]);
assert.equal(packageEntry.permanentQlAllocationStatus, "ALLOCATED");
assert.equal(packageEntry.localizationFreezeStatus, "FROZEN_V6");

const seed = "lp-010-question-studio-multilingual-proof";
const english = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-010", language: "en", seed, count: 12 });
const hindi = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-010", language: "hi", seed, count: 12 });
const punjabi = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-010", language: "pa", seed, count: 12 });

for (const [language, result] of [["en", english], ["hi", hindi], ["pa", punjabi]] as const) {
  assert.equal(result.questions.length, 48);
  assert.equal(result.generationContext.packageId, "LP-010");
  assert.equal(result.generationContext.checkpointId, "LP-CP-010");
  assert.equal(result.generationContext.language, language);
  assert.equal(result.generationContext.runtimeMode, "REVIEW_ONLY");
  assert.equal(result.generationContext.permanentQlCount, 4);
  assert.deepEqual(result.generationContext.permanentQlIds, ["LP-QL-037", "LP-QL-038", "LP-QL-039", "LP-QL-040"]);
  assert.equal(result.generationContext.permanentQlAllocationStatus, "ALLOCATED");
  assert.equal(result.generationContext.localizationFreezeStatus, "FROZEN_V6");
  assert.equal(result.generationContext.questionStudioLanguageActivation, "ACTIVE_REVIEW_ONLY");

  for (const question of result.questions) {
    assert.equal(question.packageId, "LP-010");
    assert.equal(question.language, language);
    assert.equal(question.runtimeMode, "REVIEW_ONLY");
    assert.equal(question.answer, question.options[question.correctIndex]);
    assert.match(question.questionLanguageId, new RegExp(`-${language.toUpperCase()}$`, "u"));
    assert.ok(question.packageExplanation.lines.every((line) => line.includes("|---|---|")));
  }
}

assert.ok(hindi.questions.every((question) => /[\u0900-\u097F]/u.test(question.text)));
assert.ok(punjabi.questions.every((question) => /[\u0A00-\u0A7F]/u.test(question.text)));

const englishById = new Map(english.questions.map((question) => [question.questionId, question]));
for (const localized of [...hindi.questions, ...punjabi.questions]) {
  const source = englishById.get(localized.questionId);
  assert.ok(source, `Missing frozen English source for ${localized.questionId}`);
  assert.equal(localized.patternId, source.patternId);
  assert.equal(localized.difficulty, source.difficulty);
  assert.equal(localized.correctIndex, source.correctIndex);
  assert.deepEqual(localized.logic.assignment, source.logic.assignment);
  assert.equal(localized.logic.labels.timePatternId, source.logic.labels.timePatternId);
  assert.deepEqual(localized.logic.labels.times, source.logic.labels.times);
}

const uniqueTimeCounts = new Set(english.questions.filter((_, index) => index % 4 === 0).map((question) => question.logic.labels.times.length));
assert.deepEqual(uniqueTimeCounts, new Set([2, 4, 5, 6]));

const hindiAlias = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-010", language: "Hindi", seed: "alias-hi", count: 1 });
const punjabiAlias = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-010", language: "Punjabi", seed: "alias-pa", count: 1 });
assert.equal(hindiAlias.generationContext.language, "hi");
assert.equal(punjabiAlias.generationContext.language, "pa");

await assert.rejects(
  () => generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-010", language: "fr", count: 1 }),
  /LP-010 does not support Question Studio language/u,
);

const lp009Hindi = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-009", language: "hi", seed: "lp009-regression", count: 1 });
assert.equal(lp009Hindi.generationContext.packageId, "LP-009");
assert.equal(lp009Hindi.generationContext.language, "hi");

console.log("Question Studio LP-010 multilingual route passed: en/hi/pa generation, permanent QL metadata, 2/4/5/6-time preservation and frozen semantic parity are green.");
