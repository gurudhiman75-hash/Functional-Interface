import {
  OPS_APPROVED_CANDIDATE_IDS,
  generateApprovedOpsQuestion as generateEntryQuestion,
  type ApprovedOpsQuestion,
  type OpsApprovedCandidateId,
} from "./approved-teaching-entry";
import {
  arithmeticTrace,
  relationTrace,
  swapOperatorPairs,
  swapWholeNumbers,
  type TeachingStep,
} from "./approved-teaching-helpers";
import type { OpsPilotOption } from "./representative-pilots";

export { OPS_APPROVED_CANDIDATE_IDS };
export type { ApprovedOpsQuestion, OpsApprovedCandidateId };

const OPERATOR_PAIRS = [
  ["+", "−"],
  ["+", "×"],
  ["+", "÷"],
  ["−", "×"],
  ["−", "÷"],
  ["×", "÷"],
] as const;

type OperatorPair = (typeof OPERATOR_PAIRS)[number];

type CompoundInstance = {
  readonly expression: string;
  readonly operatorPair: OperatorPair;
  readonly numberPair: readonly [string, string];
  readonly operatorOnlyExpression: string;
  readonly numberOnlyExpression: string;
  readonly transformedExpression: string;
  readonly originalAnswer: string;
  readonly operatorOnlyAnswer: string;
  readonly numberOnlyAnswer: string;
  readonly answer: string;
  readonly sourceSeed: number;
};

function rotate<T>(values: readonly T[], offset: number): T[] {
  const normalized = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(normalized), ...values.slice(0, normalized)];
}

function mixed(seed: number, salt: number): number {
  let value = (seed ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x85ebca6b) >>> 0;
  value ^= value >>> 13;
  value = Math.imul(value, 0xc2b2ae35) >>> 0;
  value ^= value >>> 16;
  return value >>> 0;
}

function int(seed: number, salt: number, minimum: number, maximum: number): number {
  return minimum + (mixed(seed, salt) % (maximum - minimum + 1));
}

function integerAnswer(expression: string): string | null {
  try {
    const value = arithmeticTrace(expression).value;
    if (!/^-?\d+$/u.test(value)) return null;
    const numeric = Number(value);
    if (!Number.isSafeInteger(numeric) || Math.abs(numeric) > 5000) return null;
    return value;
  } catch {
    return null;
  }
}

function buildCompoundInstance(seed: number): CompoundInstance {
  for (let attempt = 0; attempt < 4000; attempt += 1) {
    const sourceSeed = (seed * 1009 + attempt * 9176 + 37) >>> 0;
    const a = int(sourceSeed, 1, 6, 28);
    const b = int(sourceSeed, 2, 2, 12);
    const c = int(sourceSeed, 3, 6, 28);
    const d = int(sourceSeed, 4, 2, 12);
    const e = int(sourceSeed, 5, 2, 20);
    if (new Set([a, b, c, d, e]).size !== 5) continue;

    const operatorPair = OPERATOR_PAIRS[int(sourceSeed, 6, 0, OPERATOR_PAIRS.length - 1)]!;
    const numberPair = [String(a), String(c)] as const;
    const expression = `${a} × ${b} + ${c} ÷ ${d} − ${e}`;
    const operatorOnlyExpression = swapOperatorPairs(expression, [operatorPair]);
    const numberOnlyExpression = swapWholeNumbers(expression, numberPair[0], numberPair[1]);
    const transformedExpression = swapWholeNumbers(
      operatorOnlyExpression,
      numberPair[0],
      numberPair[1],
    );

    const originalAnswer = integerAnswer(expression);
    const operatorOnlyAnswer = integerAnswer(operatorOnlyExpression);
    const numberOnlyAnswer = integerAnswer(numberOnlyExpression);
    const answer = integerAnswer(transformedExpression);
    if (!originalAnswer || !operatorOnlyAnswer || !numberOnlyAnswer || !answer) continue;

    const answerStates = [answer, operatorOnlyAnswer, numberOnlyAnswer, originalAnswer];
    if (new Set(answerStates).size !== answerStates.length) continue;

    return {
      expression,
      operatorPair,
      numberPair,
      operatorOnlyExpression,
      numberOnlyExpression,
      transformedExpression,
      originalAnswer,
      operatorOnlyAnswer,
      numberOnlyAnswer,
      answer,
      sourceSeed,
    };
  }
  throw new Error(`OPS compound runtime could not build a safe misconception-separated instance for seed ${seed}.`);
}

function commonSteps(instance: CompoundInstance): readonly TeachingStep[] {
  return [
    {
      label: "Write both operator replacements",
      expression: `${instance.operatorPair[0]} → ${instance.operatorPair[1]}; ${instance.operatorPair[1]} → ${instance.operatorPair[0]}`,
      result: "Both operators occur in the original expression and are interchanged simultaneously.",
    },
    {
      label: "Write both complete-number replacements",
      expression: `${instance.numberPair[0]} → ${instance.numberPair[1]}; ${instance.numberPair[1]} → ${instance.numberPair[0]}`,
      result: "Only complete number tokens are exchanged; digits inside other numbers are unchanged.",
    },
    {
      label: "Apply both changes to the original expression",
      expression: instance.expression,
      result: instance.transformedExpression,
    },
    ...arithmeticTrace(instance.transformedExpression).steps,
  ];
}

function numericOptions(instance: CompoundInstance, seed: number): readonly OpsPilotOption[] {
  const values: readonly OpsPilotOption[] = [
    { value: instance.answer, errorLabel: null },
    { value: instance.operatorOnlyAnswer, errorLabel: "APPLIED_OPERATOR_SWAP_ONLY" },
    { value: instance.numberOnlyAnswer, errorLabel: "APPLIED_NUMBER_SWAP_ONLY" },
    { value: instance.originalAnswer, errorLabel: "IGNORED_BOTH_INTERCHANGES" },
  ];
  return rotate(values, seed);
}

