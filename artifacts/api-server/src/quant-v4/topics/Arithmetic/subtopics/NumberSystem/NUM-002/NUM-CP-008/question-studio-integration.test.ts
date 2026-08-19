import assert from "node:assert/strict";

import {
  generateQuestion as generateSharedQuestionStudioQuestion,
  listQuestionStudioPackages,
} from "../../../../../../../../question-studio/shared-generation-engine.ts";
import {
  generateNumCp008QuestionStudioBatch,
  isNumCp008QuestionStudioRequest,
  listNumCp008QuestionStudioPackages,
  NUM_CP008_QUESTION_STUDIO_QL_IDS,
} from "./question-studio-integration.ts";

const languages = ["en", "hi", "pa"] as const;
const targetScript = {
  hi: /[\u0900-\u097F]/u,
  pa: /[\u0A00-\u0A7F]/u,
} as const;

assert.equal(NUM_CP008_QUESTION_STUDIO_QL_IDS.length, 19);
assert.equal(NUM_CP008_QUESTION_STUDIO_QL_IDS[0], "NUM-QL-166");
assert.equal(NUM_CP008_QUESTION_STUDIO_QL_IDS.at(-1), "NUM-QL-184");

assert.equal(isNumCp008QuestionStudioRequest({ packageId: "NUM-002" }), true);
assert.equal(isNumCp008QuestionStudioRequest({ canonicalProblemId: "NUM-CP-008" }), true);
assert.equal(isNumCp008QuestionStudioRequest({ questionLanguageId: "NUM-QL-184" }), true);
assert.equal(isNumCp008QuestionStudioRequest({ packageId: "NUM-001", canonicalProblemId: "NUM-CP-001" }), false);

const localCapability = listNumCp008QuestionStudioPackages()[0]!;
assert.equal(localCapability.packageId, "NUM-002");
assert.deepEqual(localCapability.cpIds, ["NUM-CP-008"]);
assert.deepEqual(localCapability.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(localCapability.permanentQlCount, 19);
assert.equal(localCapability.enabled, true);
assert.equal(localCapability.runtimeMode, "QUESTION_STUDIO_ACTIVE");
assert.equal(localCapability.questionBankWritable, false);
assert.equal(localCapability.testEligible, false);
assert.equal(localCapability.mockTestEligible, false);
assert.equal(localCapability.publiclyPublishable, false);
assert.equal(localCapability.automaticStudentPublication, false);

const sharedCapability = listQuestionStudioPackages().find((entry: any) => entry.packageId === "NUM-002");
assert.ok(sharedCapability, "NUM-002 must be discoverable from the shared Question Studio capability list");
assert.deepEqual(sharedCapability.cpIds, ["NUM-CP-008"]);
assert.deepEqual(sharedCapability.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(sharedCapability.questionBankWritable, false);
assert.equal(sharedCapability.testEligible, false);
assert.equal(sharedCapability.publiclyPublishable, false);

let packages = 0;
let sourceLifecycleLocks = 0;
let integrationLifecycleLocks = 0;
let multilingualChecks = 0;

for (const qlId of NUM_CP008_QUESTION_STUDIO_QL_IDS) {
  for (const language of languages) {
    for (let sample = 1; sample <= 8; sample += 1) {
      const seed = `cp008-question-studio-proof:${qlId}:${language}:${sample}`;
      const first = await generateNumCp008QuestionStudioBatch({
        packageId: "NUM-002",
        canonicalProblemId: "NUM-CP-008",
        questionLanguageId: qlId,
        language,
        seed,
        count: 1,
      });
      const second = await generateNumCp008QuestionStudioBatch({
        packageId: "NUM-002",
        canonicalProblemId: "NUM-CP-008",
        questionLanguageId: qlId,
        language,
        seed,
        count: 1,
      });
      const pkg = first.questionPackages[0]!;
      const question = first.questions[0]!;

      assert.deepEqual(first.questionPackages, second.questionPackages, `${qlId}/${language}/${sample}: deterministic package drift`);
      assert.deepEqual(first.questions, second.questions, `${qlId}/${language}/${sample}: deterministic preview drift`);
      assert.equal(pkg.packageId, "NUM-002");
      assert.equal(pkg.canonicalProblemId, "NUM-CP-008");
      assert.equal(pkg.questionLanguageId, qlId);
      assert.equal(pkg.language, language);
      assert.equal(pkg.options[pkg.correctIndex], pkg.answer);
      assert.equal(pkg.verifierAnswer, pkg.answer);
      assert.equal(pkg.validation.ok, true);
      assert.equal(pkg.validation.valid, true);
      assert.equal(question.questionLanguageId, qlId);
      assert.equal(question.correctIndex, pkg.correctIndex);
      assert.equal(question.answer, pkg.answer);
      assert.equal(question.packageId, "NUM-002");
      assert.equal(question.canonicalProblemId, "NUM-CP-008");

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
    const result = await generateNumCp008QuestionStudioBatch({
      packageId: "NUM-002",
      canonicalProblemId: "NUM-CP-008",
      language,
      difficulty,
      seed: `cp008-difficulty-proof:${language}:${difficulty}`,
      count: 19,
    });
    assert.equal(result.questions.length, 19);
    for (const question of result.questions) {
      assert.equal(question.difficulty, difficulty, `${language}/${difficulty}: difficulty filter drift`);
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligible, false);
      assert.equal(question.publiclyPublishable, false);
    }
  }
}

for (const language of languages) {
  const shared = await generateSharedQuestionStudioQuestion({
    packageId: "NUM-002",
    canonicalProblemId: "NUM-CP-008",
    topic: "Arithmetic",
    subtopic: "Number System",
    language,
    difficulty: "Medium",
    seed: `cp008-shared-facade:${language}`,
    count: 5,
  });
  assert.equal(shared.questions.length, 5);
  assert.equal(shared.generationContext.packageId, "NUM-002");
  assert.equal(shared.generationContext.canonicalProblemId, "NUM-CP-008");
  assert.equal(shared.generationContext.questionBankWritable, false);
  assert.equal(shared.generationContext.testEligible, false);
  assert.equal(shared.generationContext.publiclyPublishable, false);
  for (const question of shared.questions) {
    assert.equal(question.packageId, "NUM-002");
    assert.equal(question.canonicalProblemId, "NUM-CP-008");
    assert.equal(question.language, language);
  }
}

await assert.rejects(
  () => generateNumCp008QuestionStudioBatch({
    packageId: "NUM-002",
    canonicalProblemId: "NUM-CP-008",
    questionLanguageId: "NUM-QL-165",
    language: "en",
    seed: "bad-owner",
  }),
  /not owned by NUM-CP-008/u,
);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_QUESTION_STUDIO_INTEGRATION_V1",
  permanentAuthorities: NUM_CP008_QUESTION_STUDIO_QL_IDS.length,
  languages,
  packages,
  sourceLifecycleLocks,
  integrationLifecycleLocks,
  multilingualChecks,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  nextAvailableQl: "NUM-QL-185",
}, null, 2));
