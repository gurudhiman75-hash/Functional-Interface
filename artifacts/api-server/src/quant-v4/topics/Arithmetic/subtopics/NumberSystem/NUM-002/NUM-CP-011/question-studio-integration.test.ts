import assert from "node:assert/strict";

import {
  NUM_CP011_QUESTION_STUDIO_CHECKPOINT_ID,
  NUM_CP011_QUESTION_STUDIO_LANGUAGES,
  NUM_CP011_QUESTION_STUDIO_PACKAGE_ID,
  NUM_CP011_QUESTION_STUDIO_QL_IDS,
  generateNumCp011QuestionStudioBatch,
  isNumCp011QuestionStudioRequest,
  listNumCp011QuestionStudioPackages,
} from "./question-studio-integration.ts";

assert.equal(NUM_CP011_QUESTION_STUDIO_PACKAGE_ID, "NUM-002");
assert.equal(NUM_CP011_QUESTION_STUDIO_CHECKPOINT_ID, "NUM-CP-011");
assert.deepEqual(NUM_CP011_QUESTION_STUDIO_LANGUAGES, ["en", "hi", "pa"]);
assert.equal(NUM_CP011_QUESTION_STUDIO_QL_IDS.length, 13);
assert.equal(NUM_CP011_QUESTION_STUDIO_QL_IDS[0], "NUM-QL-213");
assert.equal(NUM_CP011_QUESTION_STUDIO_QL_IDS.at(-1), "NUM-QL-225");
assert.equal(new Set(NUM_CP011_QUESTION_STUDIO_QL_IDS).size, 13);

assert.equal(isNumCp011QuestionStudioRequest({ canonicalProblemId: "NUM-CP-011" }), true);
assert.equal(isNumCp011QuestionStudioRequest({ cpId: "NUM-CP-011" }), true);
assert.equal(isNumCp011QuestionStudioRequest({ patternId: "NUM-CP-011 valuation" }), true);
assert.equal(isNumCp011QuestionStudioRequest({ questionLanguageId: "NUM-QL-213" }), true);
assert.equal(isNumCp011QuestionStudioRequest({ questionLanguageId: "NUM-QL-225" }), true);
assert.equal(isNumCp011QuestionStudioRequest({ questionLanguageId: "NUM-QL-212" }), false);
assert.equal(isNumCp011QuestionStudioRequest({ packageId: "NUM-002" }), false, "CP011 must not steal package-only NUM-002 requests");

