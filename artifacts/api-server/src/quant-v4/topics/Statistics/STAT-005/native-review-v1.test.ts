import assert from 'node:assert/strict';
import { generateStat005Question, generateStat005QuestionStudioBatch, solveStat005State, stat005QuestionStudioPackageCard } from './partition-dispersion';
import { localizeStat005Question, normalizeStat005Language } from './native-review-v1';
import { STAT005_PERMANENT_QLS } from './permanent-ql-registry';
import { generateStat005QuestionStudioBatchForAdapter } from './question-studio-adapter';
let checked=0;
for(const owner of STAT005_PERMANENT_QLS) for(const examProfile of ['SSC_CGL_TIER_II','SSC_CGL_JSO'] as const) for(let seed=0;seed<100;seed++) {
 const q=generateStat005Question({contractId:owner.contractId,examProfile,seed:`native-v1:${seed}`});
 const original=JSON.stringify(q);
 for(const language of ['hi','pa'] as const){
  const n=localizeStat005Question(q,language);
  assert.equal(n.answer,q.answer); assert.deepEqual(n.options,q.options);assert.deepEqual(n.state,q.state);assert.equal(n.correctIndex,q.correctIndex);
  assert.equal(n.sourceQuestionId,q.questionId); assert.notEqual(n.questionId,q.questionId);
  assert.equal(n.language,language);assert.equal(n.reviewStatus,'NATIVE_REVIEW_CANDIDATE');
  assert.equal(n.productionReleaseAuthorized,false);assert.equal(n.publiclyPublishable,false);assert.equal(n.testEligible,false);
  assert.match(n.stem,language==='hi'?/[\u0900-\u097f]/:/[\u0a00-\u0a7f]/);assert.match(n.explanation,language==='hi'?/[\u0900-\u097f]/:/[\u0a00-\u0a7f]/);
  assert.equal(n.answer,String(Math.round(solveStat005State(n.state,n.contractId)*100)/100));
  assert.deepEqual(n,localizeStat005Question(q,language));checked++;
 }
 assert.equal(JSON.stringify(q),original);
}
for(const owner of STAT005_PERMANENT_QLS)for(const examProfile of ['SSC_CGL_TIER_II','SSC_CGL_JSO'])for(const language of ['en','hi','pa']){
 const b=generateStat005QuestionStudioBatchForAdapter({questionLanguageId:owner.qlId,examProfile,language,count:2,seed:'studio-native'});
 assert.equal(b.generationContext.language,language);assert.equal(b.questions[0]!.language,language);assert.equal(b.questions[0]!.permanentQlId,owner.qlId);
 if(language!=='en')assert.equal(b.questions[0]!.runtimeMode,'STAT005_NATIVE_REVIEW_V1');
}
assert.throws(()=>normalizeStat005Language('fr'));
assert.throws(()=>generateStat005QuestionStudioBatch({language:'fr'}));
const q=generateStat005Question();assert.throws(()=>localizeStat005Question({...q,answer:'invalid'},'hi'));
assert.deepEqual(stat005QuestionStudioPackageCard().supportedLanguages,['en','hi','pa']);
console.log(JSON.stringify({status:'PASS_STAT005_NATIVE_V1',nativePackages:checked,studioRoutes:96}));
