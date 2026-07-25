import {
  aggregateOrdinaryPositions,
  aggregateToLetterWithoutWrap,
  applyLetterShift,
  applyUniformLetterGroupShift,
  applyWholeNumberOperation,
  squaredDigitSumLetter,
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
  | "MIXED_TOKEN_INDEPENDENT_TRANSFORM"
  | "MIXED_CLUSTER_NUMBER_SHARED_DELTA"
  | "MIXED_NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR";

export type ProvisionalMixedContext =
  | { kind: "LETTER_GROUP_SCALAR"; aggregate: PositionAggregate }
  | { kind: "LETTER_GROUP_TO_LETTER"; aggregate: "SUM" }
  | {
      kind: "INDEPENDENT_LETTER_NUMBER";
      letterShift: number;
      numberOperation: WholeNumberOperation;
      numberAmount: number;
    }
  | { kind: "CLUSTER_NUMBER_SHARED_DELTA"; delta: number }
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

const SCALAR_CONTEXTS: readonly ProvisionalMixedContext[] = [
  { kind: "LETTER_GROUP_SCALAR", aggregate: "SUM" },
  { kind: "LETTER_GROUP_SCALAR", aggregate: "PRODUCT" },
];

const DERIVED_LETTER_CONTEXTS: readonly ProvisionalMixedContext[] = [
  { kind: "LETTER_GROUP_TO_LETTER", aggregate: "SUM" },
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
    id: "MIXED_TOKEN_INDEPENDENT_TRANSFORM",
    priority: 2,
    inputKind: "LETTER_NUMBER",
    outputKind: "LETTER_NUMBER",
    contexts: INDEPENDENT_CONTEXTS,
    accepts(input, context) {
      if (input.kind !== "LETTER_NUMBER" || context.kind !== "INDEPENDENT_LETTER_NUMBER") return false;
      return applyLetterShift(input.letter, context.letterShift) !== null &&
        applyWholeNumberOperation(input.number, context.numberOperation, context.numberAmount) !== null;
    },
    apply(input, context) {
      if (!this.accepts(input, context) || input.kind !== "LETTER_NUMBER" || context.kind !== "INDEPENDENT_LETTER_NUMBER") {
        return null;
      }
      const letter = applyLetterShift(input.letter, context.letterShift);
      const number = applyWholeNumberOperation(input.number, context.numberOperation, context.numberAmount);
      return letter && number ? letterNumberToken(letter, number) : null;
    },
  },
  {
    id: "MIXED_CLUSTER_NUMBER_SHARED_DELTA",
    priority: 2,
    inputKind: "CLUSTER_NUMBER",
    outputKind: "CLUSTER_NUMBER",
    contexts: SHARED_DELTA_CONTEXTS,
    accepts(input, context) {
      if (input.kind !== "CLUSTER_NUMBER" || context.kind !== "CLUSTER_NUMBER_SHARED_DELTA") return false;
      const letters = applyUniformLetterGroupShift(input.letters, context.delta);
      const number = context.delta > 0
        ? applyWholeNumberOperation(input.number, "ADD", context.delta)
        : applyWholeNumberOperation(input.number, "SUBTRACT", Math.abs(context.delta));
      return letters !== null && number !== null;
    },
    apply(input, context) {
      if (!this.accepts(input, context) || input.kind !== "CLUSTER_NUMBER" || context.kind !== "CLUSTER_NUMBER_SHARED_DELTA") {
        return null;
      }
      const letters = applyUniformLetterGroupShift(input.letters, context.delta);
      const number = context.delta > 0
        ? applyWholeNumberOperation(input.number, "ADD", context.delta)
        : applyWholeNumberOperation(input.number, "SUBTRACT", Math.abs(context.delta));
      return letters && number ? clusterNumberToken(letters, number) : null;
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
    case "INDEPENDENT_LETTER_NUMBER":
      return `INDEPENDENT:${context.letterShift}:${context.numberOperation}:${context.numberAmount}`;
    case "CLUSTER_NUMBER_SHARED_DELTA":
      return `CLUSTER_SHARED_DELTA:${context.delta}`;
    case "NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR":
      return `NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR:${context.numberStep}`;
  }
}
