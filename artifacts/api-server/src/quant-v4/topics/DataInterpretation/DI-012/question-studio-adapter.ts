import { generateDi012Set, DI012_MODEL_KINDS } from "./advanced-missing-set";
import { renderDi012TableHtml } from "./render-table";
import type { Di012Difficulty, Di012ExamProfile } from "./types";

export const DI012_QUESTION_STUDIO_CANONICAL_PROBLEM_ID = "DI-CP-012" as const;
export const DI012_QUESTION_STUDIO_RUNTIME_MODE = "DI012_ADVANCED_MISSING_VARIABLE_REVIEW_V1" as const;

export type Di012QuestionStudioRequest = Readonly<{
  packageId?: string; patternId?: string; topic?: string; subtopic?: string;
  canonicalProblemId?: string; cpId?: string; difficulty?: unknown; language?: string;
  seed?: string; count?: number; examProfile?: string;
}>;

function norm(v:unknown){return String(v??"").trim().toLowerCase().replace(/[^a-z0-9]+/g," ").trim();}
export function isDi012QuestionStudioRequest(request:Di012QuestionStudioRequest){
  const p=norm(request.packageId??request.patternId),t=norm(request.topic),s=norm(request.subtopic),cp=String(request.canonicalProblemId??request.cpId??"").trim().toUpperCase();
  return p==="di 012" || cp===DI012_QUESTION_STUDIO_CANONICAL_PROBLEM_ID || (t==="data interpretation" && ["advanced missing data","variable di","multi missing di","advanced missing variable di"].includes(s));
}
function profile(v:unknown):Di012ExamProfile{const n=norm(v);return n.includes("mains")?"BANKING_MAINS":"BANKING_PRELIMS";}
function diff(v:unknown):Di012Difficulty|undefined{const n=norm(v);if(n==="easy")return"Easy";if(n==="medium"||n==="moderate")return"Medium";if(n==="hard")return"Hard";return undefined;}

export async function generateDi012QuestionStudioBatch(request:Di012QuestionStudioRequest={}){
  const language=String(request.language??"en").trim().toLowerCase(); if(language!=="en")throw new Error("DI-012 V1 is English review-only.");
  const examProfile=profile(request.examProfile),difficulty=diff(request.difficulty),count=Math.min(1000,Math.max(1,Math.floor(Number(request.count??1)||1)));
  const batchSeed=String(request.seed??"").trim()||`quant-v4:DI-012:${examProfile}:${difficulty??"mixed"}:${Date.now()}`;
  const questionPackages=[] as ReturnType<typeof generateDi012Set>[]; const questions:any[]=[];
  for(let i=0;i<count;i++){
    const seed=`${batchSeed}:${i}`;const set=generateDi012Set({seed,examProfile});questionPackages.push(set);
    const pool=difficulty?set.questions.filter(q=>q.difficulty===difficulty):set.questions;const q=pool[i%pool.length]!;
    questions.push({
      text:q.stem,stem:q.stem,stimulus:set.stimulus,stimulusHtml:renderDi012TableHtml(set.stimulus),options:[...q.options],correct:q.correctIndex,correctIndex:q.correctIndex,answer:q.answer,
      canonicalAnswer:{kind:"symbolic",value:q.answer,display:q.answer,rendered:q.answer,rounding:"exact"},explanation:[q.explanation.keyIdea,...q.explanation.steps].join("\n\n"),richExplanation:q.explanation,
      difficulty:q.difficulty,difficultyLabel:q.difficulty,patternId:"DI-012",section:"Quant",topic:"Data Interpretation",subtopic:"Advanced Variable / Multi-Missing DI",
      generationBackend:"quant-v4",debugSource:"quant-v4-di012-review-v1",questionId:q.questionId,sourceQuestionId:q.questionId,seed,examProfile:set.examProfile,packageId:"DI-012",
      canonicalProblemId:DI012_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,taskKind:q.kind,modelKind:set.stimulus.modelKind,runtimeMode:DI012_QUESTION_STUDIO_RUNTIME_MODE,reviewStatus:"ENGLISH_REVIEW_CANDIDATE",
      questionBankStatus:"NOT_STORED",questionBankWritable:false,questionBankEligible:false,testEligibility:"INELIGIBLE",testEligible:false,mockTestEligible:false,publiclyPublishable:false,
      automaticStudentPublication:false,productionReleaseAuthorized:false,reviewOnly:true,manualApprovalRequired:true,language:"en",
      metadata:{packageId:"DI-012",canonicalProblemId:DI012_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,taskKind:q.kind,modelKind:set.stimulus.modelKind,examProfile:set.examProfile,reviewStatus:"ENGLISH_REVIEW_CANDIDATE"}
    });
  }
  return {generationContext:{generationDomain:"quant-v4",chapterId:"DataInterpretation",packageId:"DI-012",canonicalProblemId:DI012_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,seed:batchSeed,timestamp:Date.now(),language:"en",examProfile,runtimeMode:DI012_QUESTION_STUDIO_RUNTIME_MODE,reviewStatus:"ENGLISH_REVIEW_CANDIDATE",questionStudioDiscoverable:true,questionStudioMode:"CONTROLLED_REVIEW",questionBankStatus:"NOT_STORED",questionBankWritable:false,testEligibility:"INELIGIBLE",testEligible:false,mockTestEligible:false,publiclyPublishable:false,automaticStudentPublication:false,productionReleaseAuthorized:false,manualApprovalRequired:true},questionPackages,questions};
}
export function di012QuestionStudioPackageCard(){
  return {id:"DI-012",packageId:"DI-012",type:"quant-v4",section:"Quant",domain:"quant",topic:"Data Interpretation",subtopic:"Advanced Variable / Multi-Missing DI",name:"DI-012 Advanced Variable / Multi-Missing DI",label:"Advanced Variable / Multi-Missing DI",generationDomain:"quant-v4",cpIds:[DI012_QUESTION_STUDIO_CANONICAL_PROBLEM_ID],canonicalProblems:[{id:DI012_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,label:"Advanced Variable / Multi-Missing DI"}],supportedDifficulties:["easy","medium","hard"],supportedLanguages:["en"],supportedExamProfiles:["BANKING_PRELIMS","BANKING_MAINS"],enabled:true,runtimeMode:DI012_QUESTION_STUDIO_RUNTIME_MODE,supportedRuntimeModes:[DI012_QUESTION_STUDIO_RUNTIME_MODE],reviewStatus:"ENGLISH_REVIEW_CANDIDATE",questionStudioDiscoverable:true,questionStudioMode:"CONTROLLED_REVIEW",questionBankStatus:"NOT_STORED",questionBankWritable:false,testEligibility:"INELIGIBLE",testEligible:false,mockTestEligible:false,publiclyPublishable:false,automaticStudentPublication:false,productionReleaseAuthorized:false,manualApprovalRequired:true,modelKinds:[...DI012_MODEL_KINDS]};
}
