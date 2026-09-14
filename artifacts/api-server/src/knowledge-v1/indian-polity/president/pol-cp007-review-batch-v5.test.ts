import { describe, expect, it } from "vitest";
import { generatePolCp007ReviewBatchV5 } from "./pol-cp007-review-generator-v5";

describe("POL-CP-007 President V5 plain explanations", () => {
  const questions = generatePolCp007ReviewBatchV5();

  it("keeps the approved review structure", () => {
    expect(questions).toHaveLength(80);
    expect(new Set(questions.map(q => q.qlId)).size).toBe(22);
  });

  it("keeps options and answers valid", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("keeps explanations short and plain", () => {
    for (const q of questions) {
      const words = q.explanation.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(5);
      expect(words).toBeLessThanOrEqual(18);
      expect(q.explanation).not.toMatch(/Correct answer|exact subject|nearby Articles|match the topic|remember the word|constitutionally vested|to the extent granted/i);
    }
    expect(new Set(questions.map(q => q.explanation)).size).toBe(80);
  });
});
