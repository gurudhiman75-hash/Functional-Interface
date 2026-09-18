import { describe, expect, it } from "vitest";
import { generatePolCp024ReviewBatchV1 } from "./pol-cp024-review-candidate-v1";

describe("POL-CP-024 Official Language, Scheduled Areas & Tribal Administration V1", () => {
  const batch = generatePolCp024ReviewBatchV1();
  it("builds the intended profile", () => {
    expect(batch).toHaveLength(80);
    expect(batch.filter(q=>q.difficulty==="Easy")).toHaveLength(24);
    expect(batch.filter(q=>q.difficulty==="Medium")).toHaveLength(40);
    expect(batch.filter(q=>q.difficulty==="Hard")).toHaveLength(16);
  });
  it("keeps 20 QLs with four questions each", () => {
    const counts = new Map<string,number>();
    for (const q of batch) counts.set(q.qlId,(counts.get(q.qlId)??0)+1);
    expect(counts.size).toBe(20); for (const count of counts.values()) expect(count).toBe(4);
  });
  it("balances answer positions", () => {
    const pos=[0,0,0,0]; for (const q of batch) { expect(new Set(q.options).size).toBe(4); pos[q.correctIndex]+=1; }
    expect(pos).toEqual([20,20,20,20]);
  });
  it("keeps stems and explanations exam-grade", () => {
    expect(new Set(batch.map(q=>q.stem)).size).toBe(80);
    expect(new Set(batch.map(q=>q.explanation)).size).toBe(80);
    for (const q of batch) {
      expect(q.stem.endsWith("?")).toBe(true);
      expect(q.stem.trim().split(/\s+/).length).toBeLessThanOrEqual(30);
      const words=q.explanation.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(13); expect(words).toBeLessThanOrEqual(45);
      expect(q.explanation).not.toMatch(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i);
    }
  });
});
