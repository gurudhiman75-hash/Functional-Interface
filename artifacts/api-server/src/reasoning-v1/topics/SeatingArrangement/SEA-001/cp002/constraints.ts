import { MixedFacingRowTopology } from "./topology.ts";
import type {
  MixedFacingConstraint,
  MixedFacingDirection,
  MixedPersonId,
} from "./types.ts";

export type MixedConstraintVerdict = "SATISFIED" | "VIOLATED" | "UNDECIDED";
export type MixedPlacement = ReadonlyMap<MixedPersonId, number>;
export type MixedFacings = ReadonlyMap<MixedPersonId, MixedFacingDirection>;

function occupantAt(placement: MixedPlacement, seatIndex: number): MixedPersonId | undefined {
  for (const [personId, assignedSeat] of placement) if (assignedSeat === seatIndex) return personId;
  return undefined;
}

function targetAvailable(placement: MixedPlacement, targetSeat: number, personId: MixedPersonId): boolean {
  const occupant = occupantAt(placement, targetSeat);
  return occupant === undefined || occupant === personId;
}

export function evaluateMixedConstraint(
  constraint: MixedFacingConstraint,
  placement: MixedPlacement,
  facings: MixedFacings,
  topology: MixedFacingRowTopology,
): MixedConstraintVerdict {
  switch (constraint.kind) {
    case "ABSOLUTE_SEAT": {
      const seat = placement.get(constraint.personId);
      if (seat !== undefined) return seat === constraint.seatIndex ? "SATISFIED" : "VIOLATED";
      return targetAvailable(placement, constraint.seatIndex, constraint.personId) ? "UNDECIDED" : "VIOLATED";
    }
    case "AT_END": {
      const seat = placement.get(constraint.personId);
      if (seat !== undefined) return topology.isEnd(seat) ? "SATISFIED" : "VIOLATED";
      const first = occupantAt(placement, 0);
      const last = occupantAt(placement, topology.seatCount - 1);
      return first !== undefined && first !== constraint.personId && last !== undefined && last !== constraint.personId
        ? "VIOLATED" : "UNDECIDED";
    }
    case "FACING": {
      const facing = facings.get(constraint.personId);
      return facing === undefined ? "UNDECIDED" : facing === constraint.facing ? "SATISFIED" : "VIOLATED";
    }
    case "SAME_FACING": {
      const first = facings.get(constraint.firstId);
      const second = facings.get(constraint.secondId);
      return first === undefined || second === undefined ? "UNDECIDED" : first === second ? "SATISFIED" : "VIOLATED";
    }
    case "OPPOSITE_FACING": {
      const first = facings.get(constraint.firstId);
      const second = facings.get(constraint.secondId);
      return first === undefined || second === undefined ? "UNDECIDED" : first !== second ? "SATISFIED" : "VIOLATED";
    }
    case "RELATIVE_POSITION": {
      const subjectSeat = placement.get(constraint.subjectId);
      const referenceSeat = placement.get(constraint.referenceId);
      const referenceFacing = facings.get(constraint.referenceId);
      if (referenceSeat !== undefined && referenceFacing !== undefined) {
        const target = topology.moveRelative(referenceSeat, referenceFacing, constraint.direction, constraint.steps);
        if (target === null) return "VIOLATED";
        if (subjectSeat !== undefined) return subjectSeat === target ? "SATISFIED" : "VIOLATED";
        return targetAvailable(placement, target, constraint.subjectId) ? "UNDECIDED" : "VIOLATED";
      }
      if (subjectSeat !== undefined && referenceSeat !== undefined) {
        const possible = (["NORTH", "SOUTH"] as const).some((facing) =>
          topology.moveRelative(referenceSeat, facing, constraint.direction, constraint.steps) === subjectSeat);
        return possible ? "UNDECIDED" : "VIOLATED";
      }
      return "UNDECIDED";
    }
    case "ADJACENT": {
      const first = placement.get(constraint.firstId);
      const second = placement.get(constraint.secondId);
      if (first !== undefined && second !== undefined) return topology.adjacent(first, second) ? "SATISFIED" : "VIOLATED";
      const knownSeat = first ?? second;
      const unknownId = first === undefined ? constraint.firstId : constraint.secondId;
      if (knownSeat === undefined) return "UNDECIDED";
      const possibleSeats = [knownSeat - 1, knownSeat + 1].filter((seat) => seat >= 0 && seat < topology.seatCount);
      return possibleSeats.some((seat) => targetAvailable(placement, seat, unknownId)) ? "UNDECIDED" : "VIOLATED";
    }
    case "NOT_ADJACENT": {
      const first = placement.get(constraint.firstId);
      const second = placement.get(constraint.secondId);
      return first === undefined || second === undefined ? "UNDECIDED" : topology.adjacent(first, second) ? "VIOLATED" : "SATISFIED";
    }
    case "EXACT_COUNT_BETWEEN": {
      const first = placement.get(constraint.firstId);
      const second = placement.get(constraint.secondId);
      if (first === undefined || second === undefined) return "UNDECIDED";
      return topology.countBetween(first, second) === constraint.count ? "SATISFIED" : "VIOLATED";
    }
  }
}

