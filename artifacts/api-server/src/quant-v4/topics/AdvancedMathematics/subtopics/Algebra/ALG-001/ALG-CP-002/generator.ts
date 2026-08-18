import {
  addRational,
  formatRational,
  multiplyRational,
  powRational,
  rational,
  reciprocalPlusPowerSum,
  subtractRational,
  type Rational,
} from "../../../../../../shared/algebra";
import { getAlgCp002Candidate } from "./registry";
import type { AlgCp002DiscoveryItem } from "./types";

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

function r(value: number): Rational {
  return rational(BigInt(value));
}

function superscript(exponent: number): string {
  const digits: Record<string, string> = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  return String(exponent).split("").map((digit) => digits[digit] ?? digit).join("");
}

function powerText(value: number, exponent: number): string {
  const base = value < 0 ? `(${value})` : String(value);
  return `${base}${superscript(exponent)}`;
}

function subscript(exponent: number): string {
  const digits: Record<string, string> = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉" };
  return String(exponent).split("").map((digit) => digits[digit] ?? digit).join("");
}

function plusReciprocalGiven(seed: number): number {
  const magnitude = pickInt(seed, 2, 8, 1);
  return pickInt(seed, 0, 1, 2) === 0 ? magnitude : -magnitude;
}

export function generateAlgCp002DiscoveryItem(candidateId: string, seed: number): AlgCp002DiscoveryItem {
  const candidate = getAlgCp002Candidate(candidateId);

  switch (candidate.solveMode) {
    case "findSquareSumFromSumAndProduct": {
      const a = nonZeroInt(seed, -7, 7, 1);
      const b = nonZeroInt(seed, -7, 7, 2);
      const sum = a + b;
      const product = a * b;
      const target = subtractRational(powRational(r(sum), 2), multiplyRational(r(2), r(product)));
      return {
        cpId: "ALG-CP-002", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If a + b = ${sum} and ab = ${product}, find a² + b².`,
        answer: { kind: "RATIONAL", value: target },
        explanation: `Use (a + b)² = a² + b² + 2ab. Therefore a² + b² = ${powerText(sum, 2)} - 2(${product}) = ${formatRational(target)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "findCubeSumFromSumAndProduct": {
      const a = nonZeroInt(seed, -6, 6, 1);
      const b = nonZeroInt(seed, -6, 6, 2);
      const sum = a + b;
      const product = a * b;
      const target = subtractRational(powRational(r(sum), 3), multiplyRational(r(3 * product), r(sum)));
      return {
        cpId: "ALG-CP-002", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If a + b = ${sum} and ab = ${product}, find a³ + b³.`,
        answer: { kind: "RATIONAL", value: target },
        explanation: `Use a³ + b³ = (a + b)³ - 3ab(a + b). So a³ + b³ = ${powerText(sum, 3)} - 3(${product})(${sum}) = ${formatRational(target)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "findReciprocalSquareFromPlus": {
      const k = plusReciprocalGiven(seed);
      const target = reciprocalPlusPowerSum(r(k), 2);
      return {
        cpId: "ALG-CP-002", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If x + 1/x = ${k}, find x² + 1/x².`,
        answer: { kind: "RATIONAL", value: target },
        explanation: `Square the given relation: (x + 1/x)² = x² + 2 + 1/x². Hence x² + 1/x² = ${powerText(k, 2)} - 2 = ${formatRational(target)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "findReciprocalCubeFromPlus": {
      const k = plusReciprocalGiven(seed);
      const target = reciprocalPlusPowerSum(r(k), 3);
      return {
        cpId: "ALG-CP-002", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If x + 1/x = ${k}, find x³ + 1/x³.`,
        answer: { kind: "RATIONAL", value: target },
        explanation: `Use x³ + 1/x³ = (x + 1/x)³ - 3(x + 1/x). Thus the value is ${powerText(k, 3)} - 3(${k}) = ${formatRational(target)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "findReciprocalHigherPowerFromPlus": {
      const k = plusReciprocalGiven(seed);
      const exponent = pickInt(seed, 4, 6, 3);
      const target = reciprocalPlusPowerSum(r(k), exponent);
      return {
        cpId: "ALG-CP-002", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If x + 1/x = ${k}, find x${superscript(exponent)} + 1/x${superscript(exponent)}.`,
        answer: { kind: "RATIONAL", value: target },
        explanation: `Let Pₙ = xⁿ + 1/xⁿ. We know P₀ = 2 and P₁ = ${k}. Each next value is found from Pₙ = ${k}Pₙ₋₁ - Pₙ₋₂. Continuing this up to P${subscript(exponent)} gives ${formatRational(target)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "findReciprocalSquareFromMinus": {
      const k = pickInt(seed, -8, 8, 1);
      const target = addRational(powRational(r(k), 2), r(2));
      return {
        cpId: "ALG-CP-002", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If x - 1/x = ${k}, find x² + 1/x².`,
        answer: { kind: "RATIONAL", value: target },
        explanation: `Square the given relation: (x - 1/x)² = x² - 2 + 1/x². Therefore x² + 1/x² = ${powerText(k, 2)} + 2 = ${formatRational(target)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "findReciprocalCubeFromMinus": {
      const k = pickInt(seed, -8, 8, 1);
      const target = addRational(powRational(r(k), 3), multiplyRational(r(3), r(k)));
      return {
        cpId: "ALG-CP-002", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If x - 1/x = ${k}, find x³ - 1/x³.`,
        answer: { kind: "RATIONAL", value: target },
        explanation: `Since (x - 1/x)³ = x³ - 1/x³ - 3(x - 1/x), we get x³ - 1/x³ = ${powerText(k, 3)} + 3(${k}) = ${formatRational(target)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "findDifferenceOfSquaresFromSumAndDifference": {
      const a = nonZeroInt(seed, -8, 8, 1);
      const b = nonZeroInt(seed, -8, 8, 2);
      const sum = a + b;
      const difference = a - b;
      const target = multiplyRational(r(sum), r(difference));
      return {
        cpId: "ALG-CP-002", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If a + b = ${sum} and a - b = ${difference}, find a² - b².`,
        answer: { kind: "RATIONAL", value: target },
        explanation: `Use a² - b² = (a + b)(a - b). So the value is (${sum})(${difference}) = ${formatRational(target)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }
  }
}
