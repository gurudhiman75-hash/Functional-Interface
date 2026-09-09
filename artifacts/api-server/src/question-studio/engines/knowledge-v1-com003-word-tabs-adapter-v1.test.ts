import { strict as assert } from "node:assert";
import {
  COM003_WORD_TABS_PACKAGE_ID_V1,
  COM003_WORD_TABS_REVIEW_ONLY_PACKAGE_V1,
  knowledgeV1Com003WordTabsQuestionStudioAdapterV1,
} from "./knowledge-v1-com003-word-tabs-adapter-v1";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";

const pkg = COM003_WORD_TABS_REVIEW_ONLY_PACKAGE_V1;
assert.equal(pkg.packageId, COM003_WORD_TABS_PACKAGE_ID_V1);
assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
assert.equal(pkg.questionBankStatus, "NOT_STORED");
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.questionBankAcceptanceMode, null);
assert.equal(pkg.manualApprovalRequired, true);
assert.deepEqual(pkg.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(pkg.supportedDifficulties, ["Easy", "Medium"]);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.productionReleaseAuthorized, false);
assert.equal(pkg.metadata?.reviewOnly, true);
assert.equal(pkg.metadata?.humanReviewApproved, false);
assert.equal(pkg.metadata?.englishQuestionCount, 80);
assert.equal(pkg.metadata?.hindiQuestionCount, 80);
assert.equal(pkg.metadata?.punjabiQuestionCount, 80);
assert.equal(pkg.metadata?.totalQuestionLanguageArtifacts, 240);
assert.equal(
  knowledgeV1QuestionStudioAdapter.listPackages().some((candidate) => candidate.packageId === COM003_WORD_TABS_PACKAGE_ID_V1),
  true,
);

const seed = "com003-word-tabs-parity-v1";
const results = await Promise.all([
  knowledgeV1Com003WordTabsQuestionStudioAdapterV1.generate({ packageId: COM003_WORD_TABS_PACKAGE_ID_V1, language: "en", runtimeMode: "review-only", difficulty: "Mixed", seed, count: 8 }),
  knowledgeV1Com003WordTabsQuestionStudioAdapterV1.generate({ packageId: COM003_WORD_TABS_PACKAGE_ID_V1, language: "hi", runtimeMode: "review-only", difficulty: "Mixed", seed, count: 8 }),
  knowledgeV1Com003WordTabsQuestionStudioAdapterV1.generate({ packageId: COM003_WORD_TABS_PACKAGE_ID_V1, language: "pa", runtimeMode: "review-only", difficulty: "Mixed", seed, count: 8 }),
]);

assert.deepEqual(
  results[0].questions.map((question: any) => `${question.sourceQuestionId}|${question.correctIndex}`),
  results[1].questions.map((question: any) => `${question.sourceQuestionId}|${question.correctIndex}`),
);
assert.deepEqual(
  results[0].questions.map((question: any) => `${question.sourceQuestionId}|${question.correctIndex}`),
  results[2].questions.map((question: any) => `${question.sourceQuestionId}|${question.correctIndex}`),
);

for (const result of results) {
  assert.equal(result.questions.length, 8);
  assert.equal(result.generationContext?.packageId, COM003_WORD_TABS_PACKAGE_ID_V1);
  assert.equal(result.generationContext?.stage, "REVIEW_ONLY");
  assert.equal(result.generationContext?.questionBankStatus, "NOT_STORED");
  assert.equal(result.generationContext?.questionBankWritable, false);
  assert.equal(result.generationContext?.questionBankAcceptanceMode, null);
  assert.equal(result.generationContext?.testEligible, false);
  assert.equal(result.generationContext?.mockTestEligible, false);
  assert.equal(result.generationContext?.publiclyPublishable, false);
  assert.equal(result.generationContext?.productionReleaseAuthorized, false);
  assert.equal(result.generationContext?.reviewOnly, true);
  assert.equal(result.generationContext?.humanReviewApproved, false);
  for (const question of result.questions as any[]) {
    assert.equal(question.registrationStatus, "REVIEW_ONLY_CANDIDATE");
    assert.equal(question.readOnly, true);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.notEqual(question.difficulty, "Hard");
  }
}

const insert = await knowledgeV1Com003WordTabsQuestionStudioAdapterV1.generate({
  packageId: COM003_WORD_TABS_PACKAGE_ID_V1,
  patternId: "COM-003-QL-022",
  language: "en",
  runtimeMode: "review-only",
  seed: "com003-word-tabs-insert-v1",
  count: 8,
});
assert.equal(insert.questions.length, 8);
assert.ok(insert.questions.every((question: any) => question.qlId === "COM-003-QL-022"));

const routed = await knowledgeV1QuestionStudioAdapter.generate({
  packageId: "COM-003",
  patternId: "COM-003-QL-022",
  language: "en",
  runtimeMode: "review-only",
  seed: "com003-word-tabs-routed-v1",
  count: 1,
});
assert.equal(routed.generationContext?.packageId, COM003_WORD_TABS_PACKAGE_ID_V1);
assert.equal((routed.questions[0] as any).qlId, "COM-003-QL-022");

await assert.rejects(
  knowledgeV1Com003WordTabsQuestionStudioAdapterV1.generate({ packageId: COM003_WORD_TABS_PACKAGE_ID_V1, language: "en", runtimeMode: "review-only", difficulty: "Hard", seed: "hard", count: 1 }),
  /Hard difficulty is not authorized/,
);
await assert.rejects(
  knowledgeV1Com003WordTabsQuestionStudioAdapterV1.generate({ packageId: COM003_WORD_TABS_PACKAGE_ID_V1, language: "en", runtimeMode: "review-only", seed: "too-many", count: 51 }),
  /count between 1 and 50/,
);
await assert.rejects(
  knowledgeV1Com003WordTabsQuestionStudioAdapterV1.generate({ packageId: COM003_WORD_TABS_PACKAGE_ID_V1, patternId: "COM-003-QL-022", language: "en", runtimeMode: "review-only", seed: "too-many", count: 9 }),
  /without repeats/,
);

console.log("[KNOWLEDGE-V1-COM003-WORD-TABS-ADAPTER-V1] PASS review-only parity=3 languages hard=disabled");
