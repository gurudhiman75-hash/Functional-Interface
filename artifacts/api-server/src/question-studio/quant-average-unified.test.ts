import assert from "node:assert/strict";
import test from "node:test";

import { generateQuestionStudioQuestions } from "./engine-registry";
import {
  generateProfiledQuantBatch,
  resolveLegacyQuantExamProfile,
} from "./quant-exam-profile";

test("legacy Quant profile mapping preserves the former Average route semantics", () => {
  assert.equal(resolveLegacyQuantExamProfile("IBPS PO Prelims", undefined), "BANKING_PRELIMS");
  assert.equal(resolveLegacyQuantExamProfile("BANKING_MAINS", undefined), "BANKING_MAINS");
  assert.equal(resolveLegacyQuantExamProfile(undefined, "PSSSB Clerk"), "PUNJAB_STATE");
  assert.equal(resolveLegacyQuantExamProfile(undefined, "SSC CHSL Tier 1"), "SSC_CGL_CHSL");
  assert.equal(resolveLegacyQuantExamProfile(undefined, "SSC CGL Tier 1"), "SSC_CGL_TIER_I");
  assert.equal(resolveLegacyQuantExamProfile(undefined, "SSC CGL"), undefined);
});

async function generateAverage(input: {
  exam: string;
  examProfileId?: string;
  seed: string;
}) {
  return generateProfiledQuantBatch({
    request: {
      engineId: "quant-v4",
      packageId: "AVG-001",
      exam: input.exam,
      subject: "Quantitative Aptitude",
      difficulty: "Medium",
      language: "en",
      count: 2,
      seed: input.seed,
    },
    count: 2,
    selectedCpIds: ["AVG-CP-001"],
    examProfileId: input.examProfileId,
    forwardLegacyExamProfile: true,
    generateCandidateBatch: (request) =>
      generateQuestionStudioQuestions({
        ...request,
        engineId: "quant-v4",
      }),
  });
}

test("unified AVG-001 keeps Banking five-option delivery", async () => {
  const batch = await generateAverage({
    exam: "IBPS PO Prelims",
    seed: "avg-unified:banking",
  });

  assert.equal(batch.plan.legacyExamProfile, "BANKING_PRELIMS");
  assert.equal(batch.questions.length, 2);
  for (const question of batch.questions) {
    assert.equal(question.packageId, "AVG-001");
    assert.equal(question.canonicalProblemId, "AVG-CP-001");
    assert.equal((question.options as unknown[]).length, 5);
    assert.equal(question.requestedExamProfile, "BANKING_PRELIMS");
    assert.equal(
      question.examProfileTransportStatus,
      "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING",
    );
    assert.equal(question.profileSelectionCalibrated, false);
  }
});

test("unified AVG-001 keeps Punjab four-option delivery", async () => {
  const batch = await generateAverage({
    exam: "Punjab PSSSB Clerk",
    examProfileId: "PUNJAB_STATE",
    seed: "avg-unified:punjab",
  });

  assert.equal(batch.plan.legacyExamProfile, "PUNJAB_STATE");
  assert.equal(batch.questions.length, 2);
  for (const question of batch.questions) {
    assert.equal((question.options as unknown[]).length, 4);
    assert.equal(question.requestedExamProfile, "PUNJAB_STATE");
    assert.equal(
      question.examProfileTransportStatus,
      "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING",
    );
    assert.equal(question.profileSelectionCalibrated, false);
  }
});
