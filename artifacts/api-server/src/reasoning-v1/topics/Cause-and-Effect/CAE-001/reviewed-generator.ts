import { generateCaeQuestion } from "./chapter-generator.ts";
import { generateCp005CompetingQuestion } from "./cp005-competing-explanations.ts";
import { generateCp007CommonFactorQuestion } from "./cp007-common-factor.ts";
import { generateCp007FalseCausationQuestion } from "./cp007-false-causation.ts";
import type { CaeLocale, CaeProjectionAuthority, CaeQuestionProfile, GeneratedCaeQuestion } from "./types.ts";

export type GenerateReviewedCaeQuestionInput = Readonly<{
  qlId: CaeProjectionAuthority["qlId"];
  locale: CaeLocale;
  seed: number;
  questionProfile?: CaeQuestionProfile;
}>;

/**
 * Review-facing generator facade. V3 remains frozen as the architecture
 * regression. Approved editorial remediations are layered here:
 *
 * - CP-005: human-calibrated competing explanations with genuinely close
 *   alternatives; HARD is earned by causal discrimination rather than tiny or
 *   wrong-location distractors.
 * - CP-007: false-causation/post-hoc cases plus hidden common-factor cases.
 *
 * Explicit FIVE_WAY requests remain on V3 unless a checkpoint-specific sourced
 * five-way renderer has been separately approved.
 */
export function generateReviewedCaeQuestion(input: GenerateReviewedCaeQuestionInput): GeneratedCaeQuestion {
  const defaultFourWay = input.questionProfile === undefined || input.questionProfile === "FOUR_WAY";
  if (input.qlId === "CAE-QL-005" && defaultFourWay) {
    return generateCp005CompetingQuestion({ locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-007" && defaultFourWay) {
    return (input.seed >>> 0) % 4 === 0
      ? generateCp007CommonFactorQuestion({ locale: input.locale, seed: input.seed })
      : generateCp007FalseCausationQuestion({ locale: input.locale, seed: input.seed });
  }
  return generateCaeQuestion(input);
}
