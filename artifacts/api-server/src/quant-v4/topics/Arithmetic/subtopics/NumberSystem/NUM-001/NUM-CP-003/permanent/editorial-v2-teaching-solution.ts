import type { NumCp003RetainedHiddenState } from "../retained/runtime-types";

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

function setMath(values: readonly number[]): string {
  return math(`\\{${values.join(", ")}\\}`);
}

function pairSetMath(pairs: ReadonlyArray<readonly [number, number]>): string {
  if (pairs.length === 0) return math("\\varnothing");
  return math(`\\{${pairs.map(([x, y]) => `(${x}, ${y})`).join(", ")}\\}`);
}

function fillSingleDigit(template: string, digit: number): string {
  return template.replaceAll("X", String(digit));
}

function fillPair(template: string, x: number, y: number): string {
  return template.replaceAll("X", String(x)).replaceAll("Y", String(y));
}

function fillLinked(pattern: string, a: number, b: number): string {
  return pattern.replaceAll("A", String(a)).replaceAll("B", String(b));
}

function primitiveParts(divisor: number): readonly number[] {
  return COMPOSITE_PARTS[divisor] ?? [divisor];
}

function primitiveRuleClause(divisor: number): string {
  switch (divisor) {
    case 2: return "its last digit must be even";
    case 3: return "the sum of its digits must be divisible by 3";
    case 4: return "the number formed by its last two digits must be divisible by 4";
    case 5: return "its last digit must be 0 or 5";
    case 8: return "the number formed by its last three digits must be divisible by 8";
    case 9: return "the sum of its digits must be divisible by 9";
    case 10: return "its last digit must be 0";
    case 11: return "the difference between the two alternate-digit sums must be 0 or a multiple of 11";
    case 25: return "its last two digits must be 00, 25, 50 or 75";
    default: return `division by ${divisor} must leave remainder 0`;
  }
}

export function plainDivisibilityRule(divisorValue: bigint | number): string {
  const divisor = Number(divisorValue);
  const parts = COMPOSITE_PARTS[divisor];
  if (!parts) {
    return `For a number to be divisible by ${math(divisor)} without a remainder, ${primitiveRuleClause(divisor)}.`;
  }
  return `For a number to be divisible by ${math(divisor)} without a remainder, it must be divisible by both ${math(parts[0])} and ${math(parts[1])}. For ${math(parts[0])}, ${primitiveRuleClause(parts[0])}; for ${math(parts[1])}, ${primitiveRuleClause(parts[1])}.`;
}

function digitSumOfNumber(number: bigint): { readonly expression: string; readonly total: number } {
  const digits = [...number.toString()];
  return {
    expression: digits.join(" + "),
    total: digits.reduce((sum, digit) => sum + Number(digit), 0),
  };
}

function alternateSumsOfNumber(number: bigint): readonly [number, number] {
  let first = 0;
  let second = 0;
  [...number.toString()].forEach((digit, index) => {
    if (index % 2 === 0) first += Number(digit);
    else second += Number(digit);
  });
  return [first, second] as const;
}

