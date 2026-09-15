import { describe, expect, it } from "vitest";
import { generatePolCp012ReviewBatchV1 } from "./pol-cp012-review-generator-v1";
const questions=generatePolCp012ReviewBatchV1();
describe("POL-CP-012 review batch V1",()=>{
  it("has intended size and difficulty profile",()=>{
    expect(questions).toHaveLength(80);
    expect(questions.filter(q=>q.difficulty==="Easy")).toHaveLength(24);
    expect(questions.filter(q=>q.difficulty==="Medium")).toHaveLength(40);
    expect(questions.filter(q=>q.difficulty==="Hard")).toHaveLength(16);
  });
  it("covers 20 QLs with four questions each",()=>{
    const counts=new Map<string,number>(); for(const q of questions) counts.set(q.qlId,(counts.get(q.qlId)??0)+1);
    expect(counts.size).toBe(20); for(const n of counts.values()) expect(n).toBe(4);
  });
  it("keeps options unique and answers aligned",()=>{for(const q of questions){expect(q.options).toHaveLength(4);expect(new Set(q.options).size).toBe(4);expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);}});
  it("uses unique helpful explanations",()=>{
    expect(new Set(questions.map(q=>q.explanation)).size).toBe(80);
    for(const q of questions){const words=q.explanation.trim().split(/\s+/).length;expect(words).toBeGreaterThanOrEqual(13);expect(words).toBeLessThanOrEqual(32);expect(q.explanation).not.toMatch(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i);}
  });
  it("preserves high-yield Supreme Court distinctions",()=>{
    const joined=questions.map(q=>`${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(joined).toContain("65 years"); expect(joined).toContain("Article 131"); expect(joined).toContain("Article 136"); expect(joined).toContain("Article 141"); expect(joined).toContain("Article 142"); expect(joined).toContain("collegium");
  });
});
