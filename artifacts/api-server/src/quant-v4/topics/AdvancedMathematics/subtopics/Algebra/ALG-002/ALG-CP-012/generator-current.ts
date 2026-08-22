import { formatRational, rational } from "../../../../../../shared/algebra";
import { generateAlgCp012DiscoveryItem as generateLegacyAlgCp012DiscoveryItem } from "./generator";
import type { AlgCp012DiscoveryItem } from "./types";

function mixSeed(seed: number): number {
  let x = seed | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

function positiveSum(seed: number): number {
  return 3 + (mixSeed(seed ^ 0x120043) % 16);
}

function buildFixedSumExtremum(candidateId: string, seed: number): AlgCp012DiscoveryItem {
  const sum = positiveSum(seed);
  const balanced = rational(sum, 3);

  if (candidateId === "ALG-CP012-CAND-011") {
    const minimum = rational(9, sum);
    return {
      cpId: "ALG-CP-012",
      candidateId,
      solveMode: "findMinimumReciprocalSumUnderPositiveFixedSum",
      seed,
      stem: `If x, y and z are positive real numbers and x + y + z = ${sum}, find the least value of 1/x + 1/y + 1/z.`,
      math: { kind: "SYMMETRIC_FIXED_SUM", variableCount: 3, positiveDomain: true, sum: rational(sum), target: "RECIPROCAL_SUM" },
      answer: { kind: "SYMMETRIC_EXTREMUM", value: minimum, balancedVariable: balanced, text: `minimum ${formatRational(minimum)} at x = y = z = ${formatRational(balanced)}` },
      explanation: `For positive x, y and z, Cauchy gives (x + y + z)(1/x + 1/y + 1/z) ≥ (1 + 1 + 1)² = 9. Since x + y + z = ${sum}, the reciprocal sum is at least 9/${sum} = ${formatRational(minimum)}. Equality occurs when x = y = z = ${formatRational(balanced)}, so this bound is attainable and is the least value.`,
      sourceStatus: "UNVERIFIED_DRAFT",
    };
  }

  const minimum = rational(sum * sum, 3);
  return {
    cpId: "ALG-CP-012",
    candidateId,
    solveMode: "findMinimumSquareSumUnderPositiveFixedSum",
    seed,
    stem: `If x, y and z are positive real numbers and x + y + z = ${sum}, find the minimum value of x² + y² + z².`,
    math: { kind: "SYMMETRIC_FIXED_SUM", variableCount: 3, positiveDomain: true, sum: rational(sum), target: "SQUARE_SUM" },
    answer: { kind: "SYMMETRIC_EXTREMUM", value: minimum, balancedVariable: balanced, text: `minimum ${formatRational(minimum)} at x = y = z = ${formatRational(balanced)}` },
    explanation: `By Cauchy, (x + y + z)² ≤ 3(x² + y² + z²). Therefore x² + y² + z² ≥ ${sum * sum}/3 = ${formatRational(minimum)}. Equality occurs when x = y = z = ${formatRational(balanced)}, so ${formatRational(minimum)} is the minimum value.`,
    sourceStatus: "UNVERIFIED_DRAFT",
  };
}

export function generateAlgCp012DiscoveryItem(candidateId: string, seed: number): AlgCp012DiscoveryItem {
  if (candidateId === "ALG-CP012-CAND-011" || candidateId === "ALG-CP012-CAND-012") {
    return buildFixedSumExtremum(candidateId, seed);
  }
  return generateLegacyAlgCp012DiscoveryItem(candidateId, seed);
}
