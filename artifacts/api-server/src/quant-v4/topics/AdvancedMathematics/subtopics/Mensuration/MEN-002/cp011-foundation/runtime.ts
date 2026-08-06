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

function addLearnerDelimiterValidation(
  question: MenCp011ExamReadyPackage,
  learnerSolution: MenCp011LearnerSolution,
): MenCp011ExamReadyPackage["validation"] {
  const checks = question.validation.checks.filter(
    (check) => check.name !== "learner TeX delimiter composition",
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
