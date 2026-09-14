import { normalizeWfmWord } from "./lexicon";

function counts(word: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const letter of normalizeWfmWord(word)) out[letter] = (out[letter] ?? 0) + 1;
  return out;
}

export function independentlyCanForm(sourceWord: string, candidateWord: string): boolean {
  const source = counts(sourceWord);
  const candidate = counts(candidateWord);
  return Object.entries(candidate).every(([letter, needed]) => needed <= (source[letter] ?? 0));
}

export function solveDirectWfm(sourceWord: string, optionWords: readonly string[], task: "CAN_FORM" | "CANNOT_FORM"): number {
  const truth = optionWords.map((word) => independentlyCanForm(sourceWord, word));
  const matching = truth
    .map((canForm, index) => ({ canForm, index }))
    .filter((entry) => task === "CAN_FORM" ? entry.canForm : !entry.canForm);
  if (matching.length !== 1) throw new Error(`Independent WFM direct solver found ${matching.length} answers.`);
  return matching[0].index;
}

export function independentAnagram(left: string, right: string): boolean {
  const a = counts(left);
  const b = counts(right);
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].every((key) => (a[key] ?? 0) === (b[key] ?? 0));
}

export function applyNumberSequence(scrambled: string, sequenceText: string): string {
  const sequence = sequenceText.split(",").map((part) => Number(part.trim()));
  return sequence.map((index) => scrambled[index - 1] ?? "").join("");
}
