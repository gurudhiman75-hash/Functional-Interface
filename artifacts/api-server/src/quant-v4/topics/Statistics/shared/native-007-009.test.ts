import assert from 'node:assert/strict';
import {generateStat007Question as g7,generateStat007QuestionStudioBatch as b7,solveStat007State as s7} from '../STAT-007/correlation-regression';
import {generateStat008Question as g8,generateStat008QuestionStudioBatch as b8,solveStat008State as s8} from '../STAT-008/probability-theory';
import {generateStat009Question as g9,generateStat009QuestionStudioBatch as b9,solveStat009State as s9} from '../STAT-009/random-variables';
import {STAT007_PERMANENT_QLS as r7} from '../STAT-007/permanent-ql-registry';
import {STAT008_PERMANENT_QLS as r8} from '../STAT-008/permanent-ql-registry';
import {STAT009_PERMANENT_QLS as r9} from '../STAT-009/permanent-ql-registry';
import {localizeStat007Question as l7} from '../STAT-007/native-review-v1';
import {localizeStat008Question as l8} from '../STAT-008/native-review-v1';
import {localizeStat009Question as l9} from '../STAT-009/native-review-v1';
import {fmt} from './native-007-009';
let checked=0;const seen=new Set<string>();
for(const [generate,localize,solve,registry,batch,decimals] of [[g7,l7,s7,r7,b7,2],[g8,l8,s8,r8,b8,2],[g9,l9,s9,r9,b9,4]] as const){
 const positions=new Set<number>();
 for(const owner of registry)for(const examProfile of ['SSC_CGL_TIER_II','SSC_CGL_JSO'] as const)for(let i=0;i<100;i++){
  const q=(generate as any)({seed:`native789:${i}`,contractId:owner.contractId,examProfile}),snapshot=JSON.stringify(q),truth=(solve as any)(q.state);
  assert.equal(q.answer,typeof truth==='number'?fmt(truth,decimals):truth);
  for(const language of ['hi','pa'] as const){
   const n=(localize as any)(q,language);assert.deepEqual(n.state,q.state);assert.equal(n.correctIndex,q.correctIndex);assert.deepEqual(n.sourceOptions,q.options);assert.equal(n.sourceAnswer,q.answer);assert.equal(n.options[n.correctIndex],n.answer);assert.equal(n.canonicalAnswer.value,n.answer);assert.equal(new Set(n.options).size,4);assert.equal(n.sourceQuestionId,q.questionId);assert.notEqual(n.questionId,q.questionId);assert.equal(n.language,language);assert.equal(n.reviewStatus,'NATIVE_REVIEW_CANDIDATE');assert.match(n.stem,language==='hi'?/[\u0900-\u097f]/:/[\u0a00-\u0a7f]/);assert.match(n.explanation,language==='hi'?/[\u0900-\u097f]/:/[\u0a00-\u0a7f]/);
   for(const key of ['questionBankWritable','testEligible','mockTestEligible','publiclyPublishable','automaticStudentPublication','productionReleaseAuthorized'])assert.equal(n[key],false);
   assert.deepEqual(n,(localize as any)(q,language));seen.add(`${q.packageId}:${q.contractId}`);positions.add(n.correctIndex);checked++;
  }
  assert.equal(JSON.stringify(q),snapshot);
 }
 assert.equal(positions.size,4);assert.throws(()=>batch({language:'fr'}));
 const q=(generate as any)();assert.throws(()=>(localize as any)({...q,answer:'invalid'},'hi'));assert.throws(()=>(localize as any)({...q,qlId:'STAT-QL-001'},'pa'));
}
for(const beta of [2,3,4]){
 let found=false;for(let i=0;i<100;i++){const q=g7({seed:`option:${i}`,contractId:'MULTIPLE_REGRESSION_COEFFICIENT_INTERPRETATION'});if(!q.answer.includes(`change of ${beta} units`))continue;found=true;assert(q.options.every(o=>!o.includes('correlation')));assert(q.options.some(o=>o.includes(`by ${beta}%`)));}
 assert(found);
}
const form=g7({contractId:'MULTIPLE_REGRESSION_FORM'});assert(form.options.every(o=>o.startsWith('Ŷ =')));
console.log({status:'PASS_STAT007_009_NATIVE',nativePackages:checked,contracts:seen.size});
