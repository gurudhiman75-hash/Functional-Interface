import { strict as assert } from "node:assert";

import { knowledgeV1QuestionStudioAdapter } from "./engines/knowledge-v1-adapter";

const expectedPackageIds = [
  "COM-001",
  "COM-002",
  "COM-003",
  "COM-003-WORD-TABS",
  "COM-003-OFFICE-TABS",
  "COM-004",
  "COM-005",
  "COM-006",
  "COM-007",
  "COM-008",
] as const;

const packages = knowledgeV1QuestionStudioAdapter.listPackages();
const packageIds = packages.map((pkg) => pkg.packageId).sort();
assert.deepEqual(packageIds, [...expectedPackageIds].sort());
assert.equal(new Set(packageIds).size, expectedPackageIds.length);

for (const pkg of packages) {
  const reviewOnly = pkg.packageId === "COM-003-WORD-TABS" || pkg.packageId === "COM-003-OFFICE-TABS";
  assert.equal(pkg.engineId, "knowledge-v1");
  assert.equal(pkg.enabled, true);
  assert.deepEqual(pkg.supportedLanguages, ["en", "hi", "pa"]);
  assert.deepEqual(pkg.supportedDifficulties ?? pkg.metadata?.supportedDifficulties, ["Easy", "Medium"]);
  assert.equal(pkg.runtimeMode, "review-only");
  assert.equal(pkg.lifecycleStage, reviewOnly ? "REVIEW_ONLY" : "BANK_ONLY");
  assert.equal(pkg.manualApprovalRequired, true);
  assert.equal(pkg.questionBankStatus, reviewOnly ? "NOT_STORED" : "READY_FOR_STORAGE");
  assert.equal(pkg.questionBankWritable, reviewOnly ? false : true);
  assert.equal(pkg.questionBankAcceptanceMode, reviewOnly ? null : "BANK_ONLY");
  assert.equal(pkg.testEligible, false);
  assert.equal(pkg.mockTestEligible, false);
  assert.equal(pkg.publiclyPublishable, false);
  assert.equal(pkg.automaticStudentPublication, false);
  assert.equal(pkg.productionReleaseAuthorized, false);

  const generatedByLanguage = new Map<string, any[]>();

  for (const language of ["en", "hi", "pa"] as const) {
    const generated = await knowledgeV1QuestionStudioAdapter.generate({
      engineId: "knowledge-v1",
      packageId: pkg.packageId,
      language,
      runtimeMode: "review-only",
      difficulty: "Mixed",
      count: 2,
      seed: `computer-composite-v3-${pkg.packageId}`,
    });
    const questions = generated.questions as any[];
    generatedByLanguage.set(language, questions);

    assert.equal(questions.length, 2);
    assert.equal(generated.generationContext?.engineId, "knowledge-v1");
    assert.equal(generated.generationContext?.packageId, pkg.packageId);
    assert.equal(generated.generationContext?.runtimeMode, "review-only");
    assert.equal(generated.generationContext?.questionBankStatus, reviewOnly ? "NOT_STORED" : "READY_FOR_STORAGE");
    assert.equal(generated.generationContext?.questionBankWritable, reviewOnly ? false : true);
    assert.equal(generated.generationContext?.questionBankAcceptanceMode, reviewOnly ? null : "BANK_ONLY");
    assert.equal(generated.generationContext?.testEligible, false);
    assert.equal(generated.generationContext?.mockTestEligible, false);
    assert.equal(generated.generationContext?.publiclyPublishable, false);
    assert.equal(generated.generationContext?.productionReleaseAuthorized, false);
    assert.equal(reviewOnly ? generated.generationContext?.questionBankAcceptanceAuthority == null : generated.generationContext?.questionBankAcceptanceAuthority != null, true);

    for (const question of questions) {
      assert.equal(question.packageId, pkg.packageId);
      assert.equal(question.language, language);
      if (reviewOnly) {
        assert.equal(question.registrationStatus, "REVIEW_ONLY_CANDIDATE");
      } else if (pkg.packageId === "COM-001" || pkg.packageId === "COM-002") {
        assert.equal(question.registrationStatus ?? null, null);
      } else {
        assert.equal(question.registrationStatus, "REGISTERED_BANK_ONLY_INTERNAL");
      }
      assert.equal(question.questionBankStatus, reviewOnly ? "NOT_STORED" : "READY_FOR_STORAGE");
      assert.equal(question.questionBankWritable, reviewOnly ? false : true);
      assert.equal(question.questionBankAcceptanceMode, reviewOnly ? null : "BANK_ONLY");
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.productionReleaseAuthorized, false);
      if (pkg.packageId !== "COM-001" && pkg.packageId !== "COM-002") {
        assert.ok(String(question.sourceQuestionId ?? "").length > 0);
      }
      assert.ok(String(question.stem ?? "").trim().length > 0);
      assert.ok(String(question.explanation ?? "").trim().length > 0);
      assert.notEqual(question.difficulty, "Hard");
      assert.ok(
        !/^(In the following|Consider the following|Read the question carefully|Please select|Select the correct answer|Choose the correct answer|You are given the following)/i.test(
          String(question.stem ?? ""),
        ),
      );
    }

    await assert.rejects(
      () =>
        knowledgeV1QuestionStudioAdapter.generate({
          engineId: "knowledge-v1",
          packageId: pkg.packageId,
          language: "en",
          runtimeMode: "review-only",
          difficulty: "Hard",
          count: 1,
          seed: `computer-composite-v3-hard-${pkg.packageId}`,
        }),
    );
  }

  const english = generatedByLanguage.get("en")!;
  const hindi = generatedByLanguage.get("hi")!;
  const punjabi = generatedByLanguage.get("pa")!;
  const identity = (question: any) =>
    `${question.sourceQuestionId}|${question.correctIndex}`;
  assert.deepEqual(english.map(identity).sort(), hindi.map(identity).sort());
  assert.deepEqual(english.map(identity).sort(), punjabi.map(identity).sort());
}

console.log(
  "[COMPUTER-CONTENT-ENGINE-INTEGRATION-V3] PASS packages=COM-001..COM-008 + Office tab review packs languages=en,hi,pa release locks=active",
);
