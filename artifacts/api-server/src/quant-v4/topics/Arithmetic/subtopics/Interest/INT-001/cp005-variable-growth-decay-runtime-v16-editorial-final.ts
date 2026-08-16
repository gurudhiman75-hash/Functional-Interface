import { add, div, mul, rat, sub, type Rational } from "./cp003-exam-model";
import {
  INT_CP005_RUNTIME_VERSION_V16,
  INT_CP005_V16_QL_IDS,
  INT_CP005_V16_SCOPE_DECISION,
  generateIntCp005QuestionV16Editorial as generateEditorialBase,
  type IntCp005QuestionV16,
} from "./cp005-variable-growth-decay-runtime-v16-editorial";
import { generateIntCp005QuestionV16Final } from "./cp005-variable-growth-decay-runtime-v16-final";
import type { IntCp005Option, IntCp005State } from "./cp005-variable-growth-decay-runtime";

export { INT_CP005_RUNTIME_VERSION_V16, INT_CP005_V16_QL_IDS, INT_CP005_V16_SCOPE_DECISION };
export type { IntCp005QuestionV16 };

const MAX_OPTION_VALUE = 300000n;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}
function factor(rate: Rational, direction: "GROWTH" | "DECAY" = "GROWTH"): Rational {
  const fraction = div(rate, rat(100n));
  return direction === "GROWTH" ? add(rat(1n), fraction) : sub(rat(1n), fraction);
}
function product(values: readonly Rational[]): Rational { return values.reduce((acc, value) => mul(acc, value), rat(1n)); }
function growthProduct(rates: readonly Rational[]): Rational { return product(rates.map((rate) => factor(rate))); }
function decayProduct(rates: readonly Rational[]): Rational { return product(rates.map((rate) => factor(rate, "DECAY"))); }
function abs(value: Rational): Rational { return value.numerator < 0n ? rat(-value.numerator, value.denominator) : value; }
function key(value: Rational): string { return `${value.numerator}/${value.denominator}`; }
function integer(value: Rational): bigint {
  if (value.denominator !== 1n) throw new Error(`V16 final editorial option is not integral: ${key(value)}`);
  return value.numerator;
}
function indian(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const source = (value < 0n ? -value : value).toString();
  if (source.length <= 3) return sign + source;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${sign}${groups.join(",")},${tail}`;
}
function money(value: Rational): string { return `₹${indian(integer(value))}`; }

interface Candidate {
  readonly value: Rational;
  readonly misconceptionId: string;
  readonly feedback: string;
}
function exactFriendly(correct: Rational, candidates: readonly Candidate[]): readonly Candidate[] {
  const used = new Set([key(correct)]);
  const output: Candidate[] = [];
  for (const candidate of candidates) {
    if (candidate.value.denominator !== 1n) continue;
    if (candidate.value.numerator <= 0n || candidate.value.numerator > MAX_OPTION_VALUE) continue;
    const candidateKey = key(candidate.value);
    if (used.has(candidateKey)) continue;
    output.push(deepFreeze(candidate));
    used.add(candidateKey);
    if (output.length === 3) return Object.freeze(output);
  }
  throw new Error("INT-QL-092/V16: could not build three exact misconception options within ₹3 lakh");
}
function ql092Candidates(state: Extract<IntCp005State, { qlId: "INT-QL-092" }>, correct: Rational): readonly Candidate[] {
  const positiveRates = state.signedRates.filter((rate) => rate.numerator > 0n);
  const negativeRates = state.signedRates.filter((rate) => rate.numerator < 0n).map(abs);
  const sum = state.signedRates.reduce((acc, rate) => add(acc, rate), rat(0n));
  const linear = mul(state.initial, add(rat(1n), div(sum, rat(100n))));
  const allIncrease = mul(state.initial, growthProduct(state.signedRates.map(abs)));
  const factorsWithoutLast = state.signedRates.slice(0, -1).map((rate) => rate.numerator >= 0n ? factor(rate) : factor(abs(rate), "DECAY"));
  const omitLast = mul(state.initial, product(factorsWithoutLast));
  const positiveOnly = mul(state.initial, growthProduct(positiveRates));
  const negativeOnly = mul(state.initial, decayProduct(negativeRates));
  const simpleLossRate = negativeRates.reduce((acc, rate) => add(acc, rate), rat(0n));
  const decreaseOnOriginal = sub(positiveOnly, mul(state.initial, div(simpleLossRate, rat(100n))));

  return exactFriendly(correct, [
    { value: linear, misconceptionId: "ADD_SIGNED_RATES", feedback: "This combines successive percentage changes by simple addition." },
    { value: allIncrease, misconceptionId: "ALL_INCREASE", feedback: "A decrease has been treated as an increase." },
    { value: omitLast, misconceptionId: "OMIT_LAST_CHANGE", feedback: "The last year's change has been omitted." },
    { value: decreaseOnOriginal, misconceptionId: "DECREASE_ON_ORIGINAL", feedback: "The decrease has been taken on the original value instead of the updated value." },
    { value: positiveOnly, misconceptionId: "IGNORE_DECREASE", feedback: "The decrease has been ignored." },
    { value: negativeOnly, misconceptionId: "IGNORE_INCREASE", feedback: "The increase has been ignored." },
  ]);
}
function rebuiltOptions(question: IntCp005QuestionV16, candidates: readonly Candidate[]): readonly IntCp005Option[] {
  const output: IntCp005Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === question.correctIndex) {
      output.push(question.options[index]!);
      continue;
    }
    const candidate = candidates[wrongIndex++]!;
    output.push(deepFreeze({
      text: money(candidate.value),
      value: candidate.value,
      misconceptionId: candidate.misconceptionId,
      studentFeedback: candidate.feedback,
      isCorrect: false,
    }));
  }
  return Object.freeze(output);
}

export function generateIntCp005QuestionV16EditorialFinal(
  qlId: Parameters<typeof generateIntCp005QuestionV16Final>[0],
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp005QuestionV16 {
  if (qlId !== "INT-QL-092") return generateEditorialBase(qlId, seed, locale);

  const source = generateIntCp005QuestionV16Final(qlId, seed, locale);
  if (source.mathematicalState.qlId !== "INT-QL-092") throw new Error(`${qlId}/${seed}: wrong state in V16 editorial final`);
  const candidates = ql092Candidates(source.mathematicalState, source.solution);
  const options = rebuiltOptions(source, candidates);
  return deepFreeze({
    ...source,
    options,
    correctAnswer: options[source.correctIndex]!.text,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|V16_EDITORIAL_FINAL_EXACT_DISTRACTORS`,
  });
}