function primitiveNumberEvidence(number: bigint, divisor: number): string {
  const digits = number.toString();
  const last = Number(digits.at(-1));
  const suffix2Text = digits.slice(-2).padStart(2, "0");
  const suffix2 = Number(suffix2Text);
  const suffix3Text = digits.slice(-3).padStart(Math.min(3, digits.length), "0");
  const suffix3 = Number(suffix3Text);

  switch (divisor) {
    case 2:
      return `the last digit is ${math(last)}, which is ${last % 2 === 0 ? "even" : "odd"}`;
    case 3:
    case 9: {
      const sum = digitSumOfNumber(number);
      return `the digit sum is ${math(`${sum.expression} = ${sum.total}`)}, which is ${sum.total % divisor === 0 ? "" : "not "}divisible by ${math(divisor)}`;
    }
    case 4:
      return `the last two digits are ${math(suffix2Text)}, and ${math(suffix2)} is ${suffix2 % 4 === 0 ? "" : "not "}divisible by ${math(4)}`;
    case 5:
      return `the last digit is ${math(last)}, which is ${last === 0 || last === 5 ? "" : "not "}one of ${math("0, 5")}`;
    case 8:
      return `the last three digits are ${math(suffix3Text)}, and ${math(suffix3)} is ${suffix3 % 8 === 0 ? "" : "not "}divisible by ${math(8)}`;
    case 10:
      return `the last digit is ${math(last)}, which is ${last === 0 ? "" : "not "}${math(0)}`;
    case 11: {
      const [first, second] = alternateSumsOfNumber(number);
      const difference = Math.abs(first - second);
      return `the alternate-digit sums are ${math(first)} and ${math(second)}; their difference is ${math(difference)}, which is ${difference % 11 === 0 ? "" : "not "}${math(0)} or a multiple of ${math(11)}`;
    }
    case 25:
      return `the last two digits are ${math(suffix2Text)}, which ${suffix2 % 25 === 0 ? "do" : "do not"} form a multiple of ${math(25)}`;
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

function numberApplication(number: bigint, divisorValue: bigint | number): string {
  const divisor = Number(divisorValue);
  const parts = primitiveParts(divisor);
  const evidence = parts.map((part) => primitiveNumberEvidence(number, part));
  const divisible = number % BigInt(divisor) === 0n;
  const joined = evidence.length === 1 ? evidence[0]! : `${evidence[0]}, and ${evidence[1]}`;
  return `Here, ${joined}. Therefore, ${math(formatInteger(number))} ${divisible ? "is" : "is not"} divisible by ${math(divisor)} without a remainder.`;
}

export function teachingDivisibilityCheck(number: bigint, divisorValue: bigint | number): string {
  return `${plainDivisibilityRule(divisorValue)} ${numberApplication(number, divisorValue)}`;
}

interface TemplateDigitSum {
  readonly expanded: string;
  readonly simplified: string;
  readonly fixed: number;
  readonly xCount: number;
  readonly yCount: number;
}

function templateDigitSum(template: string): TemplateDigitSum {
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
  const simplified: string[] = [];
  if (fixed !== 0) simplified.push(String(fixed));
  if (xCount === 1) simplified.push("X");
  else if (xCount > 1) simplified.push(`${xCount}X`);
  if (yCount === 1) simplified.push("Y");
  else if (yCount > 1) simplified.push(`${yCount}Y`);
  return {
    expanded: expanded.join(" + "),
    simplified: simplified.join(" + ") || "0",
    fixed,
    xCount,
    yCount,
  };
}

function templateAlternateSums(template: string): readonly [string, string] {
  const first: string[] = [];
  const second: string[] = [];
  [...template].forEach((character, index) => {
    (index % 2 === 0 ? first : second).push(character);
  });
  return [first.join(" + "), second.join(" + ")] as const;
}

function primitiveTemplateApplication(template: string, divisor: number): string {
  const last = template.at(-1) ?? "";
  const suffix2 = template.slice(-2);
  const suffix3 = template.slice(-3);

  switch (divisor) {
    case 2:
      if (/^\d$/u.test(last)) {
        return `the last digit is fixed at ${math(last)}, which is ${Number(last) % 2 === 0 ? "even, so this condition is already satisfied" : "odd, so this condition cannot be satisfied"}`;
      }
      return `the last digit is ${math(last)}, so ${math(last)} must be even`;
    case 3:
    case 9: {
      const sum = templateDigitSum(template);
      return `the digit sum is ${math(`${sum.expanded} = ${sum.simplified}`)}, so ${math(sum.simplified)} must be divisible by ${math(divisor)}`;
    }
    case 4:
      if (/^\d{2}$/u.test(suffix2)) {
        return `the last two digits are fixed at ${math(suffix2)}, and ${math(suffix2)} is ${Number(suffix2) % 4 === 0 ? "" : "not "}divisible by ${math(4)}`;
      }
      return `the last two digits are ${math(suffix2)}, so ${math(suffix2)} must be divisible by ${math(4)}`;
    case 5:
      if (/^\d$/u.test(last)) {
        return `the last digit is fixed at ${math(last)}, which ${last === "0" || last === "5" ? "satisfies" : "does not satisfy"} this rule`;
      }
      return `the last digit is ${math(last)}, so ${math(last)} must be ${math(0)} or ${math(5)}`;
    case 8:
      if (/^\d{3}$/u.test(suffix3)) {
        return `the last three digits are fixed at ${math(suffix3)}, and ${math(suffix3)} is ${Number(suffix3) % 8 === 0 ? "" : "not "}divisible by ${math(8)}`;
      }
      return `the last three digits are ${math(suffix3)}, so ${math(suffix3)} must be divisible by ${math(8)}`;
    case 10:
      if (/^\d$/u.test(last)) {
        return `the last digit is fixed at ${math(last)}, which ${last === "0" ? "satisfies" : "does not satisfy"} this rule`;
      }
      return `the last digit is ${math(last)}, so ${math(last)} must be ${math(0)}`;
    case 11: {
      const [first, second] = templateAlternateSums(template);
      return `the two alternate-digit sums are ${math(first)} and ${math(second)}; their difference must be ${math(0)} or a multiple of ${math(11)}`;
    }
    case 25:
      if (/^\d{2}$/u.test(suffix2)) {
        return `the last two digits are fixed at ${math(suffix2)}, which ${Number(suffix2) % 25 === 0 ? "satisfy" : "do not satisfy"} this rule`;
      }
      return `the last two digits are ${math(suffix2)}, so they must be one of ${math("00, 25, 50, 75")}`;
    default:
      return `after the missing digit is filled, the completed number must leave remainder ${math(0)} when divided by ${math(divisor)}`;
  }
}

function templateDivisibilityTeaching(template: string, divisorValue: bigint | number): string {
  const divisor = Number(divisorValue);
  const parts = primitiveParts(divisor);
  const applications = parts.map((part) => primitiveTemplateApplication(template, part));
  const joined = applications.length === 1 ? applications[0]! : `${applications[0]}; also, ${applications[1]}`;
  return `${plainDivisibilityRule(divisor)} Here, ${joined}.`;
}

function singleDigitOutcome(
  state: Extract<NumCp003RetainedHiddenState, { kind: "SINGLE_DIGIT_CANDIDATE_SET" }>,
): string {
  const valid = state.validDigits;
  const allowed = state.domain;
  const allowedText = setMath(allowed);
  const validText = setMath(valid);
  const prefix = `Checking the allowed digits ${allowedText} gives ${validText} as the valid set.`;

  switch (state.projection) {
    case "UNIQUE_VALID_DIGIT": {
      const digit = valid[0];
      const completed = digit === undefined ? null : BigInt(fillSingleDigit(state.template, digit));
      return digit === undefined || completed === null
        ? `${prefix} No digit satisfies all conditions.`
        : `${prefix} So ${math(`X = ${digit}`)} is the only answer, giving the completed number ${math(formatInteger(completed))}.`;
    }
    case "EXTREMUM_VALID_DIGIT": {
      const largest = state.extremumDirection === "LARGEST" || state.extremumDirection === "GREATEST";
      const answer = largest ? valid.at(-1) : valid[0];
      return `${prefix} Therefore, the ${largest ? "largest" : "smallest"} valid digit is ${math(`X = ${answer}`)}.`;
    }
    case "VALID_DIGIT_COUNT":
      return `${prefix} Therefore, the number of valid digits is ${math(valid.length)}.`;
    case "VALID_DIGIT_SUM": {
      const total = valid.reduce((sum, digit) => sum + digit, 0);
      const addition = valid.length > 0 ? `${valid.join(" + ")} = ${total}` : "0";
      return `${prefix} Their sum is ${math(addition)}.`;
    }
    case "COMPLETE_VALID_DIGIT_SET":
      return `${prefix} Therefore, the complete answer is ${validText}.`;
    case "EXTREMUM_COMPLETED_NUMBER": {
      const completed = valid.map((digit) => BigInt(fillSingleDigit(state.template, digit)));
      const largest = state.extremumDirection === "LARGEST" || state.extremumDirection === "GREATEST";
      const answer = largest ? completed.at(-1) : completed[0];
      return `${prefix} The ${largest ? "greatest" : "smallest"} completed number is ${math(formatInteger(answer ?? 0n))}.`;
    }
    default:
      return prefix;
  }
}

function singleDigitSolution(
  state: Extract<NumCp003RetainedHiddenState, { kind: "SINGLE_DIGIT_CANDIDATE_SET" }>,
): readonly string[] {
  const ruleLines = state.divisors.slice(0, 3).map((divisor) => templateDivisibilityTeaching(state.template, divisor));
  return Object.freeze([...ruleLines, singleDigitOutcome(state)].slice(0, 4));
}

function noPairReason(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>,
): string | null {
  if (state.validPairs.length !== 0 || state.relation?.kind !== "DIGIT_SUM") return null;
  const form = templateDigitSum(state.template);
  if (form.xCount !== 1 || form.yCount !== 1) return null;
  const primitives = [...new Set(state.divisors.flatMap((value) => primitiveParts(Number(value))))];
  for (const divisor of primitives) {
    if (divisor !== 3 && divisor !== 9) continue;
    const total = form.fixed + state.relation.value;
    if (total % divisor !== 0) {
      return `Using ${math(`X + Y = ${state.relation.value}`)}, the digit sum becomes ${math(`${form.fixed} + ${state.relation.value} = ${total}`)}. Since ${math(total)} is not divisible by ${math(divisor)}, no ordered pair can satisfy the condition.`;
    }
  }
  return null;
}

function orderedPairOutcome(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>,
): string {
  const valid = state.validPairs;
  const validSet = pairSetMath(valid);
  switch (state.projection) {
    case "UNIQUE_VALID_ORDERED_PAIR": {
      const pair = valid[0];
      if (!pair) return "Checking the conditions gives no valid ordered pair.";
      const completed = BigInt(fillPair(state.template, pair[0], pair[1]));
      const exactChecks = state.divisors.map((raw) => {
        const divisor = BigInt(raw);
        return math(`${formatInteger(completed)} \\div ${formatInteger(divisor)} = ${formatInteger(completed / divisor)}`);
      });
      const relation = state.relation ? ` and ${math(`${pair[0]} + ${pair[1]} = ${state.relation.value}`)}` : "";
      return `Checking the conditions gives only ${math(`(X, Y) = (${pair[0]}, ${pair[1]})`)}. It forms ${math(formatInteger(completed))}; ${exactChecks.join(" and ")} ${exactChecks.length === 1 ? "is" : "are"} exact${relation}.`;
    }
    case "VALID_ORDERED_PAIR_COUNT":
      return `Checking all ordered digit pairs gives ${validSet}. Therefore, the number of valid pairs is ${math(valid.length)}.`;
    case "COMPLETE_VALID_ORDERED_PAIR_SET":
      return `Checking all ordered digit pairs gives ${validSet}, which is the complete valid set.`;
    case "PAIR_SOLUTION_CLASS":
      if (valid.length === 0) return "Checking all ordered digit pairs gives no valid pair, so there is no solution.";
      if (valid.length === 1) return `Checking all ordered digit pairs gives only ${validSet}, so there is exactly one solution.`;
      return `Checking all ordered digit pairs gives ${validSet}, so there are ${math(valid.length)} solutions.`;
    default:
      return `Checking all ordered digit pairs gives ${validSet}.`;
  }
}

function orderedPairSolution(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>,
): readonly string[] {
  const lines: string[] = [];
  lines.push(...state.divisors.slice(0, 2).map((divisor) => templateDivisibilityTeaching(state.template, divisor)));
  if (state.relation?.kind === "DIGIT_SUM") {
    lines.push(`The question also gives ${math(`X + Y = ${state.relation.value}`)}, so this condition must be satisfied at the same time.`);
  }
  const decisive = noPairReason(state);
  if (decisive) {
    lines.push(decisive);
    return Object.freeze(lines.slice(0, 4));
  }
  lines.push(orderedPairOutcome(state));
  return Object.freeze(lines.slice(0, 4));
}

function boundarySolution(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DIGIT_BOUND_MULTIPLE" }>,
): readonly string[] {
  const divisor = state.divisor;
  if (state.direction === "GREATEST") {
    const remainder = state.upperBoundary % divisor;
    return Object.freeze([
      `To find the greatest ${state.digits}-digit number divisible by ${math(divisor)}, start from the greatest ${state.digits}-digit number and subtract its remainder on division by ${math(divisor)}.`,
      `${math(`${formatInteger(state.upperBoundary)} = ${formatInteger(divisor)} \\times ${formatInteger(state.upperBoundary / divisor)} + ${formatInteger(remainder)}`)}, so the remainder is ${math(remainder)}.`,
      `${math(`${formatInteger(state.upperBoundary)} - ${formatInteger(remainder)} = ${formatInteger(state.answer)}`)}. Therefore, ${math(formatInteger(state.answer))} is the greatest required multiple.`,
    ]);
  }
  const remainder = state.lowerBoundary % divisor;
  const addition = remainder === 0n ? 0n : divisor - remainder;
  return Object.freeze([
    `To find the least ${state.digits}-digit number divisible by ${math(divisor)}, start from the least ${state.digits}-digit number and add enough to reach the next multiple of ${math(divisor)}.`,
    `${math(`${formatInteger(state.lowerBoundary)} = ${formatInteger(divisor)} \\times ${formatInteger(state.lowerBoundary / divisor)} + ${formatInteger(remainder)}`)}, so the remainder is ${math(remainder)}.`,
    `${math(`${formatInteger(state.lowerBoundary)} + ${formatInteger(addition)} = ${formatInteger(state.answer)}`)}. Therefore, ${math(formatInteger(state.answer))} is the least required multiple.`,
  ]);
}

function rangeSolution(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ONE_DIVISOR_RANGE" }>,
): readonly string[] {
  const upperCount = state.upper / state.divisor;
  const beforeLower = (state.lower - 1n) / state.divisor;
  return Object.freeze([
    `To count multiples of ${math(state.divisor)} from ${math(formatInteger(state.lower))} to ${math(formatInteger(state.upper))}, count the multiples up to the upper limit and subtract the multiples before the lower limit.`,
    `Multiples up to ${math(formatInteger(state.upper))}: ${math(`\\left\\lfloor ${formatInteger(state.upper)} / ${formatInteger(state.divisor)} \\right\\rfloor = ${formatInteger(upperCount)}`)}.`,
    `Multiples before ${math(formatInteger(state.lower))}: ${math(`\\left\\lfloor ${formatInteger(state.lower - 1n)} / ${formatInteger(state.divisor)} \\right\\rfloor = ${formatInteger(beforeLower)}`)}.`,
    `${math(`${formatInteger(upperCount)} - ${formatInteger(beforeLower)} = ${formatInteger(state.count)}`)}. Therefore, there are ${math(formatInteger(state.count))} required integers.`,
  ]);
}

function repeatedSolution(
  state: Extract<NumCp003RetainedHiddenState, { kind: "IMPLICIT_REPEATED_NUMERAL" }>,
): readonly string[] {
  const checks = state.divisorOptions.map((divisor) => teachingDivisibilityCheck(state.number, divisor));
  if (checks.length === 0) return Object.freeze([]);
  checks[0] = `Repeating ${math(state.block)} ${state.repeats} times forms ${math(formatInteger(state.number))}. ${checks[0]}`;
  return Object.freeze(checks.slice(0, 4));
}

function linkedSolution(
  state: Extract<NumCp003RetainedHiddenState, { kind: "LINKED_ARITHMETIC_DIVISIBILITY" }>,
): readonly string[] {
  const selected = state.validPairs.find(([a]) => a === state.answerDigit);
  if (!selected) throw new Error(`Missing linked answer pair for A=${state.answerDigit}`);
  const [a, b] = selected;
  const source = BigInt(fillLinked(state.sourcePattern, a, b));
  const result = BigInt(fillLinked(state.resultPattern, a, b));
  const validA = state.validPairs.map(([value]) => value);
  return Object.freeze([
    `First satisfy the addition ${math(`${state.sourcePattern} + ${formatInteger(state.addend)} = ${state.resultPattern}`)}. The possible digit pairs from the addition are ${pairSetMath(state.arithmeticPairs)}.`,
    plainDivisibilityRule(state.divisor),
    `For ${math(`A = ${a}`)} and ${math(`B = ${b}`)}, ${math(`${formatInteger(source)} + ${formatInteger(state.addend)} = ${formatInteger(result)}`)}. ${numberApplication(result, state.divisor)}`,
    `After applying both conditions, the valid ${math("A")} values are ${setMath(validA)}. Therefore, the ${state.direction === "LARGEST" ? "largest" : "smallest"} value is ${math(`A = ${state.answerDigit}`)}.`,
  ]);
}

function extractCompletedNumberDivisor(statement: string): number | null {
  const match = statement.match(/completed number[\s\S]*?divisible by\s+(\d+)/iu);
  return match?.[1] ? Number(match[1]) : null;
}

function dsStatementLine(
  label: "I" | "II",
  statement: string,
  template: string,
  candidates: readonly number[],
): string {
  const divisor = extractCompletedNumberDivisor(statement);
  if (divisor !== null) {
    return `${templateDivisibilityTeaching(template, divisor)} Applying this statement leaves ${math("X")} in ${setMath(candidates)}.`;
  }
  return `Statement ${label} leaves ${math("X")} in ${setMath(candidates)}. ${candidates.length === 1 ? "So it gives one unique value." : `It leaves ${math(candidates.length)} possible values.`}`;
}

function dataSufficiencySolution(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DATA_SUFFICIENCY" }>,
): readonly string[] {
  const lines = [
    `In data sufficiency, a statement is sufficient only if it leaves exactly one possible value of ${math("X")}.`,
    dsStatementLine("I", state.statementI, state.template, state.candidatesI),
    dsStatementLine("II", state.statementII, state.template, state.candidatesII),
  ];
  if (state.candidatesI.length !== 1 && state.candidatesII.length !== 1) {
    lines.push(`Using both statements together leaves ${math("X")} in ${setMath(state.candidatesTogether)}. ${state.candidatesTogether.length === 1 ? "So together they are sufficient." : "So even together they do not determine one unique value."}`);
  }
  return Object.freeze(lines.slice(0, 4));
}

function claimSolution(
  state: Extract<NumCp003RetainedHiddenState, { kind: "CLAIM_VALIDATION" }>,
): readonly string[] {
  return Object.freeze(state.claims.slice(0, 4).map((claim, index) =>
    `Claim ${index + 1}: ${teachingDivisibilityCheck(claim.number, claim.divisor)} Therefore, the claim is ${claim.isTrue ? "true" : "false"}.`));
}

export function buildNumCp003PlainTeachingSolution(state: NumCp003RetainedHiddenState): readonly string[] {
  switch (state.kind) {
    case "DIRECT_DIVISIBILITY":
      return Object.freeze(state.divisorOptions.slice(0, 4).map((divisor) => teachingDivisibilityCheck(state.number, divisor)));
    case "SINGLE_DIGIT_CANDIDATE_SET":
      return singleDigitSolution(state);
    case "ORDERED_PAIR_CANDIDATE_SET":
      return orderedPairSolution(state);
    case "DIGIT_BOUND_MULTIPLE":
      return boundarySolution(state);
    case "ONE_DIVISOR_RANGE":
      return rangeSolution(state);
    case "IMPLICIT_REPEATED_NUMERAL":
      return repeatedSolution(state);
    case "LINKED_ARITHMETIC_DIVISIBILITY":
      return linkedSolution(state);
    case "DATA_SUFFICIENCY":
      return dataSufficiencySolution(state);
    case "CLAIM_VALIDATION":
      return claimSolution(state);
    default: {
      const unreachable: never = state;
      return unreachable;
    }
  }
}
