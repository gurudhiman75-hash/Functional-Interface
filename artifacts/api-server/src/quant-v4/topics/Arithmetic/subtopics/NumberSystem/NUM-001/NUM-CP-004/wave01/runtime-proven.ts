import {
  generateNumCp004Wave01Package as generateAuthorityPackage,
  NUM_CP004_WAVE01_PROTOTYPE_IDS,
} from "./runtime-authority";
import {
  generateNumCp004Wave01Package as generateReviewedPackage,
} from "./runtime-reviewed";
import type {
  NumCp004Difficulty,
  NumCp004Wave01Package,
  NumCp004Wave01PrototypeId,
  PrimeFactorPropertyTarget,
} from "./types";

const PROPERTY_TARGETS: readonly PrimeFactorPropertyTarget[] = [
  "SMALLEST_PRIME_FACTOR",
  "LARGEST_PRIME_FACTOR",
  "DISTINCT_PRIME_FACTOR_COUNT",
  "TOTAL_PRIME_FACTOR_COUNT",
];

function propertyDifficulty(
  target: PrimeFactorPropertyTarget,
): NumCp004Difficulty {
  if (target === "SMALLEST_PRIME_FACTOR" || target === "LARGEST_PRIME_FACTOR") {
    return "EASY";
  }
  if (target === "DISTINCT_PRIME_FACTOR_COUNT") return "MEDIUM";
  return "HARD";
}

function generatePropertyTarget(
  requestedSeed: number,
): NumCp004Wave01Package {
  const targetIndex = (requestedSeed - 1) % PROPERTY_TARGETS.length;
  const desiredTarget = PROPERTY_TARGETS[targetIndex]!;
  let lastError: unknown;

  for (let attempt = 0; attempt < 300; attempt += 1) {
    const reviewedSeed = requestedSeed * 10_000 + targetIndex + attempt * 4;
    try {
      const pkg = generateReviewedPackage("NUM-CP004-PROT-005", reviewedSeed);
      if (pkg.hiddenState.target !== desiredTarget) {
        throw new Error(
          `Target residue mismatch: expected ${desiredTarget}, received ${String(pkg.hiddenState.target)}`,
        );
      }

      return {
        ...pkg,
        seed: requestedSeed,
        difficulty: propertyDifficulty(desiredTarget),
        hiddenState: {
          ...pkg.hiddenState,
          requestedSeed,
          targetReviewedSeed: reviewedSeed,
          desiredTarget,
        },
        prototypeAncestry: [
          ...pkg.prototypeAncestry,
          "EXPLICIT-PRIME-PROPERTY-TARGET-SAMPLER",
          "BOUNDED-TARGET-SPECIFIC-REVIEWED-STATE",
        ],
        mathematicalFingerprint: `NUM-CP004-PROT-005:${desiredTarget}:${JSON.stringify(pkg.hiddenState)}`,
      };
    } catch (error) {
      lastError = error;
      if (
        error instanceof Error
        && (error.message.includes("verifier domain exceeded")
          || error.message.includes("Unable to construct three unique misconception options"))
      ) {
        continue;
      }
      throw error;
    }
  }

  throw new Error(
    `Unable to generate bounded prime-factor property target ${desiredTarget} for seed ${requestedSeed}: ${String(lastError)}`,
  );
}

export function generateNumCp004Wave01Package(
  prototypeId: NumCp004Wave01PrototypeId,
  seed: number,
): NumCp004Wave01Package {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Seed must be a positive integer; received ${seed}`);
  }
  if (prototypeId === "NUM-CP004-PROT-005") {
    return generatePropertyTarget(seed);
  }
  return generateAuthorityPackage(prototypeId, seed);
}

export function generateNumCp004Wave01Sweep(
  seedsPerPrototype: number,
): NumCp004Wave01Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("seedsPerPrototype must be a positive integer");
  }
  return NUM_CP004_WAVE01_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerPrototype }, (_, index) =>
      generateNumCp004Wave01Package(prototypeId, index + 1),
    ),
  );
}

export { NUM_CP004_WAVE01_PROTOTYPE_IDS };
