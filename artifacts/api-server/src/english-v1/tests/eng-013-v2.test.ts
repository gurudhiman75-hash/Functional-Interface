import assert from"node:assert/strict";
import{ENG013_ACTIVE_AUTHORITIES_V2,ENG013_ACTIVE_COUNTS_V2}from"../chapters/word-usage/ENG-013/eng-013-active-v2";
import{ENG013_BREADTH_SSC_STANDARD_V2}from"../chapters/word-usage/ENG-013/eng-013-breadth-ssc-standard-v2";
import{ENG013_BREADTH_SSC_ADVANCED_V2}from"../chapters/word-usage/ENG-013/eng-013-breadth-ssc-advanced-v2";
import{ENG013_BREADTH_BANKING_PRELIMS_V2}from"../chapters/word-usage/ENG-013/eng-013-breadth-banking-prelims-v2";
import{ENG013_BREADTH_BANKING_MAINS_V2}from"../chapters/word-usage/ENG-013/eng-013-breadth-banking-mains-v2";
import{generateEng013Cp005SetV2,generateEng013QuestionV2}from"../chapters/word-usage/ENG-013/eng-013-v2";

assert.deepEqual(ENG013_ACTIVE_COUNTS_V2,{cp001:60,cp002:60,cp003:60,cp004:60,total:240,breadthAdded:144});
assert.equal(ENG013_ACTIVE_AUTHORITIES_V2.length,240);
assert.equal(new Set(ENG013_ACTIVE_AUTHORITIES_V2.map(x=>x.id)).size,240);

for(const cp of["ENG-013-CP001","ENG-013-CP002","ENG-013-CP003","ENG-013-CP004"]as const){
 assert.equal(ENG013_ACTIVE_AUTHORITIES_V2.filter(x=>x.cpId===cp).length,60);
}

const breadth=[
 ...ENG013_BREADTH_SSC_STANDARD_V2,
 ...ENG013_BREADTH_SSC_ADVANCED_V2,
 ...ENG013_BREADTH_BANKING_PRELIMS_V2,
 ...ENG013_BREADTH_BANKING_MAINS_V2
];
assert.equal(breadth.length,144);
assert.equal(new Set(breadth.map(x=>x.word.toLowerCase())).size,144,"Breadth wave must add distinct target words");

for(const a of ENG013_ACTIVE_AUTHORITIES_V2){
 assert.equal(a.sentences.length,4);
 assert.equal(new Set(a.sentences).size,4);
 assert.ok(a.answerIndex>=0&&a.answerIndex<4);
 const q=generateEng013QuestionV2({seed:`audit:${a.id}`,authorityId:a.id});
 const z=generateEng013QuestionV2({seed:`audit:${a.id}`,authorityId:a.id});
 assert.deepEqual(q,z);
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
 assert.equal(q.metadata.reviewOnly,true);
 assert.ok(q.explanation.length>90);
}

for(const p of["ssc-standard","ssc-advanced","banking-prelims","banking-mains"]as const){
 const x=generateEng013Cp005SetV2(`composer:${p}`,p);
 assert.equal(x.profile,p);
 assert.ok(x.question.correctOptionIndex>=0&&x.question.correctOptionIndex<4);
}

for(let i=0;i<20000;i++){
 const q=generateEng013QuestionV2({seed:`soak:${i}`});
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
}

console.log("ENG-013 breadth V2 audit source passed.",{authorities:240,breadthAdded:144,soak:20000});
