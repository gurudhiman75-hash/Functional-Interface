import { createRng } from "./core.ts";
import {
  dividendFromState,
  divisorFromState,
  exactDivisibilityAdjustment,
  productRemainder,
  quotientFromState,
  remainderFromState,
  selectValidState,
  sumRemainder,
} from "./generators.ts";
import {
  NUM_CP007_WAVE01_PROTOTYPE_IDS,
  type NumCp007Wave01Package,
  type NumCp007Wave01PrototypeId,
} from "./types.ts";

export { NUM_CP007_WAVE01_PROTOTYPE_REGISTRY } from "./registry.ts";
export { NUM_CP007_WAVE01_PROTOTYPE_IDS } from "./types.ts";

export function generateNumCp007Wave01Package(
  prototypeId: NumCp007Wave01PrototypeId,
  seed = 1,
): NumCp007Wave01Package {
  if (!NUM_CP007_WAVE01_PROTOTYPE_IDS.includes(prototypeId)) throw new Error(`Unknown prototype: ${prototypeId}`);
  if (!Number.isInteger(seed) || seed <= 0) throw new Error(`Seed must be a positive integer: ${seed}`);
  const rng = createRng(seed * 1009 + Number(prototypeId.slice(-3)) * 7919);
  switch (prototypeId) {
    case "NUM-CP007-PROT-001": return remainderFromState(seed, rng);
    case "NUM-CP007-PROT-002": return dividendFromState(seed, rng);
    case "NUM-CP007-PROT-003": return divisorFromState(seed, rng);
    case "NUM-CP007-PROT-004": return quotientFromState(seed, rng);
    case "NUM-CP007-PROT-005": return selectValidState(seed, rng);
    case "NUM-CP007-PROT-006": return sumRemainder(seed, rng);
    case "NUM-CP007-PROT-007": return productRemainder(seed, rng);
    case "NUM-CP007-PROT-008": return exactDivisibilityAdjustment(seed, rng);
  }
}
