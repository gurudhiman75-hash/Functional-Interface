import { strict as assert } from "node:assert";
import questions from "../../knowledge-v1/world-history-cp008-en-v1.json";
import authority from "../../../../review/world-history/WHI-001-CP008-CANONICAL-FACTS-Q001-060-V1.json";
const sourceIds=new Set(authority.sourceRegister.map((s)=>s.sourceId));const facts=new Map(authority.facts.map((f)=>[f.factId,f]));
assert.equal(questions.length,60);assert.equal(authority.facts.length,60);
assert.deepEqual(["easy","medium","hard"].map((d)=>questions.filter((q)=>q.difficulty===d).length),[18,30,12]);assert.deepEqual(["A","B","C","D"].map((k)=>questions.filter((q)=>q.correctOption===k).length),[15,15,15,15]);
assert.equal(new Set(questions.map((q)=>q.stem.toLowerCase().trim())).size,60);assert.equal(new Set(questions.map((q)=>q.questionFamily)).size,10);
for(const [i,q] of questions.entries()){const id=`WHI-CP008-Q${String(i+1).padStart(3,"0")}`;assert.equal(q.questionId,id);assert.equal(q.englishQuestionId,id);assert.equal(q.checkpointId,"WHI-001-CP008");assert.equal(q.factId,id.replace("-Q","-F"));assert.equal(q.language,"en");assert.equal(q.reviewOnly,true);assert.equal(q.runtimeRegistered,false);assert.equal(q.options.length,4);assert.deepEqual(q.options.map((o)=>o.key),["A","B","C","D"]);assert.equal(new Set(q.options.map((o)=>o.text)).size,4);assert.ok(q.options.some((o)=>o.key===q.correctOption));assert.ok(q.sourceIds.length&&q.sourceIds.every((s)=>sourceIds.has(s)));assert.deepEqual(q.sourceIds,facts.get(q.factId)?.sourceIds);assert.ok(q.stem&&q.explanation&&!q.explanation.includes("CP008-S"));}
console.log("[WHI-008] PASS 60 questions, fact/source parity, difficulty, balanced keys and review-only state");
