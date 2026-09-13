import assert from "node:assert/strict";
import { generateLogicPuzzleQuestionStudioBatchV7, isLogicPuzzleQuestionStudioRequestV7, listLogicPuzzleQuestionStudioPackagesV7, LP_QUESTION_STUDIO_V7 } from "./question-studio-v7.ts";

assert.equal(LP_QUESTION_STUDIO_V7.permanentQlRange, "LP-QL-001..LP-QL-047");
assert.equal(LP_QUESTION_STUDIO_V7.runtimeMode, "REVIEW_ONLY");
assert.equal(LP_QUESTION_STUDIO_V7.questionBankWritable, false);
assert.equal(LP_QUESTION_STUDIO_V7.testEligible, false);
assert.equal(LP_QUESTION_STUDIO_V7.publiclyPublishable, false);

assert.equal(isLogicPuzzleQuestionStudioRequestV7({ patternId: "LP-QL-047" }), true);
assert.equal(isLogicPuzzleQuestionStudioRequestV7({ cpId: "LP-CP-012" }), true);
assert.equal(isLogicPuzzleQuestionStudioRequestV7({ canonicalProblemId: "LP-CP04-COUNTERFACTUAL" }), true);

const packages = listLogicPuzzleQuestionStudioPackagesV7();
const cp04 = packages.find((pkg: any) => pkg.id === "LP-CP04-COUNTERFACTUAL");
assert.ok(cp04);
assert.deepEqual(cp04.permanentQlIds, ["LP-QL-047"]);
assert.deepEqual(cp04.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.deepEqual(cp04.supportedLanguages, ["en"]);
assert.equal(cp04.englishFreezeStatus, "FROZEN_V1");
assert.equal(cp04.localizationFreezeStatus, "PENDING");
assert.equal(cp04.questionBankWritable, false);

const batch: any = await generateLogicPuzzleQuestionStudioBatchV7({ patternId: "LP-QL-047", language: "en", count: 9, seed: "question-studio-v7-proof" });
assert.equal(batch.questions.length, 9);
assert.equal(batch.generationContext.packageId, "LP-CP04-COUNTERFACTUAL");
assert.equal(batch.generationContext.permanentQlAllocationStatus, "ALLOCATED");
assert.equal(batch.generationContext.englishFreezeStatus, "FROZEN_V1");
assert.equal(batch.generationContext.localizationFreezeStatus, "PENDING");
assert.equal(batch.generationContext.questionBankWritable, false);
assert.equal(batch.generationContext.testEligible, false);
assert.equal(batch.generationContext.publiclyPublishable, false);

const difficultyCounts = new Map<string, number>();
const topologies = new Set<string>();
for (const question of batch.questions) {
  assert.equal(question.patternId, "LP-QL-047");
  assert.equal(question.canonicalProblemId, "LP-QL-047");
  assert.equal(question.packageId, "LP-CP04-COUNTERFACTUAL");
  assert.equal(question.language, "en");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.traceability.englishFreezeAuthorityId, LP_QUESTION_STUDIO_V7.cp04EnglishAuthorityId);
  assert.equal(question.metadata.localizationStatus, "PENDING");
  difficultyCounts.set(question.difficulty, (difficultyCounts.get(question.difficulty) ?? 0) + 1);
  topologies.add(question.parentTopology);
}
assert.deepEqual(difficultyCounts, new Map([["Easy", 3], ["Medium", 3], ["Hard", 3]]));
assert.deepEqual(topologies, new Set(["LP-001_GROUPING", "LP-004_COMMITTEE_SELECTION"]));

await assert.rejects(
  () => generateLogicPuzzleQuestionStudioBatchV7({ patternId: "LP-QL-047", language: "hi", count: 1 }),
  /English only/u,
);

console.log("Question Studio V7 passed: LP-QL-047 English review routing active across Easy/Medium/Hard; localization and production gates remain closed.");
