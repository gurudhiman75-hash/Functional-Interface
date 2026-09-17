import { describe, expect, it } from "vitest";
import { generatePolCp022ReviewBatchV1 } from "./pol-cp022-review-candidate-v1";

describe("POL-CP-022 Constitutional Bodies & Authorities V1", () => {
  const batch = generatePolCp022ReviewBatchV1();

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

  it("keeps options unique and answer positions balanced", () => {
    const positions = [0, 0, 0, 0];
    for (const q of batch) {
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBeTruthy();
      positions[q.correctIndex] += 1;
    }
    expect(positions).toEqual([20, 20, 20, 20]);
  });

  it("keeps exam-grade stems and simple question-specific explanations", () => {
    expect(new Set(batch.map((q) => q.stem)).size).toBe(80);
    expect(new Set(batch.map((q) => q.explanation)).size).toBe(80);
    for (const q of batch) {
      const words = q.explanation.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(13);
      expect(words).toBeLessThanOrEqual(32);
      expect(q.stem.endsWith("?")).toBe(true);
      expect(q.stem.split(/\s+/).length).toBeLessThanOrEqual(30);
      expect(q.explanation).not.toMatch(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i);
    }
  });

  it("retains high-yield constitutional-body distinctions", () => {
    const joined = batch.map((q) => `${q.stem} ${q.explanation}`).join(" ");
    expect(joined).toContain("Article 148");
    expect(joined).toContain("Article 280");
    expect(joined).toContain("Article 315");
    expect(joined).toContain("Article 338A");
    expect(joined).toContain("Article 338B");
    expect(joined).toContain("89th Constitutional Amendment");
    expect(joined).toContain("102nd Constitutional Amendment");
  });
});
