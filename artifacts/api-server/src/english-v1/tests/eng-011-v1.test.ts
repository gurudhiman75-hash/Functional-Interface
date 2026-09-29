import assert from"node:assert/strict";
import{ENG011_CP_IDS_V1,ENG011_SETS_V1}from"../chapters/sentence-rearrangement/ENG-011/eng-011-authorities-v1";
import{generateEng011Cp005SetV1,generateEng011QuestionV1}from"../chapters/sentence-rearrangement/ENG-011/eng-011-v1";

assert.equal(ENG011_SETS_V1.length,48);
for(const cp of ENG011_CP_IDS_V1.slice(0,4)){
 const sets=ENG011_SETS_V1.filter(x=>x.cpId===cp);
 assert.equal(sets.length,12,`${cp} must have twelve authority sets`);
}
assert.equal(new Set(ENG011_SETS_V1.map(x=>x.id)).size,48);
for(const set of ENG011_SETS_V1){
 assert.ok(set.fragments.length>=4&&set.fragments.length<=6);
 assert.equal(set.order.length,set.fragments.length);
 assert.equal(new Set(set.order).size,set.order.length);
 assert.deepEqual([...set.order].sort((a,b)=>a-b),Array.from({length:set.fragments.length},(_,i)=>i+1));
 assert.ok(set.explanation.length>45);
 const q=generateEng011QuestionV1({seed:`audit:${set.id}`,setId:set.id});
 const z=generateEng011QuestionV1({seed:`audit:${set.id}`,setId:set.id});
 assert.deepEqual(q,z);assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
 assert.equal(q.options[q.correctOptionIndex],q.metadata.correctOrder);assert.equal(q.metadata.reviewOnly,true);
}
for(const p of["ssc-standard","ssc-advanced","banking-prelims","banking-mains"]as const){
 const x=generateEng011Cp005SetV1(`composer:${p}`,p);assert.equal(x.profile,p);assert.ok(x.question.correctOptionIndex>=0);
}
for(let i=0;i<4000;i++){const q=generateEng011QuestionV1({seed:`soak:${i}`});assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);}
console.log("ENG-011 Sentence Rearrangement audit passed.",{sets:48,soak:4000});
