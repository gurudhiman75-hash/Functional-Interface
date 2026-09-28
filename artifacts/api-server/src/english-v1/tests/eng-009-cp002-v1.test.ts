import assert from"node:assert/strict";
import{ENG009_CP002_PASSAGES_V1,ENG009_CP002_BLANKS_V1}from"../chapters/cloze-test/ENG-009/CP002/eng-009-cp002-authorities-v1";
import{generateEng009Cp002QuestionV1,generateEng009Cp002SetV1,renderEng009Cp002Passage}from"../chapters/cloze-test/ENG-009/CP002/eng-009-cp002-v1";

assert.equal(ENG009_CP002_PASSAGES_V1.length,18);
assert.equal(ENG009_CP002_BLANKS_V1.length,90);
assert.equal(new Set(ENG009_CP002_PASSAGES_V1.map(x=>x.id)).size,18);
assert.equal(new Set(ENG009_CP002_BLANKS_V1.map(x=>x.blank.id)).size,90);

const kinds=new Set<string>(),diffs=new Set<string>();
for(const p of ENG009_CP002_PASSAGES_V1){
 assert.equal(p.blanks.length,5,`${p.id} must have exactly five blanks`);
 assert.equal(new Set(p.blanks.map(x=>x.blankNo)).size,5,`${p.id} blank numbers must be unique`);
 const masked=renderEng009Cp002Passage(p.template);
 assert.equal((masked.match(/____\(\d\)____/g)??[]).length,5);
 const wc=p.template.replace(/__\(\d\)__/g,"").trim().split(/\s+/).length;
 assert.ok(wc>=130&&wc<=230,`${p.id} word count ${wc} outside advanced SSC band`);
 for(const b of p.blanks){
  kinds.add(b.kind);diffs.add(b.difficulty);
  assert.equal(new Set([b.answer,...b.distractors].map(x=>x.toLowerCase())).size,4,`${b.id} option collision`);
  assert.ok(b.explanation.length>=45);
  assert.ok(b.clue.length>=15);
  const a=generateEng009Cp002QuestionV1({seed:`audit:${b.id}`,blankId:b.id});
  const z=generateEng009Cp002QuestionV1({seed:`audit:${b.id}`,blankId:b.id});
  assert.deepEqual(a,z);
  assert.equal(a.options[a.correctOptionIndex],b.answer);
  assert.equal(a.metadata.reviewOnly,true);
 }
 const set=generateEng009Cp002SetV1(`set:${p.id}`,p.id);
 assert.equal(set.questions.length,5);
 assert.equal(new Set(set.questions.map(q=>q.metadata.blankNo)).size,5);
 assert.equal(new Set(set.questions.map(q=>q.passage)).size,1);
}
assert.deepEqual([...kinds].sort(),["collocation","context","discourse","grammar","vocabulary"]);
assert.deepEqual([...diffs].sort(),["hard","medium"]);
for(let i=0;i<4000;i++){
 const q=generateEng009Cp002QuestionV1({seed:`soak:${i}`});
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);
}
console.log("ENG-009 CP002 SSC advanced cloze audit passed.",{passages:18,blanks:90,soak:4000});