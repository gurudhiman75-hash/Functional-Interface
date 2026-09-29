import { strict as assert } from "node:assert";
import questions from "../../knowledge-v1/world-history-cp013-en-v1.json";
import authority from "../../../../review/world-history/WHI-001-CP013-CANONICAL-FACTS-Q001-060-V1.json";
const sourceIds=new Set(authority.sourceRegister.map((s)=>s.sourceId));const facts=new Map(authority.facts.map((f)=>[f.factId,f]));
assert.equal(questions.length,60);assert.equal(authority.facts.length,60);
assert.deepEqual(["easy","medium","hard"].map((d)=>questions.filter((q)=>q.difficulty===d).length),[18,30,12]);
assert.deepEqual(["A","B","C","D"].map((k)=>questions.filter((q)=>q.correctOption===k).length),[15,15,15,15]);
assert.equal(new Set(questions.map((q)=>q.stem.toLowerCase().trim())).size,60);assert.equal(new Set(questions.map((q)=>q.questionFamily)).size,10);
for(const [i,q] of questions.entries()){const id=`WHI-CP013-Q${String(i+1).padStart(3,"0")}`;assert.equal(q.questionId,id);assert.equal(q.englishQuestionId,id);assert.equal(q.checkpointId,"WHI-001-CP013");assert.equal(q.factId,id.replace("-Q","-F"));assert.equal(q.language,"en");assert.equal(q.reviewOnly,true);assert.equal(q.runtimeRegistered,false);assert.equal(q.options.length,4);assert.deepEqual(q.options.map((o)=>o.key),["A","B","C","D"]);assert.equal(new Set(q.options.map((o)=>o.text)).size,4);assert.ok(q.options.some((o)=>o.key===q.correctOption));assert.ok(q.sourceIds.length&&q.sourceIds.every((s)=>sourceIds.has(s)));assert.deepEqual(q.sourceIds,facts.get(q.factId)?.sourceIds);assert.ok(q.stem&&q.explanation&&!q.explanation.includes("CP013-S"));}
console.log("[WHI-013] PASS 60 questions, canonical facts, exact source links, difficulty, balanced keys and review-only state");

const rebalanceCases=[
 ["WHI-CP013-Q003","CP013-S15","Recognition — U.S. Recognition of Nigerian Independence, 1960"],
 ["WHI-CP013-Q004","CP013-S16","Angola: Recognition — U.S. Response to Angolan Independence, 1975; Mozambique: Recognition — U.S. Recognition of Mozambique, 1975"],
 ["WHI-CP013-Q005","CP013-S18","Recognition — U.S. Recognition of Zimbabwe’s Independence, 1980"],
 ["WHI-CP013-Q006","CP013-S19","Paragraph beginning “On 1 April 1989”"],
 ["WHI-CP013-Q051","CP013-S16","Summary paragraph on the 1974 coup and Alvor Accords"],
 ["WHI-CP013-Q053","CP013-S19","Paragraph on the 1976 UN General Assembly confirmation"],
 ["WHI-CP013-Q054","CP013-S19","Paragraph beginning “On 21 March 1990”"],
];
for(const [questionId,sourceId,locator] of rebalanceCases){
 const q=questions.find((item)=>item.questionId===questionId);
 const fact=facts.get(q.factId);
 assert.ok(q.sourceIds.includes(sourceId),`${questionId} source link`);
 assert.ok(sourceIds.has(sourceId),`${questionId} registered source`);
 assert.equal(fact?.sourceLocator,locator,`${questionId} precise locator`);
 assert.deepEqual(q.sourceIds,fact?.sourceIds,`${questionId} canonical source parity`);
}
assert.equal(questions.find((q)=>q.questionId==="WHI-CP013-Q001")?.stem,"Which former British colony gained independence in 1957 and adopted the name Ghana?");
