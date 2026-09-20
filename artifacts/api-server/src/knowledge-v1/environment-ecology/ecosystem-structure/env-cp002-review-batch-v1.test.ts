import { describe, expect, it } from "vitest";
import { ENV_CP002_FACT_IDS_V1 } from "./env-cp002-facts";
import { generateEnvCp002ReviewBatchV1 } from "./env-cp002-review-generator-v1";

describe("ENV-CP-002 V1 review batch", () => {
  const questions = generateEnvCp002ReviewBatchV1();

  it("builds the complete 48-question review surface", () => {
    expect(questions).toHaveLength(48);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(12);
    expect(new Set(questions.map((question) => question.difficulty))).toEqual(
      new Set(["Easy", "Medium", "Hard"]),
    );
  });

  it("keeps four questions and all answer positions in every QL", () => {
    const byQl = new Map<string, typeof questions>();
    for (const question of questions) {
      const bucket = byQl.get(question.qlId) ?? [];
      bucket.push(question);
      byQl.set(question.qlId, bucket);
    }

    for (const bucket of byQl.values()) {
      expect(bucket).toHaveLength(4);
      expect(new Set(bucket.map((question) => question.correctIndex))).toEqual(
        new Set([0, 1, 2, 3]),
      );
    }
  });

  it("keeps each item structurally valid and review-only", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.questionId).toMatch(/^ENV-CP002-V1-/);
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
      expect(question.sourceIds.length).toBeGreaterThan(0);
      expect(question.sourceFactIds.length).toBeGreaterThan(0);
      for (const factId of question.sourceFactIds) {
        expect(ENV_CP002_FACT_IDS_V1.has(factId)).toBe(true);
      }
    }
  });

  it("keeps semantic questions distinct and wording concise", () => {
    const signatures = questions.map(
      (question) => `${question.stem}::${question.canonicalAnswer}`,
    );
    expect(new Set(signatures).size).toBe(48);

    for (const question of questions) {
      if (!question.stem.startsWith("Consider the following statements:")) {
        expect(question.stem.length).toBeLessThanOrEqual(105);
      }
      expect(question.explanation.length).toBeLessThanOrEqual(150);
    }

    const text = questions
      .map((question) => `${question.stem}\n${question.explanation}`)
      .join("\n");
    expect(text).not.toMatch(/associated with/i);
    expect(text).not.toMatch(/option\s+[abcd]/i);
  });
});
