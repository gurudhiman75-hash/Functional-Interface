import { describe, expect, it } from "vitest";
import { ENV_CP016_FACT_IDS_V1 } from "./env-cp016-facts";
import { ENV_CP016_REVIEW_QUESTIONS_V1 } from "./env-cp016-review-generator-v1";

describe("ENV-CP-016 V1 review batch", () => {
  const questions = ENV_CP016_REVIEW_QUESTIONS_V1;

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
      expect(q.questionId).toMatch(/^ENV-CP016-V1-/);
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      for (const id of q.sourceFactIds) expect(ENV_CP016_FACT_IDS_V1.has(id)).toBe(true);
    }
  });

  it("keeps learner-facing wording concise and distinct", () => {
    const signatures = questions.map((q) => `${q.stem}::${q.canonicalAnswer}`);
    expect(new Set(signatures).size).toBe(48);
    for (const q of questions) {
      expect(q.stem.length).toBeLessThanOrEqual(120);
      expect(q.explanation.length).toBeGreaterThanOrEqual(45);
      expect(q.explanation.length).toBeLessThanOrEqual(190);
    }
    const text = questions.map((q) => `${q.stem}\n${q.explanation}`).join("\n");
    expect(text).not.toMatch(/associated with/i);
    expect(text).not.toMatch(/option\s+[abcd]/i);
    expect(text).not.toMatch(/in an exam|exam asks|which answer should/i);
    expect(text).not.toMatch(/current chairman|current director|current count|how many tiger reserves/i);
    expect(text).not.toMatch(/paris agreement|kyoto protocol|montreal protocol|ramsar convention|cites convention/i);
  });

  it("does not regress into CP015 direct law-recall ownership", () => {
    const stems = questions.map((q) => q.stem).join("\n");
    expect(stems).not.toMatch(/in which year was.*act|which act was enacted in|environment protection act.*year/i);
    expect(stems).not.toMatch(/main role of the national green tribunal/i);
  });
});
