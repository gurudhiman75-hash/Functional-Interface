export interface TmwLearnerExplanationShortcut {
  title: string;
  steps: string[];
}

export interface TmwLearnerExplanationCommonMistake {
  optionLabel?: string;
  optionText?: string;
  explanation: string;
}

/**
 * Student-facing explanation contract for the post-audit TMW remodel.
 *
 * QL-owned content:
 *   Method -> 2-5 connected Solution steps -> exact Answer.
 * Shortcut and Common Mistake are optional and should exist only when useful.
 *
 * Shared engines remain responsible for exact arithmetic, MathJax formatting,
 * option shuffling and answer verification. R1 introduces the contract without
 * rewriting all 211 frozen explanations; R2/R3 migrate QLs onto it checkpoint-wise.
 */
export interface TmwLearnerExplanationV2 {
  method: string;
  solution: string[];
  answer: string;
  shortcut?: TmwLearnerExplanationShortcut;
  commonMistake?: TmwLearnerExplanationCommonMistake;
}

export function validateTmwLearnerExplanationV2(value: TmwLearnerExplanationV2): string[] {
  const errors: string[] = [];
  if (!value.method.trim()) errors.push("Method is empty");
  if (value.solution.length < 2 || value.solution.length > 5) errors.push("Solution must contain 2-5 connected steps");
  if (value.solution.some((step) => !step.trim())) errors.push("Solution contains an empty step");
  if (!value.answer.trim()) errors.push("Answer is empty");
  if (value.shortcut && (!value.shortcut.title.trim() || value.shortcut.steps.length === 0)) errors.push("Shortcut is incomplete");
  if (value.commonMistake && !value.commonMistake.explanation.trim()) errors.push("Common Mistake is incomplete");
  return errors;
}

/**
 * Compatibility projector used while the legacy seven-field explanations are
 * migrated. It deliberately caps visible working at five lines and does not
 * make Shortcut/Common Mistake mandatory.
 */
export function projectLegacyTmwExplanationToV2(question: any): TmwLearnerExplanationV2 {
  const explanation = question.explanation ?? {};
  const rawSteps: string[] = Array.isArray(explanation.steps) ? explanation.steps : [];
  const solution = rawSteps.length <= 5
    ? rawSteps
    : [rawSteps[0], ...rawSteps.slice(1, 4), rawSteps[rawSteps.length - 1]];
  const projected: TmwLearnerExplanationV2 = {
    method: String(explanation.opening ?? "").trim(),
    solution,
    answer: String(explanation.conclusion ?? question.solution?.answerText ?? "").trim(),
  };
  if (explanation.shortcut?.title && Array.isArray(explanation.shortcut.steps) && explanation.shortcut.steps.length) {
    projected.shortcut = {
      title: explanation.shortcut.title,
      steps: explanation.shortcut.steps,
    };
  }
  if (explanation.commonTrap?.explanation) {
    projected.commonMistake = {
      optionLabel: explanation.commonTrap.optionLabel,
      optionText: explanation.commonTrap.optionText,
      explanation: explanation.commonTrap.explanation,
    };
  }
  return projected;
}
