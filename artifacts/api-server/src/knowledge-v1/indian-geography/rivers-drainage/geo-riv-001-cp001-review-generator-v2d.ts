import type { GeoRiv001Cp001ReviewQuestion } from "./geo-riv-001-cp001-review-types";
import { generateGeoRiv001Cp001ReviewV2C } from "./geo-riv-001-cp001-review-generator-v2c";

function normalizeEditorialText(text: string) {
  return text
    .replace(/\ba east-flowing\b/g, "an east-flowing")
    .replace(/drains into Bay of Bengal/g, "drains into the Bay of Bengal")
    .replace(/drains into Arabian Sea/g, "drains into the Arabian Sea");
}

export function normalizeGeoRiv001Cp001ReviewV2D(
  question: GeoRiv001Cp001ReviewQuestion,
): GeoRiv001Cp001ReviewQuestion {
  const options = question.options.map(normalizeEditorialText);
  const canonicalAnswer = normalizeEditorialText(question.canonicalAnswer);
  if (options[question.correctIndex] !== canonicalAnswer) {
    throw new Error(`GEO-RIV-001 V2D normalization changed answer alignment for ${question.questionId}`);
  }
  return {
    ...question,
    questionId: question.questionId
      .replace("CP001-V2C", "CP001-V2D")
      .replace("CP001-V2-", "CP001-V2D-"),
    stem: normalizeEditorialText(question.stem),
    options,
    canonicalAnswer,
    explanation: normalizeEditorialText(question.explanation),
  };
}

export function generateGeoRiv001Cp001ReviewV2D(qlId: string, seed: string) {
  return normalizeGeoRiv001Cp001ReviewV2D(
    generateGeoRiv001Cp001ReviewV2C(qlId, seed),
  );
}
