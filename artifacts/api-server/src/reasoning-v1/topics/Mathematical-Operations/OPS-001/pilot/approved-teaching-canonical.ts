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

const OPERATOR_PAIR = ["+", "−"] as const;

interface CompoundBlueprint {
  readonly expression: string;
  readonly numberPair: readonly [string, string];
  readonly transformed: string;
  readonly answer: string;
  readonly operatorOnly: string;
  readonly numberOnly: string;
  readonly unchanged: string;
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  const normalized = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(normalized), ...values.slice(0, normalized)];
}

function int(seed: number, salt: number, min: number, span: number): number {
  const mixed = (Math.imul((seed + 1) >>> 0, 1664525 + salt * 97) + 1013904223 + salt * 7919) >>> 0;
  return min + (mixed % span);
}

function compoundBlueprint(seed: number): CompoundBlueprint {
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const source = seed * 173 + attempt * 997;
    const divisor = int(source, 1, 2, 5);
    const multiplier = int(source, 2, 2, 7);
    const leftFactor = divisor * int(source, 3, 4, 15);
    let swappedFactor = divisor * int(source, 4, 2, 13);
    if (swappedFactor === leftFactor) swappedFactor += divisor;
    const tail = int(source, 5, 3, 18);
    const expression = `${leftFactor} × ${multiplier} + ${swappedFactor} ÷ ${divisor} − ${tail}`;
    const numberPair = [String(leftFactor), String(swappedFactor)] as const;
    const afterOperators = swapOperatorPairs(expression, [OPERATOR_PAIR]);
    const transformed = swapWholeNumbers(afterOperators, numberPair[0], numberPair[1]);
    const operatorOnlyExpression = afterOperators;
    const numberOnlyExpression = swapWholeNumbers(expression, numberPair[0], numberPair[1]);

    const answer = arithmeticTrace(transformed).value;
    const operatorOnly = arithmeticTrace(operatorOnlyExpression).value;
    const numberOnly = arithmeticTrace(numberOnlyExpression).value;
    const unchanged = arithmeticTrace(expression).value;
    const values = [answer, operatorOnly, numberOnly, unchanged];
    if (new Set(values).size !== 4) continue;

    return {
      expression,
      numberPair,
      transformed,
      answer,
      operatorOnly,
      numberOnly,
      unchanged,
    };
  }
  throw new Error(`OPS compound generator could not produce four distinct misconception states for seed ${seed}.`);
}

function commonSteps(blueprint: CompoundBlueprint): readonly TeachingStep[] {
  return [
    {
      label: "Write both operator replacements",
      expression: `${OPERATOR_PAIR[0]} → ${OPERATOR_PAIR[1]}; ${OPERATOR_PAIR[1]} → ${OPERATOR_PAIR[0]}`,
      result: "Both operators occur in the original expression and are interchanged simultaneously.",
    },
    {
      label: "Write both complete-number replacements",
      expression: `${blueprint.numberPair[0]} → ${blueprint.numberPair[1]}; ${blueprint.numberPair[1]} → ${blueprint.numberPair[0]}`,
      result: "Only complete number tokens are exchanged; digits inside other numbers are unchanged.",
    },
    {
      label: "Apply both changes to the original expression",
      expression: blueprint.expression,
      result: blueprint.transformed,
    },
    ...arithmeticTrace(blueprint.transformed).steps,
  ];
}

function numericOptions(blueprint: CompoundBlueprint, seed: number): readonly OpsPilotOption[] {
  const values: OpsPilotOption[] = [
    { value: blueprint.answer, errorLabel: null },
    { value: blueprint.operatorOnly, errorLabel: "APPLIED_OPERATOR_SWAP_ONLY" },
    { value: blueprint.numberOnly, errorLabel: "APPLIED_NUMBER_SWAP_ONLY" },
    { value: blueprint.unchanged, errorLabel: "LEFT_EXPRESSION_UNCHANGED" },
  ];
  return rotate(values, seed);
}

