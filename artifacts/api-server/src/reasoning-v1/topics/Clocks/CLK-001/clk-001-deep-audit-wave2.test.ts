import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CLK_001_AUTHORING_TASKS_BY_QL_V1,
  CLK_001_AUTHORING_VARIANT_AUTHORITY_V1,
  CLK_001_LOCALIZED_VARIANT_BATCH_1,
} from "./authoring-variants-v1";
import {
  CLK_001_PERMANENT_CONTRACTS,
  type ClockPermanentQlId,
} from "./permanent-contracts";
import { generateClk001QuestionStudioBatch } from "./question-studio-integration";
import { CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION } from "./runtime/exam-natural-governance";

test("CLK-001 batch-1 authoring registry keeps 23 QLs and excludes held/internal tasks", () => {
  assert.equal(CLK_001_PERMANENT_CONTRACTS.length, 23);
  assert.ok(CLK_001_AUTHORING_VARIANT_AUTHORITY_V1.enabledMergedVariantCount >= 6);

  const enabled = new Set(
    Object.values(CLK_001_AUTHORING_TASKS_BY_QL_V1).flat(),
  );
  for (const [taskId, record] of Object.entries(CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION)) {
    if (record.disposition === "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION" ||
        record.disposition === "INTERNAL_VERIFICATION_ONLY") {
      assert.equal(enabled.has(taskId as any), false, taskId + " must remain excluded");
    }
  }

  for (const taskId of CLK_001_LOCALIZED_VARIANT_BATCH_1) {
    assert.ok(enabled.has(taskId), taskId + " must be enabled");
  }
});

test("selected QLs deterministically expose every batch-1 authoring variant in EN HI PA", async () => {
  const expandedQls = Object.entries(CLK_001_AUTHORING_TASKS_BY_QL_V1)
    .filter(([, tasks]) => tasks.length > 1)
    .map(([qlId]) => qlId as ClockPermanentQlId);

  for (const qlId of ["CLK-QL-001", "CLK-QL-019", "CLK-QL-020", "CLK-QL-021"] as const) {
    assert.ok(expandedQls.includes(qlId), qlId + " must remain expanded after Batch 1");
  }

  for (const qlId of expandedQls) {
    const expectedTasks = [...CLK_001_AUTHORING_TASKS_BY_QL_V1[qlId]];
    const count = expectedTasks.length * 2;
    const byLanguage = new Map<string, any[]>();

    for (const language of ["en", "hi", "pa"] as const) {
      const result = await generateClk001QuestionStudioBatch({
        packageId: "CLK-001",
        canonicalProblemId: qlId,
        language,
        count,
        seed: "clk-wave2-variant-parity-" + qlId,
      });
      byLanguage.set(language, result.questions);

      const observed = new Set(result.questions.map((question) =>
        String((question.traceability as any).authoringTaskId),
      ));
      assert.deepEqual([...observed].sort(), expectedTasks.sort());

      for (const question of result.questions) {
        const trace = question.traceability as any;
        assert.equal(trace.authoringVariantAuthorityId, "CLK_001_AUTHORING_VARIANT_AUTHORITY_V1");
        assert.ok(expectedTasks.includes(trace.authoringTaskId));
        assert.equal((question.options as string[]).length, 4);
        assert.equal(new Set(question.options as string[]).size, 4);
        assert.equal((question.validation as any).solverAgreement, true);
        if (language === "hi") assert.match(String(question.stem), /[ऀ-ॿ]/u);
        if (language === "pa") assert.match(String(question.stem), /[਀-੿]/u);
      }
    }

    const en = byLanguage.get("en")!;
    const hi = byLanguage.get("hi")!;
    const pa = byLanguage.get("pa")!;
    for (let index = 0; index < count; index += 1) {
      assert.equal((en[index]!.traceability as any).authoringTaskId, (hi[index]!.traceability as any).authoringTaskId);
      assert.equal((en[index]!.traceability as any).authoringTaskId, (pa[index]!.traceability as any).authoringTaskId);
      assert.equal(en[index]!.correctIndex, hi[index]!.correctIndex);
      assert.equal(en[index]!.correctIndex, pa[index]!.correctIndex);
      assert.equal((en[index]!.traceability as any).semanticFingerprint, (hi[index]!.traceability as any).semanticFingerprint);
      assert.equal((en[index]!.traceability as any).semanticFingerprint, (pa[index]!.traceability as any).semanticFingerprint);
    }
  }
});

test("non-expanded QLs remain anchor-only in batch 1", async () => {
  for (const contract of CLK_001_PERMANENT_CONTRACTS) {
    if (CLK_001_AUTHORING_TASKS_BY_QL_V1[contract.qlId].length !== 1) continue;
    const result = await generateClk001QuestionStudioBatch({
      packageId: "CLK-001",
      canonicalProblemId: contract.qlId,
      language: "en",
      count: 4,
      seed: "clk-wave2-still-anchor-" + contract.qlId,
    });
    for (const question of result.questions) {
      assert.equal((question.traceability as any).authoringTaskId, contract.anchorTaskId);
    }
  }
});
