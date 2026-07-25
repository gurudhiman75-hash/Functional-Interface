import {
  aggregateOrdinaryPositions,
  aggregateToLetterWithoutWrap,
  applyLetterShift,
  applyWholeNumberOperation,
} from "./foundation/mixed-arithmetic";
import {
  letterNumberToken,
  letterToken,
  mixedTokenKey,
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
    case "MIXED_TOKEN_INDEPENDENT_TRANSFORM":
      return input.kind === "LETTER_NUMBER" && context.kind === "INDEPENDENT_LETTER_NUMBER" &&
        applyLetterShift(input.letter, context.letterShift) !== null &&
        applyWholeNumberOperation(input.number, context.numberOperation, context.numberAmount) !== null;
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
      if (input.kind !== "LETTER_GROUP" || context.kind !== "LETTER_GROUP_SCALAR") return null;
      return numberToken(aggregateOrdinaryPositions(input.letters, context.aggregate));
    case "MIXED_LETTER_GROUP_DERIVED_LETTER": {
      if (input.kind !== "LETTER_GROUP" || context.kind !== "LETTER_GROUP_TO_LETTER") return null;
      const output = aggregateToLetterWithoutWrap(input.letters, context.aggregate);
      return output ? letterToken(output) : null;
    }
    case "MIXED_TOKEN_INDEPENDENT_TRANSFORM": {
      if (input.kind !== "LETTER_NUMBER" || context.kind !== "INDEPENDENT_LETTER_NUMBER") return null;
      const letter = applyLetterShift(input.letter, context.letterShift);
      const number = applyWholeNumberOperation(input.number, context.numberOperation, context.numberAmount);
      return letter && number ? letterNumberToken(letter, number) : null;
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
        sameMixedToken(independentlyApplyProvisionalMixedRule(rule.id, context, input), output),
      );
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
    sameMixedToken(independentlyApplyProvisionalMixedRule(ruleId, context, input), output),
  );
}

export function mixedEvidenceKey(evidence: ProvisionalMixedEvidence): string {
  return `${mixedTokenKey(evidence.input)}=>${mixedTokenKey(evidence.output)}`;
}
