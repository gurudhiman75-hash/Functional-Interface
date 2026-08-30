import { validatePrt001Solution } from "./validator";
import { equalPrt001TaskAnswers } from "./task-solver";
import type {
  Prt001IndependentVerification,
  Prt001PilotParameters,
  Prt001QuestionPackage,
  Prt001Solution,
  Prt001TaskAnswer,
  Prt001ValidationCheck,
  Prt001ValidationResult,
} from "./types";

export function validatePrt001QuestionPackage(input: {
  package: Omit<Prt001QuestionPackage, "validation">;
  parameters: Prt001PilotParameters;
  solution: Prt001Solution;
  verification: Prt001IndependentVerification;
  taskAnswer: Prt001TaskAnswer;
  independentTaskAnswer: Prt001TaskAnswer;
}): Prt001ValidationResult {
  const foundation = validatePrt001Solution(input.solution, input.verification);
  const pkg = input.package;
  const checks: Prt001ValidationCheck[] = [
    ...foundation.checks,
    {
      name: "task-answer-parity",
      passed: equalPrt001TaskAnswers(
        input.taskAnswer,
        input.independentTaskAnswer,
      ),
      message: "canonical and independent task answers must match",
    },
    {
      name: "required-variables",
      passed: input.parameters.entry.requiredVariables.every(
        (variable) => input.parameters.renderVariables[variable] !== undefined,
      ),
      message: "every registry-required variable must be generated",
    },
    {
      name: "render-complete",
      passed: !/\{[^}]+\}/.test(pkg.stem),
      message: "rendered stem must not contain unresolved placeholders",
    },
    {
      name: "option-count",
      passed: pkg.options.length === 4,
      message: "question must have exactly four options",
    },
    {
      name: "option-uniqueness",
      passed: new Set(pkg.options).size === pkg.options.length,
      message: "displayed options must be unique",
    },
    {
      name: "single-correct-option",
      passed:
        pkg.options.filter((option) => option === pkg.answer).length === 1,
      message: "answer must appear exactly once among the options",
    },
    {
      name: "correct-index",
      passed:
        pkg.correctIndex >= 0 && pkg.options[pkg.correctIndex] === pkg.answer,
      message: "correctIndex must point to the displayed answer",
    },
    {
      name: "explanation",
      passed:
        pkg.explanation.lines.length >= 2 &&
        pkg.explanation.lines.every((line) => line.trim().length > 0),
      message: "explanation must contain complete non-empty steps",
    },
    {
      name: "reasoning-graph",
      passed:
        pkg.reasoningGraph.nodes.length >= 5 &&
        pkg.reasoningGraph.edges.length >= 4,
      message: "reasoning graph must connect givens through the final answer",
    },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}
