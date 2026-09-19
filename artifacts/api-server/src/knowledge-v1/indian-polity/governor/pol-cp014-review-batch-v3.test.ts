import { describe, expect, it } from "vitest";
import { generatePolCp014ReviewBatchV2 } from "./pol-cp014-review-generator-v2";
import { generatePolCp014ReviewBatchV3 } from "./pol-cp014-review-generator-v3";

describe("POL-CP-014 final-audit ownership V3", () => {
  const before = generatePolCp014ReviewBatchV2();
  const after = generatePolCp014ReviewBatchV3();
  const changed = new Set([32,33,34,35,36,37,38,39,70,71,74,75,78,79]);

  it("keeps the frozen batch shape and answer-position profile", () => {
    expect(after).toHaveLength(80);
    after.forEach((q, i) => {
      expect(q.correctIndex).toBe(before[i].correctIndex);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      expect(q.qlId).toBe(before[i].qlId);
      expect(q.difficulty).toBe(before[i].difficulty);
      expect(q.sourceIds).toEqual(before[i].sourceIds);
    });
  });

  it("changes only the explicit ownership-remediation questions", () => {
    after.forEach((q, i) => {
      if (changed.has(i)) return;
      expect(q.stem).toBe(before[i].stem);
      expect(q.options).toEqual(before[i].options);
      expect(q.canonicalAnswer).toBe(before[i].canonicalAnswer);
      expect(q.explanation).toBe(before[i].explanation);
      expect(q.sourceFactIds).toEqual(before[i].sourceFactIds);
    });
  });

  it("removes standalone ministry and Advocate-General ownership from the remediated set", () => {
    const remediated = [...changed].map(i => after[i]);
    const text = remediated.map(q => `${q.stem} ${q.canonicalAnswer}`).join("\n");
    expect(text).not.toMatch(/Advocate-General|Council of Ministers.*15%|non-member Minister|minimum number of Ministers/i);
    expect(text).toMatch(/Article 154/);
    expect(text).toMatch(/Article 175/);
  });
});
