import type { CodCp003RuleContext, CodCp003RuleId } from "./types";

export function alphabetRankZero(letter: string): number {
  const rank = letter.charCodeAt(0) - 65;
  if (rank < 0 || rank > 25) throw new Error(`Unsupported alphabet character '${letter}'`);
  return rank;
}

export function normalizeShift(shift: number): number {
  if (!Number.isInteger(shift)) throw new Error("Shift must be an integer");
  const normalized = ((shift % 26) + 26) % 26;
  return normalized > 13 ? normalized - 26 : normalized;
}

export function shiftLetter(letter: string, shift: number): string {
  const rank = alphabetRankZero(letter);
  const moved = ((rank + shift) % 26 + 26) % 26;
  return String.fromCharCode(65 + moved);
}

export function oppositeLetter(letter: string): string {
  return String.fromCharCode(90 - alphabetRankZero(letter));
}

export function transformWord(ruleId: CodCp003RuleId, context: CodCp003RuleContext, word: string): string {
  if (ruleId === "OPPOSITE_ALPHABET_MAP") return [...word].map(oppositeLetter).join("");
  const shift = context.shift;
  if (!shift || normalizeShift(shift) === 0) throw new Error("Uniform cyclic shift requires a non-zero signed shift");
  return [...word].map((letter) => shiftLetter(letter, shift)).join("");
}

export function inverseTransformWord(ruleId: CodCp003RuleId, context: CodCp003RuleContext, code: string): string {
  if (ruleId === "OPPOSITE_ALPHABET_MAP") return transformWord(ruleId, context, code);
  return transformWord(ruleId, { shift: -(context.shift ?? 0) }, code);
}

export function letterUsesWrap(letter: string, shift: number): boolean {
  const raw = alphabetRankZero(letter) + shift;
  return raw < 0 || raw > 25;
}

export function wordUsesWrap(word: string, shift: number): boolean {
  return [...word].some((letter) => letterUsesWrap(letter, shift));
}
