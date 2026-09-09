import { strict as assert } from "node:assert";
import {
  COM003_OFFICE_TABS_PACKAGE_ID_V1,
  COM003_OFFICE_TABS_REVIEW_ONLY_PACKAGE_V1,
  knowledgeV1Com003OfficeTabsQuestionStudioAdapterV1,
} from "./knowledge-v1-com003-office-tabs-adapter-v1";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";

const pkg = COM003_OFFICE_TABS_REVIEW_ONLY_PACKAGE_V1;
assert.equal(pkg.packageId, COM003_OFFICE_TABS_PACKAGE_ID_V1);
assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
assert.equal(pkg.questionBankStatus, "NOT_STORED");
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.manualApprovalRequired, true);
assert.deepEqual(pkg.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(pkg.supportedDifficulties, ["Easy", "Medium"]);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.productionReleaseAuthorized, false);
assert.equal(pkg.metadata?.englishQuestionCount, 152);
assert.equal(pkg.metadata?.hindiQuestionCount, 152);
assert.equal(pkg.metadata?.punjabiQuestionCount, 152);
assert.equal(pkg.metadata?.totalQuestionLanguageArtifacts, 456);
assert.equal(knowledgeV1QuestionStudioAdapter.listPackages().some((candidate) => candidate.packageId === COM003_OFFICE_TABS_PACKAGE_ID_V1), true);

const seed = "com003-office-tabs-parity-v1";
const results = await Promise.all([
  knowledgeV1Com003OfficeTabsQuestionStudioAdapterV1.generate({ packageId: COM003_OFFICE_TABS_PACKAGE_ID_V1, language: "en", runtimeMode: "review-only", difficulty: "Mixed", seed, count: 8 }),
  knowledgeV1Com003OfficeTabsQuestionStudioAdapterV1.generate({ packageId: COM003_OFFICE_TABS_PACKAGE_ID_V1, language: "hi", runtimeMode: "review-only", difficulty: "Mixed", seed, count: 8 }),
  knowledgeV1Com003OfficeTabsQuestionStudioAdapterV1.generate({ packageId: COM003_OFFICE_TABS_PACKAGE_ID_V1, language: "pa", runtimeMode: "review-only", difficulty: "Mixed", seed, count: 8 }),
]);

assert.deepEqual(results[0].questions.map((question: any) => `${question.sourceQuestionId}|${question.correctIndex}`), results[1].questions.map((question: any) => `${question.sourceQuestionId}|${question.correctIndex}`));
assert.deepEqual(results[0].questions.map((question: any) => `${question.sourceQuestionId}|${question.correctIndex}`), results[2].questions.map((question: any) => `${question.sourceQuestionId}|${question.correctIndex}`));
for (const result of results) {
  assert.equal(result.questions.length, 8);
  assert.equal(result.generationContext?.packageId, COM003_OFFICE_TABS_PACKAGE_ID_V1);
  assert.equal(result.generationContext?.stage, "REVIEW_ONLY");
  assert.equal(result.generationContext?.questionBankStatus, "NOT_STORED");
  assert.equal(result.generationContext?.questionBankWritable, false);
  assert.equal(result.generationContext?.testEligible, false);
  assert.equal(result.generationContext?.publiclyPublishable, false);
  assert.equal(result.generationContext?.productionReleaseAuthorized, false);
  for (const question of result.questions as any[]) {
    assert.equal(question.registrationStatus, "REVIEW_ONLY_CANDIDATE");
    assert.equal(question.readOnly, true);
    assert.notEqual(question.difficulty, "Hard");
  }
}

const excel = await knowledgeV1Com003OfficeTabsQuestionStudioAdapterV1.generate({ packageId: COM003_OFFICE_TABS_PACKAGE_ID_V1, patternId: "COM-003-QL-035", language: "en", runtimeMode: "review-only", seed: "excel-data", count: 8 });
assert.equal(excel.questions.length, 8);
assert.ok(excel.questions.every((question: any) => question.qlId === "COM-003-QL-035"));

const routed = await knowledgeV1QuestionStudioAdapter.generate({ packageId: "COM-003", patternId: "COM-003-QL-044", language: "en", runtimeMode: "review-only", seed: "ppt-animation", count: 1 });
assert.equal(routed.generationContext?.packageId, COM003_OFFICE_TABS_PACKAGE_ID_V1);
assert.equal((routed.questions[0] as any).qlId, "COM-003-QL-044");

await assert.rejects(() => knowledgeV1Com003OfficeTabsQuestionStudioAdapterV1.generate({ packageId: COM003_OFFICE_TABS_PACKAGE_ID_V1, language: "en", runtimeMode: "review-only", difficulty: "Hard", seed: "hard", count: 1 }), /Hard difficulty is not authorized/);
await assert.rejects(() => knowledgeV1Com003OfficeTabsQuestionStudioAdapterV1.generate({ packageId: COM003_OFFICE_TABS_PACKAGE_ID_V1, language: "en", runtimeMode: "review-only", seed: "too-many", count: 51 }), /count between 1 and 50/);
await assert.rejects(() => knowledgeV1Com003OfficeTabsQuestionStudioAdapterV1.generate({ packageId: COM003_OFFICE_TABS_PACKAGE_ID_V1, patternId: "COM-003-QL-035", language: "en", runtimeMode: "review-only", seed: "too-many", count: 9 }), /without repeats/);

console.log("[KNOWLEDGE-V1-COM003-OFFICE-TABS-ADAPTER-V1] PASS review-only Excel+PowerPoint parity=3 languages hard=disabled");
