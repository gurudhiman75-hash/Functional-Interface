import { describe, expect, it } from "vitest";
import { generatePolCp003ReviewBatchV3 } from "./pol-cp003-review-generator-v3";

describe("POL-CP-003 review generator V3 exam-style stems", () => {
  const questions = generatePolCp003ReviewBatchV3();

  it("keeps the approved content shape", () => {
    expect(questions).toHaveLength(58);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(18);
  });

  it("uses compact exam-style stems", () => {
    const ordinary = questions.filter((question) => !question.stem.startsWith("Consider the following statements"));
    for (const question of ordinary) {
      expect(question.stem.split(/\s+/).length).toBeLessThanOrEqual(26);
    }
  });

  it("blocks conversational and generic wording", () => {
    const stems = questions.map((question) => question.stem).join("\n");
    expect(stems).not.toMatch(/How does the Preamble describe India today/i);
    expect(stems).not.toMatch(/What is the role of the affected State Legislature/i);
    expect(stems).not.toMatch(/Who must recommend an Article 3 Bill/i);
    expect(stems).not.toMatch(/Which Article most directly governs/i);
    expect(stems).not.toMatch(/On which date did the following occur/i);
  });

  it("keeps answers and options unchanged", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
    }
  });
});
