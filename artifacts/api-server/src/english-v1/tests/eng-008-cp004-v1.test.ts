import assert from"node:assert/strict";
import{ENG008_CP004_PASSAGES_V1,ENG008_CP004_QUESTION_AUTHORITIES_V1}from"../chapters/reading-comprehension/ENG-008/CP004/eng-008-cp004-authorities-v1";
import{ENG008_CP004_FAMILY_IDS_V1,generateEng008Cp004QuestionV1}from"../chapters/reading-comprehension/ENG-008/CP004/eng-008-cp004-v1";
import{ENG008_CP004_REMEDIATED_WAVE14_V1,ENG008_CP004_REMEDIATED_WAVE15_V1,ENG008_CP004_REMEDIATED_WAVE16_V1,ENG008_CP004_REMEDIATED_WAVE17_V1,ENG008_CP004_REMEDIATED_WAVE18_V1,ENG008_CP004_REMEDIATED_WAVE19_V1}from"../chapters/reading-comprehension/ENG-008/CP004/eng-008-cp004-remediation-waves14-19-v1";
const remediated=[...ENG008_CP004_REMEDIATED_WAVE14_V1,...ENG008_CP004_REMEDIATED_WAVE15_V1,...ENG008_CP004_REMEDIATED_WAVE16_V1,...ENG008_CP004_REMEDIATED_WAVE17_V1,...ENG008_CP004_REMEDIATED_WAVE18_V1,...ENG008_CP004_REMEDIATED_WAVE19_V1];
assert.equal(remediated.length,48);assert.equal(new Set(remediated.map(x=>x.id)).size,48);
for(const p of remediated){
  const n=p.text.trim().split(/\s+/).length,pc=p.text.split(/\n\n+/).filter(Boolean).length;
  assert.ok(n>=450&&n<=650,`${p.id} remediation words=${n}`);
  assert.ok(pc>=6&&pc<=8,`${p.id} remediation paras=${pc}`);
  assert.equal(p.questions.length,10);
  for(const q of p.questions){
    assert.ok(q.explanation.length>=95,`${q.id} remediation explanation too thin`);
    assert.equal(new Set([q.correctAnswer,...q.distractors].map(x=>x.toLowerCase())).size,4,`${q.id} remediation option collision`);
    assert.notEqual(q.explanation,"The answer is supported by the passage's comparison of evidence, procedure and outcome rather than by an isolated detail.");
  }
}
assert.equal(ENG008_CP004_PASSAGES_V1.length,126);assert.equal(ENG008_CP004_QUESTION_AUTHORITIES_V1.length,1260);assert.equal(new Set(ENG008_CP004_QUESTION_AUTHORITIES_V1.map(x=>x.question.id)).size,1260);
const fam=new Map<string,number>(),diff=new Map<string,number>(),genres=new Set<string>();
for(const p of ENG008_CP004_PASSAGES_V1){genres.add(p.genre);const wc=p.text.trim().split(/\s+/).length,pc=p.text.split(/\n\n+/).filter(Boolean).length;assert.ok(wc>=450&&wc<=650,`${p.id} words=${wc}`);assert.ok(pc>=6&&pc<=8,`${p.id} paras=${pc}`);assert.equal(p.questions.length,10);assert.equal(new Set(p.questions.map(q=>q.familyId)).size,10);for(const a of p.questions){fam.set(a.familyId,(fam.get(a.familyId)??0)+1);diff.set(a.difficulty,(diff.get(a.difficulty)??0)+1);assert.equal(new Set([a.correctAnswer,...a.distractors].map(x=>x.toLowerCase())).size,4);assert.ok(a.explanation.length>=45);assert.ok(a.evidence.length>=12);const x=generateEng008Cp004QuestionV1({seed:`audit:${a.id}`,difficulty:a.difficulty,authorityId:a.id}),y=generateEng008Cp004QuestionV1({seed:`audit:${a.id}`,difficulty:a.difficulty,authorityId:a.id});assert.deepEqual(x,y);assert.equal(x.options[x.correctOptionIndex],a.correctAnswer);}}
assert.equal(genres.size,8);for(const id of ENG008_CP004_FAMILY_IDS_V1)assert.equal(fam.get(id),126);assert.deepEqual(Object.fromEntries(diff),{medium:378,hard:882});
for(const d of["medium","hard"]as const)for(let i=0;i<4000;i++){const q=generateEng008Cp004QuestionV1({seed:`soak:${d}:${i}`,difficulty:d});assert.equal(q.options.length,4);assert.equal(q.metadata.reviewOnly,true);}
console.log("ENG-008 CP004 Banking Mains RC audit passed.",{passages:126,authorities:1260,remediatedPassages:48,soak:8000});