import {
  generateNumCp003RetainedQuestion as generateBase,
  NUM_CP003_RETAINED_TEMPLATE_LABELS,
  verifyRetainedAnswer,
} from "./runtime";
import type {
  NumCp003RetainedExplanation,
  NumCp003RetainedQuestion,
  NumCp003RetainedTemplateLabel,
} from "./runtime-types";
import { polishNumCp003RetainedStem } from "../../editorial/cp003-retained-stem-style";
import { polishNumCp003Explanation } from "../../editorial/cp003-explanation-style";
import { formatStandaloneIntegersForEnglishIndia } from "../../editorial/english-stem-style";

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
  const explanation = polishNumCp003Explanation(
    label,
    base.explanation,
    base.hiddenState,
  );
  return {
    ...base,
    stem: polishNumCp003RetainedStem(label, base.stem, base.hiddenState),
    explanation: formatExplanationNumbers(explanation),
  };
}
