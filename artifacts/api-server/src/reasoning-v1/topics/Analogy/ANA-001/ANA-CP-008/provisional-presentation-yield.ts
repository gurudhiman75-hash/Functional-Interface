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

interface PresentationSummary {
  ruleId: string;
  contextKey: string;
  directCompletion: true;
  equivalentPairSelection: true;
  oddPairSelection: true;
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
  } else if (rule.inputKind === "NUMBER_LETTER") {
    for (let number = 10; number <= 999 && inputs.length < 300; number += 1) {
      const letter = squaredDigitSumLetter(number);
      if (letter) inputs.push(numberLetterToken(number, letter));
    }
  } else if (rule.inputKind === "NUMBER_CLUSTER") {
    for (const letters of twoLetterSamples()) {
      for (const number of numberClusterNumbers()) {
        inputs.push(numberClusterToken(number, letters));
      }
    }
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
    if (evidence.length >= 600) break;
  }
  return evidence;
}

function isUniqueIntendedMatch(
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

function chooseGoodEvidence(
  rule: ProvisionalMixedRuleDefinition,
  context: ProvisionalMixedContext,
): readonly [ProvisionalMixedEvidence, ProvisionalMixedEvidence, ProvisionalMixedEvidence] {
  const pool = evidencePool(rule, context);
  assert.ok(pool.length >= 5, `${rule.id} ${provisionalMixedContextKey(context)} has insufficient evidence.`);

  for (let first = 0; first < pool.length; first += 1) {
    for (let second = first + 1; second < pool.length; second += 1) {
      const reference = [pool[first], pool[second]] as const;
      if (!isUniqueIntendedMatch(rule, context, reference)) continue;
      for (let third = second + 1; third < pool.length; third += 1) {
        const full = [pool[first], pool[second], pool[third]] as const;
        if (isUniqueIntendedMatch(rule, context, full)) return full;
      }
    }
  }

  throw new Error(`${rule.id} ${provisionalMixedContextKey(context)} has no three-pair unique reference set.`);
}

function boundedNumber(value: number): boolean {
  return Number.isSafeInteger(value) && Math.abs(value) <= NUMBER_BOUND;
}

function mutateOutput(output: MixedResult): readonly MixedResult[] {
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
        ...(boundedNumber(output.number + 1)
          ? [letterNumberToken(output.letter, output.number + 1)]
          : []),
        ...(boundedNumber(output.number - 1)
          ? [letterNumberToken(output.letter, output.number - 1)]
          : []),
      ];
    case "NUMBER_LETTER":
      return [
        numberLetterToken(output.number, shiftLetter(output.letter, 1)),
        numberLetterToken(output.number, shiftLetter(output.letter, -1)),
        ...(boundedNumber(output.number + 1)
          ? [numberLetterToken(output.number + 1, output.letter)]
          : []),
        ...(boundedNumber(output.number - 1)
          ? [numberLetterToken(output.number - 1, output.letter)]
          : []),
      ];
    case "CLUSTER_NUMBER": {
      const plus = applyUniformLetterGroupShift(output.letters, 1);
      const minus = applyUniformLetterGroupShift(output.letters, -1);
      return [
        ...(plus ? [clusterNumberToken(plus, output.number)] : []),
        ...(minus ? [clusterNumberToken(minus, output.number)] : []),
        ...(boundedNumber(output.number + 1)
          ? [clusterNumberToken(output.letters, output.number + 1)]
          : []),
        ...(boundedNumber(output.number - 1)
          ? [clusterNumberToken(output.letters, output.number - 1)]
          : []),
      ];
    }
    case "NUMBER_CLUSTER": {
      const plus = applyUniformLetterGroupShift(output.letters, 1);
      const minus = applyUniformLetterGroupShift(output.letters, -1);
      return [
        ...(plus ? [numberClusterToken(output.number, plus)] : []),
        ...(minus ? [numberClusterToken(output.number, minus)] : []),
        ...(boundedNumber(output.number + 1)
          ? [numberClusterToken(output.number + 1, output.letters)]
          : []),
        ...(boundedNumber(output.number - 1)
          ? [numberClusterToken(output.number - 1, output.letters)]
          : []),
      ];
    }
    case "LETTER_GROUP":
      return [];
  }
}

