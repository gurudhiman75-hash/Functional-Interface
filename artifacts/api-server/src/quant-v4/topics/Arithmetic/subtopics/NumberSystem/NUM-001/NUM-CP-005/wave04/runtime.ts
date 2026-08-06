import { assertSeed } from "./common";
import { generateDataSufficiency, generateStatementSet } from "./data-statements";
import { generateExponentPairSet, generatePossibleIntegerSet, generateSolutionClass } from "./inverse";
import { generateBoundedOptimisation, generateFactorTableMatch, generateMiniCaselet } from "./representations";
import {
  NUM_CP005_WAVE04_PROTOTYPE_IDS,
  type NumCp005Wave04Package,
  type NumCp005Wave04PrototypeId,
} from "./types";

export function generateNumCp005Wave04Package(
  prototypeId: NumCp005Wave04PrototypeId,
  seed: number,
): NumCp005Wave04Package {
  assertSeed(seed);
  if (!NUM_CP005_WAVE04_PROTOTYPE_IDS.includes(prototypeId)) {
    throw new Error(`Unknown NUM-CP-005 Wave 04 prototype: ${prototypeId}`);
  }

  switch (prototypeId) {
    case "NUM-CP005-PROT-025": return generateDataSufficiency(prototypeId, seed);
    case "NUM-CP005-PROT-026": return generateStatementSet(prototypeId, seed);
    case "NUM-CP005-PROT-027": return generateSolutionClass(prototypeId, seed);
    case "NUM-CP005-PROT-028": return generateExponentPairSet(prototypeId, seed);
    case "NUM-CP005-PROT-029": return generatePossibleIntegerSet(prototypeId, seed);
    case "NUM-CP005-PROT-030": return generateFactorTableMatch(prototypeId, seed);
    case "NUM-CP005-PROT-031": return generateMiniCaselet(prototypeId, seed);
    case "NUM-CP005-PROT-032": return generateBoundedOptimisation(prototypeId, seed);
  }
}

export function generateNumCp005Wave04Sweep(
  seedsPerPrototype: number,
): readonly NumCp005Wave04Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("NUM-CP-005 Wave 04 sweep size must be a positive integer.");
  }
  return Object.freeze(NUM_CP005_WAVE04_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerPrototype }, (_unused, index) =>
      generateNumCp005Wave04Package(prototypeId, index + 1))));
}
