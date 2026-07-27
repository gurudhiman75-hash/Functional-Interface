import {
  isMen001LatexEquation,
  toMen001LatexEquation,
} from "./structured-math-latex";
import type { Men001Explanation } from "./types";

export function assertMen001StructuredExplanation(
  explanation: Men001Explanation,
  answer: string,
) {
  if (explanation.displayFormat !== "KEY_RULE_STEPS_FINAL_ANSWER") {
    throw new Error("MEN-001 explanation must use the structured worked format.");
  }
  const first = explanation.sections[0];
  const last = explanation.sections.at(-1);
  if (!first || first.kind !== "KEY_RULE" || first.equations.length === 0) {
    throw new Error("MEN-001 explanation must begin with a Key Rule and formula.");
  }
  if (
    !last ||
    last.kind !== "FINAL_ANSWER" ||
    !last.equations.includes(toMen001LatexEquation(answer))
  ) {
    throw new Error("MEN-001 explanation must end with the canonical LaTeX final answer.");
  }

  for (const section of explanation.sections) {
    if (!section.equations.every(isMen001LatexEquation)) {
      throw new Error(`MEN-001 ${section.kind} equations must be MathJax-ready LaTeX.`);
    }
  }

  const steps = explanation.sections.filter((section) => section.kind === "STEP");
  if (steps.length === 0) {
    throw new Error("MEN-001 explanation must contain at least one worked step.");
  }
  steps.forEach((step, index) => {
    if (step.stepNumber !== index + 1 || !step.title.trim()) {
      throw new Error("MEN-001 explanation steps must be sequential and titled.");
    }
    if (step.paragraphs.length === 0 && step.equations.length === 0) {
      throw new Error("MEN-001 explanation steps cannot be empty.");
    }
    if (index > 0 && step.title === steps[index - 1]!.title) {
      throw new Error("MEN-001 adjacent explanation steps must use distinct titles.");
    }
  });
}
