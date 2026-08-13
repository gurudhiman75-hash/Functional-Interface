import assert from "node:assert/strict";

import {
  generateMenCp009StandardQuestionStudioBatch,
  isMenCp009StandardQuestionStudioRequest,
  MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE,
} from "./question-studio-runtime";

assert.equal(MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE.packageId, "MEN-002");
assert.equal(MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE.enabled, true);
assert.deepEqual(MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE.cpIds, ["MEN-CP-009"]);
assert.deepEqual(MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(isMenCp009StandardQuestionStudioRequest({ packageId: "MEN-002" }), true);
assert.equal(isMenCp009StandardQuestionStudioRequest({ canonicalProblemId: "MEN-CP-009" }), true);
assert.equal(isMenCp009StandardQuestionStudioRequest({ packageId: "PCT-001" }), false);

for (const language of ["en", "hi", "pa"] as const) {
  const input = {
    packageId: "MEN-002",
    language,
    difficulty: "Medium",
    count: 12,
    seed: `men-cp009-standard-question-studio:${language}`,
  } as const;
  const first = generateMenCp009StandardQuestionStudioBatch(input);
  const second = generateMenCp009StandardQuestionStudioBatch(input);

  assert.equal(first.questions.length, 12);
  assert.deepEqual(first.questions, second.questions, `${language}: explicit seeds must stay deterministic`);
  assert.equal(first.generationContext.packageId, "MEN-002");
  assert.equal(first.generationContext.checkpointId, "MEN-CP-009");
  assert.ok(!("questionBankStatus" in first.generationContext));
  assert.ok(!("questionBankWritable" in first.generationContext));

  for (const question of first.questions) {
    assert.equal(question.packageId, "MEN-002");
    assert.equal(question.canonicalProblemId, "MEN-CP-009");
    assert.equal(question.language, language);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.ok(question.explanation.split("\n").length >= 4);
    assert.ok(question.explanation.split("\n").length <= 5);
    assert.ok(!("questionBankStatus" in question));
    assert.ok(!("questionBankWritable" in question));
    assert.ok(!("testEligibility" in question));
    assert.ok(!("publiclyPublishable" in question));

    if (language === "hi") {
      assert.match(`${question.stem}\n${question.explanation}`, /[\u0900-\u097F]/u);
    }
    if (language === "pa") {
      const learnerText = [question.stem, ...question.options, question.answer, question.explanation].join("\n");
      assert.match(learnerText, /[\u0A00-\u0A7F]/u);
      assert.equal(learnerText.includes("ਸਤਹ"), false);
    }
  }
}

process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/test";
const {
  getGeneratedQuestionBankEligibilityIssue,
} = await import("../../../../../../../lib/admin-question-conversion");
const {
  getGeneratedItemApprovalDisposition,
} = await import("../../../../../../../lib/admin-question-studio-approval-policy");

const releaseProbe = generateMenCp009StandardQuestionStudioBatch({
  packageId: "MEN-002",
  language: "pa",
  count: 1,
  seed: "men-cp009-standard-question-bank-probe",
});
const releasePayload = {
  ...releaseProbe.questions[0],
  generationContext: releaseProbe.generationContext,
};
assert.equal(getGeneratedQuestionBankEligibilityIssue(releasePayload), null);
assert.deepEqual(getGeneratedItemApprovalDisposition(releasePayload), {
  mode: "question_bank",
  reason: null,
});

console.log("MEN-CP-009 standard Question Studio runtime: PASS");
