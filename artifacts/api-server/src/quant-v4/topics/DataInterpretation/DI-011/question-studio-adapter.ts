import { generateDi011MixedSet, DI011_PAIR_KINDS, DI011_TASK_KINDS } from "./mixed-set";
import { renderDi011MixedSvg } from "./mixed-svg";
import type { Di011Difficulty, Di011ExamProfile } from "./types";

export const DI011_QUESTION_STUDIO_CANONICAL_PROBLEM_ID = "DI-CP-011" as const;
export const DI011_QUESTION_STUDIO_RUNTIME_MODE = "DI011_MIXED_MULTI_CHART_REVIEW_V1" as const;

export type Di011QuestionStudioRequest = Readonly<{
  packageId?: string; patternId?: string; topic?: string; subtopic?: string;
  canonicalProblemId?: string; cpId?: string; difficulty?: unknown; language?: string;
  seed?: string; count?: number; examProfile?: string;
}>;

function norm(v:unknown){return String(v??"").trim().toLowerCase().replace(/[^a-z0-9]+/g," ").trim();}
export function isDi011QuestionStudioRequest(request:Di011QuestionStudioRequest){
  const p=norm(request.packageId??request.patternId), t=norm(request.topic), s=norm(request.subtopic), cp=String(request.canonicalProblemId??request.cpId??"").trim().toUpperCase();
  return p==="di 011" || cp===DI011_QUESTION_STUDIO_CANONICAL_PROBLEM_ID || (t==="data interpretation" && ["mixed di","mixed chart","multi chart","mixed multi chart"].includes(s));
}
function profile(v:unknown):Di011ExamProfile { const n=norm(v); if(n.includes("mains")) return "BANKING_MAINS"; return "BANKING_PRELIMS"; }
function difficulty(v:unknown):Di011Difficulty|undefined{const n=norm(v); if(n==="easy")return"Easy"; if(n==="medium"||n==="moderate")return"Medium"; if(n==="hard")return"Hard"; return undefined;}
export async function generateDi011QuestionStudioBatch(request:Di011QuestionStudioRequest={}){
  const lang=String(request.language??"en").toLowerCase(); if(lang!=="en") throw new Error("DI-011 V1 is English review-only; localization has not started.");
  const examProfile=profile(request.examProfile), wanted=difficulty(request.difficulty), count=Math.min(1000,Math.max(1,Math.floor(Number(request.count??1)||1)));
  const batchSeed=String(request.seed??"").trim()||`quant-v4:DI-011:${examProfile}:${wanted??"mixed"}:${Date.now()}`;
  const questionPackages=[] as ReturnType<typeof generateDi011MixedSet>[]; const questions:any[]=[];
  for(let i=0;i<count;i++){
    const seed=`${batchSeed}:${i}`; const set=generateDi011MixedSet({seed,examProfile}); questionPackages.push(set);
    const candidates=wanted?set.questions.filter(q=>q.difficulty===wanted):set.questions; const q=candidates[i%candidates.length]!;
    questions.push({
      text:q.stem,stem:q.stem,stimulus:set.stimulus,stimulusSvgs:[renderDi011MixedSvg(set.stimulus)],options:[...q.options],correct:q.correctIndex,correctIndex:q.correctIndex,answer:q.answer,
      canonicalAnswer:{kind:"symbolic",value:q.answer,display:q.answer,rendered:q.answer,rounding:"exact"},explanation:[q.explanation.keyIdea,...q.explanation.steps].join("\n\n"),richExplanation:q.explanation,
      difficulty:q.difficulty,difficultyLabel:q.difficulty,patternId:"DI-011",section:"Quant",topic:"Data Interpretation",subtopic:"Mixed / Multi-Chart DI",
      generationBackend:"quant-v4",debugSource:"quant-v4-di011-review-v1",questionId:q.questionId,sourceQuestionId:q.questionId,seed,examProfile:set.examProfile,packageId:"DI-011",
      canonicalProblemId:DI011_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,taskKind:q.kind,runtimeMode:DI011_QUESTION_STUDIO_RUNTIME_MODE,reviewStatus:"ENGLISH_REVIEW_CANDIDATE",
      questionBankStatus:"NOT_STORED",questionBankWritable:false,questionBankEligible:false,testEligibility:"INELIGIBLE",testEligible:false,mockTestEligible:false,publiclyPublishable:false,
      automaticStudentPublication:false,productionReleaseAuthorized:false,reviewOnly:true,manualApprovalRequired:true,language:"en",
      metadata:{packageId:"DI-011",canonicalProblemId:DI011_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,taskKind:q.kind,pairKind:set.stimulus.pairKind,examProfile:set.examProfile,reviewStatus:"ENGLISH_REVIEW_CANDIDATE"}
    });
  }
  return {generationContext:{generationDomain:"quant-v4",chapterId:"DataInterpretation",packageId:"DI-011",canonicalProblemId:DI011_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,seed:batchSeed,timestamp:Date.now(),language:"en",examProfile,runtimeMode:DI011_QUESTION_STUDIO_RUNTIME_MODE,reviewStatus:"ENGLISH_REVIEW_CANDIDATE",questionStudioDiscoverable:true,questionStudioMode:"CONTROLLED_REVIEW",questionBankStatus:"NOT_STORED",questionBankWritable:false,testEligibility:"INELIGIBLE",testEligible:false,mockTestEligible:false,publiclyPublishable:false,automaticStudentPublication:false,productionReleaseAuthorized:false,manualApprovalRequired:true},questionPackages,questions};
}
export function di011QuestionStudioPackageCard(){
  return {id:"DI-011",packageId:"DI-011",type:"quant-v4",section:"Quant",domain:"quant",topic:"Data Interpretation",subtopic:"Mixed / Multi-Chart DI",name:"DI-011 Mixed / Multi-Chart DI",label:"Mixed / Multi-Chart DI",generationDomain:"quant-v4",cpIds:[DI011_QUESTION_STUDIO_CANONICAL_PROBLEM_ID],canonicalProblems:[{id:DI011_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,label:"Mixed / Multi-Chart DI"}],supportedDifficulties:["easy","medium","hard"],supportedLanguages:["en"],supportedExamProfiles:["BANKING_PRELIMS","BANKING_MAINS"],enabled:true,runtimeMode:DI011_QUESTION_STUDIO_RUNTIME_MODE,supportedRuntimeModes:[DI011_QUESTION_STUDIO_RUNTIME_MODE],reviewStatus:"ENGLISH_REVIEW_CANDIDATE",questionStudioDiscoverable:true,questionStudioMode:"CONTROLLED_REVIEW",questionBankStatus:"NOT_STORED",questionBankWritable:false,testEligibility:"INELIGIBLE",testEligible:false,mockTestEligible:false,publiclyPublishable:false,automaticStudentPublication:false,productionReleaseAuthorized:false,manualApprovalRequired:true,pairKinds:[...DI011_PAIR_KINDS],taskKinds:[...DI011_TASK_KINDS]};
}
