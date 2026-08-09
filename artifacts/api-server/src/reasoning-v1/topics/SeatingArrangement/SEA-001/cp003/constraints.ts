import { CircularTopology, mod } from "./topology.ts";
import type { CircularConstraint, PersonId } from "./types.ts";

export type CircularConstraintVerdict = "SATISFIED" | "VIOLATED" | "UNDECIDED";
export type CircularPartialPlacement = ReadonlyMap<PersonId, number>;

function occupantAt(placement: CircularPartialPlacement, seatIndex: number): PersonId | undefined {
  for (const [personId, assignedSeat] of placement) {
    if (assignedSeat === seatIndex) return personId;
  }
  return undefined;
}

function fixedTargetVerdict(
  placement: CircularPartialPlacement,
  subjectId: PersonId,
  targetSeat: number | undefined,
): CircularConstraintVerdict {
  if (targetSeat === undefined) return "UNDECIDED";
  const subjectSeat = placement.get(subjectId);
  if (subjectSeat !== undefined) return subjectSeat === targetSeat ? "SATISFIED" : "VIOLATED";
  const occupant = occupantAt(placement, targetSeat);
  return occupant === undefined || occupant === subjectId ? "UNDECIDED" : "VIOLATED";
}

export function evaluateCircularConstraint(
  constraint: CircularConstraint,
  placement: CircularPartialPlacement,
  topology: CircularTopology,
): CircularConstraintVerdict {
  switch (constraint.kind) {
    case "CYCLIC_POSITION": {
      const referenceSeat = placement.get(constraint.referenceId);
      if (referenceSeat !== undefined) {
        return fixedTargetVerdict(
          placement,
          constraint.subjectId,
          topology.moveCyclic(referenceSeat, constraint.direction, constraint.steps),
        );
      }
      const subjectSeat = placement.get(constraint.subjectId);
      if (subjectSeat === undefined) return "UNDECIDED";
      const requiredReference = topology.moveCyclic(
        subjectSeat,
        constraint.direction === "CLOCKWISE" ? "ANTICLOCKWISE" : "CLOCKWISE",
        constraint.steps,
      );
      return fixedTargetVerdict(placement, constraint.referenceId, requiredReference);
    }
    case "RELATIVE_POSITION": {
      const referenceSeat = placement.get(constraint.referenceId);
      if (referenceSeat !== undefined) {
        return fixedTargetVerdict(
          placement,
          constraint.subjectId,
          topology.moveRelativeCentre(referenceSeat, constraint.direction, constraint.steps),
        );
      }
      const subjectSeat = placement.get(constraint.subjectId);
      if (subjectSeat === undefined) return "UNDECIDED";
      const inverseDirection = constraint.direction === "LEFT" ? "RIGHT" : "LEFT";
      return fixedTargetVerdict(
        placement,
        constraint.referenceId,
        topology.moveRelativeCentre(subjectSeat, inverseDirection, constraint.steps),
      );
    }
    case "ADJACENT": {
      const firstSeat = placement.get(constraint.firstId);
      const secondSeat = placement.get(constraint.secondId);
      if (firstSeat !== undefined && secondSeat !== undefined) {
        return topology.adjacentSeatIndices(firstSeat).includes(secondSeat) ? "SATISFIED" : "VIOLATED";
      }
      const knownSeat = firstSeat ?? secondSeat;
      const unknownId = firstSeat === undefined ? constraint.firstId : constraint.secondId;
      if (knownSeat === undefined) return "UNDECIDED";
      const available = topology.adjacentSeatIndices(knownSeat).some((seat) => {
        const occupant = occupantAt(placement, seat);
        return occupant === undefined || occupant === unknownId;
      });
      return available ? "UNDECIDED" : "VIOLATED";
    }
    case "NOT_ADJACENT": {
      const firstSeat = placement.get(constraint.firstId);
      const secondSeat = placement.get(constraint.secondId);
      if (firstSeat === undefined || secondSeat === undefined) return "UNDECIDED";
      return topology.adjacentSeatIndices(firstSeat).includes(secondSeat) ? "VIOLATED" : "SATISFIED";
    }
    case "OPPOSITE": {
      const firstSeat = placement.get(constraint.firstId);
      const secondSeat = placement.get(constraint.secondId);
      if (topology.seatCount % 2 !== 0) return "VIOLATED";
      if (firstSeat !== undefined) {
        const opposite = topology.oppositeSeatIndex(firstSeat);
        return fixedTargetVerdict(placement, constraint.secondId, opposite ?? undefined);
      }
      if (secondSeat !== undefined) {
        const opposite = topology.oppositeSeatIndex(secondSeat);
        return fixedTargetVerdict(placement, constraint.firstId, opposite ?? undefined);
      }
      return "UNDECIDED";
    }
    case "DIRECTIONAL_COUNT_BETWEEN": {
      const firstSeat = placement.get(constraint.firstId);
      const secondSeat = placement.get(constraint.secondId);
      const steps = constraint.count + 1;
      if (firstSeat !== undefined) {
        return fixedTargetVerdict(
          placement,
          constraint.secondId,
          topology.moveCyclic(firstSeat, constraint.direction, steps),
        );
      }
      if (secondSeat !== undefined) {
        return fixedTargetVerdict(
          placement,
          constraint.firstId,
          topology.moveCyclic(
            secondSeat,
            constraint.direction === "CLOCKWISE" ? "ANTICLOCKWISE" : "CLOCKWISE",
            steps,
          ),
        );
      }
      return "UNDECIDED";
    }
    case "LANDMARK_ANCHOR": {
      const seat = placement.get(constraint.personId);
      return seat === undefined ? "UNDECIDED" : seat === constraint.seatIndex ? "SATISFIED" : "VIOLATED";
    }
  }
}

