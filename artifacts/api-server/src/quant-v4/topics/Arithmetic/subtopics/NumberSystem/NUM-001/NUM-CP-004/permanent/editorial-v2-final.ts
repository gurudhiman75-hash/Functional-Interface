import {
  runNumCp004EditorialV2,
  type NumCp004EditorialV2Question,
} from "./editorial-v2";
import type { NumCp004PermanentRuntimeInput } from "./runtime";

type State = Readonly<Record<string, unknown>>;
type PrimePower = Readonly<{ prime: number; exponent: number }>;

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

function numbers(value: unknown, label: string): number[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number" || !Number.isSafeInteger(item))) {
    throw new Error(`Expected integer array ${label}`);
  }
  return [...value] as number[];
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
  for (let d = 3; d * d <= value; d += 2) if (value % d === 0) return false;
  return true;
}

function factorise(value: number): PrimePower[] {
  let remainder = value;
  const result: Array<{ prime: number; exponent: number }> = [];
  for (let p = 2; p * p <= remainder; p += 1) {
    if (!isPrime(p)) continue;
    let exponent = 0;
    while (remainder % p === 0) {
      remainder /= p;
      exponent += 1;
    }
    if (exponent > 0) result.push({ prime: p, exponent });
  }
  if (remainder > 1) result.push({ prime: remainder, exponent: 1 });
  return result;
}

function factorText(factors: readonly PrimePower[]): string {
  return factors.map(({ prime, exponent }) => exponent === 1 ? `${prime}` : `${prime}^{${exponent}}`).join(" \\times ");
}

function setText(values: readonly number[]): string {
  return values.length === 0 ? "\\varnothing" : `\\{${values.join(", ")}\\}`;
}

function coprimeRule(): string {
  return "Rule: Two integers are co-prime when their HCF is exactly 1; they must not share any prime factor.";
}

function exactConcept(question: NumCp004EditorialV2Question): string {
  const state = question.hiddenState as State;
  const mode = text(state.mode, "mode");
  if (mode === "ADJACENT_PRIME") {
    const direction = text(state.direction, "direction");
    if (direction === "NEXT") return "This question tests finding the smallest prime strictly greater than the given number.";
    if (direction === "PREVIOUS") return "This question tests finding the greatest prime strictly less than the given number.";
    if (direction === "LEAST") return "This question tests finding the least prime in the stated interval.";
    return "This question tests finding the greatest prime in the stated interval.";
  }
  if (mode === "PRIME_FACTOR_EXTREMUM") {
    return `This question tests finding the ${text(state.direction, "direction").toLowerCase()} prime factor of the given integer.`;
  }
  if (mode === "COMPARE_STRUCTURES") {
    const target = text(state.target, "target");
    if (target === "DISTINCT") return "This question tests which factorisation has more distinct prime factors.";
    if (target === "MULTIPLICITY") return "This question tests which factorisation has more prime factors when repetitions are counted.";
    return "This question tests which prime-power factorisation represents the greater numerical value.";
  }
  return question.explanation.concept;
}

