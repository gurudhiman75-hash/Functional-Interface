import { GEO_CP_001_PHASE1_PROTOTYPES } from "../GEO-CP-001/prototypes";
import { GEO_CP_002_PHASE1_PROTOTYPES } from "../GEO-CP-002/prototypes";
import { GEO_CP_003_PHASE1_PROTOTYPES } from "../GEO-CP-003/prototypes";
import type { Phase1PrototypeDefinition } from "./phase1-types";

export const GEO_PHASE1_TEMPORARY_PROTOTYPES: readonly Phase1PrototypeDefinition[] = Object.freeze([
  ...GEO_CP_001_PHASE1_PROTOTYPES,
  ...GEO_CP_002_PHASE1_PROTOTYPES,
  ...GEO_CP_003_PHASE1_PROTOTYPES,
]);

export const GEO_PHASE1_TEMPORARY_PROTOTYPE_IDS = Object.freeze(
  GEO_PHASE1_TEMPORARY_PROTOTYPES.map((prototype) => prototype.temporaryPrototypeId),
);

export function getPhase1Prototype(temporaryPrototypeId: string): Phase1PrototypeDefinition {
  const prototype = GEO_PHASE1_TEMPORARY_PROTOTYPES.find(
    (candidate) => candidate.temporaryPrototypeId === temporaryPrototypeId,
  );
  if (!prototype) throw new Error(`Unknown Geometry Phase-1 temporary prototype: ${temporaryPrototypeId}`);
  return prototype;
}
