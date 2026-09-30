import assert from"node:assert/strict";
import{ENG009_CP005_PASSAGES_V1,ENG009_CP005_BLANKS_V1}from"../chapters/cloze-test/ENG-009/CP005/eng-009-cp005-authorities-v1";
import{generateEng009Cp005QuestionV1,generateEng009Cp005SetV1,renderEng009Cp005Passage}from"../chapters/cloze-test/ENG-009/CP005/eng-009-cp005-v1";
assert.equal(ENG009_CP005_PASSAGES_V1.length,18);
assert.equal(ENG009_CP005_BLANKS_V1.length,108);
assert.equal(new Set(ENG009_CP005_PASSAGES_V1.map(x=>x.id)).size,18);
assert.equal(new Set(ENG009_CP005_BLANKS_V1.map(x=>x.blank.id)).size,108);
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
  if(b.mode==="can-fit"){
   assert.match(q.prompt,/Which group contains only words/i);
   assert.ok(b.accepted.length>=3);
   const accepted=new Set(b.accepted.slice(0,3).map(x=>x.toLowerCase()));
   const rejected=b.rejected[0]!.toLowerCase();
   const correct=q.options[q.correctOptionIndex]!;
   const correctWords=correct.split(",").map(x=>x.trim().toLowerCase());
   assert.deepEqual(new Set(correctWords),accepted,`${b.id} keyed group must contain the three approved fitting words`);
   assert.ok(!correctWords.includes(rejected),`${b.id} keyed can-fit group contains rejected word`);
   for(const [index,option] of q.options.entries()){
    if(index===q.correctOptionIndex)continue;
    const words=option.split(",").map(x=>x.trim().toLowerCase());
    assert.ok(words.includes(rejected),`${b.id} distractor group must include the rejected word`);
   }
  }
  if(b.mode==="cannot-fit"){
   assert.equal(q.options[q.correctOptionIndex]!.toLowerCase(),b.rejected[0]!.toLowerCase());
   assert.ok(q.options.filter((_,i)=>i!==q.correctOptionIndex).every(option=>b.accepted.map(x=>x.toLowerCase()).includes(option.toLowerCase())));
  }
 }
 const set=generateEng009Cp005SetV1(`set:${p.id}`,p.id);
 assert.equal(set.questions.length,6);
 assert.equal(new Set(set.questions.map(q=>q.metadata.blankNo)).size,6);
 assert.equal(new Set(set.questions.map(q=>q.passage)).size,1);
}
assert.deepEqual([...modes].sort(),["can-fit","cannot-fit","phrasal-word"]);
assert.deepEqual([...diffs].sort(),["hard","medium"]);
for(let i=0;i<6000;i++){const q=generateEng009Cp005QuestionV1({seed:`soak:${i}`});assert.equal(q.options.length,4);}
console.log("ENG-009 CP005 new-pattern cloze audit passed.",{passages:18,blanks:108,soak:6000});