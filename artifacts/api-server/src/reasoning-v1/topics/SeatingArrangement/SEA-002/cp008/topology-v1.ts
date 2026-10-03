export type Sea002Cp008SquareSchema =
  | "ALT8_CORNERS_MIDDLES"
  | "SIDEPAIR8"
  | "ALT12_CORNER_PLUS_TWO_SIDE";

export type Sea002Cp008SeatRole = "CORNER" | "SIDE";
export type Sea002Cp008Facing = "IN" | "OUT";
export type Sea002Cp008RelativeDirection = "LEFT" | "RIGHT";

export type Sea002Cp008Seat = Readonly<{
  index: number;
  role: Sea002Cp008SeatRole;
  side: 0 | 1 | 2 | 3;
  sideSlot: number | null;
  corner: 0 | 1 | 2 | 3 | null;
}>;

export function squareSeatCount(schema: Sea002Cp008SquareSchema): 8 | 12 {
  return schema === "ALT12_CORNER_PLUS_TWO_SIDE" ? 12 : 8;
}

export function squareQuarterSpan(schema: Sea002Cp008SquareSchema): 2 | 3 {
  return schema === "ALT12_CORNER_PLUS_TWO_SIDE" ? 3 : 2;
}

export function squareSeat(schema: Sea002Cp008SquareSchema, rawIndex: number): Sea002Cp008Seat {
  const count = squareSeatCount(schema);
  const index = ((rawIndex % count) + count) % count;
  if (schema === "SIDEPAIR8") {
    const side = Math.floor(index / 2) as 0 | 1 | 2 | 3;
    return Object.freeze({ index, role: "SIDE" as const, side, sideSlot: index % 2, corner: null });
  }
  const quarter = squareQuarterSpan(schema);
  const withinQuarter = index % quarter;
  const side = Math.floor(index / quarter) as 0 | 1 | 2 | 3;
  if (withinQuarter === 0) {
    return Object.freeze({ index, role: "CORNER" as const, side, sideSlot: null, corner: side });
  }
  return Object.freeze({ index, role: "SIDE" as const, side, sideSlot: withinQuarter - 1, corner: null });
}

export function squareSeats(schema: Sea002Cp008SquareSchema): readonly Sea002Cp008Seat[] {
  return Object.freeze(Array.from({ length: squareSeatCount(schema) }, (_, index) => squareSeat(schema, index)));
}

export function squareOppositeIndex(schema: Sea002Cp008SquareSchema, index: number): number {
  const count = squareSeatCount(schema);
  return (squareSeat(schema, index).index + count / 2) % count;
}

export function squareRotateQuarterIndex(schema: Sea002Cp008SquareSchema, index: number, quarterTurns = 1): number {
  const count = squareSeatCount(schema);
  const step = squareQuarterSpan(schema);
  return ((squareSeat(schema, index).index + quarterTurns * step) % count + count) % count;
}

export function squareRoleFacing(
  role: Sea002Cp008SeatRole,
  mode: "CORNERS_IN_SIDES_OUT" | "CORNERS_OUT_SIDES_IN",
): Sea002Cp008Facing {
  if (mode === "CORNERS_IN_SIDES_OUT") return role === "CORNER" ? "IN" : "OUT";
  return role === "CORNER" ? "OUT" : "IN";
}

export function squareRelativeIndex(
  schema: Sea002Cp008SquareSchema,
  referenceIndex: number,
  facing: Sea002Cp008Facing,
  direction: Sea002Cp008RelativeDirection,
  steps: number,
): number {
  if (!Number.isInteger(steps) || steps < 0) throw new Error("Square relative steps must be a non-negative integer.");
  const count = squareSeatCount(schema);
  const clockwiseSign = direction === "RIGHT"
    ? (facing === "OUT" ? 1 : -1)
    : (facing === "OUT" ? -1 : 1);
  const start = squareSeat(schema, referenceIndex).index;
  return ((start + clockwiseSign * steps) % count + count) % count;
}

export function squareClockwiseDistance(schema: Sea002Cp008SquareSchema, from: number, to: number): number {
  const count = squareSeatCount(schema);
  return (squareSeat(schema, to).index - squareSeat(schema, from).index + count) % count;
}

export function squareSameSide(schema: Sea002Cp008SquareSchema, a: number, b: number): boolean {
  const left = squareSeat(schema, a);
  const right = squareSeat(schema, b);
  return left.role === "SIDE" && right.role === "SIDE" && left.side === right.side;
}

export function squareTopologyFingerprint(schema: Sea002Cp008SquareSchema): string {
  return JSON.stringify(squareSeats(schema).map((seat) => [seat.index, seat.role, seat.side, seat.sideSlot, seat.corner]));
}
