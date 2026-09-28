import assert from"node:assert/strict";
import{ENG009_CP001_PASSAGES_V1,ENG009_CP001_BLANKS_V1}from"../chapters/cloze-test/ENG-009/CP001/eng-009-cp001-authorities-v1";
import{generateEng009Cp001QuestionV1,generateEng009Cp001SetV1,renderEng009Cp001Passage}from"../chapters/cloze-test/ENG-009/CP001/eng-009-cp001-v1";

assert.equal(ENG009_CP001_PASSAGES_V1.length,14);
assert.equal(ENG009_CP001_BLANKS_V1.length,70);
assert.equal(new Set(ENG009_CP001_PASSAGES_V1.map(x=>x.id)).size,14);
assert.equal(new Set(ENG009_CP001_BLANKS_V1.map(x=>x.blank.id)).size,70);

const kinds=new Set<string>(),diffs=new Set<string>();
for(const p of ENG009_CP001_PASSAGES_V1){
 assert.equal(p.blanks.length,5,`${p.id} must have exactly five blanks`);
 assert.equal(new Set(p.blanks.map(x=>x.blankNo)).size,5,`${p.id} blank numbers must be unique`);
 const masked=renderEng009Cp001Passage(p.template);
 assert.equal((masked.match(/____\(\d\)____/g)??[]).length,5,`${p.id} must render five masks`);
 assert.ok(!/__\(\d\)__/.test(masked));
 const wc=p.template.replace(/__\(\d\)__/g,"").trim().split(/\s+/).length;
 assert.ok(wc>=90&&wc<=180,`${p.id} word count ${wc} outside SSC cloze foundation band`);
 for(const b of p.blanks){
  kinds.add(b.kind);diffs.add(b.difficulty);
  assert.equal(b.distractors.length,3);
  assert.equal(new Set([b.answer,...b.distractors].map(x=>x.toLowerCase())).size,4,`${b.id} option collision`);
  assert.ok(b.explanation.length>=45,`${b.id} explanation too thin`);
  assert.ok(b.clue.length>=15,`${b.id} clue too thin`);
  const a=generateEng009Cp001QuestionV1({seed:`audit:${b.id}`,blankId:b.id});
  const z=generateEng009Cp001QuestionV1({seed:`audit:${b.id}`,blankId:b.id});
  assert.deepEqual(a,z,`${b.id} deterministic replay failed`);
  assert.equal(a.options[a.correctOptionIndex],b.answer);
  assert.equal(a.metadata.reviewOnly,true);
 }
 const set=generateEng009Cp001SetV1(`set:${p.id}`,p.id);
 assert.equal(set.questions.length,5);
 assert.equal(set.passageId,p.id);
 assert.equal(new Set(set.questions.map(q=>q.metadata.blankNo)).size,5);
 assert.equal(new Set(set.questions.map(q=>q.passage)).size,1);
}
assert.deepEqual([...kinds].sort(),["collocation","context","grammar","vocabulary"]);
assert.deepEqual([...diffs].sort(),["easy","medium"]);
for(let i=0;i<3000;i++){
 const q=generateEng009Cp001QuestionV1({seed:`soak:${i}`});
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);
 assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
}
console.log("ENG-009 CP001 SSC cloze audit passed.",{passages:14,blanks:70,soak:3000});