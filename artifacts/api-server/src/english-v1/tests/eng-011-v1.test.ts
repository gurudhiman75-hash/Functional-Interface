import assert from"node:assert/strict";
import{ENG011_CP_IDS_V1}from"../chapters/sentence-rearrangement/ENG-011/eng-011-authorities-v1";
import{ENG011_ACTIVE_SETS_V2}from"../chapters/sentence-rearrangement/ENG-011/eng-011-active-v2";
import{ENG011_PRODUCTION_EXPANSION_COUNTS_V2}from"../chapters/sentence-rearrangement/ENG-011/eng-011-production-expansion-v2";
import{ENG011_SATURATION_COUNTS_V3}from"../chapters/sentence-rearrangement/ENG-011/eng-011-saturation-expansion-v3";
import{generateEng011Cp005SetV1,generateEng011QuestionV1}from"../chapters/sentence-rearrangement/ENG-011/eng-011-v1";
import{summarizeEng011AmbiguityV1}from"../chapters/sentence-rearrangement/ENG-011/eng-011-ambiguity-audit-v1";

assert.equal(ENG011_ACTIVE_SETS_V2.length,990);
assert.deepEqual(ENG011_PRODUCTION_EXPANSION_COUNTS_V2,{cp001:96,cp002:96,cp003:76,cp004:86,total:354});
assert.deepEqual(ENG011_SATURATION_COUNTS_V3,{cp001:144,cp002:144,cp003:117,cp004:135,total:540});

const expected=new Map([
 ["ENG-011-CP001",264],
 ["ENG-011-CP002",264],
 ["ENG-011-CP003",217],
 ["ENG-011-CP004",245]
]);
for(const cp of ENG011_CP_IDS_V1.slice(0,4)){
 const sets=ENG011_ACTIVE_SETS_V2.filter(x=>x.cpId===cp);
 assert.equal(sets.length,expected.get(cp),`${cp} active-set count`);
}
assert.equal(new Set(ENG011_ACTIVE_SETS_V2.map(x=>x.id)).size,990);
assert.equal(new Set(ENG011_ACTIVE_SETS_V2.map(x=>x.fragments.join("\u241f"))).size,450,"Every fragment signature must be unique");

for(const set of ENG011_ACTIVE_SETS_V2){
 if(set.cpId==="ENG-011-CP001")assert.ok(set.fragments.length===4||set.fragments.length===5,"SSC Standard must use four or five fragments");
 if(set.cpId==="ENG-011-CP002")assert.ok(set.fragments.length>=4&&set.fragments.length<=5,"SSC Advanced must use four or five fragments");
 if(set.cpId==="ENG-011-CP003")assert.ok(set.fragments.length>=4&&set.fragments.length<=5,"Banking Prelims must use four or five fragments");
 if(set.cpId==="ENG-011-CP004")assert.ok(set.fragments.length===5||set.fragments.length===6,"Banking Mains must use five or six fragments");
 assert.equal(set.order.length,set.fragments.length);
 assert.equal(new Set(set.order).size,set.order.length);
 assert.deepEqual([...set.order].sort((a,b)=>a-b),Array.from({length:set.fragments.length},(_,i)=>i+1));

 const q=generateEng011QuestionV1({seed:`audit:${set.id}`,setId:set.id});
 const z=generateEng011QuestionV1({seed:`audit:${set.id}`,setId:set.id});
 assert.deepEqual(q,z);
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.equal(q.options[q.correctOptionIndex],q.metadata.correctOrder);
 assert.equal(q.fragments.length,set.fragments.length);
 assert.equal(q.metadata.reviewOnly,true);
 assert.ok(q.explanation.length>180,"ENG-011 explanations should be simple and sufficiently detailed");
 assert.ok(Array.isArray(q.explanationEmphasis)&&q.explanationEmphasis.length>0,"ENG-011 explanations should expose emphasis cues");
 const identity=Array.from({length:q.fragments.length},(_,i)=>String.fromCharCode(65+i)).join("-");
 assert.notEqual(q.metadata.correctOrder,identity,"Displayed ENG-011 question must not leak an identity answer order");
}

const ambiguity=summarizeEng011AmbiguityV1(ENG011_ACTIVE_SETS_V2);
assert.equal(ambiguity.total,990);
assert.equal(ambiguity.severeCount,0,"No ENG-011 set may contain duplicate logical fragments");

for(const p of["ssc-standard","ssc-advanced","banking-prelims","banking-mains"]as const){
 const x=generateEng011Cp005SetV1(`composer:${p}`,p);
 assert.equal(x.profile,p);
 assert.ok(x.question.correctOptionIndex>=0&&x.question.correctOptionIndex<4);
}
for(let i=0;i<20000;i++){
 const q=generateEng011QuestionV1({seed:`soak:${i}`});
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
}
console.log("ENG-011 saturation audit passed.",{activeSets:990,soak:20000});
