import assert from"node:assert/strict";
import{ENG012_AUTHORITIES_V1}from"../chapters/word-swap/ENG-012/eng-012-authorities-v1";
import{generateEng012QuestionV1}from"../chapters/word-swap/ENG-012/eng-012-v1";

assert.equal(ENG012_AUTHORITIES_V1.length,48);
assert.equal(ENG012_AUTHORITIES_V1.filter(x=>x.cpId==="ENG-012-CP001").length,24);
assert.equal(ENG012_AUTHORITIES_V1.filter(x=>x.cpId==="ENG-012-CP002").length,24);
assert.equal(new Set(ENG012_AUTHORITIES_V1.map(x=>x.id)).size,48);

for(const a of ENG012_AUTHORITIES_V1){
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
for(let i=0;i<5000;i++){
 const q=generateEng012QuestionV1({seed:`soak:${i}`});
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
}
console.log("ENG-012 CP001-CP002 audit source passed.",{authorities:48,surfaces:144,soak:5000});
