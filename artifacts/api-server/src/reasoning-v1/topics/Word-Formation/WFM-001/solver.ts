import type { WfmTask } from "./types";

function independentCounts(word: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const raw of word.toUpperCase()) {
    if (raw < "A" || raw > "Z") continue;
    out[raw] = (out[raw] ?? 0) + 1;
  }
  return out;
}

export function independentlyCanForm(sourceWord: string, candidateWord: string): boolean {
  const source = independentCounts(sourceWord);
  const candidate = independentCounts(candidateWord);
  return Object.entries(candidate).every(([letter, needed]) => needed <= (source[letter] ?? 0));
}

export function solveWfmOptions(sourceWord: string, optionWords: readonly string[], task: WfmTask): number {
  const truth = optionWords.map((word) => independentlyCanForm(sourceWord, word));
  const matching = truth
    .map((canForm, index) => ({ canForm, index }))
    .filter((entry) => task === "CAN_FORM" ? entry.canForm : !entry.canForm);
  if (matching.length !== 1) {
    throw new Error(`WFM solver expected exactly one answer for ${task}; found ${matching.length}.`);
  }
  return matching[0].index;
}
