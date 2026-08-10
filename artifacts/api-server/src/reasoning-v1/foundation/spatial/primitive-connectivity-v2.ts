import type {
  SpatialPrimitiveConnectivityV2,
  SpatialPrimitiveIdV2,
} from "./primitive-types";

const ZERO: SpatialPrimitiveConnectivityV2 = {
  junctionCount: 0,
  crossingCount: 0,
};

const CONNECTIVITY_BY_ID: Readonly<
  Record<SpatialPrimitiveIdV2, SpatialPrimitiveConnectivityV2>
> = {
  CIRCLE: ZERO,
  TRIANGLE: ZERO,
  SQUARE: ZERO,
  RECTANGLE: ZERO,
  DIAMOND: ZERO,
  PENTAGON: ZERO,
  HEXAGON: ZERO,
  TRAPEZIUM: ZERO,
  SEMICIRCLE: ZERO,
  L_SHAPE: ZERO,
  T_SHAPE: { junctionCount: 1, crossingCount: 0 },
  V_SHAPE: ZERO,
  U_SHAPE: ZERO,
  Z_SHAPE: ZERO,
  CHEVRON_RIGHT: ZERO,
  ZIGZAG: ZERO,
  PLUS: { junctionCount: 1, crossingCount: 1 },
  X_CROSS: { junctionCount: 1, crossingCount: 1 },
  PARALLEL_PAIR: ZERO,
  TRIPLE_PARALLEL: ZERO,
  THREE_SPOKE: { junctionCount: 1, crossingCount: 0 },
  SIX_SPOKE: { junctionCount: 1, crossingCount: 1 },
  ARROW_RIGHT: { junctionCount: 1, crossingCount: 0 },
  SQUARE_DIAGONAL_DIVIDED: ZERO,
  SQUARE_CROSS_DIVIDED: { junctionCount: 1, crossingCount: 1 },
  CIRCLE_DIAMETER: ZERO,
  CIRCLE_CROSS_DIVIDED: { junctionCount: 1, crossingCount: 1 },
  TRIANGLE_MEDIAN_DIVIDED: ZERO,
  DOT: ZERO,
  RING: ZERO,
  TICK_DIAGONAL: ZERO,
  SMALL_CROSS: { junctionCount: 1, crossingCount: 1 },
  FOUR_POINT_STAR: ZERO,
};

export function getSpatialPrimitiveConnectivityV2(
  primitiveId: SpatialPrimitiveIdV2,
): SpatialPrimitiveConnectivityV2 {
  const value = CONNECTIVITY_BY_ID[primitiveId];
  return { ...value };
}
