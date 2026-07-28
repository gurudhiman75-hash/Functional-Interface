import assert from "node:assert/strict";
import { shiftLetter } from "../foundation/alphabet";
import {
  applyUniformLetterGroupShift,
  squaredDigitSumLetter,
} from "./foundation/mixed-arithmetic";
import {
  clusterNumberToken,
  letterGroupToken,
  letterNumberToken,
  letterToken,
  mixedTokenKey,
  numberClusterToken,
  numberLetterToken,
  numberToken,
  sameMixedToken,
  type MixedResult,
  type MixedToken,
} from "./foundation/mixed-token";
import {
  matchingProvisionalMixedRules,
  type ProvisionalMixedEvidence,
} from "./provisional-independent-solver";
import {
  ANA_CP008_PROVISIONAL_RULES,
  provisionalMixedContextKey,
  type ProvisionalMixedContext,
  type ProvisionalMixedRuleDefinition,
} from "./provisional-rule-definitions";

interface AcceptedPair {
  sourceInput: MixedToken;
  sourceOutput: MixedResult;
  targetInput: MixedToken;
  targetOutput: MixedResult;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const bounded = (value: number): boolean =>
  Number.isSafeInteger(value) && Math.abs(value) <= 9999;

function twoLetterSamples(): readonly string[] {
  const samples: string[] = [];
  for (let firstIndex = 0; firstIndex < ALPHABET.length; firstIndex += 1) {
    for (let secondOffset = 1; secondOffset <= 7; secondOffset += 2) {
      samples.push(ALPHABET[firstIndex] + ALPHABET[(firstIndex + secondOffset) % ALPHABET.length]);
    }
  }
  return samples;
}

function inputsForRule(rule: ProvisionalMixedRuleDefinition): readonly MixedToken[] {
  const inputs: MixedToken[] = [];
  if (rule.inputKind === "LETTER") {
    inputs.push(...[...ALPHABET].map(letterToken));
  } else if (rule.inputKind === "LETTER_GROUP") {
    for (const first of ALPHABET) {
      for (const second of ALPHABET) {
        if (first !== second) inputs.push(letterGroupToken(first + second));
      }
    }
  } else if (rule.inputKind === "LETTER_NUMBER") {
    for (const letter of ALPHABET) {
      for (let number = 8; number <= 64; number += 1) {
        inputs.push(letterNumberToken(letter, number));
      }
    }
  } else if (rule.inputKind === "CLUSTER_NUMBER") {
    for (const letters of twoLetterSamples()) {
      for (let number = -25; number <= 100; number += 1) {
        inputs.push(clusterNumberToken(letters, number));
      }
    }
  } else if (rule.inputKind === "NUMBER_CLUSTER") {
    const numbers = new Set<number>();
    for (let number = 1; number <= 200; number += 1) numbers.add(number);
    for (let root = 2; root <= 60; root += 1) numbers.add(root * root - 1);
    for (const number of [78, 108, 120, 288, 332, 440]) numbers.add(number);
    for (const letters of twoLetterSamples()) {
      for (const number of numbers) inputs.push(numberClusterToken(number, letters));
    }
  } else if (rule.inputKind === "NUMBER_LETTER") {
    for (let number = 10; number <= 999 && inputs.length < 300; number += 1) {
      const letter = squaredDigitSumLetter(number);
      if (letter) inputs.push(numberLetterToken(number, letter));
    }
  }
  return inputs;
}

function findAcceptedPair(
  rule: ProvisionalMixedRuleDefinition,
  context: ProvisionalMixedContext,
): AcceptedPair | null {
  const inputs = inputsForRule(rule).filter((input) => rule.accepts(input, context));
  const intendedContextKey = provisionalMixedContextKey(context);
  for (let sourceIndex = 0; sourceIndex < inputs.length; sourceIndex += 1) {
    for (let targetIndex = sourceIndex + 1; targetIndex < inputs.length; targetIndex += 1) {
      const sourceInput = inputs[sourceIndex];
      const targetInput = inputs[targetIndex];
      const sourceOutput = rule.apply(sourceInput, context);
      const targetOutput = rule.apply(targetInput, context);
      if (!sourceOutput || !targetOutput || sameMixedToken(sourceOutput, targetOutput)) continue;
      const evidence: readonly ProvisionalMixedEvidence[] = [
        { input: sourceInput, output: sourceOutput },
        { input: targetInput, output: targetOutput },
      ];
      const matches = matchingProvisionalMixedRules(evidence)
        .filter((match) => match.priority <= rule.priority);
      if (matches.length === 1 && matches[0].ruleId === rule.id &&
          matches[0].contextKey === intendedContextKey) {
        return { sourceInput, sourceOutput, targetInput, targetOutput };
      }
    }
  }
  return null;
}

const sameResultKind = (left: MixedResult, right: MixedResult): boolean =>
  left.kind === right.kind;

function genericCandidates(correct: MixedResult): readonly MixedResult[] {
  switch (correct.kind) {
    case "NUMBER":
      return [-5, -3, -2, -1, 1, 2, 3, 5]
        .map((delta) => correct.number + delta)
        .filter(bounded)
        .map(numberToken);
    case "LETTER":
      return [-3, -2, -1, 1, 2, 3]
        .map((delta) => letterToken(shiftLetter(correct.letter, delta)));
    case "LETTER_NUMBER":
      return [
        letterNumberToken(shiftLetter(correct.letter, 1), correct.number),
        letterNumberToken(shiftLetter(correct.letter, -1), correct.number),
        ...(bounded(correct.number + 1)
          ? [letterNumberToken(correct.letter, correct.number + 1)]
          : []),
        ...(bounded(correct.number - 1)
          ? [letterNumberToken(correct.letter, correct.number - 1)]
          : []),
        ...(bounded(correct.number + 1)
          ? [letterNumberToken(shiftLetter(correct.letter, 1), correct.number + 1)]
          : []),
        ...(bounded(correct.number - 1)
          ? [letterNumberToken(shiftLetter(correct.letter, -1), correct.number - 1)]
          : []),
      ];
    case "NUMBER_LETTER":
      return [
        ...(bounded(correct.number + 1)
          ? [numberLetterToken(correct.number + 1, correct.letter)]
          : []),
        ...(bounded(correct.number - 1)
          ? [numberLetterToken(correct.number - 1, correct.letter)]
          : []),
        numberLetterToken(correct.number, shiftLetter(correct.letter, 1)),
        numberLetterToken(correct.number, shiftLetter(correct.letter, -1)),
        ...(bounded(correct.number + 1)
          ? [numberLetterToken(correct.number + 1, shiftLetter(correct.letter, 1))]
          : []),
        ...(bounded(correct.number - 1)
          ? [numberLetterToken(correct.number - 1, shiftLetter(correct.letter, -1))]
          : []),
      ];
    case "CLUSTER_NUMBER": {
      const plus = applyUniformLetterGroupShift(correct.letters, 1);
      const minus = applyUniformLetterGroupShift(correct.letters, -1);
      return [
        ...(plus ? [clusterNumberToken(plus, correct.number)] : []),
        ...(minus ? [clusterNumberToken(minus, correct.number)] : []),
        ...(bounded(correct.number + 1)
          ? [clusterNumberToken(correct.letters, correct.number + 1)]
          : []),
        ...(bounded(correct.number - 1)
          ? [clusterNumberToken(correct.letters, correct.number - 1)]
          : []),
        ...(plus && bounded(correct.number + 1)
          ? [clusterNumberToken(plus, correct.number + 1)]
          : []),
        ...(minus && bounded(correct.number - 1)
          ? [clusterNumberToken(minus, correct.number - 1)]
          : []),
      ];
    }
    case "NUMBER_CLUSTER": {
      const plus = applyUniformLetterGroupShift(correct.letters, 1);
      const minus = applyUniformLetterGroupShift(correct.letters, -1);
      return [
        ...(plus ? [numberClusterToken(correct.number, plus)] : []),
        ...(minus ? [numberClusterToken(correct.number, minus)] : []),
        ...(bounded(correct.number + 1)
          ? [numberClusterToken(correct.number + 1, correct.letters)]
          : []),
        ...(bounded(correct.number - 1)
          ? [numberClusterToken(correct.number - 1, correct.letters)]
          : []),
        ...(plus && bounded(correct.number + 1)
          ? [numberClusterToken(correct.number + 1, plus)]
          : []),
        ...(minus && bounded(correct.number - 1)
          ? [numberClusterToken(correct.number - 1, minus)]
          : []),
      ];
    }
    case "LETTER_GROUP":
      return [];
  }
}

function rawCandidates(
  intendedRule: ProvisionalMixedRuleDefinition,
  intendedContext: ProvisionalMixedContext,
  pair: AcceptedPair,
): readonly MixedResult[] {
  const candidates: MixedResult[] = [];
  for (const context of intendedRule.contexts) {
    if (provisionalMixedContextKey(context) === provisionalMixedContextKey(intendedContext)) continue;
    if (!intendedRule.accepts(pair.targetInput, context)) continue;
    const output = intendedRule.apply(pair.targetInput, context);
    if (output && sameResultKind(pair.targetOutput, output)) candidates.push(output);
  }
  for (const rule of ANA_CP008_PROVISIONAL_RULES) {
    if (rule.id === intendedRule.id || rule.inputKind !== pair.targetInput.kind) continue;
    for (const context of rule.contexts) {
      if (!rule.accepts(pair.targetInput, context)) continue;
      const output = rule.apply(pair.targetInput, context);
      if (output && sameResultKind(pair.targetOutput, output)) candidates.push(output);
    }
  }
  candidates.push(...genericCandidates(pair.targetOutput));
  return candidates;
}

function formsAlternative(pair: AcceptedPair, candidate: MixedResult): boolean {
  return matchingProvisionalMixedRules([
    { input: pair.sourceInput, output: pair.sourceOutput },
    { input: pair.targetInput, output: candidate },
  ]).length > 0;
}

const summaries: Array<{
  ruleId: string;
  contextKey: string;
  acceptedDistractors: number;
  rejectedAlternatives: number;
}> = [];

for (const rule of ANA_CP008_PROVISIONAL_RULES) {
  for (const context of rule.contexts) {
    const pair = findAcceptedPair(rule, context);
    assert.ok(pair, `${rule.id} ${provisionalMixedContextKey(context)} has no accepted pair.`);
    const distractors: MixedResult[] = [];
    let rejectedAlternatives = 0;

    for (const candidate of rawCandidates(rule, context, pair)) {
      if (!sameResultKind(pair.targetOutput, candidate) || sameMixedToken(pair.targetOutput, candidate)) {
        continue;
      }
      if (distractors.some((existing) => sameMixedToken(existing, candidate))) continue;
      if (formsAlternative(pair, candidate)) {
        rejectedAlternatives += 1;
        continue;
      }
      distractors.push(candidate);
      if (distractors.length === 3) break;
    }

    assert.equal(
      distractors.length,
      3,
      `${rule.id} ${provisionalMixedContextKey(context)} cannot produce three safe distractors.`,
    );
    assert.equal(new Set([pair.targetOutput, ...distractors].map(mixedTokenKey)).size, 4);
    summaries.push({
      ruleId: rule.id,
      contextKey: provisionalMixedContextKey(context),
      acceptedDistractors: distractors.length,
      rejectedAlternatives,
    });
  }
}

assert.equal(summaries.length, 81);

console.log("ANA-CP-008 provisional option-yield audit passed.", {
  contexts: summaries.length,
  validatedOptionSets: summaries.length,
  totalDistractors: summaries.reduce((sum, entry) => sum + entry.acceptedDistractors, 0),
  rejectedAlternatives: summaries.reduce((sum, entry) => sum + entry.rejectedAlternatives, 0),
});
