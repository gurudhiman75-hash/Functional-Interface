import { generateDi014RadarPieSet, DI014_TASKS } from "./radar-pie-set";
import { renderDi014RadarSvg } from "./radar-svg";
import { renderDiPieSvg } from "../visuals/pie-svg";

export const DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID = "DI-CP-014" as const;
export const DI014_QUESTION_STUDIO_RUNTIME_MODE = "DI014_RADAR_PIE_HYBRID_REVIEW_V1" as const;

export type Di014QuestionStudioRequest = Readonly<{
  packageId?:string; archetypeId?:string; patternId?:string; topic?:string; subtopic?:string;
  canonicalProblemId?:string; cpId?:string; difficulty?:unknown; language?:string; seed?:string; count?:number; examProfile?:string;
}>;

function norm(v:unknown){return String(v??"").trim().toLowerCase().replace(/[^a-z0-9]+/g," ").trim();}
function difficulty(v:unknown):"Easy"|"Medium"|"Hard"|undefined{const n=norm(v);if(n==="easy")return"Easy";if(n==="medium"||n==="moderate")return"Medium";if(n==="hard")return"Hard";return undefined;}

export function isDi014QuestionStudioRequest(request:Di014QuestionStudioRequest){
  const p=norm(request.packageId??request.archetypeId),pattern=norm(request.patternId),topic=norm(request.topic),sub=norm(request.subtopic),cp=String(request.canonicalProblemId??request.cpId??"").trim().toUpperCase();
  return p==="di 014"||pattern==="di 014"||cp===DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID||(topic==="data interpretation"&&["radar pie","radar pie mixed","radar pie hybrid"].includes(sub));
}

export async function generateDi014QuestionStudioBatch(request:Di014QuestionStudioRequest={}){
  const cp=String(request.canonicalProblemId??request.cpId??"").trim().toUpperCase();
  if(cp&&cp!==DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID)throw new Error(`Unknown canonical problem '${cp}' for DI-014.`);
  const lang=String(request.language??"en").trim().toLowerCase();if(lang!=="en")throw new Error("DI-014 V1 is English review-only.");
  const exam=norm(request.examProfile);if(exam&&!(exam.includes("bank")||exam.includes("sbi")||exam.includes("ibps")||exam.includes("mains")))throw new Error("DI-014 V1 is scoped to Banking Mains review.");
  const wanted=difficulty(request.difficulty),count=Math.min(1000,Math.max(1,Math.floor(Number(request.count??1)||1)));
  const batchSeed=String(request.seed??"").trim()||`quant-v4:DI-014:BANKING_MAINS:${wanted??"mixed"}:${Date.now()}`;
  const questionPackages:ReturnType<typeof generateDi014RadarPieSet>[]=[];const questions:any[]=[];
  for(let i=0;i<count;i++){
    const seed=`${batchSeed}:${i}`,set=generateDi014RadarPieSet({seed});questionPackages.push(set);
    const pool=wanted?set.questions.filter(q=>q.difficulty===wanted):set.questions,q=pool[i%pool.length]!;
    questions.push({
      text:q.stem,stem:q.stem,stimulus:{radar:set.radar,pie:set.pie},stimulusSvgs:[renderDi014RadarSvg(set.radar),renderDiPieSvg(set.pie)],
      options:[...q.options],correct:q.correctIndex,correctIndex:q.correctIndex,answer:q.answer,
      canonicalAnswer:{kind:"symbolic" as const,value:q.answer,display:q.answer,rendered:q.answer,rounding:"exact" as const},
      explanation:[q.explanation.keyIdea,...q.explanation.steps].join("\n\n"),richExplanation:q.explanation,
      difficulty:q.difficulty,difficultyLabel:q.difficulty,patternId:"DI-014",section:"Quant",topic:"Data Interpretation",subtopic:"Radar + Pie Hybrid DI",
      generationBackend:"quant-v4",debugSource:"quant-v4-di014-radar-pie-review-v1",questionId:q.questionId,sourceQuestionId:q.questionId,
      seed,examProfile:"BANKING_MAINS" as const,packageId:"DI-014" as const,canonicalProblemId:DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,taskKind:q.kind,
      runtimeMode:DI014_QUESTION_STUDIO_RUNTIME_MODE,reviewStatus:"ENGLISH_REVIEW_CANDIDATE" as const,questionBankStatus:"NOT_STORED" as const,questionBankWritable:false as const,
      questionBankEligible:false as const,testEligibility:"INELIGIBLE" as const,testEligible:false as const,mockTestEligible:false as const,publiclyPublishable:false as const,
      automaticStudentPublication:false as const,productionReleaseAuthorized:false as const,reviewOnly:true as const,manualApprovalRequired:true as const,language:"en" as const,
      metadata:{packageId:"DI-014",canonicalProblemId:DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,taskKind:q.kind,examProfile:"BANKING_MAINS",runtimeMode:DI014_QUESTION_STUDIO_RUNTIME_MODE,reviewStatus:"ENGLISH_REVIEW_CANDIDATE",presentationAuthority:"DATA_INTERPRETATION_RADAR_PIE_HYBRID"}
    });
  }
  return {generationContext:{generationDomain:"quant-v4" as const,chapterId:"DataInterpretation" as const,packageId:"DI-014" as const,canonicalProblemId:DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    seed:batchSeed,timestamp:Date.now(),language:"en" as const,examProfile:"BANKING_MAINS" as const,runtimeMode:DI014_QUESTION_STUDIO_RUNTIME_MODE,reviewStatus:"ENGLISH_REVIEW_CANDIDATE" as const,
    questionStudioDiscoverable:true as const,questionStudioMode:"CONTROLLED_REVIEW" as const,questionBankStatus:"NOT_STORED" as const,questionBankWritable:false as const,
    testEligibility:"INELIGIBLE" as const,testEligible:false as const,mockTestEligible:false as const,publiclyPublishable:false as const,automaticStudentPublication:false as const,
    productionReleaseAuthorized:false as const,manualApprovalRequired:true as const},questionPackages,questions};
}
export function di014QuestionStudioPackageCard(){
  return {id:"DI-014",packageId:"DI-014",type:"quant-v4",section:"Quant",domain:"quant",topic:"Data Interpretation",subtopic:"Radar + Pie Hybrid",name:"DI-014 Radar + Pie Hybrid DI",label:"Radar + Pie Hybrid",
    generationDomain:"quant-v4",cpIds:[DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID],canonicalProblems:[{id:DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,label:"Radar + Pie Hybrid"}],
    supportedDifficulties:["easy","medium","hard"],supportedLanguages:["en"],supportedExamProfiles:["BANKING_MAINS"],enabled:true,runtimeMode:DI014_QUESTION_STUDIO_RUNTIME_MODE,
    supportedRuntimeModes:[DI014_QUESTION_STUDIO_RUNTIME_MODE],reviewStatus:"ENGLISH_REVIEW_CANDIDATE",questionStudioDiscoverable:true,questionStudioMode:"CONTROLLED_REVIEW",
    questionBankStatus:"NOT_STORED",questionBankWritable:false,testEligibility:"INELIGIBLE",testEligible:false,mockTestEligible:false,publiclyPublishable:false,automaticStudentPublication:false,
    productionReleaseAuthorized:false,manualApprovalRequired:true,taskKinds:[...DI014_TASKS]};
}
