import assert from "node:assert/strict";
import test from "node:test";

import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
} from "./engine-registry";
import { generateProfiledQuantBatch } from "./quant-exam-profile";

test("SAP shared capabilities expose the localized writable chapter and banking metadata", () => {
  const pkg = listQuestionStudioPackages().find((entry) => entry.packageId === "SAP");
  assert.ok(pkg);
  assert.equal(pkg!.engineId, "quant-v4");
  assert.equal(pkg!.cpIds.length, 12);
  assert.equal(pkg!.cpIds[0], "SAP-CP-001");
  assert.equal(pkg!.cpIds[11], "SAP-CP-012");
  assert.deepEqual(pkg!.supportedLanguages, ["en", "hi", "pa"]);
  assert.deepEqual(pkg!.supportedDifficulties, ["Easy", "Medium", "Hard"]);
  assert.equal(pkg!.questionBankStatus, "WRITABLE");
  assert.equal(pkg!.questionBankWritable, true);
  assert.equal(pkg!.testEligibility, "ELIGIBLE");
  assert.equal(pkg!.testEligible, true);
  assert.equal(pkg!.publiclyPublishable, true);
  assert.equal(pkg!.metadata?.qlCount, 211);
  assert.deepEqual(pkg!.metadata?.supportedExamProfiles, [
    "GENERIC_PRACTICE",
    "BANKING_PRELIMS",
    "BANKING_MAINS",
  ]);
  assert.equal(pkg!.metadata?.bankingSpeedEnglishOnly, true);
});

test("normal SAP keeps approved Hindi localization writable and eligible", async () => {
  const result = await generateQuestionStudioQuestions({
    engineId: "quant-v4",
    packageId: "SAP",
    canonicalProblemId: "SAP-CP-001",
    difficulty: "Easy",
    language: "hi",
    seed: "sap-unified:normal-hi",
    count: 1,
  });

  assert.equal(result.questions.length, 1);
  const question = result.questions[0] as Record<string, any>;
  assert.equal(question.packageId, "SAP");
  assert.equal(question.canonicalProblemId, "SAP-CP-001");
  assert.equal(question.language, "hi");
  assert.equal(question.options.length, 4);
  assert.equal(question.questionBankStatus, "WRITABLE");
  assert.equal(question.questionBankWritable, true);
  assert.equal(question.testEligibility, "ELIGIBLE");
  assert.equal(question.testEligible, true);
  assert.equal(question.publiclyPublishable, true);
  assert.equal((result.generationContext as Record<string, any>).questionBankStatus, "WRITABLE");
});

test("Banking Prelims SAP stays English-only five-option and review-locked", async () => {
  const batch = await generateProfiledQuantBatch({
    request: {
      engineId: "quant-v4",
      packageId: "SAP",
      exam: "IBPS PO Prelims",
      subject: "Quantitative Aptitude",
      difficulty: "Medium",
      language: "en",
      count: 2,
      seed: "sap-unified:banking-prelims",
    },
    count: 2,
    selectedCpIds: ["SAP-CP-001"],
    examProfileId: "IBPS PO Prelims",
    forwardLegacyExamProfile: true,
    generateCandidateBatch: (request) =>
      generateQuestionStudioQuestions({
        ...request,
        engineId: "quant-v4",
      }),
  });

  assert.equal(batch.plan.legacyExamProfile, "BANKING_PRELIMS");
  assert.equal(batch.questions.length, 2);
  for (const question of batch.questions as Array<Record<string, any>>) {
    assert.equal(question.packageId, "SAP");
    assert.equal(question.options.length, 5);
    assert.equal(question.runtimeMode, "SAP_BANKING_SPEED_PROFILE_V1");
    assert.equal(question.reviewStatus, "BANKING_SPEED_PROFILE_REVIEW_ONLY");
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligibility, "INELIGIBLE");
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
  }
});

test("Banking SAP rejects Hindi/Punjabi at the speed-profile checkpoint", async () => {
  await assert.rejects(
    () => generateProfiledQuantBatch({
      request: {
        engineId: "quant-v4",
        packageId: "SAP",
        exam: "IBPS PO Prelims",
        subject: "Quantitative Aptitude",
        difficulty: "Medium",
        language: "hi",
        count: 1,
        seed: "sap-unified:banking-hi-reject",
      },
      count: 1,
      selectedCpIds: ["SAP-CP-001"],
      examProfileId: "IBPS PO Prelims",
      forwardLegacyExamProfile: true,
      generateCandidateBatch: (request) =>
        generateQuestionStudioQuestions({
          ...request,
          engineId: "quant-v4",
        }),
    }),
    /English-only/i,
  );
});
