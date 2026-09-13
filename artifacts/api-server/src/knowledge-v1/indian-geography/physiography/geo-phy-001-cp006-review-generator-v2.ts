import { generateGeoPhy001Cp006ReviewBatchV1 } from "./geo-phy-001-cp006-review-generator-v1";

const stemOverrides: Record<string, string> = {
  "GEO-PHY-001-CP006-Q017": "The Mumbai–Goa stretch belongs to which coastal section?",
};

export function generateGeoPhy001Cp006ReviewBatchV2() {
  return generateGeoPhy001Cp006ReviewBatchV1().map((question) => ({
    ...question,
    stem: stemOverrides[question.questionId] ?? question.stem,
  }));
}
