import assert from "node:assert/strict";
import {
  LP_011_HI_PA_LOCALIZATION_FREEZE_V1,
  LP_006_PROJECTION_HI_PA_LOCALIZATION_FREEZE_V1,
  LP_POST_046_LOCALIZATION_FREEZE_V1,
} from "./lp-post-046-localization-freeze-v1.ts";
import { generateLogicPuzzleQuestionStudioBatchV6, listLogicPuzzleQuestionStudioPackagesV6 } from "./question-studio-v6.ts";

assert.equal(LP_011_HI_PA_LOCALIZATION_FREEZE_V1.localizationFreezeStatus, "FROZEN");
assert.equal(LP_006_PROJECTION_HI_PA_LOCALIZATION_FREEZE_V1.localizationFreezeStatus, "FROZEN");
assert.deepEqual(LP_POST_046_LOCALIZATION_FREEZE_V1.permanentQlRange, ["LP-QL-041", "LP-QL-046"]);
assert.equal(LP_POST_046_LOCALIZATION_FREEZE_V1.productionEligible, false);

const packages = listLogicPuzzleQuestionStudioPackagesV6();
for (const id of ["LP-011", "LP-006-PROJECTION"]) {
  const pkg: any = packages.find((entry: any) => entry.id === id);
  assert.ok(pkg, `${id} missing from V6 package list`);
  assert.deepEqual(pkg.supportedLanguages, ["en", "hi", "pa"]);
  assert.equal(pkg.localizationFreezeStatus, "FROZEN_V1");
  assert.equal(pkg.questionBankWritable, false);
  assert.equal(pkg.testEligible, false);
  assert.equal(pkg.publiclyPublishable, false);
}

for (const language of ["hi", "pa"] as const) {
  const lp011: any = await generateLogicPuzzleQuestionStudioBatchV6({ packageId: "LP-011", language, seed: `freeze-lp011-${language}`, count: 2 });
  assert.equal(lp011.generationContext.localizationFreezeStatus, "FROZEN_V1");
  assert.equal(lp011.generationContext.localizationAuthorityId, LP_011_HI_PA_LOCALIZATION_FREEZE_V1.authorityId);
  assert.ok(lp011.questions.every((question: any) => question.metadata.localizationAuthorityId === LP_011_HI_PA_LOCALIZATION_FREEZE_V1.authorityId));
  assert.ok(lp011.questions.every((question: any) => question.questionBankWritable === false && question.testEligible === false && question.publiclyPublishable === false));

  const projection: any = await generateLogicPuzzleQuestionStudioBatchV6({ canonicalProblemId: "LP-QL-045", language, seed: `freeze-projection-${language}`, count: 2 });
  assert.equal(projection.generationContext.localizationFreezeStatus, "FROZEN_V1");
  assert.equal(projection.generationContext.localizationAuthorityId, LP_006_PROJECTION_HI_PA_LOCALIZATION_FREEZE_V1.authorityId);
  assert.ok(projection.questions.every((question: any) => question.metadata.localizationAuthorityId === LP_006_PROJECTION_HI_PA_LOCALIZATION_FREEZE_V1.authorityId));
  assert.ok(projection.questions.every((question: any) => question.questionBankWritable === false && question.testEligible === false && question.publiclyPublishable === false));
}

console.log("Post-046 localization freeze V1 passed for LP-011 and LP-006 projections; Question Studio remains review-only.");
