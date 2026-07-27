import assert from "node:assert/strict";
import { shiftLetter } from "../foundation/alphabet";
import { matchingAlphabetRules } from "../ANA-CP-005/independent-solver";
import { matchingClusterRules } from "../ANA-CP-006/independent-solver";
import { squaredDigitSumLetter } from "./foundation/mixed-arithmetic";
import {
  clusterNumberToken,
  letterGroupToken,
  letterNumberToken,
  letterToken,
  mixedTokenKey,
  mixedTokenLetterText,
  mixedTokenNumber,
  numberClusterToken,
  numberLetterToken,
  numberToken,
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

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBER_BOUND = 9999;

interface BridgeSummary {
  ruleId: string;
  contextKey: string;
  inputKind: MixedToken["kind"];
  outputKind: MixedToken["kind"];
  cp005ComponentMatches: readonly string[];
  cp006ComponentMatches: readonly string[];
  inputLetterIndispensable: boolean | null;
  outputLetterIndispensable: boolean | null;
  inputNumberIndispensable: boolean | null;
  outputNumberIndispensable: boolean | null;
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

function numberClusterNumbers(): readonly number[] {
  const numbers = new Set<number>();
  for (let number = 1; number <= 200; number += 1) numbers.add(number);
  for (let root = 2; root <= 60; root += 1) numbers.add(root * root - 1);
  for (const sourceNumber of [78, 108, 120, 288, 332, 440, 1330]) numbers.add(sourceNumber);
  return [...numbers];
}

function inputsForRule(rule: ProvisionalMixedRuleDefinition): readonly MixedToken[] {
  const inputs: MixedToken[] = [];
  if (rule.inputKind === "LETTER") {
    return [...ALPHABET].map(letterToken);
  }
  if (rule.inputKind === "LETTER_GROUP") {
    for (const first of ALPHABET) {
      for (const second of ALPHABET) {
        if (first !== second) inputs.push(letterGroupToken(first + second));
      }
    }
    return inputs;
  }
  if (rule.inputKind === "LETTER_NUMBER") {
    for (const letter of ALPHABET) {
      for (let number = 8; number <= 64; number += 1) {
        inputs.push(letterNumberToken(letter, number));
      }
    }
    return inputs;
  }
  if (rule.inputKind === "CLUSTER_NUMBER") {
    for (const letters of twoLetterSamples()) {
      for (let number = -25; number <= 100; number += 1) {
        inputs.push(clusterNumberToken(letters, number));
      }
    }
    return inputs;
  }
  if (rule.inputKind === "NUMBER_LETTER") {
    for (let number = 10; number <= 999 && inputs.length < 300; number += 1) {
      const letter = squaredDigitSumLetter(number);
      if (letter) inputs.push(numberLetterToken(number, letter));
    }
    return inputs;
  }
  if (rule.inputKind === "NUMBER_CLUSTER") {
    for (const letters of twoLetterSamples()) {
      for (const number of numberClusterNumbers()) {
        inputs.push(numberClusterToken(number, letters));
      }
    }
    return inputs;
  }
  return inputs;
}

function evidencePool(
  rule: ProvisionalMixedRuleDefinition,
  context: ProvisionalMixedContext,
): readonly ProvisionalMixedEvidence[] {
  const evidence: ProvisionalMixedEvidence[] = [];
  for (const input of inputsForRule(rule)) {
    if (!rule.accepts(input, context)) continue;
    const output = rule.apply(input, context);
    if (!output) continue;
    evidence.push({ input, output });
    if (evidence.length >= 400) break;
  }
  return evidence;
}

function uniquelyMatchesIntended(
  rule: ProvisionalMixedRuleDefinition,
  context: ProvisionalMixedContext,
  evidence: readonly ProvisionalMixedEvidence[],
): boolean {
  const expectedKey = provisionalMixedContextKey(context);
  const matches = matchingProvisionalMixedRules(evidence)
    .filter((match) => match.priority <= rule.priority);
  return matches.length === 1 && matches[0].ruleId === rule.id && matches[0].contextKey === expectedKey;
}

function chooseUniquePair(
  rule: ProvisionalMixedRuleDefinition,
  context: ProvisionalMixedContext,
): readonly [ProvisionalMixedEvidence, ProvisionalMixedEvidence] {
  const pool = evidencePool(rule, context);
  assert.ok(pool.length >= 2, `${rule.id} ${provisionalMixedContextKey(context)} has insufficient bridge evidence.`);
  for (let first = 0; first < pool.length; first += 1) {
    for (let second = first + 1; second < pool.length; second += 1) {
      const pair = [pool[first], pool[second]] as const;
      if (uniquelyMatchesIntended(rule, context, pair)) return pair;
    }
  }
  throw new Error(`${rule.id} ${provisionalMixedContextKey(context)} has no unique bridge pair.`);
}

function boundedNumber(value: number): boolean {
  return Number.isSafeInteger(value) && Math.abs(value) <= NUMBER_BOUND;
}

function mutateLetters(token: MixedToken): readonly MixedToken[] {
  const amounts = [-3, -2, -1, 1, 2, 3] as const;
  switch (token.kind) {
    case "LETTER":
      return amounts.map((amount) => letterToken(shiftLetter(token.letter, amount)));
    case "LETTER_GROUP":
      return amounts.flatMap((amount) => [
        letterGroupToken(shiftLetter(token.letters[0], amount) + token.letters.slice(1)),
        letterGroupToken([...token.letters].map((letter) => shiftLetter(letter, amount)).join("")),
      ]);
    case "LETTER_NUMBER":
      return amounts.map((amount) => letterNumberToken(shiftLetter(token.letter, amount), token.number));
    case "NUMBER_LETTER":
      return amounts.map((amount) => numberLetterToken(token.number, shiftLetter(token.letter, amount)));
    case "CLUSTER_NUMBER":
      return amounts.flatMap((amount) => [
        clusterNumberToken(shiftLetter(token.letters[0], amount) + token.letters.slice(1), token.number),
        clusterNumberToken([...token.letters].map((letter) => shiftLetter(letter, amount)).join(""), token.number),
      ]);
    case "NUMBER_CLUSTER":
      return amounts.flatMap((amount) => [
        numberClusterToken(token.number, shiftLetter(token.letters[0], amount) + token.letters.slice(1)),
        numberClusterToken(token.number, [...token.letters].map((letter) => shiftLetter(letter, amount)).join("")),
      ]);
    case "NUMBER":
      return [];
  }
}

function mutateNumber(token: MixedToken): readonly MixedToken[] {
  const values = [-3, -2, -1, 1, 2, 3]
    .map((delta) => mixedTokenNumber(token) === null ? null : mixedTokenNumber(token)! + delta)
    .filter((value): value is number => value !== null && boundedNumber(value));
  switch (token.kind) {
    case "NUMBER":
      return values.map(numberToken);
    case "LETTER_NUMBER":
      return values.map((number) => letterNumberToken(token.letter, number));
    case "NUMBER_LETTER":
      return values.map((number) => numberLetterToken(number, token.letter));
    case "CLUSTER_NUMBER":
      return values.map((number) => clusterNumberToken(token.letters, number));
    case "NUMBER_CLUSTER":
      return values.map((number) => numberClusterToken(number, token.letters));
    case "LETTER":
    case "LETTER_GROUP":
      return [];
  }
}

function mutationBreaksAllNativeRules(
  references: readonly [ProvisionalMixedEvidence, ProvisionalMixedEvidence],
  evidenceIndex: 0 | 1,
  side: "input" | "output",
  variants: readonly MixedToken[],
): boolean {
  for (const variant of variants) {
    const mutated: [ProvisionalMixedEvidence, ProvisionalMixedEvidence] = [
      { ...references[0] },
      { ...references[1] },
    ];
    mutated[evidenceIndex] = side === "input"
      ? { input: variant, output: mutated[evidenceIndex].output }
      : { input: mutated[evidenceIndex].input, output: variant };
    if (matchingProvisionalMixedRules(mutated).length === 0) return true;
  }
  return false;
}

function pureLetterMatches(
  references: readonly [ProvisionalMixedEvidence, ProvisionalMixedEvidence],
): { cp005: readonly string[]; cp006: readonly string[] } {
  const pairs = references.map((entry) => ({
    left: mixedTokenLetterText(entry.input),
    right: mixedTokenLetterText(entry.output),
  }));
  if (pairs.some((pair) => pair.left === null || pair.right === null)) return { cp005: [], cp006: [] };
  const concrete = pairs.map((pair) => ({ left: pair.left!, right: pair.right! }));
  if (concrete.every((pair) => pair.left.length === 1 && pair.right.length === 1)) {
    return {
      cp005: [...new Set(matchingAlphabetRules(concrete).map((match) => match.ruleId))].sort(),
      cp006: [],
    };
  }
  return {
    cp005: [],
    cp006: [...new Set(matchingClusterRules(concrete).map((match) => match.ruleId))].sort(),
  };
}

const summaries: BridgeSummary[] = [];

for (const rule of ANA_CP008_PROVISIONAL_RULES) {
  for (const context of rule.contexts) {
    const references = chooseUniquePair(rule, context);
    const pure = pureLetterMatches(references);

    const inputHasLetters = mixedTokenLetterText(references[1].input) !== null;
    const outputHasLetters = mixedTokenLetterText(references[1].output) !== null;
    const inputHasNumber = mixedTokenNumber(references[1].input) !== null;
    const outputHasNumber = mixedTokenNumber(references[1].output) !== null;

    const inputLetterIndispensable = inputHasLetters
      ? mutationBreaksAllNativeRules(references, 1, "input", mutateLetters(references[1].input))
      : null;
    const outputLetterIndispensable = outputHasLetters
      ? mutationBreaksAllNativeRules(references, 1, "output", mutateLetters(references[1].output))
      : null;
    const inputNumberIndispensable = inputHasNumber
      ? mutationBreaksAllNativeRules(references, 1, "input", mutateNumber(references[1].input))
      : null;
    const outputNumberIndispensable = outputHasNumber
      ? mutationBreaksAllNativeRules(references, 1, "output", mutateNumber(references[1].output))
      : null;

    if (inputHasLetters) {
      assert.equal(inputLetterIndispensable, true,
        `${rule.id} ${provisionalMixedContextKey(context)} has a decorative input letter component.`);
    }
    if (outputHasLetters) {
      assert.equal(outputLetterIndispensable, true,
        `${rule.id} ${provisionalMixedContextKey(context)} has a decorative output letter component.`);
    }
    if (inputHasNumber) {
      assert.equal(inputNumberIndispensable, true,
        `${rule.id} ${provisionalMixedContextKey(context)} has a decorative input number component.`);
    }
    if (outputHasNumber) {
      assert.equal(outputNumberIndispensable, true,
        `${rule.id} ${provisionalMixedContextKey(context)} has a decorative output number component.`);
    }

    const noVisibleNumber = !inputHasNumber && !outputHasNumber;
    if (noVisibleNumber) {
      assert.equal(pure.cp005.length + pure.cp006.length, 0,
        `${rule.id} ${provisionalMixedContextKey(context)} collapses into a pure letter authority.`);
    }

    const inputLetters = mixedTokenLetterText(references[1].input);
    const outputLetters = mixedTokenLetterText(references[1].output);
    if (inputLetters !== null && outputLetters !== null) {
      assert.notEqual(inputLetters, outputLetters,
        `${rule.id} ${provisionalMixedContextKey(context)} leaves the letter component unchanged.`);
    }
    const inputNumber = mixedTokenNumber(references[1].input);
    const outputNumber = mixedTokenNumber(references[1].output);
    if (inputNumber !== null && outputNumber !== null) {
      assert.notEqual(inputNumber, outputNumber,
        `${rule.id} ${provisionalMixedContextKey(context)} leaves the number component unchanged.`);
    }

    summaries.push({
      ruleId: rule.id,
      contextKey: provisionalMixedContextKey(context),
      inputKind: rule.inputKind,
      outputKind: rule.outputKind,
      cp005ComponentMatches: pure.cp005,
      cp006ComponentMatches: pure.cp006,
      inputLetterIndispensable,
      outputLetterIndispensable,
      inputNumberIndispensable,
      outputNumberIndispensable,
    });
  }
}

assert.equal(summaries.length, 81);
assert.ok(summaries.some((entry) => entry.cp005ComponentMatches.length > 0),
  "No CP-005 component bridge was exercised.");
assert.ok(summaries.some((entry) => entry.cp006ComponentMatches.length > 0),
  "No CP-006 component bridge was exercised.");
assert.equal(new Set(summaries.map((entry) => `${entry.ruleId}:${entry.contextKey}`)).size, summaries.length);

console.log("ANA-CP-008 cross-topic bridge audit passed.", {
  contexts: summaries.length,
  cp005ComponentBridgeContexts: summaries.filter((entry) => entry.cp005ComponentMatches.length > 0).length,
  cp006ComponentBridgeContexts: summaries.filter((entry) => entry.cp006ComponentMatches.length > 0).length,
  crossDomainWithoutPureLetterCollapse: summaries.filter((entry) =>
    entry.inputNumberIndispensable === null && entry.outputNumberIndispensable === null &&
    entry.cp005ComponentMatches.length === 0 && entry.cp006ComponentMatches.length === 0).length,
  allVisibleComponentsIndispensable: summaries.every((entry) =>
    [
      entry.inputLetterIndispensable,
      entry.outputLetterIndispensable,
      entry.inputNumberIndispensable,
      entry.outputNumberIndispensable,
    ].every((value) => value === null || value)),
  sampleComponentBridges: summaries
    .filter((entry) => entry.cp005ComponentMatches.length > 0 || entry.cp006ComponentMatches.length > 0)
    .slice(0, 10),
});
