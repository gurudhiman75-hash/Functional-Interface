import assert from "node:assert/strict";
import {
  generateLogicPuzzleQuestionStudioBatchV5,
  listLogicPuzzleQuestionStudioPackagesV5,
  LP_QUESTION_STUDIO_V5,
} from "./question-studio-v5.ts";

assert.equal(LP_QUESTION_STUDIO_V5.status, "HUMAN_REVIEW_CANDIDATE");
const projection = listLogicPuzzleQuestionStudioPackagesV5().find((pkg: any) => pkg.id === "LP-006-PROJECTION") as any;
assert.ok(projection);
assert.deepEqual(projection.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(projection.localizationFreezeStatus, "REVIEW_V1_NOT_FROZEN");

for (const language of ["hi", "pa"] as const) {
  const batch = await generateLogicPuzzleQuestionStudioBatchV5({ canonicalProblemId: "LP-QL-045", language, seed: `studio-v5-${language}`, count: 4 });
  assert.equal(batch.questions.length, 8);
  assert.deepEqual(new Set(batch.questions.map((question: any) => question.patternId)), new Set(["LP-QL-045", "LP-QL-046"]));
  assert.ok(batch.questions.every((question: any) => question.language === language));
  assert.ok(batch.questions.every((question: any) => question.runtimeMode === "REVIEW_ONLY" && question.questionBankWritable === false));
  assert.ok(batch.questions.every((question: any) => question.metadata.localizationAuthorityId === "LP_006_PROJECTION_HI_PA_LOCALIZATION_REVIEW_V1"));
  assert.ok(batch.questions.every((question: any) => question.answer === question.options[question.correctIndex]));
}

const lp011 = await generateLogicPuzzleQuestionStudioBatchV5({ packageId: "LP-011", language: "pa", seed: "studio-v5-lp011-regression", count: 2 });
assert.equal(lp011.questions.length, 8);
assert.ok(lp011.questions.every((question: any) => question.language === "pa"));

console.log("Question Studio V5 proof passed: LP-006 projection en/hi/pa review route plus LP-011 multilingual regression.");
