import assert from"node:assert/strict";
import{ENG008_CP001_PASSAGES_V1,ENG008_CP001_QUESTION_AUTHORITIES_V1}from"../chapters/reading-comprehension/ENG-008/CP001/eng-008-cp001-authorities-v1";
import{ENG008_CP001_FAMILY_IDS_V1,generateEng008Cp001QuestionV1}from"../chapters/reading-comprehension/ENG-008/CP001/eng-008-cp001-v1";

assert.equal(ENG008_CP001_PASSAGES_V1.length,8);
assert.equal(new Set(ENG008_CP001_PASSAGES_V1.map(x=>x.id)).size,8);
assert.equal(ENG008_CP001_QUESTION_AUTHORITIES_V1.length,48);
assert.equal(new Set(ENG008_CP001_QUESTION_AUTHORITIES_V1.map(x=>x.question.id)).size,48);

const genres=new Map<string,number>(),families=new Map<string,number>(),difficulties=new Set<string>();
for(const passage of ENG008_CP001_PASSAGES_V1){
 genres.set(passage.genre,(genres.get(passage.genre)??0)+1);
 assert.equal(passage.questions.length,6,`${passage.id} must expose six RC families`);
 assert.equal(new Set(passage.questions.map(q=>q.familyId)).size,6,`${passage.id} must expose all six distinct families`);
 assert.ok(passage.text.includes("\n\n"),`${passage.id} should be multi-paragraph`);
 assert.ok(passage.text.length>500,`${passage.id} passage is too thin`);
 for(const authority of passage.questions){
  families.set(authority.familyId,(families.get(authority.familyId)??0)+1);
  difficulties.add(authority.difficulty);
  assert.equal(authority.distractors.length,3);
  assert.equal(new Set([authority.correctAnswer,...authority.distractors].map(x=>x.toLowerCase())).size,4,`${authority.id} option collision`);
  assert.ok(authority.explanation.length>=45,`${authority.id} explanation too thin`);
  assert.ok(authority.evidence.length>=18,`${authority.id} evidence too thin`);
  const first=generateEng008Cp001QuestionV1({seed:`authority:${authority.id}`,difficulty:authority.difficulty,authorityId:authority.id});
  const second=generateEng008Cp001QuestionV1({seed:`authority:${authority.id}`,difficulty:authority.difficulty,authorityId:authority.id});
  assert.deepEqual(first,second,`${authority.id} deterministic replay failed`);
  assert.equal(first.metadata.authorityId,authority.id);
  assert.equal(first.options.length,4);
  assert.equal(first.options[first.correctOptionIndex],authority.correctAnswer);
  assert.equal(first.metadata.reviewOnly,true);
 }
}
assert.deepEqual(Object.fromEntries(genres),{narrative:4,report:4});
for(const familyId of ENG008_CP001_FAMILY_IDS_V1)assert.equal(families.get(familyId),8,`${familyId} should have 8 authorities`);
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
console.log("ENG-008 CP001 SSC foundation RC audit passed.",{passages:8,authorities:48,soak:6000});
