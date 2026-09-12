import {
  OPS_APPROVED_CANDIDATE_IDS,
  generateApprovedOpsQuestion as generateBaseApprovedQuestion,
  type ApprovedOpsQuestion,
  type OpsApprovedCandidateId,
} from "./approved-teaching-runtime";
import {
  arithmeticTrace,
  relationTrace,
  swapDigits,
  swapOperatorPairs,
  type TeachingStep,
} from "./approved-teaching-helpers";
import type { OpsPilotOption } from "./representative-pilots";

export { OPS_APPROVED_CANDIDATE_IDS };
export type { ApprovedOpsQuestion, OpsApprovedCandidateId };

const OPERATOR_PAIRS = [
  "+ ↔ −",
  "+ ↔ ×",
  "+ ↔ ÷",
  "− ↔ ×",
  "− ↔ ÷",
  "× ↔ ÷",
] as const;

const CANDIDATE_016_BLUEPRINTS = [
  { expression: "26 ÷ 18 + 2 × 21 − 12", answer: "+ ↔ ÷", result: "203" },
  { expression: "9 + 3 ÷ 9 − 30 × 20", answer: "− ↔ ÷", result: "6" },
  { expression: "16 × 5 + 9 ÷ 9 − 4", answer: "+ ↔ −", result: "83" },
  { expression: "9 − 8 ÷ 8 + 19 × 16", answer: "− ↔ ×", result: "12" },
  { expression: "14 × 10 − 27 ÷ 27 + 16", answer: "+ ↔ ×", result: "8" },
  { expression: "20 − 17 + 18 × 29 ÷ 18", answer: "+ ↔ −", result: "8" },
  { expression: "5 − 30 ÷ 5 × 25 + 19", answer: "× ↔ ÷", result: "18" },
  { expression: "27 + 27 ÷ 7 − 30 × 15", answer: "× ↔ ÷", result: "214" },
  { expression: "23 − 22 × 21 ÷ 12 + 4", answer: "+ ↔ ×", result: "8" },
  { expression: "21 + 6 × 9 ÷ 6 − 17", answer: "× ↔ ÷", result: "8" },
  { expression: "16 + 10 × 11 ÷ 10 − 9", answer: "+ ↔ −", result: "14" },
  { expression: "28 × 4 + 4 ÷ 15 − 5", answer: "× ↔ ÷", result: "62" },
  { expression: "7 + 21 ÷ 6 − 26 × 26", answer: "− ↔ ÷", result: "22" },
  { expression: "4 × 17 ÷ 16 + 22 − 11", answer: "− ↔ ÷", result: "54" },
  { expression: "11 − 22 × 24 + 23 ÷ 14", answer: "− ↔ ÷", result: "21" },
  { expression: "18 + 19 − 18 × 27 ÷ 18", answer: "× ↔ ÷", result: "25" },
  { expression: "11 ÷ 11 + 16 − 21 × 24", answer: "− ↔ ×", result: "313" },
  { expression: "22 × 4 + 16 ÷ 16 − 23", answer: "− ↔ ×", result: "41" },
  { expression: "16 ÷ 4 − 24 × 3 + 7", answer: "+ ↔ ×", result: "1" },
  { expression: "20 ÷ 13 × 3 − 3 + 11", answer: "− ↔ ÷", result: "18" },
] as const;

