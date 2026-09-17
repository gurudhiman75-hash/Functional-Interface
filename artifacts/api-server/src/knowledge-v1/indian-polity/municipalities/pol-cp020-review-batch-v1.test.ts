import { describe, expect, it } from "vitest";
import { generatePolCp020ReviewBatchV1 } from "./pol-cp020-review-generator-v1";

describe("POL-CP-020 Municipalities V1", () => {
  const batch = generatePolCp020ReviewBatchV1();

  it("builds the intended 80-question profile", () => {
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
    }
  });

  it("retains high-yield municipal distinctions", () => {
    const joined = batch.map((q) => `${q.stem} ${q.explanation}`).join(" ");
    expect(joined).toContain("three lakh");
    expect(joined).toContain("ten lakh");
    expect(joined).toContain("four-fifths");
    expect(joined).toContain("two-thirds");
    expect(joined).toContain("Twelfth Schedule");
  });
});
