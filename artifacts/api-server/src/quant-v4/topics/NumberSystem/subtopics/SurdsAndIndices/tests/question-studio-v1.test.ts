import assert from "node:assert/strict";

import {
  SRI_PERMANENT_ALLOCATION_V1,
  type SriPermanentQlId,
} from "../permanent-allocation-v1";
import {
  SRI_QUESTION_STUDIO_DIFFICULTIES_V1,
  SRI_QUESTION_STUDIO_LANGUAGES_V1,
  generateSriQuestionStudioBatchV1,
  isSriQuestionStudioRequestV1,
  listSriQuestionStudioPackagesV1,
} from "../question-studio-v1";
import {
  isSriQuestionStudioRequestV1 as isSriSharedRequest,
  listQuestionStudioPackages,
} from "../../../../../../question-studio/shared-generation-engine-sri";

const packages = listSriQuestionStudioPackagesV1();
assert.equal(packages.length, 2);
assert.deepEqual(packages.map((pkg) => pkg.packageId), ["SRI-001", "SRI-002"]);
assert.equal(packages[0]?.permanentQlCount, 29);
assert.equal(packages[1]?.permanentQlCount, 29);
assert.equal(packages.flatMap((pkg) => pkg.permanentQlIds).length, 58);
assert.equal(new Set(packages.flatMap((pkg) => pkg.permanentQlIds)).size, 58);

for (const pkg of packages) {
  assert.equal(pkg.enabled, true);
  assert.equal(pkg.runtimeMode, "QUESTION_STUDIO_ACTIVE");
  assert.equal(pkg.questionStudioDiscoverable, true);
  assert.equal(pkg.questionStudioGenerationEnabled, true);
  assert.deepEqual([...pkg.supportedLanguages], [...SRI_QUESTION_STUDIO_LANGUAGES_V1]);
  assert.deepEqual([...pkg.supportedDifficulties], [...SRI_QUESTION_STUDIO_DIFFICULTIES_V1]);
  assert.equal(pkg.questionBankStatus, "NOT_STORED");
  assert.equal(pkg.questionBankWritable, false);
  assert.equal(pkg.testEligibility, "INELIGIBLE");
  assert.equal(pkg.testEligible, false);
  assert.equal(pkg.mockTestEligible, false);
  assert.equal(pkg.publiclyPublishable, false);
  assert.equal(pkg.automaticStudentPublication, false);
}

assert.equal(isSriQuestionStudioRequestV1({ packageId: "SRI-001" }), true);
assert.equal(isSriQuestionStudioRequestV1({ packageId: "SRI-002" }), true);
assert.equal(isSriQuestionStudioRequestV1({ canonicalProblemId: "SRI-CP-011" }), true);
assert.equal(isSriQuestionStudioRequestV1({ questionLanguageId: "SRI-002-QL-029" }), true);
assert.equal(isSriQuestionStudioRequestV1({ subtopic: "Surds & Indices", topic: "Number System" }), true);
assert.equal(isSriQuestionStudioRequestV1({ packageId: "NUM-002", canonicalProblemId: "NUM-CP-014" }), false);
assert.equal(isSriQuestionStudioRequestV1({ packageId: "TRG-002" }), false);
assert.equal(isSriSharedRequest({ packageId: "NUM-002", canonicalProblemId: "NUM-CP-014" }), false);

const sharedPackages = listQuestionStudioPackages();
for (const requiredPackage of ["SRI-001", "SRI-002", "NUM-002"]) {
  assert.equal(sharedPackages.some((pkg: any) => String(pkg.packageId) === requiredPackage), true, `${requiredPackage} missing from cumulative Question Studio capabilities`);
}

let generated = 0;
for (const allocation of SRI_PERMANENT_ALLOCATION_V1) {
  for (const language of SRI_QUESTION_STUDIO_LANGUAGES_V1) {
    const seed = `sri-question-studio-test:${allocation.qlId}:${language}`;
    const result = await generateSriQuestionStudioBatchV1({
      packageId: allocation.packageId,
      canonicalProblemId: allocation.checkpointId,
      questionLanguageId: allocation.qlId,
      language,
      seed,
      count: 1,
    });
    assert.equal(result.questions.length, 1);
    assert.equal(result.questionPackages.length, 1);
    const question = result.questions[0]!;
    assert.equal(question.packageId, allocation.packageId);
    assert.equal(question.canonicalProblemId, allocation.checkpointId);
    assert.equal(question.questionLanguageId, allocation.qlId);
    assert.equal(question.qlId, allocation.qlId);
    assert.equal(question.language, language);
    assert.equal(question.locale, language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN");
    assert.equal(question.runtimeMode, "QUESTION_STUDIO_ACTIVE");
    assert.equal(question.questionStudioDiscoverable, true);
    assert.equal(question.questionStudioGenerationEnabled, true);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligibility, "INELIGIBLE");
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.options.length, 4);
    assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3);
    assert.equal(question.optionMetadata[question.correctIndex]?.canonicalKey, question.canonicalAnswer.key);
    assert.equal(question.validation.ok, true);
    assert.equal(question.validation.valid, true);
    assert.equal(question.verification.solverVerifierAgree, true);
    assert.equal(question.verification.exactlyOneCorrectOption, true);
    assert.equal(question.verification.domainValid, true);
    assert.ok(question.explanation.length > 0);
    assert.ok(question.packageExplanation.method.length > 0);
    assert.ok(question.packageExplanation.working.length > 0);
    generated += 1;
  }
}
assert.equal(generated, 174);

for (const language of SRI_QUESTION_STUDIO_LANGUAGES_V1) {
  const request = {
    questionLanguageId: "SRI-002-QL-029" as SriPermanentQlId,
    language,
    seed: `sri-determinism:${language}`,
    count: 1,
  };
  const first = await generateSriQuestionStudioBatchV1(request);
  const second = await generateSriQuestionStudioBatchV1(request);
  assert.deepEqual(first.questions, second.questions, `SRI deterministic preview drift for ${language}`);
  assert.deepEqual(first.questionPackages, second.questionPackages, `SRI deterministic package drift for ${language}`);
}

for (const difficulty of SRI_QUESTION_STUDIO_DIFFICULTIES_V1) {
  const result = await generateSriQuestionStudioBatchV1({
    difficulty,
    language: "en",
    seed: `sri-difficulty:${difficulty}`,
    count: 12,
  });
  assert.equal(result.questions.length, 12);
  assert.equal(result.questions.every((question) => question.difficulty === difficulty), true, `${difficulty} routing leaked another difficulty`);
}

await assert.rejects(
  () => generateSriQuestionStudioBatchV1({ packageId: "SRI-001", questionLanguageId: "SRI-002-QL-001", seed: "ownership-mismatch" }),
  /not owned by SRI-001/,
);
await assert.rejects(
  () => generateSriQuestionStudioBatchV1({ canonicalProblemId: "SRI-CP-013", seed: "invalid-cp" }),
  /not an SRI checkpoint/,
);

console.log(JSON.stringify({
  status: "PASS_SRI_QUESTION_STUDIO_V1",
  permanentQls: SRI_PERMANENT_ALLOCATION_V1.length,
  packages: packages.length,
  languages: SRI_QUESTION_STUDIO_LANGUAGES_V1,
  exhaustiveGeneratedQuestions: generated,
  questionStudioDiscoverable: true,
  questionStudioGenerationEnabled: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
