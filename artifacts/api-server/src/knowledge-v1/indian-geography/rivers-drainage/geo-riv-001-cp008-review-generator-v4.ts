import { generateGeoRiv001Cp008ReviewV3, GEO_RIV_001_CP008_QL_IDS_V3 } from "./geo-riv-001-cp008-review-generator-v3";
import type { GeoRiv001Cp008ReviewQuestion } from "./geo-riv-001-cp008-review-types";

function polishIncorrectPairExplanation(question: GeoRiv001Cp008ReviewQuestion) {
  if (question.qlId !== "GEO-RIV-001-QL-070") return question.explanation;
  const marker = " is incorrect. ";
  const markerIndex = question.explanation.indexOf(marker);
  if (markerIndex < 0) return question.explanation;
  return `The pair is incorrect. ${question.explanation.slice(markerIndex + marker.length)}`;
}

/**
 * V4 is an editorial/difficulty-calibration overlay over V3.
 * It preserves every stem, option, answer and provenance field.
 *
 * Changes:
 * - QL070 explanations state the correction directly instead of repeating the
 *   full false option as prose.
 * - QL071 source-to-mouth two-clue identification is calibrated to Medium;
 *   the three-statement QL073 family remains Hard.
 */
export function toGeoRiv001Cp008ReviewV4(question: GeoRiv001Cp008ReviewQuestion): GeoRiv001Cp008ReviewQuestion {
  return {
    ...question,
    questionId: question.questionId.replace("CP008-V3", "CP008-V4"),
    difficulty: question.qlId === "GEO-RIV-001-QL-071" ? "Medium" : question.difficulty,
    explanation: polishIncorrectPairExplanation(question),
  };
}

export function generateGeoRiv001Cp008ReviewV4(qlId: string, seed: string): GeoRiv001Cp008ReviewQuestion {
  return toGeoRiv001Cp008ReviewV4(generateGeoRiv001Cp008ReviewV3(qlId, seed));
}

export const GEO_RIV_001_CP008_QL_IDS_V4 = GEO_RIV_001_CP008_QL_IDS_V3;
