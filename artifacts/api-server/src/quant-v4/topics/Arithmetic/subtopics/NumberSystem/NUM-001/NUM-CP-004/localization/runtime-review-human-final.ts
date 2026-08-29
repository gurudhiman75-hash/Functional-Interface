import type { NumCp004PermanentQlId } from "../permanent/allocation";
import { runNumCp004LocalizedReviewFinalForQl as runBase } from "./runtime-review-final";
import type { NumCp004LocalizedQuestion, NumCp004TranslatedLanguage } from "./types";

function isPrime(value: number): boolean {
  if (!Number.isSafeInteger(value) || value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function primesBetween(lower: number, upper: number): number[] {
  const values: number[] = [];
  for (let value = lower; value <= upper; value += 1) if (isPrime(value)) values.push(value);
  return values;
}

function math(value: string | number): string {
  return `\\(${String(value)}\\)`;
}

function intervalPrimeEvidence(
  question: NumCp004LocalizedQuestion,
  language: NumCp004TranslatedLanguage,
): string | null {
  const state = question.hiddenState as Readonly<Record<string, unknown>>;
  if (state.mode !== "ADJACENT_PRIME") return null;
  const direction = String(state.direction ?? "");
  if (direction !== "LEAST" && direction !== "GREATEST") return null;
  if (typeof state.lower !== "number" || !Number.isSafeInteger(state.lower)) return null;
  if (typeof state.upper !== "number" || !Number.isSafeInteger(state.upper)) return null;

  const lower = state.lower;
  const upper = state.upper;
  const primes = primesBetween(lower, upper);
  if (primes.length === 0) throw new Error(`No prime in CP004 interval [${lower}, ${upper}]`);
  const answer = direction === "LEAST" ? primes[0]! : primes[primes.length - 1]!;
  const set = math(`\\{${primes.join(", ")}\\}`);

  if (language === "hi") {
    return direction === "LEAST"
      ? `${math(lower)} से ${math(upper)} तक अभाज्य संख्याएँ ${set} हैं; इनमें सबसे छोटी ${math(answer)} है।`
      : `${math(lower)} से ${math(upper)} तक अभाज्य संख्याएँ ${set} हैं; इनमें सबसे बड़ी ${math(answer)} है।`;
  }
  return direction === "LEAST"
    ? `${math(lower)} ਤੋਂ ${math(upper)} ਤੱਕ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ${set} ਹਨ; ਇਨ੍ਹਾਂ ਵਿੱਚ ਸਭ ਤੋਂ ਛੋਟੀ ${math(answer)} ਹੈ।`
    : `${math(lower)} ਤੋਂ ${math(upper)} ਤੱਕ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ${set} ਹਨ; ਇਨ੍ਹਾਂ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡੀ ${math(answer)} ਹੈ।`;
}

export function runNumCp004LocalizedReviewFinalForQl(
  questionLanguageId: NumCp004PermanentQlId,
  seed: number,
  language: NumCp004TranslatedLanguage,
): NumCp004LocalizedQuestion {
  const question = runBase(questionLanguageId, seed, language);
  const evidence = intervalPrimeEvidence(question, language);
  if (evidence === null) return question;

  const solution = [...question.explanation.solution];
  solution[1] = evidence;
  return Object.freeze({
    ...question,
    explanation: Object.freeze({
      ...question.explanation,
      solution: Object.freeze(solution),
    }),
  });
}
