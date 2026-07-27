import { SeededRandom } from "../foundation/prng";
import { canonicalSetKey, uniqueSorted } from "./canonical-set";
import { getEnglishSentenceCodeLexeme } from "./datasets/lexemes.en";
import { getResolvedCompositionContract } from "./resolved-composition-contracts";
import type {
  ResolvedCompositionOption,
  ResolvedCompositionPrototypeId,
} from "./resolved-composition-types";
import type { ResolvedCompositionLanguageInstance } from "./resolved-composition-language.en";
import type { SentenceCodeSolutionSpace } from "./types";

function pairs(values: readonly string[]): readonly (readonly [string, string])[] {
  const output: [string, string][] = [];
  for (let left = 0; left < values.length; left += 1) {
    for (let right = left + 1; right < values.length; right += 1) {
      output.push([values[left]!, values[right]!]);
    }
  }
  return output;
}

function naturalWordPair(members: readonly string[]): string[] {
  const rank: Readonly<Record<string, number>> = {
    ADJECTIVE: 0,
    NOUN: 1,
    CONJUNCTION: 2,
    VERB: 3,
    ADVERB: 4,
  };
  return [...members].sort((left, right) => {
    const leftLexeme = getEnglishSentenceCodeLexeme(left);
    const rightLexeme = getEnglishSentenceCodeLexeme(right);
    return rank[leftLexeme.partOfSpeech]! - rank[rightLexeme.partOfSpeech]!
      || left.localeCompare(right);
  });
}

function displayValue(queryDirection: "WORDS_TO_TOKENS" | "TOKENS_TO_WORDS", members: readonly string[]): string {
  return (queryDirection === "TOKENS_TO_WORDS" ? naturalWordPair(members) : uniqueSorted(members)).join(" ");
}

export function buildResolvedCompositionOptions(
  prototypeId: ResolvedCompositionPrototypeId,
  instance: ResolvedCompositionLanguageInstance,
  space: SentenceCodeSolutionSpace,
  seed: number,
): { options: readonly ResolvedCompositionOption[]; correctIndex: number } {
  const contract = getResolvedCompositionContract(prototypeId);
  const random = new SeededRandom(`${prototypeId}:${seed}:options-v1`);
  const correctMembers = contract.queryDirection === "WORDS_TO_TOKENS"
    ? uniqueSorted(instance.targetDisplayTokens)
    : uniqueSorted(instance.targetWords);
  const activeValues = contract.queryDirection === "WORDS_TO_TOKENS" ? space.activeTokens : space.activeWords;
  const correctKey = canonicalSetKey(correctMembers);
  const displayedRowKeys = new Set(instance.rows.map((row) => canonicalSetKey(
    contract.queryDirection === "WORDS_TO_TOKENS" ? row.displayedCodeTokens : row.words,
  )));
  const wrongPairs = pairs(activeValues)
    .map((members) => uniqueSorted(members))
    .filter((members) => canonicalSetKey(members) !== correctKey);
  if (wrongPairs.length < 3) throw new Error(`${prototypeId}/${seed} lacks set distractors`);

  const correct: ResolvedCompositionOption = {
    value: displayValue(contract.queryDirection, correctMembers),
    members: correctMembers,
    canonicalValue: correctKey,
    isCorrect: true,
  };
  const distractors = random.shuffle(wrongPairs).slice(0, 3).map((members) => ({
    value: displayValue(contract.queryDirection, members),
    members,
    canonicalValue: canonicalSetKey(members),
    isCorrect: false,
    errorLabel: displayedRowKeys.has(canonicalSetKey(members))
      ? "DISPLAYED_ROW_COPIED" as const
      : "ONE_COMPONENT_REPLACED" as const,
  }));
  const correctIndex = (seed - 1) % 4;
  const options = [...distractors];
  options.splice(correctIndex, 0, correct);
  if (new Set(options.map((option) => option.canonicalValue)).size !== 4) {
    throw new Error(`${prototypeId}/${seed} produced duplicate options`);
  }
  return { options, correctIndex };
}
