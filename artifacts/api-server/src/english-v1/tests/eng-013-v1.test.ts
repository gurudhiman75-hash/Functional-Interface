import assert from"node:assert/strict";
import{ENG013_AUTHORITIES_V1}from"../chapters/word-usage/ENG-013/eng-013-authorities-v1";
import{ENG013_BANKING_AUTHORITIES_V1}from"../chapters/word-usage/ENG-013/eng-013-banking-authorities-v1";
import{generateEng013Cp005SetV1,generateEng013QuestionV1}from"../chapters/word-usage/ENG-013/eng-013-v1";

const all=[...ENG013_AUTHORITIES_V1,...ENG013_BANKING_AUTHORITIES_V1];
assert.equal(all.length,96);
for(const cp of["ENG-013-CP001","ENG-013-CP002","ENG-013-CP003","ENG-013-CP004"]as const)assert.equal(all.filter(x=>x.cpId===cp).length,24);
assert.equal(new Set(all.map(x=>x.id)).size,96);

for(const a of all){
 assert.equal(a.sentences.length,4);
 assert.ok(a.answerIndex>=0&&a.answerIndex<4);
 const q=generateEng013QuestionV1({seed:`audit:${a.id}`,authorityId:a.id});
 const z=generateEng013QuestionV1({seed:`audit:${a.id}`,authorityId:a.id});
 assert.deepEqual(q,z);
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
 assert.equal(q.metadata.reviewOnly,true);
 assert.ok(q.explanation.length>100);
}
for(const p of["ssc-standard","ssc-advanced","banking-prelims","banking-mains"]as const){
 const x=generateEng013Cp005SetV1(`composer:${p}`,p);
 assert.equal(x.profile,p);
 assert.ok(x.question.correctOptionIndex>=0&&x.question.correctOptionIndex<4);
}
for(let i=0;i<10000;i++){
 const q=generateEng013QuestionV1({seed:`soak:${i}`});
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
}
console.log("ENG-013 audit source passed.",{authorities:96,soak:10000});
