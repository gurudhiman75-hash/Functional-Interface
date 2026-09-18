import { describe, expect, it } from "vitest";
import { generatePolCp026ReviewBatchV1 } from "./pol-cp026-review-candidate-v1";

describe("POL-CP-026 Public Services & Administrative Tribunals V1", () => {
  const batch = generatePolCp026ReviewBatchV1();

  it("builds the intended profile", () => {
    expect(batch).toHaveLength(80);
    expect(batch.filter((q) => q.difficulty === "Easy")).toHaveLength(24);
    expect(batch.filter((q) => q.difficulty === "Medium")).toHaveLength(40);
    expect(batch.filter((q) => q.difficulty === "Hard")).toHaveLength(16);
  });

  it("keeps 20 QLs with four questions each", () => {
    const counts = new Map<string, number>();
    for (const q of batch) counts.set(q.qlId, (counts.get(q.qlId) ?? 0) + 1);
    expect(counts.size).toBe(20);
    for (const count of counts.values()) expect(count).toBe(4);
  });

  it("balances answer positions", () => {
    const positions = [0, 0, 0, 0];
    for (const q of batch) {
      expect(new Set(q.options).size).toBe(4);
      positions[q.correctIndex] += 1;
    }
    expect(positions).toEqual([20, 20, 20, 20]);
  });

  it("keeps a balanced natural stem mix", () => {
    expect(batch.filter((q) => q.stem.endsWith(":"))).toHaveLength(40);
    expect(batch.filter((q) => q.stem.endsWith("?"))).toHaveLength(40);
    for (const q of batch) {
      expect(q.stem.trim().split(/\s+/).length).toBeLessThanOrEqual(30);
      expect(q.stem).not.toMatch(/\bwhom\b|\bby whom\b|for the purposes of/i);
    }
  });

  it("keeps stems and explanations unique", () => {
    expect(new Set(batch.map((q) => q.stem)).size).toBe(80);
    expect(new Set(batch.map((q) => q.explanation)).size).toBe(80);
  });
});
