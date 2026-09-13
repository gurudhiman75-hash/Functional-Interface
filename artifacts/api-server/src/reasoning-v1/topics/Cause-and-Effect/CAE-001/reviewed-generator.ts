import { generateCaeQuestion } from "./chapter-generator.ts";
import { generateCaeCombinationQuestion } from "./cp003004-combination.ts";
import { generateCp005CompetingQuestion } from "./cp005-competing-explanations.ts";
import { generateCp006CausalDistanceQuestion } from "./cp006-causal-distance.ts";
import { generateCp007CommonFactorQuestion } from "./cp007-common-factor.ts";
import { generateCp007FalseCausationQuestion } from "./cp007-false-causation.ts";
import { generateReviewedCp008Question } from "./cp008-reviewed.ts";
import { generateCp009IntegratedQuestion } from "./cp009-integrated.ts";
import type { CaeLocale, CaeProjectionAuthority, CaeQuestionProfile, GeneratedCaeQuestion } from "./types.ts";

export type GenerateReviewedCaeQuestionInput = Readonly<{
  qlId: CaeProjectionAuthority["qlId"];
  locale: CaeLocale;
  seed: number;
  questionProfile?: CaeQuestionProfile;
}>;

/** Review-facing facade layered over the frozen V3 causal architecture. */
export function generateReviewedCaeQuestion(input: GenerateReviewedCaeQuestionInput): GeneratedCaeQuestion {
  const defaultFourWay = input.questionProfile === undefined || input.questionProfile === "FOUR_WAY";

  if (defaultFourWay && (input.qlId === "CAE-QL-003" || input.qlId === "CAE-QL-004") && (input.seed >>> 0) % 3 === 0) {
    return generateCaeCombinationQuestion({ qlId: input.qlId, locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-005" && defaultFourWay) {
    return generateCp005CompetingQuestion({ locale: input.locale, seed: input.seed });
  }
  // Two out of every three default CP006 seeds exercise causal distance;
  // seed parity then gives both immediate and remote cases. The remaining
  // third preserves the frozen indirect-chain renderer in reviewed output.
  if (input.qlId === "CAE-QL-006" && defaultFourWay && (input.seed >>> 0) % 3 !== 2) {
    return generateCp006CausalDistanceQuestion({ locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-007" && defaultFourWay) {
    return (input.seed >>> 0) % 4 === 0
      ? generateCp007CommonFactorQuestion({ locale: input.locale, seed: input.seed })
      : generateCp007FalseCausationQuestion({ locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-008" && defaultFourWay) {
    return generateReviewedCp008Question({ locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-009" && defaultFourWay) {
    return generateCp009IntegratedQuestion({ locale: input.locale, seed: input.seed });
  }
  return generateCaeQuestion(input);
}
