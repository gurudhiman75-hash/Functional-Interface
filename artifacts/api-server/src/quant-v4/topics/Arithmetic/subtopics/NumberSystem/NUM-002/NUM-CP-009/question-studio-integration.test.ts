import assert from "node:assert/strict";

import {
  generateQuestion as generateSharedQuestionStudioQuestion,
  listQuestionStudioPackages,
} from "../../../../../../../question-studio/shared-generation-engine.ts";
import {
  generateNumCp009QuestionStudioBatch,
  isNumCp009QuestionStudioRequest,
  listNumCp009QuestionStudioPackages,
  NUM_CP009_QUESTION_STUDIO_QL_IDS,
} from "./question-studio-integration.ts";

const languages = ["en", "hi", "pa"] as const;
const targetScript = {
  hi: /[\u0900-\u097F]/u,
  pa: /[\u0A00-\u0A7F]/u,
} as const;

assert.equal(NUM_CP009_QUESTION_STUDIO_QL_IDS.length, 12);
assert.equal(NUM_CP009_QUESTION_STUDIO_QL_IDS[0], "NUM-QL-185");
assert.equal(NUM_CP009_QUESTION_STUDIO_QL_IDS.at(-1), "NUM-QL-196");

// CP009 must be explicitly selected. Package-only NUM-002 remains the CP008 fallback.
assert.equal(isNumCp009QuestionStudioRequest({ packageId: "NUM-002" }), false);
assert.equal(isNumCp009QuestionStudioRequest({ canonicalProblemId: "NUM-CP-009" }), true);
assert.equal(isNumCp009QuestionStudioRequest({ patternId: "NUM-CP-009" }), true);
assert.equal(isNumCp009QuestionStudioRequest({ questionLanguageId: "NUM-QL-196" }), true);
assert.equal(isNumCp009QuestionStudioRequest({ canonicalProblemId: "NUM-CP-008" }), false);

const localCapability = listNumCp009QuestionStudioPackages()[0]!;
assert.equal(localCapability.packageId, "NUM-002");
assert.deepEqual(localCapability.cpIds, ["NUM-CP-009"]);
assert.deepEqual(localCapability.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(localCapability.permanentQlCount, 12);
assert.equal(localCapability.enabled, true);
assert.equal(localCapability.runtimeMode, "QUESTION_STUDIO_ACTIVE");
assert.equal(localCapability.questionBankWritable, false);
assert.equal(localCapability.testEligible, false);
assert.equal(localCapability.mockTestEligible, false);
assert.equal(localCapability.publiclyPublishable, false);
assert.equal(localCapability.automaticStudentPublication, false);

const sharedCapability = listQuestionStudioPackages().find((entry: any) => entry.packageId === "NUM-002");
assert.ok(sharedCapability, "NUM-002 must be discoverable from the shared Question Studio capability list");
assert.deepEqual(sharedCapability.cpIds, ["NUM-CP-008", "NUM-CP-009", "NUM-CP-010", "NUM-CP-011"]);
assert.deepEqual(sharedCapability.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(sharedCapability.permanentQlCount, 60);
assert.equal(sharedCapability.permanentQlIds.length, 60);
assert.equal(sharedCapability.permanentQlIds[0], "NUM-QL-166");
assert.equal(sharedCapability.permanentQlIds.at(-1), "NUM-QL-225");
assert.equal(sharedCapability.questionBankWritable, false);
assert.equal(sharedCapability.testEligible, false);
assert.equal(sharedCapability.publiclyPublishable, false);

let packages = 0;
let sourceLifecycleLocks = 0;
let integrationLifecycleLocks = 0;
let multilingualChecks = 0;
let authorityChecks = 0;

for (const qlId of NUM_CP009_QUESTION_STUDIO_QL_IDS) {
  for (const language of languages) {
    for (let sample = 1; sample <= 8; sample += 1) {
      const seed = `cp009-question-studio-proof:${qlId}:${language}:${sample}`;
      const first = await generateNumCp009QuestionStudioBatch({ packageId: "NUM-002", canonicalProblemId: "NUM-CP-009", questionLanguageId: qlId, language, seed, count: 1 });
      const second = await generateNumCp009QuestionStudioBatch({ packageId: "NUM-002", canonicalProblemId: "NUM-CP-009", questionLanguageId: qlId, language, seed, count: 1 });
      const pkg = first.questionPackages[0]!;
      const question = first.questions[0]!;

      assert.deepEqual(first.questionPackages, second.questionPackages, `${qlId}/${language}/${sample}: deterministic package drift`);
      assert.deepEqual(first.questions, second.questions, `${qlId}/${language}/${sample}: deterministic preview drift`);
      assert.equal(pkg.packageId, "NUM-002");
      assert.equal(pkg.canonicalProblemId, "NUM-CP-009");
      assert.equal(pkg.questionLanguageId, qlId);
      assert.equal(pkg.language, language);
      assert.equal(pkg.options[pkg.correctIndex], pkg.answer);
      assert.equal(pkg.verifierAnswer, pkg.answer);
      assert.equal(pkg.validation.ok, true);
      assert.equal(pkg.validation.valid, true);
      assert.ok(pkg.authorityId.startsWith("NUM-CP009-AUTH-"));
      assert.ok(pkg.authorityLabel.length > 0);
      assert.equal(question.questionLanguageId, qlId);
      assert.equal(question.correctIndex, pkg.correctIndex);
      assert.equal(question.answer, pkg.answer);
      assert.equal(question.packageId, "NUM-002");
      assert.equal(question.canonicalProblemId, "NUM-CP-009");
      assert.equal(question.authorityId, pkg.authorityId);
      authorityChecks += 1;

      assert.equal(pkg.traceability.sourceLifecycle.questionStudioDiscoverable, false);
      assert.equal(pkg.traceability.sourceLifecycle.questionBankWritable, false);
      assert.equal(pkg.traceability.sourceLifecycle.testEligible, false);
      assert.equal(pkg.traceability.sourceLifecycle.publiclyPublishable, false);
      sourceLifecycleLocks += 1;

      assert.equal(pkg.questionStudioDiscoverable, true);
      assert.equal(pkg.questionBankWritable, false);
      assert.equal(pkg.testEligible, false);
      assert.equal(pkg.mockTestEligible, false);
      assert.equal(pkg.publiclyPublishable, false);
      assert.equal(pkg.automaticStudentPublication, false);
      assert.equal(first.generationContext.questionStudioDiscoverable, true);
      assert.equal(first.generationContext.questionBankWritable, false);
      assert.equal(first.generationContext.testEligible, false);
      assert.equal(first.generationContext.mockTestEligible, false);
      assert.equal(first.generationContext.publiclyPublishable, false);
      integrationLifecycleLocks += 1;

      if (language !== "en") {
        assert.match(`${pkg.stem} ${pkg.explanation.lines.join(" ")}`, targetScript[language]);
        assert.equal(pkg.traceability.localizationStatus, "HI_PA_FROZEN");
        multilingualChecks += 1;
      } else {
        assert.equal(pkg.traceability.englishAuthorityStatus, "ENGLISH_FROZEN");
      }
      packages += 1;
    }
  }
}

for (const language of languages) {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const result = await generateNumCp009QuestionStudioBatch({ packageId: "NUM-002", canonicalProblemId: "NUM-CP-009", language, difficulty, seed: `cp009-difficulty-proof:${language}:${difficulty}`, count: 12 });
    assert.equal(result.questions.length, 12);
    for (const question of result.questions) {
      assert.equal(question.difficulty, difficulty, `${language}/${difficulty}: difficulty filter drift`);
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligible, false);
      assert.equal(question.publiclyPublishable, false);
    }
  }
}

