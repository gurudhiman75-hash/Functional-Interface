import { generateGeoRiv001Cp009ReviewV1, GEO_RIV_001_CP009_QL_IDS_V1 } from "./geo-riv-001-cp009-review-generator-v1";
import type { GeoRiv001Cp009ReviewQuestion } from "./geo-riv-001-cp009-review-types";

function rewriteCourseSetStem(stem: string) {
  const match = stem.match(/^Which river has its Indian main course through the following state set: (.+)\?$/);
  if (!match) return stem;
  return `Which river's course in India passes through only the following states: ${match[1]}?`;
}

function rewriteIncorrectPairExplanation(explanation: string) {
  return explanation.replace(/\. Its reviewed Indian course states are /, ". In India, it flows through ");
}

/**
 * V2 is an editorial overlay over the fact-verified V1 generator.
 * It preserves answers, options, difficulty and provenance while removing
 * machine/meta phrasing from QL077 and QL079.
 */
export function toGeoRiv001Cp009ReviewV2(question: GeoRiv001Cp009ReviewQuestion): GeoRiv001Cp009ReviewQuestion {
  return {
    ...question,
    questionId: question.questionId.replace("CP009-V1", "CP009-V2"),
    stem: question.qlId === "GEO-RIV-001-QL-077" ? rewriteCourseSetStem(question.stem) : question.stem,
    explanation: question.qlId === "GEO-RIV-001-QL-079" ? rewriteIncorrectPairExplanation(question.explanation) : question.explanation,
  };
}

export function generateGeoRiv001Cp009ReviewV2(qlId: string, seed: string): GeoRiv001Cp009ReviewQuestion {
  return toGeoRiv001Cp009ReviewV2(generateGeoRiv001Cp009ReviewV1(qlId, seed));
}

export const GEO_RIV_001_CP009_QL_IDS_V2 = GEO_RIV_001_CP009_QL_IDS_V1;
