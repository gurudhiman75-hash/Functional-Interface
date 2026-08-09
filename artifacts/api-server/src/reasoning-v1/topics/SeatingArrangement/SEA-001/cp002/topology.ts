import type { MixedFacingDirection, MixedPersonId, MixedRelativeDirection } from "./types.ts";

export class MixedFacingRowTopology {
  readonly seatCount: number;
  constructor(seatCount: number) {
    if (!Number.isInteger(seatCount) || seatCount < 2) throw new Error(`Invalid row seat count: ${seatCount}`);
    this.seatCount = seatCount;
  }

  moveRelative(referenceSeat: number, referenceFacing: MixedFacingDirection, direction: MixedRelativeDirection, steps: number): number | null {
    if (!Number.isInteger(steps) || steps < 1) throw new Error(`Invalid relative steps: ${steps}`);
    const observerDelta = referenceFacing === "NORTH"
      ? (direction === "LEFT" ? -steps : steps)
      : (direction === "LEFT" ? steps : -steps);
    const target = referenceSeat + observerDelta;
    return target >= 0 && target < this.seatCount ? target : null;
  }

  adjacent(firstSeat: number, secondSeat: number): boolean { return Math.abs(firstSeat - secondSeat) === 1; }
  countBetween(firstSeat: number, secondSeat: number): number { return Math.max(0, Math.abs(firstSeat - secondSeat) - 1); }
  isEnd(seatIndex: number): boolean { return seatIndex === 0 || seatIndex === this.seatCount - 1; }
}

export function seatIndexOf(order: readonly MixedPersonId[], personId: MixedPersonId): number {
  const index = order.indexOf(personId);
  if (index < 0) throw new Error(`Unknown person: ${personId}`);
  return index;
}

export function personAt(order: readonly MixedPersonId[], seatIndex: number): MixedPersonId {
  const person = order[seatIndex];
  if (!person) throw new Error(`No person at seat ${seatIndex}`);
  return person;
}

export function mixedFacingModelKey(
  order: readonly MixedPersonId[],
  facings: Readonly<Record<MixedPersonId, MixedFacingDirection>>,
): string {
  return `${order.join(">")}|${[...order].sort().map((personId) => `${personId}:${facings[personId]}`).join(",")}`;
}
