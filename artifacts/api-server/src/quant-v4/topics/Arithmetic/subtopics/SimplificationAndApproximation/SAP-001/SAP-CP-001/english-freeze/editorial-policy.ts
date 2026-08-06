import { formatRational } from "../../../shared/exact-rational";
import { evaluateExact, type EvaluationTraceStep } from "../../../shared/exact-evaluator";
import { renderExpression } from "../../../shared/expression-renderer";
import type { SapCp001Wave02QuestionState } from "../wave02/types";
import type { SapCp001PrototypeId } from "../SAP-CP-001-ENGLISH-TEMPLATE-PROPOSAL";
import type {
  SapCp001DifficultyProfile,
  SapCp001EnglishDifficulty,
  SapCp001EnglishExplanation,
  SapCp001EnglishOption,
} from "./types";

interface OriginalExplanation {
  readonly coreConcept: string;
  readonly givenDataAndStrategy: string;
  readonly stepByStep: readonly string[];
  readonly examSpeedMethod: string;
  readonly commonTraps: readonly string[];
  readonly finalAnswer: string;
}

interface OriginalOption {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string | null;
  readonly analysis: string;
}

export interface EnglishStemInput {
  readonly prototypeId: SapCp001PrototypeId;
  readonly seed: number;
  readonly originalStem: string;
  readonly renderedExpression: string | null;
  readonly questionState: SapCp001Wave02QuestionState | null;
}

export interface EnglishStemResult {
  readonly stemTemplateId: string;
  readonly stem: string;
}

const INTERNAL_TERM_REPLACEMENTS: readonly [RegExp, string][] = Object.freeze([
  [/\bASTs?\b/gi, "expression structure"],
  [/\bRPN\b/gi, "independent calculation"],
  [/\bcanonical\b/gi, "correct"],
  [/\bverifier\b/gi, "independent check"],
  [/\bindependently evaluated\b/gi, "checked separately"],
  [/\bindependent evaluator\b/gi, "separate exact check"],
  [/\bprototype\b/gi, "question type"],
  [/\bfingerprint\b/gi, "mathematical pattern"],
  [/\bhidden state\b/gi, "given values"],
  [/AST-defined/gi, "correct"],
]);