const CANDIDATE_027_BLUEPRINTS = [
  { equation: "15 ÷ 21 × 12 − 28 + 25 = 16", operator: "− ↔ ÷", digits: "1 ↔ 2" },
  { equation: "44 + 4 × 21 − 40 ÷ 3 = 205", operator: "+ ↔ ÷", digits: "3 ↔ 4" },
  { equation: "15 − 8 ÷ 16 × 3 + 36 = 11", operator: "× ↔ ÷", digits: "5 ↔ 6" },
  { equation: "2 − 33 ÷ 1 + 33 × 23 = 26", operator: "− ↔ ×", digits: "1 ↔ 6" },
  { equation: "35 − 12 + 5 ÷ 2 × 2 = 91", operator: "× ↔ ÷", digits: "2 ↔ 9" },
  { equation: "35 + 34 × 0 − 8 ÷ 34 = 24", operator: "− ↔ ÷", digits: "0 ↔ 4" },
  { equation: "8 × 3 + 15 − 14 ÷ 15 = 20", operator: "− ↔ ×", digits: "4 ↔ 5" },
  { equation: "25 − 32 ÷ 61 × 60 + 26 = 233", operator: "+ ↔ ×", digits: "1 ↔ 6" },
  { equation: "13 × 36 + 39 − 1 ÷ 1 = 14", operator: "− ↔ ×", digits: "1 ↔ 3" },
  { equation: "61 + 24 − 4 × 27 ÷ 3 = 603", operator: "− ↔ ×", digits: "1 ↔ 6" },
  { equation: "30 − 8 ÷ 3 × 64 + 3 = 42", operator: "+ ↔ ÷", digits: "2 ↔ 6" },
  { equation: "19 − 14 × 35 + 12 ÷ 2 = 247", operator: "− ↔ ×", digits: "4 ↔ 5" },
  { equation: "14 − 13 × 33 ÷ 6 + 10 = 122", operator: "+ ↔ ×", digits: "2 ↔ 6" },
  { equation: "15 + 24 ÷ 8 − 23 × 29 = 187", operator: "− ↔ ×", digits: "4 ↔ 8" },
  { equation: "11 − 26 + 5 × 14 ÷ 8 = 354", operator: "− ↔ ×", digits: "1 ↔ 2" },
  { equation: "34 × 44 ÷ 4 − 2 + 4 = 352", operator: "+ ↔ −", digits: "2 ↔ 4" },
  { equation: "8 + 21 × 24 − 35 ÷ 35 = 111", operator: "+ ↔ ×", digits: "4 ↔ 8" },
  { equation: "69 − 28 × 2 + 68 ÷ 3 = 19", operator: "+ ↔ −", digits: "1 ↔ 6" },
  { equation: "7 − 1 ÷ 23 × 28 + 3 = 83", operator: "+ ↔ ÷", digits: "1 ↔ 2" },
  { equation: "20 + 20 ÷ 25 × 32 − 34 = 19", operator: "+ ↔ −", digits: "0 ↔ 5" },
] as const;

function parsePair(source: string): readonly [string, string] {
  const match = source.match(/^(.+) ↔ (.+)$/u);
  if (!match) throw new Error(`Malformed curated interchange pair: ${source}`);
  return [match[1], match[2]];
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  const normalized = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(normalized), ...values.slice(0, normalized)];
}

function allDigitPairs(equation: string): readonly (readonly [string, string])[] {
  const digits = [...new Set(equation.match(/\d/gu) ?? [])].sort();
  const pairs: Array<readonly [string, string]> = [];
  for (let left = 0; left < digits.length; left += 1) {
    for (let right = left + 1; right < digits.length; right += 1) pairs.push([digits[left], digits[right]] as const);
  }
  return pairs;
}

function transformedRelationIsTrue(equation: string, operatorPair: readonly [string, string], digitPair?: readonly [string, string]): boolean {
  try {
    const afterOperator = swapOperatorPairs(equation, [operatorPair]);
    const transformed = digitPair ? swapDigits(afterOperator, digitPair[0], digitPair[1]) : afterOperator;
    return relationTrace(transformed).truth;
  } catch {
    return false;
  }
}

