import assert from "node:assert/strict";
import {fmt} from "./native-007-009";
import {generateStat010Question as g10,generateStat010QuestionStudioBatch as b10,solveStat010State as s10} from "../STAT-010/sampling-theory";
import {STAT010_PERMANENT_QLS as r10} from "../STAT-010/permanent-ql-registry";
import {localizeStat010Question as l10} from "../STAT-010/native-review-v1";
import {generateStat011Question as g11,generateStat011QuestionStudioBatch as b11,solveStat011State as s11} from "../STAT-011/statistical-inference";
import {STAT011_PERMANENT_QLS as r11} from "../STAT-011/permanent-ql-registry";
import {localizeStat011Question as l11} from "../STAT-011/native-review-v1";
import {generateStat012Question as g12,generateStat012QuestionStudioBatch as b12,solveStat012State as s12} from "../STAT-012/anova";
import {STAT012_PERMANENT_QLS as r12} from "../STAT-012/permanent-ql-registry";
import {localizeStat012Question as l12} from "../STAT-012/native-review-v1";
import {generateStat013Question as g13,generateStat013QuestionStudioBatch as b13,solveStat013State as s13} from "../STAT-013/time-series";
import {STAT013_PERMANENT_QLS as r13} from "../STAT-013/permanent-ql-registry";
import {localizeStat013Question as l13} from "../STAT-013/native-review-v1";
import {generateStat014Question as g14,generateStat014QuestionStudioBatch as b14,solveStat014State as s14} from "../STAT-014/index-numbers";
import {STAT014_PERMANENT_QLS as r14} from "../STAT-014/permanent-ql-registry";
import {localizeStat014Question as l14} from "../STAT-014/native-review-v1";
let checked=0;const seen=new Set<string>();
for(const [generate,localize,solve,registry,batch] of [[g10,l10,s10,r10,b10],[g11,l11,s11,r11,b11],[g12,l12,s12,r12,b12],[g13,l13,s13,r13,b13],[g14,l14,s14,r14,b14]] as const){
 const positions=new Set<number>();
 for(const owner of registry)for(const examProfile of ['SSC_CGL_TIER_II','SSC_CGL_JSO'] as const)for(let i=0;i<100;i++){
  const q=(generate as any)({seed:`nativefinal:${i}`,contractId:owner.contractId,examProfile}),snapshot=JSON.stringify(q),truth=(solve as any)(q.state);
  assert.equal(q.answer,typeof truth==='number'?fmt(truth):truth);
  for(const language of ['hi','pa'] as const){
   const n=(localize as any)(q,language);assert.deepEqual(n.state,q.state);assert.equal(n.correctIndex,q.correctIndex);assert.deepEqual(n.sourceOptions,q.options);assert.equal(n.sourceAnswer,q.answer);assert.equal(n.options[n.correctIndex],n.answer);assert.equal(n.canonicalAnswer.value,n.answer);assert.equal(new Set(n.options).size,4);assert.equal(n.sourceQuestionId,q.questionId);assert.notEqual(n.questionId,q.questionId);assert.equal(n.language,language);assert.equal(n.reviewStatus,'NATIVE_REVIEW_CANDIDATE');assert.match(n.stem,language==='hi'?/[\u0900-\u097f]/:/[\u0a00-\u0a7f]/);assert.match(n.explanation,language==='hi'?/[\u0900-\u097f]/:/[\u0a00-\u0a7f]/);
   for(const key of ['questionBankWritable','testEligible','mockTestEligible','publiclyPublishable','automaticStudentPublication','productionReleaseAuthorized'])assert.equal(n[key],false);
   assert.deepEqual(n,(localize as any)(q,language));seen.add(`${q.packageId}:${q.contractId}`);positions.add(n.correctIndex);checked++;
  }
  assert.equal(JSON.stringify(q),snapshot);
 }
 assert.equal(positions.size,4);assert.throws(()=>batch({language:'fr'}));
 const q=(generate as any)();assert.throws(()=>(localize as any)({...q,answer:'invalid'},'hi'));assert.throws(()=>(localize as any)({...q,qlId:'STAT-QL-001'},'pa'));assert.throws(()=>(localize as any)({...q,productionReleaseAuthorized:true},'pa'));assert.throws(()=>(localize as any)({...q,packageId:'STAT-999'},'hi'));
}
console.log({status:'PASS_STAT010_014_NATIVE',nativePackages:checked,contracts:seen.size});

for(let i=0;i<100;i++){
 for(const contractId of ['LEAST_SQUARES_SLOPE','LEAST_SQUARES_INTERCEPT']as const){const q=g11({contractId,seed:`display:${i}`});if(q.state.kind!=='PAIRS')throw Error('Wrong state');for(let j=0;j<q.state.x.length;j++)assert(q.stem.includes(`(${q.state.x[j]},${q.state.y[j]})`));}
 const q=g11({contractId:'CONFIDENCE_INTERVAL_MARGIN',seed:`display:${i}`});assert(!q.stem.includes('95%'));
}
