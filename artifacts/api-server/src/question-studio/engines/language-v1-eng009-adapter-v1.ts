import{ENG009_HUMAN_APPROVAL_V1}from"../../english-v1/chapters/cloze-test/ENG-009/eng-009-human-approval-v1";
import{generateEng009Cp001QuestionV1}from"../../english-v1/chapters/cloze-test/ENG-009/CP001/eng-009-cp001-v1";
import{generateEng009Cp002QuestionV1}from"../../english-v1/chapters/cloze-test/ENG-009/CP002/eng-009-cp002-v1";
import{generateEng009Cp003QuestionV1}from"../../english-v1/chapters/cloze-test/ENG-009/CP003/eng-009-cp003-v1";
import{generateEng009Cp004QuestionV1}from"../../english-v1/chapters/cloze-test/ENG-009/CP004/eng-009-cp004-v1";
import{generateEng009Cp005QuestionV1}from"../../english-v1/chapters/cloze-test/ENG-009/CP005/eng-009-cp005-v1";
import{ENG009_CP006_PROFILES,generateEng009Cp006SetV1,type Eng009Cp006Profile}from"../../english-v1/chapters/cloze-test/ENG-009/CP006/eng-009-cp006-composer-v1";
import type{QuestionStudioEngineAdapter,QuestionStudioGenerationRequest,QuestionStudioGenerationResult,QuestionStudioLanguage}from"../engine-types";
import{QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1}from"../standard-lifecycle";

