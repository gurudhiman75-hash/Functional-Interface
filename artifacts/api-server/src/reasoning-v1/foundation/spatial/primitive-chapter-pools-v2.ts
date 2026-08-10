import { SPATIAL_PRIMITIVE_AUTHORITY_V2 } from "./primitive-library-v2";
import type { SpatialPrimitiveAuthorityEntryV2, SpatialPrimitiveIdV2 } from "./primitive-types";

export const SPATIAL_MIRROR_WATER_PRIMITIVE_POOL_V2: readonly SpatialPrimitiveIdV2[] = [
  "TRIANGLE",
  "PENTAGON",
  "TRAPEZIUM",
  "SEMICIRCLE",
  "L_SHAPE",
  "T_SHAPE",
  "V_SHAPE",
  "U_SHAPE",
  "Z_SHAPE",
  "CHEVRON_RIGHT",
  "ZIGZAG",
  "THREE_SPOKE",
  "SIX_SPOKE",
  "ARROW_RIGHT",
  "SQUARE_DIAGONAL_DIVIDED",
  "TRIANGLE_MEDIAN_DIVIDED",
  "TICK_DIAGONAL",
] as const;

export const SPATIAL_FAN_PRIMITIVE_POOL_V2: readonly SpatialPrimitiveIdV2[] = [
  "TRIANGLE",
  "RECTANGLE",
  "PENTAGON",
  "HEXAGON",
  "TRAPEZIUM",
  "SEMICIRCLE",
  "L_SHAPE",
  "T_SHAPE",
  "V_SHAPE",
  "U_SHAPE",
  "Z_SHAPE",
  "CHEVRON_RIGHT",
  "ZIGZAG",
  "THREE_SPOKE",
  "SIX_SPOKE",
  "ARROW_RIGHT",
  "SQUARE_DIAGONAL_DIVIDED",
  "TRIANGLE_MEDIAN_DIVIDED",
] as const;

export const SPATIAL_FCL_PRIMITIVE_POOL_V2: readonly SpatialPrimitiveIdV2[] =
  SPATIAL_PRIMITIVE_AUTHORITY_V2.map((entry) => entry.primitiveId);

export function spatialPrimitivePoolEntriesV2(
  ids: readonly SpatialPrimitiveIdV2[],
): SpatialPrimitiveAuthorityEntryV2[] {
  const allowed = new Set(ids);
  return SPATIAL_PRIMITIVE_AUTHORITY_V2.filter((entry) => allowed.has(entry.primitiveId));
}

export function validateSpatialChapterPrimitivePoolsV2(): string[] {
  const errors: string[] = [];
  const known = new Set(SPATIAL_PRIMITIVE_AUTHORITY_V2.map((entry) => entry.primitiveId));
  for (const [name, ids] of [
    ["MIR_WAT", SPATIAL_MIRROR_WATER_PRIMITIVE_POOL_V2],
    ["FAN", SPATIAL_FAN_PRIMITIVE_POOL_V2],
    ["FCL", SPATIAL_FCL_PRIMITIVE_POOL_V2],
  ] as const) {
    if (new Set(ids).size !== ids.length) errors.push(`${name}: duplicate primitive ID.`);
    for (const id of ids) if (!known.has(id)) errors.push(`${name}: unknown primitive '${id}'.`);
  }
  if (SPATIAL_MIRROR_WATER_PRIMITIVE_POOL_V2.length < 12) {
    errors.push("MIR/WAT V2 pool must expose at least 12 primitives.");
  }
  if (SPATIAL_FAN_PRIMITIVE_POOL_V2.length < 12) {
    errors.push("FAN V2 pool must expose at least 12 primitives.");
  }
  if (SPATIAL_FCL_PRIMITIVE_POOL_V2.length !== SPATIAL_PRIMITIVE_AUTHORITY_V2.length) {
    errors.push("FCL V2 pool must expose the full primitive authority.");
  }
  return errors;
}
