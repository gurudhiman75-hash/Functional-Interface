import {
  equalsRational,
  evaluatePolynomial,
  formatRational,
  polynomial,
  rational,
} from "../../../../../../shared/algebra";
import { generateAlgCp015DiscoveryItem as generateLegacyAlgCp015DiscoveryItem } from "./generator";
import type { AlgCp015DiscoveryItem } from "./types";

function mixSeed(seed: number): number {
  let x = seed | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

function buildBoundedCubicRoot(seed: number): AlgCp015DiscoveryItem {
  const hiddenRoot = 2 + (mixSeed(seed ^ 0x1507) % 7);
  const target = hiddenRoot ** 3 + hiddenRoot;
  const source = polynomial("x", [rational(-target), rational(1n), rational(0n), rational(1n)]);
  const root = rational(hiddenRoot);
  if (!equalsRational(evaluatePolynomial(source, root), rational(0n))) throw new Error("Bounded cubic-root construction failed exact root verification");
  let positiveRootCount = 0;
  for (let x = 1; x <= 20; x += 1) {
    if (evaluatePolynomial(source, rational(x)).numerator === 0n) positiveRootCount += 1;
  }
  if (positiveRootCount !== 1) throw new Error("Bounded cubic-root composition must expose exactly one positive integer root");
  return {
    cpId: "ALG-CP-015",
    candidateId: "ALG-CP015-CAND-007",
    solveMode: "boundedPositiveIntegerCubicRoot",
    seed,
    stem: `The sum of a positive integer and its cube is ${target}. Find the integer.`,
    math: { kind: "BOUNDED_CUBIC_ROOT", polynomial: source, positiveIntegerDomain: true, upperScanBound: 20 },
    answer: { kind: "RATIONAL", value: root, text: formatRational(root) },
    explanation: `Let the positive integer be x. Then x³ + x = ${target}, so x must be a positive integer root of x³ + x - ${target} = 0. Checking the small positive integer factors/candidates gives x = ${hiddenRoot}, and ${hiddenRoot}³ + ${hiddenRoot} = ${target}. Thus the required integer is ${hiddenRoot}.`,
    sourceStatus: "UNVERIFIED_DRAFT",
  };
}

export function generateAlgCp015DiscoveryItem(candidateId: string, seed: number): AlgCp015DiscoveryItem {
  if (candidateId === "ALG-CP015-CAND-007") return buildBoundedCubicRoot(seed);
  return generateLegacyAlgCp015DiscoveryItem(candidateId, seed);
}