function refinedSolution(question: NumCp004EditorialV2Question): readonly string[] {
  const state = question.hiddenState as State;
  const mode = text(state.mode, "mode");
  const answer = question.canonicalAnswer;

  if (mode === "COPRIME_SET" || mode === "COPRIME_COUNT") {
    const fixed = number(state.fixed, "fixed");
    const candidates = numbers(state.candidates, "candidates");
    const factors = factorise(fixed);
    const bases = factors.map((factor) => factor.prime);
    const valid = candidates.filter((candidate) => gcd(fixed, candidate) === 1);
    const rejected = candidates.filter((candidate) => gcd(fixed, candidate) !== 1);
    const result = mode === "COPRIME_SET"
      ? `Therefore the complete co-prime set is ${math(setText(valid))}.`
      : `There are ${math(valid.length)} co-prime candidates, so the answer is ${math(valid.length)}.`;
    return Object.freeze([
      coprimeRule(),
      `${math(`${fixed}=${factorText(factors)}`)}. So a candidate sharing ${math(setText(bases))} as a prime factor is not co-prime to ${math(fixed)}.`,
      `${math(setText(rejected))} share a prime factor with ${math(fixed)}; the remaining values are ${math(setText(valid))}. ${result}`,
    ]);
  }

  if (mode === "COPRIME_UNKNOWN") {
    const fixed = number(state.fixed, "fixed");
    const candidates = numbers(state.candidates, "candidates");
    const valid = candidates.find((candidate) => gcd(fixed, candidate) === 1);
    const checks = candidates.map((candidate) => math(`\\operatorname{HCF}(${fixed},${candidate})=${gcd(fixed, candidate)}`));
    return Object.freeze([
      coprimeRule(),
      `Checking the options gives ${checks.join(", ")}.`,
      `Only ${math(`x=${valid}`)} gives HCF ${math(1)}.`,
    ]);
  }

  if (mode === "COPRIME_CLASS") {
    const [a, b, c] = numbers(state.values, "values");
    const ab = gcd(a!, b!);
    const ac = gcd(a!, c!);
    const bc = gcd(b!, c!);
    const all = gcd(gcd(a!, b!), c!);
    return Object.freeze([
      "Rule: Pairwise co-prime means every pair has HCF 1. Collectively co-prime means the HCF of all the numbers together is 1.",
      `${math(`\\operatorname{HCF}(${a},${b})=${ab}`)}, ${math(`\\operatorname{HCF}(${a},${c})=${ac}`)} and ${math(`\\operatorname{HCF}(${b},${c})=${bc}`)}; for all three together, ${math(`\\operatorname{HCF}(${a},${b},${c})=${all}`)}.`,
      `Therefore the correct classification is ${answer}.`,
    ]);
  }

  if (mode === "DATA_SUFFICIENCY") {
    const statementI = numbers(state.statementI, "statementI");
    const statementII = numbers(state.statementII, "statementII");
    const intersection = statementI.filter((value) => statementII.includes(value));
    const label = (count: number) => `${count} possible ${count === 1 ? "value" : "values"}`;
    return Object.freeze([
      "Rule: A statement is sufficient only if it alone leaves exactly one possible value. Combine the statements only when neither one is sufficient by itself.",
      `Statement I leaves ${label(statementI.length)}; Statement II leaves ${label(statementII.length)}.`,
      `Together they leave ${label(intersection.length)}, so the conclusion is ${answer}.`,
    ]);
  }

  if (mode === "FEASIBILITY") {
    const prime = number(state.prime, "prime");
    return Object.freeze([
      "Rule: Every integer greater than 1 has a unique prime factorisation. Also, 2 is the only even prime, and multiplying two primes greater than 1 gives a composite number.",
      `${math(`${prime}^{2}`)} has exactly one distinct prime factor, namely ${math(prime)}. The other proposed structures break one of the rules above.`,
      `Therefore the possible statement is the one represented by ${math(`${prime}^{2}`)} having one distinct prime factor.`,
    ]);
  }

  if (mode === "PRIME_CLAIM") {
    const claims = state.claims as ReadonlyArray<Readonly<Record<string, unknown>>>;
    const evidence = claims.map((claim) => {
      const value = number(claim.value, "claim.value");
      if (value === 1) return `${math(1)} is the unit, so it is not prime`;
      if (isPrime(value)) return `${math(value)} is prime`;
      return `${math(`${value}=${factorText(factorise(value))}`)}, so it is composite`;
    });
    return Object.freeze([
      "Rule: A number greater than 1 is prime only when its positive divisors are 1 and the number itself.",
      `${evidence.join("; ")}.`,
      `Therefore the true statement is ${answer}`,
    ]);
  }

  return question.explanation.solution;
}

function refine(question: NumCp004EditorialV2Question): NumCp004EditorialV2Question {
  const solution = refinedSolution(question);
  if (solution.length < 2 || solution.length > 4 || !solution[0]!.startsWith("Rule:")) {
    throw new Error(`${question.permanentQlId}/${question.seed}: invalid final rule-first solution`);
  }
  const concept = exactConcept(question);
  if (!concept.startsWith("This question tests ")) {
    throw new Error(`${question.permanentQlId}/${question.seed}: invalid final concept`);
  }
  return Object.freeze({
    ...question,
    explanation: Object.freeze({
      ...question.explanation,
      concept,
      solution,
    }),
  });
}

export function runNumCp004EditorialV2Final(
  input: NumCp004PermanentRuntimeInput = {},
): NumCp004EditorialV2Question {
  return refine(runNumCp004EditorialV2(input));
}
