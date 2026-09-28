import { generateDi013RadarSet, DI013_TASKS } from "./radar-set";
import { renderDi013RadarSvg } from "./radar-svg";
import type { Di013Difficulty, Di013ExamProfile } from "./types";

export const DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID = "DI-CP-013" as const;
export const DI013_QUESTION_STUDIO_RUNTIME_MODE = "DI013_RADAR_REVIEW_V1" as const;

export type Di013QuestionStudioRequest = Readonly<{
  packageId?:string; archetypeId?:string; patternId?:string; topic?:string; subtopic?:string;
  canonicalProblemId?:string; cpId?:string; difficulty?:unknown; language?:string; seed?:string; count?:number; examProfile?:string;
}>;

function norm(v:unknown){return String(v??"").trim().toLowerCase().replace(/[^a-z0-9]+/g," ").trim();}
export function isDi013QuestionStudioRequest(request:Di013QuestionStudioRequest){
  const p=norm(request.packageId??request.archetypeId),pattern=norm(request.patternId),topic=norm(request.topic),sub=norm(request.subtopic),cp=String(request.canonicalProblemId??request.cpId??"").trim().toUpperCase();
  return p==="di 013"||pattern==="di 013"||cp===DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID||(topic==="data interpretation"&&["radar","radar chart","web chart","spider chart"].includes(sub));
}
function profile(v:unknown):Di013ExamProfile{const n=norm(v);return n.includes("mains")?"BANKING_MAINS":"BANKING_PRELIMS";}
function difficulty(v:unknown):Di013Difficulty|undefined{const n=norm(v);if(n==="easy")return"Easy";if(n==="medium"||n==="moderate")return"Medium";if(n==="hard")return"Hard";return undefined;}

export async function generateDi013QuestionStudioBatch(request:Di013QuestionStudioRequest={}){
  const cp=String(request.canonicalProblemId??request.cpId??"").trim().toUpperCase();if(cp&&cp!==DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID)throw new Error(`Unknown canonical problem '${cp}' for DI-013.`);
  const lang=String(request.language??"en").trim().toLowerCase();if(lang!=="en")throw new Error("DI-013 V1 is English review-only.");
  const examProfile=profile(request.examProfile),wanted=difficulty(request.difficulty),count=Math.min(1000,Math.max(1,Math.floor(Number(request.count??1)||1)));
  const batchSeed=String(request.seed??"").trim()||`quant-v4:DI-013:${examProfile}:${wanted??"mixed"}:${Date.now()}`;
  const questionPackages:ReturnType<typeof generateDi013RadarSet>[]=[];const questions:any[]=[];
  for(let i=0;i<count;i++){
    const seed=`${batchSeed}:${i}`,set=generateDi013RadarSet({seed,examProfile});questionPackages.push(set);
    const pool=wanted?set.questions.filter(q=>q.difficulty===wanted):set.questions,q=pool[i%pool.length]!;
    questions.push({text:q.stem,stem:q.stem,stimulus:set.stimulus,stimulusSvgs:[renderDi013RadarSvg(set.stimulus)],options:[...q.options],correct:q.correctIndex,correctIndex:q.correctIndex,answer:q.answer,
      canonicalAnswer:{kind:"symbolic" as const,value:q.answer,display:q.answer,rendered:q.answer,rounding:"exact" as const},explanation:[q.explanation.keyIdea,...q.explanation.steps].join("\n\n"),richExplanation:q.explanation,
      difficulty:q.difficulty,difficultyLabel:q.difficulty,patternId:"DI-013",section:"Quant",topic:"Data Interpretation",subtopic:"Radar / Web Chart",generationBackend:"quant-v4",
      debugSource:"quant-v4-di013-radar-review-v1",questionId:q.questionId,sourceQuestionId:q.questionId,seed,examProfile:set.examProfile,packageId:"DI-013" as const,
      canonicalProblemId:DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,taskKind:q.kind,runtimeMode:DI013_QUESTION_STUDIO_RUNTIME_MODE,reviewStatus:"ENGLISH_REVIEW_CANDIDATE" as const,
      questionBankStatus:"NOT_STORED" as const,questionBankWritable:false as const,questionBankEligible:false as const,testEligibility:"INELIGIBLE" as const,testEligible:false as const,
      mockTestEligible:false as const,publiclyPublishable:false as const,automaticStudentPublication:false as const,productionReleaseAuthorized:false as const,reviewOnly:true as const,
      manualApprovalRequired:true as const,language:"en" as const,metadata:{packageId:"DI-013",canonicalProblemId:DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,taskKind:q.kind,examProfile:set.examProfile,runtimeMode:DI013_QUESTION_STUDIO_RUNTIME_MODE,reviewStatus:"ENGLISH_REVIEW_CANDIDATE",presentationAuthority:"DATA_INTERPRETATION_RADAR_SVG"}});
  }
  return {generationContext:{generationDomain:"quant-v4" as const,chapterId:"DataInterpretation" as const,packageId:"DI-013" as const,canonicalProblemId:DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    seed:batchSeed,timestamp:Date.now(),language:"en" as const,examProfile,runtimeMode:DI013_QUESTION_STUDIO_RUNTIME_MODE,reviewStatus:"ENGLISH_REVIEW_CANDIDATE" as const,questionStudioDiscoverable:true as const,
    questionStudioMode:"CONTROLLED_REVIEW" as const,questionBankStatus:"NOT_STORED" as const,questionBankWritable:false as const,testEligibility:"INELIGIBLE" as const,testEligible:false as const,
    mockTestEligible:false as const,publiclyPublishable:false as const,automaticStudentPublication:false as const,productionReleaseAuthorized:false as const,manualApprovalRequired:true as const},questionPackages,questions};
}
export function di013QuestionStudioPackageCard(){
  return {id:"DI-013",packageId:"DI-013",type:"quant-v4",section:"Quant",domain:"quant",topic:"Data Interpretation",subtopic:"Radar / Web Chart",name:"DI-013 Radar / Web Chart",label:"Radar / Web Chart",
    generationDomain:"quant-v4",cpIds:[DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID],canonicalProblems:[{id:DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,label:"Radar / Web Chart"}],
    supportedDifficulties:["easy","medium","hard"],supportedLanguages:["en"],supportedExamProfiles:["BANKING_PRELIMS","BANKING_MAINS"],enabled:true,runtimeMode:DI013_QUESTION_STUDIO_RUNTIME_MODE,
    supportedRuntimeModes:[DI013_QUESTION_STUDIO_RUNTIME_MODE],reviewStatus:"ENGLISH_REVIEW_CANDIDATE",questionStudioDiscoverable:true,questionStudioMode:"CONTROLLED_REVIEW",questionBankStatus:"NOT_STORED",
    questionBankWritable:false,testEligibility:"INELIGIBLE",testEligible:false,mockTestEligible:false,publiclyPublishable:false,automaticStudentPublication:false,productionReleaseAuthorized:false,manualApprovalRequired:true,
    taskKinds:[...DI013_TASKS]};
}
