import{ENG010_CP_IDS_V1}from"../../english-v1/chapters/para-jumbles/ENG-010/eng-010-authorities-v1";
import{generateEng010Cp005SetV1,generateEng010QuestionV1}from"../../english-v1/chapters/para-jumbles/ENG-010/eng-010-v1";
import type{QuestionStudioEngineAdapter,QuestionStudioGenerationRequest,QuestionStudioGenerationResult,QuestionStudioLanguage}from"../engine-types";
import{QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1}from"../standard-lifecycle";

export const ENG010_QUESTION_STUDIO_PACKAGE_ID_V1="english-eng010-para-jumbles-v1" as const;
type Eng010CpId=typeof ENG010_CP_IDS_V1[number];
const lifecycle=QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const text=(v:unknown)=>typeof v==="string"?v.trim():"";
function hash(v:string){let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function language(v:QuestionStudioGenerationRequest["language"]):QuestionStudioLanguage{if(!v||v==="en")return"en";throw new Error("ENG-010 currently supports English only");}
function count(v:number|undefined){if(v==null)return 5;if(!Number.isInteger(v)||v<1||v>20)throw new Error("ENG-010 review batches require count between 1 and 20");return v;}
function explicitCp(r:QuestionStudioGenerationRequest):Eng010CpId|undefined{
 const vals=[r.patternId,r.canonicalProblemId,r.questionLanguageId].map(v=>text(v).toUpperCase());
 return vals.find((v):v is Eng010CpId=>(ENG010_CP_IDS_V1 as readonly string[]).includes(v));
}
function profile(r:QuestionStudioGenerationRequest){
 const t=`${text(r.topic)} ${text(r.subtopic)} ${text(r.canonicalProblemId)}`.toLowerCase();
 if(t.includes("ssc-standard"))return"ssc-standard" as const;
 if(t.includes("ssc-advanced"))return"ssc-advanced" as const;
 if(t.includes("banking-prelims"))return"banking-prelims" as const;
 if(t.includes("banking-mains"))return"banking-mains" as const;
}
function difficulty(r:QuestionStudioGenerationRequest){
 const v=text(r.difficulty).toLowerCase();
 if(!v||v==="mixed")return undefined;
 if(v==="easy"||v==="medium"||v==="hard")return v as"easy"|"medium"|"hard";
 throw new Error("ENG-010 difficulty must be Easy, Medium, Hard, or Mixed");
}
function studioQuestion(q:any,cp:string,seed:string,extra:Record<string,unknown>={}){
 const d=String(q.metadata.difficulty),difficultyLabel=d[0]!.toUpperCase()+d.slice(1);
 const sentenceText=q.sentences.map((s:any)=>`${s.label}. ${s.text}`).join("\n");
 return{
  ...lifecycle,id:q.questionId,questionId:q.questionId,packageId:ENG010_QUESTION_STUDIO_PACKAGE_ID_V1,
  patternId:cp,cpId:cp,subject:"English",topic:"Para Jumbles",subtopic:cp,language:"en",locale:"en-IN",
  stem:q.stem,sentences:q.sentences,prompt:q.prompt,
  text:[q.stem,sentenceText,q.prompt,...q.options.map((o:string,i:number)=>`${String.fromCharCode(65+i)}. ${o}`)].join("\n"),
  options:[...q.options],correctIndex:q.correctOptionIndex,correct:q.correctOptionIndex,explanation:q.explanation,
  difficulty:difficultyLabel,difficultyLabel,setId:q.metadata.setId,topicLabel:q.metadata.topic,correctOrder:q.metadata.correctOrder,
  registrationStatus:"REGISTERED_REVIEW_ONLY",registrationAuthorityId:"ENG-010-IMPLEMENTATION-V1",
  humanReviewApproved:false,authoringReviewApproved:false,reviewOnly:true,questionStudioDiscoverable:true,
  questionStudioGenerationEnabled:true,runtimeRegistered:true,readOnly:true,revisionPolicy:"SOURCE_GENERATOR_ONLY",
  productionReleased:false,generationSeed:seed,...extra
 };
}
export function isEng010QuestionStudioRequestV1(r:QuestionStudioGenerationRequest){
 if(text(r.packageId).toLowerCase()===ENG010_QUESTION_STUDIO_PACKAGE_ID_V1)return true;
 return Boolean(explicitCp(r));
}
export const languageV1Eng010QuestionStudioAdapterV1:QuestionStudioEngineAdapter={
 engineId:"language-v1",
 listPackages(){return[{
  engineId:"language-v1",packageId:ENG010_QUESTION_STUDIO_PACKAGE_ID_V1,subject:"English",topic:"Para Jumbles",subtopic:"Sentence Ordering",
  label:"ENG-010 Para Jumbles",enabled:true,cpIds:[...ENG010_CP_IDS_V1],supportedLanguages:["en"],supportedDifficulties:["Easy","Medium","Hard"],
  difficultyFilterSupported:true,runtimeMode:"review-only",supportedRuntimeModes:["review-only"],lifecycleId:lifecycle.lifecycleId,lifecycleStage:"REVIEW_ONLY",
  reviewSurfaceRequired:true,manualApprovalRequired:true,questionBankStatus:lifecycle.questionBankStatus,questionBankWritable:false,
  testEligibility:lifecycle.testEligibility,testEligible:false,mockTestEligible:false,publiclyPublishable:false,
  automaticStudentPublication:false,productionReleaseAuthorized:false,
  metadata:{registrationStatus:"REGISTERED_REVIEW_ONLY",authoritySets:96,composerCpId:"ENG-010-CP005",humanApprovalPending:true}
 }];},
 async generate(r):Promise<QuestionStudioGenerationResult>{
  if(!isEng010QuestionStudioRequestV1(r))throw new Error("language-v1 ENG-010 adapter requires ENG-010 package or CP selector");
  if(r.runtimeMode&&r.runtimeMode!=="review-only")throw new Error("ENG-010 only supports review-only runtime");
  const outputLanguage=language(r.language),total=count(r.count),baseSeed=text(r.seed)||"eng010-question-studio-v1",forced=explicitCp(r),questions:Record<string,unknown>[]=[];
  for(let i=0;i<total;i++){
   const seed=`${baseSeed}:${i}`;
   if(forced==="ENG-010-CP005"){
    const composed=generateEng010Cp005SetV1(seed,profile(r));
    questions.push(studioQuestion(composed.question,"ENG-010-CP005",seed,{sourceCpId:composed.cpId,composerProfile:composed.profile}));
   }else{
    const cp=(forced??(["ENG-010-CP001","ENG-010-CP002","ENG-010-CP003","ENG-010-CP004"] as const)[hash(`${seed}:cp`)%4]!) as any;
    const q=generateEng010QuestionV1({seed,cpId:cp,difficulty:difficulty(r)});
    questions.push(studioQuestion(q,cp,seed));
   }
  }
  return{questions,generationContext:{...lifecycle,engineId:"language-v1",packageId:ENG010_QUESTION_STUDIO_PACKAGE_ID_V1,cpSelection:forced??"DETERMINISTIC_ACROSS_CP001..CP004",runtimeMode:"review-only",humanReviewApproved:false,reviewOnly:true,language:outputLanguage,seed:baseSeed,count:total}};
 }
};