function generateCandidate016(seed: number): ApprovedOpsQuestion {
  const blueprint = CANDIDATE_016_BLUEPRINTS[seed % CANDIDATE_016_BLUEPRINTS.length];
  const equation = `${blueprint.expression} = ${blueprint.result}`;
  const answerPair = parsePair(blueprint.answer);
  const transformed = swapOperatorPairs(equation, [answerPair]);
  const relation = relationTrace(transformed);
  if (!relation.truth) throw new Error(`Curated OPS-CAND-016 blueprint is not true after ${blueprint.answer}: ${equation}`);

  const survivors = OPERATOR_PAIRS.filter((pairText) => transformedRelationIsTrue(equation, parsePair(pairText)));
  if (survivors.length !== 1 || survivors[0] !== blueprint.answer) {
    throw new Error(`Curated OPS-CAND-016 blueprint is not uniquely repaired: ${equation}; survivors ${survivors.join(", ")}`);
  }

  const distractorPool = OPERATOR_PAIRS.filter((pair) => pair !== blueprint.answer);
  const distractors = rotate(distractorPool, (seed * 3) % distractorPool.length).slice(0, 3);
  const optionValues = rotate([blueprint.answer, ...distractors], seed);
  const options: OpsPilotOption[] = optionValues.map((value) => ({ value, errorLabel: value === blueprint.answer ? null : "WRONG_OPERATOR_PAIR" }));
  const correctIndex = options.findIndex((option) => option.errorLabel === null);

  const leftTrace = arithmeticTrace(relation.left.expression);
  const rightTrace = arithmeticTrace(relation.right.expression);
  const steps: TeachingStep[] = [
    { label: "Apply the proposed interchange in both directions", expression: `${answerPair[0]} → ${answerPair[1]}; ${answerPair[1]} → ${answerPair[0]}`, result: "Both operators occur in the original equation, so this is a genuine two-way interchange." },
    { label: "Rebuild the complete equation", expression: equation, result: transformed },
    ...leftTrace.steps.map((step) => ({ ...step, label: `Left side: ${step.label}` })),
    ...(rightTrace.steps.length > 0 ? rightTrace.steps.map((step) => ({ ...step, label: `Right side: ${step.label}` })) : [{ label: "Right side: Read the value", expression: relation.right.expression, result: `Its value is ${rightTrace.value}.` }]),
    { label: "Compare both sides", expression: `${leftTrace.value} = ${rightTrace.value}`, result: "The transformed equation is true." },
    { label: "Establish uniqueness", expression: "All six basic operator pairs were tested, and every pair used two operators visible in the original equation.", result: `Only ${blueprint.answer} makes the equation true.` },
  ];

  return {
    candidateId: "OPS-CAND-016",
    checkpointId: "OPS-CP-005",
    seed,
    locale: "en-IN",
    taskKind: "IDENTIFY_OPERATOR_PAIR_TO_SWAP",
    solveMode: "identifySingleOperatorPairSwapForEquation",
    renderer: "TABLE_OR_GRID",
    stem: `Which pair of operators must be interchanged throughout ${equation} to make it correct?`,
    options,
    correctIndex,
    answer: blueprint.answer,
    explanation: {
      ruleStatement: "Test complete two-way operator interchanges only when both operators are visible in the original equation; rebuild the equation, apply ordinary precedence and retain the unique true result.",
      steps,
      conclusion: `Therefore, ${blueprint.answer} must be interchanged.`,
    },
    proof: { unique: true, solverRoute: "CURATED_ENUMERATE_ALL_VISIBLE_BASIC_OPERATOR_PAIRS", eligibleCandidateCount: OPERATOR_PAIRS.length, survivingCandidateCount: 1, semanticFingerprint: `CURATED:OPS-CAND-016:${seed}:${transformed}` },
    metadata: { teachingExplanationVersion: "V3_APPROVED", teachingTraceVerified: true, requestedSeed: seed, sourceSeed: seed % CANDIDATE_016_BLUEPRINTS.length, curatedAllFourOperatorsVisible: true, invalidOneWaySourceGeneratorBypassed: true },
  };
}

