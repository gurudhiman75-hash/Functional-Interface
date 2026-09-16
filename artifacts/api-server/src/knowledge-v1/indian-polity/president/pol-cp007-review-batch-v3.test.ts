import { describe, expect, it } from "vitest";
import { generatePolCp007ReviewBatchV3 } from "./pol-cp007-review-generator-v3";

describe("POL-CP-007 President V3 explanation quality", () => {
  const questions = generatePolCp007ReviewBatchV3();

  it("keeps the review structure", () => {
    expect(questions).toHaveLength(80);
    expect(new Set(questions.map(q => q.qlId)).size).toBe(22);
  });

  it("keeps valid options and answers", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("uses question-specific teaching explanations", () => {
    for (const q of questions) {
      expect(q.explanation.trim().split(/\s+/).length).toBeGreaterThanOrEqual(18);
      expect(q.explanation.trim().toLowerCase()).not.toBe(q.canonicalAnswer.trim().toLowerCase());
    }
    for (const qlId of new Set(questions.map(q => q.qlId))) {
      const group = questions.filter(q => q.qlId === qlId);
      expect(new Set(group.map(q => q.explanation)).size).toBe(group.length);
    }
  });

  it("keeps key distinctions explicit", () => {
    const text = questions.map(q => q.explanation).join("\n");
    expect(text).toMatch(/nominated MPs/i);
    expect(text).toMatch(/State Legislative Councils/i);
    expect(text).toMatch(/two-thirds of its total membership/i);
    expect(text).toMatch(/Money Bill/i);
    expect(text).toMatch(/six weeks/i);
    expect(text).toMatch(/reconsideration once/i);
  });
});
