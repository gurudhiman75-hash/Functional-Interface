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
  independentlyApplyProvisionalMixedRule,
  matchingProvisionalMixedRules,
  mixedEvidenceKey,
  type ProvisionalMixedEvidence,
} from "./provisional-independent-solver";
import {
  ANA_CP008_PROVISIONAL_RULES,
  provisionalMixedContextKey,
  type ProvisionalMixedContext,
  type ProvisionalMixedRuleDefinition,
} from "./provisional-rule-definitions";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBER_BOUND = 9999;

export interface MixedRuntimeOption {
  value: MixedResult;
  errorLabel: string;
}

export interface OddPairBuild {
  validPairs: readonly [
    ProvisionalMixedEvidence,
    ProvisionalMixedEvidence,
    ProvisionalMixedEvidence,
  ];
  oddPair: ProvisionalMixedEvidence;
  expectedOddOutput: MixedResult;
}

function rng(seed: number): () => number {
  let state = (seed ^ 0x9e3779b9) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function deterministicShuffle<T>(items: readonly T[], seed: number): T[] {
  const output = [...items];
  const random = rng(seed);
  for (let index = output.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [output[index], output[target]] = [output[target], output[index]];
  }
  return output;
}

function twoLetterSamples(): readonly string[] {
  const samples: string[] = [];
  for (let firstIndex = 0; firstIndex < ALPHABET.length; firstIndex += 1) {
    for (let secondOffset = 1; secondOffset <= 7; secondOffset += 2) {
      samples.push(ALPHABET[firstIndex] + ALPHABET[(firstIndex + secondOffset) % ALPHABET.length]);
    }
  }
  return samples;
}

const INPUT_CACHE = new Map<string, readonly MixedToken[]>();

export function inputsForRule(rule: ProvisionalMixedRuleDefinition): readonly MixedToken[] {
  const cached = INPUT_CACHE.get(rule.inputKind);
  if (cached) return cached;

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
    const numbers = new Set<number>();
    for (let number = -25; number <= 120; number += 1) numbers.add(number);
    for (const root of [6, 10, 11, 12, 13, 15]) numbers.add(root ** 3 - 1);
    for (const square of [16, 25, 36, 49, 64, 81, 100]) numbers.add(square);
    for (const number of [287, 320, 332, 440, 1032, 1176, 1330, 1727]) numbers.add(number);
    for (const letters of twoLetterSamples()) {
      for (const number of numbers) inputs.push(clusterNumberToken(letters, number));
    }
  } else if (rule.inputKind === "NUMBER_CLUSTER") {
    const numbers = new Set<number>();
    for (let number = 1; number <= 220; number += 1) numbers.add(number);
    for (let root = 2; root <= 60; root += 1) numbers.add(root * root - 1);
    for (const number of [78, 108, 120, 288, 332, 440]) numbers.add(number);
    for (const letters of twoLetterSamples()) {
      for (const number of numbers) inputs.push(numberClusterToken(number, letters));
    }
  } else if (rule.inputKind === "NUMBER_LETTER") {
    for (let number = 10; number <= 999 && inputs.length < 400; number += 1) {
      const letter = squaredDigitSumLetter(number);
      if (letter) inputs.push(numberLetterToken(number, letter));
    }
  }

  INPUT_CACHE.set(rule.inputKind, inputs);
  return inputs;
}

export function evidencePool(
  rule: ProvisionalMixedRuleDefinition,
  context: ProvisionalMixedContext,
): readonly ProvisionalMixedEvidence[] {
  const evidence: ProvisionalMixedEvidence[] = [];
  for (const input of inputsForRule(rule)) {
    if (!rule.accepts(input, context)) continue;
    const output = rule.apply(input, context);
    if (!output) continue;
    const independent = independentlyApplyProvisionalMixedRule(rule.id, context, input);
    if (!sameMixedToken(output, independent)) continue;
    evidence.push({ input, output });
    if (evidence.length >= 800) break;
  }
  return evidence;
}

export function isUniqueIntendedMatch(
  rule: ProvisionalMixedRuleDefinition,
  context: ProvisionalMixedContext,
  evidence: readonly ProvisionalMixedEvidence[],
): boolean {
  const expectedContextKey = provisionalMixedContextKey(context);
  const matches = matchingProvisionalMixedRules(evidence)
    .filter((match) => match.priority <= rule.priority);
  return matches.length === 1 && matches[0].ruleId === rule.id &&
    matches[0].contextKey === expectedContextKey;
}

