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
  const r1 = row(instance, "r1");
  const r2 = row(instance, "r2");

  if (instance.topologyKind === "DIRECT_SINGLE_INTERSECTION") {
    return [
      `The messages ‘${r1.sentence}’ and ‘${r2.sentence}’ have only ‘${instance.targetWord}’ in common. Their code rows have only ‘${instance.targetDisplayToken}’ in common.`,
    ];
  }

  if (instance.topologyKind === "CHAINED_SINGLETON_PROPAGATION") {
    const r3 = row(instance, "r3");
    const firstWords = intersection(r1.words, r2.words);
    const firstTokens = intersection(r1.displayedCodeTokens, r2.displayedCodeTokens);
    const helperWords = intersection(r1.words, r3.words);
    const helperTokens = intersection(r1.displayedCodeTokens, r3.displayedCodeTokens);
    return [
      `Rows r1 and r2 share ${quoted(firstWords)}, so their codes must be ${quoted(firstTokens)} in some order.`,
      `Rows r1 and r3 share only ${quoted(helperWords)}, and their only common code is ${quoted(helperTokens)}. After removing that resolved pair from the first overlap, ‘${instance.targetWord}’ is left with ‘${instance.targetDisplayToken}’.`,
    ];
  }

  if (instance.topologyKind === "SET_DIFFERENCE_ELIMINATION") {
    const r3 = row(instance, "r3");
    const overlapWords = intersection(r1.words, r2.words);
    const overlapTokens = intersection(r1.displayedCodeTokens, r2.displayedCodeTokens);
    const remainingWords = difference(overlapWords, r3.words);
    const remainingTokens = difference(overlapTokens, r3.displayedCodeTokens);
    return [
      `Rows r1 and r2 share ${quoted(overlapWords)}, corresponding to the common codes ${quoted(overlapTokens)}.`,
      `The other shared words also occur in r3. Removing the r3 members leaves ${quoted(remainingWords)} and ${quoted(remainingTokens)} as the unmatched pair.`,
    ];
  }

  if (instance.topologyKind === "FORKED_EVIDENCE_JOIN") {
    const r3 = row(instance, "r3");
    const r4 = row(instance, "r4");
    const branchOneWords = intersection(r1.words, r2.words);
    const branchOneTokens = intersection(r1.displayedCodeTokens, r2.displayedCodeTokens);
    const branchTwoWords = intersection(r3.words, r4.words);
    const branchTwoTokens = intersection(r3.displayedCodeTokens, r4.displayedCodeTokens);
    return [
      `The r1–r2 comparison gives the common-word set ${quoted(branchOneWords)} and the common-code set ${quoted(branchOneTokens)}.`,
      `The r3–r4 comparison gives ${quoted(branchTwoWords)} and ${quoted(branchTwoTokens)}. The only member common to both evidence sets is ‘${instance.targetWord}’, matched with ‘${instance.targetDisplayToken}’.`,
    ];
  }

  const allWords = instance.rows
    .map((currentRow) => currentRow.words)
    .reduce((current, next) => intersection(current, next));
  const allTokens = instance.rows
    .map((currentRow) => currentRow.displayedCodeTokens)
    .reduce((current, next) => intersection(current, next));
  return [
    `No pair of rows is sufficient by itself. Comparing all the statements, ${quoted(allWords)} is present throughout, and ${quoted(allTokens)} is the only code word present throughout.`,
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
  return `‘${trap.value}’ belongs to another word in a related statement; the full intersection and elimination evidence isolates ‘${correct}’.`;
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
      "A word repeated in two statements must have a code word repeated in the corresponding code rows.",
      "The displayed order of the code words is irrelevant; compare memberships, not positions.",
    ],
    quickMethod: "Mark repeated words and repeated code words, resolve any single common pair, and then eliminate it from the remaining overlaps.",
    evidenceComparison: evidenceLines(instance),
    targetResult,
    conclusion: `The correct answer is ‘${correct}’.`,
    commonTrapAlert: trapAlert(options, correct),
  };
}
