import assert from "node:assert/strict";
import { enabledPilotWords, type AnaCp007PilotWordRecord } from "./foundation/word-registry";
import { removeConsonants, removeVowels } from "./foundation/word-structure";
import {
  independentlyApplyProvisionalWordRule,
  matchingProvisionalWordRules,
  provisionalWordResultsEqual,
  type ProvisionalWordEvidence,
} from "./provisional-independent-solver";
import {
  ANA_CP007_PROVISIONAL_RULES,
  provisionalWordContextKey,
  provisionalWordResultKey,
  type ProvisionalWordRuleContext,
  type ProvisionalWordRuleDefinition,
} from "./provisional-rule-definitions";

interface ContextYield {
  ruleId: string;
  contextKey: string;
  eligibleWords: number;
  candidatePairs: number;
  acceptedPairs: number;
  solverDisagreements: number;
  nativeCollisionRejects: number;
  sameOutputRejects: number;
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
    case "WORD_ALPHABET_POSITION_SEQUENCE":
    case "WORD_ALPHABET_POSITION_SUM":
      return entry.word.length >= 4 && entry.word.length <= 8;
    case "WORD_LENGTH_RULE":
      return context.kind === "LENGTH_RULE";
    case "WORD_EQUALITY_PATTERN":
      return structure.repeatedPositionCount > 0;
    case "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT": {
      if (context.kind !== "CLASS_SHIFT") return false;
      if (structure.vowels.length < 2 || structure.consonants.length < 2) return false;
      const vowelsOnlyOdd = structure.vowelPositions.every((position) => position % 2 === 1);
      const vowelsOnlyEven = structure.vowelPositions.every((position) => position % 2 === 0);
      const consonantsOnlyOdd = structure.consonantPositions.every((position) => position % 2 === 1);
      const consonantsOnlyEven = structure.consonantPositions.every((position) => position % 2 === 0);
      return !((vowelsOnlyOdd && consonantsOnlyEven) || (vowelsOnlyEven && consonantsOnlyOdd));
    }
  }
}

function simulateContext(
  rule: ProvisionalWordRuleDefinition,
  context: ProvisionalWordRuleContext,
): ContextYield {
  const words = enabledPilotWords().filter((entry) => eligibleForContext(entry, rule, context));
  let candidatePairs = 0;
  let acceptedPairs = 0;
  let solverDisagreements = 0;
  let nativeCollisionRejects = 0;
  let sameOutputRejects = 0;

  const maximumPairs = 400;
  outer:
  for (let sourceIndex = 0; sourceIndex < words.length; sourceIndex += 1) {
    for (let targetIndex = 0; targetIndex < words.length; targetIndex += 1) {
      if (sourceIndex === targetIndex) continue;
      const source = words[sourceIndex];
      const target = words[targetIndex];
      if (rule.id === "WORD_LENGTH_RULE" && source.word.length === target.word.length) continue;

      const sourceResult = rule.apply(source.word, context);
      const targetResult = rule.apply(target.word, context);
      if (sourceResult === null || targetResult === null) continue;
      candidatePairs += 1;

      const independentSource = independentlyApplyProvisionalWordRule(rule.id, context, source.word);
      const independentTarget = independentlyApplyProvisionalWordRule(rule.id, context, target.word);
      if (!provisionalWordResultsEqual(sourceResult, independentSource) ||
          !provisionalWordResultsEqual(targetResult, independentTarget)) {
        solverDisagreements += 1;
        continue;
      }

      if (provisionalWordResultKey(sourceResult) === provisionalWordResultKey(targetResult)) {
        sameOutputRejects += 1;
        if (candidatePairs >= maximumPairs) break outer;
        continue;
      }

      const evidence: readonly ProvisionalWordEvidence[] = [
        { input: source.word, output: sourceResult },
        { input: target.word, output: targetResult },
      ];
      const intendedContextKey = provisionalWordContextKey(context);
      const equalOrSimplerMatches = matchingProvisionalWordRules(evidence)
        .filter((match) => match.priority <= rule.priority);
      const intendedMatches = equalOrSimplerMatches.filter((match) =>
        match.ruleId === rule.id && match.contextKey === intendedContextKey,
      );

      if (intendedMatches.length !== 1 || equalOrSimplerMatches.length !== 1) {
        nativeCollisionRejects += 1;
      } else {
        acceptedPairs += 1;
      }

      if (candidatePairs >= maximumPairs) break outer;
    }
  }

  return {
    ruleId: rule.id,
    contextKey: provisionalWordContextKey(context),
    eligibleWords: words.length,
    candidatePairs,
    acceptedPairs,
    solverDisagreements,
    nativeCollisionRejects,
    sameOutputRejects,
  };
}

const contextYields = ANA_CP007_PROVISIONAL_RULES.flatMap((rule) =>
  rule.contexts.map((context) => simulateContext(rule, context)),
);

assert.equal(contextYields.reduce((sum, entry) => sum + entry.solverDisagreements, 0), 0);

const ruleSummary = new Map<string, {
  contexts: number;
  eligibleWords: number;
  candidatePairs: number;
  acceptedPairs: number;
  collisionRejects: number;
}>();

for (const entry of contextYields) {
  const current = ruleSummary.get(entry.ruleId) ?? {
    contexts: 0,
    eligibleWords: 0,
    candidatePairs: 0,
    acceptedPairs: 0,
    collisionRejects: 0,
  };
  current.contexts += 1;
  current.eligibleWords = Math.max(current.eligibleWords, entry.eligibleWords);
  current.candidatePairs += entry.candidatePairs;
  current.acceptedPairs += entry.acceptedPairs;
  current.collisionRejects += entry.nativeCollisionRejects;
  ruleSummary.set(entry.ruleId, current);
}

for (const [ruleId, summary] of ruleSummary) {
  assert.ok(summary.eligibleWords > 0, `${ruleId} has no eligible pilot words.`);
  assert.ok(summary.acceptedPairs > 0, `${ruleId} produced no unambiguous pilot pairs.`);
}

console.log("ANA-CP-007 provisional native-rule yield simulation passed.", {
  pilotWords: enabledPilotWords().length,
  contextCount: contextYields.length,
  ruleSummary: Object.fromEntries(ruleSummary),
  weakestContexts: [...contextYields]
    .sort((left, right) => left.acceptedPairs - right.acceptedPairs)
    .slice(0, 12),
});
