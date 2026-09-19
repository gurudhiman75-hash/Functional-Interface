import { describe, expect, it } from "vitest";
import { generatePolCp025ReviewBatchV1 } from "./pol-cp025-review-candidate-v1";

describe("POL-CP-025 Union Territories & Special State Provisions V1", () => {
  const batch = generatePolCp025ReviewBatchV1();

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

  it("keeps stems concise and explanations useful", () => {
    expect(new Set(batch.map((q) => q.stem)).size).toBe(80);
    expect(new Set(batch.map((q) => q.explanation)).size).toBe(80);
    const completionCount = batch.filter((q) => q.stem.endsWith(":")).length;
    const questionCount = batch.filter((q) => q.stem.endsWith("?")).length;
    expect(completionCount).toBe(43);
    expect(questionCount).toBe(37);
    for (const q of batch) {
      expect(/[?:]$/.test(q.stem)).toBe(true);\n      expect(q.stem).not.toMatch(/\\bwhom\\b|for the purposes of|what is the|appointed by whom|issued by whom/i);
      expect(q.stem.trim().split(/\s+/).length).toBeLessThanOrEqual(30);
      const words = q.explanation.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(12);
      expect(words).toBeLessThanOrEqual(45);
      expect(q.explanation).not.toMatch(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i);
    }
  });

  it("excludes Article 370 from this CP", () => {
    const joined = batch.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join(" ");
    expect(joined).not.toContain("Article 370");
  });
});
