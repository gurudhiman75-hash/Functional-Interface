import assert from "node:assert/strict";
import test from "node:test";

import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
} from "./engine-registry";
import { generateProfiledQuantBatch } from "./quant-exam-profile";

test("NUM-001 shared capabilities expose guarded CP001/003/004 review surface", () => {
  const pkg = listQuestionStudioPackages().find((entry) => entry.packageId === "NUM-001");
  assert.ok(pkg);
  assert.equal(pkg!.engineId, "quant-v4");
  assert.deepEqual(pkg!.cpIds, ["NUM-CP-001", "NUM-CP-003", "NUM-CP-004"]);
  assert.deepEqual(pkg!.supportedLanguages, ["en", "hi", "pa"]);
  assert.deepEqual(pkg!.supportedDifficulties, ["Easy", "Medium", "Hard"]);
  assert.equal(pkg!.lifecycleStage, "REVIEW_ONLY");
  assert.equal(pkg!.questionBankStatus, "NOT_STORED");
  assert.equal(pkg!.questionBankWritable, false);
  assert.equal(pkg!.testEligibility, "INELIGIBLE");
  assert.equal(pkg!.testEligible, false);
  assert.equal(pkg!.mockTestEligible, false);
  assert.equal(pkg!.publiclyPublishable, false);
  assert.equal(pkg!.automaticStudentPublication, false);
  assert.equal(pkg!.productionReleaseAuthorized, false);

  const policy = pkg!.metadata?.cpLanguagePolicy as Record<string, string[]>;
  assert.deepEqual(policy["NUM-CP-001"], ["en", "hi", "pa"]);
  assert.deepEqual(policy["NUM-CP-003"], ["en"]);
  assert.deepEqual(policy["NUM-CP-004"], ["en"]);
});

test("NUM-CP-001 keeps multilingual controlled-review runtime", async () => {
  const result = await generateQuestionStudioQuestions({
    engineId: "quant-v4",
    packageId: "NUM-001",
    canonicalProblemId: "NUM-CP-001",
    questionLanguageId: "NUM-QL-124",
    difficulty: "Medium",
    language: "pa",
    seed: "num001-unified:cp001:pa",
    count: 1,
  });

  assert.equal(result.questions.length, 1);
  const question = result.questions[0] as Record<string, any>;
  assert.equal(question.packageId, "NUM-001");
  assert.equal(question.canonicalProblemId, "NUM-CP-001");
  assert.equal(question.questionLanguageId, "NUM-QL-124");
  assert.equal(question.language, "pa");
  assert.equal(question.options.length, 4);
  assert.equal(question.runtimeMode, "QUESTION_STUDIO_ACTIVE");
  assert.equal(question.questionBankStatus, "NOT_STORED");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.publiclyPublishable, false);
});

test("NUM-CP-003/004 remain English-only", async () => {
  const english = await generateQuestionStudioQuestions({
    engineId: "quant-v4",
    packageId: "NUM-001",
    canonicalProblemId: "NUM-CP-003",
    questionLanguageId: "NUM-QL-001",
    difficulty: "Easy",
    language: "en",
    seed: "num001-unified:cp003:en",
    count: 1,
  });
  assert.equal((english.questions[0] as any).canonicalProblemId, "NUM-CP-003");
  assert.equal((english.questions[0] as any).language, "en");

  await assert.rejects(
    () => generateQuestionStudioQuestions({
      engineId: "quant-v4",
      packageId: "NUM-001",
      canonicalProblemId: "NUM-CP-003",
      questionLanguageId: "NUM-QL-001",
      difficulty: "Easy",
      language: "hi",
      seed: "num001-unified:cp003:hi-reject",
      count: 1,
    }),
    (error: any) => {
      assert.equal(error?.statusCode, 400);
      assert.equal(error?.code, "NUM001_REQUEST_INVALID");
      assert.match(String(error?.message), /Hindi\/Punjabi.*NUM-CP-001/u);
      return true;
    },
  );
});

test("NUM-001 unified profile planner can generate all active CPs in one batch", async () => {
  const batch = await generateProfiledQuantBatch({
    request: {
      engineId: "quant-v4",
      packageId: "NUM-001",
      exam: "SSC CGL Tier 1",
      subject: "Quantitative Aptitude",
      difficulty: "Medium",
      language: "en",
      count: 6,
      seed: "num001-unified:multi-cp",
    },
    count: 6,
    selectedCpIds: ["NUM-CP-001", "NUM-CP-003", "NUM-CP-004"],
    examProfileId: "SSC CGL Tier 1",
    forwardLegacyExamProfile: true,
    generateCandidateBatch: (request) =>
      generateQuestionStudioQuestions({
        ...request,
        engineId: "quant-v4",
      }),
  });

  assert.deepEqual(batch.plan.cpCounts, {
    "NUM-CP-001": 2,
    "NUM-CP-003": 2,
    "NUM-CP-004": 2,
  });
  assert.equal(batch.questions.length, 6);

  const counts = new Map<string, number>();
  for (const question of batch.questions as Array<Record<string, any>>) {
    const cpId = String(question.canonicalProblemId);
    counts.set(cpId, (counts.get(cpId) ?? 0) + 1);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.publiclyPublishable, false);
  }
  assert.equal(counts.get("NUM-CP-001"), 2);
  assert.equal(counts.get("NUM-CP-003"), 2);
  assert.equal(counts.get("NUM-CP-004"), 2);
});

test("NUM-002 QL ownership remains outside the NUM-001 adapter", async () => {
  await assert.rejects(
    () => generateQuestionStudioQuestions({
      engineId: "quant-v4",
      packageId: "NUM-001",
      questionLanguageId: "NUM-QL-166",
      difficulty: "Medium",
      language: "en",
      seed: "num001-unified:num002-ql-reject",
      count: 1,
    }),
    /NUM-QL-166/u,
  );
});
