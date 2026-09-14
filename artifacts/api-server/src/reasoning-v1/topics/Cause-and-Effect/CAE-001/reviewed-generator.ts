import { CAE_001_SATURATION_WAVE1_FAMILIES } from "./causal-world-saturation-wave1.ts";
import { CAE_001_SATURATION_WAVE2_FAMILIES } from "./causal-world-saturation-wave2.ts";
import { CAE_001_SATURATION_WAVE4_FAMILIES, withCae001SaturationWave4 } from "./causal-world-saturation-wave4.ts";
import { generateCaeQuestion } from "./chapter-generator.ts";
import { generateReviewedCp001Question } from "./cp001-reviewed-quality-guard.ts";
import { generateReviewedCaeCombinationQuestion } from "./cp003004-reviewed-polish.ts";
import { generateCp005CompetingQuestion } from "./cp005-competing-explanations.ts";
import { generateCp005EvidenceFitQuestion } from "./cp005-evidence-fit.ts";
import { generateCp006CausalDistanceQuestion } from "./cp006-causal-distance.ts";
import { generateCp006BridgeDistanceQuestion } from "./cp006-bridge-distance.ts";
import { generateCp007CommonFactorQuestion } from "./cp007-common-factor.ts";
import { generateReviewedCp007SaturationCommonFactorQuestion } from "./cp007-saturation-adapter.ts";
import { generateReviewedCp007FalseCausationQuestion } from "./cp007-reviewed-visible-evidence.ts";
import { generateReviewedCp007Wave4ParallelQuestion } from "./cp007-wave4-parallel-adapter.ts";
import { generateReviewedCp008Question } from "./cp008-reviewed.ts";
import { generateCp008SaturationQuestion } from "./cp008-saturation-adapter.ts";
import { generateReviewedCp009Question } from "./cp009-final-quality-guard.ts";
import { generateCp009SaturationQuestion } from "./cp009-saturation-adapter.ts";
import { generateCp009ExpandedCommonCauseQuestion } from "./cp009-expanded-common-cause.ts";
import { CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS } from "./saturation-candidate-authorities.ts";
import type { CaeLocale, CaeProjectionAuthority, CaeQuestionProfile, GeneratedCaeQuestion } from "./types.ts";

export type GenerateReviewedCaeQuestionInput = Readonly<{
  qlId: CaeProjectionAuthority["qlId"];
  locale: CaeLocale;
  seed: number;
  questionProfile?: CaeQuestionProfile;
}>;

const SATURATION_FAMILY_IDS = new Set([
  ...CAE_001_SATURATION_WAVE1_FAMILIES,
  ...CAE_001_SATURATION_WAVE2_FAMILIES,
  ...CAE_001_SATURATION_WAVE4_FAMILIES,
].map((family) => family.id));
const CANDIDATE_READY_IDS = new Set(CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS);
const saturatedBase = (input: GenerateReviewedCaeQuestionInput) => withCae001SaturationWave4(() => generateCaeQuestion(input));

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

function reviewedCp009Specialized(input: Readonly<{ locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  const specialised = generateReviewedCp009Question(input);
  return specialised.causalStructure.split(":")[1] === "COMMON_CAUSE_RECONSTRUCTION"
    ? generateCp009ExpandedCommonCauseQuestion(input)
    : specialised;
}

export function generateReviewedCaeQuestion(input: GenerateReviewedCaeQuestionInput): GeneratedCaeQuestion {
  const defaultFourWay = input.questionProfile === undefined || input.questionProfile === "FOUR_WAY";
  const seed = input.seed >>> 0;
  if (input.qlId === "CAE-QL-001" && defaultFourWay) return generateReviewedCp001Question({ locale: input.locale, seed: input.seed });
  if (defaultFourWay && (input.qlId === "CAE-QL-003" || input.qlId === "CAE-QL-004") && seed % 5 === 4) return reviewedSaturationQuestion(input, true);
  if (defaultFourWay && (input.qlId === "CAE-QL-003" || input.qlId === "CAE-QL-004") && seed % 3 === 0) return generateReviewedCaeCombinationQuestion({ qlId: input.qlId, locale: input.locale, seed: input.seed });
  if (input.qlId === "CAE-QL-005" && defaultFourWay) {
    if (seed % 5 === 4) return reviewedSaturationQuestion(input, true);
    if (seed % 10 === 1 || seed % 10 === 3 || seed % 10 === 6 || seed % 10 === 8) {
      return generateCp005EvidenceFitQuestion({ locale: input.locale, seed: input.seed });
    }
    return generateCp005CompetingQuestion({ locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-006" && defaultFourWay) return seed % 3 === 2
    ? generateCp006BridgeDistanceQuestion({ locale: input.locale, seed: input.seed })
    : generateCp006CausalDistanceQuestion({ locale: input.locale, seed: input.seed });
  if (input.qlId === "CAE-QL-007" && defaultFourWay) {
    if (seed % 8 === 0) return generateReviewedCp007SaturationCommonFactorQuestion({ locale: input.locale, seed: input.seed });
    if (seed % 8 === 4) return generateCp007CommonFactorQuestion({ locale: input.locale, seed: input.seed });
    if (seed % 8 === 2 || seed % 8 === 6) return generateReviewedCp007Wave4ParallelQuestion({ locale: input.locale, seed: input.seed });
    return generateReviewedCp007FalseCausationQuestion({ locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-008" && defaultFourWay) return seed % 8 === 7 ? generateCp008SaturationQuestion({ locale: input.locale, seed: input.seed }) : generateReviewedCp008Question({ locale: input.locale, seed: input.seed });
  if (input.qlId === "CAE-QL-009" && defaultFourWay) {
    if (seed % 8 === 2) return generateCp009ExpandedCommonCauseQuestion({ locale: input.locale, seed: input.seed });
    if (seed % 8 === 6) return generateCp009SaturationQuestion({ locale: input.locale, seed: input.seed });
    return reviewedCp009Specialized({ locale: input.locale, seed: input.seed });
  }
  const graphNativeSaturationEligible = input.qlId === "CAE-QL-001" || input.qlId === "CAE-QL-002";
  return graphNativeSaturationEligible ? saturatedBase(input) : generateCaeQuestion(input);
}
