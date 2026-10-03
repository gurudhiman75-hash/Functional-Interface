import assert from "node:assert/strict";
import test from "node:test";

import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
} from "./engine-registry";
import { generateProfiledQuantBatch } from "./quant-exam-profile";
import {
  isNum002Cp008To012EngineRequest,
} from "./quant-number-system-num002";

const ACTIVE_CPS = [
  "NUM-CP-008",
  "NUM-CP-009",
  "NUM-CP-010",
  "NUM-CP-011",
  "NUM-CP-012",
];

test("NUM-002 shared capabilities expose only unified CP008-CP012", () => {
  const pkg = listQuestionStudioPackages().find((entry) => entry.packageId === "NUM-002");
  assert.ok(pkg);
  assert.equal(pkg!.engineId, "quant-v4");
  assert.deepEqual(pkg!.cpIds, ACTIVE_CPS);
  assert.deepEqual(pkg!.supportedLanguages, ["en", "hi", "pa"]);
  assert.deepEqual(pkg!.supportedDifficulties, ["Easy", "Medium", "Hard"]);
  assert.equal(pkg!.difficultyFilterSupported, true);
  assert.equal(pkg!.lifecycleStage, "REVIEW_ONLY");
  assert.equal(pkg!.reviewSurfaceRequired, true);
  assert.equal(pkg!.manualApprovalRequired, true);
  assert.equal(pkg!.questionBankStatus, "NOT_STORED");
  assert.equal(pkg!.questionBankWritable, false);
  assert.equal(pkg!.testEligibility, "INELIGIBLE");
  assert.equal(pkg!.testEligible, false);
  assert.equal(pkg!.mockTestEligible, false);
  assert.equal(pkg!.publiclyPublishable, false);
  assert.equal(pkg!.automaticStudentPublication, false);
  assert.equal(pkg!.productionReleaseAuthorized, false);
  assert.equal(pkg!.metadata?.cp013Cp014CompatibilityDeferred, true);
});

test("NUM-002 package-only traffic is owned by unified CP008 fallback", () => {
  assert.equal(
    isNum002Cp008To012EngineRequest({
      engineId: "quant-v4",
      packageId: "NUM-002",
      language: "en",
      count: 1,
    }),
    true,
  );
});

test("NUM-CP-008 keeps frozen Hindi review lifecycle", async () => {
  const result = await generateQuestionStudioQuestions({
    engineId: "quant-v4",
    packageId: "NUM-002",
    canonicalProblemId: "NUM-CP-008",
    questionLanguageId: "NUM-QL-166",
    language: "hi",
    seed: "num002-unified:cp008:hi",
    count: 1,
  });

  assert.equal(result.questions.length, 1);
  const question = result.questions[0] as Record<string, any>;
  assert.equal(question.packageId, "NUM-002");
  assert.equal(question.canonicalProblemId, "NUM-CP-008");
  assert.equal(question.questionLanguageId, "NUM-QL-166");
  assert.equal(question.language, "hi");
  assert.equal(question.runtimeMode, "QUESTION_STUDIO_ACTIVE");
  assert.equal(question.reviewStatus, "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY");
  assert.equal(question.questionBankStatus, "NOT_STORED");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligibility, "INELIGIBLE");
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.automaticStudentPublication, false);
});

test("NUM-CP-012 keeps frozen Punjabi exam-depth runtime", async () => {
  const result = await generateQuestionStudioQuestions({
    engineId: "quant-v4",
    packageId: "NUM-002",
    canonicalProblemId: "NUM-CP-012",
    questionLanguageId: "NUM-QL-226",
    language: "pa",
    seed: "num002-unified:cp012:pa",
    count: 1,
  });

  const question = result.questions[0] as Record<string, any>;
  assert.equal(question.canonicalProblemId, "NUM-CP-012");
  assert.equal(question.questionLanguageId, "NUM-QL-226");
  assert.equal(question.language, "pa");
  assert.equal(question.reviewStatus, "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(
    question.explanationStandard,
    "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
  );
  assert.ok(question.examDepthProfile);
});

test("unified NUM-002 can generate CP008-CP012 in one multi-CP batch", async () => {
  const batch = await generateProfiledQuantBatch({
    request: {
      engineId: "quant-v4",
      packageId: "NUM-002",
      exam: "SSC CGL Tier 1",
      subject: "Quantitative Aptitude",
      difficulty: "Medium",
      language: "en",
      count: 5,
      seed: "num002-unified:multi-cp",
    },
    count: 5,
    selectedCpIds: ACTIVE_CPS,
    examProfileId: "SSC CGL Tier 1",
    difficultyFilterSupported: true,
    generateCandidateBatch: (request) =>
      generateQuestionStudioQuestions({
        ...request,
        engineId: "quant-v4",
      }),
  });

  assert.deepEqual(batch.plan.cpCounts, {
    "NUM-CP-008": 1,
    "NUM-CP-009": 1,
    "NUM-CP-010": 1,
    "NUM-CP-011": 1,
    "NUM-CP-012": 1,
  });
  assert.equal(batch.questions.length, 5);

  const seen = new Set(
    batch.questions.map((question) => String(question.canonicalProblemId)),
  );
  assert.deepEqual([...seen].sort(), [...ACTIVE_CPS].sort());

  for (const question of batch.questions as Array<Record<string, any>>) {
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.publiclyPublishable, false);
  }
});

test("CP013/014 and their permanent QLs remain outside unified NUM-002 slice", () => {
  for (const request of [
    { packageId: "NUM-002", canonicalProblemId: "NUM-CP-013" },
    { packageId: "NUM-002", canonicalProblemId: "NUM-CP-014" },
    { packageId: "NUM-002", questionLanguageId: "NUM-QL-237" },
    { packageId: "NUM-002", questionLanguageId: "NUM-QL-247" },
    { packageId: "NUM-002", questionLanguageId: "NUM-QL-248" },
    { packageId: "NUM-002", questionLanguageId: "NUM-QL-253" },
  ]) {
    assert.equal(
      isNum002Cp008To012EngineRequest({
        engineId: "quant-v4",
        language: "en",
        count: 1,
        ...request,
      }),
      false,
    );
  }
});
