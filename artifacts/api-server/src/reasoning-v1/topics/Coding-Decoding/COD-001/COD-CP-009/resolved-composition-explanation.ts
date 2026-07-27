import { uniqueSorted } from "./canonical-set";
import { getResolvedCompositionContract } from "./resolved-composition-contracts";
import type { ResolvedCompositionLanguageInstance } from "./resolved-composition-language.en";
import type {
  ResolvedCompositionExplanation,
  ResolvedCompositionOption,
  ResolvedCompositionPrototypeId,
} from "./resolved-composition-types";

function intersection(left: readonly string[], right: readonly string[]): string[] {
  const rightSet = new Set(right);
  return uniqueSorted(left.filter((value) => rightSet.has(value)));
}

function quoted(values: readonly string[]): string {
  return values.map((value) => `‘${value}’`).join(", ");
}

export function buildResolvedCompositionExplanation(
  prototypeId: ResolvedCompositionPrototypeId,
  instance: ResolvedCompositionLanguageInstance,
  options: readonly ResolvedCompositionOption[],
): ResolvedCompositionExplanation {
  const contract = getResolvedCompositionContract(prototypeId);
  const rows = [...instance.rows].sort((left, right) => left.rowId.localeCompare(right.rowId));
  const [first, second, third, fourth] = rows;
  const firstWords = intersection(first!.words, second!.words);
  const firstTokens = intersection(first!.displayedCodeTokens, second!.displayedCodeTokens);
  const secondWords = intersection(third!.words, fourth!.words);
  const secondTokens = intersection(third!.displayedCodeTokens, fourth!.displayedCodeTokens);
  if (firstWords.length !== 1 || firstTokens.length !== 1 || secondWords.length !== 1 || secondTokens.length !== 1) {
    throw new Error(`Resolved composition proof drifted for ${prototypeId}/${instance.seed}`);
  }
  const correct = options.find((option) => option.isCorrect)!;
  const trap = options.find((option) => !option.isCorrect)!;
  const queryDescription = contract.queryDirection === "WORDS_TO_TOKENS"
    ? `the words ${quoted(instance.targetWords)}`
    : `the code words ${quoted(instance.targetDisplayTokens)}`;

  return {
    referenceAid: [
      "Resolve each component from the evidence branch in which it is the only common word or code word.",
      "After the components are resolved, combine them as an unordered set; do not copy the code of any displayed row.",
    ],
    quickMethod: "Compare statements 1–2 for the first pair and statements 3–4 for the second pair, then join the two independently proved results.",
    branchProofs: [
      `Statements 1 and 2 have only ${quoted(firstWords)} in common, while their code rows have only ${quoted(firstTokens)} in common. Hence ${quoted(firstWords)} is represented by ${quoted(firstTokens)}.`,
      `Statements 3 and 4 have only ${quoted(secondWords)} in common, while their code rows have only ${quoted(secondTokens)} in common. Hence ${quoted(secondWords)} is represented by ${quoted(secondTokens)}.`,
    ],
    composition: `The queried combination ${queryDescription} does not occur in any displayed statement. Combining the two resolved components gives ‘${correct.value}’.`,
    conclusion: `Therefore, the correct answer is ‘${correct.value}’.`,
    commonTrapAlert: `‘${trap.value}’ substitutes or copies a member from a displayed row instead of combining the two independently resolved target components.`,
  };
}
