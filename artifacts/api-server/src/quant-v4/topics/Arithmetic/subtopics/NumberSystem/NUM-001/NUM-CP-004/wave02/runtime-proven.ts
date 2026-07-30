import {
  generateNumCp004Wave02Package as generateFoundationPackage,
  NUM_CP004_WAVE02_PROTOTYPE_IDS,
} from "./runtime";
import type {
  NumCp004Wave02Package,
  NumCp004Wave02PrototypeId,
} from "./types";

function generateExpandedPrimeTriple(seed: number): NumCp004Wave02Package {
  const tierResidue = ((seed - 1) % 3) + 1;
  const authoritySeed = seed * 300 + tierResidue;
  const pkg = generateFoundationPackage("NUM-CP004-PROT-014", authoritySeed);
  return {
    ...pkg,
    seed,
    hiddenState: {
      ...pkg.hiddenState,
      requestedSeed: seed,
      expandedAuthoritySeed: authoritySeed,
    },
    prototypeAncestry: [
      ...pkg.prototypeAncestry,
      "WAVE02-EXPANDED-PRIME-TRIPLE-SAMPLER",
    ],
    mathematicalFingerprint: `NUM-CP004-PROT-014:${JSON.stringify(pkg.hiddenState)}`,
  };
}

export function generateNumCp004Wave02Package(
  prototypeId: NumCp004Wave02PrototypeId,
  seed: number,
): NumCp004Wave02Package {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Seed must be a positive integer; received ${seed}`);
  }
  if (prototypeId === "NUM-CP004-PROT-014") return generateExpandedPrimeTriple(seed);
  return generateFoundationPackage(prototypeId, seed);
}

export function generateNumCp004Wave02Sweep(
  seedsPerPrototype: number,
): NumCp004Wave02Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("seedsPerPrototype must be a positive integer");
  }
  return NUM_CP004_WAVE02_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerPrototype }, (_, index) =>
      generateNumCp004Wave02Package(prototypeId, index + 1),
    ),
  );
}

export { NUM_CP004_WAVE02_PROTOTYPE_IDS };
