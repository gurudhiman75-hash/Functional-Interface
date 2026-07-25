import { matchingClusterRules } from "../ANA-CP-006/independent-solver";
import {
  independentlyApplyWordRule,
  matchingWordRules,
  type WordEvidence,
} from "./independent-solver";
import type { AnaCp007RuleId, WordPresentationMode } from "./question-language.en";
import {
  sameWordRuleResult,
  wordRuleResultKey,
  type WordRuleContext,
  type WordRuleResult,
} from "./rule-definitions";

export type WordPairOptionValue = readonly [string, WordRuleResult];

export interface WordOption {
  value: WordRuleResult | WordPairOptionValue;
  errorLabel: string | null;
}

function isPairValue(value: WordOption["value"]): value is WordPairOptionValue {
  return Array.isArray(value) && value.length === 2 && typeof value[0] === "string";
}

export function wordOptionKey(value: WordOption["value"]): string {
  return isPairValue(value)
    ? `PAIR:${value[0]}:${wordRuleResultKey(value[1])}`
    : `RESULT:${wordRuleResultKey(value as WordRuleResult)}`;
}

function cp006AlternativeExists(evidence: readonly WordEvidence[]): boolean {
  if (!evidence.every(({ input, output }) =>
    typeof output === "string" && /^[A-Z]+$/.test(input) && /^[A-Z]+$/.test(output),
  )) return false;
  return matchingClusterRules(evidence.map(({ input, output }) => ({
    left: input,
    right: output as string,
  }))).length > 0;
}

export function hasAnyWordAlternative(evidence: readonly WordEvidence[]): boolean {
  return matchingWordRules(evidence).length > 0 || cp006AlternativeExists(evidence);
}

export function validateWordOptions(
  intendedRuleId: AnaCp007RuleId,
  intendedContext: WordRuleContext,
  presentationMode: WordPresentationMode,
  source: WordEvidence,
  target: WordEvidence,
  options: readonly WordOption[],
): number {
  if (options.length !== 4) throw new Error(`ANA-CP-007 requires four options, received ${options.length}.`);
  if (new Set(options.map((option) => wordOptionKey(option.value))).size !== 4) {
    throw new Error("ANA-CP-007 options are not unique.");
  }

  const correctIndexes: number[] = [];
  for (const [index, option] of options.entries()) {
    if (presentationMode === "DIRECT_COMPLETION") {
      if (isPairValue(option.value)) throw new Error("Direct-completion option cannot contain a pair.");
      const intendedOutput = independentlyApplyWordRule(intendedRuleId, intendedContext, target.input);
      if (sameWordRuleResult(intendedOutput, option.value as WordRuleResult)) {
        correctIndexes.push(index);
      } else if (hasAnyWordAlternative([source, { input: target.input, output: option.value as WordRuleResult }])) {
        throw new Error(`Direct distractor ${index} forms an alternative registered relation.`);
      }
    } else {
      if (!isPairValue(option.value)) throw new Error("Pair-selection option must contain a word/result pair.");
      const [input, output] = option.value;
      const intendedOutput = independentlyApplyWordRule(intendedRuleId, intendedContext, input);
      if (sameWordRuleResult(intendedOutput, output)) {
        correctIndexes.push(index);
      } else if (hasAnyWordAlternative([source, { input, output }])) {
        throw new Error(`Pair distractor ${index} forms an alternative registered relation.`);
      }
    }
  }

  if (correctIndexes.length !== 1) {
    throw new Error(`ANA-CP-007 options have ${correctIndexes.length} correct answers.`);
  }
  const correctIndex = correctIndexes[0];
  if (options[correctIndex].errorLabel !== null) {
    throw new Error("ANA-CP-007 correct option must carry a null error label.");
  }
  if (options.filter((option) => option.errorLabel === null).length !== 1) {
    throw new Error("ANA-CP-007 must mark exactly one option as correct.");
  }
  return correctIndex;
}
