import {
  generateNumCp003RetainedQuestion as generateBase,
  NUM_CP003_RETAINED_TEMPLATE_LABELS,
  verifyRetainedAnswer,
} from "./runtime";
import type {
  NumCp003RetainedExplanation,
  NumCp003RetainedHiddenState,
  NumCp003RetainedQuestion,
  NumCp003RetainedTemplateLabel,
} from "./runtime-types";
import { polishNumCp003RetainedStem } from "../../editorial/cp003-retained-stem-style";
import { polishNumCp003Explanation } from "../../editorial/cp003-explanation-style";
import { formatStandaloneIntegersForEnglishIndia } from "../../editorial/english-stem-style";

function ensureStepStructure(
  explanation: NumCp003RetainedExplanation,
  hiddenState: NumCp003RetainedHiddenState,
): NumCp003RetainedExplanation {
  if (explanation.steps.length >= 3) return explanation;

  const opening = hiddenState.kind === "SINGLE_DIGIT_CANDIDATE_SET"
    ? "Start with the possible digits {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}; exclude 0 if X is the first digit."
    : hiddenState.kind === "ORDERED_PAIR_CANDIDATE_SET"
      ? "Start with ordered digit pairs (X, Y); exclude 0 from any leading position."
      : "Write down the given condition before carrying out the calculation.";

  const steps = [opening, ...explanation.steps];
  if (steps.length < 3) {
    steps.splice(1, 0, "Apply every stated condition to the same completed number.");
  }
  return { ...explanation, steps };
}

function formatExplanationNumbers(
  explanation: NumCp003RetainedExplanation,
): NumCp003RetainedExplanation {
  const format = (text: string): string =>
    formatStandaloneIntegersForEnglishIndia(text);
  return {
    coreConcept: format(explanation.coreConcept),
    strategy: format(explanation.strategy),
    steps: explanation.steps.map(format),
    shortcut: format(explanation.shortcut),
    verification: format(explanation.verification),
    conclusion: format(explanation.conclusion),
    traps: explanation.traps.map(format),
  };
}

export { NUM_CP003_RETAINED_TEMPLATE_LABELS, verifyRetainedAnswer };

export function generateNumCp003RetainedQuestion(
  label: NumCp003RetainedTemplateLabel,
  seed: string,
): NumCp003RetainedQuestion {
  const base = generateBase(label, seed);
  const polished = polishNumCp003Explanation(
    label,
    base.explanation,
    base.hiddenState,
  );
  const explanation = ensureStepStructure(polished, base.hiddenState);
  return {
    ...base,
    stem: polishNumCp003RetainedStem(label, base.stem, base.hiddenState),
    explanation: formatExplanationNumbers(explanation),
  };
}
