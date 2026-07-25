import assert from "node:assert/strict";
import { squaredDigitSumLetter } from "./foundation/mixed-arithmetic";
import {
  clusterNumberToken,
  letterGroupToken,
  letterNumberToken,
  mixedTokenKey,
  numberLetterToken,
  sameMixedToken,
  type MixedToken,
} from "./foundation/mixed-token";
import {
  independentlyApplyProvisionalMixedRule,
  matchingProvisionalMixedRules,
  type ProvisionalMixedEvidence,
} from "./provisional-independent-solver";
import {
  ANA_CP008_PROVISIONAL_RULES,
  provisionalMixedContextKey,
  type ProvisionalMixedContext,
  type ProvisionalMixedRuleDefinition,
} from "./provisional-rule-definitions";

interface ContextYield {
  ruleId: string;
  contextKey: string;
  eligibleInputs: number;
  candidatePairs: number;
  acceptedPairs: number;
  solverDisagreements: number;
  nativeCollisionRejects: number;
  sameOutputRejects: number;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function letterGroupInputs(): readonly MixedToken[] {
  const inputs: MixedToken[] = [];
  for (const first of ALPHABET) for (const second of ALPHABET) {
    if (first !== second) inputs.push(letterGroupToken(first + second));
  }
  return inputs;
}

function letterNumberInputs(): readonly MixedToken[] {
  const inputs: MixedToken[] = [];
  for (const letter of ALPHABET) for (let number = 8; number <= 64; number += 1) {
    inputs.push(letterNumberToken(letter, number));
  }
  return inputs;
}

function clusterNumberInputs(): readonly MixedToken[] {
  const inputs: MixedToken[] = [];
  for (let firstIndex = 0; firstIndex < ALPHABET.length; firstIndex += 1) {
    for (let secondOffset = 1; secondOffset <= 7; secondOffset += 2) {
      const letters = ALPHABET[firstIndex] + ALPHABET[(firstIndex + secondOffset) % ALPHABET.length];
      for (let number = -25; number <= 60; number += 5) inputs.push(clusterNumberToken(letters, number));
    }
  }
  return inputs;
}

function numberLetterInputs(): readonly MixedToken[] {
  const inputs: MixedToken[] = [];
  for (let number = 10; number <= 999 && inputs.length < 300; number += 1) {
    const letter = squaredDigitSumLetter(number);
    if (letter) inputs.push(numberLetterToken(number, letter));
  }
  return inputs;
}

const INPUTS_BY_KIND: Readonly<Record<string, readonly MixedToken[]>> = {
  LETTER_GROUP: letterGroupInputs(),
  LETTER_NUMBER: letterNumberInputs(),
  CLUSTER_NUMBER: clusterNumberInputs(),
  NUMBER_LETTER: numberLetterInputs(),
};

function candidateInputs(rule: ProvisionalMixedRuleDefinition, context: ProvisionalMixedContext): readonly MixedToken[] {
  return (INPUTS_BY_KIND[rule.inputKind] ?? []).filter((input) => rule.accepts(input, context));
}

function simulateContext(rule: ProvisionalMixedRuleDefinition, context: ProvisionalMixedContext): ContextYield {
  const inputs = candidateInputs(rule, context);
  let candidatePairs = 0;
  let acceptedPairs = 0;
  let solverDisagreements = 0;
  let nativeCollisionRejects = 0;
  let sameOutputRejects = 0;
  const maximumPairs = 700;

  outer:
  for (let sourceIndex = 0; sourceIndex < inputs.length; sourceIndex += 1) {
    for (let targetIndex = sourceIndex + 1; targetIndex < inputs.length; targetIndex += 1) {
      const sourceInput = inputs[sourceIndex];
      const targetInput = inputs[targetIndex];
      const sourceOutput = rule.apply(sourceInput, context);
      const targetOutput = rule.apply(targetInput, context);
      if (!sourceOutput || !targetOutput) continue;
      candidatePairs += 1;

      const independentSource = independentlyApplyProvisionalMixedRule(rule.id, context, sourceInput);
      const independentTarget = independentlyApplyProvisionalMixedRule(rule.id, context, targetInput);
      if (!sameMixedToken(sourceOutput, independentSource) || !sameMixedToken(targetOutput, independentTarget)) {
        solverDisagreements += 1;
        continue;
      }
      if (mixedTokenKey(sourceOutput) === mixedTokenKey(targetOutput)) {
        sameOutputRejects += 1;
        if (candidatePairs >= maximumPairs) break outer;
        continue;
      }

      const evidence: readonly ProvisionalMixedEvidence[] = [
        { input: sourceInput, output: sourceOutput },
        { input: targetInput, output: targetOutput },
      ];
      const matches = matchingProvisionalMixedRules(evidence).filter((match) => match.priority <= rule.priority);
      if (matches.length !== 1 || matches[0].ruleId !== rule.id ||
          matches[0].contextKey !== provisionalMixedContextKey(context)) nativeCollisionRejects += 1;
      else acceptedPairs += 1;

      if (candidatePairs >= maximumPairs) break outer;
    }
  }

  return {
    ruleId: rule.id,
    contextKey: provisionalMixedContextKey(context),
    eligibleInputs: inputs.length,
    candidatePairs,
    acceptedPairs,
    solverDisagreements,
    nativeCollisionRejects,
    sameOutputRejects,
  };
}

const yields = ANA_CP008_PROVISIONAL_RULES.flatMap((rule) =>
  rule.contexts.map((context) => simulateContext(rule, context)));

assert.equal(yields.length, 69);
assert.equal(yields.reduce((sum, entry) => sum + entry.solverDisagreements, 0), 0);
for (const entry of yields) {
  assert.ok(entry.eligibleInputs >= 20, `${entry.contextKey} has only ${entry.eligibleInputs} eligible inputs.`);
  assert.ok(entry.acceptedPairs >= 40, `${entry.contextKey} has only ${entry.acceptedPairs} accepted pairs.`);
}

const ruleSummary = new Map<string, { contexts: number; eligibleInputs: number; acceptedPairs: number; collisionRejects: number }>();
for (const entry of yields) {
  const current = ruleSummary.get(entry.ruleId) ?? { contexts: 0, eligibleInputs: 0, acceptedPairs: 0, collisionRejects: 0 };
  current.contexts += 1;
  current.eligibleInputs = Math.max(current.eligibleInputs, entry.eligibleInputs);
  current.acceptedPairs += entry.acceptedPairs;
  current.collisionRejects += entry.nativeCollisionRejects;
  ruleSummary.set(entry.ruleId, current);
}

console.log("ANA-CP-008 provisional yield simulation passed.", {
  contextCount: yields.length,
  ruleSummary: Object.fromEntries(ruleSummary),
  weakestContexts: [...yields].sort((left, right) => left.acceptedPairs - right.acceptedPairs).slice(0, 10),
});
