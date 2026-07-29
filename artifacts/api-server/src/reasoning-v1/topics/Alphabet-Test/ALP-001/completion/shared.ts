import { shuffle } from "../foundation/prng";
import type { AlpDifficulty, AlpLocale, AlpOption, AlpQuestionLogic } from "../types";

export const A = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
export const D = [..."0123456789"];
export const S = ["@", "#", "$", "%", "&", "*", "+", "?"];
export const WORDS = ["SABERTOOTH", "ACHIEVEMENTS", "STREAMING", "DAREDEVIL", "GOVERNMENT", "VIRTUAL", "PACKETS", "WONDERS", "FORMATION", "BACKFIELDS", "COMPREHENSION", "IMAGINARY"] as const;
export const CLASS_WORDS = ["PLANET", "COUNTRY", "BRIGHT", "JOURNEY", "CAPTURE", "SILVER", "FORMULA", "MARKET"] as const;
export type L = { en: string; hi: string; pa: string };
export type C = { source: string[]; changed?: string[]; word?: string; changedWord?: string; answer: string; pool: string[]; operation: L; query: L; working: L; shortcut: L };

export const tr = (locale: AlpLocale, text: L) => locale === "hi-IN" ? text.hi : locale === "pa-IN" ? text.pa : text.en;
export const key = (ql: AlpQuestionLogic, seed: number, salt: string) => `${ql.qlId}:${seed}:${salt}`;
export const rank = (token: string) => token.charCodeAt(0) - 64;
export const shift = (token: string, amount: number) => A[((rank(token) - 1 + amount) % 26 + 26) % 26]!;
export const vowel = (token: string) => "AEIOU".includes(token);
export const letter = (token: string) => /^[A-Z]$/.test(token);
export const digit = (token: string) => /^\d$/.test(token);
export const symbol = (token: string) => !letter(token) && !digit(token);
export const swap = <T>(items: readonly T[]) => {
  const result = [...items];
  for (let index = 0; index + 1 < result.length; index += 2) {
    [result[index], result[index + 1]] = [result[index + 1]!, result[index]!];
  }
  return result;
};
export const track = (items: readonly string[]) => items.map((token, index) => ({ token, position: index + 1, reversePosition: items.length - index }));
export const nums = (answer: number, maximum = 99) => [answer, Math.max(0, answer - 1), answer + 1, Math.max(0, answer - 2), answer + 2, Math.max(0, answer - 3), answer + 3].filter((value) => value === answer || value <= maximum).map(String);
export const seqMiss = (value: string) => [value, [...value].reverse().join(""), swap([...value]).join(""), [...value.slice(1), value[0]!].join(""), `${value.slice(0, -1)}${value[0]}`];

export function allPairs(items: readonly string[]) {
  const pairs: string[] = [];
  for (let first = 0; first < items.length; first += 1) {
    for (let second = first + 1; second < items.length; second += 1) pairs.push(`${items[first]} : ${items[second]}`);
  }
  return [...new Set(pairs)];
}

function shapedFallback(answer: string, ql: AlpQuestionLogic): string[] {
  if (ql.answerType === "NUMBER") return Array.from({ length: 100 }, (_, index) => String(index));
  if (ql.answerType === "TOKEN_PAIR") return allPairs([...A.slice(0, 8), ...D]);
  if (ql.answerType === "TOKEN_SEQUENCE") return [...seqMiss(answer), ...WORDS, ...CLASS_WORDS];
  if (ql.answerType === "LETTER") return A;
  return [...A, ...D, ...S];
}

export function options(answer: string, pool: readonly string[], ql: AlpQuestionLogic, seed: number) {
  const unique = [answer, ...pool].filter((value, index, values) => value && values.indexOf(value) === index);
  for (const value of shapedFallback(answer, ql)) {
    if (unique.length >= 4) break;
    if (!unique.includes(value)) unique.push(value);
  }
  const chosen = [answer, ...shuffle(unique.filter((value) => value !== answer), key(ql, seed, "options")).slice(0, 3)];
  const order = shuffle(chosen, key(ql, seed, "option-order"));
  const trapLabels = ["SOURCE_ROW_EARLY", "OPPOSITE_REFERENCE", "WRONG_FINAL_CONDITION"] as const;
  let wrongIndex = 0;
  const out = order.map((value): AlpOption => ({ value, errorLabel: value === answer ? null : trapLabels[wrongIndex++]! }));
  const correctIndex = out.findIndex((option) => option.value === answer);
  if (correctIndex < 0 || new Set(out.map((option) => option.value)).size !== 4) throw new Error(`${ql.qlId} invalid options`);
  return { out, correctIndex };
}

export function difficulty(ql: AlpQuestionLogic, seed: number): AlpDifficulty {
  const cycle = Math.abs(seed) % 3;
  const checkpoint = Number(ql.checkpointId.slice(-3));
  if (cycle === 0) return checkpoint >= 8 ? "MEDIUM" : "EASY";
  return cycle === 1 ? "MEDIUM" : "HARD";
}

export function wordPairs(word: string, direction: "BOTH" | "FORWARD" | "BACKWARD" = "BOTH") {
  const tokens = [...word];
  const pairs: Array<readonly [string, string]> = [];
  for (let first = 0; first < tokens.length; first += 1) {
    for (let second = first + 1; second < tokens.length; second += 1) {
      if (second - first !== Math.abs(rank(tokens[first]!) - rank(tokens[second]!))) continue;
      const forward = rank(tokens[first]!) < rank(tokens[second]!);
      if ((direction === "FORWARD" && !forward) || (direction === "BACKWARD" && forward)) continue;
      pairs.push([tokens[first]!, tokens[second]!] as const);
    }
  }
  return pairs;
}

export function mixed(ql: AlpQuestionLogic, seed: number) {
  return shuffle([
    ...shuffle(A, key(ql, seed, "letters")).slice(0, 8),
    ...shuffle(D, key(ql, seed, "digits")).slice(0, 8),
    ...shuffle(S, key(ql, seed, "symbols")),
  ], key(ql, seed, "mixed"));
}

export const adj = (items: readonly string[], first: (value: string) => boolean, second: (value: string) => boolean) => items.slice(0, -1).filter((value, index) => first(value) && second(items[index + 1]!)).length;
