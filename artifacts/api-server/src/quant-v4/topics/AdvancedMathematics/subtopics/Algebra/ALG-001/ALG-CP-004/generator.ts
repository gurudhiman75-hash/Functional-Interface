import {
  expandFactorization,
  factorQuadraticOverRationals,
  multiplyPolynomials,
  polynomial,
  rational,
  verifyFactorization,
  type Factorization1,
  type Polynomial1,
} from "../../../../../../shared/algebra";
import { getAlgCp004Candidate } from "./registry";
import type { AlgCp004DiscoveryItem } from "./types";

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

function nonZeroInt(seed: number, min: number, max: number, salt: number): number {
  let value = pickInt(seed, min, max, salt);
  if (value === 0) value = 1;
  return value;
}

function linearFactor(leading: number, constant: number): Polynomial1 {
  return polynomial("x", [rational(constant), rational(leading)]);
}

function variableText(coefficient: number): string {
  if (coefficient === 1) return "x";
  if (coefficient === -1) return "-x";
  return `${coefficient}x`;
}

function factorText(leading: number, constant: number): string {
  const xTerm = variableText(leading);
  if (constant === 0) return xTerm;
  return `(${xTerm} ${constant < 0 ? "-" : "+"} ${Math.abs(constant)})`;
}

function polynomialText(value: Polynomial1): string {
  const pieces: string[] = [];
  for (let degree = value.coefficients.length - 1; degree >= 0; degree -= 1) {
    const coefficient = value.coefficients[degree]!;
    if (coefficient.numerator === 0n) continue;
    if (coefficient.denominator !== 1n) throw new Error("Discovery formatter currently expects integer coefficients");
    const n = Number(coefficient.numerator);
    const absolute = Math.abs(n);
    const variable = degree === 0 ? "" : degree === 1 ? "x" : `x${degree === 2 ? "²" : `^${degree}`}`;
    const magnitude = degree > 0 && absolute === 1 ? variable : `${absolute}${variable}`;
    if (pieces.length === 0) pieces.push(n < 0 ? `-${magnitude}` : magnitude);
    else pieces.push(`${n < 0 ? "-" : "+"} ${magnitude}`);
  }
  return pieces.join(" ") || "0";
}

function item(candidateId: string, solveMode: AlgCp004DiscoveryItem["solveMode"], seed: number, original: Polynomial1, factorization: Factorization1, text: string, explanation: string): AlgCp004DiscoveryItem {
  if (!verifyFactorization(original, factorization)) throw new Error(`Invalid generated factorization for ${candidateId}`);
  return {
    cpId: "ALG-CP-004", candidateId, solveMode, seed,
    stem: `Factorise ${polynomialText(original)}.`,
    polynomial: original,
    answer: { kind: "FACTORIZATION", value: factorization, text },
    explanation,
    sourceStatus: "UNVERIFIED_DRAFT",
  };
}

export function generateAlgCp004DiscoveryItem(candidateId: string, seed: number): AlgCp004DiscoveryItem {
  const candidate = getAlgCp004Candidate(candidateId);

  switch (candidate.solveMode) {
    case "factorCommonIntegerContent": {
      const g = pickInt(seed, 2, 6, 1);
      const a = nonZeroInt(seed, -5, 5, 2);
      const b = nonZeroInt(seed, -7, 7, 3);
      const primitive = polynomial("x", [rational(b), rational(a)]);
      const factorization: Factorization1 = { scalar: rational(g), factors: [primitive] };
      const original = expandFactorization(factorization, "x");
      return item(candidateId, candidate.solveMode, seed, original, factorization, `${g}(${polynomialText(primitive)})`, `Both terms have a common factor ${g}. Taking it outside gives ${g}(${polynomialText(primitive)}). Multiplying ${g} back into the bracket reproduces ${polynomialText(original)}, so the factorisation is complete.`);
    }

    case "factorDifferenceOfSquares": {
      const a = pickInt(seed, 2, 9, 1);
      const left = linearFactor(1, -a);
      const right = linearFactor(1, a);
      const factorization: Factorization1 = { scalar: rational(1n), factors: [left, right] };
      const original = multiplyPolynomials(left, right);
      return item(candidateId, candidate.solveMode, seed, original, factorization, `(x - ${a})(x + ${a})`, `This is a difference of squares: x² - ${a * a} = x² - ${a}². Using A² - B² = (A - B)(A + B), we get (x - ${a})(x + ${a}).`);
    }

    case "factorPerfectSquareTrinomial": {
      const root = nonZeroInt(seed, -7, 7, 1);
      const factor = linearFactor(1, -root);
      const factorization: Factorization1 = { scalar: rational(1n), factors: [factor, factor] };
      const original = multiplyPolynomials(factor, factor);
      const sign = -root;
      const factorDisplay = factorText(1, sign);
      return item(candidateId, candidate.solveMode, seed, original, factorization, `${factorDisplay}²`, `The first and last terms are squares, and the middle term is twice their product. Thus the trinomial matches A² + 2AB + B² or A² - 2AB + B², giving the perfect square ${factorDisplay}².`);
    }

    case "factorMonicQuadratic": {
      let r1 = nonZeroInt(seed, -7, 7, 1);
      let r2 = nonZeroInt(seed, -7, 7, 2);
      if (r2 === r1) r2 = r1 === 7 ? 6 : r1 + 1;
      const source: Factorization1 = { scalar: rational(1n), factors: [linearFactor(1, -r1), linearFactor(1, -r2)] };
      const original = expandFactorization(source, "x");
      const solved = factorQuadraticOverRationals(original);
      if (!solved || !verifyFactorization(original, solved)) throw new Error("Monic quadratic factor solver failed");
      const text = `${factorText(1, -r1)}${factorText(1, -r2)}`;
      const p = -r1;
      const q = -r2;
      return item(candidateId, candidate.solveMode, seed, original, source, text, `For a monic quadratic, find two numbers whose sum is the coefficient of x and whose product is the constant term. Here ${p} ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${p + q} and (${p})(${q}) = ${p * q}. Therefore ${polynomialText(original)} = ${text}.`);
    }

    case "factorNonMonicQuadratic": {
      const m = pickInt(seed, 2, 4, 1);
      const p = pickInt(seed, 1, 3, 2);
      const n = nonZeroInt(seed, -6, 6, 3);
      const q = nonZeroInt(seed, -6, 6, 4);
      const left = linearFactor(m, n);
      const right = linearFactor(p, q);
      const factorization: Factorization1 = { scalar: rational(1n), factors: [left, right] };
      const original = multiplyPolynomials(left, right);
      const text = `${factorText(m, n)}${factorText(p, q)}`;
      const firstMiddle = m * q;
      const secondMiddle = n * p;
      const splitText = `${firstMiddle} ${secondMiddle < 0 ? "-" : "+"} ${Math.abs(secondMiddle)}`;
      const commonBracket = `${variableText(p)} ${q < 0 ? "-" : "+"} ${Math.abs(q)}`;
      return item(candidateId, candidate.solveMode, seed, original, factorization, text, `The middle coefficient is ${firstMiddle + secondMiddle}. Split it as ${splitText}. Then group the terms: ${m * p}x² ${firstMiddle < 0 ? "-" : "+"} ${Math.abs(firstMiddle)}x = ${m}x(${commonBracket}), and ${secondMiddle}x ${n * q < 0 ? "-" : "+"} ${Math.abs(n * q)} = ${n}(${commonBracket}). Taking the common bracket gives ${text}.`);
    }
  }
}
