import { describe, expect, it } from "vitest";
import { generatePolCp008ReviewBatchV2 } from "./pol-cp008-review-generator-v2";

describe("POL-CP-008 simplified language V2", () => {
  const questions = generatePolCp008ReviewBatchV2();

  it("keeps the review structure", () => {
    expect(questions).toHaveLength(60);
    expect(new Set(questions.map((q) => q.qlId)).size).toBe(17);
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
    expect(text).not.toMatch(/temporarily unable to discharge functions/i);
    expect(text).not.toMatch(/states which specific ground/i);
    expect(text).not.toMatch(/bear true faith and allegiance/i);
  });
});
