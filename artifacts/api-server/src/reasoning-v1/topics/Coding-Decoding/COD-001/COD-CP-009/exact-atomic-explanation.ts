import { uniqueSorted } from "./canonical-set";
import type { ExactAtomicExplanation, ExactAtomicOption, ExactAtomicPrototypeId } from "./exact-atomic-types";
import type { EnglishSentenceCodeLanguageInstance } from "./language-instantiator.en";
import { getExactAtomicPrototypeContract } from "./prototype-contracts";

function row(instance: EnglishSentenceCodeLanguageInstance, rowId: string) {
  const found = instance.rows.find((candidate) => candidate.rowId === rowId);
  if (!found) throw new Error(`Missing rendered row '${rowId}'`);
  return found;
}

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

function evidenceLines(instance: EnglishSentenceCodeLanguageInstance): string[] {
  const first = row(instance, "r1");
  const second = row(instance, "r2");

  if (instance.topologyKind === "DIRECT_SINGLE_INTERSECTION") {
    return [
      `The first and second statements have only ‘${instance.targetWord}’ in common. Their code sets have only ‘${instance.targetDisplayToken}’ in common.`,
    ];
  }

  if (instance.topologyKind === "CHAINED_SINGLETON_PROPAGATION") {
    const third = row(instance, "r3");
    const firstWords = intersection(first.words, second.words);
    const firstTokens = intersection(first.displayedCodeTokens, second.displayedCodeTokens);
    const helperWords = intersection(first.words, third.words);
    const helperTokens = intersection(first.displayedCodeTokens, third.displayedCodeTokens);
    return [
      `The first and second statements share ${quoted(firstWords)}, so these words correspond to ${quoted(firstTokens)} in some order.`,
      `The first and third statements share only ${quoted(helperWords)}, and their only common code is ${quoted(helperTokens)}. Removing that resolved pair from the earlier overlap leaves ‘${instance.targetWord}’ matched with ‘${instance.targetDisplayToken}’.`,
    ];
  }

  if (instance.topologyKind === "SET_DIFFERENCE_ELIMINATION") {
    const third = row(instance, "r3");
    const overlapWords = intersection(first.words, second.words);
    const overlapTokens = intersection(first.displayedCodeTokens, second.displayedCodeTokens);
    const remainingWords = difference(overlapWords, third.words);
    const remainingTokens = difference(overlapTokens, third.displayedCodeTokens);
    return [
      `The first and second statements share ${quoted(overlapWords)}, corresponding to the common codes ${quoted(overlapTokens)}.`,
      `The other shared words also occur in the third statement. Removing the third-statement members leaves ${quoted(remainingWords)} and ${quoted(remainingTokens)} as the unmatched pair.`,
    ];
  }

  if (instance.topologyKind === "FORKED_EVIDENCE_JOIN") {
    const third = row(instance, "r3");
    const fourth = row(instance, "r4");
    const centralWords = intersection(first.words, third.words);
    const centralTokens = intersection(first.displayedCodeTokens, third.displayedCodeTokens);
    const firstBranchWords = intersection(centralWords, second.words);
    const firstBranchTokens = intersection(centralTokens, second.displayedCodeTokens);
    const secondBranchWords = intersection(centralWords, fourth.words);
    const secondBranchTokens = intersection(centralTokens, fourth.displayedCodeTokens);
    return [
      `The first and third statements share ${quoted(centralWords)}, corresponding to ${quoted(centralTokens)} in some order.`,
      `The second statement identifies ${quoted(firstBranchWords)} as ${quoted(firstBranchTokens)}, while the fourth identifies ${quoted(secondBranchWords)} as ${quoted(secondBranchTokens)}. Removing both resolved branch pairs leaves ‘${instance.targetWord}’ matched with ‘${instance.targetDisplayToken}’.`,
    ];
  }

  const allWords = instance.rows
    .map((currentRow) => currentRow.words)
    .reduce((current, next) => intersection(current, next));
  const allTokens = instance.rows
    .map((currentRow) => currentRow.displayedCodeTokens)
    .reduce((current, next) => intersection(current, next));
  return [
    `No pair of statements is sufficient by itself. Across all the statements, ${quoted(allWords)} is the only common word, and ${quoted(allTokens)} is the only common code word.`,
  ];
}

function trapAlert(options: readonly ExactAtomicOption[], correct: string): string {
  const trap = options.find((option) => !option.isCorrect && option.errorLabel === "STATEMENT_ORDER_ASSUMED")
    ?? options.find((option) => !option.isCorrect && option.errorLabel !== "UNRESOLVED_ASSUMED")
    ?? options.find((option) => !option.isCorrect)!;

  if (trap.errorLabel === "STATEMENT_ORDER_ASSUMED") {
    return `‘${trap.value}’ comes from matching displayed positions, but the code words are not arranged in the same order as the original words.`;
  }
  if (trap.errorLabel === "UNRESOLVED_ASSUMED") {
    return `‘${trap.value}’ is incorrect because the complete comparison uniquely isolates ‘${correct}’.`;
  }
  return `‘${trap.value}’ belongs to another word in a related statement; the complete comparison isolates ‘${correct}’.`;
}

export function buildExactAtomicExplanation(
  prototypeId: ExactAtomicPrototypeId,
  instance: EnglishSentenceCodeLanguageInstance,
  options: readonly ExactAtomicOption[],
): ExactAtomicExplanation {
  const contract = getExactAtomicPrototypeContract(prototypeId);
  const correct = contract.queryDirection === "WORD_TO_TOKEN" ? instance.targetDisplayToken : instance.targetWord;
  const targetResult = contract.queryDirection === "WORD_TO_TOKEN"
    ? `Therefore, the code for ‘${instance.targetWord}’ is ‘${instance.targetDisplayToken}’.`
    : `Therefore, the code word ‘${instance.targetDisplayToken}’ represents ‘${instance.targetWord}’.`;

  return {
    referenceAid: [
      "A word repeated in two statements must have a code word repeated in the corresponding code sets.",
      "The displayed order of the code words is irrelevant; compare memberships, not positions.",
    ],
    quickMethod: "Mark repeated words and repeated code words, resolve any single common pair, and eliminate each resolved pair from the remaining overlaps.",
    evidenceComparison: evidenceLines(instance),
    targetResult,
    conclusion: `The correct answer is ‘${correct}’.`,
    commonTrapAlert: trapAlert(options, correct),
  };
}
