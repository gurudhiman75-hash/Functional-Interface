import type { Sea002Cp008Facing, Sea002Cp008RelativeDirection } from "./topology-v1.ts";

export type Sea002Cp008VariableSide6Seat = Readonly<{
  index: 0 | 1 | 2 | 3 | 4 | 5;
  side: 0 | 1 | 2 | 3;
  sideSlot: 0 | 1;
  occupancyKind: "SINGLE" | "PAIRED";
}>;

const SEATS: readonly Sea002Cp008VariableSide6Seat[] = Object.freeze([
  Object.freeze({ index: 0, side: 0, sideSlot: 0, occupancyKind: "SINGLE" }),
  Object.freeze({ index: 1, side: 1, sideSlot: 0, occupancyKind: "PAIRED" }),
  Object.freeze({ index: 2, side: 1, sideSlot: 1, occupancyKind: "PAIRED" }),
  Object.freeze({ index: 3, side: 2, sideSlot: 0, occupancyKind: "SINGLE" }),
  Object.freeze({ index: 4, side: 3, sideSlot: 0, occupancyKind: "PAIRED" }),
  Object.freeze({ index: 5, side: 3, sideSlot: 1, occupancyKind: "PAIRED" }),
]);

export function variableSide6Seats(): readonly Sea002Cp008VariableSide6Seat[] {
  return SEATS;
}

export function variableSide6Seat(rawIndex: number): Sea002Cp008VariableSide6Seat {
  const index = ((rawIndex % 6) + 6) % 6;
  return SEATS[index]!;
}

export function variableSide6OppositeIndex(rawIndex: number): number {
  return (variableSide6Seat(rawIndex).index + 3) % 6;
}

export function variableSide6SameSide(a: number, b: number): boolean {
  return variableSide6Seat(a).side === variableSide6Seat(b).side;
}

export function variableSide6RelativeIndex(
  referenceIndex: number,
  facing: Sea002Cp008Facing,
  direction: Sea002Cp008RelativeDirection,
  steps: number,
): number {
  if (!Number.isInteger(steps) || steps < 0) throw new Error("Variable-side square steps must be a non-negative integer.");
  const clockwiseSign = direction === "RIGHT"
    ? (facing === "OUT" ? 1 : -1)
    : (facing === "OUT" ? -1 : 1);
  return ((variableSide6Seat(referenceIndex).index + clockwiseSign * steps) % 6 + 6) % 6;
}

export const SEA002_CP008_VARIABLE_SIDE6_SYMMETRY = Object.freeze({
  legitimateRotationShifts: Object.freeze([0, 3] as const),
  rotationalSymmetryDegrees: 180 as const,
  rationale: "The 1-2-1-2 side occupancy pattern repeats only after a half-turn; a 90-degree rotation swaps single and paired sides.",
});
