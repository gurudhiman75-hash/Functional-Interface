import { CAE_001_SATURATION_WAVE1_FAMILIES } from "./causal-world-saturation-wave1.ts";
import { CAE_001_SATURATION_WAVE2_FAMILIES, withCae001SaturationWave2 } from "./causal-world-saturation-wave2.ts";
import { generateCaeQuestion } from "./chapter-generator.ts";
import { generateReviewedCp001Question } from "./cp001-reviewed-quality-guard.ts";
import { generateReviewedCaeCombinationQuestion } from "./cp003004-reviewed-polish.ts";
import { generateCp005CompetingQuestion } from "./cp005-competing-explanations.ts";
import { generateCp006CausalDistanceQuestion } from "./cp006-causal-distance.ts";
import { generateCp007CommonFactorQuestion } from "./cp007-common-factor.ts";
import { generateReviewedCp007SaturationCommonFactorQuestion } from "./cp007-saturation-adapter.ts";
import { generateReviewedCp007FalseCausationQuestion } from "./cp007-reviewed-visible-evidence.ts";
import { generateReviewedCp008Question } from "./cp008-reviewed.ts";
import { generateCp008SaturationQuestion } from "./cp008-saturation-adapter.ts";
import { generateReviewedCp009Question } from "./cp009-final-quality-guard.ts";
import { CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS } from "./saturation-candidate-authorities.ts";
import type { CaeLocale, CaeProjectionAuthority, CaeQuestionProfile, GeneratedCaeQuestion } from "./types.ts";

export type GenerateReviewedCaeQuestionInput = Readonly<{
  qlId: CaeProjectionAuthority["qlId"];
  locale: CaeLocale;
  seed: number;
  questionProfile?: CaeQuestionProfile;
}>;

const SATURATION_FAMILY_IDS = new Set([...CAE_001_SATURATION_WAVE1_FAMILIES, ...CAE_001_SATURATION_WAVE2_FAMILIES].map((family) => family.id));
const CANDIDATE_READY_IDS = new Set(CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS);
const saturatedBase = (input: GenerateReviewedCaeQuestionInput) => withCae001SaturationWave2(() => generateCaeQuestion(input));

function reviewedSaturationQuestion(input: GenerateReviewedCaeQuestionInput, candidateHeavy: boolean): GeneratedCaeQuestion {
  const externalSeed = input.seed >>> 0;
  for (let offset = 0; offset < 256; offset += 1) {
    const internalSeed = (externalSeed + offset) >>> 0;
    const question = saturatedBase({ ...input, seed: internalSeed });
    const eligible = candidateHeavy ? CANDIDATE_READY_IDS.has(question.scenarioFamilyId) : SATURATION_FAMILY_IDS.has(question.scenarioFamilyId);
    if (!eligible) continue;
    if (offset === 0) return question;

    const remapMarker = `reviewed-saturation-remap:${externalSeed}->${internalSeed}`;
    const causalStateId = `${question.causalStateId}|${remapMarker}`;
    const itemSuffix = question.itemVariantId.startsWith(question.causalStateId)
      ? question.itemVariantId.slice(question.causalStateId.length)
      : `|source-item:${question.itemVariantId}`;
    const itemVariantId = `${causalStateId}${itemSuffix}`;
    return Object.freeze({ ...question, seed: input.seed, causalStateId, itemVariantId, semanticInstanceId: itemVariantId });
  }
  throw new Error(`${input.qlId} seed ${externalSeed}: no eligible reviewed saturation family found.`);
}

/** Review-facing facade layered over the frozen V3 causal architecture. */
export function generateReviewedCaeQuestion(input: GenerateReviewedCaeQuestionInput): GeneratedCaeQuestion {
  const defaultFourWay = input.questionProfile === undefined || input.questionProfile === "FOUR_WAY";
  const seed = input.seed >>> 0;

  if (input.qlId === "CAE-QL-001" && defaultFourWay) {
    return generateReviewedCp001Question({ locale: input.locale, seed: input.seed });
  }

  if (defaultFourWay && (input.qlId === "CAE-QL-003" || input.qlId === "CAE-QL-004") && seed % 5 === 4) {
    return reviewedSaturationQuestion(input, true);
  }
  if (defaultFourWay && (input.qlId === "CAE-QL-003" || input.qlId === "CAE-QL-004") && seed % 3 === 0) {
    return generateReviewedCaeCombinationQuestion({ qlId: input.qlId, locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-005" && defaultFourWay) {
    return seed % 5 === 4 ? reviewedSaturationQuestion(input, true) : generateCp005CompetingQuestion({ locale: input.locale, seed: input.seed });
  }

  if (input.qlId === "CAE-QL-006" && defaultFourWay && seed % 3 !== 2) {
    return generateCp006CausalDistanceQuestion({ locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-007" && defaultFourWay) {
    if (seed % 8 === 0) return generateReviewedCp007SaturationCommonFactorQuestion({ locale: input.locale, seed: input.seed });
    if (seed % 8 === 4) return generateCp007CommonFactorQuestion({ locale: input.locale, seed: input.seed });
    return generateReviewedCp007FalseCausationQuestion({ locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-008" && defaultFourWay) {
    return seed % 8 === 7
      ? generateCp008SaturationQuestion({ locale: input.locale, seed: input.seed })
      : generateReviewedCp008Question({ locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-009" && defaultFourWay) {
    return generateReviewedCp009Question({ locale: input.locale, seed: input.seed });
  }

  const graphNativeSaturationEligible = input.qlId === "CAE-QL-001" || input.qlId === "CAE-QL-002" || input.qlId === "CAE-QL-006";
  return graphNativeSaturationEligible ? saturatedBase(input) : generateCaeQuestion(input);
}
