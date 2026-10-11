import {buildPnc001NativeReview} from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-001/foundation/localization-review";
import { getPnc001QuestionEntries } from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-001/foundation/library";
import { runPnc001Pipeline } from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-001/foundation/pipeline";
import { getPnc002QuestionEntries } from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/library";
import { runPnc002Pipeline } from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/pipeline";
import { getCp011GroupingEntries, runPnc002Cp011GroupingPipeline } from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/cp011-grouping-runtime";
import { getCp011DistributionWave1Entries, runPnc002Cp011DistributionWave1Pipeline } from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/cp011-distribution-wave1-reviewed-runtime";
import { getCp011DistributionWave2Entries, runPnc002Cp011DistributionWave2Pipeline } from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/cp011-distribution-wave2-runtime";
import { getCp011InverseEntries, runPnc002Cp011InversePipeline } from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/cp011-inverse-wave-runtime";
import { getCp012Entries, runPnc002Cp012Pipeline } from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/cp012-mixed-runtime-reviewed";
import {buildPnc002ProductionTeacherStudentPresentation} from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/student-presentation-teacher-production";
import {buildPnc002ApprovedLocalizedPresentation} from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/localization-pnc002-approved";
import {QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 as standardLifecycle} from "./standard-lifecycle";
import type {QuestionStudioGenerationRequest,QuestionStudioGenerationResult,QuestionStudioPackageDefinition,QuestionStudioGeneratedQuestion} from "./engine-types";
const {questionBankAcceptanceMode:_mode,questionBankAcceptanceAuthority:_authority,...lifecycle}=standardLifecycle;
const authorities = [
 [getPnc001QuestionEntries(), runPnc001Pipeline],
 [getPnc002QuestionEntries(), runPnc002Pipeline],
 [getCp011GroupingEntries(), runPnc002Cp011GroupingPipeline],
 [getCp011DistributionWave1Entries(), runPnc002Cp011DistributionWave1Pipeline],
 [getCp011DistributionWave2Entries(), runPnc002Cp011DistributionWave2Pipeline],
 [getCp011InverseEntries(), runPnc002Cp011InversePipeline],
 [getCp012Entries(), runPnc002Cp012Pipeline],
] as const;

