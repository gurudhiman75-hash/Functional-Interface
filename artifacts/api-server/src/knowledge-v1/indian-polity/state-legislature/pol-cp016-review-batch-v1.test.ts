import { describe, expect, it } from "vitest";
import { generatePolCp016ReviewBatchV1 } from "./pol-cp016-review-generator-v1";

describe("POL-CP-016 State Legislature review V1",()=>{
  const questions=generatePolCp016ReviewBatchV1();

  it("generates the intended review profile",()=>{
    expect(questions).toHaveLength(96);
    expect(questions.filter(q=>q.difficulty==="Easy")).toHaveLength(24);
    expect(questions.filter(q=>q.difficulty==="Medium")).toHaveLength(56);
    expect(questions.filter(q=>q.difficulty==="Hard")).toHaveLength(16);
  });

  it("keeps 24 genuine QLs with four questions each",()=>{
    const counts=new Map<string,number>();
    for(const q of questions) counts.set(q.qlId,(counts.get(q.qlId)??0)+1);
    expect(counts.size).toBe(24);
    for(const count of counts.values()) expect(count).toBe(4);
  });

  it("keeps options unique and answer aligned",()=>{
    for(const q of questions){
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("keeps stems exam-grade and explanations useful",()=>{
    expect(new Set(questions.map(q=>q.stem)).size).toBe(96);
    expect(new Set(questions.map(q=>q.explanation)).size).toBe(96);
    for(const q of questions){
      const words=q.explanation.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(13);
      const maxWords = q.explanation.includes("Article 173 qualifications:") ? 60 : 32;
      expect(words).toBeLessThanOrEqual(maxWords);
      expect(q.explanation).not.toMatch(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i);
      if(!q.stem.startsWith("Consider the statements:")){
        expect(q.stem.endsWith("?")).toBe(true);
        expect(q.stem.trim().split(/\s+/).length).toBeLessThanOrEqual(30);
      }
      expect(q.stem).not.toMatch(/^Article\s+\d+[A-Z]?\s+(mainly\s+)?deals with:|\bis mainly under:$|\bis a:$/i);
    }
  });

  it("covers the key State Legislature distinctions",()=>{
    const joined=questions.map(q=>`${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(joined).toContain("two-thirds");
    expect(joined).toContain("one-third");
    expect(joined).toContain("14 days");
    expect(joined).toContain("three months");
    expect(joined).toContain("one month");
    expect(joined).toContain("casting vote");
    expect(joined).toContain("Consolidated Fund of the State");
    expect(joined).toContain("Article 212");
  });
});
