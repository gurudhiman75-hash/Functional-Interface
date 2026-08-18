import { GEO_CP_014_PHASE5_PROTOTYPES } from "../GEO-CP-014/prototypes";
import type { Phase5PrototypeDefinition } from "./phase5-types";

export const GEO_PHASE5_TEMPORARY_PROTOTYPES: readonly Phase5PrototypeDefinition[] = Object.freeze([...GEO_CP_014_PHASE5_PROTOTYPES]);
export const GEO_PHASE5_TEMPORARY_PROTOTYPE_IDS = Object.freeze(GEO_PHASE5_TEMPORARY_PROTOTYPES.map((prototype) => prototype.temporaryPrototypeId));

export function getPhase5Prototype(temporaryPrototypeId: string): Phase5PrototypeDefinition {
  const prototype = GEO_PHASE5_TEMPORARY_PROTOTYPES.find((candidate) => candidate.temporaryPrototypeId === temporaryPrototypeId);
  if (!prototype) throw new Error(`Unknown Geometry Phase-5 temporary prototype: ${temporaryPrototypeId}`);
  return prototype;
}
