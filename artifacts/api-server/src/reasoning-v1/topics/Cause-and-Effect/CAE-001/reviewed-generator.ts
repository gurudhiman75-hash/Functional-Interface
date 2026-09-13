import { generateCaeQuestion } from "./chapter-generator.ts";
import { generateCaeCombinationQuestion } from "./cp003004-combination.ts";
import { generateCp005CompetingQuestion } from "./cp005-competing-explanations.ts";
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

/**
 * Review-facing generator facade. V3 remains frozen as the architecture
 * regression. Approved editorial/source remediations are layered here.
 *
 * CP-003/004 retain the frozen one-of-four forms, while every third default
 * seed exercises the practice-validated combination-answer renderer. This
 * preserves the conventional form and makes the newly sourced learner
 * operation visible without redefining the canonical graph model.
 */
export function generateReviewedCaeQuestion(input: GenerateReviewedCaeQuestionInput): GeneratedCaeQuestion {
  const defaultFourWay = input.questionProfile === undefined || input.questionProfile === "FOUR_WAY";

  if (defaultFourWay && (input.qlId === "CAE-QL-003" || input.qlId === "CAE-QL-004") && (input.seed >>> 0) % 3 === 0) {
    return generateCaeCombinationQuestion({ qlId: input.qlId, locale: input.locale, seed: input.seed });
  }
  if (input.qlId === "CAE-QL-005" && defaultFourWay) {
    return generateCp005CompetingQuestion({ locale: input.locale, seed: input.seed });
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
