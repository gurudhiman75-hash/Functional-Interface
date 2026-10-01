import assert from "node:assert/strict";
import test from "node:test";

import {
  generateTrigonometryEngineBatch,
  trg001EnginePackage,
  trg002EnginePackage,
} from "./quant-trigonometry";

test("TRG package capabilities preserve approved lifecycle locks", () => {
  const trg001 = trg001EnginePackage();
  assert.equal(trg001.packageId, "TRG-001");
  assert.equal(trg001.questionBankWritable, true);
  assert.equal(trg001.testEligible, true);
  assert.equal(trg001.mockTestEligible, true);
  assert.equal(trg001.publiclyPublishable, false);
  assert.equal(trg001.productionReleaseAuthorized, false);

  const trg002 = trg002EnginePackage();
  assert.equal(trg002.packageId, "TRG-002");
  assert.equal(trg002.questionBankWritable, true);
  assert.equal(trg002.testEligible, true);
  assert.equal(trg002.mockTestEligible, true);
  assert.equal(trg002.publiclyPublishable, false);
  assert.equal(trg002.productionReleaseAuthorized, false);
});

test("TRG-001 unified generation preserves release lock", async () => {
  const result = await generateTrigonometryEngineBatch({
    engineId: "quant-v4",
    packageId: "TRG-001",
    canonicalProblemId: "TRG-CP-001",
    difficulty: "Easy",
    language: "en",
    seed: "engine-trg001-lifecycle",
    count: 1,
  });

  assert.ok(result);
  assert.equal(result!.questions.length, 1);
  const question = result!.questions[0] as Record<string, unknown>;
  assert.equal(question.packageId, "TRG-001");
  assert.equal(question.questionBankWritable, true);
  assert.equal(question.testEligible, true);
  assert.equal(question.mockTestEligible, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.publicReleaseAuthorized, false);
  assert.equal((result!.generationContext as Record<string, unknown>).publicReleaseAuthorized, false);
});

test("TRG-002 unified generation keeps internal eligibility but blocks public release", async () => {
  const result = await generateTrigonometryEngineBatch({
    engineId: "quant-v4",
    packageId: "TRG-002",
    canonicalProblemId: "TRG-CP-007",
    difficulty: "Easy",
    language: "en",
    seed: "engine-trg002-lifecycle",
    count: 1,
  });

  assert.ok(result);
  assert.equal(result!.questions.length, 1);
  const question = result!.questions[0] as Record<string, unknown>;
  assert.equal(question.packageId, "TRG-002");
  assert.equal(question.questionBankWritable, true);
  assert.equal(question.testEligible, true);
  assert.equal(question.mockTestEligible, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.publicReleaseAuthorized, false);
  assert.equal((result!.generationContext as Record<string, unknown>).publicReleaseAuthorized, false);
});
