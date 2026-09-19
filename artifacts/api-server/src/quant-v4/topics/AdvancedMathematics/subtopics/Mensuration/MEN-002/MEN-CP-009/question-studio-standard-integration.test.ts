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
assert.ok((mensuration as any).cpIds.length > 1, "MEN-002 metadata must expose the full Mensuration chapter");
assert.ok((mensuration as any).cpIds.includes("MEN-CP-009"), "MEN-002 metadata must retain CP-009 discoverability");
assert.equal((mensuration as any).testEligibility, "INELIGIBLE");
assert.equal((mensuration as any).publiclyPublishable, false);

// Package-level MEN-002 generation must use the full-chapter reviewed source
// and stay release-locked.
for (const language of ["en", "hi", "pa"] as const) {
  const input = {
    packageId: "MEN-002" as const,
    language,
    count: 10,
    seed: `men-002-central-full-chapter:${language}`,
  };

  const first = await generateQuestion(input);
  const second = await generateQuestion(input);
  assert.equal(first.questions.length, 10);
  assert.deepEqual(first.questions, second.questions, `${language}: full-chapter central generation must remain deterministic with an explicit seed`);
  assert.equal((first.generationContext as any).checkpointId, "MEN-002-FULL-CHAPTER");
  assert.equal((first.generationContext as any).testEligibility, "INELIGIBLE");
  assert.equal((first.generationContext as any).publiclyPublishable, false);

  const cpIds = new Set((first.questions as any[]).map((question) => question.canonicalProblemId));
  assert.ok(cpIds.size >= 2, `${language}: central MEN-002 generation collapsed to a single CP`);

  for (const question of first.questions as any[]) {
    assert.equal(question.packageId, "MEN-002");
    assert.ok((mensuration as any).cpIds.includes(question.canonicalProblemId));
    assert.equal(question.language, language);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.publiclyPublishable, false);

    if (language === "hi") {
      assert.match([question.stem, question.explanation].join("\n"), /[\u0900-\u097F]/u);
    }
    if (language === "pa") {
      assert.match([question.stem, ...question.options, question.answer, question.explanation].join("\n"), /[\u0A00-\u0A7F]/u);
    }
  }
}

// Explicit CP-009 requests must still use the approved spheres/hemispheres
// adapter rather than the package-level full-chapter route.
for (const language of ["en", "hi", "pa"] as const) {
  const input = {
    packageId: "MEN-002" as const,
    canonicalProblemId: "MEN-CP-009",
    language,
    difficulty: "Medium" as const,
    count: 6,
    seed: `men-cp009-central-explicit:${language}`,
  };

  const first = await generateQuestion(input);
  const second = await generateQuestion(input);
  assert.deepEqual(first.questions, second.questions, `${language}: explicit CP-009 central generation must stay deterministic`);
  assert.equal((first.generationContext as any).checkpointId, "MEN-CP-009");

  for (const question of first.questions as any[]) {
    assert.equal(question.packageId, "MEN-002");
    assert.equal(question.canonicalProblemId, "MEN-CP-009");
    assert.equal(question.language, language);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal("questionBankStatus" in question, false);
    assert.equal("questionBankWritable" in question, false);
    assert.equal("testEligibility" in question, false);
    assert.equal("publiclyPublishable" in question, false);
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
  canonicalProblemId: "MEN-CP-009",
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

const lockedProbe = await generateQuestion({
  packageId: "MEN-002",
  language: "en",
  count: 1,
  seed: "men-002-full-chapter-approval-lock-probe",
});
const lockedPayload = {
  ...(lockedProbe.questions[0] as Record<string, unknown>),
  generationContext: lockedProbe.generationContext,
};
assert.notEqual(getGeneratedQuestionBankEligibilityIssue(lockedPayload), null);
assert.notEqual(getGeneratedItemApprovalDisposition(lockedPayload).mode, "question_bank");

console.log("MEN-002 full-chapter and explicit MEN-CP-009 Question Studio integration: PASS");
