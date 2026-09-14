import { describe, expect, it } from "vitest";
import { generatePolCp006ReviewBatchV3 } from "./pol-cp006-review-generator-v3";

describe("POL-CP-006 explanation quality V3", () => {
  const questions = generatePolCp006ReviewBatchV3();

  it("keeps the approved review structure", () => {
    expect(questions).toHaveLength(90);
    expect(new Set(questions.map((q) => q.qlId)).size).toBe(26);
  });

  it("keeps options and answers valid", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("requires teaching explanations rather than answer repetition", () => {
    for (const q of questions) {
      const explanationWords = q.explanation.trim().split(/\s+/).length;
      expect(explanationWords).toBeGreaterThanOrEqual(20);
      expect(q.explanation.trim().toLowerCase()).not.toBe(q.canonicalAnswer.trim().toLowerCase());
    }
  });

  it("keeps key distinctions explicit", () => {
    const byQl = (id: string) => questions.filter((q) => q.qlId === id).map((q) => q.explanation).join("\n");
    expect(byQl("POL-006-QL-003")).toMatch(/total membership/i);
    expect(byQl("POL-006-QL-003")).toMatch(/present and voting/i);
    expect(byQl("POL-006-QL-005")).toMatch(/no joint sitting/i);
    expect(byQl("POL-006-QL-012")).toMatch(/24 April 1973/i);
    expect(byQl("POL-006-QL-016")).toMatch(/Fifth Schedule/i);
    expect(byQl("POL-006-QL-016")).toMatch(/Sixth Schedule/i);
    expect(byQl("POL-006-QL-019")).toMatch(/29 subjects/i);
    expect(byQl("POL-006-QL-020")).toMatch(/18/i);
  });

  it("keeps explanations beginner-friendly", () => {
    const text = questions.map((q) => q.explanation).join("\n");
    expect(text).not.toMatch(/hereinbefore|notwithstanding anything contained|mutatis mutandis/i);
  });
});
