import { createRng } from "./core.ts";
import { WAVE04_GENERATORS } from "./generators.ts";
import { NUM_CP007_WAVE04_PROTOTYPE_IDS } from "./types.ts";
import type {
  NumCp007Wave04Package,
  NumCp007Wave04PrototypeId,
} from "./types.ts";

export { NUM_CP007_WAVE04_PROTOTYPE_REGISTRY } from "./registry.ts";
export { NUM_CP007_WAVE04_PROTOTYPE_IDS } from "./types.ts";
export { verifyNumCp007Wave04Package } from "./verifier.ts";
export { buildQuotientZeroEdgeCase, verifyQuotientZeroEdgeCase } from "./direct-edge-hardening.ts";

export function generateNumCp007Wave04Package(
  prototypeId: NumCp007Wave04PrototypeId,
  seed = 1,
): NumCp007Wave04Package {
  if (!NUM_CP007_WAVE04_PROTOTYPE_IDS.includes(prototypeId)) {
    throw new Error(`Unknown Wave 04 prototype: ${prototypeId}`);
  }
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Seed must be a positive integer: ${seed}`);
  }
  const suffix = Number(prototypeId.slice(-3));
  const rng = createRng(seed * 3037 + suffix * 7919);
  return WAVE04_GENERATORS[prototypeId](seed, rng);
}
