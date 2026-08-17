import type { GeneratedWorQuestion, WorBankingSide, WorBankingTrace, WorBankingTransformation } from "./foundation/types";

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function indexFromSide(length: number, rank: number, side: WorBankingSide): number {
  return side === "LEFT" ? rank - 1 : length - rank;
}

function sideText(side: WorBankingSide): string {
  return side.toLowerCase();
}

function directionText(trace: WorBankingTrace): string {
  return trace.sortDirection === "ASCENDING" ? "normal dictionary order" : "reverse dictionary order";
}

function transformationText(transformation: WorBankingTransformation): string {
  const text: Record<WorBankingTransformation, string> = {
    NONE: "Do not change the letter groups.",
    SWAP_FIRST_SECOND: "Interchange the first and second letters of every group.",
    SWAP_FIRST_LAST: "Interchange the first and last letters of every group.",
    SORT_LETTERS_ASC: "Arrange the letters within each group in alphabetical order.",
    SHIFT_FIRST_PREVIOUS: "Replace the first letter of every group with the immediately preceding letter of the alphabet.",
    SHIFT_FIRST_NEXT: "Replace the first letter of every group with the immediately following letter of the alphabet.",
  };
  return text[transformation];
}

function movementText(offset: number): string {
  const count = Math.abs(offset);
  const unit = count === 1 ? "place" : "places";
  return `Then move ${count} ${unit} ${offset > 0 ? "forward" : "backward"} in the alphabet.`;
}

function renderEnglishBankingStem(trace: WorBankingTrace): string {
  const direction = directionText(trace);
  switch (trace.taskKind) {
    case "BANK_PLAIN_CLUSTER_POSITION":
      return `Arrange the five three-letter groups in ${direction}. Which group is ${ordinal(trace.wordRank!)} from the ${sideText(trace.wordRankSide!)}?`;
    case "BANK_SORT_CONCAT_CHAR":
      return `Arrange the five groups in ${direction} and join them without spaces. Which letter is ${ordinal(trace.globalCharacterIndex!)} from the ${sideText(trace.globalCharacterSide!)} in the resulting string?`;
    case "BANK_SORT_LOCAL_CHAR": {
      const offset = trace.alphabetOffset ?? 0;
      const movement = offset === 0 ? "" : ` ${movementText(offset)}`;
      return `Arrange the five groups in ${direction}. Take the ${ordinal(trace.wordRank!)} group from the ${sideText(trace.wordRankSide!)} and the ${ordinal(trace.characterIndex!)} letter from the ${sideText(trace.characterSide!)} within that group.${movement} What is the final letter?`;
    }
    case "BANK_TRANSFORM_SORT_POSITION": {
      const transformation = transformationText(trace.transformation);
      const query = trace.answerMode === "ORIGINAL"
        ? `Which original group corresponds to the ${ordinal(trace.wordRank!)} transformed group from the ${sideText(trace.wordRankSide!)}?`
        : `Which transformed group is ${ordinal(trace.wordRank!)} from the ${sideText(trace.wordRankSide!)}?`;
      return `${transformation} Arrange the resulting groups in ${direction}. ${query}`;
    }
    case "BANK_TRANSFORM_SORT_LOCAL_CHAR":
      return `${transformationText(trace.transformation)} Arrange the resulting groups in ${direction}. In the ${ordinal(trace.wordRank!)} transformed group from the ${sideText(trace.wordRankSide!)}, which letter is ${ordinal(trace.characterIndex!)} from the ${sideText(trace.characterSide!)}?`;
  }
}

function renderEnglishBankingExplanation(trace: WorBankingTrace, answer: string): string {
  const order = trace.orderedTokens.join(" → ");
  const rule = "For dictionary order, compare groups from left to right and use the first differing letter.";
  const mapping = trace.originalTokens.map((token, index) => `${token}→${trace.transformedTokens[index]}`).join(", ");
  const transform = trace.transformation === "NONE" ? "" : ` After the stated transformation: ${mapping}.`;

  switch (trace.taskKind) {
    case "BANK_PLAIN_CLUSTER_POSITION":
      return `${rule} The correct order is ${order}. The ${ordinal(trace.wordRank!)} group from the ${sideText(trace.wordRankSide!)} is ${answer}.`;
    case "BANK_SORT_CONCAT_CHAR":
      return `${rule} The order is ${order}. Joining the groups without spaces gives ${trace.concatenated}. The ${ordinal(trace.globalCharacterIndex!)} letter from the ${sideText(trace.globalCharacterSide!)} is ${answer}.`;
    case "BANK_SORT_LOCAL_CHAR": {
      const selected = trace.orderedTokens[indexFromSide(trace.orderedTokens.length, trace.wordRank!, trace.wordRankSide!)]!;
      const base = selected[indexFromSide(selected.length, trace.characterIndex!, trace.characterSide!)]!;
      const offset = trace.alphabetOffset ?? 0;
      const finalStep = offset === 0
        ? `No alphabet shift is required, so the answer remains ${answer}.`
        : `${movementText(offset)} ${base} becomes ${answer}.`;
      return `${rule} The order is ${order}. The ${ordinal(trace.wordRank!)} group from the ${sideText(trace.wordRankSide!)} is ${selected}. Its ${ordinal(trace.characterIndex!)} letter from the ${sideText(trace.characterSide!)} is ${base}. ${finalStep}`;
    }
    case "BANK_TRANSFORM_SORT_POSITION":
      return `${rule}${transform} The transformed order is ${order}. The ${ordinal(trace.wordRank!)} transformed group from the ${sideText(trace.wordRankSide!)} corresponds to ${trace.answerMode === "ORIGINAL" ? `the original group ${answer}` : `the transformed group ${answer}`}.`;
    case "BANK_TRANSFORM_SORT_LOCAL_CHAR": {
      const selected = trace.orderedTokens[indexFromSide(trace.orderedTokens.length, trace.wordRank!, trace.wordRankSide!)]!;
      const value = selected[indexFromSide(selected.length, trace.characterIndex!, trace.characterSide!)]!;
      return `${rule}${transform} The transformed order is ${order}. The ${ordinal(trace.wordRank!)} group from the ${sideText(trace.wordRankSide!)} is ${selected}; its ${ordinal(trace.characterIndex!)} letter from the ${sideText(trace.characterSide!)} is ${value}. Therefore, the answer is ${answer}.`;
    }
  }
}

export function toWorStudentFacingQuestion(question: GeneratedWorQuestion): GeneratedWorQuestion {
  const structuredPrompt = { ...question.structuredPrompt };
  delete structuredPrompt.transformedWords;

  if (question.locale !== "en-IN" || !question.metadata.bankingTrace) {
    return { ...question, structuredPrompt };
  }

  return {
    ...question,
    structuredPrompt,
    stem: renderEnglishBankingStem(question.metadata.bankingTrace),
    explanation: renderEnglishBankingExplanation(question.metadata.bankingTrace, question.answer),
  };
}
