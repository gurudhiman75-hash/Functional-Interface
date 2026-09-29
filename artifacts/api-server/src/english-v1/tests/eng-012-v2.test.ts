import assert from"node:assert/strict";
import{ENG012_ACTIVE_AUTHORITIES_V2,ENG012_ACTIVE_COUNTS_V2}from"../chapters/word-swap/ENG-012/eng-012-active-v2";
import{generateEng012Cp005SetV2,generateEng012QuestionV2}from"../chapters/word-swap/ENG-012/eng-012-v2";

assert.deepEqual(ENG012_ACTIVE_COUNTS_V2,{cp001:120,cp002:120,cp003:100,cp004:110,total:450,surfaces:1350});
assert.equal(ENG012_ACTIVE_AUTHORITIES_V2.length,450);
assert.equal(new Set(ENG012_ACTIVE_AUTHORITIES_V2.map(x=>x.id)).size,450);

const expected=new Map([
 ["ENG-012-CP001",120],
 ["ENG-012-CP002",120],
 ["ENG-012-CP003",100],
 ["ENG-012-CP004",110]
]);
for(const [cp,count] of expected){
 assert.equal(ENG012_ACTIVE_AUTHORITIES_V2.filter(x=>x.cpId===cp).length,count);
}
for(const a of ENG012_ACTIVE_AUTHORITIES_V2){
 assert.equal(a.natural.length,4);
 assert.equal(a.variants?.length,2);
 assert.notEqual(a.swap[0],a.swap[1]);
 const q=generateEng012QuestionV2({seed:`audit:${a.id}`,authorityId:a.id});
 const z=generateEng012QuestionV2({seed:`audit:${a.id}`,authorityId:a.id});
 assert.deepEqual(q,z);
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.equal(q.options[q.correctOptionIndex],q.metadata.correctSwap);
 assert.equal(q.metadata.reviewOnly,true);
 assert.ok(q.explanation.length>120);
 assert.ok(q.explanationEmphasis.length>0);
 const displayed=q.sentence.replace(/\([A-D]\)\s*/g,"").replace(/[.]/g,"").trim();
 const corrected=q.metadata.correctedSentence.replace(/[.]/g,"").trim();
 assert.notEqual(displayed,corrected,"Displayed sentence must actually contain a misplaced pair");
}
for(const p of["ssc-standard","ssc-advanced","banking-prelims","banking-mains"]as const){
 const x=generateEng012Cp005SetV2(`composer:${p}`,p);
 assert.equal(x.profile,p);
 assert.ok(x.question.correctOptionIndex>=0&&x.question.correctOptionIndex<4);
}
for(let i=0;i<20000;i++){
 const q=generateEng012QuestionV2({seed:`soak:${i}`});
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
}
console.log("ENG-012 production V2 audit source passed.",{authorities:450,surfaces:1350,soak:20000});
