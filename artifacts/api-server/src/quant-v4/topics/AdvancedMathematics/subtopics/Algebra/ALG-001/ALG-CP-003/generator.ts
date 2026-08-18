import {
  addRational,
  divideRational,
  equalsRational,
  formatRational,
  multiplyRational,
  powRational,
  rational,
  subtractRational,
  type Rational,
} from "../../../../../../shared/algebra";
import { getAlgCp003Candidate } from "./registry";
import type { AlgCp003DiscoveryItem } from "./types";

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

function values(seed: number): [number, number, number] {
  return [
    nonZeroInt(seed, -6, 6, 1),
    nonZeroInt(seed, -6, 6, 2),
    nonZeroInt(seed, -6, 6, 3),
  ];
}

function symmetricState(a: number, b: number, c: number) {
  const sum = a + b + c;
  const squareSum = a * a + b * b + c * c;
  const pairwise = a * b + b * c + c * a;
  const product = a * b * c;
  return { sum, squareSum, pairwise, product };
}

export function generateAlgCp003DiscoveryItem(candidateId: string, seed: number): AlgCp003DiscoveryItem {
  const candidate = getAlgCp003Candidate(candidateId);

  switch (candidate.solveMode) {
    case "findPairwiseProductSumFromSumAndSquareSum": {
      const [a, b, c] = values(seed);
      const { sum, squareSum } = symmetricState(a, b, c);
      const target = divideRational(subtractRational(powRational(r(sum), 2), r(squareSum)), r(2));
      return {
        cpId: "ALG-CP-003", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If a + b + c = ${sum} and a² + b² + c² = ${squareSum}, find ab + bc + ca.`,
        answer: { kind: "RATIONAL", value: target },
        explanation: `Use (a + b + c)² = a² + b² + c² + 2(ab + bc + ca). So 2(ab + bc + ca) = ${sum * sum} - ${squareSum}, giving ab + bc + ca = ${formatRational(target)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "findSquareSumFromSumAndPairwiseProduct": {
      const [a, b, c] = values(seed);
      const { sum, pairwise } = symmetricState(a, b, c);
      const target = subtractRational(powRational(r(sum), 2), multiplyRational(r(2), r(pairwise)));
      return {
        cpId: "ALG-CP-003", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If a + b + c = ${sum} and ab + bc + ca = ${pairwise}, find a² + b² + c².`,
        answer: { kind: "RATIONAL", value: target },
        explanation: `From (a + b + c)² = a² + b² + c² + 2(ab + bc + ca), we get a² + b² + c² = ${sum * sum} - 2(${pairwise}) = ${formatRational(target)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "findCubeSumWhenTotalSumIsZero": {
      const a = nonZeroInt(seed, -7, 7, 1);
      const b = nonZeroInt(seed, -7, 7, 2);
      const c = -(a + b);
      const product = a * b * c;
      const target = multiplyRational(r(3), r(product));
      return {
        cpId: "ALG-CP-003", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If a + b + c = 0 and abc = ${product}, find a³ + b³ + c³.`,
        answer: { kind: "RATIONAL", value: target },
        explanation: `When a + b + c = 0, the identity becomes a³ + b³ + c³ = 3abc. Therefore the value is 3(${product}) = ${formatRational(target)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "findPairwiseProductSumWhenTotalSumIsZero": {
      const a = nonZeroInt(seed, -7, 7, 1);
      const b = nonZeroInt(seed, -7, 7, 2);
      const c = -(a + b);
      const squareSum = a * a + b * b + c * c;
      const target = divideRational(r(-squareSum), r(2));
      return {
        cpId: "ALG-CP-003", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If a + b + c = 0 and a² + b² + c² = ${squareSum}, find ab + bc + ca.`,
        answer: { kind: "RATIONAL", value: target },
        explanation: `Since a + b + c = 0, squaring gives 0 = a² + b² + c² + 2(ab + bc + ca). Hence 2(ab + bc + ca) = -${squareSum}, so ab + bc + ca = ${formatRational(target)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "findPairwiseDifferenceSquareSum": {
      const [a, b, c] = values(seed);
      const { squareSum, pairwise } = symmetricState(a, b, c);
      const target = multiplyRational(r(2), subtractRational(r(squareSum), r(pairwise)));
      return {
        cpId: "ALG-CP-003", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If a² + b² + c² = ${squareSum} and ab + bc + ca = ${pairwise}, find (a - b)² + (b - c)² + (c - a)².`,
        answer: { kind: "RATIONAL", value: target },
        explanation: `Expanding the three squares gives 2(a² + b² + c² - ab - bc - ca). Therefore the value is 2(${squareSum} - (${pairwise})) = ${formatRational(target)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "solveCyclicReciprocalRelation": {
      const k = mixSeed(seed ^ 0xc003) % 2 === 0 ? 1 : -1;
      const aPool = [-5, -4, -3, -2, 2, 3, 4, 5] as const;
      const aValue = aPool[mixSeed(seed ^ 0x3c03) % aPool.length]!;
      const a = r(aValue);
      const kR = r(k);
      const b = divideRational(r(1), subtractRational(kR, a));
      const c = divideRational(r(1), subtractRational(kR, b));
      const target = addRational(c, divideRational(r(1), a));
      if (!equalsRational(target, kR)) throw new Error("Cyclic reciprocal construction failed exact target verification");
      const kText = k === 1 ? "1" : "-1";
      return {
        cpId: "ALG-CP-003", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If a + 1/b = ${kText} and b + 1/c = ${kText}, find c + 1/a.`,
        answer: { kind: "RATIONAL", value: target },
        explanation: `From a + 1/b = ${kText}, we get b = 1/(${kText} - a). Substitute this into b + 1/c = ${kText}. Since (${kText})² = 1, simplification gives c = ${kText} - 1/a. Therefore c + 1/a = ${kText}.`,
        sourceStatus: candidate.sourceStatus,
        evidence: { a, b, c, k: kR },
      };
    }
  }
}