export function chooseUniqueEvidence(
  rule: ProvisionalMixedRuleDefinition,
  context: ProvisionalMixedContext,
  count: 2 | 3,
  seed: number,
): readonly ProvisionalMixedEvidence[] {
  const pool = deterministicShuffle(evidencePool(rule, context), seed * 31 + rule.priority * 17);
  const limit = Math.min(pool.length, 180);
  for (let first = 0; first < limit; first += 1) {
    for (let second = first + 1; second < limit; second += 1) {
      if (sameMixedToken(pool[first].output, pool[second].output)) continue;
      const pair = [pool[first], pool[second]] as const;
      if (!isUniqueIntendedMatch(rule, context, pair)) continue;
      if (count === 2) return pair;
      for (let third = second + 1; third < limit; third += 1) {
        const triple = [pool[first], pool[second], pool[third]] as const;
        if (new Set(triple.map(mixedEvidenceKey)).size !== 3) continue;
        if (isUniqueIntendedMatch(rule, context, triple)) return triple;
      }
    }
  }
  throw new Error(`Unable to select ${count} unique evidence pairs for ${rule.id} ${provisionalMixedContextKey(context)}.`);
}

function boundedNumber(value: number): boolean {
  return Number.isSafeInteger(value) && Math.abs(value) <= NUMBER_BOUND;
}

export function mutateMixedResult(output: MixedResult): readonly MixedResult[] {
  switch (output.kind) {
    case "NUMBER":
      return [-5, -3, -2, -1, 1, 2, 3, 5]
        .map((delta) => output.number + delta)
        .filter(boundedNumber)
        .map(numberToken);
    case "LETTER":
      return [-3, -2, -1, 1, 2, 3]
        .map((delta) => letterToken(shiftLetter(output.letter, delta)));
    case "LETTER_NUMBER":
      return [
        letterNumberToken(shiftLetter(output.letter, 1), output.number),
        letterNumberToken(shiftLetter(output.letter, -1), output.number),
        ...(boundedNumber(output.number + 1) ? [letterNumberToken(output.letter, output.number + 1)] : []),
        ...(boundedNumber(output.number - 1) ? [letterNumberToken(output.letter, output.number - 1)] : []),
        ...(boundedNumber(output.number + 1)
          ? [letterNumberToken(shiftLetter(output.letter, 1), output.number + 1)]
          : []),
      ];
    case "NUMBER_LETTER":
      return [
        numberLetterToken(output.number, shiftLetter(output.letter, 1)),
        numberLetterToken(output.number, shiftLetter(output.letter, -1)),
        ...(boundedNumber(output.number + 1) ? [numberLetterToken(output.number + 1, output.letter)] : []),
        ...(boundedNumber(output.number - 1) ? [numberLetterToken(output.number - 1, output.letter)] : []),
      ];
    case "CLUSTER_NUMBER": {
      const plus = applyUniformLetterGroupShift(output.letters, 1);
      const minus = applyUniformLetterGroupShift(output.letters, -1);
      return [
        ...(plus ? [clusterNumberToken(plus, output.number)] : []),
        ...(minus ? [clusterNumberToken(minus, output.number)] : []),
        ...(boundedNumber(output.number + 1) ? [clusterNumberToken(output.letters, output.number + 1)] : []),
        ...(boundedNumber(output.number - 1) ? [clusterNumberToken(output.letters, output.number - 1)] : []),
      ];
    }
    case "NUMBER_CLUSTER": {
      const plus = applyUniformLetterGroupShift(output.letters, 1);
      const minus = applyUniformLetterGroupShift(output.letters, -1);
      return [
        ...(plus ? [numberClusterToken(output.number, plus)] : []),
        ...(minus ? [numberClusterToken(output.number, minus)] : []),
        ...(boundedNumber(output.number + 1) ? [numberClusterToken(output.number + 1, output.letters)] : []),
        ...(boundedNumber(output.number - 1) ? [numberClusterToken(output.number - 1, output.letters)] : []),
      ];
    }
    case "LETTER_GROUP":
      return [];
  }
}

function sameResultKind(left: MixedResult, right: MixedResult): boolean {
  return left.kind === right.kind;
}

