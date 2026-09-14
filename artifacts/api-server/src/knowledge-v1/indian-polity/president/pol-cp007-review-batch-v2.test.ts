import { describe, expect, it } from "vitest";
import { generatePolCp007ReviewBatchV2 } from "./pol-cp007-review-generator-v2";

describe("POL-CP-007 simplified language V2", () => {
  const questions = generatePolCp007ReviewBatchV2();

  it("keeps the review structure", () => {
    expect(questions).toHaveLength(80);
    expect(new Set(questions.map((q) => q.qlId)).size).toBe(22);
  });

  it("keeps options and answers valid", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("keeps ordinary stems short and exam-like", () => {
    for (const q of questions) {
      if (!q.stem.startsWith("Consider the following statements")) {
        expect(q.stem.trim().split(/\s+/).length).toBeLessThanOrEqual(28);
      }
    }
  });

  it("keeps explanations simple but substantive", () => {
    for (const q of questions) {
      expect(q.explanation.trim().split(/\s+/).length).toBeGreaterThanOrEqual(20);
      expect(q.explanation).not.toMatch(/hereinbefore|notwithstanding anything contained|mutatis mutandis/i);
    }
  });

  it("blocks unnecessarily formal stem wording", () => {
    const text = questions.map((q) => q.stem).join("\n");
    expect(text).not.toMatch(/may be preferred by/i);
    expect(text).not.toMatch(/may be promulgated when/i);
    expect(text).not.toMatch(/can be challenged merely because/i);
  });
});
