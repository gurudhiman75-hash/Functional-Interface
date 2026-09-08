import { strict as assert } from "node:assert";

import { getGeneratedQuestionBankAcceptanceMode, getGeneratedQuestionBankEligibilityIssue } from "../../lib/admin-question-conversion";
import {
  COM001_CP006_ENGLISH_FREEZE_AUTHORITY_V1,
  COM001_CP006_LOCALIZATION_FREEZE_AUTHORITY_V1,
  auditCom001Cp006FreezeV1,
} from "../../knowledge-v1/computer-awareness/com001-cp006-freeze-v1";
import {
  COM001_QUESTION_STUDIO_PACKAGE_ID,
  COM001_STANDARD_QUESTION_STUDIO_PACKAGE,
  knowledgeV1Com001QuestionStudioAdapter,
} from "./knowledge-v1-com001-adapter";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";

const pkg = COM001_STANDARD_QUESTION_STUDIO_PACKAGE;
const cp006QlIds = [...COM001_CP006_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds];

assert.equal(auditCom001Cp006FreezeV1().valid, true);
assert.deepEqual(pkg.cpIds, [
  "COM-001-CP-001",
  "COM-001-CP-002",
  "COM-001-CP-003",
  "COM-001-CP-004",
  "COM-001-CP-005",
  "COM-001-CP-006",
]);
assert.equal(pkg.metadata?.cp006QuestionCountPerLanguage, 28);
assert.equal(pkg.metadata?.cp006EnglishFreezeAuthorityId, COM001_CP006_ENGLISH_FREEZE_AUTHORITY_V1.authorityId);
assert.equal(pkg.metadata?.cp006LocalizationFreezeAuthorityId, COM001_CP006_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.productionReleaseAuthorized, false);

for (const qlId of cp006QlIds) {
  const request = {
    engineId: "knowledge-v1" as const,
    packageId: COM001_QUESTION_STUDIO_PACKAGE_ID,
    patternId: qlId,
    runtimeMode: "review-only",
    count: 4,
    difficulty: "Mixed" as const,
    seed: `com001-cp006-${qlId}`,
  };
  const english = await knowledgeV1Com001QuestionStudioAdapter.generate({ ...request, language: "en" });
  const hindi = await knowledgeV1Com001QuestionStudioAdapter.generate({ ...request, language: "hi" });
  const punjabi = await knowledgeV1Com001QuestionStudioAdapter.generate({ ...request, language: "pa" });
  const replay = await knowledgeV1Com001QuestionStudioAdapter.generate({ ...request, language: "en" });

  assert.deepEqual(english, replay);
  assert.equal(english.questions.length, 4);
  assert.deepEqual(
    english.questions.map((question: any) => question.sourceQuestionId).sort(),
    hindi.questions.map((question: any) => question.sourceQuestionId).sort(),
  );
  assert.deepEqual(
    english.questions.map((question: any) => question.sourceQuestionId).sort(),
    punjabi.questions.map((question: any) => question.sourceQuestionId).sort(),
  );
  assert.deepEqual(
    english.questions.map((question: any) => question.correctIndex).sort(),
    hindi.questions.map((question: any) => question.correctIndex).sort(),
  );
  assert.ok(hindi.questions.every((question: any) => /[\u0900-\u097f]/.test(question.text)));
  assert.ok(punjabi.questions.every((question: any) => /[\u0a00-\u0a7f]/.test(question.text)));

  for (const question of [...english.questions, ...hindi.questions, ...punjabi.questions] as any[]) {
    assert.equal(question.packageId, "COM-001");
    assert.equal(question.cpId, "COM-001-CP-006");
    assert.equal(question.options.length, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.equal(question.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(question.questionBankWritable, true);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.productionReleaseAuthorized, false);
    assert.equal(question.questionStudioReview.registrationStatus, "STANDARD_QUESTION_STUDIO_REGISTERED");
    assert.equal(getGeneratedQuestionBankAcceptanceMode(question), "BANK_ONLY");
    assert.equal(getGeneratedQuestionBankEligibilityIssue(question), null);
    assert.ok(!/\bassociat\w*\b/i.test(`${question.stem} ${question.explanation}`));
  }

  const easy = await knowledgeV1Com001QuestionStudioAdapter.generate({
    ...request,
    language: "en",
    difficulty: "Easy",
    count: 2,
  });
  assert.equal(easy.questions.length, 2);
  assert.ok(easy.questions.every((question: any) => question.difficulty === "Easy"));

  const medium = await knowledgeV1Com001QuestionStudioAdapter.generate({
    ...request,
    language: "en",
    difficulty: "Medium",
    count: 2,
  });
  assert.equal(medium.questions.length, 2);
  assert.ok(medium.questions.every((question: any) => question.difficulty === "Medium"));

  await assert.rejects(
    () => knowledgeV1Com001QuestionStudioAdapter.generate({ ...request, language: "en", difficulty: "Hard", count: 1 }),
    /does not produce Hard questions/,
  );
  await assert.rejects(
    () => knowledgeV1Com001QuestionStudioAdapter.generate({ ...request, language: "en", count: 5 }),
    /without repeats/,
  );
}

const chapterBatch = await knowledgeV1Com001QuestionStudioAdapter.generate({
  packageId: "COM-001",
  patternId: "COM-001-CP-006",
  language: "en",
  count: 6,
  seed: "com001-cp006-chapter-batch-v1",
});
assert.equal(chapterBatch.questions.length, 6);
assert.equal(new Set(chapterBatch.questions.map((question: any) => question.questionId)).size, 6);
assert.equal(chapterBatch.generationContext?.contentAuthorityVersion, "COM-001-CP-006-FREEZE-V1");
assert.deepEqual(chapterBatch.generationContext?.cpIds, [
  "COM-001-CP-001",
  "COM-001-CP-002",
  "COM-001-CP-003",
  "COM-001-CP-004",
  "COM-001-CP-005",
  "COM-001-CP-006",
]);

const routed = await knowledgeV1QuestionStudioAdapter.generate({
  packageId: "COM-001",
  patternId: "COM-001-CP-006-QL-001",
  language: "en",
  count: 2,
  seed: "com001-cp006-routed-v1",
});
assert.equal(routed.questions.length, 2);
assert.equal(routed.generationContext?.packageId, "COM-001");
assert.ok(routed.questions.every((question: any) => question.cpId === "COM-001-CP-006"));

console.log("[KNOWLEDGE-V1-COM001-CP006] PASS", {
  qlCount: cp006QlIds.length,
  questionsPerLanguage: 28,
  languages: ["en", "hi", "pa"],
  bankOnly: true,
});
