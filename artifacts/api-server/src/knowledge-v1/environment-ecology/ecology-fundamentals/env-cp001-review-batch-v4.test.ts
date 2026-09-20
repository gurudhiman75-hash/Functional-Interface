import { describe, expect, it } from "vitest";
import { generateEnvCp001ReviewBatchV4 } from "./env-cp001-review-generator-v4";

describe("ENV-CP-001 V4 simplified editorial review batch", () => {
  const questions = generateEnvCp001ReviewBatchV4();

  it("preserves the full review surface", () => {
    expect(questions).toHaveLength(48);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(12);
    expect(new Set(questions.map((question) => question.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
  });

  it("keeps every item structurally valid", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.questionId).toMatch(/^ENV-CP001-V4-/);
      expect(question.stem.trim().length).toBeGreaterThan(0);
      expect(question.explanation.trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps learner-facing language concise", () => {
    for (const question of questions) {
      const nonStatementStem = !question.stem.startsWith("Consider the following statements:");
      if (nonStatementStem) {
        expect(question.stem.length).toBeLessThanOrEqual(105);
      }
      expect(question.explanation.length).toBeLessThanOrEqual(150);
    }
  });

  it("keeps the all-true Q43 statement count semantically aligned", () => {
    const q43 = questions.find((question) => question.questionId === "ENV-CP001-V4-043");
    expect(q43).toBeTruthy();
    expect(q43?.canonicalAnswer).toBe("All three");
    expect(q43?.options[q43.correctIndex]).toBe("All three");
    expect(q43?.explanation).toBe("All three statements are correct.");
  });

  it("retains editorial bans", () => {
    const text = questions.map((question) => `${question.stem}\n${question.explanation}`).join("\n");
    expect(text).not.toMatch(/associated with/i);
    expect(text).not.toMatch(/option\s+[abcd]/i);
    expect(text).not.toMatch(/which option shows/i);
  });
});
