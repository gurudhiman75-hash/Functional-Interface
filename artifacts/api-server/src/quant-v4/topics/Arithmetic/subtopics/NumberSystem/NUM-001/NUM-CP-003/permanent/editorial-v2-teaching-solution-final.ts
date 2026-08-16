import type { NumCp003RetainedHiddenState } from "../retained/runtime-types";
import {
  buildNumCp003PlainTeachingSolution,
  plainDivisibilityRule,
} from "./editorial-v2-teaching-solution";

const COMPOSITE_PARTS: Readonly<Record<number, readonly [number, number]>> = Object.freeze({
  6: [2, 3],
  12: [3, 4],
  15: [3, 5],
  18: [2, 9],
  24: [3, 8],
  36: [4, 9],
  45: [5, 9],
  72: [8, 9],
  99: [9, 11],
});

function math(value: string | number | bigint): string {
  return `\\(${String(value)}\\)`;
}

function formatInteger(value: bigint | number): string {
  return typeof value === "bigint"
    ? value.toLocaleString("en-IN")
    : Math.trunc(value).toLocaleString("en-IN");
}

function digitSum(number: bigint): { readonly expression: string; readonly total: number } {
  const digits = [...number.toString()];
  return {
    expression: digits.join(" + "),
    total: digits.reduce((sum, digit) => sum + Number(digit), 0),
  };
}

function alternateSums(number: bigint): readonly [number, number] {
  let first = 0;
  let second = 0;
  [...number.toString()].forEach((digit, index) => {
    if (index % 2 === 0) first += Number(digit);
    else second += Number(digit);
  });
  return [first, second] as const;
}

function primitiveEvidence(number: bigint, divisor: number): string {
  const digits = number.toString();
  const last = Number(digits.at(-1));
  const suffix2 = Number(digits.slice(-2));
  const suffix3 = Number(digits.slice(-3));

  switch (divisor) {
    case 2:
      return `the last digit is ${math(last)}, which is ${last % 2 === 0 ? "even" : "odd"}`;
    case 3:
    case 9: {
      const sum = digitSum(number);
      return `the digit sum is ${math(`${sum.expression} = ${sum.total}`)}, and ${math(sum.total)} is ${sum.total % divisor === 0 ? "" : "not "}divisible by ${math(divisor)}`;
    }
    case 4: {
      const remainder = suffix2 % 4;
      return remainder === 0
        ? `the last two digits are ${math(suffix2)}, and ${math(`${suffix2} \\div 4 = ${suffix2 / 4}`)} exactly`
        : `the last two digits are ${math(suffix2)}, and division by ${math(4)} leaves remainder ${math(remainder)}`;
    }
    case 5:
      return `the last digit is ${math(last)}, which is ${last === 0 || last === 5 ? "" : "not "}${math(0)} or ${math(5)}`;
    case 8: {
      const remainder = suffix3 % 8;
      return remainder === 0
        ? `the last three digits are ${math(suffix3)}, and ${math(`${suffix3} \\div 8 = ${suffix3 / 8}`)} exactly`
        : `the last three digits are ${math(suffix3)}, and division by ${math(8)} leaves remainder ${math(remainder)}`;
    }
    case 10:
      return `the last digit is ${math(last)}, which is ${last === 0 ? "" : "not "}${math(0)}`;
    case 11: {
      const [first, second] = alternateSums(number);
      const difference = Math.abs(first - second);
      return `the alternate-digit sums are ${math(first)} and ${math(second)}, so their difference is ${math(difference)}; ${math(difference)} is ${difference % 11 === 0 ? "" : "not "}${math(0)} or a multiple of ${math(11)}`;
    }
    case 25: {
      const remainder = suffix2 % 25;
      return remainder === 0
        ? `the last two digits are ${math(digits.slice(-2).padStart(2, "0"))}, which form a multiple of ${math(25)}`
        : `the last two digits are ${math(digits.slice(-2).padStart(2, "0"))}, which do not form a multiple of ${math(25)}`;
    }
    default: {
      const d = BigInt(divisor);
      const quotient = number / d;
      const remainder = number % d;
      return remainder === 0n
        ? `${math(`${formatInteger(number)} \\div ${divisor} = ${formatInteger(quotient)}`)} exactly`
        : `${math(`${formatInteger(number)} = ${divisor} \\times ${formatInteger(quotient)} + ${formatInteger(remainder)}`)}, so the remainder is ${math(remainder)}`;
    }
  }
}

