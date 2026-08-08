import type { SylLocale, TermId } from "../foundation/types";
import { generateSylQuestionV4 } from "./generator-v4";
import { buildLearnerPresentationV5 } from "./learner-v5";
import { markDeadOptionRemediationV5 } from "./learner-v5-dead-option-remediation";
import { completeRequiredDiagramV5 } from "./learner-v5-diagram-completion";
import { polishLearnerPresentationV5 } from "./learner-v5-editorial-polish";
import { remediateModelTargetV5 } from "./learner-v5-model-target-remediation";
import { markQuestionExplanationApprovalV5 } from "./learner-v5-review-status";
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
  const learnerPresentationV5 = markQuestionExplanationApprovalV5(
    markDeadOptionRemediationV5(
      completeRequiredDiagramV5(
        question,
        remediateModelTargetV5(
          question,
          polishLearnerPresentationV5(
            question,
            buildLearnerPresentationV5(question, termLabels),
          ),
          termLabels,
        ),
        assignment,
      ),
    ),
  );

  return {
    ...question,
    learnerPresentationV5,
  };
}

export function generateSylQuestionV5ByString(
  qlId: string,
  seed: number,
  locale: SylLocale,
): GeneratedSylQuestionV5 {
  return generateSylQuestionV5(qlId as SylQlId, seed, locale);
}
