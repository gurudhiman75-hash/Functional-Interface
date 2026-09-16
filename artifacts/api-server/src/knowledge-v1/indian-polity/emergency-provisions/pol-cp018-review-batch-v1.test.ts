import { describe, expect, it } from "vitest";
import { generatePolCp018ReviewBatchV1 } from "./pol-cp018-review-generator-v1";

describe("POL-CP-018 Emergency Provisions V1", () => {
  const batch = generatePolCp018ReviewBatchV1();

  it("builds the intended 80-question profile", () => {
    expect(batch).toHaveLength(80);
    expect(batch.filter((q) => q.difficulty === "Easy")).toHaveLength(24);
    expect(batch.filter((q) => q.difficulty === "Medium")).toHaveLength(40);
    expect(batch.filter((q) => q.difficulty === "Hard")).toHaveLength(16);
  });

  it("has 20 QLs with four questions each", () => {
    const counts = new Map<string, number>();
    for (const q of batch) counts.set(q.qlId, (counts.get(q.qlId) ?? 0) + 1);
    expect(counts.size).toBe(20);
    for (const count of counts.values()) expect(count).toBe(4);
  });

  it("keeps options unique and answers aligned", () => {
    for (const q of batch) {
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBeTruthy();
    }
  });

  it("keeps exam-grade stems and simple explanations", () => {
    expect(new Set(batch.map((q) => q.stem)).size).toBe(80);
    expect(new Set(batch.map((q) => q.explanation)).size).toBe(80);
    for (const q of batch) {
      const words = q.explanation.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(13);
      expect(words).toBeLessThanOrEqual(32);
      expect(q.explanation).not.toMatch(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i);
      if (!q.stem.startsWith("Consider the statements:")) {
        expect(q.stem.endsWith("?")).toBe(true);
        expect(q.stem.split(/\s+/).length).toBeLessThanOrEqual(30);
      }
    }
  });

  it("retains the main Emergency distinctions", () => {
    const joined = batch.map((q) => `${q.stem} ${q.explanation}`).join(" ");
    expect(joined).toContain("armed rebellion");
    expect(joined).toContain("one-tenth");
    expect(joined).toContain("Articles 20 and 21");
    expect(joined).toContain("three years");
    expect(joined).toContain("Financial Emergency");
  });
});
