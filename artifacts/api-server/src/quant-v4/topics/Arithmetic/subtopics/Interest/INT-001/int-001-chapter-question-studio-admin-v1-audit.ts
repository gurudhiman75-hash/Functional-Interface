import assert from "node:assert/strict";

import {
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_CHECKPOINTS,
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_LANGUAGES,
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE,
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
  generateInt001ChapterAdminQuestionStudioBatch,
  ownerOfInt001PermanentQl,
} from "./int-001-chapter-question-studio-admin-adapter-v1";

const pkg = INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE;
assert.equal(pkg.packageId, "INT-001");
assert.equal(pkg.permanentQlCount, 133);
assert.equal(pkg.checkpointCount, 10);
assert.equal(pkg.permanentQlIds.length, 133);
assert.equal(new Set(pkg.permanentQlIds).size, 133);
assert.equal(pkg.permanentQlIds.includes("INT-QL-094"), false);
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.automaticStudentPublication, false);
assert.deepEqual([...pkg.supportedLanguages], ["en", "hi", "pa"]);
assert.deepEqual(pkg.checkpoints.map((entry) => entry.checkpointId), [...INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_CHECKPOINTS]);
assert.equal(pkg.checkpoints.reduce((sum, entry) => sum + entry.permanentQlCount, 0), 133);
assert.equal(ownerOfInt001PermanentQl("INT-QL-132"), "INT-CP-010");
assert.equal(ownerOfInt001PermanentQl("INT-QL-133"), "INT-CP-010");
assert.equal(ownerOfInt001PermanentQl("INT-QL-134"), "INT-CP-007");
assert.equal(ownerOfInt001PermanentQl("INT-QL-094"), null);

let generated = 0;
let deterministicChecks = 0;
let lifecycleChecks = 0;
let answerChecks = 0;
let explanationChecks = 0;
const questionIds = new Set<string>();
const reached = new Set<string>();

function stable(value: unknown) {
  return JSON.stringify(value, (_key, nested) => typeof nested === "bigint" ? `${nested}n` : nested);
}

for (const checkpoint of pkg.checkpoints) {
  for (const qlId of checkpoint.qlIds) {
    assert.equal(ownerOfInt001PermanentQl(qlId), checkpoint.checkpointId, `${qlId}: logical checkpoint ownership drifted.`);
    for (const language of INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_LANGUAGES) {
      const seed = `INT-001-CHAPTER-ADMIN-V1:${checkpoint.checkpointId}:${qlId}:${language}`;
      const first = await generateInt001ChapterAdminQuestionStudioBatch({ checkpointId: checkpoint.checkpointId, qlId, language, seed, count: 1 });
      const second = await generateInt001ChapterAdminQuestionStudioBatch({ checkpointId: checkpoint.checkpointId, qlId, language, seed, count: 1 });
      assert.equal(stable(first), stable(second), `${qlId}/${language}: chapter admin generation is nondeterministic.`);
      deterministicChecks += 1;
      assert.equal(first.questions.length, 1);
      const question = first.questions[0]!;
      assert.equal(question.packageId, "INT-001");
      assert.equal(question.checkpointId, checkpoint.checkpointId);
      assert.equal(question.qlId, qlId);
      assert.equal(question.permanentQlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.questionLanguageId, `${qlId}:${language}`);
      assert.equal(question.chapterIntegrationAuthority, INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION);
      assert.equal(question.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
      assert.equal(question.questionStudioStagingStatus, "REVIEW_QUEUE_ENABLED");
      assert.equal(question.questionBankStatus, "NOT_STORED");
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligibility, "INELIGIBLE");
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.automaticStudentPublication, false);
      lifecycleChecks += 9;
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.ok(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < 4);
      assert.equal(question.options[question.correctIndex], question.answer);
      answerChecks += 3;
      assert.ok(question.stem.length >= 10);
      assert.ok(question.explanationLines.length > 0);
      assert.ok(question.explanationLines.some((line) => /\d/u.test(line)), `${qlId}/${language}: solution has no numerical working.`);
      explanationChecks += 3;
      assert.equal(questionIds.has(question.questionId), false, `${question.questionId}: duplicate chapter-admin question id.`);
      questionIds.add(question.questionId);
      reached.add(`${qlId}|${language}`);
      generated += 1;
    }
  }
}

assert.equal(generated, 399);
assert.equal(reached.size, 399);
assert.equal(questionIds.size, 399);

const chapterBatch = await generateInt001ChapterAdminQuestionStudioBatch({ language: "en", seed: "INT-001-CHAPTER-ADMIN-V1:chapter-smoke", count: 50 });
assert.equal(chapterBatch.questions.length, 50);
assert.equal(new Set(chapterBatch.questions.map((question) => question.qlId)).size, 50);
assert.ok(new Set(chapterBatch.questions.map((question) => question.checkpointId)).size >= 5);

const cp010New = await generateInt001ChapterAdminQuestionStudioBatch({ checkpointId: "INT-CP-010", qlId: "INT-QL-132", language: "pa", seed: "INT-001-CHAPTER-ADMIN-V1:ql132", count: 1 });
assert.equal(cp010New.questions[0]?.checkpointId, "INT-CP-010");
assert.equal(cp010New.questions[0]?.sourceCanonicalProblemId.includes("WAVE"), true);
const cp007New = await generateInt001ChapterAdminQuestionStudioBatch({ checkpointId: "INT-CP-007", qlId: "INT-QL-134", language: "hi", seed: "INT-001-CHAPTER-ADMIN-V1:ql134", count: 1 });
assert.equal(cp007New.questions[0]?.checkpointId, "INT-CP-007");

await assert.rejects(
  () => generateInt001ChapterAdminQuestionStudioBatch({ checkpointId: "INT-CP-007", qlId: "INT-QL-132", language: "en", seed: "wrong-owner", count: 1 }),
  /belongs to INT-CP-010/u,
);
await assert.rejects(
  () => generateInt001ChapterAdminQuestionStudioBatch({ qlId: "INT-QL-094", language: "en", seed: "vacancy", count: 1 }),
  /not a permanent Interest QL/u,
);

console.log("PASS_INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_V1_AUDIT", JSON.stringify({
  adapterVersion: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
  checkpointCount: pkg.checkpointCount,
  permanentQlCount: pkg.permanentQlCount,
  languages: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_LANGUAGES,
  qlLanguageSurfaceCount: reached.size,
  generated,
  deterministicChecks,
  lifecycleChecks,
  answerChecks,
  explanationChecks,
  questionIdCollisions: 0,
  logicalNewQlOwners: {
    "INT-QL-132": ownerOfInt001PermanentQl("INT-QL-132"),
    "INT-QL-133": ownerOfInt001PermanentQl("INT-QL-133"),
    "INT-QL-134": ownerOfInt001PermanentQl("INT-QL-134"),
  },
  intentionalVacancy: "INT-QL-094",
  questionBankWritable: pkg.questionBankWritable,
  testEligible: pkg.testEligible,
  mockTestEligible: pkg.mockTestEligible,
  publiclyPublishable: pkg.publiclyPublishable,
}, null, 2));