function ordinal(steps: number): string {
  if (steps === 1) return "immediately";
  if (steps === 2) return "second";
  if (steps === 3) return "third";
  return `${steps}th`;
}

export function renderMixedConstraint(constraint: MixedFacingConstraint): string {
  switch (constraint.kind) {
    case "ABSOLUTE_SEAT":
      return `${constraint.personId} sits at position ${constraint.seatIndex + 1} from the left end.`;
    case "AT_END":
      return `${constraint.personId} sits at one of the ends.`;
    case "FACING":
      return `${constraint.personId} faces ${constraint.facing.toLowerCase()}.`;
    case "SAME_FACING":
      return `${constraint.firstId} and ${constraint.secondId} face the same direction.`;
    case "OPPOSITE_FACING":
      return `${constraint.firstId} and ${constraint.secondId} face opposite directions.`;
    case "RELATIVE_POSITION":
      return `${constraint.subjectId} sits ${ordinal(constraint.steps)} to the ${constraint.direction.toLowerCase()} of ${constraint.referenceId}.`;
    case "ADJACENT":
      return `${constraint.firstId} sits adjacent to ${constraint.secondId}.`;
    case "NOT_ADJACENT":
      return `${constraint.firstId} does not sit adjacent to ${constraint.secondId}.`;
    case "EXACT_COUNT_BETWEEN":
      return `Exactly ${constraint.count} ${constraint.count === 1 ? "person sits" : "persons sit"} between ${constraint.firstId} and ${constraint.secondId}.`;
  }
}

export function mixedConstraintFingerprint(constraint: MixedFacingConstraint): string {
  switch (constraint.kind) {
    case "ABSOLUTE_SEAT": return `ABS:${constraint.personId}:${constraint.seatIndex}`;
    case "AT_END": return `END:${constraint.personId}`;
    case "FACING": return `FACE:${constraint.personId}:${constraint.facing}`;
    case "SAME_FACING": return `SAME_FACE:${[constraint.firstId, constraint.secondId].sort().join(":")}`;
    case "OPPOSITE_FACING": return `OPP_FACE:${[constraint.firstId, constraint.secondId].sort().join(":")}`;
    case "RELATIVE_POSITION": return `REL:${constraint.subjectId}:${constraint.direction}:${constraint.steps}:${constraint.referenceId}`;
    case "ADJACENT": return `ADJ:${[constraint.firstId, constraint.secondId].sort().join(":")}`;
    case "NOT_ADJACENT": return `NOT_ADJ:${[constraint.firstId, constraint.secondId].sort().join(":")}`;
    case "EXACT_COUNT_BETWEEN": return `BET:${[constraint.firstId, constraint.secondId].sort().join(":")}:${constraint.count}`;
  }
}

export function constraintTrueInMixedState(
  constraint: MixedFacingConstraint,
  order: readonly MixedPersonId[],
  facings: Readonly<Record<MixedPersonId, MixedFacingDirection>>,
): boolean {
  const placement = new Map(order.map((personId, seatIndex) => [personId, seatIndex]));
  const facingMap = new Map(Object.entries(facings) as [MixedPersonId, MixedFacingDirection][]);
  return evaluateMixedConstraint(constraint, placement, facingMap, new MixedFacingRowTopology(order.length)) === "SATISFIED";
}
