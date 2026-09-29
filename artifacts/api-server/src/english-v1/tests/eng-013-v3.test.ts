import assert from"node:assert/strict";
import{ENG013_ACTIVE_AUTHORITIES_V3,ENG013_ACTIVE_COUNTS_V3}from"../chapters/word-usage/ENG-013/eng-013-active-v3";
import{ENG013_BREADTH2_SSC_STANDARD_V3}from"../chapters/word-usage/ENG-013/eng-013-breadth2-ssc-standard-v3";
import{ENG013_BREADTH2_SSC_ADVANCED_V3}from"../chapters/word-usage/ENG-013/eng-013-breadth2-ssc-advanced-v3";
import{ENG013_BREADTH2_BANKING_PRELIMS_V3}from"../chapters/word-usage/ENG-013/eng-013-breadth2-banking-prelims-v3";
import{ENG013_BREADTH2_BANKING_MAINS_V3}from"../chapters/word-usage/ENG-013/eng-013-breadth2-banking-mains-v3";
import{generateEng013Cp005SetV3,generateEng013QuestionV3}from"../chapters/word-usage/ENG-013/eng-013-v3";

assert.deepEqual(ENG013_ACTIVE_COUNTS_V3,{cp001:96,cp002:96,cp003:96,cp004:96,total:384,breadthWave1Added:144,breadthWave2Added:144});
assert.equal(ENG013_ACTIVE_AUTHORITIES_V3.length,384);
assert.equal(new Set(ENG013_ACTIVE_AUTHORITIES_V3.map(x=>x.id)).size,384);

for(const cp of["ENG-013-CP001","ENG-013-CP002","ENG-013-CP003","ENG-013-CP004"]as const){
 assert.equal(ENG013_ACTIVE_AUTHORITIES_V3.filter(x=>x.cpId===cp).length,96);
}

const wave2=[
 ...ENG013_BREADTH2_SSC_STANDARD_V3,
 ...ENG013_BREADTH2_SSC_ADVANCED_V3,
 ...ENG013_BREADTH2_BANKING_PRELIMS_V3,
 ...ENG013_BREADTH2_BANKING_MAINS_V3
];
assert.equal(wave2.length,144);
assert.equal(new Set(wave2.map(x=>x.word.toLowerCase())).size,144,"Wave 2 must add 144 distinct target words");

for(const a of ENG013_ACTIVE_AUTHORITIES_V3){
 assert.equal(a.sentences.length,4);
 assert.equal(new Set(a.sentences).size,4);
 assert.ok(a.answerIndex>=0&&a.answerIndex<4);
 const q=generateEng013QuestionV3({seed:`audit:${a.id}`,authorityId:a.id});
 const z=generateEng013QuestionV3({seed:`audit:${a.id}`,authorityId:a.id});
 assert.deepEqual(q,z);
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
 assert.equal(q.metadata.reviewOnly,true);
 assert.ok(q.explanation.length>90);
}

for(const p of["ssc-standard","ssc-advanced","banking-prelims","banking-mains"]as const){
 const x=generateEng013Cp005SetV3(`composer:${p}`,p);
 assert.equal(x.profile,p);
 assert.ok(x.question.correctOptionIndex>=0&&x.question.correctOptionIndex<4);
}

for(let i=0;i<30000;i++){
 const q=generateEng013QuestionV3({seed:`soak:${i}`});
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
}

console.log("ENG-013 breadth V3 audit source passed.",{authorities:384,wave2Added:144,soak:30000});
