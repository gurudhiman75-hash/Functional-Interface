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

  return {
    referenceAid: [
      "A possible set needs at least one complete mapping witness, but it need not occur in every mapping.",
      "Code-word order and word order are irrelevant; compare each option as an unordered set.",
    ],
    quickMethod: "First isolate the resolved modifier pair. Then combine that fixed member with each candidate belonging to the unresolved core group.",
    evidenceComparison: [
      `The words common to all three statements are ${quoted(coreWords)}, and the code words common to all three code sets are ${quoted(coreTokens)}. Their internal pairings remain unresolved.`,
      `Statements 2 and 3 have one additional common word, ${quoted(resolvedWords)}, and one additional common code word, ${quoted(resolvedTokens)}. Hence ‘${resolvedWord}’ is represented by ‘${resolvedToken}’.`,
    ],
    witness: `One complete mapping allowed by all statements contains ${witnessPairs}. Therefore the offered set ‘${correct.value}’ has ${witnessCount} witness${witnessCount === 1 ? "" : "es"} among ${space.solutionCount} valid mappings.`,
    conclusion: `Hence ‘${correct.value}’ is a possible answer.`,
    commonTrapAlert: `‘${trap.value}’ has zero complete-mapping witnesses; it combines members that cannot jointly represent the requested set.`,
  };
}
