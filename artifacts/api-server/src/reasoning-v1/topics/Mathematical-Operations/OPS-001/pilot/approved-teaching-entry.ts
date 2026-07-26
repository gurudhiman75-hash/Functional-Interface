import {
  OPS_APPROVED_CANDIDATE_IDS,
  generateApprovedOpsQuestion as generateBaseApprovedQuestion,
  type ApprovedOpsQuestion,
  type OpsApprovedCandidateId,
} from "./approved-teaching-runtime";
import {
  arithmeticTrace,
  relationTrace,
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

function parsePair(source: string): readonly [string, string] {
  const match = source.match(/^(.+) ↔ (.+)$/u);
  if (!match) throw new Error(`Malformed curated operator pair: ${source}`);
  return [match[1], match[2]];
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  const normalized = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(normalized), ...values.slice(0, normalized)];
}

function generateCandidate016(seed: number): ApprovedOpsQuestion {
  const blueprint = CANDIDATE_016_BLUEPRINTS[seed % CANDIDATE_016_BLUEPRINTS.length];
  const equation = `${blueprint.expression} = ${blueprint.result}`;
  const answerPair = parsePair(blueprint.answer);
  const transformed = swapOperatorPairs(equation, [answerPair]);
  const relation = relationTrace(transformed);
  if (!relation.truth) throw new Error(`Curated OPS-CAND-016 blueprint is not true after ${blueprint.answer}: ${equation}`);

  const survivors = OPERATOR_PAIRS.filter((pairText) => {
    const pair = parsePair(pairText);
    return relationTrace(swapOperatorPairs(equation, [pair])).truth;
  });
  if (survivors.length !== 1 || survivors[0] !== blueprint.answer) {
    throw new Error(`Curated OPS-CAND-016 blueprint is not uniquely repaired: ${equation}; survivors ${survivors.join(", ")}`);
  }

  const distractorPool = OPERATOR_PAIRS.filter((pair) => pair !== blueprint.answer);
  const start = (seed * 3) % distractorPool.length;
  const distractors = rotate(distractorPool, start).slice(0, 3);
  const optionValues = rotate([blueprint.answer, ...distractors], seed);
  const options: OpsPilotOption[] = optionValues.map((value) => ({
    value,
    errorLabel: value === blueprint.answer ? null : "WRONG_OPERATOR_PAIR",
  }));
  const correctIndex = options.findIndex((option) => option.errorLabel === null);

  const leftTrace = arithmeticTrace(relation.left.expression);
  const rightTrace = arithmeticTrace(relation.right.expression);
  const steps: TeachingStep[] = [
    {
      label: "Apply the proposed interchange in both directions",
      expression: `${answerPair[0]} → ${answerPair[1]}; ${answerPair[1]} → ${answerPair[0]}`,
      result: "Both operators occur in the original equation, so this is a genuine two-way interchange.",
    },
    {
      label: "Rebuild the complete equation",
      expression: equation,
      result: transformed,
    },
    ...leftTrace.steps.map((step) => ({ ...step, label: `Left side: ${step.label}` })),
    ...(rightTrace.steps.length > 0
      ? rightTrace.steps.map((step) => ({ ...step, label: `Right side: ${step.label}` }))
      : [{ label: "Right side: Read the value", expression: relation.right.expression, result: `Its value is ${rightTrace.value}.` }]),
    {
      label: "Compare both sides",
      expression: `${leftTrace.value} = ${rightTrace.value}`,
      result: "The transformed equation is true.",
    },
    {
      label: "Establish uniqueness",
      expression: "All six basic operator pairs were tested, and every pair used two operators visible in the original equation.",
      result: `Only ${blueprint.answer} makes the equation true.`,
    },
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
    proof: {
      unique: true,
      solverRoute: "CURATED_ENUMERATE_ALL_VISIBLE_BASIC_OPERATOR_PAIRS",
      eligibleCandidateCount: OPERATOR_PAIRS.length,
      survivingCandidateCount: 1,
      semanticFingerprint: `CURATED:OPS-CAND-016:${seed}:${transformed}`,
    },
    metadata: {
      teachingExplanationVersion: "V3_APPROVED",
      teachingTraceVerified: true,
      requestedSeed: seed,
      sourceSeed: seed % CANDIDATE_016_BLUEPRINTS.length,
      curatedAllFourOperatorsVisible: true,
      invalidOneWaySourceGeneratorBypassed: true,
    },
  };
}

export function generateApprovedOpsQuestion(candidateId: OpsApprovedCandidateId, seed: number): ApprovedOpsQuestion {
  if (!Number.isInteger(seed) || seed < 0) throw new Error(`Approved runtime seed must be a non-negative integer; received ${seed}.`);
  return candidateId === "OPS-CAND-016"
    ? generateCandidate016(seed)
    : generateBaseApprovedQuestion(candidateId, seed);
}
