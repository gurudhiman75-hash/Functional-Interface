import { describe, expect, it } from "vitest";
import { generatePolCp016ReviewBatchV1 } from "./pol-cp016-review-generator-v1";
import { generatePolCp016ReviewBatchV2 } from "./pol-cp016-review-generator-v2";

describe("POL-CP-016 final-audit qualification backfill V2", () => {
  const before = generatePolCp016ReviewBatchV1();
  const after = generatePolCp016ReviewBatchV2();

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

  it("gives the complete Article 173 set on both age questions", () => {
    for (const q of [after[18], after[19]]) {
      expect(q.explanation).toContain("• Citizen of India");
      expect(q.explanation).toContain("• Make the prescribed oath or affirmation");
      expect(q.explanation).toContain("• At least 25 years old for the Legislative Assembly or 30 for the Legislative Council");
      expect(q.explanation).toContain("• Meet any other qualifications prescribed by Parliament by law");
    }
  });

  it("keeps the Article 172 term questions unchanged", () => {
    expect(after[16].explanation).toBe(before[16].explanation);
    expect(after[17].explanation).toBe(before[17].explanation);
  });
});
