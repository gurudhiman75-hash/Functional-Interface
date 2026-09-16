import { describe, expect, it } from "vitest";
import { generatePolCp019ReviewBatchV1 } from "./pol-cp019-review-generator-v1";

describe("POL-CP-019 Panchayati Raj V1", () => {
  const batch = generatePolCp019ReviewBatchV1();

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

  it("keeps stems exam-grade and explanations simple", () => {
    expect(new Set(batch.map((q) => q.stem)).size).toBe(80);
    expect(new Set(batch.map((q) => q.explanation)).size).toBe(80);
    for (const q of batch) {
      const words = q.explanation.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(13);
      expect(words).toBeLessThanOrEqual(32);
      expect(q.explanation).not.toMatch(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i);
      expect(q.stem.endsWith("?")).toBe(true);
      expect(q.stem.split(/\s+/).length).toBeLessThanOrEqual(30);
      expect(q.stem).not.toMatch(/^Article\s+\d+[A-Z]?\s+(mainly\s+)?deals with:|\bis mainly under:$|\bis a:$/i);
    }
  });

  it("retains the key Panchayati Raj distinctions", () => {
    const joined = batch.map((q) => `${q.stem} ${q.explanation}`).join(" ");
    expect(joined).toContain("20 lakh");
    expect(joined).toContain("one-third");
    expect(joined).toContain("twenty-nine");
    expect(joined).toContain("State Election Commission");
    expect(joined).toContain("Article 243O");
  });
});
