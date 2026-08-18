import { mkdirSync, writeFileSync } from "node:fs";

import { SPATIAL_PERMANENT_QL_ALLOCATIONS_V1 } from "../foundation/spatial/spatial-permanent-ql-allocation-v1";
import {
  SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1,
  SPATIAL_QUESTION_STUDIO_LANGUAGES_V1,
  type SpatialQuestionStudioLanguageV1,
} from "../foundation/spatial/spatial-question-studio-localization-v1";
import {
  generateSpatialProductionStudioQuestionV1,
  type SpatialProductionStudioQuestionV1,
} from "../foundation/spatial/spatial-question-studio-production-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function visualProjection(question: SpatialProductionStudioQuestionV1) {
  return {
    qlId: question.qlId,
    proposalId: question.proposalId,
    chapterCode: question.chapterCode,
    difficultyBand: question.difficultyBand,
    seed: question.seed,
    generationSeed: question.generationSeed,
    mode: question.mode,
    stimulusSvgs: question.stimulusSvgs,
    optionSvgs: question.optionSvgs,
    optionLabels: question.optionLabels,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalItemId: question.canonicalItemId,
    contentFingerprint: question.contentFingerprint,
    renderer: question.renderer,
    validation: question.validation,
  };
}

let generated = 0;
let directParityChecks = 0;
let distinctLanguageIdChecks = 0;

for (const allocation of SPATIAL_PERMANENT_QL_ALLOCATIONS_V1) {
  const seed = `SPA-P0-PARITY-V2:${allocation.permanentQlId}`;
  const byLanguage = new Map<SpatialQuestionStudioLanguageV1, SpatialProductionStudioQuestionV1>();

  for (const language of SPATIAL_QUESTION_STUDIO_LANGUAGES_V1) {
    const question = generateSpatialProductionStudioQuestionV1({
      qlId: allocation.permanentQlId,
      seed,
      language,
    });
    assert(question.localization.authority === SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1, `${allocation.permanentQlId}/${language}: P0 localization authority changed.`);
    byLanguage.set(language, question);
    generated += 1;
  }

  const en = byLanguage.get("en")!;
  const hi = byLanguage.get("hi")!;
  const pa = byLanguage.get("pa")!;

  assert(JSON.stringify(visualProjection(en)) === JSON.stringify(visualProjection(hi)), `${allocation.permanentQlId}: English/Hindi P0 visual-answer parity failed.`);
  assert(JSON.stringify(visualProjection(en)) === JSON.stringify(visualProjection(pa)), `${allocation.permanentQlId}: English/Punjabi P0 visual-answer parity failed.`);
  assert(en.canonicalItemId === hi.canonicalItemId && en.canonicalItemId === pa.canonicalItemId, `${allocation.permanentQlId}: canonical item ID changed across P0 languages.`);
  assert(en.contentFingerprint === hi.contentFingerprint && en.contentFingerprint === pa.contentFingerprint, `${allocation.permanentQlId}: content fingerprint changed across P0 languages.`);
  assert(en.answer === hi.answer && en.answer === pa.answer, `${allocation.permanentQlId}: answer changed across P0 languages.`);
  assert(new Set([en.questionLanguageId, hi.questionLanguageId, pa.questionLanguageId]).size === 3, `${allocation.permanentQlId}: P0 language-specific IDs are no longer distinct.`);

  directParityChecks += 2;
  distinctLanguageIdChecks += 1;
}

assert(generated === 90, `Expected 90 P0 parity questions, got ${generated}.`);
assert(directParityChecks === 60, `Expected 60 direct P0 parity comparisons, got ${directParityChecks}.`);
assert(distinctLanguageIdChecks === 30, `Expected 30 P0 language-ID checks, got ${distinctLanguageIdChecks}.`);

const evidence = {
  status: "PASS_SPA_P0_MULTILINGUAL_PARITY_UNDER_FGC_V2",
  frozenQlCount: 30,
  generated,
  directParityChecks,
  distinctLanguageIdChecks,
  checks: {
    englishHindiVisualByteParity: true,
    englishPunjabiVisualByteParity: true,
    answerParity: true,
    canonicalItemSharedAcrossLanguages: true,
    contentFingerprintParity: true,
    distinctQuestionLanguageIds: true,
    frozenLocalizationAuthority: true,
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-p0-multilingual-parity-v2-evidence.json",
  JSON.stringify(evidence, null, 2),
);
console.log(JSON.stringify(evidence, null, 2));
