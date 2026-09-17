import { describe, expect, it } from "vitest";
import { ENV_CP020_REVIEW_V2 } from "./env-cp020-review-generator-v2";

describe("ENV-CP-020 integrated review V2", () => {
  it("preserves the frozen 48-question / 12-QL structure", () => {
    expect(ENV_CP020_REVIEW_V2).toHaveLength(48);
    expect(new Set(ENV_CP020_REVIEW_V2.map((q) => q.qlId)).size).toBe(12);
  });

  it("removes associated/association wording from learner-facing text", () => {
    for (const q of ENV_CP020_REVIEW_V2) {
      const text = `${q.stem} ${q.explanation}`.toLowerCase();
      expect(text).not.toContain("associated");
      expect(text).not.toContain("association");
    }
  });

  it("preserves answers, provenance and review-only state", () => {
    for (const q of ENV_CP020_REVIEW_V2) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      expect(q.sourceCpIds.length).toBeGreaterThan(0);
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
    }
  });

  it("keeps learner-facing text concise", () => {
    for (const q of ENV_CP020_REVIEW_V2) {
      expect(q.stem.length).toBeLessThanOrEqual(145);
      expect(q.explanation.length).toBeGreaterThanOrEqual(45);
      expect(q.explanation.length).toBeLessThanOrEqual(230);
    }
  });
});
