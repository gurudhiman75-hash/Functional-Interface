import assert from "node:assert/strict";
import {
  generateLogicPuzzleQuestionStudioBatchV3,
  listLogicPuzzleQuestionStudioPackagesV3,
} from "./question-studio-v3.ts";

const packages = listLogicPuzzleQuestionStudioPackagesV3();
const pkg = packages.find((entry: any) => entry.id === "LP-CP04-COUNTERFACTUAL");
assert.ok(pkg);
assert.deepEqual((pkg as any).permanentQlIds, ["LP-QL-047"]);
assert.deepEqual((pkg as any).supportedLanguages, ["en", "hi", "pa"]);
assert.equal((pkg as any).runtimeMode, "REVIEW_ONLY");
assert.equal((pkg as any).questionBankWritable, false);
assert.equal((pkg as any).testEligible, false);
assert.equal((pkg as any).mockTestEligible, false);
assert.equal((pkg as any).publiclyPublishable, false);

const byLanguage = new Map<string, any>();
for (const language of ["en", "hi", "pa"] as const) {
  const result = await generateLogicPuzzleQuestionStudioBatchV3({
    packageId: "LP-CP04-COUNTERFACTUAL",
    language,
    seed: "LP-QL-047-QS-PARITY",
    count: 9,
  });
  byLanguage.set(language, result);
  assert.equal(result.questions.length, 9);
  assert.equal(result.generationContext.packageId, "LP-CP04-COUNTERFACTUAL");
  assert.equal(result.generationContext.runtimeMode, "REVIEW_ONLY");
  assert.deepEqual(result.generationContext.permanentQlIds, ["LP-QL-047"]);
  assert.equal(result.generationContext.questionBankWritable, false);
  assert.equal(result.generationContext.testEligible, false);
  assert.equal(result.generationContext.mockTestEligible, false);
  assert.equal(result.generationContext.publiclyPublishable, false);
  for (const question of result.questions) {
    assert.equal(question.patternId, "LP-QL-047");
    assert.equal(question.canonicalProblemId, "LP-QL-047");
    assert.equal(question.language, language);
    assert.equal(question.runtimeMode, "REVIEW_ONLY");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
  }
}

const en = byLanguage.get("en");
const hi = byLanguage.get("hi");
const pa = byLanguage.get("pa");
for (let i = 0; i < 9; i += 1) {
  assert.equal(en.questions[i].correctIndex, hi.questions[i].correctIndex);
  assert.equal(en.questions[i].correctIndex, pa.questions[i].correctIndex);
  assert.equal(en.questions[i].difficulty, hi.questions[i].difficulty);
  assert.equal(en.questions[i].difficulty, pa.questions[i].difficulty);
  assert.equal(en.questions[i].traceability.qlId, hi.questions[i].traceability.qlId);
  assert.equal(en.questions[i].traceability.qlId, pa.questions[i].traceability.qlId);
}

console.log("PASS_LP_QL_047_QUESTION_STUDIO_V3");
console.log("languages en hi pa");
console.log("review-only delivery locks preserved");
