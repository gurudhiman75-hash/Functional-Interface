import { localizeGeoReferenceQuestionV1 } from "./geo-reference-localization-v1";
import { GEO_LAK_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-lak-001-adapter-v1";
for(const q of GEO_LAK_001_QUESTION_STUDIO_CORPUS_V1.slice(0,12)){
  const hi=localizeGeoReferenceQuestionV1(q,"hi");
  const pa=localizeGeoReferenceQuestionV1(q,"pa");
  console.log(JSON.stringify({id:q.questionId,sourceExplanation:q.explanation,hi,pa},null,2));
}
