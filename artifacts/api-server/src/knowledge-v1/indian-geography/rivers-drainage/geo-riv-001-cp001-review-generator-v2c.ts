import { deterministicPick } from "../../deterministic";
import type { GeoRiv001Cp001ReviewQuestion } from "./geo-riv-001-cp001-review-types";
import {
  generateGeoRiv001Ql001ReviewV2,
  generateGeoRiv001Ql002ReviewV2,
  generateGeoRiv001Ql003ReviewV2,
  generateGeoRiv001Ql004ReviewV2,
  generateGeoRiv001Ql005ReviewV2,
  generateGeoRiv001Ql008ReviewV2,
  generateGeoRiv001Ql009ReviewV2,
} from "./geo-riv-001-cp001-review-generator-v2";
import {
  generateGeoRiv001Ql006ReviewV2B,
  generateGeoRiv001Ql007ReviewV2B,
} from "./geo-riv-001-cp001-review-generator-v2b";

function withStem(
  question: GeoRiv001Cp001ReviewQuestion,
  seed: string,
  variants: readonly string[],
  version: string,
) {
  return {
    ...question,
    questionId: question.questionId.replace("CP001-V2B", `CP001-${version}`),
    stem: deterministicPick(variants, `${seed}:stem-v2c`),
  };
}

export function generateGeoRiv001Ql006ReviewV2C(seed: string) {
  return withStem(
    generateGeoRiv001Ql006ReviewV2B(seed),
    seed,
    [
      "Which of the following river-association pairs is correctly matched?",
      "Select the correctly matched river pair.",
      "Which river and associated feature are correctly paired?",
      "Identify the correctly matched river association.",
    ],
    "V2C",
  );
}

export function generateGeoRiv001Ql007ReviewV2C(seed: string) {
  return withStem(
    generateGeoRiv001Ql007ReviewV2B(seed),
    seed,
    [
      "Which of the following river-association pairs is incorrectly matched?",
      "Select the incorrectly matched river pair.",
      "Which river and associated feature are not correctly paired?",
      "Identify the mismatched river association.",
    ],
    "V2C",
  );
}

export const GEO_RIV_001_CP001_REVIEW_GENERATORS_V2C: Record<
  string,
  (seed: string) => GeoRiv001Cp001ReviewQuestion
> = {
  "GEO-RIV-001-QL-001": generateGeoRiv001Ql001ReviewV2,
  "GEO-RIV-001-QL-002": generateGeoRiv001Ql002ReviewV2,
  "GEO-RIV-001-QL-003": generateGeoRiv001Ql003ReviewV2,
  "GEO-RIV-001-QL-004": generateGeoRiv001Ql004ReviewV2,
  "GEO-RIV-001-QL-005": generateGeoRiv001Ql005ReviewV2,
  "GEO-RIV-001-QL-006": generateGeoRiv001Ql006ReviewV2C,
  "GEO-RIV-001-QL-007": generateGeoRiv001Ql007ReviewV2C,
  "GEO-RIV-001-QL-008": generateGeoRiv001Ql008ReviewV2,
  "GEO-RIV-001-QL-009": generateGeoRiv001Ql009ReviewV2,
};

export function generateGeoRiv001Cp001ReviewV2C(qlId: string, seed: string) {
  const generator = GEO_RIV_001_CP001_REVIEW_GENERATORS_V2C[qlId];
  if (!generator) throw new Error(`Unknown GEO-RIV-001 CP001 V2C QL ${qlId}`);
  if (!seed.trim()) throw new Error("GEO-RIV-001 CP001 V2C review generation requires an explicit seed");
  return generator(seed);
}
