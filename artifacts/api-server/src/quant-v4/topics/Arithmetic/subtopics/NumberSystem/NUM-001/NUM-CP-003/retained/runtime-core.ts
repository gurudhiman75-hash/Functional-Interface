import { fillSingleDigit, fillTwoDigits, isDivisible, powerOfTen, repeatBlock } from "../../foundation/divisibility";
import type { DeterministicRandom } from "../../foundation/prng";
import type {
  NumCp003ReasoningNode,
  NumCp003RetainedOptionAudit,
} from "./runtime-types";

export const DIVISOR_POOL = [3n, 4n, 5n, 6n, 7n, 8n, 9n, 11n, 12n, 13n, 15n, 18n, 24n, 25n, 27n, 32n, 36n, 45n, 72n, 99n] as const;

export function option(text: string, misconceptionId: string, diagnostic: string): NumCp003RetainedOptionAudit {
  return { text, misconceptionId, diagnostic };
}

export function shuffleOptions(
  random: DeterministicRandom,
  candidates: readonly NumCp003RetainedOptionAudit[],
): { rows: NumCp003RetainedOptionAudit[]; correctIndex: number } {
  const unique = new Map<string, NumCp003RetainedOptionAudit>();
  for (const candidate of candidates) if (!unique.has(candidate.text)) unique.set(candidate.text, candidate);

  const values = [...unique.values()];
  const isFiveClassDataSufficiency = values.length === 5
    && values.filter((row) => row.misconceptionId === "CORRECT").length === 1
    && values.filter((row) => row.misconceptionId !== "CORRECT").every((row) => row.misconceptionId.startsWith("MISCLASSIFIED_"));
  const expectedCount = isFiveClassDataSufficiency ? 5 : 4;
  if (values.length < expectedCount) {
    throw new Error(`Expected at least ${expectedCount} unique options, received ${values.length}`);
  }

  const selected = values.slice(0, expectedCount);
  if (selected.filter((row) => row.misconceptionId === "CORRECT").length !== 1) {
    throw new Error("Option normalisation must retain exactly one correct row");
  }
  const rows = random.shuffle(selected);
  const correctIndex = rows.findIndex((row) => row.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("Correct option missing");
  return { rows, correctIndex };
}

export function reasoningNodes(
  given: string,
  rule: string,
  derivation: string,
  verification: string,
  conclusion: string,
): NumCp003ReasoningNode[] {
  return [
    { id: "given", kind: "GIVEN", text: given, dependsOn: [] },
    { id: "rule", kind: "RULE", text: rule, dependsOn: ["given"] },
    { id: "derive", kind: "DERIVATION", text: derivation, dependsOn: ["rule"] },
    { id: "verify", kind: "VERIFICATION", text: verification, dependsOn: ["derive"] },
    { id: "conclusion", kind: "CONCLUSION", text: conclusion, dependsOn: ["verify"] },
  ];
}

export function randomTemplate(random: DeterministicRandom, missingCount = 1): string {
  const length = random.int(missingCount === 1 ? 3 : 4, 7);
  const digits = Array.from({ length }, (_unused, index) => String(random.int(index === 0 ? 1 : 0, 9)));
  const positions = random.shuffle(Array.from({ length }, (_unused, index) => index)).slice(0, missingCount);
  positions.forEach((position, index) => { digits[position] = index === 0 ? "X" : "Y"; });
  return digits.join("");
}

export function singleDigitDomain(template: string): number[] {
  return Array.from({ length: 10 }, (_unused, digit) => digit).filter((digit) => !(template.startsWith("X") && digit === 0));
}

export function enumerateSingleDigits(template: string, divisors: readonly bigint[]): number[] {
  return singleDigitDomain(template).filter((digit) => {
    const value = BigInt(fillSingleDigit(template, digit));
    return divisors.every((divisor) => value % divisor === 0n);
  });
}

export function enumerateOrderedPairs(
  template: string,
  divisors: readonly bigint[],
  relation?: { kind: "DIGIT_SUM"; value: number },
): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  for (let first = 0; first <= 9; first += 1) {
    for (let second = 0; second <= 9; second += 1) {
      if (template.startsWith("X") && first === 0) continue;
      if (template.startsWith("Y") && second === 0) continue;
      if (relation?.kind === "DIGIT_SUM" && first + second !== relation.value) continue;
      const value = BigInt(fillTwoDigits(template, first, second));
      if (divisors.every((divisor) => value % divisor === 0n)) pairs.push([first, second]);
    }
  }
  return pairs;
}

export function pairText(pair: readonly [number, number]): string {
  return `(${pair[0]}, ${pair[1]})`;
}

export function pairSetText(pairs: ReadonlyArray<readonly [number, number]>): string {
  return `{${pairs.map(pairText).join(", ")}}`;
}

export function digitSetText(digits: readonly number[]): string {
  return `{${digits.join(", ")}}`;
}

export function completeSingleDigitNumber(template: string, digit: number): bigint {
  const text = fillSingleDigit(template, digit);
  if (text.startsWith("0")) throw new Error("Leading zero is not allowed");
  return BigInt(text);
}

export function countMultiplesInclusive(lower: bigint, upper: bigint, divisor: bigint): bigint {
  if (divisor <= 0n || lower > upper) throw new Error("Invalid inclusive range state");
  const beforeLower = lower === 0n ? -1n : (lower - 1n) / divisor;
  return upper / divisor - beforeLower;
}

export function greatestMultipleAtOrBelow(boundary: bigint, divisor: bigint): bigint {
  if (divisor <= 0n) throw new Error("Divisor must be positive");
  return boundary - boundary % divisor;
}

export function leastMultipleAtOrAbove(boundary: bigint, divisor: bigint): bigint {
  if (divisor <= 0n) throw new Error("Divisor must be positive");
  const remainder = boundary % divisor;
  return remainder === 0n ? boundary : boundary + divisor - remainder;
}

export function constructRepeatedNumeral(block: string, repeats: number): bigint {
  return repeatBlock(block, repeats);
}

export function falseDivisors(number: bigint, correct: bigint, random: DeterministicRandom): bigint[] {
  const values = DIVISOR_POOL.filter((divisor) => divisor !== correct && !isDivisible(number, divisor));
  if (values.length < 3) throw new Error("Insufficient false divisors");
  return random.shuffle(values).slice(0, 3);
}

export function trueDivisors(number: bigint, excluded: bigint | null, random: DeterministicRandom): bigint[] {
  const values = DIVISOR_POOL.filter((divisor) => divisor !== excluded && isDivisible(number, divisor));
  if (values.length < 3) throw new Error("Insufficient true divisors");
  return random.shuffle(values).slice(0, 3);
}

export function difficultyFromState(signal: number): "Easy" | "Medium" | "Hard" {
  if (signal <= 4) return "Easy";
  if (signal >= 8) return "Hard";
  return "Medium";
}

export function firstNDigitBoundary(digits: number): bigint {
  return powerOfTen(digits - 1);
}

export function lastNDigitBoundary(digits: number): bigint {
  return powerOfTen(digits) - 1n;
}
