import { describe, expect, it } from "vitest";
import { ENV_CP002_EXHAUSTIVE_V2_FACTS, ENV_CP002_EXHAUSTIVE_V2_QUESTIONS } from "./env-cp002-exhaustive-v2-additions";

describe("ENV-CP-002 exhaustive V2 succession additions", () => {
  it("adds 12 questions across three succession QLs", () => {
    expect(ENV_CP002_EXHAUSTIVE_V2_QUESTIONS).toHaveLength(12);
    expect(new Set(ENV_CP002_EXHAUSTIVE_V2_QUESTIONS.map((q) => q.qlId)).size).toBe(3);
  });

  it("keeps answers, provenance and review state valid", () => {
    const factIds = new Set(Object.keys(ENV_CP002_EXHAUSTIVE_V2_FACTS));
    for (const q of ENV_CP002_EXHAUSTIVE_V2_QUESTIONS) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      expect(q.sourceIds.length).toBeGreaterThan(0);
      for (const id of q.sourceFactIds) expect(factIds.has(id)).toBe(true);
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
    }
  });

  it("uses exam-like learner text without boilerplate", () => {
    const signatures = new Set<string>();
    for (const q of ENV_CP002_EXHAUSTIVE_V2_QUESTIONS) {
      expect(q.stem.length).toBeLessThanOrEqual(150);
      expect(q.explanation.length).toBeGreaterThanOrEqual(65);
      const text = `${q.stem} ${q.explanation}`.toLowerCase();
      expect(text).not.toContain("associated with");
      expect(text).not.toMatch(/option\s+[abcd]/);
      const signature = `${q.stem.toLowerCase()}::${q.canonicalAnswer.toLowerCase()}`;
      expect(signatures.has(signature)).toBe(false);
      signatures.add(signature);
    }
  });
});
