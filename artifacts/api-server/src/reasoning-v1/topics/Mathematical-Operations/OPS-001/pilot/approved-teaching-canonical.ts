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

const EXPRESSION = "16 × 4 + 12 ÷ 4 − 15";
const OPERATOR_PAIR = ["+", "−"] as const;
const NUMBER_PAIR = ["16", "12"] as const;
const AFTER_OPERATORS = swapOperatorPairs(EXPRESSION, [OPERATOR_PAIR]);
const TRANSFORMED = swapWholeNumbers(AFTER_OPERATORS, NUMBER_PAIR[0], NUMBER_PAIR[1]);
const TRACE = arithmeticTrace(TRANSFORMED);
const ANSWER = TRACE.value;

function rotate<T>(values: readonly T[], offset: number): T[] {
  const normalized = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(normalized), ...values.slice(0, normalized)];
}

function commonSteps(): readonly TeachingStep[] {
  return [
    {
      label: "Write both operator replacements",
      expression: `${OPERATOR_PAIR[0]} → ${OPERATOR_PAIR[1]}; ${OPERATOR_PAIR[1]} → ${OPERATOR_PAIR[0]}`,
      result: "Both operators occur in the original expression and are interchanged simultaneously.",
    },
    {
      label: "Write both complete-number replacements",
      expression: `${NUMBER_PAIR[0]} → ${NUMBER_PAIR[1]}; ${NUMBER_PAIR[1]} → ${NUMBER_PAIR[0]}`,
      result: "Only complete number tokens are exchanged; digits inside other numbers are unchanged.",
    },
    {
      label: "Apply both changes to the original expression",
      expression: EXPRESSION,
      result: TRANSFORMED,
    },
    ...TRACE.steps,
  ];
}

function numericOptions(seed: number): readonly OpsPilotOption[] {
  const values = rotate([ANSWER, "55", "57", "62"], seed);
  return values.map((value) => ({ value, errorLabel: value === ANSWER ? null : "COMPOUND_TRANSFORMATION_ERROR" }));
}

function generate028(seed: number): ApprovedOpsQuestion {
  const options = numericOptions(seed);
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  return {
    candidateId: "OPS-CAND-028",
    checkpointId: "OPS-CP-008",
    seed,
    locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE",
    solveMode: "evaluateAfterSpecifiedCompoundSwap",
    renderer: "STRUCTURED_TEXT",
    stem: `Interchange + and −, and interchange the complete numbers 16 and 12, throughout ${EXPRESSION}. What is the resulting value?`,
    options,
    correctIndex,
    answer: ANSWER,
    explanation: {
      ruleStatement: "Apply the prescribed two-way operator interchange and complete-number interchange to the same original expression, then complete multiplication and division before addition and subtraction.",
      steps: commonSteps(),
      conclusion: `Therefore, the resulting value is ${ANSWER}.`,
    },
    proof: {
      unique: true,
      solverRoute: "CANONICAL_PRESCRIBED_OPERATOR_AND_WHOLE_NUMBER_TRANSFORMATION",
      eligibleCandidateCount: 1,
      survivingCandidateCount: 1,
      semanticFingerprint: `CANONICAL:OPS-CAND-028:${TRANSFORMED}:${ANSWER}`,
    },
    metadata: {
      teachingExplanationVersion: "V3_APPROVED",
      teachingTraceVerified: true,
      requestedSeed: seed,
      sourceSeed: seed,
      compoundSubtype: "OPERATOR_AND_WHOLE_NUMBER",
      bothOperatorsVisible: true,
      bothWholeNumbersVisible: true,
      invalidRandomDigitSubtypeBypassed: true,
    },
  };
}

function generate029(seed: number): ApprovedOpsQuestion {
  const printedAnswer = `${EXPRESSION} = ${ANSWER}`;
  const rightSides = rotate([ANSWER, "55", "57", "62"], seed);
  const options: OpsPilotOption[] = rightSides.map((right) => ({
    value: `${EXPRESSION} = ${right}`,
    errorLabel: right === ANSWER ? null : "COMPOUND_OPTION_TRUTH_ERROR",
  }));
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  const transformedEquation = `${TRANSFORMED} = ${ANSWER}`;
  const relation = relationTrace(transformedEquation);
  const steps: TeachingStep[] = [
    ...commonSteps(),
    {
      label: "Compare the transformed value with the option right-hand sides",
      expression: `${TRANSFORMED} = ${ANSWER}`,
      result: `The transformed equation is ${relation.truth ? "true" : "false"}; only the option ending in ${ANSWER} matches.`,
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
    stem: `After interchanging + with − and the complete numbers 16 with 12 in every option, select the true equation.`,
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
