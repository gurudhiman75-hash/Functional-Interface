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
} from "./foundation/mixed-arithmetic";
import {
  clusterNumberToken,
  letterNumberToken,
  letterToken,
  mixedTokenKey,
  numberLetterToken,
  numberToken,
  sameMixedToken,
  type MixedResult,
  type MixedToken,
} from "./foundation/mixed-token";
import {
  ANA_CP008_PROVISIONAL_RULES,
  provisionalMixedContextKey,
  type ProvisionalMixedContext,
  type ProvisionalMixedRuleId,
} from "./provisional-rule-definitions";

export interface ProvisionalMixedEvidence {
  input: MixedToken;
  output: MixedResult;
}

export interface ProvisionalMixedMatch {
  ruleId: ProvisionalMixedRuleId;
  context: ProvisionalMixedContext;
  contextKey: string;
  priority: number;
}

function applySignedNumberDelta(input: number, delta: number): number | null {
  if (!Number.isSafeInteger(delta) || delta === 0 || Math.abs(delta) > 100) return null;
  return delta > 0
    ? applyWholeNumberOperation(input, "ADD", delta)
    : applyWholeNumberOperation(input, "SUBTRACT", Math.abs(delta));
}

function independentlyEligible(
  ruleId: ProvisionalMixedRuleId,
  input: MixedToken,
  context: ProvisionalMixedContext,
): boolean {
  switch (ruleId) {
    case "MIXED_LETTER_GROUP_SCALAR_AGGREGATE":
      return input.kind === "LETTER_GROUP" && input.letters.length === 2 &&
        input.letters[0] !== input.letters[1] && context.kind === "LETTER_GROUP_SCALAR";
    case "MIXED_LETTER_GROUP_DERIVED_LETTER": {
      if (input.kind !== "LETTER_GROUP" || input.letters.length !== 2 ||
          context.kind !== "LETTER_GROUP_TO_LETTER") return false;
      const output = aggregateToLetterWithoutWrap(input.letters, context.aggregate);
      return output !== null && !input.letters.includes(output);
    }
    case "MIXED_SINGLE_LETTER_POSITION_POWER":
      return input.kind === "LETTER" && context.kind === "SINGLE_LETTER_POSITION_POWER" &&
        ordinaryLetterPositionPower(input.letter, context.exponent) !== null;
    case "MIXED_TOKEN_INDEPENDENT_TRANSFORM":
      return input.kind === "LETTER_NUMBER" && context.kind === "INDEPENDENT_LETTER_NUMBER" &&
        applyLetterShift(input.letter, context.letterShift) !== null &&
        applyWholeNumberOperation(input.number, context.numberOperation, context.numberAmount) !== null;
    case "MIXED_CLUSTER_NUMBER_SHARED_DELTA":
      return input.kind === "CLUSTER_NUMBER" && context.kind === "CLUSTER_NUMBER_SHARED_DELTA" &&
        applyUniformLetterGroupShift(input.letters, context.delta) !== null &&
        applySignedNumberDelta(input.number, context.delta) !== null;
    case "MIXED_CLUSTER_NUMBER_INDEPENDENT_VECTOR":
      return input.kind === "CLUSTER_NUMBER" && input.letters.length === 2 &&
        context.kind === "CLUSTER_NUMBER_INDEPENDENT_VECTOR" &&
        applyLetterShiftVector(input.letters, context.letterShifts) !== null &&
        applySignedNumberDelta(input.number, context.numberDelta) !== null;
    case "MIXED_CLUSTER_NUMBER_VECTOR_MULTIPLIER":
      return input.kind === "CLUSTER_NUMBER" && input.letters.length === 2 && input.number !== 0 &&
        context.kind === "CLUSTER_NUMBER_VECTOR_MULTIPLIER" &&
        applyLetterShiftVector(input.letters, context.letterShifts) !== null &&
        applyExactRationalMultiplier(input.number, context.numerator, context.denominator) !== null;
    case "MIXED_CLUSTER_NUMBER_VECTOR_POWER":
      return input.kind === "CLUSTER_NUMBER" && input.letters.length === 2 &&
        context.kind === "CLUSTER_NUMBER_VECTOR_POWER" &&
        applyLetterShiftVector(input.letters, context.letterShifts) !== null &&
        applyNumericPowerTransform(input.number, context.transform) !== null;
    case "MIXED_NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR": {
      if (input.kind !== "NUMBER_LETTER" || context.kind !== "NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR") {
        return false;
      }
      const inputLetter = squaredDigitSumLetter(input.number);
      const outputLetter = squaredDigitSumLetter(input.number + context.numberStep);
      return inputLetter === input.letter && outputLetter !== null && outputLetter !== input.letter;
    }
  }
}

