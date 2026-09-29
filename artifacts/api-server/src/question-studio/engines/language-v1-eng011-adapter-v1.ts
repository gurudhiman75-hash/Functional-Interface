import{ENG011_CP_IDS_V1}from"../../english-v1/chapters/sentence-rearrangement/ENG-011/eng-011-authorities-v1";
import{generateEng011Cp005SetV1,generateEng011QuestionV1}from"../../english-v1/chapters/sentence-rearrangement/ENG-011/eng-011-v1";
import type{QuestionStudioEngineAdapter,QuestionStudioGenerationRequest,QuestionStudioGenerationResult,QuestionStudioLanguage}from"../engine-types";
import{QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1}from"../standard-lifecycle";

export const ENG011_QUESTION_STUDIO_PACKAGE_ID_V1="english-eng011-sentence-rearrangement-v1" as const;
type Eng011CpId=typeof ENG011_CP_IDS_V1[number];
const lifecycle=QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const text=(v:unknown)=>typeof v==="string"?v.trim():"";
function hash(v:string){let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function language(v:QuestionStudioGenerationRequest["language"]):QuestionStudioLanguage{if(!v||v==="en")return"en";throw new Error("ENG-011 currently supports English only");}
function count(v:number|undefined){if(v==null)return 5;if(!Number.isInteger(v)||v<1||v>20)throw new Error("ENG-011 review count must be between 1 and 20");return v;}
function explicitCp(r:QuestionStudioGenerationRequest):Eng011CpId|undefined{const vals=[r.patternId,r.canonicalProblemId,r.questionLanguageId].map(v=>text(v).toUpperCase());return vals.find((v):v is Eng011CpId=>(ENG011_CP_IDS_V1 as readonly string[]).includes(v));}
function profile(r:QuestionStudioGenerationRequest){const t=`${text(r.topic)} ${text(r.subtopic)} ${text(r.canonicalProblemId)}`.toLowerCase();if(t.includes("ssc-standard"))return"ssc-standard"as const;if(t.includes("ssc-advanced"))return"ssc-advanced"as const;if(t.includes("banking-prelims"))return"banking-prelims"as const;if(t.includes("banking-mains"))return"banking-mains"as const;}
function difficulty(r:QuestionStudioGenerationRequest){const v=text(r.difficulty).toLowerCase();if(!v||v==="mixed")return undefined;if(v==="easy"||v==="medium"||v==="hard")return v as"easy"|"medium"|"hard";throw new Error("ENG-011 difficulty must be Easy, Medium, Hard, or Mixed");}
function studioQuestion(q:any,cp:string,seed:string,extra:Record<string,unknown>={}){
 const d=String(q.metadata.difficulty),difficultyLabel=d[0]!.toUpperCase()+d.slice(1);
 const fragText=q.fragments.map((s:any)=>`${s.label}. ${s.text}`).join("\n");
 return{...lifecycle,id:q.questionId,questionId:q.questionId,packageId:ENG011_QUESTION_STUDIO_PACKAGE_ID_V1,patternId:cp,cpId:cp,subject:"English",topic:"Sentence Rearrangement",subtopic:cp,language:"en",locale:"en-IN",
 stem:q.stem,fragments:q.fragments,prompt:q.prompt,text:[q.stem,fragText,q.prompt,...q.options.map((o:string,i:number)=>`${String.fromCharCode(65+i)}. ${o}`)].join("\n"),
 options:[...q.options],correctIndex:q.correctOptionIndex,correct:q.correctOptionIndex,explanation:q.explanation,explanationEmphasis:q.explanationEmphasis,difficulty:difficultyLabel,difficultyLabel,setId:q.metadata.setId,correctOrder:q.metadata.correctOrder,
 registrationStatus:"REGISTERED_REVIEW_ONLY",registrationAuthorityId:"ENG-011-IMPLEMENTATION-V1",humanReviewApproved:false,authoringReviewApproved:false,reviewOnly:true,questionStudioDiscoverable:true,questionStudioGenerationEnabled:true,runtimeRegistered:true,readOnly:true,revisionPolicy:"SOURCE_GENERATOR_ONLY",productionReleased:false,generationSeed:seed,...extra};
}
export function isEng011QuestionStudioRequestV1(r:QuestionStudioGenerationRequest){if(text(r.packageId).toLowerCase()===ENG011_QUESTION_STUDIO_PACKAGE_ID_V1)return true;return Boolean(explicitCp(r));}
export const languageV1Eng011QuestionStudioAdapterV1:QuestionStudioEngineAdapter={
 engineId:"language-v1",
 listPackages(){return[{engineId:"language-v1",packageId:ENG011_QUESTION_STUDIO_PACKAGE_ID_V1,subject:"English",topic:"Sentence Rearrangement",subtopic:"Fragment Ordering",label:"ENG-011 Sentence Rearrangement",enabled:true,cpIds:[...ENG011_CP_IDS_V1],supportedLanguages:["en"],supportedDifficulties:["Easy","Medium","Hard"],difficultyFilterSupported:true,runtimeMode:"review-only",supportedRuntimeModes:["review-only"],lifecycleId:lifecycle.lifecycleId,lifecycleStage:"REVIEW_ONLY",reviewSurfaceRequired:true,manualApprovalRequired:true,questionBankStatus:lifecycle.questionBankStatus,questionBankWritable:false,testEligibility:lifecycle.testEligibility,testEligible:false,mockTestEligible:false,publiclyPublishable:false,automaticStudentPublication:false,productionReleaseAuthorized:false,metadata:{registrationStatus:"REGISTERED_REVIEW_ONLY",authoritySets:96,composerCpId:"ENG-011-CP005",humanApprovalPending:true}}];},
 async generate(r):Promise<QuestionStudioGenerationResult>{
  if(!isEng011QuestionStudioRequestV1(r))throw new Error("language-v1 ENG-011 adapter requires ENG-011 package or CP selector");
  if(r.runtimeMode&&r.runtimeMode!=="review-only")throw new Error("ENG-011 only supports review-only runtime");
  const outputLanguage=language(r.language),total=count(r.count),baseSeed=text(r.seed)||"eng011-question-studio-v1",forced=explicitCp(r),questions:Record<string,unknown>[]=[];
  for(let i=0;i<total;i++){const seed=`${baseSeed}:${i}`;if(forced==="ENG-011-CP005"){const composed=generateEng011Cp005SetV1(seed,profile(r));questions.push(studioQuestion(composed.question,"ENG-011-CP005",seed,{sourceCpId:composed.sourceCpId,composerProfile:composed.profile}));}else{const cp=(forced??(["ENG-011-CP001","ENG-011-CP002","ENG-011-CP003","ENG-011-CP004"]as const)[hash(`${seed}:cp`)%4]!)as any;const q=generateEng011QuestionV1({seed,cpId:cp,difficulty:difficulty(r)});questions.push(studioQuestion(q,cp,seed));}}
  return{questions,generationContext:{...lifecycle,engineId:"language-v1",packageId:ENG011_QUESTION_STUDIO_PACKAGE_ID_V1,cpSelection:forced??"DETERMINISTIC_ACROSS_CP001..CP004",runtimeMode:"review-only",humanReviewApproved:false,reviewOnly:true,language:outputLanguage,seed:baseSeed,count:total}};
 }
};
