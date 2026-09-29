import { strict as assert } from "node:assert";
import { knowledgeV1Whi003004QuestionStudioAdapterV1 } from "./knowledge-v1-whi003-004-adapter-v1";

async function run() {
  const packages = knowledgeV1Whi003004QuestionStudioAdapterV1.listPackages();
  assert.deepEqual(packages.map((pkg) => pkg.packageId), ["WHI-003", "WHI-004", "WHI-005"]);
  for (const pkg of packages) {
    assert.deepEqual(pkg.supportedLanguages, ["en", "hi", "pa"]);
    assert.equal(pkg.runtimeMode, "review-only");
    assert.equal(pkg.questionBankWritable, false);
    assert.equal(pkg.automaticStudentPublication, false);
    assert.equal(pkg.productionReleaseAuthorized, false);
    assert.equal(pkg.metadata!.localizationStatus, "REVIEW_REQUIRED");
    if (pkg.packageId === "WHI-005") {
      assert.equal(pkg.metadata!.authoringReviewApproved, false);
      assert.equal(pkg.metadata!.corpusStatus, "COMPLETE_PENDING_EDITORIAL_AND_LOCALIZATION_REVIEW");
    }
    for (const language of ["en", "hi", "pa"] as const) {
      const result = await knowledgeV1Whi003004QuestionStudioAdapterV1.generate({ packageId: pkg.packageId, language, count: 4, seed: `${pkg.packageId}-${language}-route` });
      assert.equal(result.questions.length, 4);
      assert.ok(result.questions.every((q) => q.language === language && q.cpId === pkg.cpIds[0]));
      assert.ok(result.questions.every((q) => q.reviewOnly === true && q.productionReleased === false));
      assert.equal(result.generationContext!.localizationStatus, "REVIEW_REQUIRED");
      assert.equal(result.generationContext!.studentPublicationAuthorized, false);
    }
  }
  for (const [packageId, questionId] of [["WHI-003", "WHI-CP003-Q001"], ["WHI-004", "WHI-CP004-Q060"], ["WHI-005", "WHI-CP005-Q060"]] as const) {
    const english = await knowledgeV1Whi003004QuestionStudioAdapterV1.generate({ packageId, language: "en", count: 1, questionLanguageId: questionId, seed: `${packageId}-selector` });
    assert.equal(english.questions[0]!.questionId, questionId);
    assert.equal(english.questions[0]!.factId, `${questionId.replace("-Q", "-F")}`);
    const punjabi = await knowledgeV1Whi003004QuestionStudioAdapterV1.generate({ packageId, language: "pa", count: 1, patternId: questionId, seed: `${packageId}-pa-selector` });
    assert.equal(punjabi.questions[0]!.sourceQuestionId, questionId);
    assert.equal(punjabi.questions[0]!.language, "pa");
    assert.equal(punjabi.questions[0]!.nativeLanguageProofreadingRequired, true);
  }
  for (const [difficulty, count] of [["Easy", 18], ["Medium", 30], ["Hard", 12]] as const) {
    const result = await knowledgeV1Whi003004QuestionStudioAdapterV1.generate({ packageId: "WHI-003", language: "en", difficulty, count, seed: `WHI-003-${difficulty}` });
    assert.equal(result.questions.length, count);
    assert.ok(result.questions.every((q) => q.difficulty === difficulty));
  }
  for (const [difficulty, count] of [["Easy", 18], ["Medium", 30], ["Hard", 12]] as const) {
    const result = await knowledgeV1Whi003004QuestionStudioAdapterV1.generate({ packageId: "WHI-005", language: "pa", difficulty, count, seed: `WHI-005-${difficulty}` });
    assert.equal(result.questions.length, count);
    assert.ok(result.questions.every((q) => q.difficulty === difficulty && q.language === "pa"));
    assert.ok(result.questions.every((q) => q.reviewOnly === true && q.productionReleased === false));
    assert.ok(result.questions.every((q) => q.authoringReviewApproved === false && q.nativeLanguageProofreadingRequired === true));
  }
  await assert.rejects(() => knowledgeV1Whi003004QuestionStudioAdapterV1.generate({ packageId: "WHI-003", runtimeMode: "production" as never }), /review-only/);
  console.log("[WHI-003/004] PASS English/Hindi/Punjabi Question Studio routes, selectors, difficulty filters and publication lock");
}
void run();
