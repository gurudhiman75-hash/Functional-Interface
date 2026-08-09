import type { ConstraintVerdict } from "../../../../shared/constraint-core/types.ts";
import { LinearTopology } from "../topology/linear.ts";
import type { LinearConstraint, PersonId } from "../types.ts";

export type PartialPlacement = ReadonlyMap<PersonId, number>;

function known(placement: PartialPlacement, personId: PersonId): number | undefined {
  return placement.get(personId);
}

export function evaluateConstraint(
  constraint: LinearConstraint,
  placement: PartialPlacement,
  topology: LinearTopology,
  facing: "NORTH" | "SOUTH",
): ConstraintVerdict {
  switch (constraint.kind) {
    case "ABSOLUTE_SEAT": {
      const seat = known(placement, constraint.personId);
      return seat === undefined ? "UNDECIDED" : seat === constraint.seatIndex ? "SATISFIED" : "VIOLATED";
    }
    case "AT_END": {
      const seat = known(placement, constraint.personId);
      return seat === undefined ? "UNDECIDED" : seat === 0 || seat === topology.seatCount - 1 ? "SATISFIED" : "VIOLATED";
    }
    case "AT_MIDDLE": {
      const seat = known(placement, constraint.personId);
      if (seat === undefined) return "UNDECIDED";
      return topology.isMiddle(topology.seatId(seat)) ? "SATISFIED" : "VIOLATED";
    }
    case "RELATIVE_POSITION": {
      const subject = known(placement, constraint.subjectId);
      const reference = known(placement, constraint.referenceId);
      if (subject === undefined || reference === undefined) return "UNDECIDED";
      const target = topology.moveRelative({
        seatId: topology.seatId(reference),
        facing,
        direction: constraint.direction,
        steps: constraint.steps,
      });
      return target !== null && topology.indexOf(target) === subject ? "SATISFIED" : "VIOLATED";
    }
    case "ADJACENT": {
      const first = known(placement, constraint.firstId);
      const second = known(placement, constraint.secondId);
      if (first === undefined || second === undefined) return "UNDECIDED";
      return Math.abs(first - second) === 1 ? "SATISFIED" : "VIOLATED";
    }
    case "NOT_ADJACENT": {
      const first = known(placement, constraint.firstId);
      const second = known(placement, constraint.secondId);
      if (first === undefined || second === undefined) return "UNDECIDED";
      return Math.abs(first - second) !== 1 ? "SATISFIED" : "VIOLATED";
    }
    case "EXACT_COUNT_BETWEEN": {
      const first = known(placement, constraint.firstId);
      const second = known(placement, constraint.secondId);
      if (first === undefined || second === undefined) return "UNDECIDED";
      return Math.abs(first - second) - 1 === constraint.count ? "SATISFIED" : "VIOLATED";
    }
  }
}

export function constraintFingerprint(constraint: LinearConstraint): string {
  switch (constraint.kind) {
    case "ABSOLUTE_SEAT":
      return `ABS:${constraint.personId}:${constraint.seatIndex}`;
    case "AT_END":
      return `END:${constraint.personId}`;
    case "AT_MIDDLE":
      return `MID:${constraint.personId}`;
    case "RELATIVE_POSITION":
      return `REL:${constraint.subjectId}:${constraint.referenceId}:${constraint.direction}:${constraint.steps}`;
    case "ADJACENT":
    case "NOT_ADJACENT": {
      const pair = [constraint.firstId, constraint.secondId].sort().join("~");
      return `${constraint.kind}:${pair}`;
    }
    case "EXACT_COUNT_BETWEEN": {
      const pair = [constraint.firstId, constraint.secondId].sort().join("~");
      return `BET:${pair}:${constraint.count}`;
    }
  }
}
