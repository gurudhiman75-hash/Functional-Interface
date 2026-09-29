import assert from"node:assert/strict";
import{ENG010_CP_IDS_V1,ENG010_SETS_V1}from"../chapters/para-jumbles/ENG-010/eng-010-authorities-v1";
import{generateEng010Cp005SetV1,generateEng010QuestionV1}from"../chapters/para-jumbles/ENG-010/eng-010-v1";

assert.equal(ENG010_SETS_V1.length,32);
for(const cp of ENG010_CP_IDS_V1.slice(0,4)){
 const sets=ENG010_SETS_V1.filter(x=>x.cpId===cp);
 assert.equal(sets.length,8,`${cp} must have four authority sets in V1`);
}
assert.equal(new Set(ENG010_SETS_V1.map(x=>x.id)).size,32);
for(const set of ENG010_SETS_V1){
 assert.ok(set.sentences.length===5||set.sentences.length===6);
 assert.equal(set.order.length,set.sentences.length);
 assert.equal(new Set(set.order).size,set.order.length);
 assert.deepEqual([...set.order].sort((a,b)=>a-b),Array.from({length:set.sentences.length},(_,i)=>i+1));
 assert.ok(set.explanation.length>50);
 const q=generateEng010QuestionV1({seed:`audit:${set.id}`,setId:set.id});
 const z=generateEng010QuestionV1({seed:`audit:${set.id}`,setId:set.id});
 assert.deepEqual(q,z);
 assert.equal(q.options.length,8);
 assert.equal(new Set(q.options).size,4);
 assert.equal(q.options[q.correctOptionIndex],q.metadata.correctOrder);
 assert.equal(q.sentences.length,set.sentences.length);
 assert.equal(q.metadata.reviewOnly,true);
}
for(const p of["ssc-standard","ssc-advanced","banking-prelims","banking-mains"]as const){
 const c=generateEng010Cp005SetV1(`composer:${p}`,p);
 assert.equal(c.profile,p);
 assert.ok(c.question.correctOptionIndex>=0&&c.question.correctOptionIndex<4);
}
for(let i=0;i<4000;i++){
 const q=generateEng010QuestionV1({seed:`soak:${i}`});
 assert.equal(q.options.length,8);
 assert.equal(new Set(q.options).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
}
console.log("ENG-010 Para Jumbles authority/generator audit passed.",{sets:32,soak:4000});
