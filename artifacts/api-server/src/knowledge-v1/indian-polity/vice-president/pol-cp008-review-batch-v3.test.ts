import { describe, expect, it } from "vitest";
import { generatePolCp008ReviewBatchV3 } from "./pol-cp008-review-generator-v3";

describe("POL-CP-008 Vice-President V3 explanation quality", () => {
  const questions = generatePolCp008ReviewBatchV3();

  it("keeps the review structure", () => {
    expect(questions).toHaveLength(60);
    expect(new Set(questions.map(q => q.qlId)).size).toBe(17);
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
      expect(q.explanation).toContain(q.canonicalAnswer);
    }
    for (const qlId of new Set(questions.map(q => q.qlId))) {
      const group = questions.filter(q => q.qlId === qlId);
      expect(new Set(group.map(q => q.explanation)).size).toBe(group.length);
    }
  });

  it("keeps key President/Vice-President distinctions explicit", () => {
    const text = questions.map(q => q.explanation).join("\n");
    expect(text).toMatch(/nominated MPs vote/i);
    expect(text).toMatch(/State MLAs do not vote/i);
    expect(text).toMatch(/Rajya Sabha/i);
    expect(text).toMatch(/not impeached/i);
    expect(text).toMatch(/fresh five-year term/i);
    expect(text).toMatch(/as soon as possible/i);
  });
});