function generate028(seed: number): ApprovedOpsQuestion {
  const blueprint = compoundBlueprint(seed);
  const options = numericOptions(blueprint, seed);
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  return {
    candidateId: "OPS-CAND-028",
    checkpointId: "OPS-CP-008",
    seed,
    locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE",
    solveMode: "evaluateAfterSpecifiedCompoundSwap",
    renderer: "STRUCTURED_TEXT",
    stem: `Interchange + and −, and interchange the complete numbers ${blueprint.numberPair[0]} and ${blueprint.numberPair[1]}, throughout ${blueprint.expression}. What is the resulting value?`,
    options,
    correctIndex,
    answer: blueprint.answer,
    explanation: {
      ruleStatement: "Apply the prescribed two-way operator interchange and complete-number interchange to the same original expression, then complete multiplication and division before addition and subtraction.",
      steps: commonSteps(blueprint),
      conclusion: `Therefore, the resulting value is ${blueprint.answer}.`,
    },
    proof: {
      unique: true,
      solverRoute: "CANONICAL_PRESCRIBED_OPERATOR_AND_WHOLE_NUMBER_TRANSFORMATION",
      eligibleCandidateCount: 1,
      survivingCandidateCount: 1,
      semanticFingerprint: `CANONICAL:OPS-CAND-028:${blueprint.transformed}:${blueprint.answer}`,
    },
    metadata: {
      teachingExplanationVersion: "V3_APPROVED",
      teachingTraceVerified: true,
      requestedSeed: seed,
      sourceSeed: seed,
      compoundSubtype: "OPERATOR_AND_WHOLE_NUMBER",
      bothOperatorsVisible: true,
      bothWholeNumbersVisible: true,
      misconceptionDistractors: true,
      generatedCompoundState: true,
      invalidRandomDigitSubtypeBypassed: true,
    },
  };
}

function generate029(seed: number): ApprovedOpsQuestion {
  const blueprint = compoundBlueprint(seed);
  const printedAnswer = `${blueprint.expression} = ${blueprint.answer}`;
  const rightSides = rotate([
    { value: blueprint.answer, errorLabel: null },
    { value: blueprint.operatorOnly, errorLabel: "APPLIED_OPERATOR_SWAP_ONLY" },
    { value: blueprint.numberOnly, errorLabel: "APPLIED_NUMBER_SWAP_ONLY" },
    { value: blueprint.unchanged, errorLabel: "LEFT_EXPRESSION_UNCHANGED" },
  ] as const, seed);
  const options: OpsPilotOption[] = rightSides.map((entry) => ({
    value: `${blueprint.expression} = ${entry.value}`,
    errorLabel: entry.errorLabel,
  }));
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  const transformedEquation = `${blueprint.transformed} = ${blueprint.answer}`;
  const relation = relationTrace(transformedEquation);
  const steps: TeachingStep[] = [
    ...commonSteps(blueprint),
    {
      label: "Compare the transformed value with the option right-hand sides",
      expression: transformedEquation,
      result: `The transformed equation is ${relation.truth ? "true" : "false"}; only the option ending in ${blueprint.answer} matches.`,
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
    stem: `After interchanging + with − and the complete numbers ${blueprint.numberPair[0]} with ${blueprint.numberPair[1]} in every option, select the true equation.`,
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
      solverRoute: "CANONICAL_PRESCRIBED_COMPOUND_OPTION_TRUTH",
      eligibleCandidateCount: 4,
      survivingCandidateCount: 1,
      semanticFingerprint: `CANONICAL:OPS-CAND-029:${transformedEquation}`,
    },
    metadata: {
      teachingExplanationVersion: "V3_APPROVED",
      teachingTraceVerified: true,
      requestedSeed: seed,
      sourceSeed: seed,
      compoundSubtype: "OPERATOR_AND_WHOLE_NUMBER",
      optionTopology: "EQUATION_OPTIONS",
      bothOperatorsVisible: true,
      bothWholeNumbersVisible: true,
      misconceptionDistractors: true,
      generatedCompoundState: true,
      invalidRandomDigitSubtypeBypassed: true,
    },
  };
}

export function generateApprovedOpsQuestion(candidateId: OpsApprovedCandidateId, seed: number): ApprovedOpsQuestion {
  if (!Number.isInteger(seed) || seed < 0) throw new Error(`Approved runtime seed must be a non-negative integer; received ${seed}.`);
  if (candidateId === "OPS-CAND-028") return generate028(seed);
  if (candidateId === "OPS-CAND-029") return generate029(seed);
  return generateEntryQuestion(candidateId, seed);
}
