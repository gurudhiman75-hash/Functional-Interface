import assert from"node:assert/strict";
import{ENG013_ACTIVE_AUTHORITIES_V4,ENG013_ACTIVE_COUNTS_V4,ENG013_BREADTH_WAVE3_V4}from"../chapters/word-usage/ENG-013/eng-013-active-v4";
import{generateEng013Cp005SetV4,generateEng013QuestionV4}from"../chapters/word-usage/ENG-013/eng-013-v4";

assert.deepEqual(ENG013_ACTIVE_COUNTS_V4,{cp001:192,cp002:192,cp003:192,cp004:192,total:768,previous:384,doublingWaveAdded:384});
assert.equal(ENG013_ACTIVE_AUTHORITIES_V4.length,768);
assert.equal(new Set(ENG013_ACTIVE_AUTHORITIES_V4.map(x=>x.id)).size,768);
assert.equal(ENG013_BREADTH_WAVE3_V4.length,384);
assert.equal(new Set(ENG013_BREADTH_WAVE3_V4.map(x=>x.word.toLowerCase())).size,384);

for(const cp of["ENG-013-CP001","ENG-013-CP002","ENG-013-CP003","ENG-013-CP004"]as const){
 assert.equal(ENG013_ACTIVE_AUTHORITIES_V4.filter(x=>x.cpId===cp).length,192);
}
for(const a of ENG013_ACTIVE_AUTHORITIES_V4){
 assert.equal(a.sentences.length,4);
 assert.equal(new Set(a.sentences).size,4);
 assert.ok(a.answerIndex>=0&&a.answerIndex<4);
 const q=generateEng013QuestionV4({seed:`audit:${a.id}`,authorityId:a.id});
 const z=generateEng013QuestionV4({seed:`audit:${a.id}`,authorityId:a.id});
 assert.deepEqual(q,z);
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
 assert.equal(q.metadata.reviewOnly,true);
 assert.ok(q.explanation.length>80);
}
for(const p of["ssc-standard","ssc-advanced","banking-prelims","banking-mains"]as const){
 const x=generateEng013Cp005SetV4(`composer:${p}`,p);
 assert.equal(x.profile,p);
 assert.ok(x.question.correctOptionIndex>=0&&x.question.correctOptionIndex<4);
}
for(let i=0;i<30000;i++){
 const q=generateEng013QuestionV4({seed:`soak:${i}`});
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
}
console.log("ENG-013 V4 doubling audit source passed.",{authorities:768,doublingWave:384,soak:30000});