export const ENG009_QUESTION_STUDIO_PACKAGE_ID_V1="english-eng009-cloze-test-v1" as const;
export const ENG009_CP_IDS_V1=["ENG-009-CP001","ENG-009-CP002","ENG-009-CP003","ENG-009-CP004","ENG-009-CP005","ENG-009-CP006"] as const;
type Eng009CpId=typeof ENG009_CP_IDS_V1[number];
const lifecycle=QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const text=(v:unknown)=>typeof v==="string"?v.trim():"";
function hash(v:string){let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function language(v:QuestionStudioGenerationRequest["language"]):QuestionStudioLanguage{if(!v||v==="en")return"en";throw new Error("ENG-009 currently supports English only");}
function explicitCp(r:QuestionStudioGenerationRequest):Eng009CpId|undefined{
 const values=[r.patternId,r.canonicalProblemId,r.questionLanguageId].map(v=>text(v).toUpperCase());
 return values.find((v):v is Eng009CpId=>(ENG009_CP_IDS_V1 as readonly string[]).includes(v));
}
function count(v:number|undefined,max=20){if(v==null)return 5;if(!Number.isInteger(v)||v<1||v>max)throw new Error(`ENG-009 review count must be between 1 and ${max}`);return v;}
function requestedDifficulty(r:QuestionStudioGenerationRequest){const v=text(r.difficulty).toLowerCase();if(!v||v==="mixed")return undefined;if(v==="easy"||v==="medium"||v==="hard")return v;throw new Error("ENG-009 difficulty must be Easy, Medium, Hard, or Mixed");}
function difficultyForCp(cp:Exclude<Eng009CpId,"ENG-009-CP006">,r:QuestionStudioGenerationRequest,seed:string){
 const asked=requestedDifficulty(r);
 const allowed=cp==="ENG-009-CP001"?["easy","medium"] as const:["medium","hard"] as const;
 if(asked&&!allowed.includes(asked as any))throw new Error(`${cp} supports ${allowed.join("/")} difficulty only`);
 return asked??allowed[hash(`${seed}:difficulty`)%allowed.length]!;
}
function generateSingle(cp:Exclude<Eng009CpId,"ENG-009-CP006">,seed:string,difficulty:string){
 const input={seed,difficulty} as any;
 switch(cp){
  case"ENG-009-CP001":return generateEng009Cp001QuestionV1(input);
  case"ENG-009-CP002":return generateEng009Cp002QuestionV1(input);
  case"ENG-009-CP003":return generateEng009Cp003QuestionV1(input);
  case"ENG-009-CP004":return generateEng009Cp004QuestionV1(input);
  case"ENG-009-CP005":return generateEng009Cp005QuestionV1(input);
 }
}
function profileFromRequest(r:QuestionStudioGenerationRequest):Eng009Cp006Profile|undefined{
 const t=`${text(r.topic)} ${text(r.subtopic)} ${text(r.canonicalProblemId)}`.toLowerCase();
 return ENG009_CP006_PROFILES.find(p=>t.includes(p));
}
function studioQuestion(q:any,cp:string,seed:string,extra:Record<string,unknown>={}){
 const difficulty=String(q.metadata?.difficulty??"medium");
 const difficultyLabel=difficulty[0]!.toUpperCase()+difficulty.slice(1);
 return{
  ...lifecycle,id:q.questionId,questionId:q.questionId,packageId:ENG009_QUESTION_STUDIO_PACKAGE_ID_V1,
  patternId:cp,cpId:cp,subject:"English",topic:"Cloze Test",subtopic:cp,language:"en",locale:"en-IN",
  stem:q.stem,passage:q.passage,prompt:q.prompt,
  text:[q.stem,q.passage,q.prompt,...q.options.map((o:string,i:number)=>`${String.fromCharCode(65+i)}. ${o}`)].join("\n"),
  options:[...q.options],correctIndex:q.correctOptionIndex,correct:q.correctOptionIndex,explanation:q.explanation,
  difficulty:difficultyLabel,difficultyLabel,
  registrationStatus:"REGISTERED_REVIEW_ONLY",registrationAuthorityId:ENG009_HUMAN_APPROVAL_V1.authorityId,
  humanReviewApproved:cp!=="ENG-009-CP006",authoringReviewApproved:cp!=="ENG-009-CP006",
  reviewOnly:true,questionStudioDiscoverable:true,questionStudioGenerationEnabled:true,runtimeRegistered:true,readOnly:true,
  revisionPolicy:"SOURCE_GENERATOR_ONLY",productionReleased:false,generationSeed:seed,...extra
 };
}
export function isEng009QuestionStudioRequestV1(r:QuestionStudioGenerationRequest){
 if(text(r.packageId).toLowerCase()===ENG009_QUESTION_STUDIO_PACKAGE_ID_V1)return true;
 return Boolean(explicitCp(r));
}
export const languageV1Eng009QuestionStudioAdapterV1:QuestionStudioEngineAdapter={
 engineId:"language-v1",
 listPackages(){return[{
  engineId:"language-v1",packageId:ENG009_QUESTION_STUDIO_PACKAGE_ID_V1,subject:"English",topic:"Cloze Test",subtopic:"Passage-based Cloze",
  label:"ENG-009 Cloze Test",enabled:true,cpIds:[...ENG009_CP_IDS_V1],supportedLanguages:["en"],
  supportedDifficulties:["Easy","Medium","Hard"],difficultyFilterSupported:true,runtimeMode:"review-only",supportedRuntimeModes:["review-only"],
  lifecycleId:lifecycle.lifecycleId,lifecycleStage:"REVIEW_ONLY",reviewSurfaceRequired:true,manualApprovalRequired:true,
  questionBankStatus:lifecycle.questionBankStatus,questionBankWritable:false,testEligibility:lifecycle.testEligibility,testEligible:false,
  mockTestEligible:false,publiclyPublishable:false,automaticStudentPublication:false,productionReleaseAuthorized:false,
  metadata:{registrationStatus:"REGISTERED_REVIEW_ONLY",registrationAuthorityId:ENG009_HUMAN_APPROVAL_V1.authorityId,
   approvedCpIds:[...ENG009_HUMAN_APPROVAL_V1.approvedCpIds],composerCpId:"ENG-009-CP006",composerApprovalPending:true,
   profiles:[...ENG009_CP006_PROFILES]}
 }];},
 async generate(r):Promise<QuestionStudioGenerationResult>{
  if(!isEng009QuestionStudioRequestV1(r))throw new Error("language-v1 ENG-009 adapter requires ENG-009 package or CP selector");
  if(r.runtimeMode&&r.runtimeMode!=="review-only")throw new Error("ENG-009 only supports review-only runtime");
  const outputLanguage=language(r.language),forced=explicitCp(r),baseSeed=text(r.seed)||"eng009-question-studio-v1";
  if(forced==="ENG-009-CP006"){
   const sets=count(r.count,10),profile=profileFromRequest(r),questions:Record<string,unknown>[]=[];
   for(let i=0;i<sets;i++){
    const setSeed=`${baseSeed}:set:${i}`,set=generateEng009Cp006SetV1(setSeed,profile);
    set.questions.forEach((q:any,j:number)=>questions.push(studioQuestion(q,"ENG-009-CP006",`${setSeed}:q:${j}`,{
      sourceCpId:set.cpId,composerProfile:set.profile,setId:`${set.cpId}:${set.passageId}:${hash(setSeed).toString(16)}`,setQuestionIndex:j+1,setQuestionCount:set.questions.length
    })));
   }
   return{questions,generationContext:{...lifecycle,engineId:"language-v1",packageId:ENG009_QUESTION_STUDIO_PACKAGE_ID_V1,cpSelection:"ENG-009-CP006",profile:profile??"DETERMINISTIC_MIXED",runtimeMode:"review-only",registrationAuthorityId:ENG009_HUMAN_APPROVAL_V1.authorityId,humanReviewApproved:false,reviewOnly:true,language:outputLanguage,seed:baseSeed,setCount:sets}};
  }
  const total=count(r.count),questions:Record<string,unknown>[]=[];
  const approvedCps=ENG009_HUMAN_APPROVAL_V1.approvedCpIds;
  for(let i=0;i<total;i++){
   const seed=`${baseSeed}:${i}`;
   const cp=(forced??approvedCps[hash(`${seed}:cp`)%approvedCps.length]!) as Exclude<Eng009CpId,"ENG-009-CP006">;
   const level=difficultyForCp(cp,r,seed),q=generateSingle(cp,seed,level);
   questions.push(studioQuestion(q,cp,seed));
  }
  return{questions,generationContext:{...lifecycle,engineId:"language-v1",packageId:ENG009_QUESTION_STUDIO_PACKAGE_ID_V1,cpSelection:forced??"DETERMINISTIC_ACROSS_APPROVED_CP001..CP005",runtimeMode:"review-only",registrationAuthorityId:ENG009_HUMAN_APPROVAL_V1.authorityId,humanReviewApproved:true,reviewOnly:true,language:outputLanguage,seed:baseSeed,count:total}};
 }
};
