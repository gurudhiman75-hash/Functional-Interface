import assert from"node:assert/strict";
import{ENG009_CP005_PASSAGES_V1,ENG009_CP005_BLANKS_V1}from"../chapters/cloze-test/ENG-009/CP005/eng-009-cp005-authorities-v1";
import{generateEng009Cp005QuestionV1,generateEng009Cp005SetV1,renderEng009Cp005Passage}from"../chapters/cloze-test/ENG-009/CP005/eng-009-cp005-v1";
assert.equal(ENG009_CP005_PASSAGES_V1.length,14);
assert.equal(ENG009_CP005_BLANKS_V1.length,84);
assert.equal(new Set(ENG009_CP005_PASSAGES_V1.map(x=>x.id)).size,14);
assert.equal(new Set(ENG009_CP005_BLANKS_V1.map(x=>x.blank.id)).size,84);
const modes=new Set<string>(),diffs=new Set<string>();
for(const p of ENG009_CP005_PASSAGES_V1){
 assert.equal(p.blanks.length,6);
 assert.equal(new Set(p.blanks.map(x=>x.blankNo)).size,6);
 assert.equal((renderEng009Cp005Passage(p.template).match(/____\(\d\)____/g)??[]).length,6);
 const wc=p.template.replace(/__\(\d\)__/g,"").trim().split(/\s+/).length;
 assert.ok(wc>=300&&wc<=540,`${p.id} word count ${wc} outside CP005 band`);
 for(const b of p.blanks){
  modes.add(b.mode);diffs.add(b.difficulty);
  assert.ok(b.accepted.length>=1);
  assert.ok(b.rejected.length>=1);
  assert.equal(new Set([...b.accepted,...b.rejected].map(x=>x.toLowerCase())).size,b.accepted.length+b.rejected.length);
  const q=generateEng009Cp005QuestionV1({seed:`audit:${b.id}`,blankId:b.id});
  const z=generateEng009Cp005QuestionV1({seed:`audit:${b.id}`,blankId:b.id});
  assert.deepEqual(q,z);
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);
 }
 const set=generateEng009Cp005SetV1(`set:${p.id}`,p.id);
 assert.equal(set.questions.length,6);
 assert.equal(new Set(set.questions.map(q=>q.metadata.blankNo)).size,6);
 assert.equal(new Set(set.questions.map(q=>q.passage)).size,1);
}
assert.deepEqual([...modes].sort(),["can-fit","cannot-fit","phrasal-word"]);
assert.deepEqual([...diffs].sort(),["hard","medium"]);
for(let i=0;i<6000;i++){const q=generateEng009Cp005QuestionV1({seed:`soak:${i}`});assert.equal(q.options.length,4);}
console.log("ENG-009 CP005 new-pattern cloze audit passed.",{passages:14,blanks:84,soak:6000});