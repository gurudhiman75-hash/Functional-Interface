import type { NumCp003RetainedHiddenState } from "../retained/runtime-types";
import { latexifyNumCp003LearnerText } from "./editorial-v2-math";

type OrderedPairState = Extract<
  NumCp003RetainedHiddenState,
  { kind: "ORDERED_PAIR_CANDIDATE_SET" }
>;

const COMPOSITE_PARTS: Readonly<Record<number, readonly number[]>> = Object.freeze({
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

function math(value: string): string {
  return `\\(${value}\\)`;
}

function clean(value: string): string {
  return latexifyNumCp003LearnerText(value.replace(/[ \t]+/gu, " ").trim());
}

function formatInteger(value: bigint | number): string {
  return typeof value === "bigint"
    ? value.toLocaleString("en-IN")
    : Math.trunc(value).toLocaleString("en-IN");
}

function pairSetMath(pairs: ReadonlyArray<readonly [number, number]>): string {
  if (pairs.length === 0) return math("\\varnothing");
  return math(`\\{${pairs.map(([x, y]) => `(${x}, ${y})`).join(", ")}\\}`);
}

function fillPair(template: string, x: number, y: number): string {
  return template.replaceAll("X", String(x)).replaceAll("Y", String(y));
}

interface DigitSumForm {
  readonly expanded: string;
  readonly simplified: string;
  readonly fixed: number;
  readonly xCount: number;
  readonly yCount: number;
}

function digitSumForm(template: string): DigitSumForm {
  let fixed = 0;
  let xCount = 0;
  let yCount = 0;
  const expanded: string[] = [];
  for (const character of template) {
    if (character === "X") {
      xCount += 1;
      expanded.push("X");
    } else if (character === "Y") {
      yCount += 1;
      expanded.push("Y");
    } else if (/\d/u.test(character)) {
      fixed += Number(character);
      expanded.push(character);
    }
  }
  const terms: string[] = [];
  if (fixed !== 0) terms.push(String(fixed));
  if (xCount === 1) terms.push("X");
  else if (xCount > 1) terms.push(`${xCount}X`);
  if (yCount === 1) terms.push("Y");
  else if (yCount > 1) terms.push(`${yCount}Y`);
  return {
    expanded: expanded.join(" + "),
    simplified: terms.join(" + ") || "0",
    fixed,
    xCount,
    yCount,
  };
}

function alternatingForm(template: string): readonly [string, string] {
  const first: string[] = [];
  const second: string[] = [];
  [...template].forEach((character, index) => {
    (index % 2 === 0 ? first : second).push(character);
  });
  return [first.join(" + "), second.join(" + ")] as const;
}

function primitiveParts(divisor: number): readonly number[] {
  return COMPOSITE_PARTS[divisor] ?? [divisor];
}

function primitivePhrase(template: string, divisor: number): string {
  const last = template.at(-1) ?? "";
  const suffix2 = template.slice(-2);
  const suffix3 = template.slice(-3);

  if (divisor === 2) {
    if (/^\d$/u.test(last)) {
      const digit = Number(last);
      return digit % 2 === 0
        ? `the fixed last digit ${math(last)} is even`
        : `the fixed last digit ${math(last)} is odd`;
    }
    return `${math(last)} must be even`;
  }

  if (divisor === 3 || divisor === 9) {
    const form = digitSumForm(template);
    return `the digit sum ${math(`${form.expanded} = ${form.simplified}`)} must be a multiple of ${math(String(divisor))}`;
  }

  if (divisor === 4) {
    if (/^\d{2}$/u.test(suffix2)) {
      const value = Number(suffix2);
      return value % 4 === 0
        ? `the fixed last two digits ${math(suffix2)} are divisible by ${math("4")}`
        : `the fixed last two digits ${math(suffix2)} are not divisible by ${math("4")}`;
    }
    return `the last two digits ${math(suffix2)} must be divisible by ${math("4")}`;
  }

  if (divisor === 5) {
    if (/^\d$/u.test(last)) {
      const digit = Number(last);
      return digit === 0 || digit === 5
        ? `the fixed last digit ${math(last)} satisfies divisibility by ${math("5")}`
        : `the fixed last digit ${math(last)} does not satisfy divisibility by ${math("5")}`;
    }
    return `${math(last)} must be ${math("0")} or ${math("5")}`;
  }

  if (divisor === 8) {
    if (/^\d{3}$/u.test(suffix3)) {
      const value = Number(suffix3);
      return value % 8 === 0
        ? `the fixed last three digits ${math(suffix3)} are divisible by ${math("8")}`
        : `the fixed last three digits ${math(suffix3)} are not divisible by ${math("8")}`;
    }
    return `the last three digits ${math(suffix3)} must be divisible by ${math("8")}`;
  }

  if (divisor === 9) {
    const form = digitSumForm(template);
    return `the digit sum ${math(`${form.expanded} = ${form.simplified}`)} must be a multiple of ${math("9")}`;
  }

  if (divisor === 10) {
    if (/^\d$/u.test(last)) {
      return last === "0"
        ? `the fixed last digit is ${math("0")}`
        : `the fixed last digit ${math(last)} is not ${math("0")}`;
    }
    return `${math(last)} must be ${math("0")}`;
  }

  if (divisor === 11) {
    const [first, second] = alternatingForm(template);
    return `the difference between alternating sums ${math(first)} and ${math(second)} must be ${math("0")} or a multiple of ${math("11")}`;
  }

  if (divisor === 25) {
    if (/^\d{2}$/u.test(suffix2)) {
      const value = Number(suffix2);
      return value % 25 === 0
        ? `the fixed last two digits ${math(suffix2)} are divisible by ${math("25")}`
        : `the fixed last two digits ${math(suffix2)} are not divisible by ${math("25")}`;
    }
    return `the last two digits ${math(suffix2)} must be one of ${math("00, 25, 50, 75")}`;
  }

  return `the completed number must divide exactly by ${math(String(divisor))}`;
}

function divisorCondition(template: string, divisor: number): string {
  const parts = primitiveParts(divisor);
  if (parts.length === 1) {
    return `For divisibility by ${math(String(divisor))}, ${primitivePhrase(template, parts[0]!)}.`;
  }
  const phrases = parts.map((part) => primitivePhrase(template, part));
  return `For divisibility by ${math(String(divisor))}, ${phrases[0]} and ${phrases[1]}.`;
}

function exactVerification(state: OrderedPairState): string | null {
  if (state.validPairs.length !== 1) return null;
  const [x, y] = state.validPairs[0]!;
  const completed = BigInt(fillPair(state.template, x, y));
  const checks = state.divisors.map((rawDivisor) => {
    const divisor = BigInt(rawDivisor);
    return math(`${formatInteger(completed)} \\div ${formatInteger(divisor)} = ${formatInteger(completed / divisor)}`);
  });
  const relation = state.relation
    ? ` and ${math(`${x} + ${y} = ${state.relation.value}`)}`
    : "";
  return `With ${math(`(X, Y) = (${x}, ${y})`)}, ${checks.join(" and ")} are exact${relation}.`;
}

function noSolutionReason(state: OrderedPairState): string | null {
  const primitives = [...new Set(state.divisors.flatMap((value) => primitiveParts(Number(value))))];
  const last = state.template.at(-1) ?? "";
  const suffix2 = state.template.slice(-2);
  const suffix3 = state.template.slice(-3);

  for (const divisor of primitives) {
    if (divisor === 2 && /^\d$/u.test(last) && Number(last) % 2 !== 0) {
      return `The fixed last digit is ${math(last)}, which is odd, so divisibility by ${math("2")} is impossible.`;
    }
    if (divisor === 4 && /^\d{2}$/u.test(suffix2) && Number(suffix2) % 4 !== 0) {
      return `The fixed last two digits are ${math(suffix2)}, and ${math(suffix2)} is not divisible by ${math("4")}; therefore no ordered pair can work.`;
    }
    if (divisor === 5 && /^\d$/u.test(last) && ![0, 5].includes(Number(last))) {
      return `The fixed last digit is ${math(last)}, so divisibility by ${math("5")} is impossible.`;
    }
    if (divisor === 8 && /^\d{3}$/u.test(suffix3) && Number(suffix3) % 8 !== 0) {
      return `The fixed last three digits are ${math(suffix3)}, and ${math(suffix3)} is not divisible by ${math("8")}; therefore no ordered pair can work.`;
    }
    if (divisor === 10 && /^\d$/u.test(last) && last !== "0") {
      return `The fixed last digit is ${math(last)}, not ${math("0")}, so divisibility by ${math("10")} is impossible.`;
    }
    if (divisor === 25 && /^\d{2}$/u.test(suffix2) && Number(suffix2) % 25 !== 0) {
      return `The fixed last two digits are ${math(suffix2)}, and ${math(suffix2)} is not divisible by ${math("25")}; therefore no ordered pair can work.`;
    }
  }

  if (state.relation?.kind === "DIGIT_SUM") {
    const form = digitSumForm(state.template);
    if (form.xCount === 1 && form.yCount === 1) {
      const total = form.fixed + state.relation.value;
      for (const divisor of primitives) {
        if ((divisor === 3 || divisor === 9) && total % divisor !== 0) {
          return `Since ${math(`X + Y = ${state.relation.value}`)}, the digit sum is ${math(`${form.fixed} + ${state.relation.value} = ${total}`)}, which is not a multiple of ${math(String(divisor))}; therefore no ordered pair can work.`;
        }
      }
    }
  }

  return null;
}

function outcomeSummary(state: OrderedPairState): string {
  const validSet = pairSetMath(state.validPairs);
  switch (state.projection) {
    case "UNIQUE_VALID_ORDERED_PAIR":
      return `The only valid ordered pair is ${pairSetMath([state.validPairs[0]!])}.`;
    case "VALID_ORDERED_PAIR_COUNT":
      return `The valid ordered pairs are ${validSet}, so the count is ${math(String(state.validPairs.length))}.`;
    case "COMPLETE_VALID_ORDERED_PAIR_SET":
      return `Therefore, the complete valid ordered-pair set is ${validSet}.`;
    case "PAIR_SOLUTION_CLASS": {
      const count = state.validPairs.length;
      if (count === 0) return "No ordered pair satisfies every condition, so there is no solution.";
      if (count === 1) return `The only valid ordered pair is ${validSet}, so there is exactly one solution.`;
      return `The valid ordered pairs are ${validSet}, so there are ${math(String(count))} solutions.`;
    }
    default:
      return `The valid ordered pairs are ${validSet}.`;
  }
}

export function buildNumCp003OrderedPairSolution(state: OrderedPairState): readonly string[] {
  const lines: string[] = [];

  if (state.relation?.kind === "DIGIT_SUM") {
    lines.push(`Use the extra condition ${math(`X + Y = ${state.relation.value}`)}.`);
  }

  if (state.projection === "PAIR_SOLUTION_CLASS" && state.validPairs.length === 0) {
    const decisive = noSolutionReason(state);
    if (decisive) lines.push(decisive);
    else lines.push(...state.divisors.slice(0, 2).map((divisor) => divisorCondition(state.template, Number(divisor))));
    lines.push(outcomeSummary(state));
    return Object.freeze(lines.map(clean).slice(0, 4));
  }

  const unique = state.projection === "UNIQUE_VALID_ORDERED_PAIR";
  const conditionBudget = unique ? 1 : Math.max(1, 3 - lines.length);
  lines.push(...state.divisors.slice(0, conditionBudget).map((divisor) => divisorCondition(state.template, Number(divisor))));

  if (unique) {
    const verification = exactVerification(state);
    if (verification) lines.push(verification);
  }

  lines.push(outcomeSummary(state));
  return Object.freeze(lines.map(clean).slice(0, 4));
}
