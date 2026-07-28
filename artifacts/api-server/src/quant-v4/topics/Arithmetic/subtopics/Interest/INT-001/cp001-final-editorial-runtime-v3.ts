import { INT_CP001_EDITORIAL_RELEASE_ID } from "./cp001-editorial-release";
import {
  generateIntCp001FinalEditorialQuestion as generateIntCp001FinalEditorialV2Question,
  type IntCp001FinalEditorialQuestion as IntCp001FinalEditorialV2Question,
} from "./cp001-final-editorial-runtime";
import type { IntCp001FinalQlId } from "./cp001-final-registry";
import { finaliseIntCp001HumanisedStem } from "./cp001-editorial-v3-context-fix";
import {
  containsRawAsciiMath,
  hasGenericTextbookStemOpening,
  normaliseIntCp001InlineMath,
  normaliseIntCp001InlineMathText,
} from "./cp001-editorial-v3";

export type IntCp001FinalEditorialV3Question = Omit<
  IntCp001FinalEditorialV2Question,
  "releaseId" | "stem" | "options" | "optionAudit" | "explanation" | "validation"
> & {
  releaseId: typeof INT_CP001_EDITORIAL_RELEASE_ID;
  stem: string;
  options: string[];
  optionAudit: IntCp001FinalEditorialV2Question["optionAudit"];
  explanation: IntCp001FinalEditorialV2Question["explanation"];
  validation: IntCp001FinalEditorialV2Question["validation"];
};

export function generateIntCp001FinalEditorialV3Question(
  qlId: IntCp001FinalQlId,
  seed: string,
): IntCp001FinalEditorialV3Question {
  const v2 = generateIntCp001FinalEditorialV2Question(qlId, seed);
  const stem = normaliseIntCp001InlineMathText(finaliseIntCp001HumanisedStem(qlId, seed, v2.stem));
  const options = v2.options.map(normaliseIntCp001InlineMathText);
  const optionAudit = v2.optionAudit.map((option, index) => ({
    ...option,
    text: options[index]!,
  }));
  const inlineExplanation = normaliseIntCp001InlineMath(v2.explanation);
  const explanation = {
    ...inlineExplanation,
    trapAnalysis: {
      ...inlineExplanation.trapAnalysis,
      items: inlineExplanation.trapAnalysis.items.map((item) => ({
        ...item,
        optionText: options[item.optionNumber - 1]!,
      })),
    },
  };
  const errors = [...v2.validation.errors];

  if (hasGenericTextbookStemOpening(stem)) {
    errors.push("A generic textbook stem opening remains where a light exam-realistic context should be used.");
  }
  if (explanation.trapAnalysis.items.length !== 3) {
    errors.push(`Editorial v3 must analyse three distractors; found ${explanation.trapAnalysis.items.length}.`);
  }
  if (!explanation.stepByStep.conclusion.includes(options[v2.correctIndex]!)) {
    errors.push("Editorial v3 conclusion does not state the displayed correct option.");
  }
  for (const trap of explanation.trapAnalysis.items) {
    const optionIndex = trap.optionNumber - 1;
    if (trap.optionText !== options[optionIndex]) {
      errors.push(`Editorial v3 trap option ${trap.optionNumber} is out of sync with the displayed option.`);
    }
  }

  const learnerText = [
    stem,
    ...options,
    explanation.coreConcept.narrative,
    explanation.coreConcept.displayMath,
    ...explanation.stepByStep.steps,
    explanation.stepByStep.verification,
    explanation.stepByStep.conclusion,
    explanation.examShortcut.narrative,
    explanation.examShortcut.displayMath ?? "",
    ...explanation.trapAnalysis.items.flatMap((item) => [item.optionText, item.explanation]),
  ].join(" ");
  if (containsRawAsciiMath(learnerText)) {
    errors.push("Learner-facing prose contains an unwrapped ASCII fraction or variable expression.");
  }

  return {
    ...v2,
    releaseId: INT_CP001_EDITORIAL_RELEASE_ID,
    stem,
    options,
    optionAudit,
    explanation,
    validation: {
      ...v2.validation,
      ok: errors.length === 0,
      errors,
    },
  };
}
