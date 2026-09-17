import { describe, expect, it } from "vitest";
import { ENV_CP020_FACT_BY_ID_V1 } from "./env-cp020-facts";
import { ENV_CP020_REVIEW_V1 } from "./env-cp020-review-generator-v1";

describe("ENV-CP-020 integrated review V1", () => {
  it("has 48 questions across 12 QLs", () => {
    expect(ENV_CP020_REVIEW_V1).toHaveLength(48);
    expect(new Set(ENV_CP020_REVIEW_V1.map((q) => q.qlId)).size).toBe(12);
  });

  it("keeps four questions and all answer positions inside every QL", () => {
    const byQl = new Map<string, typeof ENV_CP020_REVIEW_V1[number][]>();
    for (const q of ENV_CP020_REVIEW_V1) byQl.set(q.qlId, [...(byQl.get(q.qlId) ?? []), q]);
    for (const questions of byQl.values()) {
      expect(questions).toHaveLength(4);
      expect(new Set(questions.map((q) => q.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
    }
  });

  it("represents Easy, Medium and Hard reasoning", () => {
    expect(new Set(ENV_CP020_REVIEW_V1.map((q) => q.difficulty))).toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("keeps options unique and answer indexes valid", () => {
    for (const q of ENV_CP020_REVIEW_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
    }
  });

  it("keeps review IDs, provenance and review-only state valid", () => {
    for (const q of ENV_CP020_REVIEW_V1) {
      expect(q.id).toMatch(/^ENV-CP020-V1-\d{3}$/);
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      expect(q.sourceCpIds.length).toBeGreaterThan(0);
      for (const id of q.sourceFactIds) expect(ENV_CP020_FACT_BY_ID_V1[id]).toBeTruthy();
      for (const cp of q.sourceCpIds) expect(cp).toMatch(/^ENV-CP-0(0[1-9]|1\d)$/);
    }
  });

  it("has no duplicate stem-answer signatures", () => {
    const signatures = ENV_CP020_REVIEW_V1.map((q) => `${q.stem.toLowerCase()}::${q.options[q.correctIndex].toLowerCase()}`);
    expect(new Set(signatures).size).toBe(signatures.length);
  });

  it("keeps learner-facing text concise and useful", () => {
    for (const q of ENV_CP020_REVIEW_V1) {
      expect(q.stem.length).toBeLessThanOrEqual(145);
      expect(q.explanation.length).toBeGreaterThanOrEqual(45);
      expect(q.explanation.length).toBeLessThanOrEqual(230);
      const learnerText = `${q.stem} ${q.explanation}`.toLowerCase();
      expect(learnerText).not.toContain("associated with");
      expect(learnerText).not.toMatch(/option\s+[abcd]/);
      expect(learnerText).not.toContain("ql-");
      expect(learnerText).not.toContain("cp020");
    }
  });

  it("does not introduce mutable current-affairs trivia", () => {
    const text = ENV_CP020_REVIEW_V1.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join(" ").toLowerCase();
    for (const banned of ["current number", "currently has", "latest ramsar", "latest tiger", "current ranking", "current chairman", "current chairperson", "this year", "2026 population"]) {
      expect(text).not.toContain(banned);
    }
  });

  it("is genuinely cross-CP rather than a new standalone fact chapter", () => {
    const represented = new Set(ENV_CP020_REVIEW_V1.flatMap((q) => q.sourceCpIds));
    expect(represented.size).toBeGreaterThanOrEqual(15);
    const multiSourceQuestions = ENV_CP020_REVIEW_V1.filter((q) => q.sourceCpIds.length >= 2);
    expect(multiSourceQuestions.length).toBeGreaterThanOrEqual(12);
  });
});
