import type { Men001Explanation } from "./types";

function humanizeExpectedAnswer(value: string) {
  return value
    .trim()
    .replace(/^\$\$/, "")
    .replace(/\$\$$/, "")
    .replace(/\$/g, "")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\cdot/g, "×")
    .replace(/\\pi/g, "π")
    .replace(/\\,/g, "")
    .replace(/\\text\{([^{}]+)\}/g, "$1")
    .replace(/\^\{2\}/g, "²")
    .replace(/\\sqrt\{([^{}]+)\}/g, (_, radicand: string) =>
      radicand.length === 1 ? `√${radicand}` : `√(${radicand})`)
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2")
    .replace(/[{}]/g, "")
    .replace(/(√\d+|\d+(?:\.\d+)?)(m²|cm²|m|cm)\b/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

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
    !last.equations.includes(humanizeExpectedAnswer(answer))
  ) {
    throw new Error("MEN-001 explanation must end with the normalized canonical final answer.");
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
