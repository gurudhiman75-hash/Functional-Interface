import { describe, expect, it } from "vitest";
import { ENV_CP014_FACT_IDS_V1 } from "./env-cp014-facts";
import { ENV_CP014_REVIEW_QUESTIONS_V1 } from "./env-cp014-review-generator-v1";

describe("ENV-CP-014 V1 review batch", () => {
  const questions = ENV_CP014_REVIEW_QUESTIONS_V1;

  it("builds 48 questions across 12 QLs", () => {
    expect(questions).toHaveLength(48);
    expect(new Set(questions.map((q) => q.qlId)).size).toBe(12);
    expect(new Set(questions.map((q) => q.difficulty))).toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("uses all four answer positions inside every QL", () => {
    const byQl = new Map<string, typeof questions[number][]>();
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

  it("keeps every item valid, sourced and review-only", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      expect(q.questionId).toMatch(/^ENV-CP014-V1-/);
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      for (const id of q.sourceFactIds) expect(ENV_CP014_FACT_IDS_V1.has(id)).toBe(true);
    }
  });

  it("keeps stems simple and explanations useful", () => {
    const signatures = questions.map((q) => `${q.stem}::${q.canonicalAnswer}`);
    expect(new Set(signatures).size).toBe(48);
    for (const q of questions) {
      if (!q.stem.startsWith("Consider the following statements:")) expect(q.stem.length).toBeLessThanOrEqual(110);
      expect(q.explanation.length).toBeGreaterThanOrEqual(55);
      expect(q.explanation.length).toBeLessThanOrEqual(180);
    }
    const text = questions.map((q) => `${q.stem}\n${q.explanation}`).join("\n");
    expect(text).not.toMatch(/associated with/i);
    expect(text).not.toMatch(/option\s+[abcd]/i);
    expect(text).not.toMatch(/in an exam|exam asks|which answer should/i);
    expect(text).not.toMatch(/current emissions ranking|hottest year|current co2 concentration|current methane concentration/i);
    expect(text).not.toMatch(/paris agreement|kyoto protocol|nationally determined contribution|ndc/i);
  });
});