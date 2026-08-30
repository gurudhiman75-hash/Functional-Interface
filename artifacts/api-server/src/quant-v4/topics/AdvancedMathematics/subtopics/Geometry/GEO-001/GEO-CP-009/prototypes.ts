import { GEO_CP_009_ANGLE_PHASE3_PROTOTYPES } from "./angle-prototypes";
import { GEO_CP_009_DIAGONAL_PHASE3_PROTOTYPES } from "./diagonal-prototype";
import type { Phase3PrototypeDefinition } from "../discovery/phase3-types";

export const GEO_CP_009_PHASE3_PROTOTYPES: readonly Phase3PrototypeDefinition[] = Object.freeze([
  ...GEO_CP_009_ANGLE_PHASE3_PROTOTYPES,
  ...GEO_CP_009_DIAGONAL_PHASE3_PROTOTYPES,
]);
