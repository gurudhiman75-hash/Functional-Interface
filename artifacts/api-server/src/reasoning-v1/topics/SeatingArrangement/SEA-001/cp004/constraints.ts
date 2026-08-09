import { CircularTopology } from "../cp003/topology.ts";
import type { OutwardConstraint, OutwardPersonId } from "./types.ts";

export type OutwardConstraintVerdict = "SATISFIED" | "VIOLATED" | "UNDECIDED";
export type OutwardPartialPlacement = ReadonlyMap<OutwardPersonId, number>;

function occupantAt(placement: OutwardPartialPlacement, seatIndex: number): OutwardPersonId | undefined {
  for (const [personId, assignedSeat] of placement) {
    if (assignedSeat === seatIndex) return personId;
  }
  return undefined;
}

function fixedTargetVerdict(
  placement: OutwardPartialPlacement,
  personId: OutwardPersonId,
  targetSeat: number | undefined,
): OutwardConstraintVerdict {
  if (targetSeat === undefined) return "UNDECIDED";
  const assignedSeat = placement.get(personId);
  if (assignedSeat !== undefined) return assignedSeat === targetSeat ? "SATISFIED" : "VIOLATED";
  const occupant = occupantAt(placement, targetSeat);
  return occupant === undefined || occupant === personId ? "UNDECIDED" : "VIOLATED";
}

export function evaluateOutwardConstraint(
  constraint: OutwardConstraint,
  placement: OutwardPartialPlacement,
  topology: CircularTopology,
): OutwardConstraintVerdict {
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
      return fixedTargetVerdict(
        placement,
        constraint.referenceId,
        topology.moveCyclic(
          subjectSeat,
          constraint.direction === "CLOCKWISE" ? "ANTICLOCKWISE" : "CLOCKWISE",
          constraint.steps,
        ),
      );
    }
    case "RELATIVE_POSITION": {
      const referenceSeat = placement.get(constraint.referenceId);
      if (referenceSeat !== undefined) {
        return fixedTargetVerdict(
          placement,
          constraint.subjectId,
          topology.moveRelativeOutward(referenceSeat, constraint.direction, constraint.steps),
        );
      }
      const subjectSeat = placement.get(constraint.subjectId);
      if (subjectSeat === undefined) return "UNDECIDED";
      return fixedTargetVerdict(
        placement,
        constraint.referenceId,
        topology.moveRelativeOutward(
          subjectSeat,
          constraint.direction === "LEFT" ? "RIGHT" : "LEFT",
          constraint.steps,
        ),
      );
    }
    case "ADJACENT": {
      const firstSeat = placement.get(constraint.firstId);
      const secondSeat = placement.get(constraint.secondId);
      if (firstSeat === undefined || secondSeat === undefined) return "UNDECIDED";
      return topology.adjacentSeatIndices(firstSeat).includes(secondSeat) ? "SATISFIED" : "VIOLATED";
    }
    case "NOT_ADJACENT": {
      const firstSeat = placement.get(constraint.firstId);
      const secondSeat = placement.get(constraint.secondId);
      if (firstSeat === undefined || secondSeat === undefined) return "UNDECIDED";
      return topology.adjacentSeatIndices(firstSeat).includes(secondSeat) ? "VIOLATED" : "SATISFIED";
    }
    case "OPPOSITE": {
      if (topology.seatCount % 2 !== 0) return "VIOLATED";
      const firstSeat = placement.get(constraint.firstId);
      const secondSeat = placement.get(constraint.secondId);
      if (firstSeat !== undefined) {
        return fixedTargetVerdict(placement, constraint.secondId, topology.oppositeSeatIndex(firstSeat) ?? undefined);
      }
      if (secondSeat !== undefined) {
        return fixedTargetVerdict(placement, constraint.firstId, topology.oppositeSeatIndex(secondSeat) ?? undefined);
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
      return seat === undefined ? "UNDECIDED" : seat === 0 ? "SATISFIED" : "VIOLATED";
    }
  }
}

export function outwardConstraintTrue(
  constraint: OutwardConstraint,
  clockwiseOrder: readonly OutwardPersonId[],
): boolean {
  const placement = new Map(clockwiseOrder.map((personId, seatIndex) => [personId, seatIndex]));
  return evaluateOutwardConstraint(
    constraint,
    placement,
    new CircularTopology(clockwiseOrder.length),
  ) === "SATISFIED";
}

export function outwardConstraintFingerprint(constraint: OutwardConstraint): string {
  switch (constraint.kind) {
    case "CYCLIC_POSITION":
      return `CYC:${constraint.subjectId}:${constraint.direction}:${constraint.steps}:${constraint.referenceId}`;
    case "RELATIVE_POSITION":
      return `CYC:${constraint.subjectId}:${constraint.direction === "LEFT" ? "ANTICLOCKWISE" : "CLOCKWISE"}:${constraint.steps}:${constraint.referenceId}`;
    case "ADJACENT":
    case "NOT_ADJACENT":
      return `${constraint.kind}:${[constraint.firstId, constraint.secondId].sort().join(":")}`;
    case "OPPOSITE":
      return `OPP:${[constraint.firstId, constraint.secondId].sort().join(":")}`;
    case "DIRECTIONAL_COUNT_BETWEEN":
      return `BET:${constraint.firstId}:${constraint.direction}:${constraint.count}:${constraint.secondId}`;
    case "LANDMARK_ANCHOR":
      return `LANDMARK:${constraint.landmarkId}:${constraint.personId}:0`;
  }
}

function ordinal(value: number): string {
  if (value === 1) return "immediately";
  if (value === 2) return "second";
  if (value === 3) return "third";
  return `${value}th`;
}

export function renderOutwardConstraint(constraint: OutwardConstraint): string {
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
