import assert from"node:assert/strict";
import{ENG006_CP001_ENTRIES_V1}from"../chapters/one-word-substitution/ENG-006/CP001/eng-006-cp001-lexicon-v1";
import{generateEng006Cp001QuestionV1}from"../chapters/one-word-substitution/ENG-006/CP001/eng-006-cp001-v1";
import{ENG006_CP002_ENTRIES_V1}from"../chapters/one-word-substitution/ENG-006/CP002/eng-006-cp002-lexicon-v1";
import{generateEng006Cp002QuestionV1}from"../chapters/one-word-substitution/ENG-006/CP002/eng-006-cp002-v1";
import{ENG006_CP003_ENTRIES_V1}from"../chapters/one-word-substitution/ENG-006/CP003/eng-006-cp003-lexicon-v1";
import{generateEng006Cp003QuestionV1}from"../chapters/one-word-substitution/ENG-006/CP003/eng-006-cp003-v1";
import{ENG006_CP004_ENTRIES_V1}from"../chapters/one-word-substitution/ENG-006/CP004/eng-006-cp004-lexicon-v1";
import{generateEng006Cp004QuestionV1}from"../chapters/one-word-substitution/ENG-006/CP004/eng-006-cp004-v1";

const cps=[ENG006_CP001_ENTRIES_V1,ENG006_CP002_ENTRIES_V1,ENG006_CP003_ENTRIES_V1,ENG006_CP004_ENTRIES_V1] as const;
assert.deepEqual(cps.map(x=>x.length),[180,240,240,180]);
const all=cps.flatMap(x=>[...x]);
assert.equal(all.length,840);
assert.equal(new Set(all.map(x=>x.answer.toLowerCase())).size,840);
const norm=(v:string)=>v.toLowerCase().replace(/[^a-z0-9 ]/g,"").replace(/\s+/g," ").trim();
assert.equal(new Set(all.map(x=>norm(x.definition))).size,840);
for(const e of all){assert.ok(e.answer.trim().length>1);assert.ok(e.definition.trim().length>5);assert.ok(e.category.trim().length>2);}

const generators=[generateEng006Cp001QuestionV1,generateEng006Cp002QuestionV1,generateEng006Cp003QuestionV1,generateEng006Cp004QuestionV1] as const;
const seen=new Set<string>(),positions=[0,0,0,0];
for(let i=0;i<24000;i++){
  const cp=i%4,difficulty=(["easy","medium","hard"]as const)[i%3],generator=generators[cp]!;
  const q:any=generator({seed:`eng006-final:${i}`,difficulty});
  seen.add(`${cp+1}:${q.metadata.entryId}`);
  positions[q.correctOptionIndex]++;
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map((x:string)=>x.toLowerCase())).size,4);
}
assert.equal(seen.size,840);
for(const n of positions)assert.ok(n>=5400&&n<=6600,`Final answer-position imbalance: ${positions.join(",")}`);
console.log("ENG-006 final audit passed.",{substitutions:840,positions});
