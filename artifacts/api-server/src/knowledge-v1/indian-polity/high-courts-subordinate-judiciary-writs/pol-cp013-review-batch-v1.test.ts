import { describe, expect, it } from "vitest";
import { generatePolCp013ReviewBatchV1 } from "./pol-cp013-review-generator-v1";

const questions=generatePolCp013ReviewBatchV1();

describe("POL-CP-013 review batch V1",()=>{
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

  it("uses unique exam-grade stems",()=>{
    expect(new Set(questions.map(q=>q.stem)).size).toBe(80);
    for(const q of questions){
      if(q.stem.startsWith("Consider the following statements:")) continue;
      expect(q.stem.trim().endsWith("?")).toBe(true);
      expect(q.stem.trim().split(/\s+/).length).toBeLessThanOrEqual(30);
      expect(q.stem).not.toMatch(/^Article\s+\d+[A-Z]?\s+(mainly\s+)?deals with:|\bis mainly under:$|\bis a:$/i);
    }
  });

  it("preserves high-yield constitutional distinctions",()=>{
    const joined=questions.map(q=>`${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(joined).toContain("62 years");
    expect(joined).toContain("Article 226");
    expect(joined).toContain("cause of action");
    expect(joined).toContain("Article 227");
    expect(joined).toContain("7 years");
    expect(joined).toContain("State Public Service Commission");
    expect(joined).toContain("Habeas corpus");
    expect(joined).toContain("Quo warranto");
  });
});
