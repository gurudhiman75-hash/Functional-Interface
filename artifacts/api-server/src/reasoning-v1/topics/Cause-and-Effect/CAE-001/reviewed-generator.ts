import { generateCaeQuestion } from "./chapter-generator.ts";
import { generateCp007FalseCausationQuestion } from "./cp007-false-causation.ts";
import type { CaeLocale, CaeProjectionAuthority, CaeQuestionProfile, GeneratedCaeQuestion } from "./types.ts";

export type GenerateReviewedCaeQuestionInput = Readonly<{
  qlId: CaeProjectionAuthority["qlId"];
  locale: CaeLocale;
  seed: number;
  questionProfile?: CaeQuestionProfile;
}>;

/**
 * Review-facing generator facade. V3 remains frozen for every existing QL.
 * CP-007 is routed to the dedicated false-causation corpus because the prior
 * arbitrary disconnected-node sampling produced editorially trivial items.
 * Explicit FIVE_WAY requests still delegate to V3 until a sourced CP-007
 * five-way renderer is approved.
 */
export function generateReviewedCaeQuestion(input: GenerateReviewedCaeQuestionInput): GeneratedCaeQuestion {
  if (input.qlId === "CAE-QL-007" && (input.questionProfile === undefined || input.questionProfile === "FOUR_WAY")) {
    return generateCp007FalseCausationQuestion({ locale: input.locale, seed: input.seed });
  }
  return generateCaeQuestion(input);
}
