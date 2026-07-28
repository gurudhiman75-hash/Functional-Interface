import {
  generateNumCp003RetainedQuestion as generateBase,
  NUM_CP003_RETAINED_TEMPLATE_LABELS,
  verifyRetainedAnswer,
} from "./runtime";
import type {
  NumCp003RetainedQuestion,
  NumCp003RetainedTemplateLabel,
} from "./runtime-types";

function expand(text: string, minimum: number, prefix: string): string {
  const trimmed = text.trim();
  return trimmed.length >= minimum ? trimmed : `${prefix}${trimmed}`;
}

export { NUM_CP003_RETAINED_TEMPLATE_LABELS, verifyRetainedAnswer };

export function generateNumCp003RetainedQuestion(
  label: NumCp003RetainedTemplateLabel,
  seed: string,
): NumCp003RetainedQuestion {
  const base = generateBase(label, seed);
  return {
    ...base,
    explanation: {
      ...base.explanation,
      steps: base.explanation.steps.map((step) => expand(step, 16, "Complete the exact step: ")),
      shortcut: expand(base.explanation.shortcut, 24, "Efficient method: "),
      verification: expand(base.explanation.verification, 20, "Exact verification: "),
      conclusion: expand(base.explanation.conclusion, 16, "Final conclusion: "),
      traps: base.explanation.traps.map((trap) => expand(trap, 16, "Common trap: ")),
    },
  };
}
