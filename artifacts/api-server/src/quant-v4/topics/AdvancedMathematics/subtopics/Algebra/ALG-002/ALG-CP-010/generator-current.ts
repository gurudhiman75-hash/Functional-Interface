import {
  equalsRational,
  evaluatePolynomial,
  formatRational,
  polynomial,
  rational,
  type Polynomial1,
  type Rational,
} from "../../../../../../shared/algebra";
import { generateAlgCp010DiscoveryItem as generateLegacyAlgCp010DiscoveryItem } from "./generator";
import type { AlgCp010DiscoveryItem } from "./types";

function mixSeed(seed: number): number {
  let x = seed | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

function pickInt(seed: number, min: number, max: number, salt: number): number {
  return min + (mixSeed(seed ^ (salt * 0x9e3779b9)) % (max - min + 1));
}

function root(seed: number, salt: number): number {
  return pickInt(seed, -6, 6, salt);
}

function polynomialText(value: Polynomial1): string {
  const pieces: string[] = [];
  for (let degree = value.coefficients.length - 1; degree >= 0; degree -= 1) {
    const coefficient = value.coefficients[degree]!;
    if (coefficient.numerator === 0n) continue;
    if (coefficient.denominator !== 1n) throw new Error("Cubic Vieta formatter expects integer coefficients");
    const n = Number(coefficient.numerator);
    const abs = Math.abs(n);
    const variable = degree === 0 ? "" : degree === 1 ? "x" : degree === 2 ? "x²" : degree === 3 ? "x³" : `x^${degree}`;
    const magnitude = variable && abs === 1 ? variable : `${abs}${variable}`;
    if (pieces.length === 0) pieces.push(n < 0 ? `-${magnitude}` : magnitude);
    else pieces.push(`${n < 0 ? "-" : "+"} ${magnitude}`);
  }
  return pieces.join(" ") || "0";
}

function buildCubicVieta(seed: number): AlgCp010DiscoveryItem {
  const r1 = root(seed, 1);
  const r2 = root(seed, 2);
  const r3 = root(seed, 3);
  const leading = pickInt(seed, 1, 3, 4);
  const sum = r1 + r2 + r3;
  const pairwise = r1 * r2 + r2 * r3 + r3 * r1;
  const product = r1 * r2 * r3;
  const value = polynomial("x", [
    rational(-leading * product),
    rational(leading * pairwise),
    rational(-leading * sum),
    rational(leading),
  ]);
  const roots: [Rational, Rational, Rational] = [rational(r1), rational(r2), rational(r3)];
  for (const candidateRoot of roots) {
    if (!equalsRational(evaluatePolynomial(value, candidateRoot), rational(0n))) throw new Error("Cubic Vieta root construction failed");
  }
  const answer = rational(sum);
  return {
    cpId: "ALG-CP-010",
    candidateId: "ALG-CP010-CAND-012",
    solveMode: "findCubicRootSumByVieta",
    seed,
    stem: `If α, β and γ are the roots of ${polynomialText(value)} = 0, find α + β + γ.`,
    originalPolynomial: value,
    answer: { kind: "RATIONAL", value: answer },
    explanation: `For a cubic Ax³ + Bx² + Cx + D = 0, the sum of its three roots is -B/A. Here A = ${leading} and B = ${-leading * sum}, so α + β + γ = -(${ -leading * sum })/${leading} = ${formatRational(answer)}. The individual roots do not need to be solved.`,
    sourceStatus: "UNVERIFIED_DRAFT",
    hiddenCubicRoots: roots,
  };
}

export function generateAlgCp010DiscoveryItem(candidateId: string, seed: number): AlgCp010DiscoveryItem {
  if (candidateId === "ALG-CP010-CAND-012") return buildCubicVieta(seed);
  return generateLegacyAlgCp010DiscoveryItem(candidateId, seed);
}
