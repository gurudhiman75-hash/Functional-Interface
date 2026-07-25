import assert from "node:assert/strict";
import { shiftLetter } from "../foundation/alphabet";
import {
  letterGroupToken,
  letterNumberToken,
  letterToken,
  mixedTokenKey,
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

function inputsForRule(rule: ProvisionalMixedRuleDefinition): readonly MixedToken[] {
  if (rule.inputKind === "LETTER_GROUP") {
    const inputs: MixedToken[] = [];
    for (const first of ALPHABET) {
      for (const second of ALPHABET) {
        if (first !== second) inputs.push(letterGroupToken(first + second));
      }
    }
    return inputs;
  }
  if (rule.inputKind === "LETTER_NUMBER") {
    const inputs: MixedToken[] = [];
    for (const letter of ALPHABET) {
      for (let number = 8; number <= 64; number += 1) {
        inputs.push(letterNumberToken(letter, number));
      }
    }
    return inputs;
  }
  return [];
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

function sameResultKind(left: MixedResult, right: MixedResult): boolean {
  return left.kind === right.kind;
}

function genericCandidates(correct: MixedResult): readonly MixedResult[] {
  switch (correct.kind) {
    case "NUMBER": {
      const values = [
        correct.number - 3,
        correct.number - 2,
        correct.number - 1,
        correct.number + 1,
        correct.number + 2,
        correct.number + 3,
      ];
      return values.filter((value) => value >= 1 && value <= 9999).map(numberToken);
    }
    case "LETTER":
      return [-3, -2, -1, 1, 2, 3].map((amount) => letterToken(shiftLetter(correct.letter, amount)));
    case "LETTER_NUMBER":
      return [
        letterNumberToken(shiftLetter(correct.letter, 1), correct.number),
        letterNumberToken(shiftLetter(correct.letter, -1), correct.number),
        letterNumberToken(correct.letter, correct.number + 1),
        ...(correct.number > 1 ? [letterNumberToken(correct.letter, correct.number - 1)] : []),
        letterNumberToken(shiftLetter(correct.letter, 1), correct.number + 1),
        ...(correct.number > 1
          ? [letterNumberToken(shiftLetter(correct.letter, -1), correct.number - 1)]
          : []),
      ];
    case "LETTER_GROUP":
    case "CLUSTER_NUMBER":
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
      if (!sameResultKind(pair.targetOutput, candidate)) continue;
      if (sameMixedToken(pair.targetOutput, candidate)) continue;
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
    assert.equal(
      new Set([pair.targetOutput, ...distractors].map(mixedTokenKey)).size,
      4,
    );

    summaries.push({
      ruleId: rule.id,
      contextKey: provisionalMixedContextKey(context),
      acceptedDistractors: distractors.length,
      rejectedAlternatives,
    });
  }
}

assert.equal(summaries.length, 51);

console.log("ANA-CP-008 provisional option-yield audit passed.", {
  contexts: summaries.length,
  validatedOptionSets: summaries.length,
  totalDistractors: summaries.reduce((sum, entry) => sum + entry.acceptedDistractors, 0),
  rejectedAlternatives: summaries.reduce((sum, entry) => sum + entry.rejectedAlternatives, 0),
});