function wrongPairOptions(
  rule: ProvisionalMixedRuleDefinition,
  context: ProvisionalMixedContext,
  references: readonly [ProvisionalMixedEvidence, ProvisionalMixedEvidence],
  excluded: readonly ProvisionalMixedEvidence[],
): readonly [ProvisionalMixedEvidence, ProvisionalMixedEvidence, ProvisionalMixedEvidence] {
  const excludedKeys = new Set(excluded.map(mixedEvidenceKey));
  const wrong: ProvisionalMixedEvidence[] = [];

  for (const source of evidencePool(rule, context)) {
    if (excludedKeys.has(mixedEvidenceKey(source))) continue;
    for (const candidateOutput of mutateOutput(source.output)) {
      if (sameMixedToken(candidateOutput, source.output)) continue;
      const candidate: ProvisionalMixedEvidence = { input: source.input, output: candidateOutput };
      const key = mixedEvidenceKey(candidate);
      if (excludedKeys.has(key) || wrong.some((entry) => mixedEvidenceKey(entry) === key)) continue;
      if (isUniqueIntendedMatch(rule, context, [...references, candidate])) continue;
      if (matchingProvisionalMixedRules([...references, candidate]).length > 0) continue;
      wrong.push(candidate);
      if (wrong.length === 3) {
        return wrong as unknown as readonly [
          ProvisionalMixedEvidence,
          ProvisionalMixedEvidence,
          ProvisionalMixedEvidence,
        ];
      }
    }
  }

  throw new Error(`${rule.id} ${provisionalMixedContextKey(context)} cannot build three wrong pair options.`);
}

function followsIntended(
  rule: ProvisionalMixedRuleDefinition,
  context: ProvisionalMixedContext,
  evidence: ProvisionalMixedEvidence,
): boolean {
  return sameMixedToken(
    independentlyApplyProvisionalMixedRule(rule.id, context, evidence.input),
    evidence.output,
  );
}

const summaries: PresentationSummary[] = [];

for (const rule of ANA_CP008_PROVISIONAL_RULES) {
  for (const context of rule.contexts) {
    const good = chooseGoodEvidence(rule, context);
    const references = [good[0], good[1]] as const;
    const correctPairOption = good[2];
    const wrongOptions = wrongPairOptions(rule, context, references, good);

    const pairSelectionOptions = [correctPairOption, ...wrongOptions];
    assert.equal(new Set(pairSelectionOptions.map(mixedEvidenceKey)).size, 4);
    assert.equal(
      pairSelectionOptions.filter((option) =>
        isUniqueIntendedMatch(rule, context, [...references, option])).length,
      1,
      `${rule.id} ${provisionalMixedContextKey(context)} pair selection is not single-correct.`,
    );

    const oddCandidate = wrongOptions[0];
    const oddPairOptions = [good[0], good[1], good[2], oddCandidate];
    assert.equal(new Set(oddPairOptions.map(mixedEvidenceKey)).size, 4);
    assert.ok(isUniqueIntendedMatch(rule, context, good));
    assert.equal(
      oddPairOptions.filter((option) => followsIntended(rule, context, option)).length,
      3,
      `${rule.id} ${provisionalMixedContextKey(context)} odd-pair set does not contain exactly three valid pairs.`,
    );
    assert.ok(!followsIntended(rule, context, oddCandidate));

    summaries.push({
      ruleId: rule.id,
      contextKey: provisionalMixedContextKey(context),
      directCompletion: true,
      equivalentPairSelection: true,
      oddPairSelection: true,
    });
  }
}

assert.equal(summaries.length, 81);

console.log("ANA-CP-008 presentation-yield audit passed.", {
  contexts: summaries.length,
  directCompletionContexts: summaries.filter((entry) => entry.directCompletion).length,
  equivalentPairSelectionContexts: summaries.filter((entry) => entry.equivalentPairSelection).length,
  oddPairSelectionContexts: summaries.filter((entry) => entry.oddPairSelection).length,
});
