import assert from "node:assert/strict";
import { generateLogicPuzzleQuestionStudioBatchV8, listLogicPuzzleQuestionStudioPackagesV8, LP_QUESTION_STUDIO_V8 } from "./question-studio-v8.ts";
import { LP_CP04_HI_PA_LOCALIZATION_FREEZE_V1 } from "./lp-cp04-localization-freeze-v1.ts";

assert.equal(LP_QUESTION_STUDIO_V8.cp04LocalizationAuthorityId, LP_CP04_HI_PA_LOCALIZATION_FREEZE_V1.authorityId);
assert.equal(LP_QUESTION_STUDIO_V8.localizationFreezeStatus, "FROZEN_THROUGH_LP_QL_047");
assert.equal(LP_QUESTION_STUDIO_V8.runtimeMode, "REVIEW_ONLY");

const pkg: any = listLogicPuzzleQuestionStudioPackagesV8().find((item: any) => item.id === "LP-CP04-COUNTERFACTUAL");
assert.ok(pkg);
assert.deepEqual(pkg.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(pkg.localizationFreezeStatus, "FROZEN_V1");

for (const language of ["hi", "pa"] as const) {
  const batch: any = await generateLogicPuzzleQuestionStudioBatchV8({ patternId: "LP-QL-047", language, count: 6, seed: `qs-v8-${language}` });
  assert.equal(batch.questions.length, 6);
  assert.equal(batch.generationContext.language, language);
  assert.equal(batch.generationContext.localizationFreezeStatus, "FROZEN_V1");
  assert.equal(batch.generationContext.questionBankWritable, false);
  for (const question of batch.questions) {
    assert.equal(question.patternId, "LP-QL-047");
    assert.equal(question.language, language);
    assert.equal(question.runtimeMode, "REVIEW_ONLY");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.metadata.localizationAuthorityId, LP_CP04_HI_PA_LOCALIZATION_FREEZE_V1.authorityId);
  }
}

console.log("Question Studio V8 LP-QL-047 Hindi/Punjabi routing passed; review-only gates remain closed.");
