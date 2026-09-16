import { describe, expect, it } from "vitest";
import { generateEnvCp001ReviewBatchV3 } from "./env-cp001-review-generator-v3";

describe("ENV-CP-001 V3 editorial review batch", () => {
  const questions = generateEnvCp001ReviewBatchV3();

  it("preserves the complete 48-question review surface", () => {
    expect(questions).toHaveLength(48);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(12);
    expect(new Set(questions.map((question) => question.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
  });

  it("keeps every V3 item structurally valid", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.questionId).toMatch(/^ENV-CP001-V3-/);
    }
  });

  it("uses meaningful same-concept distractors for neighbouring ecological levels", () => {
    const levelQuestions = questions.filter((question) => question.qlId === "ENV-001-QL-006");
    expect(levelQuestions).toHaveLength(4);
    expect(levelQuestions[0].stem).toContain("organism");
    expect(levelQuestions[0].stem).toContain("population");
    expect(levelQuestions[1].stem).toContain("population");
    expect(levelQuestions[1].stem).toContain("community");
    expect(levelQuestions[2].stem).toContain("community");
    expect(levelQuestions[2].stem).toContain("ecosystem");
    expect(levelQuestions[3].stem).toContain("biome");
    expect(levelQuestions[3].stem).toContain("biosphere");
    for (const question of levelQuestions) {
      expect(question.options.every((option) => option.length > 35)).toBe(true);
    }
  });

  it("retains the editorial bans", () => {
    const text = questions.map((question) => `${question.stem}\n${question.explanation}`).join("\n");
    expect(text).not.toMatch(/associated with/i);
    expect(text).not.toMatch(/option\s+[abcd]/i);
  });
});