export function independentlyApplyProvisionalMixedRule(
  ruleId: ProvisionalMixedRuleId,
  context: ProvisionalMixedContext,
  input: MixedToken,
): MixedResult | null {
  if (!independentlyEligible(ruleId, input, context)) return null;
  switch (ruleId) {
    case "MIXED_LETTER_GROUP_SCALAR_AGGREGATE":
      return input.kind === "LETTER_GROUP" && context.kind === "LETTER_GROUP_SCALAR"
        ? numberToken(aggregateOrdinaryPositions(input.letters, context.aggregate))
        : null;
    case "MIXED_LETTER_GROUP_DERIVED_LETTER": {
      if (input.kind !== "LETTER_GROUP" || context.kind !== "LETTER_GROUP_TO_LETTER") return null;
      const output = aggregateToLetterWithoutWrap(input.letters, context.aggregate);
      return output ? letterToken(output) : null;
    }
    case "MIXED_SINGLE_LETTER_POSITION_POWER": {
      if (input.kind !== "LETTER" || context.kind !== "SINGLE_LETTER_POSITION_POWER") return null;
      const output = ordinaryLetterPositionPower(input.letter, context.exponent);
      return output !== null ? numberToken(output) : null;
    }
    case "MIXED_TOKEN_INDEPENDENT_TRANSFORM": {
      if (input.kind !== "LETTER_NUMBER" || context.kind !== "INDEPENDENT_LETTER_NUMBER") return null;
      const letter = applyLetterShift(input.letter, context.letterShift);
      const number = applyWholeNumberOperation(input.number, context.numberOperation, context.numberAmount);
      return letter !== null && number !== null ? letterNumberToken(letter, number) : null;
    }
    case "MIXED_CLUSTER_NUMBER_SHARED_DELTA": {
      if (input.kind !== "CLUSTER_NUMBER" || context.kind !== "CLUSTER_NUMBER_SHARED_DELTA") return null;
      const letters = applyUniformLetterGroupShift(input.letters, context.delta);
      const number = applySignedNumberDelta(input.number, context.delta);
      return letters !== null && number !== null ? clusterNumberToken(letters, number) : null;
    }
    case "MIXED_CLUSTER_NUMBER_INDEPENDENT_VECTOR": {
      if (input.kind !== "CLUSTER_NUMBER" || context.kind !== "CLUSTER_NUMBER_INDEPENDENT_VECTOR") {
        return null;
      }
      const letters = applyLetterShiftVector(input.letters, context.letterShifts);
      const number = applySignedNumberDelta(input.number, context.numberDelta);
      return letters !== null && number !== null ? clusterNumberToken(letters, number) : null;
    }
    case "MIXED_CLUSTER_NUMBER_VECTOR_MULTIPLIER": {
      if (input.kind !== "CLUSTER_NUMBER" || context.kind !== "CLUSTER_NUMBER_VECTOR_MULTIPLIER") {
        return null;
      }
      const letters = applyLetterShiftVector(input.letters, context.letterShifts);
      const number = applyExactRationalMultiplier(input.number, context.numerator, context.denominator);
      return letters !== null && number !== null ? clusterNumberToken(letters, number) : null;
    }
    case "MIXED_CLUSTER_NUMBER_VECTOR_POWER": {
      if (input.kind !== "CLUSTER_NUMBER" || context.kind !== "CLUSTER_NUMBER_VECTOR_POWER") return null;
      const letters = applyLetterShiftVector(input.letters, context.letterShifts);
      const number = applyNumericPowerTransform(input.number, context.transform);
      return letters !== null && number !== null ? clusterNumberToken(letters, number) : null;
    }
    case "MIXED_NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR": {
      if (input.kind !== "NUMBER_LETTER" || context.kind !== "NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR") {
        return null;
      }
      const outputNumber = input.number + context.numberStep;
      const outputLetter = squaredDigitSumLetter(outputNumber);
      return outputLetter ? numberLetterToken(outputNumber, outputLetter) : null;
    }
  }
}

export function matchingProvisionalMixedRules(
  evidence: readonly ProvisionalMixedEvidence[],
): readonly ProvisionalMixedMatch[] {
  if (evidence.length === 0) return [];
  const matches: ProvisionalMixedMatch[] = [];
  for (const rule of ANA_CP008_PROVISIONAL_RULES) {
    for (const context of rule.contexts) {
      const completeMatch = evidence.every(({ input, output }) =>
        independentlyEligible(rule.id, input, context) &&
        sameMixedToken(independentlyApplyProvisionalMixedRule(rule.id, context, input), output));
      if (completeMatch) {
        matches.push({
          ruleId: rule.id,
          context,
          contextKey: provisionalMixedContextKey(context),
          priority: rule.priority,
        });
      }
    }
  }
  return matches;
}

export function verifyProvisionalMixedTransfer(
  ruleId: ProvisionalMixedRuleId,
  context: ProvisionalMixedContext,
  evidence: readonly ProvisionalMixedEvidence[],
): boolean {
  return evidence.every(({ input, output }) =>
    sameMixedToken(independentlyApplyProvisionalMixedRule(ruleId, context, input), output));
}

export function mixedEvidenceKey(evidence: ProvisionalMixedEvidence): string {
  return `${mixedTokenKey(evidence.input)}=>${mixedTokenKey(evidence.output)}`;
}