function generateCandidate027(seed: number): ApprovedOpsQuestion {
  const blueprint = CANDIDATE_027_BLUEPRINTS[seed % CANDIDATE_027_BLUEPRINTS.length];
  const operatorPair = parsePair(blueprint.operator);
  const digitPair = parsePair(blueprint.digits);
  const afterOperator = swapOperatorPairs(blueprint.equation, [operatorPair]);
  const transformed = swapDigits(afterOperator, digitPair[0], digitPair[1]);
  const relation = relationTrace(transformed);
  if (!relation.truth) throw new Error(`Curated OPS-CAND-027 blueprint is not true: ${blueprint.equation}`);

  const digitPairs = allDigitPairs(blueprint.equation);
  const survivors: string[] = [];
  for (const operatorText of OPERATOR_PAIRS) {
    for (const candidateDigits of digitPairs) {
      if (transformedRelationIsTrue(blueprint.equation, parsePair(operatorText), candidateDigits)) {
        survivors.push(`${operatorText}; ${candidateDigits[0]} ↔ ${candidateDigits[1]}`);
      }
    }
  }
  const answer = `${blueprint.operator}; ${blueprint.digits}`;
  if (survivors.length !== 1 || survivors[0] !== answer) {
    throw new Error(`Curated OPS-CAND-027 blueprint is not uniquely repaired: ${blueprint.equation}; survivors ${survivors.join(", ")}`);
  }

  const wrongOperator = OPERATOR_PAIRS.find((pair) => pair !== blueprint.operator)!;
  const wrongDigits = digitPairs.find((pair) => `${pair[0]} ↔ ${pair[1]}` !== blueprint.digits)!;
  const optionValues = rotate([
    answer,
    `${blueprint.operator}; no digit interchange`,
    `no operator interchange; ${blueprint.digits}`,
    `${wrongOperator}; ${wrongDigits[0]} ↔ ${wrongDigits[1]}`,
  ], seed);
  const options: OpsPilotOption[] = optionValues.map((value) => ({ value, errorLabel: value === answer ? null : "INCOMPLETE_OR_WRONG_COMPOUND_INTERCHANGE" }));
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  const leftTrace = arithmeticTrace(relation.left.expression);
  const rightTrace = arithmeticTrace(relation.right.expression);
  const steps: TeachingStep[] = [
    { label: "Write both operator replacements", expression: `${operatorPair[0]} → ${operatorPair[1]}; ${operatorPair[1]} → ${operatorPair[0]}`, result: "Both operators occur in the original equation and are changed simultaneously." },
    { label: "Write both global digit replacements", expression: `${digitPair[0]} → ${digitPair[1]}; ${digitPair[1]} → ${digitPair[0]}`, result: "Rebuild every affected number on both sides of the equation." },
    { label: "Apply both changes to the original equation", expression: blueprint.equation, result: transformed },
    ...leftTrace.steps.map((step) => ({ ...step, label: `Left side: ${step.label}` })),
    ...(rightTrace.steps.length > 0 ? rightTrace.steps.map((step) => ({ ...step, label: `Right side: ${step.label}` })) : [{ label: "Right side: Read the value", expression: relation.right.expression, result: `Its value is ${rightTrace.value}.` }]),
    { label: "Compare both sides", expression: `${leftTrace.value} = ${rightTrace.value}`, result: "The transformed equation is true." },
    { label: "Establish complete-pool uniqueness", expression: `${OPERATOR_PAIRS.length} operator pairs × ${digitPairs.length} digit pairs were tested.`, result: `Only ${answer} makes the equation true.` },
  ];

  return {
    candidateId: "OPS-CAND-027",
    checkpointId: "OPS-CP-008",
    seed,
    locale: "en-IN",
    taskKind: "IDENTIFY_OPERATOR_AND_VALUE_SWAP",
    solveMode: "identifyOperatorAndDigitPairSwap",
    renderer: "TABLE_OR_GRID",
    stem: `Which operator pair and digit pair must both be interchanged throughout ${blueprint.equation} to make it correct?`,
    options,
    correctIndex,
    answer,
    explanation: {
      ruleStatement: "Apply a genuine two-way operator interchange and a global two-way digit interchange to the same original equation; rebuild every affected numeral, use ordinary precedence and verify uniqueness over the complete compound pool.",
      steps,
      conclusion: `Therefore, the required compound interchange is ${answer}.`,
    },
    proof: { unique: true, solverRoute: "CURATED_ENUMERATE_VISIBLE_OPERATOR_X_DIGIT_POOL", eligibleCandidateCount: OPERATOR_PAIRS.length * digitPairs.length, survivingCandidateCount: 1, semanticFingerprint: `CURATED:OPS-CAND-027:${seed}:${transformed}` },
    metadata: { teachingExplanationVersion: "V3_APPROVED", teachingTraceVerified: true, requestedSeed: seed, sourceSeed: seed % CANDIDATE_027_BLUEPRINTS.length, completePoolRepairCount: 1, curatedBothOperatorsVisible: true, globalDigitScope: true, invalidOneWaySourceGeneratorBypassed: true },
  };
}

function ensureExactAnswerConclusion(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  if (question.explanation.conclusion.includes(question.answer)) return question;
  return { ...question, explanation: { ...question.explanation, conclusion: `${question.explanation.conclusion} The exact answer is ${question.answer}.` } };
}

export function generateApprovedOpsQuestion(candidateId: OpsApprovedCandidateId, seed: number): ApprovedOpsQuestion {
  if (!Number.isInteger(seed) || seed < 0) throw new Error(`Approved runtime seed must be a non-negative integer; received ${seed}.`);
  const question = candidateId === "OPS-CAND-016"
    ? generateCandidate016(seed)
    : candidateId === "OPS-CAND-027"
      ? generateCandidate027(seed)
      : generateBaseApprovedQuestion(candidateId, seed);
  return ensureExactAnswerConclusion(question);
}
