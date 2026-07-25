import {
  matchingAlphabetRules,
  solveAlphabetRule,
  type AlphabetPair,
} from "./independent-solver";
import type { AlphabetPresentationMode } from "./question-language.en";
import type { AlphabetRuleContext } from "./rule-definitions";

export type AlphabetOptionValue = string | readonly [string, string];

export interface AlphabetOption {
  value: AlphabetOptionValue;
  errorLabel: string | null;
}

function optionKey(value: AlphabetOptionValue): string {
  return Array.isArray(value) ? `${value[0]}:${value[1]}` : value;
}

function evidenceForOption(
  presentationMode: AlphabetPresentationMode,
  source: AlphabetPair,
  target: AlphabetPair,
  value: AlphabetOptionValue,
): readonly AlphabetPair[] | null {
  if (presentationMode === "DIRECT_COMPLETION") {
    return typeof value === "string"
      ? [source, { left: target.left, right: value }]
      : null;
  }
  return Array.isArray(value)
    ? [source, { left: value[0], right: value[1] }]
    : null;
}

export function validateAlphabetOptions(
  ruleId: string,
  context: AlphabetRuleContext,
  presentationMode: AlphabetPresentationMode,
  source: AlphabetPair,
  target: AlphabetPair,
  options: readonly AlphabetOption[],
): number {
  if (options.length !== 4) throw new Error("ANA-CP-005 requires exactly four options.");
  const keys = options.map((option) => optionKey(option.value));
  if (new Set(keys).size !== 4) throw new Error("ANA-CP-005 options must be unique.");

  const correctFlags = options.map((option) => {
    if (presentationMode === "DIRECT_COMPLETION") {
      return typeof option.value === "string" && option.value === target.right;
    }
    if (!Array.isArray(option.value)) return false;
    const [left, right] = option.value;
    return solveAlphabetRule(ruleId, context, left) === right;
  });

  const correctIndexes = correctFlags
    .map((isCorrect, index) => (isCorrect ? index : -1))
    .filter((index) => index >= 0);
  if (correctIndexes.length !== 1) {
    throw new Error(`ANA-CP-005 expected one correct option, found ${correctIndexes.length}.`);
  }

  for (const [index, option] of options.entries()) {
    if (index === correctIndexes[0]) continue;
    const evidence = evidenceForOption(presentationMode, source, target, option.value);
    if (!evidence) throw new Error("ANA-CP-005 option shape does not match its presentation mode.");
    const competingMatches = matchingAlphabetRules(evidence);
    if (competingMatches.length > 0) {
      throw new Error(
        `ANA-CP-005 distractor ${index} forms a registered alternative rule: ${competingMatches.map((match) => match.ruleId).join(", ")}.`,
      );
    }
  }

  if (options[correctIndexes[0]].errorLabel !== null) {
    throw new Error("The correct ANA-CP-005 option must have a null error label.");
  }
  if (options.some((option, index) => index !== correctIndexes[0] && !option.errorLabel)) {
    throw new Error("Every ANA-CP-005 distractor must carry an error label.");
  }
  return correctIndexes[0];
}
