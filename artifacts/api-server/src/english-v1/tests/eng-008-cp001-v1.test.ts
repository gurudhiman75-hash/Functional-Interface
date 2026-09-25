import assert from "node:assert/strict";
import { ENG008_CP001_PASSAGES_V1, generateEng008Cp001QuestionV1 } from "../chapters/reading-comprehension/ENG-008/CP001/eng-008-cp001-v1";

assert.equal(ENG008_CP001_PASSAGES_V1.length,12);
assert.deepEqual(
  ["easy","medium","hard"].map((difficulty)=>ENG008_CP001_PASSAGES_V1.filter((p)=>p.difficulty===difficulty).length),
  [4,4,4]
);

for(const passage of ENG008_CP001_PASSAGES_V1){
  assert.equal(passage.paragraphs.length,3);
  assert.equal(passage.questions.length,4);
  const qids=new Set<string>();
  for(const question of passage.questions){
    assert.equal(question.options.length,4);
    assert.ok(question.correctOptionIndex>=0&&question.correctOptionIndex<4);
    assert.ok(question.evidence.trim().length>0);
    assert.equal(qids.has(question.id),false);
    qids.add(question.id);
  }
}

for(const difficulty of ["easy","medium","hard"] as const){
  for(let i=0;i<1000;i++){
    const seed=`eng008-cp001:${difficulty}:${i}`;
    const q=generateEng008Cp001QuestionV1({seed,difficulty});
    assert.equal(q.metadata.difficulty,difficulty);
    assert.equal(q.paragraphs.length,3);
    assert.equal(q.options.length,4);
    assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
    assert.ok(q.explanation.includes("The passage states that"));
    assert.equal(q.metadata.reviewOnly,true);
    const replay=generateEng008Cp001QuestionV1({seed,difficulty});
    assert.deepEqual(replay,q);
  }
}

for(const passage of ENG008_CP001_PASSAGES_V1){
  for(const question of passage.questions){
    const q=generateEng008Cp001QuestionV1({
      seed:`audit:${passage.id}:${question.id}`,
      difficulty:passage.difficulty,
      passageId:passage.id,
      questionId:question.id
    });
    assert.equal(q.metadata.passageId,passage.id);
    assert.equal(q.metadata.sourceQuestionId,question.id);
  }
}

console.log("ENG-008 CP001 narrative direct-comprehension audit passed.",{
  passages:ENG008_CP001_PASSAGES_V1.length,
  authoredQuestions:ENG008_CP001_PASSAGES_V1.reduce((sum,p)=>sum+p.questions.length,0)
});
