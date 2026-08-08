import { createRng } from "./core.ts";
import { commonAlignment, greatestMeasure, missingNumber, validPair } from "./generators-applied.ts";
import { hcfThree, hcfTwo, lcmThree, lcmTwo } from "./generators-direct.ts";
import { NUM_CP006_WAVE01_PROTOTYPE_IDS, type NumCp006Wave01Package, type NumCp006Wave01PrototypeId } from "./types.ts";
export { NUM_CP006_WAVE01_PROTOTYPE_REGISTRY } from "./registry.ts";
export { NUM_CP006_WAVE01_PROTOTYPE_IDS } from "./types.ts";
export function generateNumCp006Wave01Package(prototypeId: NumCp006Wave01PrototypeId, seed = 1): NumCp006Wave01Package {
  if (!NUM_CP006_WAVE01_PROTOTYPE_IDS.includes(prototypeId)) throw new Error(`Unknown prototype: ${prototypeId}`);
  if (!Number.isInteger(seed) || seed <= 0) throw new Error(`Seed must be positive: ${seed}`);
  const rng = createRng(seed * 1009 + Number(prototypeId.slice(-3)) * 7919);
  switch (prototypeId) {
    case "NUM-CP006-PROT-001": return hcfTwo(seed,rng); case "NUM-CP006-PROT-002": return lcmTwo(seed,rng);
    case "NUM-CP006-PROT-003": return hcfThree(seed,rng); case "NUM-CP006-PROT-004": return lcmThree(seed,rng);
    case "NUM-CP006-PROT-005": return missingNumber(seed,rng); case "NUM-CP006-PROT-006": return validPair(seed,rng);
    case "NUM-CP006-PROT-007": return greatestMeasure(seed,rng); case "NUM-CP006-PROT-008": return commonAlignment(seed,rng);
  }
}
