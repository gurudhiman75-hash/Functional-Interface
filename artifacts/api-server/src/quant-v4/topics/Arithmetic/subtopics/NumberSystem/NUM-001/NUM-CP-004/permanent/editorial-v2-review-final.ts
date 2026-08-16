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

function numbers(value: unknown, label: string): number[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number" || !Number.isSafeInteger(item))) {
    throw new Error(`Expected integer array ${label}`);
  }
  return [...value] as number[];
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

function primeBases(value: number): number[] {
  let remainder = value;
  const bases: number[] = [];
  for (let candidate = 2; candidate * candidate <= remainder; candidate += 1) {
    if (!isPrime(candidate) || remainder % candidate !== 0) continue;
    bases.push(candidate);
    while (remainder % candidate === 0) remainder /= candidate;
  }
  if (remainder > 1) bases.push(remainder);
  return bases;
}

function setMath(values: readonly number[]): string {
  return math(values.length === 0 ? "\\varnothing" : `\\{${values.join(", ")}\\}`);
}

function joinedMathOr(values: readonly number[]): string {
  const rendered = values.map((value) => math(value));
  if (rendered.length === 0) return "no prime factor";
  if (rendered.length === 1) return rendered[0]!;
  if (rendered.length === 2) return `${rendered[0]} or ${rendered[1]}`;
  return `${rendered.slice(0, -1).join(", ")}, or ${rendered.at(-1)}`;
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
  const skippedEvidence = skipped.length === 0
    ? `The boundary value ${math(boundary)} itself is prime.`
    : skipped.length === 1
      ? `Starting from ${math(boundary)}, ${math(skipped[0]!)} is not prime; ${math(answer)} is prime.`
      : `Starting from ${math(boundary)}, ${setMath(skipped)} are not prime; ${math(answer)} is prime.`;

  return Object.freeze([
    "Rule: To find the least or greatest prime in an interval, start from the required end of the interval and test numbers inwards until the first prime is reached.",
    skippedEvidence,
    `Therefore the ${directionWord} prime in ${math(`[${lower},${upper}]`)} is ${math(answer)}.`,
  ]);
}

function emptyPrimeIntervalSolution(state: State, original: readonly string[]): readonly string[] {
  const lower = number(state.lower, "lower");
  const upper = number(state.upper, "upper");
  return Object.freeze([
    original[0]!,
    `Testing every integer from ${math(lower)} to ${math(upper)} finds no prime numbers.`,
    `Therefore the complete prime set is ${math("\\varnothing")}.`,
  ]);
}

function coprimeSetOrCountSolution(state: State, mode: string): readonly string[] {
  const fixed = number(state.fixed, "fixed");
  const candidates = numbers(state.candidates, "candidates");
  const bases = primeBases(fixed);
  const valid = candidates.filter((candidate) => gcd(fixed, candidate) === 1);
  const rejected = candidates.filter((candidate) => gcd(fixed, candidate) !== 1);
  const result = mode === "COPRIME_SET"
    ? `Therefore the complete co-prime set is ${setMath(valid)}.`
    : `There are ${math(valid.length)} co-prime candidates, so the answer is ${math(valid.length)}.`;
  const rejectionEvidence = rejected.length === 0
    ? `No listed candidate shares a prime factor with ${math(fixed)}; all the listed candidates are co-prime to it.`
    : rejected.length === 1
      ? `${math(rejected[0]!)} shares a prime factor with ${math(fixed)}; the remaining values are ${setMath(valid)}.`
      : `${setMath(rejected)} share a prime factor with ${math(fixed)}; the remaining values are ${setMath(valid)}.`;

  return Object.freeze([
    "Rule: Two integers are co-prime when their HCF is exactly 1; equivalently, they share no prime factor.",
    `The prime factors of ${math(fixed)} are ${joinedMathOr(bases)}. Any candidate divisible by one of these is not co-prime to ${math(fixed)}.`,
    `${rejectionEvidence} ${result}`,
  ]);
}

function dataSufficiencySolution(state: State, answer: string): readonly string[] {
  const statementI = numbers(state.statementI, "statementI");
  const statementII = numbers(state.statementII, "statementII");
  const intersection = statementI.filter((value) => statementII.includes(value));
  const iSufficient = statementI.length === 1;
  const iiSufficient = statementII.length === 1;
  const label = (count: number) => `${count} possible ${count === 1 ? "value" : "values"}`;
  let decision: string;

  if (iSufficient && iiSufficient) {
    decision = `Each statement alone leaves exactly one possible value, so each is sufficient independently. Hence ${answer}`;
  } else if (iSufficient) {
    decision = `Statement I alone is sufficient and Statement II alone is not. There is no need to combine them. Hence ${answer}`;
  } else if (iiSufficient) {
    decision = `Statement II alone is sufficient and Statement I alone is not. There is no need to combine them. Hence ${answer}`;
  } else {
    decision = `Neither statement is sufficient alone. Together they leave ${label(intersection.length)}, so the conclusion is ${answer}.`;
  }

  return Object.freeze([
    "Rule: A statement is sufficient only if it alone leaves exactly one possible value. Combine the statements only when neither one is sufficient by itself.",
    `Statement I leaves ${label(statementI.length)}; Statement II leaves ${label(statementII.length)}.`,
    decision,
  ]);
}

function feasibilitySolution(state: State, answer: string): readonly string[] {
  const prime = number(state.prime, "prime");
  return Object.freeze([
    "Rule: Every integer greater than 1 has a unique prime factorisation. Also, 2 is the only even prime, every composite integer greater than 1 has a prime divisor, and a product of two primes greater than 1 is composite.",
    `${math(`${prime}^{2}`)} has exactly one distinct prime factor, namely ${math(prime)}, so that structure is possible.`,
    `An even prime greater than ${math(2)} is impossible; a composite number cannot have no prime factor; and a product of two primes greater than ${math(1)} cannot itself be prime. Therefore ${answer}`,
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

function refinedStem(question: NumCp004EditorialV2Question, mode: string): string {
  if (question.permanentQlId === "NUM-QL-032") return "Which of the following pairs is co-prime?";
  if (mode === "COPRIME_CLAIM") return "Which of the following co-prime statements is correct?";
  return question.stem;
}

function refine(question: NumCp004EditorialV2Question): NumCp004EditorialV2Question {
  const state = question.hiddenState as State;
  const mode = text(state.mode, "mode");
  let solution = question.explanation.solution;

  if (mode === "ADJACENT_PRIME") {
    solution = adjacentIntervalSolution(state) ?? solution;
  } else if (mode === "COPRIME_SET" || mode === "COPRIME_COUNT") {
    solution = coprimeSetOrCountSolution(state, mode);
  } else if (mode === "DATA_SUFFICIENCY") {
    solution = dataSufficiencySolution(state, question.canonicalAnswer);
  } else if (mode === "FEASIBILITY") {
    solution = feasibilitySolution(state, question.canonicalAnswer);
  } else if (mode === "COPRIME_CLAIM") {
    solution = coprimeClaimSolution(state, question.canonicalAnswer);
  }

  if (question.permanentQlId === "NUM-QL-019" && question.canonicalAnswer === "{}") {
    solution = emptyPrimeIntervalSolution(state, solution);
  }

  if (solution.length < 2 || solution.length > 4 || !solution[0]!.startsWith("Rule:")) {
    throw new Error(`${question.permanentQlId}/${question.seed}: final review solution is not rule-first`);
  }

  return Object.freeze({
    ...question,
    stem: refinedStem(question, mode),
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