function rawDirectCandidates(
  intendedRule: ProvisionalMixedRuleDefinition,
  intendedContext: ProvisionalMixedContext,
  targetInput: MixedToken,
  correct: MixedResult,
): readonly MixedRuntimeOption[] {
  const candidates: MixedRuntimeOption[] = [];
  for (const context of intendedRule.contexts) {
    if (provisionalMixedContextKey(context) === provisionalMixedContextKey(intendedContext)) continue;
    if (!intendedRule.accepts(targetInput, context)) continue;
    const output = intendedRule.apply(targetInput, context);
    if (output && sameResultKind(correct, output)) {
      candidates.push({ value: output, errorLabel: "WRONG_RULE_CONTEXT" });
    }
  }
  for (const rule of ANA_CP008_PROVISIONAL_RULES) {
    if (rule.id === intendedRule.id || rule.inputKind !== targetInput.kind) continue;
    for (const context of rule.contexts) {
      if (!rule.accepts(targetInput, context)) continue;
      const output = rule.apply(targetInput, context);
      if (output && sameResultKind(correct, output)) {
        candidates.push({ value: output, errorLabel: "WRONG_OPERATION_FAMILY" });
      }
    }
  }
  candidates.push(...mutateMixedResult(correct).map((value) => ({
    value,
    errorLabel: "NEAR_MISCONCEPTION",
  })));
  return candidates;
}

export function safeDirectOptions(
  rule: ProvisionalMixedRuleDefinition,
  context: ProvisionalMixedContext,
  source: ProvisionalMixedEvidence,
  target: ProvisionalMixedEvidence,
  seed: number,
): readonly MixedRuntimeOption[] {
  const distractors: MixedRuntimeOption[] = [];
  const candidates = deterministicShuffle(
    rawDirectCandidates(rule, context, target.input, target.output),
    seed * 43 + 11,
  );
  for (const candidate of candidates) {
    if (!sameResultKind(target.output, candidate.value) || sameMixedToken(target.output, candidate.value)) continue;
    if (distractors.some((entry) => sameMixedToken(entry.value, candidate.value))) continue;
    const alternative = matchingProvisionalMixedRules([
      source,
      { input: target.input, output: candidate.value },
    ]).length > 0;
    if (alternative) continue;
    distractors.push(candidate);
    if (distractors.length === 3) break;
  }
  if (distractors.length !== 3) {
    throw new Error(`Unable to build three safe distractors for ${rule.id} ${provisionalMixedContextKey(context)}.`);
  }
  return deterministicShuffle(
    [{ value: target.output, errorLabel: "CORRECT" }, ...distractors],
    seed * 47 + 19,
  );
}

export function buildOddPair(
  rule: ProvisionalMixedRuleDefinition,
  context: ProvisionalMixedContext,
  seed: number,
): OddPairBuild {
  const valid = chooseUniqueEvidence(rule, context, 3, seed) as readonly [
    ProvisionalMixedEvidence,
    ProvisionalMixedEvidence,
    ProvisionalMixedEvidence,
  ];
  const references = [valid[0], valid[1]] as const;
  const excluded = new Set(valid.map(mixedEvidenceKey));
  const pool = deterministicShuffle(evidencePool(rule, context), seed * 59 + 23);

  for (const source of pool) {
    if (excluded.has(mixedEvidenceKey(source))) continue;
    const mutations = deterministicShuffle(mutateMixedResult(source.output), seed * 61 + 29);
    for (const candidateOutput of mutations) {
      if (sameMixedToken(candidateOutput, source.output)) continue;
      const candidate: ProvisionalMixedEvidence = { input: source.input, output: candidateOutput };
      if (excluded.has(mixedEvidenceKey(candidate))) continue;
      if (matchingProvisionalMixedRules([...references, candidate]).length > 0) continue;
      const expectedOddOutput = rule.apply(source.input, context);
      if (!expectedOddOutput || sameMixedToken(expectedOddOutput, candidateOutput)) continue;
      return { validPairs: valid, oddPair: candidate, expectedOddOutput };
    }
  }
  throw new Error(`Unable to build an odd pair for ${rule.id} ${provisionalMixedContextKey(context)}.`);
}

export function followsIntendedRule(
  rule: ProvisionalMixedRuleDefinition,
  context: ProvisionalMixedContext,
  evidence: ProvisionalMixedEvidence,
): boolean {
  return sameMixedToken(
    independentlyApplyProvisionalMixedRule(rule.id, context, evidence.input),
    evidence.output,
  );
}

export function mixedOptionKey(option: MixedRuntimeOption): string {
  return mixedTokenKey(option.value);
}
