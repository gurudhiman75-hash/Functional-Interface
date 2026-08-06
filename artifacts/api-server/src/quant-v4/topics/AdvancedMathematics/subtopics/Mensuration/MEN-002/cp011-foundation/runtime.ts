import {
  classifyMenCp011Difficulty,
  generateMenCp011FoundationPrototype as generateUnitRepresentedMenCp011FoundationPrototype,
  type MenCp011UnitRepresentationPackage,
} from "./runtime-unit-representations";
import type { MenCp011LearnerSolution } from "./runtime-exam-readiness";
import type {
  MenCp011Explanation,
  MenCp011PrototypeId,
} from "./types";

const ALLOWED_VISIBLE_TEX_COMMANDS = new Set([
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

function repairMalformedTex(text: string) {
  return text.replace(/\\pih\b/g, "\\pi h");
}

function normalizeNestedAnswerDelimiter(text: string) {
  return repairMalformedTex(text).replace(/=\$([^$]+)\$\$$/, "=$1$");
}

function repairExplanation(
  explanation: MenCp011Explanation,
): MenCp011Explanation {
  return {
    keyRule: repairMalformedTex(explanation.keyRule),
    steps: explanation.steps.map((step) => ({
      ...step,
      title: repairMalformedTex(step.title),
      body: repairMalformedTex(step.body),
      equation: step.equation
        ? repairMalformedTex(step.equation)
        : undefined,
    })),
    shortcut: repairMalformedTex(explanation.shortcut),
    traps: explanation.traps.map(repairMalformedTex),
  };
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
    wrongOptionAnalysis: solution.wrongOptionAnalysis.map(
      normalizeNestedAnswerDelimiter,
    ),
  };
}

function visibleTextValues(
  question: MenCp011UnitRepresentationPackage,
  explanation: MenCp011Explanation,
  learnerSolution: MenCp011LearnerSolution,
) {
  return [
    question.stem,
    ...question.options.map((option) => option.display),
    explanation.keyRule,
    ...explanation.steps.flatMap((step) => [
      step.title,
      step.body,
      step.equation ?? "",
    ]),
    explanation.shortcut,
    ...explanation.traps,
    learnerSolution.formula,
    ...learnerSolution.steps,
    learnerSolution.finalAnswer,
    learnerSolution.shortcut,
    ...learnerSolution.wrongOptionAnalysis,
  ];
}

function visibleTexIsValid(
  question: MenCp011UnitRepresentationPackage,
  explanation: MenCp011Explanation,
  learnerSolution: MenCp011LearnerSolution,
) {
  return visibleTextValues(question, explanation, learnerSolution).every((text) => {
    if (text.includes("\\pih")) return false;
    if ((text.match(/\$/g) ?? []).length % 2 !== 0) return false;
    const commands = [...text.matchAll(/\\([A-Za-z]+)/g)].map(
      (match) => match[1]!,
    );
    return commands.every((command) =>
      ALLOWED_VISIBLE_TEX_COMMANDS.has(command),
    );
  });
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
    !value.includes("\\pih") &&
    (value.match(/\$/g) ?? []).length % 2 === 0,
  );
}

function rebuildFinalValidation(
  question: MenCp011UnitRepresentationPackage,
  explanation: MenCp011Explanation,
  learnerSolution: MenCp011LearnerSolution,
): MenCp011UnitRepresentationPackage["validation"] {
  const texValid = visibleTexIsValid(
    question,
    explanation,
    learnerSolution,
  );
  const checks = question.validation.checks
    .filter((check) => check.name !== "learner TeX delimiter composition")
    .map((check) =>
      check.name === "visible TeX lint"
        ? {
            ...check,
            passed: texValid,
            message: "Final learner and admin text must use supported TeX, balanced delimiters and a separated \\pi h product; the malformed command \\pih is forbidden.",
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
): MenCp011UnitRepresentationPackage {
  const generated = generateUnitRepresentedMenCp011FoundationPrototype(
    prototypeId,
    seed,
  );
  const explanation = repairExplanation(generated.explanation);
  const learnerSolution = normalizeLearnerSolution(
    generated.learnerSolution,
  );
  const withTextRepairs: MenCp011UnitRepresentationPackage = {
    ...generated,
    explanation,
    learnerSolution,
    renderSurfaces: {
      ...generated.renderSurfaces,
      solution: {
        ...generated.renderSurfaces.solution,
        explanation: learnerSolution,
      },
      admin: {
        ...generated.renderSurfaces.admin,
        explanation,
      },
    },
  };
  return {
    ...withTextRepairs,
    validation: rebuildFinalValidation(
      withTextRepairs,
      explanation,
      learnerSolution,
    ),
  };
}

export { classifyMenCp011Difficulty };
export type {
  MenCp011MeasuredState,
  MenCp011UnitRepresentationPackage,
} from "./runtime-unit-representations";
export type {
  MenCp011DiagramRole,
  MenCp011ExamReadyPackage,
  MenCp011LearnerSolution,
  MenCp011RenderSurfaces,
} from "./runtime-exam-readiness";
