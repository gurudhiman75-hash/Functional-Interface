import {
  generateNumCp004Wave01Package as generateAuthorityPackage,
  NUM_CP004_WAVE01_PROTOTYPE_IDS,
} from "./runtime-authority";
import type {
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

function generatePropertyTarget(
  requestedSeed: number,
): NumCp004Wave01Package {
  const desiredTarget = PROPERTY_TARGETS[(requestedSeed - 1) % PROPERTY_TARGETS.length]!;

  for (let offset = 0; offset < 40; offset += 1) {
    const authoritySeed = requestedSeed + offset;
    const pkg = generateAuthorityPackage("NUM-CP004-PROT-005", authoritySeed);
    if (pkg.hiddenState.target !== desiredTarget) continue;

    return {
      ...pkg,
      seed: requestedSeed,
      hiddenState: {
        ...pkg.hiddenState,
        requestedSeed,
        targetAuthoritySeed: authoritySeed,
        desiredTarget,
      },
      prototypeAncestry: [
        ...pkg.prototypeAncestry,
        "EXPLICIT-PRIME-PROPERTY-TARGET-SAMPLER",
      ],
      mathematicalFingerprint: `NUM-CP004-PROT-005:${desiredTarget}:${JSON.stringify(pkg.hiddenState)}`,
    };
  }

  throw new Error(
    `Unable to generate prime-factor property target ${desiredTarget} for seed ${requestedSeed}`,
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
