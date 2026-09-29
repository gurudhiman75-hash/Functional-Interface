import{ENG012_CP_IDS_V1}from"../../english-v1/chapters/word-swap/ENG-012/eng-012-authorities-v1";
import{generateEng012Cp005SetV2,generateEng012QuestionV2}from"../../english-v1/chapters/word-swap/ENG-012/eng-012-v2";
import type{QuestionStudioEngineAdapter,QuestionStudioGenerationRequest,QuestionStudioGenerationResult,QuestionStudioLanguage}from"../engine-types";
import{QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1}from"../standard-lifecycle";

export const ENG012_QUESTION_STUDIO_PACKAGE_ID_V1="english-eng012-word-swap-v1"as const;
type Eng012CpId=typeof ENG012_CP_IDS_V1[number];
const lifecycle=QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const text=(v:unknown)=>typeof v==="string"?v.trim():"";
function language(v:QuestionStudioGenerationRequest["language"]):QuestionStudioLanguage{if(!v||v==="en")return"en";throw new Error("ENG-012 currently supports English only");}
function count(v:number|undefined){if(v==null)return 5;if(!Number.isInteger(v)||v<1||v>20)throw new Error("ENG-012 review count must be between 1 and 20");return v;}
function explicitCp(r:QuestionStudioGenerationRequest):Eng012CpId|undefined{const vals=[r.patternId,r.canonicalProblemId,r.questionLanguageId].map(v=>text(v).toUpperCase());return vals.find((v):v is Eng012CpId=>(ENG012_CP_IDS_V1 as readonly string[]).includes(v));}
function difficulty(r:QuestionStudioGenerationRequest){const v=text(r.difficulty).toLowerCase();if(!v||v==="mixed")return undefined;if(v==="easy"||v==="medium"||v==="hard")return v as"easy"|"medium"|"hard";throw new Error("ENG-012 difficulty must be Easy, Medium, Hard, or Mixed");}
function studioQuestion(q:any,seed:string){
 const d=String(q.metadata.difficulty),difficultyLabel=d[0]!.toUpperCase()+d.slice(1);
 return{...lifecycle,id:q.questionId,questionId:q.questionId,packageId:ENG012_QUESTION_STUDIO_PACKAGE_ID_V1,patternId:q.metadata.cpId,cpId:q.metadata.cpId,subject:"English",topic:"Word Swap",subtopic:q.metadata.cpId,language:"en",locale:"en-IN",
 stem:q.stem,text:`${q.stem}\n${q.sentence}\n${q.options.map((o:string,i:number)=>`${String.fromCharCode(65+i)}. ${o}`).join("\n")}`,sentence:q.sentence,options:[...q.options],correctIndex:q.correctOptionIndex,correct:q.correctOptionIndex,explanation:q.explanation,explanationEmphasis:q.explanationEmphasis,difficulty:difficultyLabel,difficultyLabel,authorityId:q.metadata.authorityId,correctSwap:q.metadata.correctSwap,correctedSentence:q.metadata.correctedSentence,
 registrationStatus:"REGISTERED_REVIEW_ONLY",registrationAuthorityId:"ENG-012-IMPLEMENTATION-V1",humanReviewApproved:false,authoringReviewApproved:false,reviewOnly:true,questionStudioDiscoverable:true,questionStudioGenerationEnabled:true,runtimeRegistered:true,readOnly:true,revisionPolicy:"SOURCE_GENERATOR_ONLY",productionReleased:false,generationSeed:seed};
}
export function isEng012QuestionStudioRequestV1(r:QuestionStudioGenerationRequest){
 if(text(r.packageId).toLowerCase()===ENG012_QUESTION_STUDIO_PACKAGE_ID_V1)return true;
 return Boolean(explicitCp(r));
}
export const languageV1Eng012QuestionStudioAdapterV1:QuestionStudioEngineAdapter={
 engineId:"language-v1",
 listPackages(){return[{engineId:"language-v1",packageId:ENG012_QUESTION_STUDIO_PACKAGE_ID_V1,subject:"English",topic:"Word Swap",subtopic:"Misplaced Words",label:"ENG-012 Word Swap",enabled:true,cpIds:[...ENG012_CP_IDS_V1],supportedLanguages:["en"],supportedDifficulties:["Easy","Medium","Hard"],difficultyFilterSupported:true,runtimeMode:"review-only",supportedRuntimeModes:["review-only"],lifecycleId:lifecycle.lifecycleId,lifecycleStage:"REVIEW_ONLY",reviewSurfaceRequired:true,manualApprovalRequired:true,questionBankStatus:lifecycle.questionBankStatus,questionBankWritable:false,testEligibility:lifecycle.testEligibility,testEligible:false,mockTestEligible:false,publiclyPublishable:false,automaticStudentPublication:false,productionReleaseAuthorized:false,metadata:{registrationStatus:"REGISTERED_REVIEW_ONLY",implementedCpIds:["ENG-012-CP001","ENG-012-CP002","ENG-012-CP003","ENG-012-CP004","ENG-012-CP005"],authorityPatterns:450,generatedSurfaces:1350,composerPending:false,humanApprovalPending:true}}];},
 async generate(r):Promise<QuestionStudioGenerationResult>{
  if(!isEng012QuestionStudioRequestV1(r))throw new Error("language-v1 ENG-012 adapter requires ENG-012 package or CP selector");
  if(r.runtimeMode&&r.runtimeMode!=="review-only")throw new Error("ENG-012 only supports review-only runtime");
  const outputLanguage=language(r.language),total=count(r.count),baseSeed=text(r.seed)||"eng012-question-studio-v1",forced=explicitCp(r),questions:Record<string,unknown>[]=[];
  for(let i=0;i<total;i++){const seed=`${baseSeed}:${i}`;if(forced==="ENG-012-CP005"){const composed=generateEng012Cp005SetV2(seed);const sq=studioQuestion(composed.question,seed);questions.push({...sq,cpId:"ENG-012-CP005",patternId:"ENG-012-CP005",sourceCpId:composed.sourceCpId,composerProfile:composed.profile});}else{const cp=(forced??(["ENG-012-CP001","ENG-012-CP002","ENG-012-CP003","ENG-012-CP004"]as const)[i%4]!)as any;questions.push(studioQuestion(generateEng012QuestionV2({seed,cpId:cp,difficulty:difficulty(r)}),seed));}}
  return{questions,generationContext:{...lifecycle,engineId:"language-v1",packageId:ENG012_QUESTION_STUDIO_PACKAGE_ID_V1,cpSelection:forced??"DETERMINISTIC_CP001_CP004",runtimeMode:"review-only",humanReviewApproved:false,reviewOnly:true,language:outputLanguage,seed:baseSeed,count:total}};
 }
};