export function sanitiseLearnerText(text: string): string {
  let output = text;
  for (const [pattern, replacement] of INTERNAL_TERM_REPLACEMENTS) {
    output = output.replace(pattern, replacement);
  }
  return output
    .replace(/\s+([,.;!?])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function choose<T>(seed: number, values: readonly T[]): readonly [T, number] {
  const index = (seed - 1) % values.length;
  return [values[index]!, index];
}

function directStem(seed: number, expression: string): EnglishStemResult {
  const [stem, index] = choose(seed, [
    `Simplify: ${expression}`,
    `Find the value of ${expression}.`,
    `Evaluate: ${expression}`,
    `What is the exact value of ${expression}?`,
  ] as const);
  return Object.freeze({ stemTemplateId: `DIRECT-${index + 1}`, stem });
}

function comparisonStem(seed: number, state: Extract<SapCp001Wave02QuestionState, { kind: "COMPARISON" }>): EnglishStemResult {
  const left = renderExpression(state.leftExpression);
  const right = renderExpression(state.rightExpression);
  const [stem, index] = choose(seed, [
    `Compare the values of Left = ${left} and Right = ${right}.`,
    `Which relation correctly compares Left = ${left} with Right = ${right}?`,
    `Evaluate both expressions and compare them: Left = ${left}; Right = ${right}.`,
    `Without changing the grouping, compare ${left} and ${right}.`,
  ] as const);
  return Object.freeze({ stemTemplateId: `COMPARISON-${index + 1}`, stem });
}

function equivalentGroupingStem(
  seed: number,
  state: Extract<SapCp001Wave02QuestionState, { kind: "EQUIVALENT_GROUPING" }>,
): EnglishStemResult {
  const source = renderExpression(state.sourceExpression);
  const [stem, index] = choose(seed, [
    `Which grouped expression is equivalent to ${source}?`,
    `Choose the expression that preserves the value of ${source}.`,
    `Which option shows the correct grouping of ${source}?`,
    `Select the bracketed form that is exactly equal to ${source}.`,
  ] as const);
  return Object.freeze({ stemTemplateId: `EQUIVALENT-GROUPING-${index + 1}`, stem });
}

function firstValidStepStem(
  seed: number,
  state: Extract<SapCp001Wave02QuestionState, { kind: "FIRST_VALID_STEP" }>,
): EnglishStemResult {
  const source = renderExpression(state.sourceExpression);
  const [stem, index] = choose(seed, [
    `Which of the following is a valid first step in simplifying ${source}?`,
    `What should be done first to simplify ${source}?`,
    `Choose the correct first simplification step for ${source}.`,
    `Which option correctly begins the solution of ${source}?`,
  ] as const);
  return Object.freeze({ stemTemplateId: `FIRST-VALID-STEP-${index + 1}`, stem });
}

function incorrectStepStem(
  seed: number,
  state: Extract<SapCp001Wave02QuestionState, { kind: "INCORRECT_CHAIN" }>,
): EnglishStemResult {
  const source = renderExpression(state.sourceExpression);
  const steps = state.chainExpressions
    .map((expression, index) => `Step ${index + 1}: ${renderExpression(expression)}`)
    .join("\n");
  const [stem, index] = choose(seed, [
    `A student simplifies ${source} as shown below:\n${steps}\nWhich is the first incorrect step?`,
    `Study the solution of ${source}:\n${steps}\nAt which step does the first error occur?`,
    `The following steps were used for ${source}:\n${steps}\nIdentify the earliest incorrect step.`,
    `Check the worked solution for ${source}:\n${steps}\nWhich step is incorrect first?`,
  ] as const);
  return Object.freeze({ stemTemplateId: `FIRST-INCORRECT-STEP-${index + 1}`, stem });
}

function partialEvaluationStem(
  seed: number,
  state: Extract<SapCp001Wave02QuestionState, { kind: "PARTIAL_EVALUATION" }>,
): EnglishStemResult {
  const source = renderExpression(state.sourceExpression);
  const subexpression = renderExpression(state.declaredSubexpression);
  const declaredValue = formatRational(evaluateExact(state.declaredSubexpression).value);
  const [stem, index] = choose(seed, [
    `In ${source}, use ${subexpression} = ${declaredValue}. Find the final value.`,
    `Evaluate ${source}, given that ${subexpression} = ${declaredValue}.`,
    `After replacing ${subexpression} by ${declaredValue} in ${source}, what value is obtained?`,
    `Complete the simplification of ${source}, using ${subexpression} = ${declaredValue}.`,
  ] as const);
  return Object.freeze({ stemTemplateId: `PARTIAL-EVALUATION-${index + 1}`, stem });
}

export function buildEnglishStem(input: EnglishStemInput): EnglishStemResult {
  if (input.questionState) {
    switch (input.questionState.kind) {
      case "COMPARISON":
        return comparisonStem(input.seed, input.questionState);
      case "EQUIVALENT_GROUPING":
        return equivalentGroupingStem(input.seed, input.questionState);
      case "FIRST_VALID_STEP":
        return firstValidStepStem(input.seed, input.questionState);
      case "INCORRECT_CHAIN":
        return incorrectStepStem(input.seed, input.questionState);
      case "PARTIAL_EVALUATION":
        return partialEvaluationStem(input.seed, input.questionState);
    }
  }
  if (!input.renderedExpression) {
    throw new Error(`No renderable English stem state exists for ${input.prototypeId}.`);
  }
  return directStem(input.seed, input.renderedExpression);
}

function splitOperands(input: string): readonly [string, string] | null {
  const parts = input.split(" | ");
  return parts.length === 2 ? [parts[0]!, parts[1]!] : null;
}

function learnerTraceStep(step: EvaluationTraceStep, index: number): string {
  const operands = splitOperands(step.input);
  const prefix = `Step ${index + 1}: `;
  switch (step.operation) {
    case "ADD":
      return operands
        ? `${prefix}Add ${operands[0]} and ${operands[1]} to get ${step.output}.`
        : `${prefix}Complete the addition to get ${step.output}.`;
    case "SUBTRACT":
      return operands
        ? `${prefix}Subtract ${operands[1]} from ${operands[0]} to get ${step.output}.`
        : `${prefix}Complete the subtraction to get ${step.output}.`;
    case "MULTIPLY":
    case "IMPLICIT_MULTIPLY":
      return operands
        ? `${prefix}Multiply ${operands[0]} by ${operands[1]} to get ${step.output}.`
        : `${prefix}Complete the multiplication to get ${step.output}.`;
    case "DIVIDE":
    case "FRACTION_BAR":
      return operands
        ? `${prefix}Divide ${operands[0]} by ${operands[1]} to get ${step.output}.`
        : `${prefix}Complete the division to get ${step.output}.`;
    case "OF":
      return operands
        ? `${prefix}Treat ‘of’ as multiplication: ${operands[0]} × ${operands[1]} = ${step.output}.`
        : `${prefix}Apply the visible ‘of’ multiplication to get ${step.output}.`;
    case "NEGATE":
      return `${prefix}Keep the negative sign with ${step.input}; this gives ${step.output}.`;
    case "POWER":
      return `${prefix}Evaluate the power ${step.input}; this gives ${step.output}.`;
    case "FACTORIAL":
      return `${prefix}Evaluate ${step.input}! to get ${step.output}.`;
    case "EXACT_ROOT":
      return operands
        ? `${prefix}Take the exact ${operands[0]}th root of ${operands[1]} to get ${step.output}.`
        : `${prefix}Evaluate the exact root to get ${step.output}.`;
    case "PERCENT_OF":
      return operands
        ? `${prefix}Find ${operands[0]} of ${operands[1]} to get ${step.output}.`
        : `${prefix}Evaluate the percentage-of block to get ${step.output}.`;
    default:
      return `${prefix}Complete the next valid operation to get ${step.output}.`;
  }
}

export function polishEnglishOptions(
  options: readonly OriginalOption[],
  answerSemantic: string,
): readonly SapCp001EnglishOption[] {
  return Object.freeze(options.map((option) => Object.freeze({
    value: option.value,
    isCorrect: option.isCorrect,
    misconceptionId: option.misconceptionId,
    analysis: option.isCorrect
      ? answerSemantic === "STEP_SELECTION"
        ? "This is the only option that satisfies the required step condition."
        : answerSemantic === "EXPRESSION_SELECTION"
          ? "This option preserves the exact value and every operator sign."
          : answerSemantic === "COMPARISON_CLASS"
            ? "This relation follows from evaluating both expressions exactly."
            : "This option follows the correct order of operations and gives the exact value."
      : sanitiseLearnerText(option.analysis),
  })));
}

function finalAnswerText(answerSemantic: string, canonicalAnswer: string): string {
  switch (answerSemantic) {
    case "COMPARISON_CLASS":
      return `Hence, ${canonicalAnswer}.`;
    case "EXPRESSION_SELECTION":
      return `The equivalent expression is ${canonicalAnswer}.`;
    case "STEP_SELECTION":
      return `The correct choice is ${canonicalAnswer}.`;
    default:
      return `Therefore, the exact value is ${canonicalAnswer}.`;
  }
}

export function buildEnglishExplanation(
  original: OriginalExplanation,
  taskDirection: string,
  answerSemantic: string,
  canonicalAnswer: string,
  canonicalTrace: readonly EvaluationTraceStep[],
  polishedOptions: readonly SapCp001EnglishOption[],
): SapCp001EnglishExplanation {
  const useTrace = taskDirection === "FORWARD" && canonicalTrace.length > 0;
  const selectedSteps = useTrace
    ? canonicalTrace.map(learnerTraceStep)
    : original.stepByStep.map(sanitiseLearnerText);
  const stepByStep = selectedSteps.length >= 2
    ? selectedSteps
    : [...selectedSteps, `The required answer is ${canonicalAnswer}.`];

  return Object.freeze({
    coreConcept: sanitiseLearnerText(original.coreConcept),
    givenDataAndStrategy: sanitiseLearnerText(original.givenDataAndStrategy),
    stepByStep: Object.freeze(stepByStep),
    examSpeedMethod: sanitiseLearnerText(original.examSpeedMethod),
    commonTraps: Object.freeze(polishedOptions
      .filter((option) => !option.isCorrect)
      .map((option) => option.analysis)),
    finalAnswer: finalAnswerText(answerSemantic, canonicalAnswer),
  });
}

interface BaseDifficultyProfile {
  readonly materialDecisionCount: number;
  readonly representationLoad: number;
  readonly signedArithmeticRisk: number;
  readonly diagnosticLoad: number;
}

const BASE_DIFFICULTY: Readonly<Record<SapCp001PrototypeId, BaseDifficultyProfile>> = Object.freeze({
  "SAP-CP001-PROT-FLAT-MIXED-OPERATIONS": { materialDecisionCount: 2, representationLoad: 0, signedArithmeticRisk: 1, diagnosticLoad: 0 },
  "SAP-CP001-PROT-MULTIPLY-DIVIDE-LEFT-TO-RIGHT": { materialDecisionCount: 1, representationLoad: 0, signedArithmeticRisk: 0, diagnosticLoad: 0 },
  "SAP-CP001-PROT-ADD-SUBTRACT-LEFT-TO-RIGHT": { materialDecisionCount: 1, representationLoad: 0, signedArithmeticRisk: 1, diagnosticLoad: 0 },
  "SAP-CP001-PROT-NESTED-GROUPING": { materialDecisionCount: 2, representationLoad: 2, signedArithmeticRisk: 1, diagnosticLoad: 0 },
  "SAP-CP001-PROT-SIGNED-ARITHMETIC": { materialDecisionCount: 2, representationLoad: 1, signedArithmeticRisk: 2, diagnosticLoad: 0 },
  "SAP-CP001-PROT-SCOPED-OF-MULTIPLICATION": { materialDecisionCount: 2, representationLoad: 2, signedArithmeticRisk: 0, diagnosticLoad: 0 },
  "SAP-CP001-PROT-POWER-BEFORE-ARITHMETIC": { materialDecisionCount: 2, representationLoad: 1, signedArithmeticRisk: 0, diagnosticLoad: 0 },
  "SAP-CP001-PROT-FACTORIAL-BEFORE-ARITHMETIC": { materialDecisionCount: 2, representationLoad: 1, signedArithmeticRisk: 0, diagnosticLoad: 0 },
  "SAP-CP001-PROT-COMPARE-DIFFERENT-GROUPINGS": { materialDecisionCount: 3, representationLoad: 2, signedArithmeticRisk: 1, diagnosticLoad: 1 },
  "SAP-CP001-PROT-SELECT-EQUIVALENT-GROUPING": { materialDecisionCount: 2, representationLoad: 3, signedArithmeticRisk: 1, diagnosticLoad: 1 },
  "SAP-CP001-PROT-IDENTIFY-FIRST-VALID-STEP": { materialDecisionCount: 3, representationLoad: 2, signedArithmeticRisk: 1, diagnosticLoad: 3 },
  "SAP-CP001-PROT-IDENTIFY-INCORRECT-PRECEDENCE-STEP": { materialDecisionCount: 4, representationLoad: 3, signedArithmeticRisk: 1, diagnosticLoad: 4 },
  "SAP-CP001-PROT-PARTIAL-SUBEXPRESSION-VALUE": { materialDecisionCount: 2, representationLoad: 2, signedArithmeticRisk: 1, diagnosticLoad: 1 },
  "SAP-CP001-PROT-VINCULUM-FRACTION-BAR-SCOPE": { materialDecisionCount: 3, representationLoad: 3, signedArithmeticRisk: 0, diagnosticLoad: 0 },
  "SAP-CP001-PROT-UNAMBIGUOUS-IMPLICIT-MULTIPLICATION": { materialDecisionCount: 2, representationLoad: 3, signedArithmeticRisk: 0, diagnosticLoad: 0 },
  "SAP-CP001-PROT-REPEATED-GROUPING": { materialDecisionCount: 2, representationLoad: 4, signedArithmeticRisk: 1, diagnosticLoad: 0 },
  "SAP-CP001-PROT-NEGATIVE-INTERMEDIATE": { materialDecisionCount: 3, representationLoad: 2, signedArithmeticRisk: 3, diagnosticLoad: 0 },
});

export function buildDifficultyProfile(
  prototypeId: SapCp001PrototypeId,
  difficulty: SapCp001EnglishDifficulty,
): SapCp001DifficultyProfile {
  const base = BASE_DIFFICULTY[prototypeId];
  const arithmeticLoad = difficulty === "EASY" ? 1 : difficulty === "MEDIUM" ? 2 : 3;
  return Object.freeze({
    ...base,
    arithmeticLoad,
    calibratedScore:
      base.materialDecisionCount
      + base.representationLoad
      + base.signedArithmeticRisk
      + base.diagnosticLoad
      + arithmeticLoad,
    calibrationScope: "WITHIN_SAP_CP001" as const,
  });
}

export function editorialReviewComments(prototypeId: SapCp001PrototypeId): readonly string[] {
  if (
    prototypeId === "SAP-CP001-PROT-NESTED-GROUPING"
    || prototypeId === "SAP-CP001-PROT-REPEATED-GROUPING"
  ) {
    return Object.freeze([
      "Approved as one learner-facing template family because both use nesting to determine scope.",
      "Repeated outer brackets remain a representation subtype rather than a separate permanent identity.",
    ]);
  }
  if (prototypeId === "SAP-CP001-PROT-SIGNED-ARITHMETIC") {
    return Object.freeze([
      "Retained separately because recognising a unary sign is a parse decision.",
      "It is not merged with negative-intermediate propagation, which tests sign carrying after an operation.",
    ]);
  }
  if (prototypeId === "SAP-CP001-PROT-NEGATIVE-INTERMEDIATE") {
    return Object.freeze([
      "Retained separately because the negative value is produced during evaluation and must be propagated.",
      "Its distractors and explanation route differ from a visible unary negative operand.",
    ]);
  }
  return Object.freeze([
    "Stem, explanation, distractor and difficulty evidence passed the English checkpoint review.",
    "Approved for the ID-free template proposal while publication and permanent allocation remain blocked.",
  ]);
}
