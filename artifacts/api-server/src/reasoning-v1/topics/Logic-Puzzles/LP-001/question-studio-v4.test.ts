import assert from "node:assert/strict";
import { LP_QUESTION_STUDIO_V4, generateLogicPuzzleQuestionStudioBatchV4, listLogicPuzzleQuestionStudioPackagesV4 } from "./question-studio-v4.ts";

assert.equal(LP_QUESTION_STUDIO_V4.status, "HUMAN_REVIEW_CANDIDATE");
const pkg = listLogicPuzzleQuestionStudioPackagesV4().find((entry: any) => entry.id === "LP-011") as any;
assert.ok(pkg);
assert.deepEqual(pkg.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(pkg.localizationFreezeStatus, "REVIEW_V1_NOT_FROZEN");

for (const language of ["hi", "pa"] as const) {
  const batch = await generateLogicPuzzleQuestionStudioBatchV4({ packageId: "LP-011", language, seed: `studio-v4-${language}`, count: 3 });
  assert.equal(batch.questions.length, 12);
  assert.deepEqual(new Set(batch.questions.map((question: any) => question.patternId)), new Set(["LP-QL-041", "LP-QL-042", "LP-QL-043", "LP-QL-044"]));
  assert.ok(batch.questions.every((question: any) => question.language === language));
  assert.ok(batch.questions.every((question: any) => question.runtimeMode === "REVIEW_ONLY" && question.questionBankWritable === false));
  assert.ok(batch.questions.every((question: any) => question.metadata.localizationAuthorityId === "LP_011_HI_PA_LOCALIZATION_REVIEW_V1"));
  assert.ok(batch.questions.every((question: any) => question.correctIndex >= 0 && question.options[question.correctIndex] === question.answer));
}

const english = await generateLogicPuzzleQuestionStudioBatchV4({ packageId: "LP-011", language: "en", seed: "studio-v4-en", count: 2 });
assert.equal(english.questions.length, 8);
assert.ok(english.questions.every((question: any) => question.language === "en"));

console.log("Question Studio V4 proof passed: LP-011 English/Hindi/Punjabi review routes preserve permanent QLs and remain publication-locked.");
