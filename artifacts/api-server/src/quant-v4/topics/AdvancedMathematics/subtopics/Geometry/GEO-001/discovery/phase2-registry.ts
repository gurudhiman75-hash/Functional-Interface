import { GEO_CP_004_PHASE2_PROTOTYPES } from "../GEO-CP-004/prototypes";
import { GEO_CP_005_PHASE2_PROTOTYPES } from "../GEO-CP-005/prototypes";
import { GEO_CP_006_PHASE2_PROTOTYPES } from "../GEO-CP-006/prototypes";
import type { Phase2PrototypeDefinition } from "./phase2-types";

export const GEO_PHASE2_TEMPORARY_PROTOTYPES: readonly Phase2PrototypeDefinition[] = Object.freeze([
  ...GEO_CP_004_PHASE2_PROTOTYPES,
  ...GEO_CP_005_PHASE2_PROTOTYPES,
  ...GEO_CP_006_PHASE2_PROTOTYPES,
]);

export const GEO_PHASE2_TEMPORARY_PROTOTYPE_IDS = Object.freeze(
  GEO_PHASE2_TEMPORARY_PROTOTYPES.map((prototype) => prototype.temporaryPrototypeId),
);

export function getPhase2Prototype(temporaryPrototypeId: string): Phase2PrototypeDefinition {
  const prototype = GEO_PHASE2_TEMPORARY_PROTOTYPES.find(
    (candidate) => candidate.temporaryPrototypeId === temporaryPrototypeId,
  );
  if (!prototype) throw new Error(`Unknown Geometry Phase-2 temporary prototype: ${temporaryPrototypeId}`);
  return prototype;
}
