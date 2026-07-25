import {
  aggregateOrdinaryPositions,
  aggregateToLetterWithoutWrap,
  applyExactRationalMultiplier,
  applyLetterShift,
  applyLetterShiftVector,
  applyNumericPowerTransform,
  applyUniformLetterGroupShift,
  applyWholeNumberOperation,
  ordinaryLetterPositionPower,
  squaredDigitSumLetter,
  type NumericPowerTransform,
  type PositionAggregate,
  type WholeNumberOperation,
} from "./foundation/mixed-arithmetic";
import {
  clusterNumberToken,
  letterNumberToken,
  letterToken,
  numberLetterToken,
  numberToken,
  type MixedResult,
  type MixedToken,
} from "./foundation/mixed-token";

export type ProvisionalMixedRuleId =
  | "MIXED_LETTER_GROUP_SCALAR_AGGREGATE"
  | "MIXED_LETTER_GROUP_DERIVED_LETTER"
  | "MIXED_SINGLE_LETTER_POSITION_POWER"
  | "MIXED_TOKEN_INDEPENDENT_TRANSFORM"
  | "MIXED_CLUSTER_NUMBER_SHARED_DELTA"
  | "MIXED_CLUSTER_NUMBER_INDEPENDENT_VECTOR"
  | "MIXED_CLUSTER_NUMBER_VECTOR_MULTIPLIER"
  | "MIXED_CLUSTER_NUMBER_VECTOR_POWER"
  | "MIXED_NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR";

export type ProvisionalMixedContext =
  | { kind: "LETTER_GROUP_SCALAR"; aggregate: PositionAggregate }
  | { kind: "LETTER_GROUP_TO_LETTER"; aggregate: "SUM" }
  | { kind: "SINGLE_LETTER_POSITION_POWER"; exponent: 2 }
  | {
      kind: "INDEPENDENT_LETTER_NUMBER";
      letterShift: number;
      numberOperation: WholeNumberOperation;
      numberAmount: number;
    }
  | { kind: "CLUSTER_NUMBER_SHARED_DELTA"; delta: number }
  | {
      kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR";
      letterShifts: readonly [number, number];
      numberDelta: number;
    }
  | {
      kind: "CLUSTER_NUMBER_VECTOR_MULTIPLIER";
      letterShifts: readonly [number, number];
      numerator: number;
      denominator: number;
    }
  | {
      kind: "CLUSTER_NUMBER_VECTOR_POWER";
      letterShifts: readonly [number, number];
      transform: NumericPowerTransform;
    }
  | { kind: "NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR"; numberStep: 1 };

export interface ProvisionalMixedRuleDefinition {
  id: ProvisionalMixedRuleId;
  priority: number;
  inputKind: MixedToken["kind"];
  outputKind: MixedResult["kind"];
  contexts: readonly ProvisionalMixedContext[];
  accepts(input: MixedToken, context: ProvisionalMixedContext): boolean;
  apply(input: MixedToken, context: ProvisionalMixedContext): MixedResult | null;
}

function applySignedNumberDelta(input: number, delta: number): number | null {
  if (!Number.isSafeInteger(delta) || delta === 0 || Math.abs(delta) > 100) return null;
  return delta > 0
    ? applyWholeNumberOperation(input, "ADD", delta)
    : applyWholeNumberOperation(input, "SUBTRACT", Math.abs(delta));
}

const SCALAR_CONTEXTS: readonly ProvisionalMixedContext[] = [
  { kind: "LETTER_GROUP_SCALAR", aggregate: "SUM" },
  { kind: "LETTER_GROUP_SCALAR", aggregate: "PRODUCT" },
];

const DERIVED_LETTER_CONTEXTS: readonly ProvisionalMixedContext[] = [
  { kind: "LETTER_GROUP_TO_LETTER", aggregate: "SUM" },
];

const POSITION_POWER_CONTEXTS: readonly ProvisionalMixedContext[] = [
  { kind: "SINGLE_LETTER_POSITION_POWER", exponent: 2 },
];

const LETTER_SHIFTS = [-6, -3, -2, -1, 1, 2, 3, 6] as const;
const NUMBER_PROFILES = [
  { numberOperation: "ADD" as const, numberAmount: 2 },
  { numberOperation: "ADD" as const, numberAmount: 4 },
  { numberOperation: "ADD" as const, numberAmount: 7 },
  { numberOperation: "SUBTRACT" as const, numberAmount: 2 },
  { numberOperation: "SUBTRACT" as const, numberAmount: 4 },
  { numberOperation: "SUBTRACT" as const, numberAmount: 7 },
] as const;

