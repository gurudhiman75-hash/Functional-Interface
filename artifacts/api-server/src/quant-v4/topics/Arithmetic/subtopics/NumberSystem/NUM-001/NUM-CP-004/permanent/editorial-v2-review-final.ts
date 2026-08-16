import {
  runNumCp004EditorialV2Final,
} from "./editorial-v2-final";
import type { NumCp004EditorialV2Question } from "./editorial-v2";
import type { NumCp004PermanentRuntimeInput } from "./runtime";

type State = Readonly<Record<string, unknown>>;

function math(value: string | number): string {
  return `\\(${String(value)}\\)`;
}

function number(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error(`Expected integer ${label}`);
  return value;
}

function text(value: unknown, label: string): string {
  if (typeof value !== "string") throw new Error(`Expected string ${label}`);
  return value;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function isPrime(value: number): boolean {
  if (!Number.isSafeInteger(value) || value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function primesInRange(lower: number, upper: number): number[] {
  const values: number[] = [];
  for (let value = lower; value <= upper; value += 1) {
    if (isPrime(value)) values.push(value);
  }
  return values;
}

function setMath(values: readonly number[]): string {
  return math(values.length === 0 ? "\\varnothing" : `\\{${values.join(", ")}\\}`);
}

function adjacentIntervalSolution(state: State): readonly string[] | null {
  const direction = text(state.direction, "direction");
  if (direction !== "LEAST" && direction !== "GREATEST") return null;
  const lower = number(state.lower, "lower");
  const upper = number(state.upper, "upper");
  const primes = primesInRange(lower, upper);
  if (primes.length === 0) throw new Error(`No prime in interval [${lower}, ${upper}]`);
  const answer = direction === "LEAST" ? primes[0]! : primes.at(-1)!;
  const directionWord = direction === "LEAST" ? "least" : "greatest";
  const boundary = direction === "LEAST" ? lower : upper;
  const between = direction === "LEAST"
    ? Array.from({ length: Math.max(0, answer - boundary) }, (_unused, index) => boundary + index)
    : Array.from({ length: Math.max(0, boundary - answer) }, (_unused, index) => boundary - index);
  const skipped = between.filter((value) => value !== answer);

  return Object.freeze([
    "Rule: To find the least or greatest prime in an interval, start from the required end of the interval and test numbers inwards until the first prime is reached.",
    skipped.length > 0
      ? `Starting from ${math(boundary)}, ${setMath(skipped)} are not prime; ${math(answer)} is prime.`
      : `The boundary value ${math(boundary)} itself is prime.`,
    `Therefore the ${directionWord} prime in ${math(`[${lower},${upper}]`)} is ${math(answer)}.`,
  ]);
}

function coprimeClaimSolution(state: State, answer: string): readonly string[] {
  const claims = state.claims as ReadonlyArray<Readonly<Record<string, unknown>>>;
  const evidence: string[] = [];

  for (const claim of claims) {
    const kind = text(claim.kind, "claim.kind");
    const values = Array.isArray(claim.values) ? claim.values as number[] : [];
    if (kind === "PAIR" && values.length === 2) {
      const [a, b] = values;
      evidence.push(`${math(`\\operatorname{HCF}(${a},${b})=${gcd(a!, b!)}`)}`);
      continue;
    }
    if (kind === "PAIRWISE_TRIPLE" && values.length === 3) {
      const [a, b, c] = values;
      evidence.push(
        `${math(`\\operatorname{HCF}(${a},${b})=${gcd(a!, b!)}`)}, ${math(`\\operatorname{HCF}(${a},${c})=${gcd(a!, c!)}`)}, ${math(`\\operatorname{HCF}(${b},${c})=${gcd(b!, c!)}`)}`,
      );
      continue;
    }
    if (kind === "UNIVERSAL_ODD") {
      evidence.push(`${math("9")} and ${math("15")} are both odd but ${math("\\operatorname{HCF}(9,15)=3")}`);
    }
  }

  return Object.freeze([
    "Rule: Two integers are co-prime only when their HCF is exactly 1. For a pairwise co-prime group, every pair must have HCF 1.",
    `Checking the claims gives: ${evidence.join("; ")}.`,
    `Hence the true statement is ${answer}`,
  ]);
}

function refine(question: NumCp004EditorialV2Question): NumCp004EditorialV2Question {
  const state = question.hiddenState as State;
  const mode = text(state.mode, "mode");
  let solution = question.explanation.solution;

  if (mode === "ADJACENT_PRIME") {
    solution = adjacentIntervalSolution(state) ?? solution;
  } else if (mode === "COPRIME_CLAIM") {
    solution = coprimeClaimSolution(state, question.canonicalAnswer);
  }

  if (solution.length < 2 || solution.length > 4 || !solution[0]!.startsWith("Rule:")) {
    throw new Error(`${question.permanentQlId}/${question.seed}: final review solution is not rule-first`);
  }

  return Object.freeze({
    ...question,
    explanation: Object.freeze({
      ...question.explanation,
      solution: Object.freeze([...solution]),
    }),
  });
}

export function runNumCp004EditorialV2ReviewFinal(
  input: NumCp004PermanentRuntimeInput = {},
): NumCp004EditorialV2Question {
  return refine(runNumCp004EditorialV2Final(input));
}