function generate028(seed: number): ApprovedOpsQuestion {
  const instance = buildCompoundInstance(seed);
  const options = numericOptions(instance, seed);
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  return {
    candidateId: "OPS-CAND-028",
    checkpointId: "OPS-CP-008",
    seed,
    locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE",
    solveMode: "evaluateAfterSpecifiedCompoundSwap",
    renderer: "STRUCTURED_TEXT",
    stem: `Interchange ${instance.operatorPair[0]} and ${instance.operatorPair[1]}, and interchange the complete numbers ${instance.numberPair[0]} and ${instance.numberPair[1]}, throughout ${instance.expression}. What is the resulting value?`,
    options,
    correctIndex,
    answer: instance.answer,
    explanation: {
      ruleStatement: "Apply the prescribed two-way operator interchange and complete-number interchange to the same original expression, then complete multiplication and division before addition and subtraction.",
      steps: commonSteps(instance),
      conclusion: `Therefore, the resulting value is ${instance.answer}.`,
    },
    proof: {
      unique: true,
      solverRoute: "GENERATED_PRESCRIBED_OPERATOR_AND_WHOLE_NUMBER_TRANSFORMATION",
      eligibleCandidateCount: 4,
      survivingCandidateCount: 1,
      semanticFingerprint: `OPS-CAND-028:${instance.operatorPair.join("<->")}:${instance.numberPair.join("<->")}:${instance.transformedExpression}:${instance.answer}`,
    },
    metadata: {
      teachingExplanationVersion: "V3_APPROVED",
      teachingTraceVerified: true,
      requestedSeed: seed,
      sourceSeed: instance.sourceSeed,
      compoundSubtype: "OPERATOR_AND_WHOLE_NUMBER",
      bothOperatorsVisible: true,
      bothWholeNumbersVisible: true,
      misconceptionDistractorsGrounded: true,
      distractorModelCount: 3,
      generatedCompoundState: true,
    },
  };
}

function generate029(seed: number): ApprovedOpsQuestion {
  const instance = buildCompoundInstance(seed);
  const printedAnswer = `${instance.expression} = ${instance.answer}`;
  const rightSides: readonly { value: string; errorLabel: string | null }[] = [
    { value: instance.answer, errorLabel: null },
    { value: instance.operatorOnlyAnswer, errorLabel: "APPLIED_OPERATOR_SWAP_ONLY" },
    { value: instance.numberOnlyAnswer, errorLabel: "APPLIED_NUMBER_SWAP_ONLY" },
    { value: instance.originalAnswer, errorLabel: "IGNORED_BOTH_INTERCHANGES" },
  ];
  const options: OpsPilotOption[] = rotate(rightSides, seed).map((entry) => ({
    value: `${instance.expression} = ${entry.value}`,
    errorLabel: entry.errorLabel,
  }));
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  const transformedEquation = `${instance.transformedExpression} = ${instance.answer}`;
  const relation = relationTrace(transformedEquation);
  const steps: TeachingStep[] = [
    ...commonSteps(instance),
    {
      label: "Compare the transformed value with the option right-hand sides",
      expression: transformedEquation,
      result: `The transformed equation is ${relation.truth ? "true" : "false"}; only the option ending in ${instance.answer} matches.`,
    },
  ];
  return {
    candidateId: "OPS-CAND-029",
    checkpointId: "OPS-CP-008",
    seed,
    locale: "en-IN",
    taskKind: "IDENTIFY_CORRECT_EQUATION_AFTER_INTERCHANGE",
    solveMode: "selectEquationByTruthAfterSpecifiedCompoundSwap",
    renderer: "TABLE_OR_GRID",
    stem: `After interchanging ${instance.operatorPair[0]} with ${instance.operatorPair[1]} and the complete numbers ${instance.numberPair[0]} with ${instance.numberPair[1]} in every option, select the true equation.`,
    options,
    correctIndex,
    answer: printedAnswer,
    explanation: {
      ruleStatement: "Apply the full prescribed operator-and-complete-number transformation independently to every printed equation, calculate the transformed left side and select the unique matching right-hand side.",
      steps,
      conclusion: `Hence, ${printedAnswer} is the correct printed option.`,
    },
    proof: {
      unique: true,
      solverRoute: "GENERATED_PRESCRIBED_COMPOUND_OPTION_TRUTH",
      eligibleCandidateCount: 4,
      survivingCandidateCount: 1,
      semanticFingerprint: `OPS-CAND-029:${instance.operatorPair.join("<->")}:${instance.numberPair.join("<->")}:${transformedEquation}`,
    },
    metadata: {
      teachingExplanationVersion: "V3_APPROVED",
      teachingTraceVerified: true,
      requestedSeed: seed,
      sourceSeed: instance.sourceSeed,
      compoundSubtype: "OPERATOR_AND_WHOLE_NUMBER",
      optionTopology: "EQUATION_OPTIONS",
      bothOperatorsVisible: true,
      bothWholeNumbersVisible: true,
      misconceptionDistractorsGrounded: true,
      distractorModelCount: 3,
      generatedCompoundState: true,
    },
  };
}

export function generateApprovedOpsQuestion(candidateId: OpsApprovedCandidateId, seed: number): ApprovedOpsQuestion {
  if (!Number.isInteger(seed) || seed < 0) throw new Error(`Approved runtime seed must be a non-negative integer; received ${seed}.`);
  if (candidateId === "OPS-CAND-028") return generate028(seed);
  if (candidateId === "OPS-CAND-029") return generate029(seed);
  return generateEntryQuestion(candidateId, seed);
}
