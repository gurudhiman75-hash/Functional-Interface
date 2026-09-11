import { generateGeoRiv001Cp008ReviewV4, GEO_RIV_001_CP008_QL_IDS_V4 } from "./geo-riv-001-cp008-review-generator-v4";
import type { GeoRiv001Cp008ReviewQuestion } from "./geo-riv-001-cp008-review-types";

function simplifyExplanation(question: GeoRiv001Cp008ReviewQuestion) {
  let explanation = question.explanation;
  if (question.qlId === "GEO-RIV-001-QL-070") {
    explanation = explanation.replace(/^The pair is incorrect\.\s*/, "");
  }
  if (question.qlId === "GEO-RIV-001-QL-072" || question.qlId === "GEO-RIV-001-QL-073") {
    explanation = explanation.replace(/Correct fact:\s*/g, "");
  }
  return explanation;
}

/**
 * V5 is an explanation-only editorial overlay over V4.
 * It preserves every stem, option, answer, difficulty and provenance field.
 *
 * Changes:
 * - QL070 gives the correction directly, without the tautological
 *   "The pair is incorrect" preface.
 * - QL072/QL073 remove the meta label "Correct fact:" while retaining the
 *   explicit correction after an incorrect statement.
 */
export function toGeoRiv001Cp008ReviewV5(question: GeoRiv001Cp008ReviewQuestion): GeoRiv001Cp008ReviewQuestion {
  return {
    ...question,
    questionId: question.questionId.replace("CP008-V4", "CP008-V5"),
    explanation: simplifyExplanation(question),
  };
}

export function generateGeoRiv001Cp008ReviewV5(qlId: string, seed: string): GeoRiv001Cp008ReviewQuestion {
  return toGeoRiv001Cp008ReviewV5(generateGeoRiv001Cp008ReviewV4(qlId, seed));
}

export const GEO_RIV_001_CP008_QL_IDS_V5 = GEO_RIV_001_CP008_QL_IDS_V4;