export function constraintTrueInOrder(constraint: CircularConstraint, clockwiseOrder: readonly PersonId[]): boolean {
  const topology = new CircularTopology(clockwiseOrder.length);
  const placement = new Map<PersonId, number>(clockwiseOrder.map((personId, index) => [personId, index]));
  return evaluateCircularConstraint(constraint, placement, topology) === "SATISFIED";
}

export function circularConstraintFingerprint(constraint: CircularConstraint): string {
  switch (constraint.kind) {
    case "CYCLIC_POSITION":
      return `CYC:${constraint.subjectId}:${constraint.direction}:${constraint.steps}:${constraint.referenceId}`;
    case "RELATIVE_POSITION": {
      const cyclicDirection = constraint.direction === "LEFT" ? "CLOCKWISE" : "ANTICLOCKWISE";
      return `CYC:${constraint.subjectId}:${cyclicDirection}:${constraint.steps}:${constraint.referenceId}`;
    }
    case "ADJACENT":
    case "NOT_ADJACENT": {
      const pair = [constraint.firstId, constraint.secondId].sort().join(":");
      return `${constraint.kind}:${pair}`;
    }
    case "OPPOSITE": {
      const pair = [constraint.firstId, constraint.secondId].sort().join(":");
      return `OPP:${pair}`;
    }
    case "DIRECTIONAL_COUNT_BETWEEN":
      return `BET:${constraint.firstId}:${constraint.direction}:${constraint.count}:${constraint.secondId}`;
    case "LANDMARK_ANCHOR":
      return `LANDMARK:${constraint.landmarkId}:${constraint.personId}:${constraint.seatIndex}`;
  }
}

function ordinal(value: number): string {
  if (value === 1) return "immediately";
  if (value === 2) return "second";
  if (value === 3) return "third";
  return `${value}th`;
}

export function renderCircularConstraint(constraint: CircularConstraint): string {
  switch (constraint.kind) {
    case "CYCLIC_POSITION":
      return constraint.steps === 1
        ? `${constraint.subjectId} sits immediately ${constraint.direction.toLowerCase()} from ${constraint.referenceId}.`
        : `${constraint.subjectId} sits ${ordinal(constraint.steps)} ${constraint.direction.toLowerCase()} from ${constraint.referenceId}.`;
    case "RELATIVE_POSITION":
      return `${constraint.subjectId} sits ${ordinal(constraint.steps)} to the ${constraint.direction.toLowerCase()} of ${constraint.referenceId}.`;
    case "ADJACENT":
      return `${constraint.firstId} sits adjacent to ${constraint.secondId}.`;
    case "NOT_ADJACENT":
      return `${constraint.firstId} does not sit adjacent to ${constraint.secondId}.`;
    case "OPPOSITE":
      return `${constraint.firstId} sits opposite ${constraint.secondId}.`;
    case "DIRECTIONAL_COUNT_BETWEEN":
      return `Exactly ${constraint.count} ${constraint.count === 1 ? "person sits" : "persons sit"} between ${constraint.firstId} and ${constraint.secondId} when counted ${constraint.direction.toLowerCase()} from ${constraint.firstId}.`;
    case "LANDMARK_ANCHOR":
      return `${constraint.personId} sits at the seat nearest the ${constraint.landmarkId.toLowerCase()}.`;
  }
}

export function clockwiseDistance(firstSeat: number, secondSeat: number, seatCount: number): number {
  return mod(secondSeat - firstSeat, seatCount);
}
