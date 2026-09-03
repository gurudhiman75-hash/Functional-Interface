import assert from "node:assert/strict";

import { generateSpatialProductionStudioQuestionV6 } from "../foundation/spatial/spatial-question-studio-production-v6";

const qlIds = ["SPA-QL-051", "SPA-QL-052", "SPA-QL-053"] as const;
const seeds = Array.from({ length: 16 }, (_, index) => `ffm-localization-${index + 1}`);
const englishRegionLeak = /\b(?:upper-left|upper-right|lower-left|lower-right|upper|lower|left|right|central|middle)\b/i;

let checked = 0;
for (const qlId of qlIds) {
  for (const language of ["hi", "pa"] as const) {
    for (const seed of seeds) {
      const question = generateSpatialProductionStudioQuestionV6({ qlId, language, seed }) as any;
      assert.doesNotMatch(question.explanation.application, englishRegionLeak, `${qlId}/${language}/${seed}: untranslated placement-region term leaked.`);
      assert.match(question.explanation.application, /\d+°/, `${qlId}/${language}/${seed}: item-specific rotation working missing.`);
      assert.match(
        question.localization.authority,
        /SPA-FFM-001-MULTILINGUAL-RUNTIME-V2-FULL-REGION-LOCALIZATION/,
        `${qlId}/${language}/${seed}: localization V2 authority missing.`,
      );
      checked += 1;
    }
  }
}

assert.equal(checked, 96);
console.log("PASS_FFM_001_FULL_REGION_LOCALIZATION_V2", { checked });
