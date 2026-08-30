import { GEO_CP_014_CHORD_PYTHAGORAS_PHASE5_PROTOTYPE } from "./chord-pythagoras";
import { GEO_CP_014_CYCLIC_ISOSCELES_PHASE5_PROTOTYPE } from "./cyclic-isosceles";
import { GEO_CP_014_TANGENT_TRIANGLE_PHASE5_PROTOTYPE } from "./tangent-triangle";
import { GEO_CP_014_BPT_BISECTOR_PHASE5_PROTOTYPE } from "./bpt-bisector";
import type { Phase5PrototypeDefinition } from "../discovery/phase5-types";

export const GEO_CP_014_PHASE5_PROTOTYPES: readonly Phase5PrototypeDefinition[] = Object.freeze([
  GEO_CP_014_CHORD_PYTHAGORAS_PHASE5_PROTOTYPE,
  GEO_CP_014_CYCLIC_ISOSCELES_PHASE5_PROTOTYPE,
  GEO_CP_014_TANGENT_TRIANGLE_PHASE5_PROTOTYPE,
  GEO_CP_014_BPT_BISECTOR_PHASE5_PROTOTYPE,
]);
