import { generateGeoPhy001Cp007ReviewBatchV1 } from "./geo-phy-001-cp007-review-generator-v1";

const replacements: Record<string, string> = {
  "Andaman Sea": "Gulf of Kachchh",
  "Laccadive Sea only": "Gulf of Khambhat",
};

export function generateGeoPhy001Cp007ReviewBatchV2() {
  return generateGeoPhy001Cp007ReviewBatchV1().map((question) => ({
    ...question,
    options: question.options.map((option) => replacements[option] ?? option),
  }));
}
