import { describe, expect, it } from "vitest";
import { generatePolCp012ReviewBatchV2 } from "./pol-cp012-review-generator-v2";
import { generatePolCp012ReviewBatchV3 } from "./pol-cp012-review-generator-v3";

describe("POL-CP-012 final-audit qualification backfill V3", () => {
  const before = generatePolCp012ReviewBatchV2();
  const after = generatePolCp012ReviewBatchV3();

  it("preserves approved question semantics and exam-grade stems", () => {
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

  it("unpacks all Article 124(3) qualification routes", () => {
    const qs = after.filter(q => q.qlId === "POL-012-QL-004");
    expect(qs).toHaveLength(4);
    for (const q of qs) {
      expect(q.explanation).toContain("• Citizen of India");
      expect(q.explanation).toContain("• At least 5 years as a High Court Judge");
      expect(q.explanation).toContain("• At least 10 years as a High Court advocate");
      expect(q.explanation).toContain("• A distinguished jurist in the President's opinion");
    }
  });

  it("keeps unrelated explanations unchanged", () => {
    after.forEach((q, i) => {
      if (q.qlId !== "POL-012-QL-004") expect(q.explanation).toBe(before[i].explanation);
    });
  });
});
