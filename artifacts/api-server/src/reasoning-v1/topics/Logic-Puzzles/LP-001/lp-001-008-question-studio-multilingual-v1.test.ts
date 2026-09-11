import assert from "node:assert/strict";
import { LP_001_008_HI_PA_LOCALIZATION_APPROVAL_V4 } from "./lp-001-008-localization-approval-v4.ts";
import { LP_001_008_HI_PA_LOCALIZATION_FREEZE_V4, LP_001_008_PACKAGE_QL_IDS } from "./lp-001-008-localization-freeze-v4.ts";
import { LP_001_008_MULTILINGUAL_QUESTION_STUDIO_V1 } from "./lp-001-008-question-studio-multilingual-v1.ts";
import { generateLogicPuzzleQuestionStudioBatch, listLogicPuzzleQuestionStudioPackages } from "./question-studio.ts";

assert.equal(LP_001_008_HI_PA_LOCALIZATION_APPROVAL_V4.approvalStatus, "PRODUCT_OWNER_APPROVED");
assert.equal(LP_001_008_HI_PA_LOCALIZATION_FREEZE_V4.localizationFreezeStatus, "FROZEN_V4");
assert.equal(LP_001_008_MULTILINGUAL_QUESTION_STUDIO_V1.status, "REVIEW_ONLY_MULTILINGUAL_ACTIVE");
assert.deepEqual(LP_001_008_MULTILINGUAL_QUESTION_STUDIO_V1.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(LP_001_008_MULTILINGUAL_QUESTION_STUDIO_V1.permanentQlCount, 32);

const packages = listLogicPuzzleQuestionStudioPackages();
for (const packageId of Object.keys(LP_001_008_PACKAGE_QL_IDS) as Array<keyof typeof LP_001_008_PACKAGE_QL_IDS>) {
  const packageEntry = packages.find((entry) => entry.packageId === packageId);
  assert.ok(packageEntry, `Missing ${packageId} from Question Studio package list`);
  assert.deepEqual(packageEntry.supportedLanguages, ["en", "hi", "pa"], `${packageId}: multilingual capability missing`);
  assert.equal(packageEntry.permanentQlCount, 4, `${packageId}: permanent QL count`);
  assert.deepEqual(packageEntry.permanentQlIds, [...LP_001_008_PACKAGE_QL_IDS[packageId]], `${packageId}: permanent QLs`);
  assert.equal(packageEntry.permanentQlAllocationStatus, "ALLOCATED");
  assert.equal(packageEntry.localizationFreezeStatus, "FROZEN_V4");
  assert.equal(packageEntry.questionStudioLanguageActivation, "ACTIVE_REVIEW_ONLY");
  assert.equal(packageEntry.runtimeMode, "REVIEW_ONLY");
  assert.equal(packageEntry.questionBankWritable, false);
  assert.equal(packageEntry.testEligible, false);
  assert.equal(packageEntry.mockTestEligible, false);
  assert.equal(packageEntry.publiclyPublishable, false);

  const seed = `lp001-008-question-studio-v1:${packageId}`;
  const english = await generateLogicPuzzleQuestionStudioBatch({ packageId, language: "en", seed, count: 2 });
  const hindi = await generateLogicPuzzleQuestionStudioBatch({ packageId, language: "hi", seed, count: 2 });
  const punjabi = await generateLogicPuzzleQuestionStudioBatch({ packageId, language: "pa", seed, count: 2 });

  for (const [language, result] of [["en", english], ["hi", hindi], ["pa", punjabi]] as const) {
    assert.equal(result.questions.length, 8, `${packageId}/${language}: expected eight child questions`);
    assert.equal(result.generationContext.packageId, packageId);
    assert.equal(result.generationContext.language, language);
    assert.equal(result.generationContext.permanentQlCount, 4);
    assert.deepEqual(result.generationContext.permanentQlIds, [...LP_001_008_PACKAGE_QL_IDS[packageId]]);
    assert.equal(result.generationContext.localizationFreezeStatus, "FROZEN_V4");
    assert.equal(result.generationContext.questionStudioLanguageActivation, "ACTIVE_REVIEW_ONLY");
    assert.equal(result.generationContext.questionBankWritable, false);
    assert.equal(result.generationContext.testEligible, false);
    assert.equal(result.generationContext.mockTestEligible, false);
    assert.equal(result.generationContext.publiclyPublishable, false);

    for (const question of result.questions) {
      assert.equal(question.packageId, packageId);
      assert.equal(question.language, language);
      assert.equal(question.answer, question.options[question.correctIndex]);
      assert.equal(question.runtimeMode, "REVIEW_ONLY");
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.match(question.questionLanguageId, new RegExp(`-${language.toUpperCase()}$`, "u"));
      assert.match(question.text, /Clues:\n/u, `${packageId}/${language}: standalone Question Studio text must include clues`);
      assert.ok(question.packageExplanation.lines.some((line) => line.includes("|---")), `${packageId}/${language}: progressive/final table missing`);
    }
  }

  assert.ok(hindi.questions.every((question) => /[\u0900-\u097F]/u.test(question.text)), `${packageId}: Hindi learner copy missing`);
  assert.ok(punjabi.questions.every((question) => /[\u0A00-\u0A7F]/u.test(question.text)), `${packageId}: Punjabi learner copy missing`);

  const englishById = new Map(english.questions.map((question) => [question.questionId, question]));
  for (const localized of [...hindi.questions, ...punjabi.questions]) {
    const source = englishById.get(localized.questionId);
    assert.ok(source, `${packageId}: missing English source for ${localized.questionId}`);
    assert.equal(localized.patternId, source.patternId);
    assert.equal(localized.difficulty, source.difficulty);
    assert.equal(localized.correctIndex, source.correctIndex);
    assert.deepEqual(localized.logic.assignment, source.logic.assignment);
  }
}

const hindiAlias = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-001", language: "Hindi", seed: "lp001-hi-alias", count: 1 });
const punjabiAlias = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-008", language: "Punjabi", seed: "lp008-pa-alias", count: 1 });
assert.equal(hindiAlias.generationContext.language, "hi");
assert.equal(punjabiAlias.generationContext.language, "pa");

await assert.rejects(
  () => generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-004", language: "fr", count: 1 }),
  /LP-001 through LP-008 do not support Question Studio language/u,
);

console.log("LP-001..008 multilingual Question Studio V1 passed: approved V4 localization frozen, en/hi/pa activated review-only, standalone stems complete, QLs 001-032 permanent and semantic parity preserved.");
