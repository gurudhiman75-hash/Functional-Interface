import assert from"node:assert/strict";
import{ENG008_CP002_PASSAGES_V1,ENG008_CP002_QUESTION_AUTHORITIES_V1}from"../chapters/reading-comprehension/ENG-008/CP002/eng-008-cp002-authorities-v1";
import{ENG008_CP002_FAMILY_IDS_V1,generateEng008Cp002QuestionV1}from"../chapters/reading-comprehension/ENG-008/CP002/eng-008-cp002-v1";
import{ENG008_CP002_REMEDIATED_WAVE14_V1,ENG008_CP002_REMEDIATED_WAVE15_V1,ENG008_CP002_REMEDIATED_WAVE16_V1,ENG008_CP002_REMEDIATED_WAVE17_V1,ENG008_CP002_REMEDIATED_WAVE18_V1,ENG008_CP002_REMEDIATED_WAVE19_V1}from"../chapters/reading-comprehension/ENG-008/CP002/eng-008-cp002-remediation-waves14-19-v1";
const remediated=[...ENG008_CP002_REMEDIATED_WAVE14_V1,...ENG008_CP002_REMEDIATED_WAVE15_V1,...ENG008_CP002_REMEDIATED_WAVE16_V1,...ENG008_CP002_REMEDIATED_WAVE17_V1,...ENG008_CP002_REMEDIATED_WAVE18_V1,...ENG008_CP002_REMEDIATED_WAVE19_V1];
assert.equal(remediated.length,48);assert.equal(new Set(remediated.map(x=>x.id)).size,48);
for(const p of remediated){
  const n=p.text.trim().split(/\s+/).length;
  assert.ok(n>=220&&n<=350,`${p.id} remediation words=${n}`);
  assert.ok(p.text.includes("\n\n"),`${p.id} remediation must remain multi-paragraph`);
  assert.equal(p.questions.length,8);
  for(const q of p.questions){
    assert.ok(q.explanation.length>=85,`${q.id} remediation explanation too thin`);
    assert.equal(new Set([q.correctAnswer,...q.distractors].map(x=>x.toLowerCase())).size,4,`${q.id} remediation option collision`);
    assert.notEqual(q.explanation,"The answer follows from the passage's stated distinction and the evidence used to support it.");
  }
}
assert.equal(ENG008_CP002_PASSAGES_V1.length,130);assert.equal(new Set(ENG008_CP002_PASSAGES_V1.map(x=>x.id)).size,130);assert.equal(ENG008_CP002_QUESTION_AUTHORITIES_V1.length,1040);assert.equal(new Set(ENG008_CP002_QUESTION_AUTHORITIES_V1.map(x=>x.question.id)).size,1040);
const genres=new Map<string,number>(),families=new Map<string,number>(),diffs=new Set<string>();
for(const p of ENG008_CP002_PASSAGES_V1){genres.set(p.genre,(genres.get(p.genre)??0)+1);assert.equal(p.questions.length,8,`${p.id} question count`);assert.equal(new Set(p.questions.map(q=>q.familyId)).size,8,`${p.id} family breadth`);const wc=p.text.trim().split(/\s+/).length;assert.ok(wc>=220&&wc<=350,`${p.id} word count ${wc} outside SSC Editorial/Current-Affairs band`);assert.ok(p.text.includes("\n\n"),`${p.id} must be multi-paragraph`);for(const a of p.questions){families.set(a.familyId,(families.get(a.familyId)??0)+1);diffs.add(a.difficulty);assert.equal(a.distractors.length,3);assert.equal(new Set([a.correctAnswer,...a.distractors].map(x=>x.toLowerCase())).size,4,`${a.id} options collide`);assert.ok(a.explanation.length>=45,`${a.id} explanation too thin`);assert.ok(a.evidence.trim().length>=3,`${a.id} evidence too thin`);const x=generateEng008Cp002QuestionV1({seed:`audit:${a.id}`,difficulty:a.difficulty,authorityId:a.id}),y=generateEng008Cp002QuestionV1({seed:`audit:${a.id}`,difficulty:a.difficulty,authorityId:a.id});assert.deepEqual(x,y,`${a.id} replay`);assert.equal(x.options[x.correctOptionIndex],a.correctAnswer);}}
assert.deepEqual(Object.fromEntries(genres),{editorial:67,"current-affairs-report":63});for(const id of ENG008_CP002_FAMILY_IDS_V1)assert.equal(families.get(id),130,`${id} count`);assert.deepEqual([...diffs].sort(),["easy","hard","medium"]);
for(const d of["easy","medium","hard"]as const)for(let i=0;i<3200;i++){const q=generateEng008Cp002QuestionV1({seed:`soak:${d}:${i}`,difficulty:d});assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);assert.equal(q.metadata.difficulty,d);assert.equal(q.metadata.reviewOnly,true);}
console.log("ENG-008 CP002 editorial/current-affairs RC audit passed.",{passages:130,authorities:1040,remediatedPassages:48,soak:9600});