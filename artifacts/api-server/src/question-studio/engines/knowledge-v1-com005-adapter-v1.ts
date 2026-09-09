import {
  COM005_ENGLISH_FREEZE_AUTHORITY_V1, COM005_ENGLISH_FROZEN, COM005_HINDI_FROZEN,
  COM005_LOCALIZATION_FREEZE_AUTHORITY_V1, COM005_PUNJABI_FROZEN, auditCom005FreezeV1,
  type Com005FrozenQuestion,
} from "../../knowledge-v1/computer-awareness/com005-networking-freeze-v1";
import {
  COM005_GAP_EXTENSION_AUTHORITY_V1,
  COM005_GAP_EXTENSION_ENGLISH,
  COM005_GAP_EXTENSION_HINDI,
  COM005_GAP_EXTENSION_PUNJABI,
  auditCom005GapExtensionV1,
} from "../../knowledge-v1/computer-awareness/com005-networking-gap-extension-v1";
import type { QuestionStudioEngineAdapter, QuestionStudioGenerationRequest, QuestionStudioGenerationResult, QuestionStudioLanguage, QuestionStudioPackageDefinition } from "../engine-types";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const COM005_QUESTION_STUDIO_PACKAGE_ID_V1="COM-005" as const;
export const COM005_QUESTION_STUDIO_RUNTIME_MODE_V1="review-only" as const;
export const COM005_REVISION_POLICY_V1="SOURCE_GENERATOR_ONLY" as const;
export const COM005_CONTENT_AUTHORITY_VERSION_V1="COM-005-ENGLISH-FREEZE-V1_HI-PA-LOCALIZATION-FREEZE-V1" as const;
export const COM005_GAP_CONTENT_AUTHORITY_VERSION_V1="COM-005-GAP-EXTENSION-V1" as const;
const lifecycle=QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;
const supportedLanguages:QuestionStudioLanguage[]=["en","hi","pa"];
const supportedDifficulties=["Easy","Medium"] as const;
const qlIds=[...COM005_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds,...COM005_GAP_EXTENSION_AUTHORITY_V1.permanentQlIds] as readonly string[];
const cpIds=["COM-005-CP-001","COM-005-CP-002"] as const;
const freezeAudit=auditCom005FreezeV1();
if(!freezeAudit.valid) throw new Error("COM-005 freeze invalid: "+freezeAudit.issues.join(", "));
const gapAudit=auditCom005GapExtensionV1();
if(!gapAudit.valid) throw new Error("COM-005 gap extension invalid: "+gapAudit.issues.join(", "));