const INDEPENDENT_CONTEXTS: readonly ProvisionalMixedContext[] = LETTER_SHIFTS.flatMap((letterShift) =>
  NUMBER_PROFILES.map(({ numberOperation, numberAmount }) => ({
    kind: "INDEPENDENT_LETTER_NUMBER" as const,
    letterShift,
    numberOperation,
    numberAmount,
  })),
);

const SHARED_DELTA_CONTEXTS: readonly ProvisionalMixedContext[] = [-5, -3, -2, -1, 1, 2, 3, 5]
  .map((delta) => ({ kind: "CLUSTER_NUMBER_SHARED_DELTA" as const, delta }));

const INDEPENDENT_VECTOR_CONTEXTS: readonly ProvisionalMixedContext[] = [
  { kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR", letterShifts: [3, -2], numberDelta: -17 },
  { kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR", letterShifts: [-2, -4], numberDelta: -15 },
  { kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR", letterShifts: [4, -3], numberDelta: -18 },
  { kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR", letterShifts: [-2, 4], numberDelta: -13 },
  { kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR", letterShifts: [2, 3], numberDelta: 9 },
  { kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR", letterShifts: [1, -4], numberDelta: -7 },
  { kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR", letterShifts: [-5, -2], numberDelta: -17 },
  { kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR", letterShifts: [3, -4], numberDelta: -21 },
  { kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR", letterShifts: [-2, -2], numberDelta: 2 },
];

const MULTIPLIER_CONTEXTS: readonly ProvisionalMixedContext[] = [
  {
    kind: "CLUSTER_NUMBER_VECTOR_MULTIPLIER",
    letterShifts: [3, 3],
    numerator: 5,
    denominator: 1,
  },
  {
    kind: "CLUSTER_NUMBER_VECTOR_MULTIPLIER",
    letterShifts: [4, -6],
    numerator: 5,
    denominator: 2,
  },
];

const POWER_CONTEXTS: readonly ProvisionalMixedContext[] = [
  {
    kind: "CLUSTER_NUMBER_VECTOR_POWER",
    letterShifts: [4, 11],
    transform: "CUBE",
  },
  {
    kind: "CLUSTER_NUMBER_VECTOR_POWER",
    letterShifts: [3, -3],
    transform: "PERFECT_SQUARE_TO_CUBE",
  },
];

const DIGIT_SQUARE_CONTEXTS: readonly ProvisionalMixedContext[] = [
  { kind: "NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR", numberStep: 1 },
];

export const ANA_CP008_PROVISIONAL_RULES: readonly ProvisionalMixedRuleDefinition[] = [
  {
    id: "MIXED_LETTER_GROUP_SCALAR_AGGREGATE",
    priority: 1,
    inputKind: "LETTER_GROUP",
    outputKind: "NUMBER",
    contexts: SCALAR_CONTEXTS,
    accepts(input, context) {
      return input.kind === "LETTER_GROUP" && input.letters.length === 2 &&
        context.kind === "LETTER_GROUP_SCALAR" && input.letters[0] !== input.letters[1];
    },
    apply(input, context) {
      if (!this.accepts(input, context) || input.kind !== "LETTER_GROUP" || context.kind !== "LETTER_GROUP_SCALAR") {
        return null;
      }
      return numberToken(aggregateOrdinaryPositions(input.letters, context.aggregate));
    },
  },
  {
    id: "MIXED_LETTER_GROUP_DERIVED_LETTER",
    priority: 1,
    inputKind: "LETTER_GROUP",
    outputKind: "LETTER",
    contexts: DERIVED_LETTER_CONTEXTS,
    accepts(input, context) {
      if (input.kind !== "LETTER_GROUP" || input.letters.length !== 2 || context.kind !== "LETTER_GROUP_TO_LETTER") {
        return false;
      }
      const output = aggregateToLetterWithoutWrap(input.letters, context.aggregate);
      return output !== null && !input.letters.includes(output);
    },
    apply(input, context) {
      if (!this.accepts(input, context) || input.kind !== "LETTER_GROUP" || context.kind !== "LETTER_GROUP_TO_LETTER") {
        return null;
      }
      const output = aggregateToLetterWithoutWrap(input.letters, context.aggregate);
      return output ? letterToken(output) : null;
    },
  },
  {
    id: "MIXED_SINGLE_LETTER_POSITION_POWER",
    priority: 1,
    inputKind: "LETTER",
    outputKind: "NUMBER",
    contexts: POSITION_POWER_CONTEXTS,
    accepts(input, context) {
      return input.kind === "LETTER" && context.kind === "SINGLE_LETTER_POSITION_POWER" &&
        ordinaryLetterPositionPower(input.letter, context.exponent) !== null;
    },
    apply(input, context) {
      if (!this.accepts(input, context) || input.kind !== "LETTER" ||
          context.kind !== "SINGLE_LETTER_POSITION_POWER") return null;
      const output = ordinaryLetterPositionPower(input.letter, context.exponent);
      return output !== null ? numberToken(output) : null;
    },
  },
  {
    id: "MIXED_TOKEN_INDEPENDENT_TRANSFORM",
    priority: 2,
    inputKind: "LETTER_NUMBER",
    outputKind: "LETTER_NUMBER",
    contexts: INDEPENDENT_CONTEXTS,
    accepts(input, context) {
      return input.kind === "LETTER_NUMBER" && context.kind === "INDEPENDENT_LETTER_NUMBER" &&
        applyLetterShift(input.letter, context.letterShift) !== null &&
        applyWholeNumberOperation(input.number, context.numberOperation, context.numberAmount) !== null;
    },
    apply(input, context) {
      if (!this.accepts(input, context) || input.kind !== "LETTER_NUMBER" ||
          context.kind !== "INDEPENDENT_LETTER_NUMBER") return null;
      const letter = applyLetterShift(input.letter, context.letterShift);
      const number = applyWholeNumberOperation(input.number, context.numberOperation, context.numberAmount);
      return letter !== null && number !== null ? letterNumberToken(letter, number) : null;
    },
  },
  {
    id: "MIXED_CLUSTER_NUMBER_SHARED_DELTA",
    priority: 2,
    inputKind: "CLUSTER_NUMBER",
    outputKind: "CLUSTER_NUMBER",
    contexts: SHARED_DELTA_CONTEXTS,
    accepts(input, context) {
      return input.kind === "CLUSTER_NUMBER" && context.kind === "CLUSTER_NUMBER_SHARED_DELTA" &&
        applyUniformLetterGroupShift(input.letters, context.delta) !== null &&
        applySignedNumberDelta(input.number, context.delta) !== null;
    },
    apply(input, context) {
      if (!this.accepts(input, context) || input.kind !== "CLUSTER_NUMBER" ||
          context.kind !== "CLUSTER_NUMBER_SHARED_DELTA") return null;
      const letters = applyUniformLetterGroupShift(input.letters, context.delta);
      const number = applySignedNumberDelta(input.number, context.delta);
      return letters !== null && number !== null ? clusterNumberToken(letters, number) : null;
    },
  },
  {
    id: "MIXED_CLUSTER_NUMBER_INDEPENDENT_VECTOR",
    priority: 2,
    inputKind: "CLUSTER_NUMBER",
    outputKind: "CLUSTER_NUMBER",
    contexts: INDEPENDENT_VECTOR_CONTEXTS,
    accepts(input, context) {
      return input.kind === "CLUSTER_NUMBER" && input.letters.length === 2 &&
        context.kind === "CLUSTER_NUMBER_INDEPENDENT_VECTOR" &&
        applyLetterShiftVector(input.letters, context.letterShifts) !== null &&
        applySignedNumberDelta(input.number, context.numberDelta) !== null;
    },
    apply(input, context) {
      if (!this.accepts(input, context) || input.kind !== "CLUSTER_NUMBER" ||
          context.kind !== "CLUSTER_NUMBER_INDEPENDENT_VECTOR") return null;
      const letters = applyLetterShiftVector(input.letters, context.letterShifts);
      const number = applySignedNumberDelta(input.number, context.numberDelta);
      return letters !== null && number !== null ? clusterNumberToken(letters, number) : null;
    },
  },
  {
    id: "MIXED_CLUSTER_NUMBER_VECTOR_MULTIPLIER",
    priority: 3,
    inputKind: "CLUSTER_NUMBER",
    outputKind: "CLUSTER_NUMBER",
    contexts: MULTIPLIER_CONTEXTS,
    accepts(input, context) {
      return input.kind === "CLUSTER_NUMBER" && input.letters.length === 2 && input.number !== 0 &&
        context.kind === "CLUSTER_NUMBER_VECTOR_MULTIPLIER" &&
        applyLetterShiftVector(input.letters, context.letterShifts) !== null &&
        applyExactRationalMultiplier(input.number, context.numerator, context.denominator) !== null;
    },
    apply(input, context) {
      if (!this.accepts(input, context) || input.kind !== "CLUSTER_NUMBER" ||
          context.kind !== "CLUSTER_NUMBER_VECTOR_MULTIPLIER") return null;
      const letters = applyLetterShiftVector(input.letters, context.letterShifts);
      const number = applyExactRationalMultiplier(input.number, context.numerator, context.denominator);
      return letters !== null && number !== null ? clusterNumberToken(letters, number) : null;
    },
  },
  {
    id: "MIXED_CLUSTER_NUMBER_VECTOR_POWER",
    priority: 3,
    inputKind: "CLUSTER_NUMBER",
    outputKind: "CLUSTER_NUMBER",
    contexts: POWER_CONTEXTS,
    accepts(input, context) {
      return input.kind === "CLUSTER_NUMBER" && input.letters.length === 2 &&
        context.kind === "CLUSTER_NUMBER_VECTOR_POWER" &&
        applyLetterShiftVector(input.letters, context.letterShifts) !== null &&
        applyNumericPowerTransform(input.number, context.transform) !== null;
    },
    apply(input, context) {
      if (!this.accepts(input, context) || input.kind !== "CLUSTER_NUMBER" ||
          context.kind !== "CLUSTER_NUMBER_VECTOR_POWER") return null;
      const letters = applyLetterShiftVector(input.letters, context.letterShifts);
      const number = applyNumericPowerTransform(input.number, context.transform);
      return letters !== null && number !== null ? clusterNumberToken(letters, number) : null;
    },
  },
  {
    id: "MIXED_NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR",
    priority: 3,
    inputKind: "NUMBER_LETTER",
    outputKind: "NUMBER_LETTER",
    contexts: DIGIT_SQUARE_CONTEXTS,
    accepts(input, context) {
      if (input.kind !== "NUMBER_LETTER" || context.kind !== "NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR") {
        return false;
      }
      const expectedInputLetter = squaredDigitSumLetter(input.number);
      const outputNumber = input.number + context.numberStep;
      const outputLetter = squaredDigitSumLetter(outputNumber);
      return expectedInputLetter === input.letter && outputLetter !== null && outputLetter !== input.letter;
    },
    apply(input, context) {
      if (!this.accepts(input, context) || input.kind !== "NUMBER_LETTER" ||
          context.kind !== "NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR") return null;
      const outputNumber = input.number + context.numberStep;
      const outputLetter = squaredDigitSumLetter(outputNumber);
      return outputLetter ? numberLetterToken(outputNumber, outputLetter) : null;
    },
  },
];

export function provisionalMixedRuleById(ruleId: ProvisionalMixedRuleId): ProvisionalMixedRuleDefinition {
  const rule = ANA_CP008_PROVISIONAL_RULES.find((entry) => entry.id === ruleId);
  if (!rule) throw new Error(`Unknown provisional ANA-CP-008 rule: ${ruleId}`);
  return rule;
}

export function provisionalMixedContextKey(context: ProvisionalMixedContext): string {
  switch (context.kind) {
    case "LETTER_GROUP_SCALAR":
      return `LETTER_GROUP_SCALAR:${context.aggregate}`;
    case "LETTER_GROUP_TO_LETTER":
      return `LETTER_GROUP_TO_LETTER:${context.aggregate}`;
    case "SINGLE_LETTER_POSITION_POWER":
      return `SINGLE_LETTER_POSITION_POWER:${context.exponent}`;
    case "INDEPENDENT_LETTER_NUMBER":
      return `INDEPENDENT:${context.letterShift}:${context.numberOperation}:${context.numberAmount}`;
    case "CLUSTER_NUMBER_SHARED_DELTA":
      return `CLUSTER_SHARED_DELTA:${context.delta}`;
    case "CLUSTER_NUMBER_INDEPENDENT_VECTOR":
      return `CLUSTER_VECTOR:${context.letterShifts.join(",")}:${context.numberDelta}`;
    case "CLUSTER_NUMBER_VECTOR_MULTIPLIER":
      return `CLUSTER_MULTIPLIER:${context.letterShifts.join(",")}:${context.numerator}/${context.denominator}`;
    case "CLUSTER_NUMBER_VECTOR_POWER":
      return `CLUSTER_POWER:${context.letterShifts.join(",")}:${context.transform}`;
    case "NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR":
      return `NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR:${context.numberStep}`;
  }
}
