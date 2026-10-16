import assert from 'node:assert/strict';
import {generateQuestionStudioQuestions,listQuestionStudioPackages} from '../../../../question-studio/engine-registry';
import {STAT007_PERMANENT_QLS as r7} from '../STAT-007/permanent-ql-registry';
import {STAT008_PERMANENT_QLS as r8} from '../STAT-008/permanent-ql-registry';
import {STAT009_PERMANENT_QLS as r9} from '../STAT-009/permanent-ql-registry';
let routes=0;
for(const [packageId,registry] of [['STAT-007',r7],['STAT-008',r8],['STAT-009',r9]] as const){
 for(const owner of registry)for(const exam of ['SSC_CGL_TIER_II','SSC_CGL_JSO'])for(const language of ['hi','pa']){
  const result=await generateQuestionStudioQuestions({questionLanguageId:owner.qlId,exam,language,count:1,seed:'NATIVE789-STUDIO'});
  const q=result.questions[0]!;assert.equal(result.engineId,'quant-v4');assert.equal(q.packageId,packageId);assert.equal(q.questionLanguageId,owner.qlId);assert.equal(q.language,language);assert.equal(q.examProfile,exam);assert.equal(q.reviewStatus,'NATIVE_REVIEW_CANDIDATE');assert.equal(q.productionReleaseAuthorized,false);assert.equal(q.canonicalAnswer.value,q.answer);assert.equal(q.options[q.correctIndex],q.answer);routes++;
 }
 const card=listQuestionStudioPackages().find(c=>c.packageId===packageId)!;assert.deepEqual(card.supportedLanguages,['en','hi','pa']);assert(card.supportedRuntimeModes.includes(`${packageId.replace('-','')}_NATIVE_REVIEW_V1`));assert.equal((card.metadata?.languageReviewStatus as any).hi,'NATIVE_REVIEW_CANDIDATE');
 const en=await generateQuestionStudioQuestions({packageId,language:'en',exam:'SSC_CGL_JSO',count:registry.length,seed:'NATIVE789-EN'});assert.equal(new Set(en.questions.map(q=>q.permanentQlId)).size,registry.length);assert(en.questions.every(q=>q.reviewStatus==='ENGLISH_REVIEW_CANDIDATE'));
}
console.log({status:'PASS_STAT007_009_NATIVE_STUDIO',routes,englishQuestions:46});
