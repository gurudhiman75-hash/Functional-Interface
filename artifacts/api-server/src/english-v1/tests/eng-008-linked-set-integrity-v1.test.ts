import assert from "node:assert/strict";
import {ENG008_CP003_PASSAGES_V1} from "../chapters/reading-comprehension/ENG-008/CP003/eng-008-cp003-authorities-v1";
import {ENG008_CP007_AUTHORITIES_V1,eng008Cp007MaskedPassageV1} from "../chapters/reading-comprehension/ENG-008/CP007/eng-008-cp007-authorities-v1";
import {generateEng008Cp006SetV1,ENG008_CP006_SET_PROFILES_V1} from "../chapters/reading-comprehension/ENG-008/CP006/eng-008-cp006-set-v1";

const passages = new Map(ENG008_CP003_PASSAGES_V1.map(p=>[p.id,p]));
assert.equal(ENG008_CP007_AUTHORITIES_V1.length,126);
assert.equal(new Set(ENG008_CP007_AUTHORITIES_V1.map(a=>a.passageId)).size,126);
let fullSets=0;
for(const authority of ENG008_CP007_AUTHORITIES_V1){
  const source=passages.get(authority.passageId);
  assert.ok(source,`${authority.id} references missing passage`);
  const seed=`eng008-full-prelims:${authority.passageId}`;
  const input={seed,profile:"BANKING_PRELIMS_RC" as const,passageId:authority.passageId,questionCount:10};
  const set=generateEng008Cp006SetV1(input);
  const expectedMaskedPassage=eng008Cp007MaskedPassageV1(authority);
  assert.equal(set.passageId,authority.passageId);
  assert.equal(set.questionCount,10);
  assert.equal(set.questions.length,10);
  assert.equal(set.reviewOnly,true);
  assert.equal(set.passage,expectedMaskedPassage,`${authority.id} did not supply the approved masked passage`);
  assert.equal((set.passage.match(/_____/g)??[]).length,1,`${authority.id} did not mask exactly one word-fit target`);
  assert.equal(new Set(set.questions.map(q=>q.metadata.authorityId)).size,10,`${authority.id} duplicated a governed authority`);
  assert.equal(new Set(set.questions.map(q=>q.metadata.familyId)).size,10,`${authority.id} duplicated a question family`);
  assert.ok(set.questions.every(q=>q.metadata.passageId===set.passageId));
  const wordFit=set.questions.filter(q=>q.metadata.familyId==="BP-F10");
  assert.equal(wordFit.length,1,`${authority.id} must contribute one contextual word-fit`);
  assert.equal(wordFit[0]!.metadata.authorityId,authority.id);
  assert.equal(wordFit[0]!.options[wordFit[0]!.correctOptionIndex],authority.correctAnswer);
  for(const q of set.questions){
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(option=>option.toLowerCase())).size,4);
    assert.ok(q.correctOptionIndex>=0&&q.correctOptionIndex<4);
    assert.equal(q.metadata.reviewOnly,true);
  }
  // In shorter approved prelims sets no word-fit question is present,
  // so the passage must remain unmasked and readable.
  if(fullSets%12===0){
    for(const questionCount of [8,9]){
      const short=generateEng008Cp006SetV1({...input,questionCount});
      assert.equal(short.passage,source.text);
      assert.equal(short.questions.length,questionCount);
      assert.ok(short.questions.every(q=>q.metadata.familyId!=="BP-F10"));
    }
    const replay=generateEng008Cp006SetV1(input);
    assert.deepEqual(replay,set,`${authority.id} linked set replay changed`);
  }
  fullSets++;
}
assert.equal(fullSets,126);
for(const profile of ENG008_CP006_SET_PROFILES_V1){
  if(profile==="BANKING_PRELIMS_RC")continue;
  const allowed=profile==="SSC_FOUNDATION_RC"?[5,6]:profile==="BANKING_MAINS_RC"?[8,10]:[6,8];
  for(const questionCount of allowed){
    const set=generateEng008Cp006SetV1({seed:`eng008-linked-set:${profile}:${questionCount}`,profile,questionCount});
    assert.equal(set.questions.length,questionCount);
    assert.equal(new Set(set.questions.map(q=>q.metadata.passageId)).size,1);
    assert.equal(new Set(set.questions.map(q=>q.metadata.familyId)).size,questionCount);
    assert.ok(set.questions.every(q=>q.metadata.reviewOnly===true));
  }
}
console.log("ENG-008 linked RC set integrity passed.",{wordFitAuthorities:126,fullPrelimsSets:fullSets,profiles:ENG008_CP006_SET_PROFILES_V1.length});
