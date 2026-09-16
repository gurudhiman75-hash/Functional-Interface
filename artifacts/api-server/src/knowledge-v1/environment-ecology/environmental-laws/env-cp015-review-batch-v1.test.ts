import { describe, expect, it } from "vitest";
import { ENV_CP015_QLS, ENV_CP015_REVIEW_META, getEnvCp015ReviewBatchV1 } from "./env-cp015-review-generator-v1";

describe("ENV-CP-015 review batch V1", () => {
  const batch = getEnvCp015ReviewBatchV1();

  it("materializes exactly 48 review questions across 12 QLs", () => {
    expect(batch).toHaveLength(48);
    expect(ENV_CP015_QLS).toHaveLength(12);
    expect(ENV_CP015_REVIEW_META.questionCount).toBe(48);
    expect(new Set(batch.map((q) => q.qlId)).size).toBe(12);
  });

  it("keeps four questions per QL and all answer positions inside every QL", () => {
    for (const [qlId] of ENV_CP015_QLS) {
      const slice = batch.filter((q) => q.qlId === qlId);
      expect(slice).toHaveLength(4);
      expect(new Set(slice.map((q) => q.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
    }
  });

  it("keeps four unique options and a valid canonical answer", () => {
    for (const item of batch) {
      expect(item.options).toHaveLength(4);
      expect(new Set(item.options).size).toBe(4);
      expect(item.correctIndex).toBeGreaterThanOrEqual(0);
      expect(item.correctIndex).toBeLessThan(4);
      expect(item.canonicalAnswer).toBe(item.options[item.correctIndex]);
    }
  });

  it("keeps review-only lifecycle and required provenance", () => {
    expect(ENV_CP015_REVIEW_META.runtimeRegistered).toBe(false);
    for (const item of batch) {
      expect(item.chapterId).toBe("ENV-001");
      expect(item.cpId).toBe("ENV-CP-015");
      expect(item.provenance.length).toBeGreaterThan(0);
      expect(item.explanation.length).toBeGreaterThan(35);
    }
  });

  it("uses direct learner-facing wording without internal/source leakage", () => {
    const forbidden = /\b(?:QL|source baseline|provenance|review candidate|runtime|India Code|CPCB mandate)\b/i;
    for (const item of batch) {
      expect(item.stem).not.toMatch(forbidden);
      expect(item.explanation).not.toMatch(forbidden);
      expect(item.stem.length).toBeLessThanOrEqual(220);
      expect(item.explanation.length).toBeLessThanOrEqual(380);
    }
  });
});
