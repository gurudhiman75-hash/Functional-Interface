import { ENG004_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/synonyms-antonyms/ENG-004/eng-004-human-approval-v1";
import { generateEng004Cp001QuestionV2 } from "../../english-v1/chapters/synonyms-antonyms/ENG-004/CP001/eng-004-cp001-v1";
import { generateEng004Cp002QuestionV1 } from "../../english-v1/chapters/synonyms-antonyms/ENG-004/CP002/eng-004-cp002-v1";
import { generateEng004Cp003QuestionV1 } from "../../english-v1/chapters/synonyms-antonyms/ENG-004/CP003/eng-004-cp003-v1";
import { generateEng004Cp004QuestionV1 } from "../../english-v1/chapters/synonyms-antonyms/ENG-004/CP004/eng-004-cp004-v1";
import { generateEng004Cp005QuestionV1 } from "../../english-v1/chapters/synonyms-antonyms/ENG-004/CP005/eng-004-cp005-v1";
import type { QuestionStudioEngineAdapter, QuestionStudioGenerationRequest, QuestionStudioGenerationResult, QuestionStudioLanguage } from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const ENG004_QUESTION_STUDIO_PACKAGE_ID_V1 = "english-eng004-synonyms-antonyms-v1" as const;
export const ENG004_CP_IDS_V1 = ["ENG-004-CP001","ENG-004-CP002","ENG-004-CP003","ENG-004-CP004","ENG-004-CP005"] as const;
type Eng004CpId = typeof ENG004_CP_IDS_V1[number];
type Difficulty = "easy"|"medium"|"hard";
type Relation = "synonym"|"antonym";
const lifecycle=QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const text=(v:unknown)=>typeof v==="string"?v.trim():"";
function hash(v:string){let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function lang(v:QuestionStudioGenerationRequest["language"]):QuestionStudioLanguage{if(!v||v==="en")return"en";throw new Error("ENG-004 currently supports English only");}
function count(v:number|undefined){if(v==null)return 5;if(!Number.isInteger(v)||v<1||v>20)throw new Error("ENG-004 review batches require count between 1 and 20");return v;}
function explicitCp(request:QuestionStudioGenerationRequest):Eng004CpId|undefined{
  const values=[request.patternId,request.canonicalProblemId,request.questionLanguageId].map(v=>text(v).toUpperCase());
  return values.find((v):v is Eng004CpId=>(ENG004_CP_IDS_V1 as readonly string[]).includes(v));
}
function relation(request:QuestionStudioGenerationRequest):Relation|undefined{
  const values=[request.patternId,request.canonicalProblemId,request.questionLanguageId,request.topic,request.subtopic].map(v=>text(v).toLowerCase());
  const syn=values.some(v=>v==="synonym"||/\bsynonym/.test(v)),ant=values.some(v=>v==="antonym"||/\bantonym/.test(v));
  if(syn&&ant)throw new Error("ENG-004 request cannot select both synonym and antonym");
  return syn?"synonym":ant?"antonym":undefined;
}
function diff(request:QuestionStudioGenerationRequest,seed:string):Difficulty{
  const d=text(request.difficulty).toLowerCase();
  if(d==="easy"||d==="medium"||d==="hard")return d;
  if(!d||d==="mixed")return(["easy","medium","hard"] as const)[hash(seed)%3]!;
  throw new Error("ENG-004 difficulty must be Easy, Medium, Hard, or Mixed");
}
function generate(cp:Eng004CpId,seed:string,difficulty:Difficulty,relationType?:Relation){
  const input={seed,difficulty,relationType} as any;
  switch(cp){
    case"ENG-004-CP001":return generateEng004Cp001QuestionV2(input);
    case"ENG-004-CP002":return generateEng004Cp002QuestionV1(input);
    case"ENG-004-CP003":return generateEng004Cp003QuestionV1(input);
    case"ENG-004-CP004":return generateEng004Cp004QuestionV1(input);
    case"ENG-004-CP005":return generateEng004Cp005QuestionV1(input);
  }
}
export function isEng004QuestionStudioRequestV1(request:QuestionStudioGenerationRequest){
  if(text(request.packageId).toLowerCase()===ENG004_QUESTION_STUDIO_PACKAGE_ID_V1)return true;
  return Boolean(explicitCp(request));
}
export const languageV1Eng004QuestionStudioAdapterV1:QuestionStudioEngineAdapter={
  engineId:"language-v1",
  listPackages(){
    return [{
      engineId:"language-v1",packageId:ENG004_QUESTION_STUDIO_PACKAGE_ID_V1,subject:"English",
      topic:"Synonyms & Antonyms",subtopic:"Vocabulary",label:"ENG-004 Synonyms & Antonyms",
      enabled:true,cpIds:[...ENG004_CP_IDS_V1],supportedLanguages:["en"],supportedDifficulties:["Easy","Medium","Hard"],
      difficultyFilterSupported:true,runtimeMode:"review-only",supportedRuntimeModes:["review-only"],
      lifecycleId:lifecycle.lifecycleId,lifecycleStage:"REVIEW_ONLY",reviewSurfaceRequired:true,manualApprovalRequired:true,
      questionBankStatus:lifecycle.questionBankStatus,questionBankWritable:false,testEligibility:lifecycle.testEligibility,
      testEligible:false,mockTestEligible:false,publiclyPublishable:false,automaticStudentPublication:false,productionReleaseAuthorized:false,
      metadata:{registrationStatus:"REGISTERED_REVIEW_ONLY",registrationAuthorityId:ENG004_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        uniqueHeadwords:ENG004_HUMAN_EDITORIAL_APPROVAL_V1.uniqueHeadwords,headwordSenses:ENG004_HUMAN_EDITORIAL_APPROVAL_V1.headwordSenses,
        synonymLinks:ENG004_HUMAN_EDITORIAL_APPROVAL_V1.synonymLinks,antonymLinks:ENG004_HUMAN_EDITORIAL_APPROVAL_V1.antonymLinks}
    }];
  },
  async generate(request):Promise<QuestionStudioGenerationResult>{
    if(!isEng004QuestionStudioRequestV1(request))throw new Error("language-v1 ENG-004 adapter requires ENG-004 package or CP selector");
    if(request.runtimeMode&&request.runtimeMode!=="review-only")throw new Error("ENG-004 only supports review-only runtime");
    const language=lang(request.language),n=count(request.count),baseSeed=text(request.seed)||"eng004-question-studio-approved-v1",forcedCp=explicitCp(request),relationType=relation(request);
    const questions:Record<string,unknown>[]=[];
    for(let i=0;i<n;i++){
      const generationSeed=`${baseSeed}:${i}`;
      const cp=forcedCp??ENG004_CP_IDS_V1[hash(`${generationSeed}:cp`)%ENG004_CP_IDS_V1.length]!;
      const difficulty=diff(request,`${generationSeed}:difficulty`);
      const q:any=generate(cp,generationSeed,difficulty,relationType);
      const difficultyLabel=`${difficulty[0]!.toUpperCase()}${difficulty.slice(1)}`;
      const context=text(q.context);
      questions.push({...lifecycle,id:q.questionId,questionId:q.questionId,packageId:ENG004_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId:q.metadata.relationType,cpId:cp,subject:"English",topic:"Synonyms & Antonyms",subtopic:cp,language,locale:"en-IN",
        stem:q.stem,context:context||undefined,text:[q.stem,context,...q.options.map((o:string,j:number)=>`${String.fromCharCode(65+j)}. ${o}`)].filter(Boolean).join("\n"),
        options:[...q.options],correctIndex:q.correctOptionIndex,correct:q.correctOptionIndex,explanation:q.explanation,
        difficulty:difficultyLabel,difficultyLabel,word:q.metadata.word,relationType:q.metadata.relationType,entryId:q.metadata.entryId,
        registrationStatus:"REGISTERED_REVIEW_ONLY",registrationAuthorityId:ENG004_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        humanReviewApproved:true,authoringReviewApproved:true,reviewOnly:true,questionStudioDiscoverable:true,questionStudioGenerationEnabled:true,
        runtimeRegistered:true,readOnly:true,revisionPolicy:"SOURCE_GENERATOR_ONLY",productionReleased:false,generationSeed});
    }
    return{questions,generationContext:{...lifecycle,engineId:"language-v1",packageId:ENG004_QUESTION_STUDIO_PACKAGE_ID_V1,
      cpSelection:forcedCp??"DETERMINISTIC_ACROSS_ENG-004-CP001..CP005",relationSelection:relationType??"DETERMINISTIC_PER_ENTRY",
      runtimeMode:"review-only",registrationStatus:"REGISTERED_REVIEW_ONLY",registrationAuthorityId:ENG004_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
      approvedReviewArtifactId:ENG004_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewArtifactId,approvedReviewArtifactDigest:ENG004_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewArtifactDigest,
      approvedGeneratorHeadSha:ENG004_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha,humanReviewApproved:true,reviewOnly:true,language,seed:baseSeed,count:n}};
  }
};