for (const language of languages) {
  const shared = await generateSharedQuestionStudioQuestion({ packageId: "NUM-002", canonicalProblemId: "NUM-CP-009", topic: "Arithmetic", subtopic: "Number System", language, difficulty: "Medium", seed: `cp009-shared-facade:${language}`, count: 5 });
  assert.equal(shared.questions.length, 5);
  assert.equal(shared.generationContext.packageId, "NUM-002");
  assert.equal(shared.generationContext.canonicalProblemId, "NUM-CP-009");
  assert.equal(shared.generationContext.questionBankWritable, false);
  assert.equal(shared.generationContext.testEligible, false);
  assert.equal(shared.generationContext.publiclyPublishable, false);
  for (const question of shared.questions) {
    assert.equal(question.packageId, "NUM-002");
    assert.equal(question.canonicalProblemId, "NUM-CP-009");
    assert.equal(question.language, language);
  }
}

const packageOnlyFallback = await generateSharedQuestionStudioQuestion({ packageId: "NUM-002", language: "en", difficulty: "Medium", seed: "cp009-prove-cp008-package-only-fallback", count: 1 });
assert.equal(packageOnlyFallback.generationContext.canonicalProblemId, "NUM-CP-008");
assert.equal(packageOnlyFallback.questions[0]?.canonicalProblemId, "NUM-CP-008");

await assert.rejects(
  () => generateNumCp009QuestionStudioBatch({ packageId: "NUM-002", canonicalProblemId: "NUM-CP-009", questionLanguageId: "NUM-QL-184", language: "en", seed: "bad-owner" }),
  /not owned by NUM-CP-009/u,
);

console.log(JSON.stringify({
  status: "PASS_NUM_CP009_QUESTION_STUDIO_INTEGRATION_V1",
  permanentAuthorities: NUM_CP009_QUESTION_STUDIO_QL_IDS.length,
  sharedNum002PermanentAuthorities: sharedCapability.permanentQlCount,
  sharedNum002Checkpoints: sharedCapability.cpIds,
  languages,
  packages,
  sourceLifecycleLocks,
  integrationLifecycleLocks,
  multilingualChecks,
  authorityChecks,
  packageOnlyFallbackCheckpoint: packageOnlyFallback.generationContext.canonicalProblemId,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  nextAvailableQl: "NUM-QL-226",
}, null, 2));
