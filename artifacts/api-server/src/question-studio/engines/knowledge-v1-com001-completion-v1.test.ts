import { strict as assert } from "node:assert";

import {
  COM001_CP002_CP005_ENGLISH_FROZEN,
  COM001_CP002_CP005_HINDI_FROZEN,
  COM001_CP002_CP005_PUNJABI_FROZEN,
  COM001_CP002_CP005_ENGLISH_FREEZE_AUTHORITY_V1,
  COM001_CP002_CP005_LOCALIZATION_FREEZE_AUTHORITY_V1,
  auditCom001Cp002Cp005FreezeV1,
} from "../../knowledge-v1/computer-awareness/com001-cp002-cp005-freeze-v1";
import {
  COM001_STANDARD_QUESTION_STUDIO_PACKAGE,
  knowledgeV1Com001QuestionStudioAdapter,
} from "./knowledge-v1-com001-adapter";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";

const expectedCpIds = [
  "COM-001-CP-001",
  "COM-001-CP-002",
  "COM-001-CP-003",
  "COM-001-CP-004",
  "COM-001-CP-005",
  "COM-001-CP-006",
];

const audit = auditCom001Cp002Cp005FreezeV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.deepEqual(audit, {
  valid: true,
  issues: [],
  englishCount: 32,
  hindiCount: 32,
  punjabiCount: 32,
  qlCount: 16,
});
assert.deepEqual(COM001_STANDARD_QUESTION_STUDIO_PACKAGE.cpIds, expectedCpIds);
assert.equal(COM001_STANDARD_QUESTION_STUDIO_PACKAGE.metadata?.completionQuestionCountPerLanguage, 32);
assert.equal(
  COM001_STANDARD_QUESTION_STUDIO_PACKAGE.metadata?.completionEnglishFreezeAuthorityId,
  COM001_CP002_CP005_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
);
assert.equal(
  COM001_STANDARD_QUESTION_STUDIO_PACKAGE.metadata?.completionLocalizationFreezeAuthorityId,
  COM001_CP002_CP005_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
);

for (const corpus of [
  COM001_CP002_CP005_ENGLISH_FROZEN,
  COM001_CP002_CP005_HINDI_FROZEN,
  COM001_CP002_CP005_PUNJABI_FROZEN,
]) {
  assert.equal(corpus.length, 32);
  assert.deepEqual(new Set(corpus.map((question) => question.correctIndex)), new Set([0, 1, 2, 3]));
  for (const question of corpus) {
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.ok(!/which of the following|consider the following|associated/i.test(`${question.stem} ${question.explanation}`));
    assert.ok(question.explanation.split(/[.!?।]/).filter(Boolean).length <= 2);
  }
}

for (const qlId of COM001_CP002_CP005_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds) {
  const base = {
    packageId: "COM-001",
    patternId: qlId,
    count: 2,
    difficulty: "Mixed" as const,
    seed: `com001-completion-${qlId}`,
  };
  const en = await knowledgeV1Com001QuestionStudioAdapter.generate({ ...base, language: "en" });
  const hi = await knowledgeV1Com001QuestionStudioAdapter.generate({ ...base, language: "hi" });
  const pa = await knowledgeV1Com001QuestionStudioAdapter.generate({ ...base, language: "pa" });

  assert.deepEqual(
    en.questions.map((question: any) => question.sourceQuestionId),
    hi.questions.map((question: any) => question.sourceQuestionId),
  );
  assert.deepEqual(
    en.questions.map((question: any) => question.sourceQuestionId),
    pa.questions.map((question: any) => question.sourceQuestionId),
  );
  assert.deepEqual(
    en.questions.map((question: any) => question.correctIndex),
    hi.questions.map((question: any) => question.correctIndex),
  );
  assert.deepEqual(
    en.questions.map((question: any) => question.correctIndex),
    pa.questions.map((question: any) => question.correctIndex),
  );
  assert.ok(hi.questions.every((question: any) => /[\u0900-\u097f]/.test(question.text)));
  assert.ok(pa.questions.every((question: any) => /[\u0a00-\u0a7f]/.test(question.text)));

  for (const question of [...en.questions, ...hi.questions, ...pa.questions] as any[]) {
    assert.equal(question.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.productionReleaseAuthorized, false);
    assert.equal(question.questionStudioReview.contentAuthorityVersion, "COM-001-CP-002-CP-005-FREEZE-V1");
  }

  await assert.rejects(
    () => knowledgeV1Com001QuestionStudioAdapter.generate({ ...base, language: "en", count: 3 }),
    /without repeats/,
  );
}

for (const cpId of ["COM-001-CP-002", "COM-001-CP-003", "COM-001-CP-004", "COM-001-CP-005"]) {
  const result = await knowledgeV1QuestionStudioAdapter.generate({
    packageId: "COM-001",
    patternId: cpId,
    language: "en",
    count: 8,
    seed: `com001-completion-${cpId}`,
  });
  assert.equal(result.questions.length, 8);
  assert.equal(new Set(result.questions.map((question: any) => question.questionId)).size, 8);
  assert.ok(result.questions.every((question: any) => question.cpId === cpId));
  assert.deepEqual(result.generationContext?.cpIds, expectedCpIds);
}

console.log("[KNOWLEDGE-V1-COM001-COMPLETION] PASS", {
  cpIds: expectedCpIds,
  qlCount: 16,
  questionsPerLanguage: 32,
  languageVersions: 96,
  bankOnly: true,
});
