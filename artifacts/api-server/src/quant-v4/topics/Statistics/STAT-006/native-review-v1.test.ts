import assert from 'node:assert/strict';
import {generateStat006Question,generateStat006QuestionStudioBatch,stat006QuestionStudioPackageCard} from './moments-shape';
import {STAT006_PERMANENT_QLS} from './permanent-ql-registry';
import {localizeStat006Question,normalizeStat006Language} from './native-review-v1';
import type {Stat006State} from './types';
function independent(s:Stat006State):number|string{
 if(s.kind==='RAW_MOMENT')return s.values.map(x=>x**s.order).reduce((a,b)=>a+b)/s.values.length;
 if(s.kind==='CENTRAL_MOMENT'){const m=s.values.reduce((a,b)=>a+b)/s.values.length;return s.values.map(x=>(x-m)**s.order).reduce((a,b)=>a+b)/s.values.length;}
 if(s.kind==='RAW_CENTRAL_RELATION'){
  const binomial=[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]][s.order]!;
  return binomial.reduce((sum,b,k)=>sum+b*(k===0?1:s.rawMoments[k-1]!)*(-s.rawMoments[0])**(s.order-k),0);
 }
 if(s.kind==='AFFINE_MOMENT')return s.multiplier**s.order*s.centralMoment;
 if(s.kind==='MOMENT_SKEWNESS')return s.coefficient==='beta1'?(s.mu3/(s.mu2*Math.sqrt(s.mu2)))**2:s.mu3/(s.mu2*Math.sqrt(s.mu2));
 if(s.kind==='BOWLEY_SKEWNESS')return ((s.q3-s.median)-(s.median-s.q1))/(s.q3-s.q1);
 if(s.kind==='PEARSON_SKEWNESS')return (s.mean-s.reference)/s.standardDeviation*(s.version===1?1:3);
 if(s.kind==='THIRD_MOMENT_SIGN')return s.mu3===0?'Zero third-moment skewness':s.mu3>0?'Positively skewed':'Negatively skewed';
 const b=s.mu4/(s.mu2*s.mu2);return s.output==='beta2'?b:s.output==='excess'?b-3:b===3?'Mesokurtic':b<3?'Platykurtic':'Leptokurtic';
}
let packages=0;const modes=new Set<string>(),positions=new Set<number>();
for(const owner of STAT006_PERMANENT_QLS)for(const examProfile of ['SSC_CGL_TIER_II','SSC_CGL_JSO'] as const)for(let i=0;i<100;i++){
 const q=generateStat006Question({seed:`native:${i}`,contractId:owner.contractId,examProfile}),before=JSON.stringify(q),truth=independent(q.state);
 assert.equal(q.answer,typeof truth==='number'?String(Math.round(truth*100)/100):truth);
 if(q.state.kind==='THIRD_MOMENT_SIGN')modes.add(q.answer);
 if(q.state.kind==='KURTOSIS')modes.add(q.state.output==='shape'?q.answer:q.state.output);
 for(const language of ['hi','pa'] as const){
  const n=localizeStat006Question(q,language);assert.deepEqual(n.state,q.state);assert.equal(n.correctIndex,q.correctIndex);assert.deepEqual(n.sourceOptions,q.options);assert.equal(n.sourceAnswer,q.answer);assert.equal(n.options[n.correctIndex],n.answer);assert.equal(n.canonicalAnswer.value,n.answer);assert.equal(new Set(n.options).size,4);
  assert.notEqual(n.questionId,q.questionId);assert.equal(n.sourceQuestionId,q.questionId);assert.equal(n.reviewStatus,'NATIVE_REVIEW_CANDIDATE');
  for(const key of ['questionBankWritable','testEligible','mockTestEligible','publiclyPublishable','automaticStudentPublication','productionReleaseAuthorized'] as const)assert.equal(n[key],false);
  assert.match(n.stem,language==='hi'?/[\u0900-\u097f]/:/[\u0a00-\u0a7f]/);assert.match(n.explanation,language==='hi'?/[\u0900-\u097f]/:/[\u0a00-\u0a7f]/);
  if(typeof truth==='string')for(const o of n.options)assert.match(o,language==='hi'?/[\u0900-\u097f]/:/[\u0a00-\u0a7f]/);else assert.equal(n.answer,q.answer);
  assert.deepEqual(n,localizeStat006Question(q,language));positions.add(n.correctIndex);packages++;
 }
 assert.equal(JSON.stringify(q),before);
}
for(const item of ['Positively skewed','Negatively skewed','Zero third-moment skewness','Platykurtic','Mesokurtic','Leptokurtic','excess','beta2'])assert(modes.has(item),item);
assert.equal(positions.size,4);
const q=generateStat006Question();
assert.throws(()=>localizeStat006Question({...q,answer:'bad'},'hi'));
assert.throws(()=>localizeStat006Question({...q,qlId:'STAT-QL-001'},'pa'));
assert.throws(()=>localizeStat006Question({...q,options:[q.answer,'unknown','2','3']},'hi'));
assert.throws(()=>generateStat006QuestionStudioBatch({language:'fr'}));assert.equal(normalizeStat006Language('pa-IN'),'pa');
assert.deepEqual(stat006QuestionStudioPackageCard().supportedLanguages,['en','hi','pa']);
console.log({status:'PASS_STAT006_NATIVE_V1',packages,conceptualModes:[...modes]});