type Com005CorpusRecord=Com005FrozenQuestion & {cpId:(typeof cpIds)[number]};
function corpusFor(language:QuestionStudioLanguage):readonly Com005FrozenQuestion[] {
  if(language==="en") return [...COM005_ENGLISH_FROZEN,...COM005_GAP_EXTENSION_ENGLISH];
  if(language==="hi") return [...COM005_HINDI_FROZEN,...COM005_GAP_EXTENSION_HINDI];
  return [...COM005_PUNJABI_FROZEN,...COM005_GAP_EXTENSION_PUNJABI];
}
function normalizeLanguage(language:QuestionStudioGenerationRequest["language"]):QuestionStudioLanguage {
  if(!language) return "en";
  if(supportedLanguages.includes(language)) return language;
  throw new Error("COM-005 does not support language "+String(language));
}
function normalizeCount(count:number|undefined) {
  if(count==null) return 5;
  if(!Number.isInteger(count)||count<1||count>50) throw new Error("COM-005 review batches require count between 1 and 50");
  return count;
}
function normalizeDifficulty(difficulty:QuestionStudioGenerationRequest["difficulty"]) {
  if(!difficulty||difficulty==="Mixed") return "Mixed" as const;
  if(difficulty==="Easy"||difficulty==="Medium") return difficulty;
  if(difficulty==="Hard") throw new Error("COM-005 Hard difficulty is not authorized");
  throw new Error("COM-005 difficulty must be Easy, Medium or Mixed");
}
function selectorValues(request:QuestionStudioGenerationRequest) {
  return [request.patternId,request.canonicalProblemId,request.questionLanguageId].map((value)=>String(value??"").trim().toUpperCase()).filter(Boolean);
}
function normalizeQlSelector(request:QuestionStudioGenerationRequest):string|undefined {
  const selectors=selectorValues(request).filter((value)=>qlIds.includes(value));
  if(new Set(selectors).size>1) throw new Error("Conflicting COM-005 QL selectors "+selectors.join(", "));
  return selectors[0];
}
function hash(seed:string):number {
  let value=2166136261;
  for(let i=0;i<seed.length;i++){value^=seed.charCodeAt(i);value=Math.imul(value,16777619);}
  return value>>>0;
}
function shuffled<T>(items:readonly T[],seed:string):T[] {
  const result=[...items]; let state=hash(seed)||1;
  for(let i=result.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=state%(i+1);[result[i],result[j]]=[result[j]!,result[i]!];}
  return result;
}
function toRecord(question:Com005FrozenQuestion):Com005CorpusRecord {
  return {...question,cpId:question.sourceQuestionId.startsWith("COM005-EXT-")?cpIds[1]:cpIds[0]};
}
function isGapRecord(record:Com005CorpusRecord) { return record.cpId===cpIds[1]; }
function recordForOutput(record:Com005CorpusRecord) {
  return {
    ...lifecycle, questionBankAcceptanceAuthority:lifecycle.questionBankAcceptanceAuthority,
    id:record.questionId, questionId:record.questionId, sourceQuestionId:record.sourceQuestionId,
    packageId:COM005_QUESTION_STUDIO_PACKAGE_ID_V1, patternId:record.qlId, qlId:record.qlId, cpId:record.cpId,
    subject:"Computer Awareness", topic:"Computer Awareness", subtopic:"Computer Networking",
    language:record.language, locale:record.locale, stem:record.stem, text:record.stem, options:[...record.options],
    correctIndex:record.correctIndex, correct:record.correctIndex, answer:record.canonicalAnswer, canonicalAnswer:record.canonicalAnswer,
    explanation:record.explanation, sourceFactIds:[...record.sourceFactIds], sourceEnglishFrozen:record.sourceEnglishFrozen,
    sourceEnglishAuthorityId:record.sourceEnglishAuthorityId, sourceLocalizationFrozen:record.sourceLocalizationFrozen,
    difficulty:record.difficulty==="EASY"?"Easy":"Medium", difficultyLabel:record.difficulty==="EASY"?"Easy":"Medium",
    registrationStatus:"REGISTERED_BANK_ONLY_INTERNAL", registrationAuthorityId:isGapRecord(record)?COM005_GAP_EXTENSION_AUTHORITY_V1.authorityId:COM005_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
    questionStudioDiscoverable:true, questionStudioGenerationEnabled:true, readOnly:true, revisionPolicy:COM005_REVISION_POLICY_V1,
    productionReleased:false,
    questionStudioReview:{...lifecycle,registrationStatus:"REGISTERED_BANK_ONLY_INTERNAL",registrationAuthorityId:isGapRecord(record)?COM005_GAP_EXTENSION_AUTHORITY_V1.authorityId:COM005_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      runtimeMode:COM005_QUESTION_STUDIO_RUNTIME_MODE_V1,contentAuthorityVersion:isGapRecord(record)?COM005_GAP_CONTENT_AUTHORITY_VERSION_V1:COM005_CONTENT_AUTHORITY_VERSION_V1,humanReviewApproved:true,
      frozenCorpusOnly:true,immutableCorpus:true,deterministicSelection:true,selectionWithoutReplacement:true,
      sourceEnglishAuthorityId:isGapRecord(record)?COM005_GAP_EXTENSION_AUTHORITY_V1.authorityId:COM005_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,localizationFreezeAuthorityId:isGapRecord(record)?COM005_GAP_EXTENSION_AUTHORITY_V1.authorityId:COM005_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      revisionPolicy:COM005_REVISION_POLICY_V1,hardDifficultyAuthorized:false,productionDifficultyClaimAuthorized:false},
  };
}
export const COM005_STANDARD_BANK_ONLY_PACKAGE_V1:QuestionStudioPackageDefinition={
  engineId:"knowledge-v1",packageId:COM005_QUESTION_STUDIO_PACKAGE_ID_V1,subject:"Computer Awareness",topic:"Computer Awareness",
  subtopic:"Computer Networking",
  label:"Computer Awareness · Computer Networking · Freeze V1 + Gap Extension V1",
  enabled:true,cpIds:[...cpIds],supportedLanguages,supportedDifficulties:[...supportedDifficulties],difficultyFilterSupported:true,
  runtimeMode:COM005_QUESTION_STUDIO_RUNTIME_MODE_V1,supportedRuntimeModes:[COM005_QUESTION_STUDIO_RUNTIME_MODE_V1],
  lifecycleId:lifecycle.lifecycleId,lifecycleStage:lifecycle.stage,reviewSurfaceRequired:lifecycle.reviewSurfaceRequired,
  manualApprovalRequired:lifecycle.manualApprovalRequired,questionBankStatus:lifecycle.questionBankStatus,questionBankWritable:lifecycle.questionBankWritable,
  questionBankAcceptanceMode:lifecycle.questionBankAcceptanceMode,questionBankAcceptanceAuthority:lifecycle.questionBankAcceptanceAuthority,
  testEligibility:lifecycle.testEligibility,testEligible:lifecycle.testEligible,mockTestEligible:lifecycle.mockTestEligible,
  publiclyPublishable:lifecycle.publiclyPublishable,automaticStudentPublication:lifecycle.automaticStudentPublication,
  productionReleaseAuthorized:lifecycle.productionReleaseAuthorized,
  metadata:{...lifecycle,reviewOnly:false,humanReviewApproved:true,frozenCorpusOnly:true,immutableCorpus:true,deterministicSelection:true,
    selectionWithoutReplacement:true,registrationAuthorityId:COM005_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
    contentAuthorityVersion:COM005_CONTENT_AUTHORITY_VERSION_V1,permanentQlIds:[...qlIds],qlCount:qlIds.length,cpIds:[...cpIds],cpCount:cpIds.length,
    englishQuestionCount:COM005_ENGLISH_FROZEN.length+COM005_GAP_EXTENSION_ENGLISH.length,hindiQuestionCount:COM005_HINDI_FROZEN.length+COM005_GAP_EXTENSION_HINDI.length,punjabiQuestionCount:COM005_PUNJABI_FROZEN.length+COM005_GAP_EXTENSION_PUNJABI.length,
    englishFreezeAuthorityId:COM005_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,localizationFreezeAuthorityId:COM005_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
    localizationCombinedFingerprint:COM005_LOCALIZATION_FREEZE_AUTHORITY_V1.combinedFingerprint,gapExtensionAuthorityId:COM005_GAP_EXTENSION_AUTHORITY_V1.authorityId,
    gapExtensionQuestionCountPerLanguage:COM005_GAP_EXTENSION_ENGLISH.length,revisionPolicy:COM005_REVISION_POLICY_V1,
    difficultyFilterSupported:true,supportedDifficulties:[...supportedDifficulties],hardDifficultyAuthorized:false,productionDifficultyClaimsAuthorized:false},
};
export function isCom005QuestionStudioRequestV1(request:QuestionStudioGenerationRequest) {
  const packageId=String(request.packageId??"").trim().toUpperCase();
  if(packageId) return packageId===COM005_QUESTION_STUDIO_PACKAGE_ID_V1;
  const selectors=[request.patternId,request.canonicalProblemId,request.questionLanguageId].map((value)=>String(value??"").trim().toUpperCase());
  const subject=String(request.subject??"").trim().toLowerCase(), topic=String(request.topic??"").trim().toLowerCase(), subtopic=String(request.subtopic??"").trim().toLowerCase();
  return selectors.some((value)=>value.startsWith("COM-005")) || (subject==="computer awareness"&&subtopic==="computer networking") || topic==="computer networking";
}
export const knowledgeV1Com005QuestionStudioAdapterV1:QuestionStudioEngineAdapter={
  engineId:"knowledge-v1",
  listPackages(){return [COM005_STANDARD_BANK_ONLY_PACKAGE_V1];},
  async generate(request:QuestionStudioGenerationRequest):Promise<QuestionStudioGenerationResult>{
    const packageId=String(request.packageId??"").trim().toUpperCase();
    if(packageId&&packageId!==COM005_QUESTION_STUDIO_PACKAGE_ID_V1) throw new Error("knowledge-v1 COM-005 adapter cannot generate package "+request.packageId);
    if(request.runtimeMode&&request.runtimeMode!==COM005_QUESTION_STUDIO_RUNTIME_MODE_V1) throw new Error("COM-005 only supports "+COM005_QUESTION_STUDIO_RUNTIME_MODE_V1+" runtime");
    const language=normalizeLanguage(request.language),count=normalizeCount(request.count),requestedDifficulty=normalizeDifficulty(request.difficulty),qlId=normalizeQlSelector(request);
    const seed=request.seed?.trim()||"com005-question-studio-networking-v1";
    const candidates=corpusFor(language).map(toRecord).filter((record)=>(!qlId||record.qlId===qlId)&&(requestedDifficulty==="Mixed"||(requestedDifficulty==="Easy"&&record.difficulty==="EASY")||(requestedDifficulty==="Medium"&&record.difficulty==="MEDIUM")));
    if(!candidates.length) throw new Error("COM-005 selectors produced no "+requestedDifficulty+" frozen questions");
    if(count>candidates.length) throw new Error("COM-005 cannot fill "+count+" questions from a "+candidates.length+"-question frozen pool without repeats");
    const selected=shuffled(candidates,seed+":COM-005:"+(qlId??"ALL")+":"+requestedDifficulty).slice(0,count);
    return {questions:selected.map(recordForOutput),generationContext:{...lifecycle,engineId:"knowledge-v1",packageId:COM005_QUESTION_STUDIO_PACKAGE_ID_V1,
      runtimeMode:COM005_QUESTION_STUDIO_RUNTIME_MODE_V1,registrationStatus:"REGISTERED_BANK_ONLY_INTERNAL",registrationAuthorityId:qlId&&COM005_GAP_EXTENSION_AUTHORITY_V1.permanentQlIds.includes(qlId)?COM005_GAP_EXTENSION_AUTHORITY_V1.authorityId:COM005_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      reviewOnly:false,humanReviewApproved:true,frozenCorpusOnly:true,immutableCorpus:true,deterministicSelection:true,selectionWithoutReplacement:true,
      contentAuthorityVersion:qlId&&COM005_GAP_EXTENSION_AUTHORITY_V1.permanentQlIds.includes(qlId)?COM005_GAP_CONTENT_AUTHORITY_VERSION_V1:COM005_CONTENT_AUTHORITY_VERSION_V1,revisionPolicy:COM005_REVISION_POLICY_V1,language,locale:`${language}-IN`,
      requestedDifficulty,difficultyFilterApplied:requestedDifficulty!=="Mixed",productionDifficultyClaimAuthorized:false,hardDifficultyAuthorized:false,
      qlSelection:qlId??"DETERMINISTIC_ACROSS_PERMANENT_QLS",permanentQlIds:[...qlIds],cpIds:[...cpIds],candidatePoolSize:candidates.length,
      selectionMode:"FROZEN_COM005_DETERMINISTIC_WITHOUT_REPLACEMENT",seed,count,englishFreezeAuthorityId:COM005_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      gapExtensionAuthorityId:COM005_GAP_EXTENSION_AUTHORITY_V1.authorityId,
      localizationFreezeAuthorityId:COM005_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,localizationCombinedFingerprint:COM005_LOCALIZATION_FREEZE_AUTHORITY_V1.combinedFingerprint}};
  },
};
