import { describe, expect, it } from "vitest";
import { ENV_CP015_FACT_IDS_V1 } from "./env-cp015-facts";
import { ENV_CP015_QLS, ENV_CP015_REVIEW_META, ENV_CP015_REVIEW_QUESTIONS_V1 } from "./env-cp015-review-generator-v1";

describe("ENV-CP-015 V1 review batch", () => {
  const questions = ENV_CP015_REVIEW_QUESTIONS_V1;

  it("builds 48 questions across 12 QLs", () => {
    expect(questions).toHaveLength(48);
    expect(ENV_CP015_QLS).toHaveLength(12);
    expect(ENV_CP015_REVIEW_META.questionCount).toBe(48);
    expect(new Set(questions.map((q) => q.qlId)).size).toBe(12);
    expect(new Set(questions.map((q) => q.difficulty))).toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("uses all four answer positions inside every QL", () => {
    const byQl = new Map<string, typeof questions[number][]>();
    for (const item of questions) {
      const bucket = byQl.get(item.qlId) ?? [];
      bucket.push(item);
      byQl.set(item.qlId, bucket);
    }
    for (const bucket of byQl.values()) {
      expect(bucket).toHaveLength(4);
      expect(new Set(bucket.map((item) => item.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
    }
  });

  it("keeps every item valid, sourced and review-only", () => {
    for (const item of questions) {
      expect(item.options).toHaveLength(4);
      expect(new Set(item.options).size).toBe(4);
      expect(item.options[item.correctIndex]).toBe(item.canonicalAnswer);
      expect(item.questionId).toMatch(/^ENV-CP015-V1-/);
      expect(item.reviewOnly).toBe(true);
      expect(item.runtimeRegistered).toBe(false);
      expect(item.sourceIds.length).toBeGreaterThan(0);
      expect(item.sourceFactIds.length).toBeGreaterThan(0);
      for (const id of item.sourceFactIds) expect(ENV_CP015_FACT_IDS_V1.has(id)).toBe(true);
    }
  });

  it("keeps stems direct and explanations useful", () => {
    const signatures = questions.map((item) => `${item.stem}::${item.canonicalAnswer}`);
    expect(new Set(signatures).size).toBe(48);
    for (const item of questions) {
      expect(item.stem.length).toBeLessThanOrEqual(145);
      expect(item.explanation.length).toBeGreaterThanOrEqual(55);
      expect(item.explanation.length).toBeLessThanOrEqual(220);
    }
    const text = questions.map((item) => `${item.stem}\n${item.explanation}`).join("\n");
    expect(text).not.toMatch(/associated with/i);
    expect(text).not.toMatch(/option\s+[abcd]/i);
    expect(text).not.toMatch(/in an exam|exam asks|which answer should/i);
    expect(text).not.toMatch(/current office-holder|current pollution reading|current species status/i);
    expect(text).not.toMatch(/paris agreement|kyoto protocol|unfccc/i);
  });
});
