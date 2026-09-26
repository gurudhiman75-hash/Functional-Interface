import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
} from "../../../../question-studio/engine-registry";
import {
  RNK001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V2,
  RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2,
  generateRnk001QuestionStudioBatch,
  isRnk001QuestionStudioRequest,
} from "./rnk-001-question-studio-integration-v2";
import { RNK_001_CHAPTER_AUTHORITY } from "./manifest";

function source(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

function assertReviewOnly(question: Record<string, any>) {
  assert.equal(question.packageId, "RNK-001");
  assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(question.questionBankStatus, "NOT_STORED");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligibility, "INELIGIBLE");
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.automaticStudentPublication, false);
  assert.equal(question.productionReleaseAuthorized, false);
  assert.equal(question.manualApprovalRequired, true);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.readOnly, true);
}

assert.equal(RNK_001_CHAPTER_AUTHORITY.permanentQlCount, 42);
assert.equal(RNK_001_CHAPTER_AUTHORITY.permanentQlRange, "RNK-QL-001..042");
assert.equal(RNK_001_CHAPTER_AUTHORITY.permanentQlIds.length, 42);
assert.equal(new Set(RNK_001_CHAPTER_AUTHORITY.permanentQlIds).size, 42);
assert.equal(RNK_001_CHAPTER_AUTHORITY.permanentQlIds[0], "RNK-QL-001");
assert.equal(RNK_001_CHAPTER_AUTHORITY.permanentQlIds[41], "RNK-QL-042");
assert.equal(RNK_001_CHAPTER_AUTHORITY.ql043Allocated, false);
assert.deepEqual([...RNK_001_CHAPTER_AUTHORITY.supportedLanguages], ["en", "hi", "pa"]);
assert.equal(RNK_001_CHAPTER_AUTHORITY.multilingualContentFrozen, true);
assert.equal(RNK_001_CHAPTER_AUTHORITY.hindiContentApproved, true);
assert.equal(RNK_001_CHAPTER_AUTHORITY.punjabiContentApproved, true);

assert.equal(RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.engineId, "reasoning-v1");
assert.equal(RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.packageId, "RNK-001");
assert.equal(RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.enabled, true);
assert.deepEqual(RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.cpIds, [
  "RNK-CP-001", "RNK-CP-002", "RNK-CP-003", "RNK-CP-004",
  "RNK-CP-005", "RNK-CP-006", "RNK-CP-007", "RNK-CP-008",
]);
assert.deepEqual(RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.questionBankWritable, false);
assert.equal(RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.testEligible, false);
assert.equal(RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.mockTestEligible, false);
assert.equal(RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.publiclyPublishable, false);
assert.equal(RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.productionReleaseAuthorized, false);
assert.equal(RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.metadata?.permanentQlCount, 42);
assert.equal(RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.metadata?.ql043Allocated, false);
assert.equal(RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2.metadata?.multilingualContentFrozen, true);

assert.equal(isRnk001QuestionStudioRequest({ packageId: "RNK-001" }), true);
assert.equal(isRnk001QuestionStudioRequest({ canonicalProblemId: "RNK-QL-042" }), true);
assert.equal(isRnk001QuestionStudioRequest({ patternId: "RNK-CP-005" }), true);
assert.equal(isRnk001QuestionStudioRequest({ topic: "Ranking & Order" }), true);
assert.equal(isRnk001QuestionStudioRequest({ packageId: "DIR-001" }), false);

const reasoningAdapterSource = source("src/question-studio/engines/reasoning-v1-adapter.ts");
assert.match(reasoningAdapterSource, /RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2/u);
assert.match(reasoningAdapterSource, /isRnk001QuestionStudioRequest\(request\)/u);
assert.match(reasoningAdapterSource, /generateRnk001QuestionStudioBatch\(request\)/u);

const packages = listQuestionStudioPackages();
const rnkPackage = packages.find((entry) => entry.packageId === "RNK-001");
assert.ok(rnkPackage, "RNK-001 must be globally discoverable through the current Question Studio registry");
assert.equal(rnkPackage?.engineId, "reasoning-v1");
assert.equal(rnkPackage?.enabled, true);
assert.equal(rnkPackage?.questionBankWritable, false);

