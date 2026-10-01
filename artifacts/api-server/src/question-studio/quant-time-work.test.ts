import assert from "node:assert/strict";
import test from "node:test";

import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
} from "./engine-registry";
import { generateProfiledQuantBatch } from "./quant-exam-profile";
import { TMW_001_FINAL_FREEZE_AUTHORITY } from "../quant-v4/topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/final-freeze-authority";

test("TMW-001 shared capabilities preserve the frozen internal-only lifecycle", () => {
  const pkg = listQuestionStudioPackages().find((entry) => entry.packageId === "TMW-001");
  assert.ok(pkg);
  assert.equal(pkg!.engineId, "quant-v4");
  assert.equal(pkg!.cpIds.length, 14);
  assert.equal(pkg!.cpIds[0], "TMW-CP-001");
  assert.equal(pkg!.cpIds[13], "TMW-CP-014");
  assert.deepEqual(pkg!.supportedLanguages, ["en", "hi", "pa"]);
  assert.deepEqual(pkg!.supportedDifficulties, ["Easy", "Medium", "Hard"]);
  assert.equal(pkg!.questionBankStatus, "NOT_STORED");
  assert.equal(pkg!.questionBankWritable, false);
  assert.equal(pkg!.testEligibility, "INELIGIBLE");
  assert.equal(pkg!.testEligible, false);
  assert.equal(pkg!.mockTestEligible, false);
  assert.equal(pkg!.publiclyPublishable, false);
  assert.equal(pkg!.productionReleaseAuthorized, false);
  assert.equal(pkg!.metadata?.freezeStatus, TMW_001_FINAL_FREEZE_AUTHORITY.status);
  assert.equal(
    pkg!.metadata?.sourceAuthorityHead,
    TMW_001_FINAL_FREEZE_AUTHORITY.sourceAuthorityHead,
  );
  assert.equal(pkg!.metadata?.qlCount, 228);
});

test("TMW-001 CP013 keeps the frozen five-option Data Sufficiency shape", async () => {
  const result = await generateQuestionStudioQuestions({
    engineId: "quant-v4",
    packageId: "TMW-001",
    canonicalProblemId: "TMW-CP-013",
    questionLanguageId: "TMW-QL-216",
    difficulty: "Medium",
    language: "hi",
    seed: "tmw-unified:cp013:hi",
    count: 1,
  });

  assert.equal(result.engineId, "quant-v4");
  assert.equal(result.questions.length, 1);
  const question = result.questions[0] as Record<string, any>;
  assert.equal(question.packageId, "TMW-001");
  assert.equal(question.canonicalProblemId, "TMW-CP-013");
  assert.equal(question.questionLanguageId, "TMW-QL-216");
  assert.equal(question.language, "hi");
  assert.equal(question.options.length, 5);
  assert.equal(question.questionBankStatus, "NOT_STORED");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligibility, "INELIGIBLE");
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.publicReleaseAuthorized, false);
});

test("TMW-001 CP014 keeps structured caselet presentation", async () => {
  const result = await generateQuestionStudioQuestions({
    engineId: "quant-v4",
    packageId: "TMW-001",
    canonicalProblemId: "TMW-CP-014",
    questionLanguageId: "TMW-QL-227",
    difficulty: "Medium",
    language: "pa",
    seed: "tmw-unified:cp014:pa",
    count: 1,
  });

  const question = result.questions[0] as Record<string, any>;
  assert.ok(Array.isArray(question.presentationBlocks));
  assert.equal(question.caseletGroupId, "TMW-CASELET-001");
  assert.equal(question.language, "pa");
  assert.equal(question.publiclyPublishable, false);
});

test("profiled unified TMW keeps Banking five-option delivery without native-calibration claims", async () => {
  const batch = await generateProfiledQuantBatch({
    request: {
      engineId: "quant-v4",
      packageId: "TMW-001",
      exam: "IBPS PO Prelims",
      subject: "Quantitative Aptitude",
      difficulty: "Medium",
      language: "en",
      count: 2,
      seed: "tmw-unified:banking",
    },
    count: 2,
    selectedCpIds: ["TMW-CP-001"],
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
    assert.equal(question.packageId, "TMW-001");
    assert.equal(question.canonicalProblemId, "TMW-CP-001");
    assert.equal(question.options.length, 5);
    assert.equal(question.requestedExamProfile, "BANKING_PRELIMS");
    assert.equal(
      question.examProfileTransportStatus,
      "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING",
    );
    assert.equal(question.profileSelectionCalibrated, false);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.publiclyPublishable, false);
  }
});
