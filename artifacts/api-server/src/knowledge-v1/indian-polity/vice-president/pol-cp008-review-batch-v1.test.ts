import { describe, expect, it } from "vitest";
import { generatePolCp008ReviewBatchV1 } from "./pol-cp008-review-generator-v1";
import { POL_CP008_SOURCES_V1 } from "./pol-cp008-sources";

describe("POL-CP-008 Vice-President review batch", () => {
  const questions=generatePolCp008ReviewBatchV1();

  it("keeps the intended review floor",()=>{
    expect(questions).toHaveLength(60);
    expect(new Set(questions.map(q=>q.qlId)).size).toBe(17);
  });

  it("keeps intended difficulty distribution",()=>{
    const counts=questions.reduce<Record<string,number>>((acc,q)=>{acc[q.difficulty]=(acc[q.difficulty]??0)+1;return acc;},{});
    expect(counts).toEqual({Easy:20,Medium:31,Hard:9});
  });

  it("keeps options, answers and sources valid",()=>{
    const sourceIds=new Set(POL_CP008_SOURCES_V1.map(s=>s.sourceId));
    for(const q of questions){
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      expect(q.sourceIds.length).toBeGreaterThan(0);
      for(const id of q.sourceIds) expect(sourceIds.has(id)).toBe(true);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
    }
  });

  it("requires teaching explanations",()=>{
    for(const q of questions){
      expect(q.explanation.trim().split(/\s+/).length).toBeGreaterThanOrEqual(20);
      expect(q.explanation.trim().toLowerCase()).not.toBe(q.canonicalAnswer.trim().toLowerCase());
    }
  });

  it("uses all answer positions and avoids exact semantic duplicates",()=>{
    expect(new Set(questions.map(q=>q.correctIndex))).toEqual(new Set([0,1,2,3]));
    const signatures=questions.map(q=>[q.qlId,q.stem,q.canonicalAnswer].join("|"));
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("keeps high-yield distinctions explicit",()=>{
    const stems=questions.map(q=>q.stem).join("\n");
    expect(stems).not.toMatch(/On which date did the following occur|most directly governs|principal subject/i);
    for(const q of questions) if(!q.stem.startsWith("Consider the following statements")) expect(q.stem.split(/\s+/).length).toBeLessThanOrEqual(34);
    const explanations=questions.map(q=>q.explanation).join("\n");
    expect(explanations).toMatch(/nominated MPs participate/i);
    expect(explanations).toMatch(/State Legislatures do not take part/i);
    expect(explanations).toMatch(/Rajya Sabha resolution/i);
    expect(explanations).toMatch(/fresh full five-year term/i);
    expect(explanations).toMatch(/not impeached/i);
  });
});
