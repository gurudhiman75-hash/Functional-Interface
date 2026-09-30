import assert from "node:assert/strict";
import { auditIndianGeoLocalizationV1, localizeIndianGeoQuestionV1 } from "./indian-geo-localization-v1";
import { GEO_TRN_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-trn-001-adapter-v1";
const COMMON=/\b(?:which|what|why|where|when|how|the|and|or|is|are|was|were|does|do|did|can|could|would|should|has|have|had|with|from|into|for|of|to|in|on|at|by|as|than|that|this|these|those|most|main|major|only|correct|statement|following)\b/gi;
for(const cpId of ["GEO-TRN-001-CP001","GEO-TRN-001-CP002","GEO-TRN-001-CP003","GEO-TRN-001-CP004","GEO-TRN-001-CP005"]){
 const cp=GEO_TRN_001_QUESTION_STUDIO_CORPUS_V1.filter(q=>q.cpId===cpId);
 const audit=auditIndianGeoLocalizationV1(cp,"GEO-TRN-001");
 console.log(JSON.stringify({cpId,...audit},null,2));
 assert.equal(audit.structuralValid,true);
 assert.equal(audit.hindiStemResidueCount,0);
 assert.equal(audit.punjabiStemResidueCount,0);
 assert.equal(audit.genericExplanationFallbackCount,0);
 assert.equal(audit.mixedScriptCount,0);
}
const full=auditIndianGeoLocalizationV1(GEO_TRN_001_QUESTION_STUDIO_CORPUS_V1,"GEO-TRN-001");
console.log(JSON.stringify({packageId:"GEO-TRN-001-REVIEWED",...full},null,2));
for(const language of ["hi","pa"] as const){
 const seen=new Set<string>();
 for(const q of GEO_TRN_001_QUESTION_STUDIO_CORPUS_V1){
  const localized=localizeIndianGeoQuestionV1(q,language,"GEO-TRN-001");
  for(const option of localized.options)if((option.match(COMMON)||[]).length)seen.add(option);
 }
 console.log(JSON.stringify({language,residualOptionCount:seen.size,residualOptions:[...seen]},null,2));
}
