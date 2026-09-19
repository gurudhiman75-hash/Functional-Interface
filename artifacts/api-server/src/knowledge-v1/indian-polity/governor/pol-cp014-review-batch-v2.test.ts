import { describe, expect, it } from "vitest";
import { generatePolCp014ReviewBatchV1 } from "./pol-cp014-review-generator-v1";
import { generatePolCp014ReviewBatchV2 } from "./pol-cp014-review-generator-v2";

describe("POL-CP-014 final-audit qualification backfill V2", () => {
  const before = generatePolCp014ReviewBatchV1();
  const after = generatePolCp014ReviewBatchV2();

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

  it("gives both Article 157 qualifications on the direct qualification questions", () => {
    for (const q of [after[16], after[17]]) {
      expect(q.explanation).toContain("• Citizen of India");
      expect(q.explanation).toContain("• At least 35 years old");
    }
  });

  it("does not turn Article 158 office conditions into appointment qualifications", () => {
    expect(after[18].explanation).toBe(before[18].explanation);
    expect(after[19].explanation).toBe(before[19].explanation);
  });
});
