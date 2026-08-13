import assert from "node:assert/strict";

import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../../../generation-engine";

const packages = listQuantV4Packages();
const mensurationPackages = packages.filter((pkg) => pkg.packageId === "MEN-002");
assert.equal(mensurationPackages.length, 1, "Question Studio must expose exactly one MEN-002 package");

const mensuration = mensurationPackages[0]!;
assert.equal(mensuration.enabled, true);
assert.equal(mensuration.topic, "Advanced Mathematics");
assert.equal(mensuration.subtopic, "Mensuration");
assert.deepEqual(mensuration.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual((mensuration as any).cpIds, ["MEN-CP-009"]);

for (const language of ["en", "hi", "pa"] as const) {
  const input = {
    packageId: "MEN-002" as const,
    language,
    difficulty: "Medium" as const,
    count: 10,
    seed: `men-cp009-central-question-studio:${language}`,
  };

  const first = await generateQuestion(input);
  const second = await generateQuestion(input);
  assert.equal(first.questions.length, 10);
  assert.deepEqual(first.questions, second.questions, `${language}: central generation must remain deterministic with an explicit seed`);

  for (const question of first.questions as any[]) {
    assert.equal(question.packageId, "MEN-002");
    assert.equal(question.canonicalProblemId, "MEN-CP-009");
    assert.equal(question.language, language);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.ok(question.explanation.split("\n").length >= 4);
    assert.ok(question.explanation.split("\n").length <= 5);
    assert.equal("questionBankStatus" in question, false);
    assert.equal("questionBankWritable" in question, false);
    assert.equal("testEligibility" in question, false);
    assert.equal("publiclyPublishable" in question, false);

    if (language === "pa") {
      const learnerText = [question.stem, ...question.options, question.answer, question.explanation].join("\n");
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

const approvalProbe = await generateQuestion({
  packageId: "MEN-002",
  language: "en",
  count: 1,
  seed: "men-cp009-standard-approval-probe",
});
const approvalPayload = {
  ...(approvalProbe.questions[0] as Record<string, unknown>),
  generationContext: approvalProbe.generationContext,
};
assert.equal(getGeneratedQuestionBankEligibilityIssue(approvalPayload), null);
assert.deepEqual(getGeneratedItemApprovalDisposition(approvalPayload), {
  mode: "question_bank",
  reason: null,
});

console.log("MEN-CP-009 standard Question Studio integration: PASS");
