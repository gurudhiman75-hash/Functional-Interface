import { describe, expect, it } from "vitest";
import { generatePolCp015ReviewBatchV1 } from "./pol-cp015-review-generator-v1";

const questions=generatePolCp015ReviewBatchV1();

describe("POL-CP-015 review batch V1",()=>{
  it("has intended size and difficulty profile",()=>{
    expect(questions).toHaveLength(80);
    expect(questions.filter(q=>q.difficulty==="Easy")).toHaveLength(24);
    expect(questions.filter(q=>q.difficulty==="Medium")).toHaveLength(40);
    expect(questions.filter(q=>q.difficulty==="Hard")).toHaveLength(16);
  });

  it("covers 20 QLs with four questions each",()=>{
    const counts=new Map<string,number>();
    for(const q of questions) counts.set(q.qlId,(counts.get(q.qlId)??0)+1);
    expect(counts.size).toBe(20);
    for(const count of counts.values()) expect(count).toBe(4);
  });

  it("keeps options unique and answers aligned",()=>{
    for(const q of questions){
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("uses unique exam-grade stems and helpful explanations",()=>{
    expect(new Set(questions.map(q=>q.stem)).size).toBe(80);
    expect(new Set(questions.map(q=>q.explanation)).size).toBe(80);
    for(const q of questions){
      const explanationWords=q.explanation.trim().split(/\s+/).length;
      expect(explanationWords).toBeGreaterThanOrEqual(13);
      expect(explanationWords).toBeLessThanOrEqual(32);
      if(!q.stem.startsWith("Consider the statements:")){
        expect(q.stem.trim().endsWith("?")).toBe(true);
        expect(q.stem.trim().split(/\s+/).length).toBeLessThanOrEqual(30);
      }
    }
  });

  it("preserves high-yield State executive distinctions",()=>{
    const joined=questions.map(q=>`${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(joined).toContain("15%");
    expect(joined).toContain("12");
    expect(joined).toContain("Six consecutive months");
    expect(joined).toContain("Legislative Assembly");
    expect(joined).toContain("Tenth Schedule");
    expect(joined).toContain("Article 177");
  });
});
