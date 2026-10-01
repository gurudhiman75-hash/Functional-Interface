import assert from "node:assert/strict";
import test from "node:test";

import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
} from "./engine-registry";
import { generateProfiledQuantBatch } from "./quant-exam-profile";
import { SAP_BANKING_ENGINE_METADATA } from "./quant-sap-banking";

test("shared SAP capability remains the general multilingual package", () => {
  const pkg = listQuestionStudioPackages().find((entry) => entry.packageId === "SAP");
  assert.ok(pkg);
  assert.equal(pkg!.engineId, "quant-v4");
  assert.equal(pkg!.cpIds.length, 12);
  assert.deepEqual(pkg!.supportedLanguages, ["en", "hi", "pa"]);
  assert.deepEqual(pkg!.supportedDifficulties, ["Easy", "Medium", "Hard"]);

  assert.deepEqual(SAP_BANKING_ENGINE_METADATA.supportedExamProfiles, [
    "BANKING_PRELIMS",
    "BANKING_MAINS",
  ]);
  assert.equal(SAP_BANKING_ENGINE_METADATA.questionBankWritable, false);
  assert.equal(SAP_BANKING_ENGINE_METADATA.testEligible, false);
  assert.equal(SAP_BANKING_ENGINE_METADATA.publiclyPublishable, false);
});

async function generateBankingSap(input: {
  exam: string;
  examProfileId?: string;
  cpId?: string;
  language?: "en" | "hi" | "pa";
  seed: string;
}) {
  return generateProfiledQuantBatch({
    request: {
      engineId: "quant-v4",
      packageId: "SAP",
      exam: input.exam,
      subject: "Quantitative Aptitude",
      difficulty: "Medium",
      language: input.language ?? "en",
      count: 2,
      seed: input.seed,
    },
    count: 2,
    selectedCpIds: input.cpId ? [input.cpId] : [],
    examProfileId: input.examProfileId,
    forwardLegacyExamProfile: true,
    generateCandidateBatch: (request) =>
      generateQuestionStudioQuestions({
        ...request,
        engineId: "quant-v4",
      }),
  });
}

test("unified Banking SAP keeps five-option internal review delivery", async () => {
  const batch = await generateBankingSap({
    exam: "IBPS PO Prelims",
    cpId: "SAP-CP-001",
    seed: "sap-unified:banking:cp001",
  });

  assert.equal(batch.plan.legacyExamProfile, "BANKING_PRELIMS");
  assert.equal(batch.questions.length, 2);

  for (const question of batch.questions as Array<Record<string, any>>) {
    assert.equal(question.packageId, "SAP");
    assert.equal(question.canonicalProblemId, "SAP-CP-001");
    assert.equal(question.examProfile, "BANKING_PRELIMS");
    assert.equal(question.options.length, 5);
    assert.equal(question.options[4], "None of these");
    assert.notEqual(question.correctIndex, 4);
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

test("unified Banking SAP preserves profile-specific CP eligibility", async () => {
  await assert.rejects(
    () => generateQuestionStudioQuestions({
      engineId: "quant-v4",
      packageId: "SAP",
      examProfile: "BANKING_PRELIMS",
      canonicalProblemId: "SAP-CP-012",
      difficulty: "Hard",
      language: "en",
      seed: "sap-unified:prelims:cp012-reject",
      count: 1,
    }),
    (error: any) => {
      assert.equal(error?.statusCode, 400);
      assert.equal(error?.code, "SAP_BANKING_REQUEST_INVALID");
      assert.match(String(error?.message), /not eligible for BANKING_PRELIMS/u);
      return true;
    },
  );

  const mains = await generateQuestionStudioQuestions({
    engineId: "quant-v4",
    packageId: "SAP",
    examProfile: "BANKING_MAINS",
    canonicalProblemId: "SAP-CP-012",
    difficulty: "Hard",
    language: "en",
    seed: "sap-unified:mains:cp012",
    count: 1,
  });
  assert.equal(mains.questions.length, 1);
  assert.equal((mains.questions[0] as any).canonicalProblemId, "SAP-CP-012");
  assert.equal((mains.questions[0] as any).examProfile, "BANKING_MAINS");
});

test("unified Banking SAP preserves English-only guard as a client error", async () => {
  await assert.rejects(
    () => generateQuestionStudioQuestions({
      engineId: "quant-v4",
      packageId: "SAP",
      examProfile: "BANKING_PRELIMS",
      difficulty: "Medium",
      language: "hi",
      seed: "sap-unified:hindi-reject",
      count: 1,
    }),
    (error: any) => {
      assert.equal(error?.statusCode, 400);
      assert.equal(error?.code, "SAP_BANKING_REQUEST_INVALID");
      assert.match(String(error?.message), /English-only/u);
      return true;
    },
  );
});
