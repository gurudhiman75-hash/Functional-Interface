import { GEO_CP_010_PHASE4_PROTOTYPES } from "../GEO-CP-010/prototypes";
import { GEO_CP_011_PHASE4_PROTOTYPES } from "../GEO-CP-011/prototypes";
import { GEO_CP_012_PHASE4_PROTOTYPES } from "../GEO-CP-012/prototypes";
import { GEO_CP_013_PHASE4_PROTOTYPES } from "../GEO-CP-013/prototypes";
import type { Phase4PrototypeDefinition } from "./phase4-types";

export const GEO_PHASE4_TEMPORARY_PROTOTYPES: readonly Phase4PrototypeDefinition[] = Object.freeze([
  ...GEO_CP_010_PHASE4_PROTOTYPES,
  ...GEO_CP_011_PHASE4_PROTOTYPES,
  ...GEO_CP_012_PHASE4_PROTOTYPES,
  ...GEO_CP_013_PHASE4_PROTOTYPES,
]);

export const GEO_PHASE4_TEMPORARY_PROTOTYPE_IDS = Object.freeze(
  GEO_PHASE4_TEMPORARY_PROTOTYPES.map((prototype) => prototype.temporaryPrototypeId),
);

export function getPhase4Prototype(temporaryPrototypeId: string): Phase4PrototypeDefinition {
  const prototype = GEO_PHASE4_TEMPORARY_PROTOTYPES.find((candidate) => candidate.temporaryPrototypeId === temporaryPrototypeId);
  if (!prototype) throw new Error(`Unknown Geometry Phase-4 temporary prototype: ${temporaryPrototypeId}`);
  return prototype;
}
