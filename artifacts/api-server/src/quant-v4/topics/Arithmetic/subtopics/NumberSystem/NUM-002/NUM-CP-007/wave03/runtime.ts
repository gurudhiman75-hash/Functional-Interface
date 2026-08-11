import { createRng } from "./core.ts";
import { WAVE03_GENERATORS } from "./generators.ts";
import { NUM_CP007_WAVE03_PROTOTYPE_IDS } from "./types.ts";
import type {
  NumCp007Wave03Package,
  NumCp007Wave03PrototypeId,
} from "./types.ts";

export { NUM_CP007_WAVE03_PROTOTYPE_REGISTRY } from "./registry.ts";
export { NUM_CP007_WAVE03_PROTOTYPE_IDS } from "./types.ts";
export { verifyNumCp007Wave03Package } from "./verifier.ts";

export function generateNumCp007Wave03Package(
  prototypeId: NumCp007Wave03PrototypeId,
  seed = 1,
): NumCp007Wave03Package {
  if (!NUM_CP007_WAVE03_PROTOTYPE_IDS.includes(prototypeId)) {
    throw new Error(`Unknown Wave 03 prototype: ${prototypeId}`);
  }
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Seed must be a positive integer: ${seed}`);
  }
  const suffix = Number(prototypeId.slice(-3));
  const rng = createRng(seed * 2027 + suffix * 6151);
  return WAVE03_GENERATORS[prototypeId](seed, rng);
}
