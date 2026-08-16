import { add, div, mul, rat, sub, type Rational } from "./cp003-exam-model";
import {
  INT_CP005_RUNTIME_VERSION_V16,
  INT_CP005_V16_QL_IDS,
  INT_CP005_V16_SCOPE_DECISION,
  generateIntCp005QuestionV16Final,
  type IntCp005QuestionV16,
} from "./cp005-variable-growth-decay-runtime-v16-final";
import type { IntCp005Option, IntCp005State } from "./cp005-variable-growth-decay-runtime";

export { INT_CP005_RUNTIME_VERSION_V16, INT_CP005_V16_QL_IDS, INT_CP005_V16_SCOPE_DECISION };
export type { IntCp005QuestionV16 };

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
function abs(value: Rational): Rational { return value.numerator < 0n ? rat(-value.numerator, value.denominator) : value; }
function key(value: Rational): string { return `${value.numerator}/${value.denominator}`; }
function integer(value: Rational): bigint {
  if (value.denominator !== 1n) throw new Error(`V16 editorial option is not integral: ${key(value)}`);
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
function exactUnique(correct: Rational, candidates: readonly Candidate[]): readonly Candidate[] {
  const used = new Set([key(correct)]);
  const output: Candidate[] = [];
  for (const candidate of candidates) {
    if (candidate.value.denominator !== 1n || candidate.value.numerator <= 0n) continue;
    if (used.has(key(candidate.value))) continue;
    output.push(deepFreeze(candidate));
    used.add(key(candidate.value));
    if (output.length === 3) break;
  }
  if (output.length !== 3) throw new Error(`V16 editorial could not construct three exact misconception distractors`);
  return Object.freeze(output);
}
function omissionValues(initial: Rational, rates: readonly Rational[]): readonly Rational[] {
  return Object.freeze(rates.map((_rate, omittedIndex) => mul(initial, growthProduct(rates.filter((_r, index) => index !== omittedIndex)))));
}
function singleYearValues(initial: Rational, rates: readonly Rational[]): readonly Rational[] {
  return Object.freeze(rates.map((rate) => mul(initial, factor(rate))));
}
function reverseOneFactorValues(finalValue: Rational, rates: readonly Rational[], direction: "GROWTH" | "DECAY"): readonly Rational[] {
  return Object.freeze(rates.map((rate) => div(finalValue, factor(rate, direction))));
}
function hybridMixedError(state: Extract<IntCp005State, { qlId: "INT-QL-092" }>): Rational {
  const positiveRates = state.signedRates.filter((rate) => rate.numerator > 0n);
  const negativeRates = state.signedRates.filter((rate) => rate.numerator < 0n).map(abs);
  const grown = mul(state.initial, growthProduct(positiveRates));
  const simpleLossRate = negativeRates.reduce((acc, rate) => add(acc, rate), rat(0n));
  const lossOnOriginal = mul(state.initial, div(simpleLossRate, rat(100n)));
  return sub(grown, lossOnOriginal);
}
function candidatesFor(question: IntCp005QuestionV16): readonly Candidate[] | null {
  const state = question.mathematicalState;
  switch (state.qlId) {
    case "INT-QL-086": {
      const sumRates = state.rates.reduce((acc, rate) => add(acc, rate), rat(0n));
      const linear = mul(state.initial, add(rat(1n), div(sumRates, rat(100n))));
      const omitted = omissionValues(state.initial, state.rates);
      const oneYearOnly = singleYearValues(state.initial, state.rates);
      return exactUnique(question.solution, [
        { value: linear, misconceptionId: "ADD_RATES", feedback: "This adds the yearly rates as if every rate acted on the original principal." },
        ...omitted.map((value, index) => ({ value, misconceptionId: `OMIT_YEAR_${index + 1}`, feedback: `The ${index + 1}${index === 0 ? "st" : index === 1 ? "nd" : "rd"} year's compound factor has been omitted.` })),
        ...oneYearOnly.map((value, index) => ({ value, misconceptionId: `ONLY_YEAR_${index + 1}`, feedback: `Only the ${index + 1}${index === 0 ? "st" : index === 1 ? "nd" : "rd"} year's rate has been applied.` })),
      ]);
    }
    case "INT-QL-088": {
      const reverseOne = reverseOneFactorValues(state.finalValue, state.rates, "GROWTH");
      return exactUnique(question.solution, [
        { value: state.finalValue, misconceptionId: "NO_REVERSE", feedback: "The final amount has been used without reversing the compound factors." },
        ...reverseOne.map((value, index) => ({ value, misconceptionId: `REVERSE_ONLY_YEAR_${index + 1}`, feedback: "Only one yearly compound factor has been reversed." })),
      ]);
    }
    case "INT-QL-091": {
      const reverseOne = reverseOneFactorValues(state.finalValue, state.decayRates, "DECAY");
      return exactUnique(question.solution, [
        { value: state.finalValue, misconceptionId: "NO_REVERSE", feedback: "The depreciated value has been used without reversing the depreciation factors." },
        ...reverseOne.map((value, index) => ({ value, misconceptionId: `REVERSE_ONLY_YEAR_${index + 1}`, feedback: "Only one yearly depreciation factor has been reversed." })),
      ]);
    }
    case "INT-QL-092": {
      const sum = state.signedRates.reduce((acc, rate) => add(acc, rate), rat(0n));
      const linear = mul(state.initial, add(rat(1n), div(sum, rat(100n))));
      const allIncrease = mul(state.initial, growthProduct(state.signedRates.map(abs)));
      const omitLast = mul(state.initial, product(state.signedRates.slice(0, -1).map((rate) => rate.numerator >= 0n ? factor(rate) : factor(abs(rate), "DECAY"))));
      const hybrid = hybridMixedError(state);
      return exactUnique(question.solution, [
        { value: linear, misconceptionId: "ADD_SIGNED_RATES", feedback: "This combines successive percentage changes by simple addition." },
        { value: allIncrease, misconceptionId: "ALL_INCREASE", feedback: "A decrease has been treated as an increase." },
        { value: omitLast, misconceptionId: "OMIT_LAST_CHANGE", feedback: "The last year's change has been omitted." },
        { value: hybrid, misconceptionId: "DECREASE_ON_ORIGINAL", feedback: "The decrease has been taken on the original value instead of the updated value." },
      ]);
    }
    default:
      return null;
  }
}
function rebuiltOptions(question: IntCp005QuestionV16, candidates: readonly Candidate[]): readonly IntCp005Option[] {
  const output: IntCp005Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === question.correctIndex) {
      output.push(question.options[index]!);
    } else {
      const candidate = candidates[wrongIndex++]!;
      output.push(deepFreeze({
        text: money(candidate.value),
        value: candidate.value,
        misconceptionId: candidate.misconceptionId,
        studentFeedback: candidate.feedback,
        isCorrect: false,
      }));
    }
  }
  return Object.freeze(output);
}

export function generateIntCp005QuestionV16Editorial(
  qlId: Parameters<typeof generateIntCp005QuestionV16Final>[0],
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp005QuestionV16 {
  const source = generateIntCp005QuestionV16Final(qlId, seed, locale);
  const candidates = candidatesFor(source);
  if (!candidates) return source;
  const options = rebuiltOptions(source, candidates);
  return deepFreeze({
    ...source,
    options,
    correctAnswer: options[source.correctIndex]!.text,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|V16_EDITORIAL_EXACT_DISTRACTORS`,
  });
}
