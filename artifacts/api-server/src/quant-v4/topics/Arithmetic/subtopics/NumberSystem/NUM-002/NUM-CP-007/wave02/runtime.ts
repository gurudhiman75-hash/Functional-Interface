import { createRng } from "./core.ts";
import { WAVE02_GENERATORS } from "./generators.ts";
import { NUM_CP007_WAVE02_PROTOTYPE_IDS } from "./types.ts";
import type {
  NumCp007Wave02Package,
  NumCp007Wave02PrototypeId,
} from "./types.ts";

export { NUM_CP007_WAVE02_PROTOTYPE_REGISTRY } from "./registry.ts";
export { NUM_CP007_WAVE02_PROTOTYPE_IDS } from "./types.ts";
export { verifyNumCp007Wave02Package } from "./verifier.ts";

export function generateNumCp007Wave02Package(
  prototypeId: NumCp007Wave02PrototypeId,
  seed = 1,
): NumCp007Wave02Package {
  if (!NUM_CP007_WAVE02_PROTOTYPE_IDS.includes(prototypeId)) {
    throw new Error(`Unknown Wave 02 prototype: ${prototypeId}`);
  }
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Seed must be a positive integer: ${seed}`);
  }
  const suffix = Number(prototypeId.slice(-3));
  const rng = createRng(seed * 1013 + suffix * 7919);
  return WAVE02_GENERATORS[prototypeId](seed, rng);
}
