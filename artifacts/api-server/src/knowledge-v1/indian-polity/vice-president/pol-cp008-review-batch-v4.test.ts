import { describe, expect, it } from "vitest";
import { generatePolCp008ReviewBatchV4 } from "./pol-cp008-review-generator-v4";

describe("POL-CP-008 Vice-President V4 clean explanations", () => {
  const questions = generatePolCp008ReviewBatchV4();

  it("keeps the review structure", () => {
    expect(questions).toHaveLength(60);
    expect(new Set(questions.map(q => q.qlId)).size).toBe(17);
  });

  it("keeps explanations concise and unique", () => {
    expect(new Set(questions.map(q => q.explanation)).size).toBe(60);
    for (const q of questions) {
      const words = q.explanation.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(6);
      expect(words).toBeLessThanOrEqual(24);
    }
  });

  it("blocks generic explanation clutter", () => {
    const text = questions.map(q => q.explanation).join("\n");
    expect(text).not.toMatch(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i);
  });

  it("keeps options and answers valid", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });
});