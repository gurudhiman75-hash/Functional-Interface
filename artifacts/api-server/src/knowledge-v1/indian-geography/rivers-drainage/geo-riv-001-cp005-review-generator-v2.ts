import { generateGeoRiv001Cp005ReviewV1 } from "./geo-riv-001-cp005-review-generator-v1";
import type { GeoRiv001Cp005ReviewQuestion } from "./geo-riv-001-cp005-review-types";

function revise(question: GeoRiv001Cp005ReviewQuestion): GeoRiv001Cp005ReviewQuestion {
  let stem = question.stem;
  let explanation = question.explanation;

  if (stem === "Trimbakeshwar is linked with the source of which river?") {
    stem = "Trimbakeshwar is the source area of which river?";
  }
  if (stem === "The Baitarani originates in which hill region of Odisha?") {
    explanation = "The Baitarani originates in the Keonjhar hill region of Odisha, near the Gonasika area.";
  }

  return {
    ...question,
    questionId: question.questionId.replace("CP005-V1", "CP005-V2"),
    stem,
    explanation,
  };
}

export function generateGeoRiv001Cp005ReviewV2(qlId: string, seed: string) {
  return revise(generateGeoRiv001Cp005ReviewV1(qlId, seed));
}
