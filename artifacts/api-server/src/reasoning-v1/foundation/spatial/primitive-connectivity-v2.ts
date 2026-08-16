import type {
  SpatialPrimitiveConnectivityV2,
  SpatialPrimitiveIdV2,
} from "./primitive-types";

const ZERO: SpatialPrimitiveConnectivityV2 = {
  junctionCount: 0,
  crossingCount: 0,
  terminalCount: 0,
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
  L_SHAPE: { junctionCount: 0, crossingCount: 0, terminalCount: 2 },
  T_SHAPE: { junctionCount: 1, crossingCount: 0, terminalCount: 3 },
  V_SHAPE: { junctionCount: 0, crossingCount: 0, terminalCount: 2 },
  U_SHAPE: { junctionCount: 0, crossingCount: 0, terminalCount: 2 },
  Z_SHAPE: { junctionCount: 0, crossingCount: 0, terminalCount: 2 },
  CHEVRON_RIGHT: { junctionCount: 0, crossingCount: 0, terminalCount: 2 },
  ZIGZAG: { junctionCount: 0, crossingCount: 0, terminalCount: 2 },
  PLUS: { junctionCount: 1, crossingCount: 1, terminalCount: 4 },
  X_CROSS: { junctionCount: 1, crossingCount: 1, terminalCount: 4 },
  PARALLEL_PAIR: { junctionCount: 0, crossingCount: 0, terminalCount: 4 },
  TRIPLE_PARALLEL: { junctionCount: 0, crossingCount: 0, terminalCount: 6 },
  THREE_SPOKE: { junctionCount: 1, crossingCount: 0, terminalCount: 3 },
  SIX_SPOKE: { junctionCount: 1, crossingCount: 1, terminalCount: 6 },
  ARROW_RIGHT: { junctionCount: 1, crossingCount: 0, terminalCount: 3 },
  SQUARE_DIAGONAL_DIVIDED: ZERO,
  SQUARE_CROSS_DIVIDED: { junctionCount: 1, crossingCount: 1, terminalCount: 0 },
  CIRCLE_DIAMETER: ZERO,
  CIRCLE_CROSS_DIVIDED: { junctionCount: 1, crossingCount: 1, terminalCount: 0 },
  TRIANGLE_MEDIAN_DIVIDED: ZERO,
  DOT: ZERO,
  RING: ZERO,
  TICK_DIAGONAL: { junctionCount: 0, crossingCount: 0, terminalCount: 2 },
  SMALL_CROSS: { junctionCount: 1, crossingCount: 1, terminalCount: 4 },
  FOUR_POINT_STAR: ZERO,
};

export function getSpatialPrimitiveConnectivityV2(
  primitiveId: SpatialPrimitiveIdV2,
): SpatialPrimitiveConnectivityV2 {
  const value = CONNECTIVITY_BY_ID[primitiveId];
  return { ...value };
}
