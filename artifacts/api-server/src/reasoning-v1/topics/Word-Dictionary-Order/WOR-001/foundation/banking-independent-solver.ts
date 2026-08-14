import { independentlySortWorWords } from "./independent-lexical-solver";
import type { WorBankingTrace, WorBankingTransformation } from "./types";

function transformIndependently(token: string, transformation: WorBankingTransformation): string {
  const a = token.charAt(0).toUpperCase();
  const b = token.charAt(1).toUpperCase();
  const c = token.charAt(2).toUpperCase();
  switch (transformation) {
    case "NONE": return `${a}${b}${c}`;
    case "SWAP_FIRST_SECOND": return `${b}${a}${c}`;
    case "SWAP_FIRST_LAST": return `${c}${b}${a}`;
    case "SORT_LETTERS_ASC": {
      const codes = [a.charCodeAt(0), b.charCodeAt(0), c.charCodeAt(0)].sort((left, right) => left - right);
      return codes.map((code) => String.fromCharCode(code)).join("");
    }
    case "SHIFT_FIRST_PREVIOUS": return `${String.fromCharCode(a.charCodeAt(0) - 1)}${b}${c}`;
    case "SHIFT_FIRST_NEXT": return `${String.fromCharCode(a.charCodeAt(0) + 1)}${b}${c}`;
  }
}

function positionIndex(length: number, rank: number, side: "LEFT" | "RIGHT"): number {
  return side === "LEFT" ? rank - 1 : length - rank;
}

function shiftAlphabet(letter: string, offset: number): string {
  const code = letter.charCodeAt(0) + offset;
  if (code < 65 || code > 90) throw new Error("Independent Banking solver encountered an out-of-range alphabet offset.");
  return String.fromCharCode(code);
}

export interface IndependentBankingSolution {
  readonly transformedTokens: readonly string[];
  readonly orderedTokens: readonly string[];
  readonly orderedSourceTokens: readonly string[];
  readonly concatenated?: string;
  readonly answer: string;
}

export function independentlySolveBankingTrace(trace: WorBankingTrace): IndependentBankingSolution {
  const transformedTokens = trace.originalTokens.map((token) => transformIndependently(token, trace.transformation));
  if (new Set(transformedTokens).size !== transformedTokens.length) throw new Error("Independent Banking solver found duplicate transformed tokens.");
  const transformedToSource = new Map(transformedTokens.map((token, index) => [token, trace.originalTokens[index]!]));
  const ascending = independentlySortWorWords(transformedTokens);
  const orderedTokens = trace.sortDirection === "ASCENDING" ? ascending : [...ascending].reverse();
  const orderedSourceTokens = orderedTokens.map((token) => transformedToSource.get(token)!);

  if (trace.taskKind === "BANK_PLAIN_CLUSTER_POSITION") {
    const index = positionIndex(orderedTokens.length, trace.wordRank!, trace.wordRankSide!);
    return { transformedTokens, orderedTokens, orderedSourceTokens, answer: orderedSourceTokens[index]! };
  }

  if (trace.taskKind === "BANK_SORT_CONCAT_CHAR") {
    const concatenated = orderedTokens.join("");
    const index = positionIndex(concatenated.length, trace.globalCharacterIndex!, trace.globalCharacterSide!);
    return { transformedTokens, orderedTokens, orderedSourceTokens, concatenated, answer: concatenated[index]! };
  }

  if (trace.taskKind === "BANK_SORT_LOCAL_CHAR" || trace.taskKind === "BANK_TRANSFORM_SORT_LOCAL_CHAR") {
    const wordIndex = positionIndex(orderedTokens.length, trace.wordRank!, trace.wordRankSide!);
    const selected = orderedTokens[wordIndex]!;
    const charIndex = positionIndex(selected.length, trace.characterIndex!, trace.characterSide!);
    const base = selected[charIndex]!;
    const answer = shiftAlphabet(base, trace.alphabetOffset ?? 0);
    return { transformedTokens, orderedTokens, orderedSourceTokens, answer };
  }

  const wordIndex = positionIndex(orderedTokens.length, trace.wordRank!, trace.wordRankSide!);
  const answer = trace.answerMode === "ORIGINAL" ? orderedSourceTokens[wordIndex]! : orderedTokens[wordIndex]!;
  return { transformedTokens, orderedTokens, orderedSourceTokens, answer };
}
