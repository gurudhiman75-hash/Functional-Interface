import { generateStat006Question, generateStat006QuestionStudioBatch, solveStat006State } from "./moments-shape";
import { STAT006_PERMANENT_QLS } from "./permanent-ql-registry";
import { STAT006_CONTRACTS, type Stat006ExamProfile, type Stat006State } from "./types";
function assert(ok:unknown,message:string):asserts ok{if(!ok)throw new Error(message);}
function fmt(n:number){const v=Math.round(n*100)/100;return String(v);}
function independent(state:Stat006State):number|string{
  if(state.kind==="RAW_MOMENT")return state.values.reduce((a,x)=>a+x**state.order,0)/state.values.length;
  if(state.kind==="CENTRAL_MOMENT"){const xbar=state.values.reduce((a,x)=>a+x,0)/state.values.length;return state.values.reduce((a,x)=>a+(x-xbar)**state.order,0)/state.values.length;}
  if(state.kind==="RAW_CENTRAL_RELATION"){const [m1,m2,m3,m4]=state.rawMoments;if(state.order===2)return m2-m1*m1;if(state.order===3)return m3-3*m2*m1+2*m1*m1*m1;return m4-4*m3*m1+6*m2*m1*m1-3*m1*m1*m1*m1;}
  if(state.kind==="AFFINE_MOMENT")return state.centralMoment*(state.multiplier**state.order);
  if(state.kind==="MOMENT_SKEWNESS")return state.coefficient==="beta1"?(state.mu3*state.mu3)/(state.mu2*state.mu2*state.mu2):state.mu3/(state.mu2*Math.sqrt(state.mu2));
  if(state.kind==="BOWLEY_SKEWNESS")return(state.q3+state.q1-2*state.median)/(state.q3-state.q1);
  if(state.kind==="PEARSON_SKEWNESS")return(state.version===1?state.mean-state.reference:3*(state.mean-state.reference))/state.standardDeviation;
  if(state.kind==="THIRD_MOMENT_SIGN")return state.mu3>0?"Positively skewed":state.mu3<0?"Negatively skewed":"Zero third-moment skewness";
  const b=state.mu4/(state.mu2*state.mu2);return state.output==="beta2"?b:state.output==="excess"?b-3:b<3?"Platykurtic":b>3?"Leptokurtic":"Mesokurtic";
}
const profiles:readonly Stat006ExamProfile[]=["SSC_CGL_TIER_II","SSC_CGL_JSO"];
let generated=0;
for(const profile of profiles)for(const contractId of STAT006_CONTRACTS)for(let n=0;n<25;n+=1){
  const seed=`STAT-006-PROOF:${profile}:${contractId}:${n}`;const q=generateStat006Question({seed,examProfile:profile,contractId});const replay=generateStat006Question({seed,examProfile:profile,contractId});
  assert(JSON.stringify(q)===JSON.stringify(replay),`Replay mismatch: ${seed}`);assert(q.options.length===4&&new Set(q.options).size===4,`Invalid options: ${seed}`);assert(q.options[q.correctIndex]===q.answer,`Correct option mismatch: ${seed}`);
  const proof=independent(q.state);assert((typeof proof==="number"?fmt(proof):proof)===q.answer,`Independent answer mismatch: ${seed}`);assert((typeof solveStat006State(q.state)==="number"?fmt(solveStat006State(q.state) as number):solveStat006State(q.state))===q.answer,`Stored-state solver mismatch: ${seed}`);
  assert(q.questionBankWritable===false&&q.testEligible===false&&q.mockTestEligible===false&&q.publiclyPublishable===false&&q.automaticStudentPublication===false&&q.productionReleaseAuthorized===false,`Lifecycle lock mismatch: ${seed}`);generated+=1;
}
const batch=generateStat006QuestionStudioBatch({packageId:"STAT-006",seed:"STAT-006-QS-PROOF",count:STAT006_CONTRACTS.length,language:"en",examProfile:"SSC_CGL_JSO"});
assert(batch.questions.length===STAT006_CONTRACTS.length,"Question Studio batch count mismatch.");assert(new Set(batch.questions.map(q=>q.qlId)).size===STAT006_CONTRACTS.length,"Question Studio batch missed a permanent QL.");assert(batch.questions.every(q=>q.examProfile==="SSC_CGL_JSO"&&q.questionBankWritable===false&&q.testEligible===false),"Question Studio profile/lifecycle mismatch.");assert(STAT006_PERMANENT_QLS.length===STAT006_CONTRACTS.length,"Registry count mismatch.");
console.log(JSON.stringify({status:"PASS_STAT_006_MOMENTS_SHAPE",contracts:STAT006_CONTRACTS.length,profiles:profiles.length,generated,replayChecks:generated,independentChecks:generated,questionStudioBatch:batch.questions.length,lifecycle:"CONTROLLED_REVIEW_ONLY"}));
