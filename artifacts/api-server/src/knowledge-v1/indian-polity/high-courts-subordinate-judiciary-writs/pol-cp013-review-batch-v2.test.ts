import { describe, expect, it } from "vitest";
import { generatePolCp013ReviewBatchV1 } from "./pol-cp013-review-generator-v1";
import { generatePolCp013ReviewBatchV2 } from "./pol-cp013-review-generator-v2";

describe("POL-CP-013 final-audit qualification backfill V2", () => {
  const before = generatePolCp013ReviewBatchV1();
  const after = generatePolCp013ReviewBatchV2();

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

  it("unpacks the complete High Court Judge qualification routes", () => {
    const qs = after.filter(q => q.qlId === "POL-013-QL-005");
    expect(qs).toHaveLength(4);
    for (const q of qs) {
      expect(q.explanation).toContain("• Citizen of India");
      expect(q.explanation).toContain("• At least 10 years in judicial office in India");
      expect(q.explanation).toContain("• At least 10 years as an advocate of a High Court");
      expect(q.explanation).toContain("• No separate numerical minimum appointment age");
    }
  });

  it("keeps unrelated explanations unchanged", () => {
    after.forEach((q, i) => {
      if (q.qlId !== "POL-013-QL-005") expect(q.explanation).toBe(before[i].explanation);
    });
  });
});