const allEnglish = await generateRnk001QuestionStudioBatch({
  packageId: "RNK-001",
  language: "en",
  count: 42,
  seed: "rnk-wave01-all-english",
});
assert.equal(allEnglish.questions.length, 42);
assert.deepEqual(
  [...new Set((allEnglish.questions as Array<Record<string, any>>).map((question) => question.qlId))].sort(),
  RNK_001_CHAPTER_AUTHORITY.permanentQlIds,
);
for (const question of allEnglish.questions as Array<Record<string, any>>) {
  assert.equal(question.options.length >= 4, true);
  assert.equal(new Set(question.options).size, question.options.length);
  assert.equal(question.correctIndex >= 0 && question.correctIndex < question.options.length, true);
  assert.equal(question.validation.valid, true);
  assertReviewOnly(question);
}

for (const language of ["en", "hi", "pa"] as const) {
  for (const qlId of RNK_001_CHAPTER_AUTHORITY.permanentQlIds) {
    const generated = await generateRnk001QuestionStudioBatch({
      packageId: "RNK-001",
      canonicalProblemId: qlId,
      language,
      count: 1,
      seed: `rnk-wave01:${language}:${qlId}`,
    });
    const question = generated.questions[0] as Record<string, any>;
    assert.equal(question.qlId, qlId);
    assert.equal(question.language, language);
    assert.equal(question.options.length >= 4, true);
    assert.equal(new Set(question.options).size, question.options.length);
    assert.equal(question.correctIndex >= 0 && question.correctIndex < question.options.length, true);
    assert.equal(question.validation.valid, true);
    if (language === "hi") assert.match(String(question.stem), /[ऀ-ॿ]/u);
    if (language === "pa") assert.match(String(question.stem), /[਀-੿]/u);
    assertReviewOnly(question);
  }
}

const cp005 = await generateRnk001QuestionStudioBatch({
  packageId: "RNK-001",
  canonicalProblemId: "RNK-CP-005",
  language: "en",
  count: 6,
  seed: "rnk-wave01-cp005",
});
assert.ok((cp005.questions as Array<Record<string, any>>).every((question) => question.checkpointId === "RNK-CP-005"));

await assert.rejects(
  () => generateRnk001QuestionStudioBatch({
    packageId: "RNK-001",
    canonicalProblemId: "RNK-CP-008",
    language: "en",
    count: 1,
    seed: "rnk-wave01-cp008-no-ql",
  }),
  /owns no permanent QL/u,
);

const banking = await generateQuestionStudioQuestions({
  packageId: "RNK-001",
  canonicalProblemId: "RNK-QL-001",
  language: "pa",
  exam: "IBPS PO Prelims",
  count: 1,
  seed: "rnk-wave01-banking-pa",
});
const bankingQuestion = banking.questions[0] as Record<string, any>;
assert.equal(banking.engineId, "reasoning-v1");
assert.equal(bankingQuestion.options.length, 5);
assert.equal(bankingQuestion.examProfile, "IBPS_PO_PRE");
assert.match(String(bankingQuestion.stem), /[਀-੿]/u);
assertReviewOnly(bankingQuestion);

const replayA = await generateRnk001QuestionStudioBatch({
  packageId: "RNK-001",
  canonicalProblemId: "RNK-QL-020",
  language: "hi",
  difficulty: "Medium",
  count: 2,
  seed: "rnk-wave01-replay",
});
const replayB = await generateRnk001QuestionStudioBatch({
  packageId: "RNK-001",
  canonicalProblemId: "RNK-QL-020",
  language: "hi",
  difficulty: "Medium",
  count: 2,
  seed: "rnk-wave01-replay",
});
assert.deepEqual(replayB, replayA, "RNK recovered generation must remain deterministic");

const context = banking.generationContext as Record<string, any>;
assert.equal(context.packageId, "RNK-001");
assert.equal(context.permanentQlCount, 42);
assert.equal(context.ql043Allocated, false);
assert.equal(context.questionBankWritable, false);
assert.equal(context.testEligible, false);
assert.equal(context.mockTestEligible, false);
assert.equal(context.publiclyPublishable, false);
assert.equal(context.productionReleaseAuthorized, false);

console.log(JSON.stringify({
  verdict: "PASS_RNK_001_FINAL_AUDIT_WAVE_01_RECOVERY_AND_CURRENT_INTEGRATION",
  authority: RNK001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V2,
  permanentQlCount: 42,
  ql043Allocated: false,
  languages: ["en", "hi", "pa"],
  lifecycle: "REVIEW_ONLY",
  chapterCoverageSamples: 42,
  trilingualQlSamples: 126,
  currentQuestionStudioRegistry: "BOUND",
}, null, 2));
