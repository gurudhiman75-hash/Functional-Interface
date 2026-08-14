import type { WorBankingTransformation } from "./types";

export const BANKING_TRANSFORMATIONS: readonly Exclude<WorBankingTransformation, "NONE">[] = [
  "SWAP_FIRST_SECOND",
  "SWAP_FIRST_LAST",
  "SORT_LETTERS_ASC",
  "SHIFT_FIRST_PREVIOUS",
  "SHIFT_FIRST_NEXT",
];

function shiftLetter(letter: string, amount: number): string {
  const code = letter.charCodeAt(0) + amount;
  if (code < 65 || code > 90) throw new Error(`Banking transformation moved ${letter} outside A-Z.`);
  return String.fromCharCode(code);
}

export function applyBankingTransformation(token: string, transformation: WorBankingTransformation): string {
  const normalized = token.toUpperCase();
  if (!/^[A-Z]{3}$/.test(normalized)) throw new Error(`Invalid three-letter banking token: ${token}`);
  const letters = [...normalized];
  switch (transformation) {
    case "NONE": return normalized;
    case "SWAP_FIRST_SECOND": return `${letters[1]}${letters[0]}${letters[2]}`;
    case "SWAP_FIRST_LAST": return `${letters[2]}${letters[1]}${letters[0]}`;
    case "SORT_LETTERS_ASC": return [...letters].sort((left, right) => left.charCodeAt(0) - right.charCodeAt(0)).join("");
    case "SHIFT_FIRST_PREVIOUS": return `${shiftLetter(letters[0]!, -1)}${letters[1]}${letters[2]}`;
    case "SHIFT_FIRST_NEXT": return `${shiftLetter(letters[0]!, 1)}${letters[1]}${letters[2]}`;
  }
}

export function transformBankingTokens(tokens: readonly string[], transformation: WorBankingTransformation): string[] {
  return tokens.map((token) => applyBankingTransformation(token, transformation));
}
