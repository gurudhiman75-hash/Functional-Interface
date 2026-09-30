import assert from"node:assert/strict";
import{ENG008_CP005_PASSAGES_V1,ENG008_CP005_QUESTION_AUTHORITIES_V1}from"../chapters/reading-comprehension/ENG-008/CP005/eng-008-cp005-authorities-v1";
import{ENG008_CP005_FAMILY_IDS_V1,generateEng008Cp005QuestionV1}from"../chapters/reading-comprehension/ENG-008/CP005/eng-008-cp005-v1";
import{ENG008_CP005_REMEDIATED_WAVE14_V1,ENG008_CP005_REMEDIATED_WAVE15_V1,ENG008_CP005_REMEDIATED_WAVE16_V1,ENG008_CP005_REMEDIATED_WAVE17_V1,ENG008_CP005_REMEDIATED_WAVE18_V1,ENG008_CP005_REMEDIATED_WAVE19_V1}from"../chapters/reading-comprehension/ENG-008/CP005/eng-008-cp005-remediation-waves14-19-v1";
const remediated=[...ENG008_CP005_REMEDIATED_WAVE14_V1,...ENG008_CP005_REMEDIATED_WAVE15_V1,...ENG008_CP005_REMEDIATED_WAVE16_V1,...ENG008_CP005_REMEDIATED_WAVE17_V1,...ENG008_CP005_REMEDIATED_WAVE18_V1,...ENG008_CP005_REMEDIATED_WAVE19_V1];
assert.equal(remediated.length,48);assert.equal(new Set(remediated.map(x=>x.id)).size,48);
for(const p of remediated){
 const n=p.text.trim().split(/\s+/).length,pc=p.text.split(/\n\n+/).filter(Boolean).length;
 assert.ok(n>=380&&n<=520,`${p.id} remediation words=${n}`);
 assert.ok(pc>=6&&pc<=8,`${p.id} remediation paras=${pc}`);
 assert.equal(p.questions.length,8);
 for(const q of p.questions){
  assert.ok(q.explanation.length>=90,`${q.id} remediation explanation too thin`);
  assert.equal(new Set([q.correctAnswer,...q.distractors].map(x=>x.toLowerCase())).size,4,`${q.id} remediation option collision`);
  assert.notEqual(q.explanation,"The answer stays within the evidence described in the passage and does not extend beyond the reported comparison.");
 }
}
assert.equal(ENG008_CP005_PASSAGES_V1.length,124);assert.equal(ENG008_CP005_QUESTION_AUTHORITIES_V1.length,992);assert.equal(new Set(ENG008_CP005_QUESTION_AUTHORITIES_V1.map(x=>x.question.id)).size,992);
const fam=new Map<string,number>(),diff=new Map<string,number>(),genres=new Set<string>();
for(const p of ENG008_CP005_PASSAGES_V1){genres.add(p.genre);const wc=p.text.trim().split(/\s+/).length,pc=p.text.split(/\n\n+/).filter(Boolean).length;assert.ok(wc>=380&&wc<=520,`${p.id} words=${wc}`);assert.ok(pc>=6&&pc<=8,`${p.id} paras=${pc}`);assert.equal(p.questions.length,8);assert.equal(new Set(p.questions.map(q=>q.familyId)).size,8);for(const a of p.questions){fam.set(a.familyId,(fam.get(a.familyId)??0)+1);diff.set(a.difficulty,(diff.get(a.difficulty)??0)+1);assert.equal(new Set([a.correctAnswer,...a.distractors].map(x=>x.toLowerCase())).size,4);assert.ok(a.explanation.length>=45);assert.ok(a.evidence.trim().length>=3);const x=generateEng008Cp005QuestionV1({seed:`audit:${a.id}`,difficulty:a.difficulty,authorityId:a.id}),y=generateEng008Cp005QuestionV1({seed:`audit:${a.id}`,difficulty:a.difficulty,authorityId:a.id});assert.deepEqual(x,y);assert.equal(x.options[x.correctOptionIndex],a.correctAnswer);}}
assert.equal(genres.size,6);for(const id of ENG008_CP005_FAMILY_IDS_V1)assert.equal(fam.get(id),124);assert.deepEqual(Object.fromEntries(diff),{medium:496,hard:496});
for(const d of["medium","hard"]as const)for(let i=0;i<2400;i++){const q=generateEng008Cp005QuestionV1({seed:`soak:${d}:${i}`,difficulty:d});assert.equal(q.options.length,4);assert.equal(q.metadata.reviewOnly,true);}
console.log("ENG-008 CP005 research/survey RC audit passed.",{passages:124,authorities:992,remediatedPassages:48,soak:4800});