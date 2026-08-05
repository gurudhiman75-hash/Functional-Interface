import type { SylLocale, TermId } from "../foundation/types";
import { generateSylQuestion } from "./generator";
import { buildLearnerPresentationV4 } from "./learner-v4";
import { polishLearnerPresentationV4 } from "./learner-v4-native-polish";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import { remediateLearnerVisualV4 } from "./learner-v4-visual-remediation";
import { createPrng, shuffle } from "./prng";
import { assignTerms } from "./term-assignment";
import type { SylQlId } from "./types";

export function generateSylQuestionV4(
  qlId: SylQlId,
  seed: number,
  locale: SylLocale,
): GeneratedSylQuestionV4 {
  const question = generateSylQuestion(qlId, seed, locale);
  const termOrder = Object.keys(question.structuredPrompt.termKeysById).sort() as TermId[];
  const assignment = assignTerms(qlId, seed, termOrder);
  const termLabels = Object.fromEntries(
    termOrder.map((termId) => [termId, assignment[termId].labels[locale]]),
  ) as Readonly<Record<TermId, string>>;
  const displayedPremises = shuffle(
    question.structuredPrompt.premises,
    createPrng(`${qlId}:${seed}:premise-order`),
  );

  const learnerPresentationV4 = polishLearnerPresentationV4(
    remediateLearnerVisualV4(
      buildLearnerPresentationV4(question.structuredProofV3, {
        qlId,
        sourcePatternId: question.sourcePatternId,
        scenarioId: question.scenarioId,
        locale,
        taskKind: question.metadata.taskKind,
        displayedPremises,
        statements: question.statements,
        conclusions: question.conclusions,
        canonicalConclusions: question.structuredPrompt.conclusions,
        termLabels,
        correctIndex: question.correctIndex,
        options: question.options,
        reviewLogic: question.reviewLogic,
        structuredPrompt: question.structuredPrompt,
      }),
      { locale, displayedPremises, termLabels },
    ),
  );

  return {
    ...question,
    learnerPresentationV4,
  };
}

export function generateSylQuestionV4ByString(
  qlId: string,
  seed: number,
  locale: SylLocale,
): GeneratedSylQuestionV4 {
  return generateSylQuestionV4(qlId as SylQlId, seed, locale);
}
