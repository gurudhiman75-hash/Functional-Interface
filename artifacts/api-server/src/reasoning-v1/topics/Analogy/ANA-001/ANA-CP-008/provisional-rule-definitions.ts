import {
  aggregateOrdinaryPositions,
  aggregateToLetterWithoutWrap,
  applyLetterShift,
  applyWholeNumberOperation,
  type PositionAggregate,
  type WholeNumberOperation,
} from "./foundation/mixed-arithmetic";
import {
  letterNumberToken,
  letterToken,
  numberToken,
  type MixedResult,
  type MixedToken,
} from "./foundation/mixed-token";

export type ProvisionalMixedRuleId =
  | "MIXED_LETTER_GROUP_SCALAR_AGGREGATE"
  | "MIXED_LETTER_GROUP_DERIVED_LETTER"
  | "MIXED_TOKEN_INDEPENDENT_TRANSFORM";

export type ProvisionalMixedContext =
  | { kind: "LETTER_GROUP_SCALAR"; aggregate: PositionAggregate }
  | { kind: "LETTER_GROUP_TO_LETTER"; aggregate: "SUM" }
  | {
      kind: "INDEPENDENT_LETTER_NUMBER";
      letterShift: number;
      numberOperation: WholeNumberOperation;
      numberAmount: number;
    };

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
  }
}
