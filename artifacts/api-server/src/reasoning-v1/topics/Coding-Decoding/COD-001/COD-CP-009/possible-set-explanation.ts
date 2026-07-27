import { canonicalSetKey, uniqueSorted } from "./canonical-set";
import { getPossibleSetContract } from "./possible-set-contracts";
import { possibleSetWitnessCount } from "./possible-set-options";
import type {
  PossibleSetExplanation,
  PossibleSetOption,
  PossibleSetPrototypeId,
} from "./possible-set-types";
import type { EnglishSentenceCodeLanguageInstance } from "./language-instantiator.en";
import type { SentenceCodeSolutionSpace } from "./types";

function intersection(left: readonly string[], right: readonly string[]): string[] {
  const rightSet = new Set(right);
  return uniqueSorted(left.filter((value) => rightSet.has(value)));
}

function difference(left: readonly string[], right: readonly string[]): string[] {
  const rightSet = new Set(right);
  return uniqueSorted(left.filter((value) => !rightSet.has(value)));
}

function quoted(values: readonly string[]): string {
  return values.map((value) => `‘${value}’`).join(", ");
}

export function buildPossibleSetExplanation(
  prototypeId: PossibleSetPrototypeId,
  instance: EnglishSentenceCodeLanguageInstance,
  space: SentenceCodeSolutionSpace,
  targetWords: readonly [string, string],
  targetTokens: readonly [string, string],
  resolvedWord: string,
  resolvedToken: string,
  options: readonly PossibleSetOption[],
): PossibleSetExplanation {
  const contract = getPossibleSetContract(prototypeId);
  const correct = options.find((option) => option.isCorrect)!;
  const first = instance.rows.find((row) => row.rowId === "r1")!;
  const second = instance.rows.find((row) => row.rowId === "r2")!;
  const third = instance.rows.find((row) => row.rowId === "r3")!;
  const coreWords = intersection(intersection(first.words, second.words), third.words);
  const coreTokens = intersection(
    intersection(first.displayedCodeTokens, second.displayedCodeTokens),
    third.displayedCodeTokens,
  );
  const secondThirdWords = intersection(second.words, third.words);
  const secondThirdTokens = intersection(second.displayedCodeTokens, third.displayedCodeTokens);
  const resolvedWords = difference(secondThirdWords, coreWords);
  const resolvedTokens = difference(secondThirdTokens, coreTokens);
  if (canonicalSetKey(resolvedWords) !== canonicalSetKey([resolvedWord])) {
    throw new Error(`Resolved word proof drifted for ${prototypeId}/${instance.seed}`);
  }
  if (canonicalSetKey(resolvedTokens) !== canonicalSetKey([resolvedToken])) {
    throw new Error(`Resolved token proof drifted for ${prototypeId}/${instance.seed}`);
  }

  const witness = space.solutions.find((solution) => {
    if (contract.queryDirection === "WORDS_TO_TOKENS") {
      return canonicalSetKey(targetWords.map((word) => solution.wordToToken[word]!)) === correct.canonicalValue;
    }
    const words = space.activeWords.filter((word) => targetTokens.includes(solution.wordToToken[word]!));
    return canonicalSetKey(words) === correct.canonicalValue;
  });
  if (!witness) throw new Error(`No complete mapping witnesses option '${correct.value}'`);

  const witnessPairs = Object.entries(witness.wordToToken)
    .filter(([word, token]) => targetWords.includes(word) || targetTokens.includes(token))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([word, token]) => `‘${word}’–‘${token}’`)
    .join(", ");
  const witnessCount = possibleSetWitnessCount(
    space,
    contract.queryDirection,
    targetWords,
    targetTokens,
    correct.members,
  );
  const trap = options.find((option) => !option.isCorrect)!;
  const isEncoding = contract.queryDirection === "WORDS_TO_TOKENS";

  return {
    referenceAid: isEncoding
      ? [
        "For a word-set query, trace every queried word to a code word within the same complete mapping.",
        "The order of code words is irrelevant, so compare each option as an unordered code-word set.",
      ]
      : [
        "For a code-set query, decode every queried code word to a word within the same complete mapping.",
        "The order of decoded words is irrelevant, so compare each option as an unordered word set.",
      ],
    quickMethod: isEncoding
      ? "First fix the certain word-to-code pair. Then attach each possible code of the unresolved word and compare the resulting code-word sets."
      : "First fix the certain code-to-word pair. Then attach each possible word represented by the unresolved code and compare the resulting word sets.",
    evidenceComparison: [
      `The words common to all three statements are ${quoted(coreWords)}, and the code words common to all three code sets are ${quoted(coreTokens)}. Their internal pairings remain unresolved.`,
      isEncoding
        ? `Statements 2 and 3 isolate ‘${resolvedWord}’ as ‘${resolvedToken}’. Therefore that fixed code word must be included when coding the queried word pair.`
        : `Statements 2 and 3 isolate ‘${resolvedToken}’ as the code for ‘${resolvedWord}’. Therefore that fixed word must be included when decoding the queried code pair.`,
    ],
    witness: isEncoding
      ? `One complete mapping allowed by all statements assigns the queried words through ${witnessPairs}. Therefore the offered code-word set ‘${correct.value}’ has ${witnessCount} witness${witnessCount === 1 ? "" : "es"} among ${space.solutionCount} valid mappings.`
      : `One complete mapping allowed by all statements decodes the queried code words through ${witnessPairs}. Therefore the offered word set ‘${correct.value}’ has ${witnessCount} witness${witnessCount === 1 ? "" : "es"} among ${space.solutionCount} valid mappings.`,
    conclusion: isEncoding
      ? `Hence the code-word set ‘${correct.value}’ can represent the queried words.`
      : `Hence the word set ‘${correct.value}’ can be represented by the queried code words.`,
    commonTrapAlert: isEncoding
      ? `The code-word set ‘${trap.value}’ has zero complete-mapping witnesses; its members cannot jointly encode the queried words.`
      : `The word set ‘${trap.value}’ has zero complete-mapping witnesses; its members cannot jointly be decoded from the queried code words.`,
  };
}
