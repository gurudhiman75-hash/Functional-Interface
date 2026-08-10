import type { SpatialScene, SpatialSymmetryProfile } from "./types";

export const SPATIAL_PRIMITIVE_AUTHORITY_VERSION_V2 = "2.0" as const;

export type SpatialPrimitiveAuthorityVersionV2 =
  typeof SPATIAL_PRIMITIVE_AUTHORITY_VERSION_V2;

export type SpatialPrimitiveCategory =
  | "CLOSED_SHAPE"
  | "OPEN_FIGURE"
  | "LINE_STRUCTURE"
  | "PARTITIONED_FIGURE"
  | "INTERNAL_SYMBOL";

export type SpatialPrimitiveTopology =
  | "CLOSED"
  | "OPEN"
  | "COMPOSITE"
  | "POINT";

export type SpatialPrimitiveUsageRole =
  | "OUTER_CONTAINER"
  | "INNER_OBJECT"
  | "COUNTABLE_SYMBOL"
  | "ROTATION_STIMULUS"
  | "REFLECTION_STIMULUS"
  | "PARTITION_STIMULUS";

export type SpatialPrimitiveQuarterTurnPeriod = 1 | 2 | 4;

export type SpatialPrimitiveIdV2 =
  | "CIRCLE"
  | "TRIANGLE"
  | "SQUARE"
  | "RECTANGLE"
  | "DIAMOND"
  | "PENTAGON"
  | "HEXAGON"
  | "TRAPEZIUM"
  | "SEMICIRCLE"
  | "L_SHAPE"
  | "T_SHAPE"
  | "V_SHAPE"
  | "U_SHAPE"
  | "Z_SHAPE"
  | "CHEVRON_RIGHT"
  | "ZIGZAG"
  | "PLUS"
  | "X_CROSS"
  | "PARALLEL_PAIR"
  | "TRIPLE_PARALLEL"
  | "THREE_SPOKE"
  | "SIX_SPOKE"
  | "ARROW_RIGHT"
  | "SQUARE_DIAGONAL_DIVIDED"
  | "SQUARE_CROSS_DIVIDED"
  | "CIRCLE_DIAMETER"
  | "CIRCLE_CROSS_DIVIDED"
  | "TRIANGLE_MEDIAN_DIVIDED"
  | "DOT"
  | "RING"
  | "TICK_DIAGONAL"
  | "SMALL_CROSS"
  | "FOUR_POINT_STAR";

export interface SpatialPrimitiveConnectivityV2 {
  /** Distinct interior points where two or more strokes meet. */
  junctionCount: number;
  /** Junctions where at least two strokes continue through the meeting point. */
  crossingCount: number;
}

export interface SpatialPrimitiveAuthorityEntryV2 {
  primitiveId: SpatialPrimitiveIdV2;
  label: string;
  category: SpatialPrimitiveCategory;
  topology: SpatialPrimitiveTopology;
  polygonSideCount: number | null;
  enclosedRegionCount: number;
  /**
   * Legacy proof field retained inside V2 entries for compatibility.
   * It represents interior meeting points and must not be used to distinguish
   * true crossings from T/Y/arrow junctions. Use getSpatialPrimitiveConnectivityV2.
   */
  interiorIntersectionCount: number;
  orientationSensitive: boolean;
  /** Standard-axis (vertical/horizontal) reflection sensitivity. */
  reflectionSensitive: boolean;
  rotationPeriodQuarterTurns: SpatialPrimitiveQuarterTurnPeriod;
  symmetry: SpatialSymmetryProfile;
  canContainInner: boolean;
  supportsFill: boolean;
  usageRoles: readonly SpatialPrimitiveUsageRole[];
  examTags: readonly string[];
  authorityVersion: SpatialPrimitiveAuthorityVersionV2;
  canonicalScene: SpatialScene;
}

export interface SpatialPrimitiveValidationIssueV2 {
  primitiveId: SpatialPrimitiveIdV2;
  code: string;
  message: string;
}

export interface SpatialPrimitiveValidationResultV2 {
  ok: boolean;
  errors: SpatialPrimitiveValidationIssueV2[];
}
