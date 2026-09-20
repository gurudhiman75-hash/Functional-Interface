import { describe, expect, it } from "vitest";
import { ENV_CP004_FACT_IDS_V1 } from "./env-cp004-facts";
import { generateEnvCp004ReviewBatchV1 } from "./env-cp004-review-generator-v1";

describe("ENV-CP-004 V1 review batch",()=>{
 const questions=generateEnvCp004ReviewBatchV1();
 it("builds 48 questions across 12 QLs",()=>{
  expect(questions).toHaveLength(48);
  expect(new Set(questions.map(q=>q.qlId)).size).toBe(12);
  expect(new Set(questions.map(q=>q.difficulty))).toEqual(new Set(["Easy","Medium","Hard"]));
 });
 it("uses all four answer positions in each QL",()=>{
  const byQl=new Map<string,typeof questions>();
  for(const q of questions){const b=byQl.get(q.qlId)??[];b.push(q);byQl.set(q.qlId,b);}
  for(const b of byQl.values()){expect(b).toHaveLength(4);expect(new Set(b.map(q=>q.correctIndex))).toEqual(new Set([0,1,2,3]));}
 });
 it("keeps valid review-only questions",()=>{
  for(const q of questions){
   expect(q.options).toHaveLength(4);expect(new Set(q.options).size).toBe(4);
   expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
   expect(q.reviewOnly).toBe(true);expect(q.runtimeRegistered).toBe(false);
   for(const id of q.sourceFactIds) expect(ENV_CP004_FACT_IDS_V1.has(id)).toBe(true);
  }
 });
 it("keeps concise editorial language",()=>{
  for(const q of questions){if(!q.stem.startsWith("Consider the following statements:"))expect(q.stem.length).toBeLessThanOrEqual(110);expect(q.explanation.length).toBeLessThanOrEqual(165);}
  const text=questions.map(q=>`${q.stem}\n${q.explanation}`).join("\n");
  expect(text).not.toMatch(/associated with/i);expect(text).not.toMatch(/option\s+[abcd]/i);
 });
});