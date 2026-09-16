import { describe, expect, it } from "vitest";
import { generatePolCp017ReviewBatchV2 } from "./pol-cp017-review-generator-v2";

describe("POL-CP-017 Centre-State Relations V2", () => {
  const batch = generatePolCp017ReviewBatchV2();

  it("builds the intended 96-question profile", () => {
    expect(batch).toHaveLength(96);
    expect(batch.filter((q) => q.difficulty === "Easy")).toHaveLength(24);
    expect(batch.filter((q) => q.difficulty === "Medium")).toHaveLength(56);
    expect(batch.filter((q) => q.difficulty === "Hard")).toHaveLength(16);
  });

  it("keeps 24 QLs with four questions each", () => {
    const counts = new Map<string, number>();
    for (const q of batch) counts.set(q.qlId, (counts.get(q.qlId) ?? 0) + 1);
    expect(counts.size).toBe(24);
    for (const count of counts.values()) expect(count).toBe(4);
  });

  it("keeps options unique and answers aligned", () => {
    for (const q of batch) {
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBeTruthy();
    }
  });

  it("uses simple, useful and unique explanations", () => {
    expect(new Set(batch.map((q) => q.explanation)).size).toBe(96);
    for (const q of batch) {
      const words = q.explanation.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(11);
      expect(words).toBeLessThanOrEqual(32);
      expect(q.explanation).not.toMatch(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i);
      expect(q.explanation).not.toMatch(/constitutional trigger|legislative competence|to the extent of repugnancy|apportionment in the manner/i);
    }
  });

  it("keeps stems unchanged and exam-grade", () => {
    expect(new Set(batch.map((q) => q.stem)).size).toBe(96);
    for (const q of batch) {
      if (!q.stem.startsWith("Consider the statements:")) {
        expect(q.stem.endsWith("?")).toBe(true);
        expect(q.stem.split(/\s+/).length).toBeLessThanOrEqual(30);
      }
    }
  });
});
