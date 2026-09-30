import { localizeIndianGeoQuestionV1 } from "./indian-geo-localization-v1";
import { GEO_TRN_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-trn-001-adapter-v1";
const COMMON=/\b(?:which|what|why|where|when|how|the|and|or|is|are|was|were|does|do|did|can|could|would|should|has|have|had|with|from|into|for|of|to|in|on|at|by|as|than|that|this|these|those|most|main|major|only|correct|statement|following)\b/gi;
const cp=GEO_TRN_001_QUESTION_STUDIO_CORPUS_V1.filter(q=>q.cpId==="GEO-TRN-001-CP001");
for(const language of ["hi","pa"] as const){
 const seen=new Set<string>();
 for(const q of cp){
  const localized=localizeIndianGeoQuestionV1(q,language,"GEO-TRN-001");
  for(const option of localized.options){
   if((option.match(COMMON)||[]).length && !seen.has(option)){seen.add(option);console.log(JSON.stringify({language,option}));}
  }
 }
 console.log(JSON.stringify({language,uniqueResidualOptions:seen.size}));
}
