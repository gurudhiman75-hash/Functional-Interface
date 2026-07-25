import assert from "node:assert/strict";
import { matchingClusterRules } from "../ANA-CP-006/independent-solver";
import { shiftLetter } from "../foundation/alphabet";
import { enabledPilotWords, type AnaCp007PilotWordRecord } from "./foundation/word-registry";
import { removeConsonants, removeVowels } from "./foundation/word-structure";
import {
  matchingProvisionalWordRules,
  provisionalWordResultsEqual,
  type ProvisionalWordEvidence,
} from "./provisional-independent-solver";
import {
  ANA_CP007_PROVISIONAL_RULES,
  provisionalWordContextKey,
  provisionalWordResultKey,
  type ProvisionalWordResult,
  type ProvisionalWordRuleContext,
  type ProvisionalWordRuleDefinition,
} from "./provisional-rule-definitions";

interface AcceptedPilotPair {
  source: AnaCp007PilotWordRecord;
  target: AnaCp007PilotWordRecord;
  sourceResult: ProvisionalWordResult;
  targetResult: ProvisionalWordResult;
}

function eligibleForContext(
  entry: AnaCp007PilotWordRecord,
  rule: ProvisionalWordRuleDefinition,
  context: ProvisionalWordRuleContext,
): boolean {
  const structure = entry.structure;
  switch (rule.id) {
    case "WORD_REMOVE_VOWELS": {
      const output = removeVowels(entry.word);
      return structure.vowels.length >= 2 && output.length >= 2 &&
        output !== structure.oddPositionLetters && output !== structure.evenPositionLetters;
    }
    case "WORD_REMOVE_CONSONANTS": {
      const output = removeConsonants(entry.word);
      return structure.consonants.length >= 2 && output.length >= 2 &&
        output !== structure.oddPositionLetters && output !== structure.evenPositionLetters;
    }
    case "WORD_POSITION_EXTRACTION": {
      if (context.kind !== "POSITION_EXTRACTION") return false;
      const output = context.parity === "ODD"
        ? structure.oddPositionLetters
        : structure.evenPositionLetters;
      return entry.word.length >= 5 && output.length >= 2 &&
        output !== removeVowels(entry.word) && output !== removeConsonants(entry.word);
    }
    case "WORD_ALPHABET_POSITION_SUM":
      return entry.word.length >= 4 && entry.word.length <= 8;
    case "WORD_LENGTH_RULE":
      return context.kind === "LENGTH_RULE";
    case "WORD_EQUALITY_PATTERN":
      return structure.repeatedPositionCount > 0;
    case "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT":
      return context.kind === "CLASS_SHIFT" &&
        structure.vowels.length >= 2 && structure.consonants.length >= 2;
  }
}

function findAcceptedPair(
  rule: ProvisionalWordRuleDefinition,
  context: ProvisionalWordRuleContext,
): AcceptedPilotPair | null {
  const words = enabledPilotWords().filter((entry) => eligibleForContext(entry, rule, context));
  const contextKey = provisionalWordContextKey(context);

  for (const source of words) {
    for (const target of words) {
      if (source.id === target.id) continue;
      if (rule.id === "WORD_LENGTH_RULE" && source.word.length === target.word.length) continue;
      const sourceResult = rule.apply(source.word, context);
      const targetResult = rule.apply(target.word, context);
      if (sourceResult === null || targetResult === null) continue;
      if (provisionalWordResultKey(sourceResult) === provisionalWordResultKey(targetResult)) continue;

      const evidence: readonly ProvisionalWordEvidence[] = [
        { input: source.word, output: sourceResult },
        { input: target.word, output: targetResult },
      ];
      const matches = matchingProvisionalWordRules(evidence)
        .filter((match) => match.priority <= rule.priority);
      if (matches.length !== 1) continue;
      if (matches[0].ruleId !== rule.id || matches[0].contextKey !== contextKey) continue;

      if (typeof sourceResult === "string" && typeof targetResult === "string") {
        const cp006Matches = matchingClusterRules([
          { left: source.word, right: sourceResult },
          { left: target.word, right: targetResult },
        ]);
        if (cp006Matches.length > 0) continue;
      }

      return { source, target, sourceResult, targetResult };
    }
  }
  return null;
}

function sameAnswerType(left: ProvisionalWordResult, right: ProvisionalWordResult): boolean {
  if (Array.isArray(left)) return Array.isArray(right);
  if (typeof left === "string") return typeof right === "string";
  return typeof right === "number";
}

function stringMutations(value: string): readonly string[] {
  const letters = [...value];
  const swappedFirst = [...letters];
  if (swappedFirst.length >= 2) {
    [swappedFirst[0], swappedFirst[1]] = [swappedFirst[1], swappedFirst[0]];
  }
  const swappedEnds = [...letters];
  if (swappedEnds.length >= 2) {
    [swappedEnds[0], swappedEnds[swappedEnds.length - 1]] = [
      swappedEnds[swappedEnds.length - 1],
      swappedEnds[0],
    ];
  }
  return [
    [...letters].reverse().join(""),
    letters.length > 1 ? value.slice(1) + value[0] : value,
    swappedFirst.join(""),
    swappedEnds.join(""),
    letters.map((letter) => shiftLetter(letter, 1)).join(""),
    letters.map((letter) => shiftLetter(letter, -1)).join(""),
    letters.map((letter, index) => index === 0 ? shiftLetter(letter, 1) : letter).join(""),
  ];
}

