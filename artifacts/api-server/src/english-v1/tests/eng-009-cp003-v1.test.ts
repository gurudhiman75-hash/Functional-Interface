import assert from"node:assert/strict";
import{ENG009_CP003_PASSAGES_V1,ENG009_CP003_BLANKS_V1}from"../chapters/cloze-test/ENG-009/CP003/eng-009-cp003-authorities-v1";
import{generateEng009Cp003QuestionV1,generateEng009Cp003SetV1,renderEng009Cp003Passage}from"../chapters/cloze-test/ENG-009/CP003/eng-009-cp003-v1";
assert.equal(ENG009_CP003_PASSAGES_V1.length,10);
assert.equal(ENG009_CP003_BLANKS_V1.length,60);
assert.equal(new Set(ENG009_CP003_PASSAGES_V1.map(x=>x.id)).size,10);
assert.equal(new Set(ENG009_CP003_BLANKS_V1.map(x=>x.blank.id)).size,60);
const kinds=new Set<string>(),diffs=new Set<string>();
for(const p of ENG009_CP003_PASSAGES_V1){
 assert.equal(p.blanks.length,6);
 assert.equal(new Set(p.blanks.map(x=>x.blankNo)).size,6);
 const masked=renderEng009Cp003Passage(p.template);
 assert.equal((masked.match(/____\(\d\)____/g)??[]).length,6);
 const wc=p.template.replace(/__\(\d\)__/g,"").trim().split(/\s+/).length;
 assert.ok(wc>=170&&wc<=290,`${p.id} word count ${wc} outside Banking Prelims band`);
 for(const b of p.blanks){
  kinds.add(b.kind);diffs.add(b.difficulty);
  assert.equal(new Set([b.answer,...b.distractors].map(x=>x.toLowerCase())).size,4);
  assert.ok(b.explanation.length>=35);
  assert.ok(b.clue.length>=12);
  const a=generateEng009Cp003QuestionV1({seed:`audit:${b.id}`,blankId:b.id});
  const z=generateEng009Cp003QuestionV1({seed:`audit:${b.id}`,blankId:b.id});
  assert.deepEqual(a,z);assert.equal(a.options[a.correctOptionIndex],b.answer);
 }
 const set=generateEng009Cp003SetV1(`set:${p.id}`,p.id);
 assert.equal(set.questions.length,6);
 assert.equal(new Set(set.questions.map(q=>q.metadata.blankNo)).size,6);
 assert.equal(new Set(set.questions.map(q=>q.passage)).size,1);
}
assert.deepEqual([...kinds].sort(),["collocation","context","discourse","grammar","phrase-fit","vocabulary"]);
assert.deepEqual([...diffs].sort(),["hard","medium"]);
for(let i=0;i<5000;i++){const q=generateEng009Cp003QuestionV1({seed:`soak:${i}`});assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);}
console.log("ENG-009 CP003 Banking Prelims cloze audit passed.",{passages:10,blanks:60,soak:5000});