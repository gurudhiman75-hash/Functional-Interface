import type { ExactRational, ProbabilityAnswer } from "./types";
function abs(value: bigint): bigint { return value < 0n ? -value : value; }
function gcd(a: bigint, b: bigint): bigint { a = abs(a); b = abs(b); while (b !== 0n) [a, b] = [b, a % b]; return a || 1n; }
export function rational(numerator: bigint | number, denominator: bigint | number = 1n): ExactRational {
  let n = BigInt(numerator), d = BigInt(denominator); if (d === 0n) throw new Error("Probability denominator must be non-zero");
  if (d < 0n) { n = -n; d = -d; } const divisor = gcd(n, d); return { numerator: n / divisor, denominator: d / divisor };
}
export function addRational(a: ExactRational, b: ExactRational): ExactRational { return rational(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator); }
export function subtractRational(a: ExactRational, b: ExactRational): ExactRational { return rational(a.numerator * b.denominator - b.numerator * a.denominator, a.denominator * b.denominator); }
export function multiplyRational(a: ExactRational, b: ExactRational): ExactRational { return rational(a.numerator * b.numerator, a.denominator * b.denominator); }
export function divideRational(a: ExactRational, b: ExactRational): ExactRational { if (b.numerator === 0n) throw new Error("Cannot divide by zero probability"); return rational(a.numerator * b.denominator, a.denominator * b.numerator); }
export function complementRational(value: ExactRational): ExactRational { return subtractRational(rational(1), value); }
export function compareRational(a: ExactRational, b: ExactRational): number { const delta = a.numerator * b.denominator - b.numerator * a.denominator; return delta < 0n ? -1 : delta > 0n ? 1 : 0; }
export function isProbability(value: ExactRational): boolean { return value.denominator > 0n && value.numerator >= 0n && value.numerator <= value.denominator; }
export function rationalText(value: ExactRational): string { return value.denominator === 1n ? value.numerator.toString() : `${value.numerator}/${value.denominator}`; }
export function rationalMathJax(value: ExactRational): string { return value.denominator === 1n ? value.numerator.toString() : `\\frac{${value.numerator}}{${value.denominator}}`; }
export function answerText(answer: ProbabilityAnswer): string {
  if (answer.kind === "COUNT") return answer.exact.toString();
  if (answer.kind === "PERCENT") return `${rationalText(answer.exact)}%`;
  return rationalText(answer.exact);
}
export function answerMathJax(answer: ProbabilityAnswer): string {
  if (answer.kind === "COUNT") return answer.exact.toString();
  if (answer.kind === "PERCENT") return `${rationalMathJax(answer.exact)}\\%`;
  return rationalMathJax(answer.exact);
}
