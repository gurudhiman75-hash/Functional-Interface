import type { CyclicDirection, PersonId, RelativeDirection } from "./types.ts";

export function mod(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

export class CircularTopology {
  readonly seatCount: number;

  constructor(seatCount: number) {
    if (!Number.isInteger(seatCount) || seatCount < 3) throw new Error(`Invalid circular seat count: ${seatCount}`);
    this.seatCount = seatCount;
  }

  moveCyclic(seatIndex: number, direction: CyclicDirection, steps: number): number {
    if (!Number.isInteger(steps) || steps < 0) throw new Error(`Invalid cyclic step count: ${steps}`);
    return mod(seatIndex + (direction === "CLOCKWISE" ? steps : -steps), this.seatCount);
  }

  moveRelativeCentre(seatIndex: number, direction: RelativeDirection, steps: number): number {
    // Facing centre: left is clockwise and right is anticlockwise.
    return this.moveCyclic(seatIndex, direction === "LEFT" ? "CLOCKWISE" : "ANTICLOCKWISE", steps);
  }

  adjacentSeatIndices(seatIndex: number): readonly [number, number] {
    return [this.moveCyclic(seatIndex, "ANTICLOCKWISE", 1), this.moveCyclic(seatIndex, "CLOCKWISE", 1)];
  }

  oppositeSeatIndex(seatIndex: number): number | null {
    if (this.seatCount % 2 !== 0) return null;
    return this.moveCyclic(seatIndex, "CLOCKWISE", this.seatCount / 2);
  }

  countBetween(firstSeatIndex: number, secondSeatIndex: number, direction: CyclicDirection): number {
    const distance = direction === "CLOCKWISE"
      ? mod(secondSeatIndex - firstSeatIndex, this.seatCount)
      : mod(firstSeatIndex - secondSeatIndex, this.seatCount);
    return Math.max(0, distance - 1);
  }
}

export function rotateOrder<T>(order: readonly T[], offset: number): T[] {
  if (order.length === 0) return [];
  const normalised = mod(offset, order.length);
  return [...order.slice(normalised), ...order.slice(0, normalised)];
}

export function canonicalCircularOrder(
  clockwiseOrder: readonly PersonId[],
  landmarkAnchored: boolean,
): readonly PersonId[] {
  if (clockwiseOrder.length === 0) throw new Error("Cannot canonicalise an empty circle");
  if (landmarkAnchored) return [...clockwiseOrder];

  let best = rotateOrder(clockwiseOrder, 0);
  let bestKey = best.join("|");
  for (let offset = 1; offset < clockwiseOrder.length; offset += 1) {
    const candidate = rotateOrder(clockwiseOrder, offset);
    const key = candidate.join("|");
    if (key < bestKey) {
      best = candidate;
      bestKey = key;
    }
  }
  return best;
}

export function circularCanonicalKey(clockwiseOrder: readonly PersonId[], landmarkAnchored: boolean): string {
  return canonicalCircularOrder(clockwiseOrder, landmarkAnchored).join("|");
}

export function seatIndexOf(clockwiseOrder: readonly PersonId[], personId: PersonId): number {
  const index = clockwiseOrder.indexOf(personId);
  if (index < 0) throw new Error(`Unknown person in circular order: ${personId}`);
  return index;
}

export function personAt(clockwiseOrder: readonly PersonId[], seatIndex: number): PersonId {
  const person = clockwiseOrder[mod(seatIndex, clockwiseOrder.length)];
  if (person === undefined) throw new Error(`No person at circular seat index ${seatIndex}`);
  return person;
}