function hash(s:string):number {let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function pncReviewPackages():QuestionStudioPackageDefinition[] {
 return [1,2].map((n):QuestionStudioPackageDefinition=>({engineId:"quant-v4",packageId:`PNC-00${n}`,topic:"Arithmetic",subtopic:"Permutation & Combination",label:`Permutation & Combination — ${n===1?'fundamentals':'advanced'} review`,enabled:true,cpIds:Array.from({length:6},(_,i)=>`PNC-CP-${String(i+1+(n===2?6:0)).padStart(3,'0')}`),supportedLanguages:["en","hi","pa"],supportedDifficulties:["Easy","Medium","Hard"],difficultyFilterSupported:true,runtimeMode:"PNC-REGISTERED-REVIEW",...lifecycle,lifecycleStage:"REVIEW_ONLY",metadata:{qlCount:n===1?106:163,chapterAuditClosed:true,technicalReviewFrozen:true,freezeAuthority:"PNC-CHAPTER-FREEZE-20261011",auditScope:"TECHNICAL_REVIEW",nativeApproval:n===2?'PNC-002-HI-PA-v1-APPROVED-COMPLETE':'AUTHORED_REVIEW_CANDIDATE',liveVerification:'USER_DEFERRED'}}));
}
export function generatePncReviewBatch(request:QuestionStudioGenerationRequest):QuestionStudioGenerationResult|null {
 const packageId=String(request.packageId??request.patternId??'').toUpperCase();
 if(!['PNC-001','PNC-002'].includes(packageId))return null;
 const language=request.language??'en',count=request.count??1,seed=String(request.seed??'PNC-REVIEW'),band=String(request.difficulty??'mixed').toLowerCase().replace('moderate','medium');
 if(!['en','hi','pa'].includes(language))throw Error('Unsupported PNC language');
 if(!Number.isInteger(count)||count<1||count>50)throw Error('PNC count must be 1..50');
 if(!['mixed','easy','medium','hard'].includes(band))throw Error('Unsupported PNC difficulty');
 const pool=authorities.flatMap(([entries,run],i)=>entries.map(entry=>({entry,run,packageId:i===0?'PNC-001':'PNC-002'}))).filter(r=>r.packageId===packageId&&(!request.canonicalProblemId||(("cpId" in r.entry ? r.entry.cpId : undefined)??(Number(r.entry.qlId.slice(-3))>=242?'PNC-CP-012':'PNC-CP-011'))===request.canonicalProblemId)&&(!request.questionLanguageId||r.entry.qlId===request.questionLanguageId)&&(band==='mixed'||r.entry.difficulty.toLowerCase()===band)).sort((a,b)=>hash(`${seed}:${a.entry.qlId}`)-hash(`${seed}:${b.entry.qlId}`)||a.entry.qlId.localeCompare(b.entry.qlId));
 if(!pool.length)throw Error('No PNC questions match these filters');
 const questions:QuestionStudioGeneratedQuestion[]=[],seen=new Set<string>();
 for(let attempt=0;attempt<Math.max(100,count*20)&&questions.length<count;attempt++) {
  const item=pool[attempt%pool.length],source=item.run({questionLanguageId:item.entry.qlId,seed:`${seed}:${attempt}`});
  if(!source.validation.valid||source.publiclyPublishable!==false)throw Error(`Invalid PNC runtime ${item.entry.qlId}`);
  let stem=source.stem,options=source.options,correctIndex=source.correctIndex,explanation=source.explanation.lines.join('\n\n');
  if(packageId==='PNC-001'&&language!=='en') {
   const presentation=buildPnc001NativeReview(source as Parameters<typeof buildPnc001NativeReview>[0],language as 'hi'|'pa');
   stem=presentation.stem;options=presentation.displayOptions;correctIndex=presentation.correctIndex;explanation=presentation.explanation;
  }
  if(packageId==='PNC-002') {
   const presentation=language==='en'?buildPnc002ProductionTeacherStudentPresentation(source):buildPnc002ApprovedLocalizedPresentation(source,language==='hi'?'hi-IN':'pa-IN');
   stem=presentation.stem;options=presentation.displayOptions;correctIndex=presentation.correctIndex;
   explanation=presentation.explanationSections.map(s=>`${s.heading}\n${s.lines.join('\n')}`).join('\n\n');
  }
  if(!stem||!explanation||options.length!==4||new Set(options).size!==4||correctIndex<0||correctIndex>3)throw Error('Invalid PNC learner presentation');
  const key=JSON.stringify([stem,options]);if(seen.has(key))continue;seen.add(key);
  questions.push({questionId:`${packageId}:${source.questionLanguageId}:${hash(`${seed}:${attempt}`)}:${language}`,text:stem,stem,options:[...options],correct:correctIndex,correctIndex,answer:options[correctIndex],answerText:options[correctIndex],explanation,difficulty:item.entry.difficulty,difficultyLabel:item.entry.difficulty,language,packageId,patternId:packageId,canonicalProblemId:source.canonicalProblemId,qlId:source.questionLanguageId,questionLanguageId:source.questionLanguageId,solveMode:source.solveMode,section:'Quant',topic:'Arithmetic',subtopic:'Permutation & Combination',generationBackend:'quant-v4',...lifecycle,lifecycleStage:'REVIEW_ONLY',reviewOnly:true,questionStudioRegistrationStatus:'REGISTERED_REVIEW_ONLY',routeMounted:true,productionSelectorVisible:true,persistenceAllowed:false,publicReleaseAuthorized:false,metadata:{sourcePackageId:source.packageId,chapterAuditClosed:true,technicalReviewFrozen:true,freezeAuthority:"PNC-CHAPTER-FREEZE-20261011",auditScope:"TECHNICAL_REVIEW",liveVerificationStatus:'DEFERRED_BY_USER',nativeAuthority:language==='en'?null:packageId==='PNC-002'?'PNC-002-HI-PA-v1-APPROVED-COMPLETE':'PNC-001-AUTHORED-REVIEW-CANDIDATE'}});
 }
 if(questions.length!==count)throw Error(`PNC could generate only ${questions.length} unique questions for these filters`);
 return {questions,generationContext:{engineId:'quant-v4',generationDomain:'quant-v4',packageId,seed,...lifecycle,lifecycleStage:'REVIEW_ONLY',reviewOnly:true,publicReleaseAuthorized:false}};
}
