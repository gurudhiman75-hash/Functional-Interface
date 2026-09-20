import { describe, expect, it } from "vitest";
import { ENV_CP006_FACT_IDS_V1 } from "./env-cp006-facts";
import { generateEnvCp006ReviewBatchV1 } from "./env-cp006-review-generator-v1";

describe("ENV-CP-006 V1 review batch", () => {
  const questions = generateEnvCp006ReviewBatchV1();

  it("builds 48 questions across 12 QLs", () => {
    expect(questions).toHaveLength(48);
    expect(new Set(questions.map((q) => q.qlId)).size).toBe(12);
    expect(new Set(questions.map((q) => q.difficulty))).toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("uses all four answer positions inside every QL", () => {
    const byQl = new Map<string, typeof questions>();
    for (const q of questions) {
      const bucket = byQl.get(q.qlId) ?? [];
      bucket.push(q);
      byQl.set(q.qlId, bucket);
    }
    for (const bucket of byQl.values()) {
      expect(bucket).toHaveLength(4);
      expect(new Set(bucket.map((q) => q.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
    }
  });

  it("keeps every item valid and review-only", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      expect(q.questionId).toMatch(/^ENV-CP006-V1-/);
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      for (const id of q.sourceFactIds) expect(ENV_CP006_FACT_IDS_V1.has(id)).toBe(true);
    }
  });

  it("keeps learner-facing language concise", () => {
    const signatures = questions.map((q) => `${q.stem}::${q.canonicalAnswer}`);
    expect(new Set(signatures).size).toBe(48);
    for (const q of questions) {
      if (!q.stem.startsWith("Consider the following statements:")) expect(q.stem.length).toBeLessThanOrEqual(125);
      expect(q.explanation.length).toBeLessThanOrEqual(180);
    }
    const text = questions.map((q) => `${q.stem}\n${q.explanation}`).join("\n");
    expect(text).not.toMatch(/associated with/i);
    expect(text).not.toMatch(/option\s+[abcd]/i);
  });
});
