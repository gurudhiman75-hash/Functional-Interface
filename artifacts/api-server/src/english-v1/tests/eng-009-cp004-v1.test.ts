import assert from"node:assert/strict";
import{ENG009_CP004_PASSAGES_V1,ENG009_CP004_BLANKS_V1}from"../chapters/cloze-test/ENG-009/CP004/eng-009-cp004-authorities-v1";
import{generateEng009Cp004QuestionV1,generateEng009Cp004SetV1,renderEng009Cp004Passage}from"../chapters/cloze-test/ENG-009/CP004/eng-009-cp004-v1";
assert.equal(ENG009_CP004_PASSAGES_V1.length,16);
assert.equal(ENG009_CP004_BLANKS_V1.length,96);
assert.equal(new Set(ENG009_CP004_PASSAGES_V1.map(x=>x.id)).size,16);
assert.equal(new Set(ENG009_CP004_BLANKS_V1.map(x=>x.blank.id)).size,96);
const kinds=new Set<string>(),diffs=new Set<string>();
for(const p of ENG009_CP004_PASSAGES_V1){
 assert.equal(p.blanks.length,6);
 assert.equal(new Set(p.blanks.map(x=>x.blankNo)).size,6);
 const masked=renderEng009Cp004Passage(p.template);
 assert.equal((masked.match(/____\(\d\)____/g)??[]).length,6);
 const wc=p.template.replace(/__\(\d\)__/g,"").trim().split(/\s+/).length;
 assert.ok(wc>=300&&wc<=520,`${p.id} word count ${wc} outside Banking Mains band`);
 for(const b of p.blanks){
  kinds.add(b.kind);diffs.add(b.difficulty);
  assert.equal(new Set([b.answer,...b.distractors].map(x=>x.toLowerCase())).size,4,`${b.id} option collision`);
  assert.ok(b.explanation.length>=30);
  assert.ok(b.clue.length>=12);
  const a=generateEng009Cp004QuestionV1({seed:`audit:${b.id}`,blankId:b.id});
  const z=generateEng009Cp004QuestionV1({seed:`audit:${b.id}`,blankId:b.id});
  assert.deepEqual(a,z);assert.equal(a.options[a.correctOptionIndex],b.answer);
 }
 const set=generateEng009Cp004SetV1(`set:${p.id}`,p.id);
 assert.equal(set.questions.length,6);
 assert.equal(new Set(set.questions.map(q=>q.metadata.blankNo)).size,6);
 assert.equal(new Set(set.questions.map(q=>q.passage)).size,1);
}
assert.deepEqual([...kinds].sort(),["collocation","context","discourse","logic-link","phrase-fit","vocabulary"]);
assert.deepEqual([...diffs].sort(),["hard","medium"]);
for(let i=0;i<6000;i++){const q=generateEng009Cp004QuestionV1({seed:`soak:${i}`});assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);}
console.log("ENG-009 CP004 Banking Mains cloze audit passed.",{passages:16,blanks:96,soak:6000});