function numberMutations(value: number, target: AnaCp007PilotWordRecord): readonly number[] {
  return [
    value - 2,
    value - 1,
    value + 1,
    value + 2,
    target.word.length,
    target.structure.vowels.length,
    target.structure.consonants.length,
    target.structure.distinctLetterCount,
    target.structure.alphabetPositionSum,
  ].filter((candidate) => Number.isSafeInteger(candidate) && candidate > 0);
}

function arrayMutations(value: readonly number[], target: AnaCp007PilotWordRecord): readonly (readonly number[])[] {
  const reversed = [...value].reverse();
  const firstRaised = [...value];
  firstRaised[0] = (firstRaised[0] ?? 0) + 1;
  const lastLowered = [...value];
  const lastIndex = lastLowered.length - 1;
  lastLowered[lastIndex] = Math.max(1, (lastLowered[lastIndex] ?? 1) - 1);
  const swapped = [...value];
  if (swapped.length >= 2) [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
  return [
    reversed,
    firstRaised,
    lastLowered,
    swapped,
    target.structure.alphabetPositions,
    target.structure.equalityPattern,
  ];
}

function rawDistractorCandidates(
  rule: ProvisionalWordRuleDefinition,
  context: ProvisionalWordRuleContext,
  pair: AcceptedPilotPair,
): readonly ProvisionalWordResult[] {
  const candidates: ProvisionalWordResult[] = [];

  for (const alternateContext of rule.contexts) {
    if (provisionalWordContextKey(alternateContext) === provisionalWordContextKey(context)) continue;
    const result = rule.apply(pair.target.word, alternateContext);
    if (result !== null) candidates.push(result);
  }

  for (const otherRule of ANA_CP007_PROVISIONAL_RULES) {
    for (const otherContext of otherRule.contexts) {
      const result = otherRule.apply(pair.target.word, otherContext);
      if (result !== null) candidates.push(result);
    }
  }

  if (typeof pair.targetResult === "string") {
    candidates.push(...stringMutations(pair.targetResult));
  } else if (typeof pair.targetResult === "number") {
    candidates.push(...numberMutations(pair.targetResult, pair.target));
  } else {
    candidates.push(...arrayMutations(pair.targetResult, pair.target));
  }

  return candidates;
}

function buildsAlternativeRelation(
  pair: AcceptedPilotPair,
  candidate: ProvisionalWordResult,
): boolean {
  const nativeMatches = matchingProvisionalWordRules([
    { input: pair.source.word, output: pair.sourceResult },
    { input: pair.target.word, output: candidate },
  ]);
  if (nativeMatches.length > 0) return true;

  if (typeof pair.sourceResult === "string" && typeof candidate === "string") {
    return matchingClusterRules([
      { left: pair.source.word, right: pair.sourceResult },
      { left: pair.target.word, right: candidate },
    ]).length > 0;
  }
  return false;
}

interface OptionYieldSummary {
  ruleId: string;
  contextKey: string;
  source: string;
  target: string;
  acceptedDistractors: number;
  rejectedAlternativeRelations: number;
}

const summaries: OptionYieldSummary[] = [];

for (const rule of ANA_CP007_PROVISIONAL_RULES) {
  for (const context of rule.contexts) {
    const pair = findAcceptedPair(rule, context);
    assert.ok(pair, `${rule.id} ${provisionalWordContextKey(context)} has no accepted pilot pair.`);

    const distractors: ProvisionalWordResult[] = [];
    let rejectedAlternativeRelations = 0;
    for (const candidate of rawDistractorCandidates(rule, context, pair)) {
      if (!sameAnswerType(pair.targetResult, candidate)) continue;
      if (provisionalWordResultsEqual(pair.targetResult, candidate)) continue;
      if (distractors.some((existing) => provisionalWordResultsEqual(existing, candidate))) continue;
      if (buildsAlternativeRelation(pair, candidate)) {
        rejectedAlternativeRelations += 1;
        continue;
      }
      distractors.push(candidate);
      if (distractors.length === 3) break;
    }

    assert.equal(
      distractors.length,
      3,
      `${rule.id} ${provisionalWordContextKey(context)} cannot produce three validated distractors.`,
    );
    assert.equal(
      new Set([pair.targetResult, ...distractors].map(provisionalWordResultKey)).size,
      4,
    );

    summaries.push({
      ruleId: rule.id,
      contextKey: provisionalWordContextKey(context),
      source: pair.source.word,
      target: pair.target.word,
      acceptedDistractors: distractors.length,
      rejectedAlternativeRelations,
    });
  }
}

console.log("ANA-CP-007 provisional option-yield audit passed.", {
  contexts: summaries.length,
  validatedOptionSets: summaries.length,
  totalDistractors: summaries.reduce((sum, entry) => sum + entry.acceptedDistractors, 0),
  rejectedAlternativeRelations: summaries.reduce(
    (sum, entry) => sum + entry.rejectedAlternativeRelations,
    0,
  ),
});
