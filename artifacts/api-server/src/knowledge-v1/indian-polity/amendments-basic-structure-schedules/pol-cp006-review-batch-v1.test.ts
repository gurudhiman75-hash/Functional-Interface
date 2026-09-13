import { describe, expect, it } from "vitest";
import { generatePolCp006ReviewBatchV1 } from "./pol-cp006-review-generator-v1";
import { POL_CP006_SOURCES_V1 } from "./pol-cp006-sources";
import { POL_CP006_SCHEDULES_V1 } from "./pol-cp006-facts";

describe("POL-CP-006 Amendments, Basic Structure and Schedules review batch", () => {
  const questions = generatePolCp006ReviewBatchV1();

  it("provides the full review floor", () => {
    expect(questions).toHaveLength(90);
    expect(new Set(questions.map(q => q.qlId)).size).toBe(26);
  });

  it("keeps intended difficulty distribution", () => {
    const counts = questions.reduce<Record<string, number>>((acc,q) => {
      acc[q.difficulty]=(acc[q.difficulty]??0)+1; return acc;
    },{});
    expect(counts).toEqual({ Easy: 27, Medium: 46, Hard: 17 });
  });

  it("keeps structural validity", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
      if (!q.stem.startsWith("Consider the following statements")) expect(q.stem.split(/\s+/).length).toBeLessThanOrEqual(34);
    }
  });

  it("uses all answer positions and has no exact semantic duplicates", () => {
    expect(new Set(questions.map(q=>q.correctIndex))).toEqual(new Set([0,1,2,3]));
    const signatures=questions.map(q=>[q.qlId,q.stem,q.canonicalAnswer].join("|"));
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("resolves sources and keeps all twelve schedules", () => {
    const sourceIds=new Set(POL_CP006_SOURCES_V1.map(s=>s.sourceId));
    for(const q of questions) for(const id of q.sourceIds) expect(sourceIds.has(id)).toBe(true);
    expect(POL_CP006_SCHEDULES_V1).toHaveLength(12);
  });

  it("blocks previously rejected stem patterns", () => {
    const text=questions.map(q=>q.stem).join("\n");
    expect(text).not.toMatch(/On which date did the following occur/i);
    expect(text).not.toMatch(/most directly governs/i);
    expect(text).not.toMatch(/principal subject/i);
  });
});
