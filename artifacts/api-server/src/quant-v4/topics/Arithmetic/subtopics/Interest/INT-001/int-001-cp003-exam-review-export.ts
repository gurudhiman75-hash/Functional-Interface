import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP003_QL_IDS, generateIntCp003ExamQuestion, type IntCp003ExamQuestion, type IntCp003QlId } from "./cp003-exam-runtime";

function stable(value:unknown):unknown{return JSON.parse(JSON.stringify(value,(_key,item)=>typeof item==="bigint"?item.toString():item));}
function shuffle<T>(items:readonly T[],seed:string):T[]{const out=[...items];let state=2166136261;for(const ch of seed){state^=ch.charCodeAt(0);state=Math.imul(state,16777619);}for(let i=out.length-1;i>0;i--){state^=state<<13;state^=state>>>17;state^=state<<5;const j=(state>>>0)%(i+1);[out[i],out[j]]=[out[j]!,out[i]!];}return out;}

function selectForQl(qlId:IntCp003QlId,globalPositionCounts:number[],globalRateCounts:Map<string,number>,globalRepCounts:Map<string,number>):IntCp003ExamQuestion[]{
  const candidates=Array.from({length:160},(_,index)=>generateIntCp003ExamQuestion(qlId,`int-cp003-exam-review:${qlId}:${index}`));
  const selected:IntCp003ExamQuestion[]=[],templates=new Set<string>(),rates=new Set<string>(),reps=new Set<string>(),families=new Set<string>();
  while(selected.length<4){
    let best:IntCp003ExamQuestion|undefined,bestScore=-Infinity;
    for(const candidate of candidates){
      if(selected.includes(candidate)||families.has(candidate.numericFamilyKey)||selected.some(q=>q.mathematicalFingerprint===candidate.mathematicalFingerprint))continue;
      let score=0;
      if(!templates.has(candidate.normalizedTemplateKey))score+=20;
      if(!reps.has(candidate.presentation.representation))score+=14;
      if(!rates.has(candidate.rateProfileId))score+=10;
      score+=Math.max(0,12-globalPositionCounts[candidate.correctIndex]!)*2;
      score+=Math.max(0,5-(globalRateCounts.get(candidate.rateProfileId)??0))*2;
      score+=Math.max(0,8-(globalRepCounts.get(candidate.presentation.representation)??0));
      if(!selected.some(q=>q.difficulty===candidate.difficulty))score+=4;
      if(score>bestScore){best=candidate;bestScore=score;}
    }
    if(!best)throw new Error(`${qlId}: could not select four diverse review rows`);
    selected.push(best);templates.add(best.normalizedTemplateKey);rates.add(best.rateProfileId);reps.add(best.presentation.representation);families.add(best.numericFamilyKey);
    globalPositionCounts[best.correctIndex]!+=1;globalRateCounts.set(best.rateProfileId,(globalRateCounts.get(best.rateProfileId)??0)+1);globalRepCounts.set(best.presentation.representation,(globalRepCounts.get(best.presentation.representation)??0)+1);
  }
  if(templates.size<3||reps.size<3||rates.size<3)throw new Error(`${qlId}: insufficient stratified review diversity`);
  return selected;
}

const positionCounts=[0,0,0,0],rateCounts=new Map<string,number>(),representationCounts=new Map<string,number>();
let selected=INT_CP003_QL_IDS.flatMap(qlId=>selectForQl(qlId,positionCounts,rateCounts,representationCounts));
function acceptableOrder(rows:readonly IntCp003ExamQuestion[]):boolean{
  let run=1,maxRun=1;for(let i=1;i<rows.length;i++){run=rows[i]!.correctIndex===rows[i-1]!.correctIndex?run+1:1;maxRun=Math.max(maxRun,run);}if(maxRun>3)return false;
  for(let i=0;i+11<rows.length;i++){const b=rows.slice(i,i+4).map(q=>q.correctIndex).join("");if(b===rows.slice(i+4,i+8).map(q=>q.correctIndex).join("")&&b===rows.slice(i+8,i+12).map(q=>q.correctIndex).join(""))return false;}
  return true;
}
for(let attempt=0;attempt<100;attempt++){const ordered=shuffle(selected,`cp003-review-order:${attempt}`);if(acceptableOrder(ordered)){selected=ordered;break;}if(attempt===99)throw new Error("could not remove answer-position pattern");}

