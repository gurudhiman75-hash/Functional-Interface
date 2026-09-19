import { describe, expect, it } from "vitest";
import { generatePolCp007ReviewBatchV6 } from "./pol-cp007-review-generator-v6";
import { generatePolCp007ReviewBatchV7 } from "./pol-cp007-review-generator-v7";

describe("POL-CP-007 final-audit qualification backfill V7", () => {
  const before = generatePolCp007ReviewBatchV6();
  const after = generatePolCp007ReviewBatchV7();

  it("preserves approved question semantics", () => {
    expect(after).toHaveLength(before.length);
    after.forEach((q, i) => {
      expect(q.stem).toBe(before[i].stem);
      expect(q.options).toEqual(before[i].options);
      expect(q.correctIndex).toBe(before[i].correctIndex);
      expect(q.canonicalAnswer).toBe(before[i].canonicalAnswer);
      expect(q.qlId).toBe(before[i].qlId);
      expect(q.difficulty).toBe(before[i].difficulty);
      expect(q.sourceIds).toEqual(before[i].sourceIds);
      expect(q.sourceFactIds).toEqual(before[i].sourceFactIds);
    });
  });

  it("gives the complete President qualification set on every qualification item", () => {
    const qs = after.filter(q => q.qlId === "POL-007-QL-007");
    expect(qs).toHaveLength(4);
    for (const q of qs) {
      expect(q.explanation).toContain("• Citizen of India");
      expect(q.explanation).toContain("• At least 35 years old");
      expect(q.explanation).toContain("• Qualified for election to Lok Sabha");
      expect(q.explanation).toContain("• Must not hold a disqualifying office of profit");
    }
  });

  it("does not rewrite unrelated explanations", () => {
    after.forEach((q, i) => {
      if (q.qlId !== "POL-007-QL-007") expect(q.explanation).toBe(before[i].explanation);
    });
  });
});
