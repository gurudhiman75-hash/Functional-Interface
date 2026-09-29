import assert from"node:assert/strict";
import{ENG010_CP_IDS_V1}from"../chapters/para-jumbles/ENG-010/eng-010-authorities-v1";
import{ENG010_ACTIVE_SETS_V2,ENG010_RETIRED_SSC_EXTENDED_V1}from"../chapters/para-jumbles/ENG-010/eng-010-active-v2";
import{generateEng010Cp005SetV1,generateEng010QuestionV1}from"../chapters/para-jumbles/ENG-010/eng-010-v1";

assert.equal(ENG010_ACTIVE_SETS_V2.length,96);
for(const cp of ENG010_CP_IDS_V1.slice(0,4)){
 const sets=ENG010_ACTIVE_SETS_V2.filter(x=>x.cpId===cp);
 assert.equal(sets.length,24,`${cp} must have twenty-four authority sets in V1`);
}
assert.equal(new Set(ENG010_ACTIVE_SETS_V2.map(x=>x.id)).size,96);
for(const set of ENG010_ACTIVE_SETS_V2){
 if(set.cpId==="ENG-010-CP001"||set.cpId==="ENG-010-CP002")assert.equal(set.sentences.length,4,"SSC Para Jumbles must use four complete sentences"); else assert.ok(set.sentences.length===5||set.sentences.length===6);
 assert.equal(set.order.length,set.sentences.length);
 assert.equal(new Set(set.order).size,set.order.length);
 assert.deepEqual([...set.order].sort((a,b)=>a-b),Array.from({length:set.sentences.length},(_,i)=>i+1));
 assert.ok(set.explanation.length>50);
 const q=generateEng010QuestionV1({seed:`audit:${set.id}`,setId:set.id});
 const z=generateEng010QuestionV1({seed:`audit:${set.id}`,setId:set.id});
 assert.deepEqual(q,z);
 assert.equal(q.options.length,4);
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
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
}
assert.equal(ENG010_RETIRED_SSC_EXTENDED_V1.length,48);
console.log("ENG-010 Para Jumbles active-profile audit passed.",{activeSets:96,retiredExtendedSsc:48,soak:4000});
