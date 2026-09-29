import assert from"node:assert/strict";
import{ENG010_CP_IDS_V1}from"../chapters/para-jumbles/ENG-010/eng-010-authorities-v1";
import{ENG010_ACTIVE_SETS_V2,ENG010_RETIRED_SSC_EXTENDED_V1}from"../chapters/para-jumbles/ENG-010/eng-010-active-v2";
import{ENG010_PRODUCTION_EXPANSION_COUNTS_V3}from"../chapters/para-jumbles/ENG-010/eng-010-production-expansion-v3";
import{generateEng010Cp005SetV1,generateEng010QuestionV1}from"../chapters/para-jumbles/ENG-010/eng-010-v1";

assert.equal(ENG010_ACTIVE_SETS_V2.length,450);
assert.deepEqual(ENG010_PRODUCTION_EXPANSION_COUNTS_V3,{cp001:96,cp002:96,cp003:76,cp004:86,total:354});

const expected=new Map([
 ["ENG-010-CP001",120],
 ["ENG-010-CP002",120],
 ["ENG-010-CP003",100],
 ["ENG-010-CP004",110]
]);
for(const cp of ENG010_CP_IDS_V1.slice(0,4)){
 const sets=ENG010_ACTIVE_SETS_V2.filter(x=>x.cpId===cp);
 assert.equal(sets.length,expected.get(cp),`${cp} active-set count`);
}
assert.equal(new Set(ENG010_ACTIVE_SETS_V2.map(x=>x.id)).size,450);
assert.equal(new Set(ENG010_ACTIVE_SETS_V2.map(x=>x.sentences.join("\u241f"))).size,450,"Every active paragraph signature must be unique");

for(const set of ENG010_ACTIVE_SETS_V2){
 if(set.cpId==="ENG-010-CP001"||set.cpId==="ENG-010-CP002"){
  assert.equal(set.sentences.length,4,"SSC Para Jumbles must use four complete sentences");
 }else{
  assert.ok(set.sentences.length===5||set.sentences.length===6,"Banking Para Jumbles must use five or six sentences");
 }
 assert.equal(set.order.length,set.sentences.length);
 assert.equal(new Set(set.order).size,set.order.length);
 assert.deepEqual([...set.order].sort((a,b)=>a-b),Array.from({length:set.sentences.length},(_,i)=>i+1));

 const q=generateEng010QuestionV1({seed:`audit:${set.id}`,setId:set.id});
 const z=generateEng010QuestionV1({seed:`audit:${set.id}`,setId:set.id});
 assert.deepEqual(q,z);
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.equal(q.options[q.correctOptionIndex],q.metadata.correctOrder);
 assert.equal(q.sentences.length,set.sentences.length);
 assert.equal(q.metadata.reviewOnly,true);
 assert.ok(q.explanation.length>140,"ENG-010 explanations should be simple and sufficiently detailed");
 assert.ok(Array.isArray(q.explanationEmphasis)&&q.explanationEmphasis.length>0,"ENG-010 explanations should expose emphasis cues");
 const identity=Array.from({length:q.sentences.length},(_,i)=>String.fromCharCode(65+i)).join("-");
 assert.notEqual(q.metadata.correctOrder,identity,"Displayed ENG-010 question must not leak an identity answer order");
}

for(const p of["ssc-standard","ssc-advanced","banking-prelims","banking-mains"]as const){
 const x=generateEng010Cp005SetV1(`composer:${p}`,p);
 assert.equal(x.profile,p);
 assert.ok(x.question.correctOptionIndex>=0&&x.question.correctOptionIndex<4);
}
for(let i=0;i<10000;i++){
 const q=generateEng010QuestionV1({seed:`soak:${i}`});
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
}
assert.equal(ENG010_RETIRED_SSC_EXTENDED_V1.length,48);
console.log("ENG-010 production-volume audit passed.",{activeSets:450,retiredExtendedSsc:48,soak:10000});
