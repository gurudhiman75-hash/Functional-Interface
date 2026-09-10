import { generateGeoRiv001Cp008ReviewV2, GEO_RIV_001_CP008_QL_IDS_V2 } from "./geo-riv-001-cp008-review-generator-v2";
import type { GeoRiv001Cp008ReviewQuestion } from "./geo-riv-001-cp008-review-types";

function clarifyFalseStatementExplanation(question: GeoRiv001Cp008ReviewQuestion) {
  if (question.qlId === "GEO-RIV-001-QL-072") {
    return question.explanation
      .replace(/Statement I is incorrect:\s*/g, "Statement I is incorrect. Correct fact: ")
      .replace(/Statement II is incorrect:\s*/g, "Statement II is incorrect. Correct fact: ")
      .replace(/Statement I is correct:\s*/g, "Statement I is correct. ")
      .replace(/Statement II is correct:\s*/g, "Statement II is correct. ");
  }
  if (question.qlId === "GEO-RIV-001-QL-073") {
    return question.explanation
      .replace(/(\d+)\. Incorrect — /g, "$1. Incorrect. Correct fact: ")
      .replace(/(\d+)\. Correct — /g, "$1. Correct. ");
  }
  return question.explanation;
}

/** V3 changes learner-facing explanation wording only. */
export function toGeoRiv001Cp008ReviewV3(question: GeoRiv001Cp008ReviewQuestion): GeoRiv001Cp008ReviewQuestion {
  return {
    ...question,
    questionId: question.questionId.replace("CP008-V2", "CP008-V3"),
    explanation: clarifyFalseStatementExplanation(question),
  };
}

/**
 * V3 is an editorial-only overlay over V2. It preserves stems, options,
 * answers, difficulty and provenance, while making false-statement
 * explanations unambiguous for learners.
 */
export function generateGeoRiv001Cp008ReviewV3(qlId: string, seed: string): GeoRiv001Cp008ReviewQuestion {
  return toGeoRiv001Cp008ReviewV3(generateGeoRiv001Cp008ReviewV2(qlId, seed));
}

export const GEO_RIV_001_CP008_QL_IDS_V3 = GEO_RIV_001_CP008_QL_IDS_V2;
