import { describe, expect, it } from "vitest";
import { generatePolCp008ReviewBatchV6 } from "./pol-cp008-review-generator-v6";

describe("POL-CP-008 V6 balanced explanations", () => {
  const questions = generatePolCp008ReviewBatchV6();

  it("keeps the review structure", () => {
    expect(questions).toHaveLength(60);
    expect(new Set(questions.map(q => q.qlId)).size).toBe(17);
  });

  it("keeps valid options and answer alignment", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("uses balanced, unique explanations", () => {
    expect(new Set(questions.map(q => q.explanation)).size).toBe(questions.length);
    for (const q of questions) {
      const words = q.explanation.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(11);
      const maxWords = q.explanation.includes("Qualifications:") || q.explanation.includes("Article 66 qualifications:") ? 55 : 24;
      expect(words).toBeLessThanOrEqual(maxWords);
      expect(q.explanation).not.toMatch(/Correct answer|exact subject|nearby Articles|match the topic|remember the word/i);
    }
  });
});
