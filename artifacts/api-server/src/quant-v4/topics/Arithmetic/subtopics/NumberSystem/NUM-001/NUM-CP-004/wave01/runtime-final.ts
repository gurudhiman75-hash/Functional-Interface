import {
  generateNumCp004Wave01Package as generateReviewedPackage,
  NUM_CP004_WAVE01_PROTOTYPE_IDS,
} from "./runtime-reviewed";
import type {
  NumCp004Wave01Package,
  NumCp004Wave01PrototypeId,
} from "./types";

const FACTOR_STATE_PROTOTYPES = new Set<NumCp004Wave01PrototypeId>([
  "NUM-CP004-PROT-004",
  "NUM-CP004-PROT-005",
  "NUM-CP004-PROT-006",
]);

function withRequestedSeed(
  pkg: NumCp004Wave01Package,
  requestedSeed: number,
  foundationSeed: number,
): NumCp004Wave01Package {
  if (requestedSeed === foundationSeed) return pkg;
  return {
    ...pkg,
    seed: requestedSeed,
    hiddenState: {
      ...pkg.hiddenState,
      requestedSeed,
      boundedFoundationSeed: foundationSeed,
    },
    prototypeAncestry: [...pkg.prototypeAncestry, "BOUNDED-SAFE-INTEGER-STATE-RETRY"],
    mathematicalFingerprint: `${pkg.temporaryPrototypeId}:requested-${requestedSeed}:foundation-${foundationSeed}:${JSON.stringify(pkg.hiddenState)}`,
  };
}

export function generateNumCp004Wave01Package(
  prototypeId: NumCp004Wave01PrototypeId,
  seed: number,
): NumCp004Wave01Package {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Seed must be a positive integer; received ${seed}`);
  }
  if (!FACTOR_STATE_PROTOTYPES.has(prototypeId)) {
    return generateReviewedPackage(prototypeId, seed);
  }

  let lastError: unknown;
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const foundationSeed = seed + attempt * 3;
    try {
      return withRequestedSeed(
        generateReviewedPackage(prototypeId, foundationSeed),
        seed,
        foundationSeed,
      );
    } catch (error) {
      lastError = error;
      if (!(error instanceof Error) || !error.message.includes("verifier domain exceeded")) {
        throw error;
      }
    }
  }
  throw new Error(
    `Unable to construct a bounded exact factor state for ${prototypeId}, seed ${seed}: ${String(lastError)}`,
  );
}

export function generateNumCp004Wave01Sweep(seedsPerPrototype: number): NumCp004Wave01Package[] {
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
