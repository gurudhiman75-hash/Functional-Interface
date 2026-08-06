import {
  classifyMenCp011Difficulty,
  generateMenCp011FoundationPrototype as generateExpandedMenCp011FoundationPrototype,
  type MenCp011StateExpandedPackage,
} from "./runtime-state-expansion";
import type {
  MenCp011ExamReadyPackage,
  MenCp011LearnerSolution,
} from "./runtime-exam-readiness";
import type { MenCp011PrototypeId } from "./types";

const DIAGNOSTIC_TEX_COMMANDS = new Set([
  "pi",
  "frac",
  "text",
  "times",
  "div",
  "quad",
  "qquad",
  "sqrt",
  "cdot",
  "left",
  "right",
]);

function normalizeNestedAnswerDelimiter(text: string) {
  return text.replace(/=\$([^$]+)\$\$$/, "=$1$");
}

function normalizeLearnerSolution(
  solution: MenCp011LearnerSolution,
): MenCp011LearnerSolution {
  return {
    ...solution,
    formula: normalizeNestedAnswerDelimiter(solution.formula),
    steps: solution.steps.map(normalizeNestedAnswerDelimiter),
    finalAnswer: normalizeNestedAnswerDelimiter(solution.finalAnswer),
    shortcut: normalizeNestedAnswerDelimiter(solution.shortcut),
    wrongOptionAnalysis: solution.wrongOptionAnalysis.map(normalizeNestedAnswerDelimiter),
  };
}

function learnerDelimitersAreValid(solution: MenCp011LearnerSolution) {
  const values = [
    solution.formula,
    ...solution.steps,
    solution.finalAnswer,
    solution.shortcut,
    ...solution.wrongOptionAnalysis,
  ];
  return values.every((value) =>
    !/=\$[^$]+\$\$$/.test(value) &&
    (value.match(/\$/g) ?? []).length % 2 === 0,
  );
}

function visibleTextFields(
  question: MenCp011ExamReadyPackage,
  learnerSolution: MenCp011LearnerSolution,
) {
  return [
    ["stem", question.stem],
    ...question.options.map((option, index) => [
      `option-${index + 1}`,
      option.display,
    ] as const),
    ["key-rule", question.explanation.keyRule],
    ...question.explanation.steps.flatMap((step, index) => [
      [`step-${index + 1}-title`, step.title] as const,
      [`step-${index + 1}-body`, step.body] as const,
      [`step-${index + 1}-equation`, step.equation ?? ""] as const,
    ]),
    ["admin-shortcut", question.explanation.shortcut],
    ...question.explanation.traps.map((trap, index) => [
      `trap-${index + 1}`,
      trap,
    ] as const),
    ["learner-formula", learnerSolution.formula],
    ...learnerSolution.steps.map((step, index) => [
      `learner-step-${index + 1}`,
      step,
    ] as const),
    ["learner-answer", learnerSolution.finalAnswer],
    ["learner-shortcut", learnerSolution.shortcut],
    ...learnerSolution.wrongOptionAnalysis.map((text, index) => [
      `learner-wrong-${index + 1}`,
      text,
    ] as const),
  ] as const;
}

function texDiagnostics(
  question: MenCp011ExamReadyPackage,
  learnerSolution: MenCp011LearnerSolution,
) {
  const failures: string[] = [];
  for (const [field, text] of visibleTextFields(question, learnerSolution)) {
    const dollarCount = (text.match(/\$/g) ?? []).length;
    const commands = [...text.matchAll(/\\([A-Za-z]+)/g)].map(
      (match) => match[1]!,
    );
    const unsupported = [...new Set(
      commands.filter((command) => !DIAGNOSTIC_TEX_COMMANDS.has(command)),
    )];
    if (text.includes("\\pih") || dollarCount % 2 !== 0 || unsupported.length > 0) {
      failures.push(
        `${field}{dollars=${dollarCount};unsupported=${unsupported.join(",") || "none"};pih=${text.includes("\\pih")}}`,
      );
    }
  }
  return failures.length === 0 ? "no field-level failure found" : failures.join(" | ");
}

function addLearnerDelimiterValidation(
  question: MenCp011ExamReadyPackage,
  learnerSolution: MenCp011LearnerSolution,
): MenCp011ExamReadyPackage["validation"] {
  const checks = question.validation.checks
    .filter((check) => check.name !== "learner TeX delimiter composition")
    .map((check) =>
      check.name === "visible TeX lint" && !check.passed
        ? {
            ...check,
            message: `${check.message} Diagnostics: ${texDiagnostics(question, learnerSolution)}`,
          }
        : check,
    );
  checks.push({
    name: "learner TeX delimiter composition",
    passed: learnerDelimitersAreValid(learnerSolution),
    message: "A learner calculation may interpolate an answer inside one MathJax span only; nested answer delimiters such as =$784…$$ are forbidden.",
  });
  return {
    valid: checks.every((check) => check.passed),
    checks,
  };
}

export function generateMenCp011FoundationPrototype(
  prototypeId: MenCp011PrototypeId,
  seed: string,
): MenCp011StateExpandedPackage {
  const generated = generateExpandedMenCp011FoundationPrototype(prototypeId, seed);
  const learnerSolution = normalizeLearnerSolution(generated.learnerSolution);
  return {
    ...generated,
    learnerSolution,
    validation: addLearnerDelimiterValidation(generated, learnerSolution),
    renderSurfaces: {
      ...generated.renderSurfaces,
      solution: {
        ...generated.renderSurfaces.solution,
        explanation: learnerSolution,
      },
    },
  };
}

export { classifyMenCp011Difficulty };
export type { MenCp011StateExpandedPackage } from "./runtime-state-expansion";
export type {
  MenCp011DiagramRole,
  MenCp011ExamReadyPackage,
  MenCp011LearnerSolution,
  MenCp011RenderSurfaces,
} from "./runtime-exam-readiness";
