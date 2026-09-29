import{ENG013_CP_IDS_V1}from"../../english-v1/chapters/word-usage/ENG-013/eng-013-authorities-v1";
import{generateEng013Cp005SetV3,generateEng013QuestionV3}from"../../english-v1/chapters/word-usage/ENG-013/eng-013-v3";
import type{QuestionStudioEngineAdapter,QuestionStudioGenerationRequest,QuestionStudioGenerationResult,QuestionStudioLanguage}from"../engine-types";
import{QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1}from"../standard-lifecycle";

export const ENG013_QUESTION_STUDIO_PACKAGE_ID_V1="english-eng013-word-usage-v1"as const;
type Eng013CpId=typeof ENG013_CP_IDS_V1[number];
const lifecycle=QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const text=(v:unknown)=>typeof v==="string"?v.trim():"";
function language(v:QuestionStudioGenerationRequest["language"]):QuestionStudioLanguage{if(!v||v==="en")return"en";throw new Error("ENG-013 currently supports English only");}
function count(v:number|undefined){if(v==null)return 5;if(!Number.isInteger(v)||v<1||v>20)throw new Error("ENG-013 review count must be between 1 and 20");return v;}
function explicitCp(r:QuestionStudioGenerationRequest):Eng013CpId|undefined{const vals=[r.patternId,r.canonicalProblemId,r.questionLanguageId].map(v=>text(v).toUpperCase());return vals.find((v):v is Eng013CpId=>(ENG013_CP_IDS_V1 as readonly string[]).includes(v));}
function difficulty(r:QuestionStudioGenerationRequest){const v=text(r.difficulty).toLowerCase();if(!v||v==="mixed")return undefined;if(v==="easy"||v==="medium"||v==="hard")return v as"easy"|"medium"|"hard";throw new Error("ENG-013 difficulty must be Easy, Medium, Hard, or Mixed");}
function studioQuestion(q:any,seed:string){
 const d=String(q.metadata.difficulty),difficultyLabel=d[0]!.toUpperCase()+d.slice(1);
 return{...lifecycle,id:q.questionId,questionId:q.questionId,packageId:ENG013_QUESTION_STUDIO_PACKAGE_ID_V1,patternId:q.metadata.cpId,cpId:q.metadata.cpId,subject:"English",topic:"Word Usage",subtopic:q.metadata.cpId,language:"en",locale:"en-IN",stem:q.stem,text:`${q.stem}\n${q.options.map((o:string,i:number)=>`${String.fromCharCode(65+i)}. ${o}`).join("\n")}`,targetWord:q.targetWord,options:[...q.options],correctIndex:q.correctOptionIndex,correct:q.correctOptionIndex,explanation:q.explanation,explanationEmphasis:q.explanationEmphasis,difficulty:difficultyLabel,difficultyLabel,authorityId:q.metadata.authorityId,mode:q.metadata.mode,registrationStatus:"REGISTERED_REVIEW_ONLY",registrationAuthorityId:"ENG-013-IMPLEMENTATION-V1",humanReviewApproved:false,authoringReviewApproved:false,reviewOnly:true,questionStudioDiscoverable:true,questionStudioGenerationEnabled:true,runtimeRegistered:true,readOnly:true,revisionPolicy:"SOURCE_GENERATOR_ONLY",productionReleased:false,generationSeed:seed};
}
export function isEng013QuestionStudioRequestV1(r:QuestionStudioGenerationRequest){if(text(r.packageId).toLowerCase()===ENG013_QUESTION_STUDIO_PACKAGE_ID_V1)return true;return Boolean(explicitCp(r));}
export const languageV1Eng013QuestionStudioAdapterV1:QuestionStudioEngineAdapter={
 engineId:"language-v1",
 listPackages(){return[{engineId:"language-v1",packageId:ENG013_QUESTION_STUDIO_PACKAGE_ID_V1,subject:"English",topic:"Word Usage",subtopic:"Contextual Usage",label:"ENG-013 Word Usage",enabled:true,cpIds:[...ENG013_CP_IDS_V1],supportedLanguages:["en"],supportedDifficulties:["Easy","Medium","Hard"],difficultyFilterSupported:true,runtimeMode:"review-only",supportedRuntimeModes:["review-only"],lifecycleId:lifecycle.lifecycleId,lifecycleStage:"REVIEW_ONLY",reviewSurfaceRequired:true,manualApprovalRequired:true,questionBankStatus:lifecycle.questionBankStatus,questionBankWritable:false,testEligibility:lifecycle.testEligibility,testEligible:false,mockTestEligible:false,publiclyPublishable:false,automaticStudentPublication:false,productionReleaseAuthorized:false,metadata:{registrationStatus:"REGISTERED_REVIEW_ONLY",implementedCpIds:[...ENG013_CP_IDS_V1],authorityPatterns:384,composerComplete:true,humanApprovalPending:true}}];},
 async generate(r):Promise<QuestionStudioGenerationResult>{
  if(!isEng013QuestionStudioRequestV1(r))throw new Error("language-v1 ENG-013 adapter requires ENG-013 package or CP selector");
  if(r.runtimeMode&&r.runtimeMode!=="review-only")throw new Error("ENG-013 only supports review-only runtime");
  const outputLanguage=language(r.language),total=count(r.count),baseSeed=text(r.seed)||"eng013-question-studio-v1",forced=explicitCp(r),questions:Record<string,unknown>[]=[];
  for(let i=0;i<total;i++){const seed=`${baseSeed}:${i}`;if(forced==="ENG-013-CP005"){const x=generateEng013Cp005SetV3(seed);const sq=studioQuestion(x.question,seed);questions.push({...sq,cpId:"ENG-013-CP005",patternId:"ENG-013-CP005",sourceCpId:x.sourceCpId,composerProfile:x.profile});}else{const cp=(forced??(["ENG-013-CP001","ENG-013-CP002","ENG-013-CP003","ENG-013-CP004"]as const)[i%4]!)as any;questions.push(studioQuestion(generateEng013QuestionV3({seed,cpId:cp,difficulty:difficulty(r)}),seed));}}
  return{questions,generationContext:{...lifecycle,engineId:"language-v1",packageId:ENG013_QUESTION_STUDIO_PACKAGE_ID_V1,cpSelection:forced??"DETERMINISTIC_CP001_CP004",runtimeMode:"review-only",humanReviewApproved:false,reviewOnly:true,language:outputLanguage,seed:baseSeed,count:total}};
 }
};
