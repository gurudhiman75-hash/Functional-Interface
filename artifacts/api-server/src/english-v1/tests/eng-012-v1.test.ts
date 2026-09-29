import assert from"node:assert/strict";
import{ENG012_AUTHORITIES_V1}from"../chapters/word-swap/ENG-012/eng-012-authorities-v1";
import{ENG012_BANKING_AUTHORITIES_V1}from"../chapters/word-swap/ENG-012/eng-012-banking-authorities-v1";
import{generateEng012Cp005SetV1,generateEng012QuestionV1}from"../chapters/word-swap/ENG-012/eng-012-v1";

const all=[...ENG012_AUTHORITIES_V1,...ENG012_BANKING_AUTHORITIES_V1];
assert.equal(all.length,96);
for(const cp of["ENG-012-CP001","ENG-012-CP002","ENG-012-CP003","ENG-012-CP004"]as const)assert.equal(all.filter(x=>x.cpId===cp).length,24);
assert.equal(new Set(all.map(x=>x.id)).size,96);

for(const a of all){
 assert.equal(a.natural.length,4);
 assert.equal(a.variants?.length,2);
 const q=generateEng012QuestionV1({seed:`audit:${a.id}`,authorityId:a.id});
 const z=generateEng012QuestionV1({seed:`audit:${a.id}`,authorityId:a.id});
 assert.deepEqual(q,z);
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.equal(q.options[q.correctOptionIndex],q.metadata.correctSwap);
 assert.ok(q.explanation.length>120);
 assert.equal(q.metadata.reviewOnly,true);
}
for(const p of["ssc-standard","ssc-advanced","banking-prelims","banking-mains"]as const){
 const x=generateEng012Cp005SetV1(`composer:${p}`,p);
 assert.equal(x.profile,p);
 assert.ok(x.question.correctOptionIndex>=0&&x.question.correctOptionIndex<4);
}
for(let i=0;i<10000;i++){
 const q=generateEng012QuestionV1({seed:`soak:${i}`});
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
}
console.log("ENG-012 full audit source passed.",{authorities:96,surfaces:288,soak:10000});
