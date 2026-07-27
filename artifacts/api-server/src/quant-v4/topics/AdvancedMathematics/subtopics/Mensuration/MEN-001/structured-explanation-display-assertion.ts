import {
  isMen001LatexEquation,
  toMen001LatexEquation,
} from "./structured-math-latex";
import type { Men001Explanation } from "./types";

const FOUR_TIER_HEADINGS = [
  "### 📌 Key Rule & Formula",
  "### 📝 Step-by-Step Solution",
  "### 💡 Exam Speed Shortcut",
  "### ⚠️ Common Traps",
] as const;

export function assertMen001StructuredExplanation(
  explanation: Men001Explanation,
  answer: string,
) {
  if (explanation.displayFormat !== "FOUR_TIER_COMPETITIVE_EXPLANATION") {
    throw new Error("MEN-001 explanation must use the exact four-tier competitive format.");
  }
  const first = explanation.sections[0];
  if (!first || first.kind !== "KEY_RULE" || first.title !== "Key Rule & Formula" || first.equations.length === 0) {
    throw new Error("MEN-001 explanation must begin with Key Rule & Formula.");
  }
  if (explanation.sections.some((section) => section.kind === "FINAL_ANSWER")) {
    throw new Error("MEN-001 must not expose a fifth Final Answer block; the result belongs inside the worked solution tier.");
  }

  for (const section of explanation.sections) {
    if (!section.equations.every(isMen001LatexEquation)) {
      throw new Error(`MEN-001 ${section.kind} equations must be MathJax-ready LaTeX.`);
    }
  }

  const steps = explanation.sections.filter((section) => section.kind === "STEP");
  if (steps.length === 0) {
    throw new Error("MEN-001 explanation must contain a step-by-step solution.");
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
  const lastStep = steps.at(-1)!;
  if (!lastStep.equations.includes(toMen001LatexEquation(answer))) {
    throw new Error("MEN-001 must place the canonical final answer inside the last worked step.");
  }

  const shortcuts = explanation.sections.filter((section) => section.kind === "EXAM_SHORTCUT");
  const traps = explanation.sections.filter((section) => section.kind === "COMMON_TRAPS");
  if (shortcuts.length !== 1 || shortcuts[0]!.paragraphs.length + shortcuts[0]!.equations.length === 0) {
    throw new Error("MEN-001 explanation must contain one non-empty Exam Speed Shortcut block.");
  }
  if (traps.length !== 1 || traps[0]!.paragraphs.length !== 3) {
    throw new Error("MEN-001 explanation must contain one Common Traps block covering all wrong options.");
  }
  const firstStepIndex = explanation.sections.findIndex((section) => section.kind === "STEP");
  const shortcutIndex = explanation.sections.findIndex((section) => section.kind === "EXAM_SHORTCUT");
  const trapIndex = explanation.sections.findIndex((section) => section.kind === "COMMON_TRAPS");
  if (!(firstStepIndex > 0 && shortcutIndex > firstStepIndex && trapIndex > shortcutIndex && trapIndex === explanation.sections.length - 1)) {
    throw new Error("MEN-001 explanation blocks are not in the exact four-tier order.");
  }

  if (explanation.lines.length !== FOUR_TIER_HEADINGS.length) {
    throw new Error("MEN-001 compatibility explanation must expose exactly four learner-facing blocks.");
  }
  FOUR_TIER_HEADINGS.forEach((heading, index) => {
    if (!explanation.lines[index]?.startsWith(heading)) {
      throw new Error(`MEN-001 compatibility block ${index + 1} must begin with ${heading}.`);
    }
  });
  if (explanation.lines.some((line) => /Final Answer/i.test(line))) {
    throw new Error("MEN-001 compatibility output must not retain a separate Final Answer heading.");
  }
}
