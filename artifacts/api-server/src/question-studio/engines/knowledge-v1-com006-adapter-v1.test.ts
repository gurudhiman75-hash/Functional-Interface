import { strict as assert } from "node:assert";
import {
  COM006_ENGLISH_FREEZE_AUTHORITY_V1,
  COM006_LOCALIZATION_FREEZE_AUTHORITY_V1,
  auditCom006FreezeV1,
} from "../../knowledge-v1/computer-awareness/com006-cyber-security-freeze-v1";
import {
  COM006_QUESTION_STUDIO_PACKAGE_ID_V1,
  COM006_STANDARD_BANK_ONLY_PACKAGE_V1,
  knowledgeV1Com006QuestionStudioAdapterV1,
} from "./knowledge-v1-com006-adapter-v1";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";

const audit = auditCom006FreezeV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.deepEqual(COM006_STANDARD_BANK_ONLY_PACKAGE_V1.cpIds, ["COM-006-CP-001"]);
assert.equal(COM006_STANDARD_BANK_ONLY_PACKAGE_V1.metadata?.englishQuestionCount, 32);
assert.equal(COM006_STANDARD_BANK_ONLY_PACKAGE_V1.metadata?.hindiQuestionCount, 32);
assert.equal(COM006_STANDARD_BANK_ONLY_PACKAGE_V1.metadata?.punjabiQuestionCount, 32);
assert.equal(COM006_STANDARD_BANK_ONLY_PACKAGE_V1.testEligible, false);
assert.equal(COM006_STANDARD_BANK_ONLY_PACKAGE_V1.mockTestEligible, false);
assert.equal(COM006_STANDARD_BANK_ONLY_PACKAGE_V1.publiclyPublishable, false);
assert.equal(COM006_STANDARD_BANK_ONLY_PACKAGE_V1.productionReleaseAuthorized, false);

for (const qlId of COM006_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds) {
  const request = {
    packageId: COM006_QUESTION_STUDIO_PACKAGE_ID_V1,
    patternId: qlId,
    count: 4,
    difficulty: "Mixed" as const,
    seed: `com006-${qlId}-parity-v1`,
  };
  const english = await knowledgeV1Com006QuestionStudioAdapterV1.generate({ ...request, language: "en" });
  const hindi = await knowledgeV1Com006QuestionStudioAdapterV1.generate({ ...request, language: "hi" });
  const punjabi = await knowledgeV1Com006QuestionStudioAdapterV1.generate({ ...request, language: "pa" });

  assert.deepEqual(english.questions.map((question: any) => question.sourceQuestionId).sort(), hindi.questions.map((question: any) => question.sourceQuestionId).sort());
  assert.deepEqual(english.questions.map((question: any) => question.sourceQuestionId).sort(), punjabi.questions.map((question: any) => question.sourceQuestionId).sort());
  assert.deepEqual(english.questions.map((question: any) => question.correctIndex).sort(), hindi.questions.map((question: any) => question.correctIndex).sort());
  assert.deepEqual(english.questions.map((question: any) => question.correctIndex).sort(), punjabi.questions.map((question: any) => question.correctIndex).sort());
  assert.ok(hindi.questions.every((question: any) => /[\\u0900-\\u097f]/.test(question.text)));
  assert.ok(punjabi.questions.every((question: any) => /[\\u0a00-\\u0a7f]/.test(question.text)));

  for (const question of [...english.questions, ...hindi.questions, ...punjabi.questions] as any[]) {
    assert.equal(question.packageId, "COM-006");
    assert.equal(question.cpId, "COM-006-CP-001");
    assert.equal(question.options.length, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.equal(question.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(question.questionBankWritable, true);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.productionReleaseAuthorized, false);
    assert.equal(question.questionStudioReview.registrationStatus, "REGISTERED_BANK_ONLY_INTERNAL");
    assert.equal(/\\bassociat\\w*\\b/i.test(`${question.stem} ${question.explanation}`), false);
  }

  const replay = await knowledgeV1Com006QuestionStudioAdapterV1.generate({ ...request, language: "en" });
  assert.deepEqual(english, replay);
}

const easy = await knowledgeV1Com006QuestionStudioAdapterV1.generate({
  packageId: "COM-006",
  language: "en",
  difficulty: "Easy",
  count: 4,
});
assert.equal(easy.questions.length, 4);
assert.ok(easy.questions.every((question: any) => question.difficulty === "Easy"));

const medium = await knowledgeV1Com006QuestionStudioAdapterV1.generate({
  packageId: "COM-006",
  language: "en",
  difficulty: "Medium",
  count: 4,
});
assert.equal(medium.questions.length, 4);
assert.ok(medium.questions.every((question: any) => question.difficulty === "Medium"));

await assert.rejects(
  () => knowledgeV1Com006QuestionStudioAdapterV1.generate({ packageId: "COM-006", language: "en", difficulty: "Hard", count: 1 }),
  /Hard difficulty is not authorized/,
);
await assert.rejects(
  () => knowledgeV1Com006QuestionStudioAdapterV1.generate({ packageId: "COM-006", patternId: "COM-006-QL-001", language: "en", count: 5 }),
  /without repeats/,
);

const packages = knowledgeV1QuestionStudioAdapter.listPackages();
assert.ok(packages.some((pkg) => pkg.packageId === "COM-006"));
const routed = await knowledgeV1QuestionStudioAdapter.generate({
  packageId: "COM-006",
  patternId: "COM-006-QL-001",
  language: "en",
  count: 2,
  seed: "com006-routed-v1",
});
assert.equal(routed.questions.length, 2);
assert.equal(routed.generationContext?.packageId, "COM-006");
assert.ok(routed.questions.every((question: any) => question.cpId === "COM-006-CP-001"));
assert.equal(routed.generationContext?.localizationFreezeAuthorityId, COM006_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId);

console.log("[KNOWLEDGE-V1-COM006] PASS", {
  qlCount: COM006_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds.length,
  questionsPerLanguage: 32,
  languages: ["en", "hi", "pa"],
  bankOnly: true,
});
