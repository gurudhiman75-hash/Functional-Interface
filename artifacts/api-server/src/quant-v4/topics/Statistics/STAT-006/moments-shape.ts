import { getStat006PermanentQl, STAT006_PERMANENT_QLS, STAT006_PERMANENT_OWNERSHIP } from "./permanent-ql-registry";
import { STAT006_CONTRACTS, type Stat006ContractId, type Stat006ExamProfile, type Stat006Question, type Stat006State } from "./types";

function hash(text: string) { let h = 2166136261; for (let i = 0; i < text.length; i += 1) h = Math.imul(h ^ text.charCodeAt(i), 16777619); return h >>> 0; }
function fmt(value: number) { const n = Math.round(value * 100) / 100; return String(n); }
function random(seed: string) { let x = hash(seed) || 1; return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return (x >>> 0) / 4294967296; }; }
function pick<T>(values: readonly T[], seed: string) { return values[hash(seed) % values.length]!; }
function shuffle<T>(items: readonly T[], seed: string) { const out = [...items]; const r = random(seed); for (let i=out.length-1;i>0;i-=1){const j=Math.floor(r()*(i+1));[out[i],out[j]]=[out[j]!,out[i]!];} return out; }
function displayValues(values: readonly number[]) { return values.join(", "); }
function moment(values: readonly number[], order: 1|2|3|4) { return values.reduce((sum, value) => sum + value ** order, 0) / values.length; }
function mean(values: readonly number[]) { return values.reduce((sum, value) => sum + value, 0) / values.length; }
function centralMoment(values: readonly number[], order: 2|3|4) { const xbar=mean(values); return values.reduce((sum, value) => sum + (value-xbar)**order, 0) / values.length; }
function rawMomentVector(values: readonly number[]): [number,number,number,number] { return [moment(values,1),moment(values,2),moment(values,3),moment(values,4)]; }
function data(seed: string, direction: 1|-1 = 1) { const scale=1+(hash(`${seed}:scale`)%3); const base=2+(hash(`${seed}:base`)%5); const offsets=direction>0?[-2,-1,0,0,3]:[-3,0,0,1,2]; return offsets.map(x=>base+x*scale); }
type Draft = { state: Stat006State; answer: number|string; stem: string; explanation: string; choices?: readonly string[] };
function build(contractId: Stat006ContractId, seed: string): Draft {
  const r=random(seed);
  if (["SECOND_RAW_MOMENT","THIRD_RAW_MOMENT","FOURTH_RAW_MOMENT"].includes(contractId)) {
    const order=contractId==="SECOND_RAW_MOMENT"?2:contractId==="THIRD_RAW_MOMENT"?3:4; const values=data(seed);
    const answer=moment(values,order as 2|3|4); const state:Stat006State={kind:"RAW_MOMENT",values,order:order as 2|3|4};
    return {state,answer,stem:`What is the ${order}${order===2?"nd":order===3?"rd":"th"} moment about the origin for the observations ${displayValues(values)}.`,explanation:`The ${order}${order===2?"nd":order===3?"rd":"th"} raw moment is the mean of the ${order}${order===2?"nd":order===3?"rd":"th"} powers: (${values.map(v=>`(${v})^${order}`).join(" + ")}) / ${values.length} = ${fmt(answer)}.`};
  }
  if (["SECOND_CENTRAL_MOMENT","THIRD_CENTRAL_MOMENT","FOURTH_CENTRAL_MOMENT"].includes(contractId)) {
    const order=contractId==="SECOND_CENTRAL_MOMENT"?2:contractId==="THIRD_CENTRAL_MOMENT"?3:4; const values=data(seed,hash(`${seed}:direction`)%2===0?1:-1); const xbar=mean(values); const answer=centralMoment(values,order as 2|3|4); const state:Stat006State={kind:"CENTRAL_MOMENT",values,order:order as 2|3|4};
    return {state,answer,stem:`Treat the listed observations as a population. What is the ${order}${order===2?"nd":order===3?"rd":"th"} central moment about the mean for ${displayValues(values)}.`,explanation:`The mean is ${fmt(xbar)}. The ${order}${order===2?"nd":order===3?"rd":"th"} central moment is the average of (${values.map(v=>`(${v} − ${fmt(xbar)})^${order}`).join(" + ")}) / ${values.length} = ${fmt(answer)}${order===2?". This is the variance; do not take its square root.":"."}`};
  }
  if (["RAW_TO_CENTRAL_SECOND","RAW_TO_CENTRAL_THIRD","RAW_TO_CENTRAL_FOURTH"].includes(contractId)) {
    const order=contractId==="RAW_TO_CENTRAL_SECOND"?2:contractId==="RAW_TO_CENTRAL_THIRD"?3:4;
    const raw=rawMomentVector(data(seed));
    const answer=order===2?raw[1]-raw[0]**2:order===3?raw[2]-3*raw[1]*raw[0]+2*raw[0]**3:raw[3]-4*raw[2]*raw[0]+6*raw[1]*raw[0]**2-3*raw[0]**4;
    const state:Stat006State={kind:"RAW_CENTRAL_RELATION",rawMoments:raw,order:order as 2|3|4};
    const formula=order===2?"μ2 = μ′2 − (μ′1)^2":order===3?"μ3 = μ′3 − 3μ′2μ′1 + 2(μ′1)^3":"μ4 = μ′4 − 4μ′3μ′1 + 6μ′2(μ′1)^2 − 3(μ′1)^4";
    const [m1,m2,m3,m4]=raw.map(fmt);
    const substitution=order===2?`${m2} − ${m1}^2`:order===3?`${m3} − 3 × ${m2} × ${m1} + 2 × ${m1}^3`:`${m4} − 4 × ${m3} × ${m1} + 6 × ${m2} × ${m1}^2 − 3 × ${m1}^4`;
    return {state,answer,stem:`The first four raw moments about the origin are μ′1 = ${fmt(raw[0])}, μ′2 = ${fmt(raw[1])}, μ′3 = ${fmt(raw[2])} and μ′4 = ${fmt(raw[3])}. What is the ${order}${order===2?"nd":order===3?"rd":"th"} central moment.`,explanation:`Use ${formula}. Substituting the stated raw moments gives ${substitution} = ${fmt(answer)}.`};
  }
  if (contractId==="CENTRAL_MOMENT_AFFINE_TRANSFORM") {
    const order=pick([2,3,4] as const,`${seed}:order`); const centralMomentValue=order===2?2.5:order===3?1.5:4.5; const multiplier=pick([-2,2,3] as const,`${seed}:a`); const shift=pick([4,7,10] as const,`${seed}:b`); const answer=centralMomentValue*multiplier**order; const state:Stat006State={kind:"AFFINE_MOMENT",centralMoment:centralMomentValue,order,multiplier,shift};
    return {state,answer,stem:`For a variable X, μ${order}(X) = ${centralMomentValue}. If Y = ${multiplier}X + ${shift}, find μ${order}(Y).`,explanation:`For a central moment, adding ${shift} shifts the values and their mean equally, so the shift does not change the moment. Multiplication by ${multiplier} scales the ${order}${order===2?"nd":order===3?"rd":"th"} central moment by (${multiplier})^${order}: μ${order}(Y) = (${multiplier})^${order} × ${centralMomentValue} = ${fmt(answer)}.`};
  }
  if (contractId==="SKEWNESS_BETA_ONE" || contractId==="SKEWNESS_GAMMA_ONE") {
    const direction=hash(`${seed}:skew`) % 2===0?1:-1; const values=data(seed,direction as 1|-1); const mu2=centralMoment(values,2); const mu3=centralMoment(values,3); const state:Stat006State={kind:"MOMENT_SKEWNESS",mu2,mu3,coefficient:contractId==="SKEWNESS_BETA_ONE"?"beta1":"gamma1"};
    const answer=contractId==="SKEWNESS_BETA_ONE"?mu3**2/mu2**3:mu3/mu2**1.5; const formula=contractId==="SKEWNESS_BETA_ONE"?"β1 = μ3^2 / μ2^3":"γ1 = μ3 / μ2^(3/2)";
    return {state,answer,stem:`For a distribution, the second central moment is μ2 = ${fmt(mu2)} and the third central moment is μ3 = ${fmt(mu3)}. What is ${contractId==="SKEWNESS_BETA_ONE"?"β1":"γ1"}.`,explanation:`Use ${formula}. Substituting the stated moments gives ${contractId==="SKEWNESS_BETA_ONE"?`(${fmt(mu3)})^2 / (${fmt(mu2)})^3`:`(${fmt(mu3)}) / (${fmt(mu2)})^(3/2)`} = ${fmt(answer)}.`};
  }
  if (contractId==="SKEWNESS_BOWLEY") {
    const q1=20+Math.floor(r()*8)*2; const median=q1+10+Math.floor(r()*5)*2; const q3=median+12+Math.floor(r()*5)*2; const answer=(q3+q1-2*median)/(q3-q1); const state:Stat006State={kind:"BOWLEY_SKEWNESS",q1,median,q3};
    return {state,answer,stem:`A distribution has Q1 = ${q1}, median = ${median}, and Q3 = ${q3}. What is Bowley's coefficient of skewness.`,explanation:`Bowley's coefficient = (Q3 + Q1 − 2Median)/(Q3 − Q1). Substituting the values gives (${q3} + ${q1} − 2 × ${median})/(${q3} − ${q1}) = ${fmt(answer)}.`};
  }
  if (contractId==="SKEWNESS_PEARSON_FIRST" || contractId==="SKEWNESS_PEARSON_SECOND") {
    const meanValue=40+Math.floor(r()*8)*5; const reference=contractId==="SKEWNESS_PEARSON_FIRST"?meanValue-6-2*Math.floor(r()*4):meanValue-4-2*Math.floor(r()*4); const sd=4+2*Math.floor(r()*4); const version=contractId==="SKEWNESS_PEARSON_FIRST"?1:2; const answer=(version===1?meanValue-reference:3*(meanValue-reference))/sd; const state:Stat006State={kind:"PEARSON_SKEWNESS",mean:meanValue,reference,standardDeviation:sd,version};
    const refName=version===1?"mode":"median"; const formula=version===1?"(mean − mode) / standard deviation":"3(mean − median) / standard deviation";
    return {state,answer,stem:`A distribution has mean ${meanValue}, ${refName} ${reference} and standard deviation ${sd}. What is Pearson's ${version===1?"first":"second"} coefficient of skewness.`,explanation:`Use ${formula}. Substituting the values gives ${version===1?`(${meanValue} − ${reference}) / ${sd}`:`3(${meanValue} − ${reference}) / ${sd}`} = ${fmt(answer)}.`};
  }
  if (contractId==="SKEWNESS_FROM_THIRD_MOMENT_SIGN") {
    const mu3=pick([-4,0,5] as const,`${seed}:mu3`); const answer=mu3>0?"Positively skewed":mu3<0?"Negatively skewed":"Zero third-moment skewness"; const state:Stat006State={kind:"THIRD_MOMENT_SIGN",mu3};
    return {state,answer,stem:`A distribution has third central moment μ3 = ${mu3}. What does its sign indicate about moment skewness?`,explanation:`The sign of μ3 indicates the direction of moment skewness. Here μ3 is ${mu3>0?"positive":mu3<0?"negative":"zero"}, so the moment-based result is ${answer.toLowerCase()}.`,choices:["Positively skewed","Negatively skewed","Zero third-moment skewness","Cannot be determined"]};
  }
  if (contractId==="KURTOSIS_BETA_TWO") {
    const mu2=pick([2,2.5,4] as const,`${seed}:mu2`); const beta=pick([2.4,3.2,4.5] as const,`${seed}:beta`); const mu4=beta*mu2**2; const answer=mu4/mu2**2; const state:Stat006State={kind:"KURTOSIS",mu2,mu4,output:"beta2"};
    return {state,answer,stem:`A distribution has μ2 = ${fmt(mu2)} and μ4 = ${fmt(mu4)}. What is its moment coefficient of kurtosis β2.`,explanation:`β2 = μ4 / μ2^2. Substituting the values gives ${fmt(mu4)} / ${fmt(mu2)}^2 = ${fmt(answer)}.`};
  }
  const beta2=pick([2.4,3,4.2] as const,`${seed}:beta2`);
  if(hash(`${seed}:excess-mode`)%2===0){const state:Stat006State={kind:"KURTOSIS",mu2:1,mu4:beta2,output:"excess"};const answer=beta2-3;return{state,answer,stem:`A distribution has moment coefficient of kurtosis β2 = ${fmt(beta2)}. What is its excess kurtosis.`,explanation:`Excess kurtosis γ2 = β2 − 3 = ${fmt(beta2)} − 3 = ${fmt(answer)}.`};}
  const state:Stat006State={kind:"KURTOSIS",mu2:1,mu4:beta2,output:"shape"}; const answer=beta2<3?"Platykurtic":beta2>3?"Leptokurtic":"Mesokurtic";
  return {state,answer,stem:`A distribution has moment coefficient of kurtosis β2 = ${fmt(beta2)}. Classify its kurtosis relative to a normal distribution, for which β2 = 3.`,explanation:`Compare β2 = ${fmt(beta2)} with 3. Since it is ${beta2<3?"less than":beta2>3?"greater than":"equal to"} 3, the distribution is ${answer.toLowerCase()}.`,choices:["Platykurtic","Mesokurtic","Leptokurtic","Cannot be determined"]};
}