const capabilities = listNumCp011QuestionStudioPackages();
assert.equal(capabilities.length, 1);
const capability = capabilities[0]!;
assert.deepEqual(capability.cpIds, ["NUM-CP-011"]);
assert.equal(capability.permanentQlCount, 13);
assert.deepEqual(capability.permanentQlIds, NUM_CP011_QUESTION_STUDIO_QL_IDS);
assert.deepEqual(capability.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(capability.enabled, true);
assert.equal(capability.questionBankWritable, false);
assert.equal(capability.testEligible, false);
assert.equal(capability.publiclyPublishable, false);

const script = {
  hi: /[\u0900-\u097F]/u,
  pa: /[\u0A00-\u0A7F]/u,
} as const;

let generatedPackages = 0;
let answerBindings = 0;
let lifecycleChecks = 0;
let localizationChecks = 0;

for (const qlId of NUM_CP011_QUESTION_STUDIO_QL_IDS) {
  for (const language of NUM_CP011_QUESTION_STUDIO_LANGUAGES) {
    const result = await generateNumCp011QuestionStudioBatch({
      canonicalProblemId: "NUM-CP-011",
      questionLanguageId: qlId,
      language,
      seed: `cp011-qs-audit:${qlId}:${language}`,
      count: 3,
    });

    assert.equal(result.questionPackages.length, 3, `${qlId}/${language}: package count drift`);
    assert.equal(result.questions.length, 3, `${qlId}/${language}: preview count drift`);
    assert.equal(result.generationContext.packageId, "NUM-002");
    assert.equal(result.generationContext.canonicalProblemId, "NUM-CP-011");
    assert.equal(result.generationContext.language, language);
    assert.equal(result.generationContext.questionBankWritable, false);
    assert.equal(result.generationContext.testEligible, false);
    assert.equal(result.generationContext.publiclyPublishable, false);

    result.questionPackages.forEach((pkg, index) => {
      const label = `${qlId}/${language}/${index}`;
      assert.equal(pkg.packageId, "NUM-002", `${label}: package drift`);
      assert.equal(pkg.canonicalProblemId, "NUM-CP-011", `${label}: CP drift`);
      assert.equal(pkg.questionLanguageId, qlId, `${label}: QL drift`);
      assert.equal(pkg.language, language, `${label}: language drift`);
      assert.equal(pkg.options.length, 4, `${label}: option count drift`);
      assert.equal(pkg.options[pkg.correctIndex], pkg.answer, `${label}: correct-option/answer drift`);
      assert.equal(pkg.answer, pkg.verifierAnswer, `${label}: verifier drift`);
      assert.equal(pkg.optionMetadata[pkg.correctIndex]?.isCorrect, true, `${label}: correct metadata drift`);
      assert.equal(pkg.validation.ok, true, `${label}: validation drift`);
      assert.equal(pkg.validation.valid, true, `${label}: validation validity drift`);
      assert.equal(pkg.questionStudioDiscoverable, true, `${label}: Studio source not active`);
      assert.equal(pkg.questionBankWritable, false, `${label}: bank write opened`);
      assert.equal(pkg.testEligible, false, `${label}: test gate opened`);
      assert.equal(pkg.mockTestEligible, false, `${label}: mock gate opened`);
      assert.equal(pkg.publiclyPublishable, false, `${label}: public gate opened`);
      assert.equal(pkg.automaticStudentPublication, false, `${label}: automatic publication opened`);
      assert.equal(pkg.traceability.permanentQlId, qlId, `${label}: trace QL drift`);
      assert.equal(pkg.traceability.checkpointId, "NUM-CP-011", `${label}: trace CP drift`);
      assert.equal(pkg.traceability.questionBankWritable, false, `${label}: trace bank gate drift`);
      answerBindings += 1;
      lifecycleChecks += 1;

      const preview = result.questions[index]!;
      assert.equal(preview.questionLanguageId, qlId, `${label}: preview QL drift`);
      assert.equal(preview.canonicalProblemId, "NUM-CP-011", `${label}: preview CP drift`);
      assert.equal(preview.correctIndex, pkg.correctIndex, `${label}: preview correct index drift`);
      assert.equal(preview.answer, pkg.answer, `${label}: preview answer drift`);
      assert.equal(preview.questionBankWritable, false, `${label}: preview bank gate drift`);
      assert.equal(preview.testEligible, false, `${label}: preview test gate drift`);
      assert.equal(preview.publiclyPublishable, false, `${label}: preview public gate drift`);

      if (language === "hi" || language === "pa") {
        assert.match(pkg.stem, script[language], `${label}: native script missing`);
        assert.match(pkg.explanation.lines.join(" "), script[language], `${label}: localized explanation script missing`);
        localizationChecks += 1;
      }
      generatedPackages += 1;
    });
  }
}

assert.equal(generatedPackages, 13 * 3 * 3, "Expected 117 explicit-QL Question Studio packages");
assert.equal(answerBindings, generatedPackages);
assert.equal(lifecycleChecks, generatedPackages);
assert.equal(localizationChecks, 13 * 2 * 3);

const mixed = await generateNumCp011QuestionStudioBatch({
  canonicalProblemId: "NUM-CP-011",
  language: "en",
  seed: "cp011-question-studio-mixed-authority-sweep",
  count: 26,
});
assert.equal(mixed.questions.length, 26);
assert.equal(new Set(mixed.questionPackages.map((pkg) => pkg.questionLanguageId)).size, 13, "Unfiltered batch did not reach all 13 authorities");

await assert.rejects(
  () => generateNumCp011QuestionStudioBatch({ canonicalProblemId: "NUM-CP-011", questionLanguageId: "NUM-QL-212", count: 1 }),
  /not owned by NUM-CP-011/u,
);
await assert.rejects(
  () => generateNumCp011QuestionStudioBatch({ canonicalProblemId: "NUM-CP-010", questionLanguageId: "NUM-QL-213", count: 1 }),
  /cannot serve canonical problem NUM-CP-010/u,
);

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_QUESTION_STUDIO_INTEGRATION",
  permanentAuthorities: NUM_CP011_QUESTION_STUDIO_QL_IDS.length,
  languages: NUM_CP011_QUESTION_STUDIO_LANGUAGES,
  generatedPackages,
  answerBindings,
  lifecycleChecks,
  localizationChecks,
  mixedBatchAuthorityReach: 13,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
