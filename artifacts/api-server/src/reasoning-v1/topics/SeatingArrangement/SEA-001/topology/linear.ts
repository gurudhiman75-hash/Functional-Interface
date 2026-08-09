import type { FacingDirection, LinearSeat, RelativeDirection, SeatId } from "../types.ts";

export class LinearTopology {
  readonly kind = "LINEAR_SINGLE_ROW" as const;
  readonly seats: readonly LinearSeat[];

  readonly seatCount: number;

  constructor(seatCount: number) {
    this.seatCount = seatCount;
    if (!Number.isInteger(seatCount) || seatCount < 2) {
      throw new Error(`Linear topology requires at least two seats; received ${seatCount}`);
    }
    this.seats = Array.from({ length: seatCount }, (_, index) => ({
      id: `S${index + 1}`,
      index,
      coordinate: { x: index, y: 0 as const },
      occupancyPolicy: "REQUIRED" as const,
    }));
  }

  seatId(index: number): SeatId {
    const seat = this.seats[index];
    if (!seat) throw new Error(`Seat index ${index} is outside 0..${this.seatCount - 1}`);
    return seat.id;
  }

  indexOf(seatId: SeatId): number {
    const seat = this.seats.find((candidate) => candidate.id === seatId);
    if (!seat) throw new Error(`Unknown seat ${seatId}`);
    return seat.index;
  }

  adjacentSeats(seatId: SeatId): readonly SeatId[] {
    const index = this.indexOf(seatId);
    return [index - 1, index + 1]
      .filter((candidate) => candidate >= 0 && candidate < this.seatCount)
      .map((candidate) => this.seatId(candidate));
  }

  moveRelative(input: {
    readonly seatId: SeatId;
    readonly facing: FacingDirection;
    readonly direction: RelativeDirection;
    readonly steps: number;
  }): SeatId | null {
    if (!Number.isInteger(input.steps) || input.steps < 1) throw new Error("Relative steps must be a positive integer");
    const origin = this.indexOf(input.seatId);
    const visualDelta = input.direction === "RIGHT" ? input.steps : -input.steps;
    const facingDelta = input.facing === "NORTH" ? visualDelta : -visualDelta;
    const target = origin + facingDelta;
    return target >= 0 && target < this.seatCount ? this.seatId(target) : null;
  }

  countBetween(firstSeatId: SeatId, secondSeatId: SeatId): number {
    return Math.max(0, Math.abs(this.indexOf(firstSeatId) - this.indexOf(secondSeatId)) - 1);
  }

  isEnd(seatId: SeatId): boolean {
    const index = this.indexOf(seatId);
    return index === 0 || index === this.seatCount - 1;
  }

  isMiddle(seatId: SeatId): boolean {
    const index = this.indexOf(seatId);
    if (this.seatCount % 2 === 1) return index === Math.floor(this.seatCount / 2);
    return index === this.seatCount / 2 - 1 || index === this.seatCount / 2;
  }
}
