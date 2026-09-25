import { ENG003_CP013_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/grammar-fillers/ENG-003/CP013/eng-003-cp013-human-approval-v1";
import { generateEng003Cp013QuestionV1 } from "../../english-v1/chapters/grammar-fillers/ENG-003/CP013/eng-003-cp013-v1";
import type { EnglishDifficulty } from "../../english-v1/core/types";
import type { IdiomaticUsageRuleId } from "../../english-v1/grammar/idiomatic-usage";
import type { QuestionStudioEngineAdapter, QuestionStudioGenerationRequest, QuestionStudioGenerationResult, QuestionStudioLanguage } from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { ENG003_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng003-cp001-adapter-v1";

export const ENG003_QUESTION_STUDIO_CP013_ID_V1 = "ENG-003-CP013" as const;
const lifecycle=QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const ruleIds:IdiomaticUsageRuleId[]=["GR-USG-001","GR-USG-002","GR-USG-003","GR-USG-004","GR-USG-005","GR-USG-006","GR-USG-007","GR-USG-008","GR-USG-009"];
const text=(v:unknown)=>typeof v==="string"?v.trim():"";
const cap=(v:EnglishDifficulty)=>`${v[0].toUpperCase()}${v.slice(1)}` as "Easy"|"Medium"|"Hard";
function lang(v:QuestionStudioGenerationRequest["language"]):QuestionStudioLanguage{if(!v||v==="en")return"en";throw new Error("ENG-003 CP013 currently supports English only");}
function count(v:number|undefined){if(v==null)return 5;if(!Number.isInteger(v)||v<1||v>20)throw new Error("ENG-003 CP013 review batches require count between 1 and 20");return v;}
function diff(v:QuestionStudioGenerationRequest["difficulty"]):EnglishDifficulty{const d=text(v).toLowerCase();if(d==="easy"||d==="medium"||d==="hard")return d;if(!d||d==="mixed")return"medium";throw new Error("ENG-003 CP013 difficulty must be Easy, Medium, or Hard");}
function rule(request:QuestionStudioGenerationRequest):IdiomaticUsageRuleId|undefined{
  const xs=[request.patternId,request.canonicalProblemId,request.questionLanguageId].map(v=>text(v).toUpperCase()).filter(Boolean);
  const allowed=new Set<string>([ENG003_QUESTION_STUDIO_PACKAGE_ID_V1.toUpperCase(),ENG003_QUESTION_STUDIO_CP013_ID_V1,...ruleIds]);
  const bad=xs.filter(x=>!allowed.has(x));if(bad.length)throw new Error(`Unknown ENG-003 CP013 selector ${bad[0]}`);
  const rs=xs.filter((x):x is IdiomaticUsageRuleId=>ruleIds.includes(x as IdiomaticUsageRuleId));
  if(new Set(rs).size>1)throw new Error("Conflicting ENG-003 CP013 rule selectors");
  return rs[0];
}
export function isEng003Cp013QuestionStudioRequestV1(request:QuestionStudioGenerationRequest){
  const xs=[request.patternId,request.canonicalProblemId,request.questionLanguageId].map(v=>text(v).toUpperCase());
  if(xs.includes(ENG003_QUESTION_STUDIO_CP013_ID_V1))return true;
  const topic=`${text(request.topic)} ${text(request.subtopic)}`.toLowerCase();
  return text(request.packageId).toLowerCase()===ENG003_QUESTION_STUDIO_PACKAGE_ID_V1&&(/usage|idiomatic|common usage/.test(topic)||xs.some(x=>x.startsWith("GR-USG-")));
}
export const languageV1Eng003Cp013QuestionStudioAdapterV1:QuestionStudioEngineAdapter={
  engineId:"language-v1",
  listPackages(){return[];},
  async generate(request):Promise<QuestionStudioGenerationResult>{
    if(!isEng003Cp013QuestionStudioRequestV1(request))throw new Error("language-v1 ENG-003 CP013 adapter requires an explicit ENG-003 CP013 selector");
    if(request.runtimeMode&&request.runtimeMode!=="review-only")throw new Error("ENG-003 CP013 only supports review-only runtime");
    const language=lang(request.language),n=count(request.count),difficulty=diff(request.difficulty),ruleId=rule(request),baseSeed=request.seed?.trim()||"eng003-cp013-question-studio-approved-v1";
    const questions:Record<string,unknown>[]=[];
    for(let i=0;i<n;i++){
      const generationSeed=`${baseSeed}:${i}`;
      const q=generateEng003Cp013QuestionV1({seed:generationSeed,difficulty,ruleId});
      const dl=cap(q.metadata.difficulty);
      questions.push({...lifecycle,id:q.questionId,questionId:q.questionId,packageId:ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,patternId:q.metadata.ruleId,cpId:ENG003_QUESTION_STUDIO_CP013_ID_V1,ruleId:q.metadata.ruleId,mutationId:q.metadata.mutationId,subject:"English",topic:"Fill in the Blanks / Grammar Fillers",subtopic:"Common Usage / Idiomatic Grammar",language,locale:"en-IN",stem:q.stem,sentence:q.sentence,text:[q.stem,q.sentence,...q.options.map((o,j)=>`${String.fromCharCode(65+j)}. ${o}`)].join("\n"),blankIndex:q.blankIndex,options:[...q.options],correctIndex:q.correctOptionIndex,correct:q.correctOptionIndex,correctedSentence:q.correctedSentence,explanation:q.explanation,difficulty:dl,difficultyLabel:dl,dimensions:q.metadata.dimensions,semanticDomain:q.metadata.semanticDomain,sceneId:q.metadata.sceneId,generationSeed,registrationStatus:"REGISTERED_REVIEW_ONLY",registrationAuthorityId:ENG003_CP013_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,humanReviewApproved:true,authoringReviewApproved:true,reviewOnly:true,questionStudioDiscoverable:true,questionStudioGenerationEnabled:true,runtimeRegistered:true,readOnly:true,revisionPolicy:"SOURCE_GENERATOR_ONLY",productionReleased:false});
    }
    return{questions,generationContext:{...lifecycle,engineId:"language-v1",packageId:ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,cpId:ENG003_QUESTION_STUDIO_CP013_ID_V1,runtimeMode:"review-only",registrationStatus:"REGISTERED_REVIEW_ONLY",registrationAuthorityId:ENG003_CP013_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,approvedReviewBlobSha:ENG003_CP013_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha,approvedGeneratorHeadSha:ENG003_CP013_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha,humanReviewApproved:true,reviewOnly:true,revisionPolicy:"SOURCE_GENERATOR_ONLY",language,requestedDifficulty:cap(difficulty),ruleSelection:ruleId??"DETERMINISTIC_ACROSS_ENG-003-CP013_APPROVED_RULES",grammarRuleIds:[...ruleIds],seed:baseSeed,count:n}};
  }
};
