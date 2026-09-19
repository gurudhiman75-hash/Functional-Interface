import assert from "node:assert/strict";

import {
  generateMenCp009StandardQuestionStudioBatch,
  isMenCp009StandardQuestionStudioRequest,
  MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE,
  MEN_002_FULL_CHAPTER_QUESTION_STUDIO_PACKAGE,
} from "./question-studio-runtime";

assert.equal(MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE.packageId, "MEN-002");
assert.equal(MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE.enabled, true);
assert.deepEqual(MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE.cpIds, ["MEN-CP-009"]);
assert.deepEqual(MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE.supportedLanguages, ["en", "hi", "pa"]);

assert.equal(MEN_002_FULL_CHAPTER_QUESTION_STUDIO_PACKAGE.packageId, "MEN-002");
assert.equal(MEN_002_FULL_CHAPTER_QUESTION_STUDIO_PACKAGE.enabled, true);
assert.ok(MEN_002_FULL_CHAPTER_QUESTION_STUDIO_PACKAGE.cpIds.length > 1);
assert.equal(MEN_002_FULL_CHAPTER_QUESTION_STUDIO_PACKAGE.testEligibility, "INELIGIBLE");
assert.equal(MEN_002_FULL_CHAPTER_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);

assert.equal(isMenCp009StandardQuestionStudioRequest({ packageId: "MEN-002" }), true);
assert.equal(isMenCp009StandardQuestionStudioRequest({ canonicalProblemId: "MEN-CP-009" }), true);
assert.equal(isMenCp009StandardQuestionStudioRequest({ packageId: "PCT-001" }), false);

// Explicit MEN-CP-009 requests must preserve the approved spheres/hemispheres
// adapter. Package-level MEN-002 requests are tested separately below.
for (const language of ["en", "hi", "pa"] as const) {
  const input = {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-009",
    language,
    difficulty: "Medium",
    count: 12,
    seed: `men-cp009-standard-question-studio:${language}`,
  } as const;
  const first = generateMenCp009StandardQuestionStudioBatch(input);
  const second = generateMenCp009StandardQuestionStudioBatch(input);

  assert.equal(first.questions.length, 12);
  assert.deepEqual(first.questions, second.questions, `${language}: explicit CP-009 seeds must stay deterministic`);
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

// A package-level MEN-002 request must exercise the full Mensuration chapter
// instead of silently collapsing the package to MEN-CP-009.
for (const language of ["en", "hi", "pa"] as const) {
  const input = {
    packageId: "MEN-002",
    language,
    count: 18,
    seed: `men-002-full-chapter-question-studio:${language}`,
  } as const;
  const first = generateMenCp009StandardQuestionStudioBatch(input);
  const second = generateMenCp009StandardQuestionStudioBatch(input);

  assert.equal(first.questions.length, 18);
  assert.deepEqual(first.questions, second.questions, `${language}: package-level seeds must stay deterministic`);
  assert.equal(first.generationContext.packageId, "MEN-002");
  assert.equal(first.generationContext.checkpointId, "MEN-002-FULL-CHAPTER");
  assert.equal(first.generationContext.testEligibility, "INELIGIBLE");
  assert.equal(first.generationContext.publiclyPublishable, false);

  const cpIds = new Set(first.questions.map((question) => question.canonicalProblemId));
  assert.ok(cpIds.size >= 2, `${language}: full-chapter route collapsed to a single canonical problem`);

  for (const question of first.questions) {
    assert.equal(question.packageId, "MEN-002");
    assert.ok(MEN_002_FULL_CHAPTER_QUESTION_STUDIO_PACKAGE.cpIds.includes(question.canonicalProblemId as never));
    assert.equal(question.language, language);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.publiclyPublishable, false);

    if (language === "hi") {
      assert.match(`${question.stem}\n${question.explanation}`, /[\u0900-\u097F]/u);
    }
    if (language === "pa") {
      const learnerText = [question.stem, ...question.options, question.answer, question.explanation].join("\n");
      assert.match(learnerText, /[\u0A00-\u0A7F]/u);
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

// Explicit CP-009 retains its historical Question Bank approval path.
const releaseProbe = generateMenCp009StandardQuestionStudioBatch({
  packageId: "MEN-002",
  canonicalProblemId: "MEN-CP-009",
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

// Package-level full-chapter content is intentionally release-locked.
const fullChapterReleaseProbe = generateMenCp009StandardQuestionStudioBatch({
  packageId: "MEN-002",
  language: "en",
  count: 1,
  seed: "men-002-full-chapter-release-lock-probe",
});
const fullChapterReleasePayload = {
  ...fullChapterReleaseProbe.questions[0],
  generationContext: fullChapterReleaseProbe.generationContext,
};
assert.notEqual(getGeneratedQuestionBankEligibilityIssue(fullChapterReleasePayload), null);
assert.notEqual(getGeneratedItemApprovalDisposition(fullChapterReleasePayload).mode, "question_bank");

console.log("MEN-CP-009 explicit and MEN-002 full-chapter Question Studio routes: PASS");
