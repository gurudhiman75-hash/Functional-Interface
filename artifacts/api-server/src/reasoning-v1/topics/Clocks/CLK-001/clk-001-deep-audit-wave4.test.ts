import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CLK_001_AUTHORING_TASKS_BY_QL_V1,
  CLK_001_AUTHORING_VARIANT_AUTHORITY_V1,
  CLK_001_LOCALIZED_VARIANT_BATCH_3,
} from "./authoring-variants-v1";
import { CLK_001_PERMANENT_CONTRACTS } from "./permanent-contracts";
import { generateClk001QuestionStudioBatch } from "./question-studio-integration";
import { CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION } from "./runtime/exam-natural-governance";

test("CLK-001 Batch 3 expands multilingual authoring without taxonomy inflation", () => {
  assert.equal(CLK_001_PERMANENT_CONTRACTS.length, 23);
  assert.ok(CLK_001_AUTHORING_VARIANT_AUTHORITY_V1.enabledMergedVariantCount >= 31);
  assert.equal(CLK_001_LOCALIZED_VARIANT_BATCH_3.length, 15);

  const enabled = new Set(Object.values(CLK_001_AUTHORING_TASKS_BY_QL_V1).flat());
  for (const taskId of CLK_001_LOCALIZED_VARIANT_BATCH_3) {
    assert.ok(enabled.has(taskId), taskId + " must be authorable in Batch 3");
  }

  for (const [taskId, record] of Object.entries(CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION)) {
    if (record.disposition === "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION" ||
        record.disposition === "INTERNAL_VERIFICATION_ONLY") {
      assert.equal(enabled.has(taskId as any), false, taskId + " must remain excluded");
    }
  }
});

test("all expanded QLs retain deterministic EN HI PA parity after Batch 3", async () => {
  const expanded = CLK_001_PERMANENT_CONTRACTS.filter(
    (contract) => CLK_001_AUTHORING_TASKS_BY_QL_V1[contract.qlId].length > 1,
  );
  assert.ok(expanded.length >= 14);

  const globallyObserved = new Set<string>();

  for (const contract of expanded) {
    const pool = [...CLK_001_AUTHORING_TASKS_BY_QL_V1[contract.qlId]];
    const count = pool.length * 2;
    const byLanguage = new Map<string, any[]>();

    for (const language of ["en", "hi", "pa"] as const) {
      const result = await generateClk001QuestionStudioBatch({
        packageId: "CLK-001",
        canonicalProblemId: contract.qlId,
        language,
        count,
        seed: "clk-wave4-batch3-" + contract.qlId,
      });
      byLanguage.set(language, result.questions);

      const observed = new Set(result.questions.map((q) =>
        String((q.traceability as any).authoringTaskId),
      ));
      assert.deepEqual([...observed].sort(), pool.sort());

      for (const question of result.questions) {
        const taskId = String((question.traceability as any).authoringTaskId);
        globallyObserved.add(taskId);
        assert.equal((question.options as string[]).length, 4);
        assert.equal(new Set(question.options as string[]).size, 4);
        assert.equal((question.validation as any).solverAgreement, true);
        assert.equal((question.validation as any).semanticParityPreserved, true);
        assert.equal((question.validation as any).correctIndexPreserved, true);
        if (language === "hi") assert.match(String(question.stem), /[ऀ-ॿ]/u);
        if (language === "pa") assert.match(String(question.stem), /[਀-੿]/u);
      }
    }

    const en = byLanguage.get("en")!;
    const hi = byLanguage.get("hi")!;
    const pa = byLanguage.get("pa")!;
    for (let index = 0; index < count; index += 1) {
      const enTrace = en[index]!.traceability as any;
      const hiTrace = hi[index]!.traceability as any;
      const paTrace = pa[index]!.traceability as any;
      assert.equal(enTrace.authoringTaskId, hiTrace.authoringTaskId);
      assert.equal(enTrace.authoringTaskId, paTrace.authoringTaskId);
      assert.equal(en[index]!.correctIndex, hi[index]!.correctIndex);
      assert.equal(en[index]!.correctIndex, pa[index]!.correctIndex);
      assert.equal(enTrace.semanticFingerprint, hiTrace.semanticFingerprint);
      assert.equal(enTrace.semanticFingerprint, paTrace.semanticFingerprint);
    }
  }

  for (const taskId of CLK_001_LOCALIZED_VARIANT_BATCH_3) {
    assert.ok(globallyObserved.has(taskId), taskId + " was not observed in multilingual generation");
  }
});
