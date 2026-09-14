import { describe, expect, it } from "vitest";
import { generatePolCp007ReviewBatchV1 } from "./pol-cp007-review-generator-v1";
import { POL_CP007_SOURCES_V1 } from "./pol-cp007-sources";

describe("POL-CP-007 President review batch", () => {
  const questions = generatePolCp007ReviewBatchV1();

  it("keeps the intended review floor", () => {
    expect(questions).toHaveLength(80);
    expect(new Set(questions.map(q => q.qlId)).size).toBe(22);
  });

  it("keeps intended difficulty distribution", () => {
    const counts=questions.reduce<Record<string,number>>((acc,q)=>{acc[q.difficulty]=(acc[q.difficulty]??0)+1;return acc;},{});
    expect(counts).toEqual({Easy:24,Medium:42,Hard:14});
  });

  it("keeps options, answers and sources valid", () => {
    const sources=new Set(POL_CP007_SOURCES_V1.map(s=>s.sourceId));
    for(const q of questions){
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      expect(q.sourceIds.length).toBeGreaterThan(0);
      for(const id of q.sourceIds) expect(sources.has(id)).toBe(true);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
    }
  });

  it("requires teaching explanations", () => {
    for(const q of questions){
      expect(q.explanation.trim().split(/\s+/).length).toBeGreaterThanOrEqual(20);
      expect(q.explanation.trim().toLowerCase()).not.toBe(q.canonicalAnswer.trim().toLowerCase());
    }
  });

  it("uses all answer positions and avoids exact semantic duplicates", () => {
    expect(new Set(questions.map(q=>q.correctIndex))).toEqual(new Set([0,1,2,3]));
    const signatures=questions.map(q=>[q.qlId,q.stem,q.canonicalAnswer].join("|"));
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("keeps stems exam-like and key traps explicit", () => {
    const text=questions.map(q=>q.stem).join("\n");
    expect(text).not.toMatch(/On which date did the following occur|most directly governs|principal subject/i);
    for(const q of questions) if(!q.stem.startsWith("Consider the following statements")) expect(q.stem.split(/\s+/).length).toBeLessThanOrEqual(34);
    const explanations=questions.map(q=>q.explanation).join("\n");
    expect(explanations).toMatch(/nominated MPs/i);
    expect(explanations).toMatch(/two-thirds of total membership/i);
    expect(explanations).toMatch(/six months/i);
    expect(explanations).toMatch(/cannot withhold assent/i);
    expect(explanations).toMatch(/six weeks/i);
  });
});
