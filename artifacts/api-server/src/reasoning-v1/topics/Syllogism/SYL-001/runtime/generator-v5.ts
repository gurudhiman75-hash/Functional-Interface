import type { SylLocale, TermId } from "../foundation/types";
import { generateSylQuestionV4 } from "./generator-v4";
import { buildLearnerPresentationV5 } from "./learner-v5";
import type { GeneratedSylQuestionV5 } from "./learner-v5-types";
import { assignTerms } from "./term-assignment";
import type { SylQlId } from "./types";

export function generateSylQuestionV5(
  qlId: SylQlId,
  seed: number,
  locale: SylLocale,
): GeneratedSylQuestionV5 {
  const question = generateSylQuestionV4(qlId, seed, locale);
  const termOrder = Object.keys(question.structuredPrompt.termKeysById).sort() as TermId[];
  const assignment = assignTerms(qlId, seed, termOrder);
  const termLabels = Object.fromEntries(
    termOrder.map((termId) => [termId, assignment[termId].labels[locale]]),
  ) as Readonly<Record<TermId, string>>;

  return {
    ...question,
    learnerPresentationV5: buildLearnerPresentationV5(question, termLabels),
  };
}

export function generateSylQuestionV5ByString(
  qlId: string,
  seed: number,
  locale: SylLocale,
): GeneratedSylQuestionV5 {
  return generateSylQuestionV5(qlId as SylQlId, seed, locale);
}