const qlCounts=new Map<string,number>(),templatesByQl=new Map<string,Set<string>>(),ratesByRep=new Map<string,Set<string>>(),difficultyCounts=new Map<string,number>(),finalPositionCounts=[0,0,0,0];
for(const q of selected){qlCounts.set(q.qlId,(qlCounts.get(q.qlId)??0)+1);if(!templatesByQl.has(q.qlId))templatesByQl.set(q.qlId,new Set());templatesByQl.get(q.qlId)!.add(q.normalizedTemplateKey);if(!ratesByRep.has(q.presentation.representation))ratesByRep.set(q.presentation.representation,new Set());ratesByRep.get(q.presentation.representation)!.add(q.rateProfileId);difficultyCounts.set(q.difficulty,(difficultyCounts.get(q.difficulty)??0)+1);finalPositionCounts[q.correctIndex]!+=1;}
if([...qlCounts.values()].some(count=>count!==4)||qlCounts.size!==14)throw new Error("review QL stratification failed");
if([...templatesByQl.values()].some(set=>set.size<3))throw new Error("review normalized-template diversity failed");
if(rateCounts.size<12)throw new Error(`review rate coverage ${rateCounts.size}/12`);
if(representationCounts.size!==6)throw new Error(`review representation coverage ${representationCounts.size}/6`);
if([...ratesByRep.values()].some(set=>set.size<3))throw new Error("review representation-rate independence failed");
if(finalPositionCounts.some(count=>count<10||count>18))throw new Error(`review answer-position balance ${finalPositionCounts.join("/")}`);
const easy=difficultyCounts.get("Easy")??0,medium=difficultyCounts.get("Medium")??0,hard=difficultyCounts.get("Hard")??0;
// Easy is deliberately restricted to genuinely low-burden direct questions. Do not inflate the band to meet an artificial quota.
if(easy<1||medium<24||hard<12)throw new Error(`review calibrated difficulty profile ${easy}/${medium}/${hard}`);

const outputDirectory=join(process.cwd(),"dist","quant-v4","int-cp003-exam-readiness-review-pack");mkdirSync(outputDirectory,{recursive:true});
const combined:string[]=["# INT-CP-003 — Exam-Readiness Review Questions and Answers","","> Second remediation candidate. Staging, registration and publication remain locked.",""];
selected.forEach((q,index)=>{
  combined.push(`## Question ${index+1} — \`${q.qlId}\``,"",`**Difficulty:** ${q.difficulty}  `,`**Representation:** ${q.presentation.representation}  `,`**Stem family:** ${q.presentation.stemFamilyId}`,"",q.presentation.markdown,"");
  q.options.forEach((option,optionIndex)=>combined.push(`${String.fromCharCode(65+optionIndex)}. ${option.text}`));
  combined.push("",`**Correct answer:** ${String.fromCharCode(65+q.correctIndex)}. ${q.correctAnswer}`,"",`### Key idea`,q.explanation.keyIdea,"",`### Calculation`,...q.explanation.steps.map((step,stepIndex)=>`${stepIndex+1}. ${step}`),"",q.explanation.finalAnswer,"");
  if(q.explanation.shortcut)combined.push(`### Exam shortcut — ${q.explanation.shortcut.title}`,...q.explanation.shortcut.steps.map(step=>`- ${step}`),"");
  if(q.explanation.commonMistake)combined.push("### Common mistake",q.explanation.commonMistake,"");
  if(q.explanation.verification)combined.push(`### Verification — ${q.explanation.verification.method}`,...q.explanation.verification.steps.map(step=>`- ${step}`),"");
  combined.push("### Option diagnosis");
  q.options.forEach((option,optionIndex)=>combined.push(`- **${String.fromCharCode(65+optionIndex)}. ${option.text}** — ${option.isCorrect?"Correct.":`${option.studentFeedback} \`[${option.misconceptionId}]\` Wrong calculation: ${option.calculation}`}`));
  combined.push("","---","");
});
writeFileSync(join(outputDirectory,"int-cp003-56-exam-readiness-questions-and-answers.md"),`${combined.join("\n")}\n`);
writeFileSync(join(outputDirectory,"int-cp003-56-exam-readiness-data.json"),`${JSON.stringify(stable(selected),null,2)}\n`);
const summary={status:"SECOND_REMEDIATION_REVIEW_CANDIDATE",questions:selected.length,qls:qlCounts.size,samplesPerQl:4,distinctMathematicalStates:new Set(selected.map(q=>q.mathematicalFingerprint)).size,distinctNumericFamilies:new Set(selected.map(q=>q.numericFamilyKey)).size,normalizedTemplatesByQl:Object.fromEntries([...templatesByQl].map(([ql,set])=>[ql,set.size])),rateCounts:Object.fromEntries(rateCounts),rateCoverage:rateCounts.size,representationCounts:Object.fromEntries(representationCounts),representationCoverage:representationCounts.size,difficultyCounts:Object.fromEntries(difficultyCounts),answerPositions:finalPositionCounts,optionAnalysisAlignments:selected.length*4,diagnosticWrongOptions:selected.length*3,lifecycle:{approvalStatus:"WITHDRAWN_PENDING_REAUDIT",enabled:false,stagingStatus:"NOT_STAGED",registrationStatus:"NOT_REGISTERED",questionStudioDiscoverable:false,questionBankStatus:"NOT_STORED",testEligibility:"INELIGIBLE",publiclyPublishable:false}};
writeFileSync(join(outputDirectory,"int-cp003-exam-readiness-review-summary.json"),`${JSON.stringify(summary,null,2)}\n`);
console.log(JSON.stringify(summary,null,2));console.log("PASS_INT_CP003_EXAM_READINESS_REVIEW_EXPORT");
