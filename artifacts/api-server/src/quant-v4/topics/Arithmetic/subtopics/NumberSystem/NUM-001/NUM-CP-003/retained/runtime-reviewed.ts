import {
  generateNumCp003RetainedQuestion as generateBase,
  NUM_CP003_RETAINED_TEMPLATE_LABELS,
  verifyRetainedAnswer,
} from "./runtime";
import type {
  NumCp003RetainedQuestion,
  NumCp003RetainedTemplateLabel,
} from "./runtime-types";
import { polishNumCp003RetainedStem } from "../../editorial/cp003-retained-stem-style";
import { polishNumCp003Explanation } from "../../editorial/cp003-explanation-style";

export { NUM_CP003_RETAINED_TEMPLATE_LABELS, verifyRetainedAnswer };

export function generateNumCp003RetainedQuestion(
  label: NumCp003RetainedTemplateLabel,
  seed: string,
): NumCp003RetainedQuestion {
  const base = generateBase(label, seed);
  return {
    ...base,
    stem: polishNumCp003RetainedStem(label, base.stem, base.hiddenState),
    explanation: polishNumCp003Explanation(
      label,
      base.explanation,
      base.hiddenState,
    ),
  };
}