function simpleApplication(number: bigint, divisorValue: bigint | number): string {
  const divisor = Number(divisorValue);
  const parts = COMPOSITE_PARTS[divisor] ?? [divisor];
  const evidence = parts.map((part) => primitiveEvidence(number, part));
  const joined = evidence.length === 1 ? evidence[0]! : `${evidence[0]}; also, ${evidence[1]}`;
  const divisible = number % BigInt(divisor) === 0n;
  return `Now apply the rule to ${math(formatInteger(number))}: ${joined}. Therefore, the number ${divisible ? "is" : "is not"} divisible by ${math(divisor)} without a remainder.`;
}

function directSolution(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DIRECT_DIVISIBILITY" }>,
): readonly string[] {
  const wantDivisible = state.requestedPolarity === "DIVISIBLE";
  const target = state.divisorOptions.find((divisor) => (state.number % divisor === 0n) === wantDivisible);
  if (target === undefined) throw new Error("Unable to identify direct-divisibility target option");
  return Object.freeze([
    plainDivisibilityRule(target),
    simpleApplication(state.number, target),
  ]);
}

function repeatedSolution(
  state: Extract<NumCp003RetainedHiddenState, { kind: "IMPLICIT_REPEATED_NUMERAL" }>,
): readonly string[] {
  const target = state.divisorOptions.find((divisor) => state.number % divisor === 0n);
  if (target === undefined) throw new Error("Unable to identify repeated-number target divisor");
  return Object.freeze([
    `Repeating ${math(state.block)} exactly ${state.repeats} times forms the number ${math(formatInteger(state.number))}.`,
    plainDivisibilityRule(target),
    simpleApplication(state.number, target),
  ]);
}

function claimSolution(
  state: Extract<NumCp003RetainedHiddenState, { kind: "CLAIM_VALIDATION" }>,
): readonly string[] {
  const wantedTruth = state.requestedPolarity === "CORRECT";
  const target = state.claims.find((claim) => claim.isTrue === wantedTruth);
  if (!target) throw new Error("Unable to identify target divisibility claim");
  return Object.freeze([
    plainDivisibilityRule(target.divisor),
    `${simpleApplication(target.number, target.divisor)} So this claim is ${target.isTrue ? "correct" : "incorrect"}.`,
  ]);
}

function splitRuleAndApplication(lines: readonly string[]): readonly string[] {
  if (lines.length >= 4) return lines;
  const result = [...lines];
  for (let index = 0; index < result.length && result.length < 4; index += 1) {
    const line = result[index]!;
    const marker = ". Here, ";
    const position = line.indexOf(marker);
    if (position < 0) continue;
    const rule = line.slice(0, position + 1).trim();
    const application = `Here, ${line.slice(position + marker.length).trim()}`;
    result.splice(index, 1, rule, application);
    index += 1;
  }
  return Object.freeze(result.slice(0, 4));
}

export function buildNumCp003FinalTeachingSolution(state: NumCp003RetainedHiddenState): readonly string[] {
  switch (state.kind) {
    case "DIRECT_DIVISIBILITY":
      return directSolution(state);
    case "IMPLICIT_REPEATED_NUMERAL":
      return repeatedSolution(state);
    case "CLAIM_VALIDATION":
      return claimSolution(state);
    default:
      return splitRuleAndApplication(buildNumCp003PlainTeachingSolution(state));
  }
}
