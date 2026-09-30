import assert from"node:assert/strict";
import{ENG008_CP001_PASSAGES_V1,ENG008_CP001_QUESTION_AUTHORITIES_V1}from"../chapters/reading-comprehension/ENG-008/CP001/eng-008-cp001-authorities-v1";
import{ENG008_CP001_FAMILY_IDS_V1,generateEng008Cp001QuestionV1}from"../chapters/reading-comprehension/ENG-008/CP001/eng-008-cp001-v1";
import{ENG008_CP001_REMEDIATED_WAVE14_V1,ENG008_CP001_REMEDIATED_WAVE15_V1,ENG008_CP001_REMEDIATED_WAVE16_V1,ENG008_CP001_REMEDIATED_WAVE17_V1,ENG008_CP001_REMEDIATED_WAVE18_V1,ENG008_CP001_REMEDIATED_WAVE19_V1}from"../chapters/reading-comprehension/ENG-008/CP001/eng-008-cp001-remediation-waves14-19-v1";

const remediated=[...ENG008_CP001_REMEDIATED_WAVE14_V1,...ENG008_CP001_REMEDIATED_WAVE15_V1,...ENG008_CP001_REMEDIATED_WAVE16_V1,...ENG008_CP001_REMEDIATED_WAVE17_V1,...ENG008_CP001_REMEDIATED_WAVE18_V1,...ENG008_CP001_REMEDIATED_WAVE19_V1];
assert.equal(remediated.length,48);assert.equal(new Set(remediated.map(x=>x.id)).size,48);
for(const p of remediated){
 const n=p.text.trim().split(/\s+/).length;
 assert.ok(n>=180&&n<=250,`${p.id} remediation words=${n}`);
 assert.ok(p.text.includes("\n\n"),`${p.id} remediation should remain multi-paragraph`);
 assert.equal(p.questions.length,6);
 for(const q of p.questions){
  assert.ok(q.explanation.length>=80,`${q.id} remediation explanation too thin`);
  assert.equal(new Set([q.correctAnswer,...q.distractors].map(x=>x.toLowerCase())).size,4,`${q.id} remediation option collision`);
  assert.notEqual(q.explanation,"The passage states this fact directly before explaining how the confusion was resolved.");
 }
}
assert.equal(ENG008_CP001_PASSAGES_V1.length,126);
assert.equal(new Set(ENG008_CP001_PASSAGES_V1.map(x=>x.id)).size,126);
assert.equal(ENG008_CP001_QUESTION_AUTHORITIES_V1.length,756);
assert.equal(new Set(ENG008_CP001_QUESTION_AUTHORITIES_V1.map(x=>x.question.id)).size,756);

const genres=new Map<string,number>(),families=new Map<string,number>(),difficulties=new Set<string>();
for(const passage of ENG008_CP001_PASSAGES_V1){
 genres.set(passage.genre,(genres.get(passage.genre)??0)+1);
 assert.equal(passage.questions.length,6,`${passage.id} must expose six RC families`);
 assert.equal(new Set(passage.questions.map(q=>q.familyId)).size,6,`${passage.id} must expose all six distinct families`);
 assert.ok(passage.text.includes("\n\n"),`${passage.id} should be multi-paragraph`);
 const wordCount=passage.text.trim().split(/\s+/).length;assert.ok(wordCount>=180&&wordCount<=250,`${passage.id} word count ${wordCount} outside SSC Foundation band`);
 for(const authority of passage.questions){
  families.set(authority.familyId,(families.get(authority.familyId)??0)+1);
  difficulties.add(authority.difficulty);
  assert.equal(authority.distractors.length,3);
  assert.equal(new Set([authority.correctAnswer,...authority.distractors].map(x=>x.toLowerCase())).size,4,`${authority.id} option collision`);
  assert.ok(authority.explanation.length>=45,`${authority.id} explanation too thin`);
  assert.ok(authority.evidence.trim().length>=3,`${authority.id} evidence too thin`);
  const first=generateEng008Cp001QuestionV1({seed:`authority:${authority.id}`,difficulty:authority.difficulty,authorityId:authority.id});
  const second=generateEng008Cp001QuestionV1({seed:`authority:${authority.id}`,difficulty:authority.difficulty,authorityId:authority.id});
  assert.deepEqual(first,second,`${authority.id} deterministic replay failed`);
  assert.equal(first.metadata.authorityId,authority.id);
  assert.equal(first.options.length,4);
  assert.equal(first.options[first.correctOptionIndex],authority.correctAnswer);
  assert.equal(first.metadata.reviewOnly,true);
 }
}
assert.deepEqual(Object.fromEntries(genres),{narrative:63,report:63});
for(const familyId of ENG008_CP001_FAMILY_IDS_V1)assert.equal(families.get(familyId),126,`${familyId} should have 30 authorities`);
assert.deepEqual([...difficulties].sort(),["easy","hard","medium"]);

for(const difficulty of["easy","medium","hard"]as const){
 for(let i=0;i<2000;i++){
  const q=generateEng008Cp001QuestionV1({seed:`soak:${difficulty}:${i}`,difficulty});
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);
  assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
  assert.equal(q.metadata.difficulty,difficulty);
  assert.equal(q.metadata.reviewOnly,true);
 }
}
console.log("ENG-008 CP001 SSC foundation RC audit passed.",{passages:126,authorities:756,remediatedPassages:48,soak:6000});
