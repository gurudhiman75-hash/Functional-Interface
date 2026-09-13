import { withCae001SaturationWave2 } from "./causal-world-saturation-wave2.ts";
import { generateCaeQuestion } from "./chapter-generator.ts";
import { generateReviewedCp001Question } from "./cp001-reviewed-quality-guard.ts";
import { generateReviewedCaeCombinationQuestion } from "./cp003004-reviewed-polish.ts";
import { generateCp005CompetingQuestion } from "./cp005-competing-explanations.ts";
import { generateCp006CausalDistanceQuestion } from "./cp006-causal-distance.ts";
import { generateCp007CommonFactorQuestion } from "./cp007-common-factor.ts";
import { generateReviewedCp007FalseCausationQuestion } from "./cp007-reviewed-visible-evidence.ts";
import { generateReviewedCp008Question } from "./cp008-reviewed.ts";
import { generateReviewedCp009Question } from "./cp009-final-quality-guard.ts";
import type { CaeLocale, CaeProjectionAuthority, CaeQuestionProfile, GeneratedCaeQuestion } from "./types.ts";

export type GenerateReviewedCaeQuestionInput = Readonly<{
  qlId: CaeProjectionAuthority["qlId"];
  locale: CaeLocale;
  seed: number;
  questionProfile?: CaeQuestionProfile;
}>;

const saturatedBase = (input: GenerateReviewedCaeQuestionInput) => withCae001SaturationWave2(() => generateCaeQuestion(input));

/** Review-facing facade layered over the frozen V3 causal architecture. */
export function generateReviewedCaeQuestion(input: GenerateReviewedCaeQuestionInput): GeneratedCaeQuestion {
  const defaultFourWay = input.questionProfile === undefined || input.questionProfile === "FOUR_WAY";
  const seed = input.seed >>> 0;

  if (input.qlId === "CAE-QL-001" && defaultFourWay) {
    return generateReviewedCp001Question({ locale: input.locale, seed: input.seed });
  }

  // One reviewed seed in five intentionally exposes the saturation pool on the
  // candidate-heavy QLs. The other seeds preserve the specialised combination,
  // CP005 and integrated CP009 renderers already approved for the chapter.
  if (defaultFourWay && (input.qlId === "CAE-QL-003" || input.qlId === "CAE-QL-004") && seed % 5 === 4) {
    return saturatedBase(input);
  }
  if (defaultFourWay && (input.qlId === "CAE-QL-003" || input.qlId === "CAE-QL-004") && seed % 3 === 0) {
    return generateReviewedCaeCombinationQuestion({ qlId: input.qlId, locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-005" && defaultFourWay) {
    return seed % 5 === 4 ? saturatedBase(input) : generateCp005CompetingQuestion({ locale: input.locale, seed: input.seed });
  }

  // Two out of every three default CP006 seeds exercise causal distance;
  // the remaining third exposes the graph-native saturation universe.
  if (input.qlId === "CAE-QL-006" && defaultFourWay && seed % 3 !== 2) {
    return generateCp006CausalDistanceQuestion({ locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-007" && defaultFourWay) {
    // Preserve the specialised false-causation/common-factor mix while allowing
    // a controlled share of correlation questions to draw from expanded parallel worlds.
    if (seed % 5 === 4) return saturatedBase(input);
    return seed % 4 === 0
      ? generateCp007CommonFactorQuestion({ locale: input.locale, seed: input.seed })
      : generateReviewedCp007FalseCausationQuestion({ locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-008" && defaultFourWay) {
    // One in five uses the expanded graph-native sequence worlds; the reviewed
    // multi-event renderer remains the dominant form.
    return seed % 5 === 4 ? saturatedBase(input) : generateReviewedCp008Question({ locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-009" && defaultFourWay) {
    // Keep integrated missing-link modes dominant, but surface audited Wave 2
    // missing-link worlds often enough for real Question Studio coverage.
    return seed % 5 === 4 ? saturatedBase(input) : generateReviewedCp009Question({ locale: input.locale, seed: input.seed });
  }

  const graphNativeSaturationEligible = input.qlId === "CAE-QL-001" || input.qlId === "CAE-QL-002" || input.qlId === "CAE-QL-006";
  return graphNativeSaturationEligible ? saturatedBase(input) : generateCaeQuestion(input);
}
