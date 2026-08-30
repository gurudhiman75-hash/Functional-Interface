import { GEO_CP_007_PHASE3_PROTOTYPES } from "../GEO-CP-007/prototypes";
import { GEO_CP_008_PHASE3_PROTOTYPES } from "../GEO-CP-008/prototypes";
import { GEO_CP_009_PHASE3_PROTOTYPES } from "../GEO-CP-009/prototypes";
import type { Phase3PrototypeDefinition } from "./phase3-types";

export const GEO_PHASE3_TEMPORARY_PROTOTYPES: readonly Phase3PrototypeDefinition[] = Object.freeze([
  ...GEO_CP_007_PHASE3_PROTOTYPES,
  ...GEO_CP_008_PHASE3_PROTOTYPES,
  ...GEO_CP_009_PHASE3_PROTOTYPES,
]);

export const GEO_PHASE3_TEMPORARY_PROTOTYPE_IDS = Object.freeze(
  GEO_PHASE3_TEMPORARY_PROTOTYPES.map((prototype) => prototype.temporaryPrototypeId),
);