export function solveStat006State(state:Stat006State):number|string {
  if(state.kind==="RAW_MOMENT")return moment(state.values,state.order);
  if(state.kind==="CENTRAL_MOMENT")return centralMoment(state.values,state.order);
  if(state.kind==="RAW_CENTRAL_RELATION"){const [m1,m2,m3,m4]=state.rawMoments;return state.order===2?m2-m1**2:state.order===3?m3-3*m2*m1+2*m1**3:m4-4*m3*m1+6*m2*m1**2-3*m1**4;}
  if(state.kind==="AFFINE_MOMENT")return state.centralMoment*state.multiplier**state.order;
  if(state.kind==="MOMENT_SKEWNESS")return state.coefficient==="beta1"?state.mu3**2/state.mu2**3:state.mu3/state.mu2**1.5;
  if(state.kind==="BOWLEY_SKEWNESS")return(state.q3+state.q1-2*state.median)/(state.q3-state.q1);
  if(state.kind==="PEARSON_SKEWNESS")return(state.version===1?state.mean-state.reference:3*(state.mean-state.reference))/state.standardDeviation;
  if(state.kind==="THIRD_MOMENT_SIGN")return state.mu3>0?"Positively skewed":state.mu3<0?"Negatively skewed":"Zero third-moment skewness";
  const beta=state.mu4/state.mu2**2;return state.output==="beta2"?beta:state.output==="excess"?beta-3:beta<3?"Platykurtic":beta>3?"Leptokurtic":"Mesokurtic";
}
function numericOptions(answer:number,seed:string){const center=Math.round(answer*100)/100;const scale=Math.abs(center)>20?1:Math.abs(center)>2?0.5:0.2;const vals=[center,center+scale,center-scale,center+2*scale].map(fmt);return shuffle(vals,seed) as [string,string,string,string];}
export function generateStat006Question(input:{seed?:string;examProfile?:Stat006ExamProfile;contractId?:Stat006ContractId}={}):Stat006Question{
  const seed=input.seed??"STAT-006:P0";const examProfile=input.examProfile??"SSC_CGL_TIER_II";const contractId=input.contractId??pick(STAT006_CONTRACTS,`${seed}:contract`);const descriptor=STAT006_PERMANENT_QLS.find(x=>x.contractId===contractId);
  if(!descriptor||!descriptor.supportedProfiles.includes(examProfile))throw new Error(`Unsupported STAT-006 contract/profile: ${contractId}/${examProfile}.`);
  const draft=build(contractId,seed);const answer=typeof draft.answer==="number"?fmt(draft.answer):draft.answer;const opts=draft.choices?shuffle(draft.choices,`${seed}:choices`) as [string,string,string,string]:numericOptions(Number(draft.answer),`${seed}:options`);const correctIndex=hash(`${seed}:${contractId}:answer`) % 4;const found=opts.indexOf(answer);if(found<0)opts[correctIndex]=answer;else[opts[correctIndex],opts[found]]=[opts[found]!,opts[correctIndex]!];
  const question:Stat006Question={packageId:"STAT-006",questionId:`STAT-006:${hash(`${seed}:${examProfile}:${contractId}`).toString(16).padStart(8,"0")}`,qlId:descriptor.qlId,contractId,seed,examProfile,difficulty:descriptor.difficulty,language:"en",stem:draft.stem,options:opts,correctIndex,answer,state:draft.state,explanation:draft.explanation,questionBankWritable:false,testEligible:false,mockTestEligible:false,publiclyPublishable:false,automaticStudentPublication:false,productionReleaseAuthorized:false};
  const solved=solveStat006State(question.state);if(new Set(question.options).size!==4||question.options[correctIndex]!==answer||(typeof solved==="number"?fmt(solved):solved)!==answer)throw new Error(`STAT-006 validation failed for ${contractId}.`);return question;
}
export function generateStat006QuestionStudioBatch(input:{packageId?:string;seed?:string;count?:number;language?:string;examProfile?:string;questionLanguageId?:string}={}){
  if(input.packageId&&input.packageId!=="STAT-006")throw new Error(`Unknown STAT-006 package '${input.packageId}'.`);if(input.language&&input.language!=="en")throw new Error("STAT-006 is English-only; localization has not started.");const examProfile=input.examProfile==="SSC_CGL_JSO"?"SSC_CGL_JSO":"SSC_CGL_TIER_II";const count=Math.min(1000,Math.max(1,Math.floor(input.count??1)));const batchSeed=input.seed??`STAT-006:${examProfile}:review`;const explicit=input.questionLanguageId?getStat006PermanentQl(input.questionLanguageId):undefined;if(input.questionLanguageId&&!explicit)throw new Error(`Unknown STAT-006 QL '${input.questionLanguageId}'.`);const pool=explicit?[explicit]:STAT006_PERMANENT_QLS;
  const questions=Array.from({length:count},(_,index)=>{const d=pool[index%pool.length]!;const q=generateStat006Question({seed:`${batchSeed}:${d.qlId}:${index}`,examProfile,contractId:d.contractId});return{...q,questionLanguageId:q.qlId,canonicalProblemId:"STAT-CP-006",patternId:"STAT-006",permanentQlId:q.qlId,topic:"Statistics",subtopic:"Moments, Skewness & Kurtosis",section:"Quant",generationBackend:"quant-v4",runtimeMode:"STAT006_PERMANENT_ENGLISH_REVIEW_P0",reviewStatus:"ENGLISH_REVIEW_CANDIDATE",questionBankStatus:"NOT_STORED",manualApprovalRequired:true};});
  return{engineId:"quant-v4",generationContext:{generationDomain:"quant-v4",packageId:"STAT-006",canonicalProblemId:"STAT-CP-006",seed:batchSeed,language:"en",examProfile,runtimeMode:"STAT006_PERMANENT_ENGLISH_REVIEW_P0",reviewStatus:"ENGLISH_REVIEW_CANDIDATE",releaseId:STAT006_PERMANENT_OWNERSHIP.releaseId,permanentQlCount:STAT006_PERMANENT_QLS.length,questionStudioDiscoverable:true,questionStudioMode:"CONTROLLED_REVIEW",questionBankStatus:"NOT_STORED",questionBankWritable:false,testEligibility:"INELIGIBLE",testEligible:false,mockTestEligible:false,publiclyPublishable:false,automaticStudentPublication:false,productionReleaseAuthorized:false,manualApprovalRequired:true},questions};
}
export function stat006QuestionStudioPackageCard(){return{id:"STAT-006",packageId:"STAT-006",type:"quant-v4",section:"Quant",domain:"quant",topic:"Statistics",subtopic:"Moments, Skewness & Kurtosis",name:"STAT-006 Moments, Skewness & Kurtosis",label:"Moments, Skewness & Kurtosis",generationDomain:"quant-v4",cpIds:["STAT-CP-006"],permanentQlIds:STAT006_PERMANENT_QLS.map(x=>x.qlId),permanentQlCount:STAT006_PERMANENT_QLS.length,supportedDifficulties:["easy","medium","hard"],supportedLanguages:["en"],supportedExamProfiles:["SSC_CGL_TIER_II","SSC_CGL_JSO"],enabled:true,runtimeMode:"STAT006_PERMANENT_ENGLISH_REVIEW_P0",supportedRuntimeModes:["STAT006_PERMANENT_ENGLISH_REVIEW_P0"],questionStudioDiscoverable:true,questionStudioMode:"CONTROLLED_REVIEW",questionBankStatus:"NOT_STORED",questionBankWritable:false,testEligibility:"INELIGIBLE",testEligible:false,mockTestEligible:false,publiclyPublishable:false,automaticStudentPublication:false,productionReleaseAuthorized:false,manualApprovalRequired:true,localizationStatus:"NOT_STARTED"};}
