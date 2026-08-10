import { CircularTopology } from "../cp003/topology.ts";
import type {
  MixedCircleConstraint,
  MixedCircleFacing,
  MixedCirclePersonId,
} from "./types.ts";

export type MixedCircleVerdict = "SATISFIED" | "VIOLATED" | "UNDECIDED";
export type MixedCirclePlacement = ReadonlyMap<MixedCirclePersonId, number>;
export type MixedCircleFacingMap = ReadonlyMap<MixedCirclePersonId, MixedCircleFacing>;

export function oppositeFacing(facing: MixedCircleFacing): MixedCircleFacing {
  return facing === "CENTER" ? "OUTWARD" : "CENTER";
}

function occupantAt(
  placement: MixedCirclePlacement,
  seatIndex: number,
): MixedCirclePersonId | undefined {
  for (const [personId, assignedSeat] of placement) {
    if (assignedSeat === seatIndex) return personId;
  }
  return undefined;
}

function fixedTarget(
  placement: MixedCirclePlacement,
  personId: MixedCirclePersonId,
  targetSeat: number,
): MixedCircleVerdict {
  const assigned = placement.get(personId);
  if (assigned !== undefined) return assigned === targetSeat ? "SATISFIED" : "VIOLATED";
  const occupant = occupantAt(placement, targetSeat);
  return occupant === undefined || occupant === personId ? "UNDECIDED" : "VIOLATED";
}

function moveRelative(
  topology: CircularTopology,
  seatIndex: number,
  facing: MixedCircleFacing,
  direction: "LEFT" | "RIGHT",
  steps: number,
): number {
  return facing === "CENTER"
    ? topology.moveRelativeCentre(seatIndex, direction, steps)
    : topology.moveRelativeOutward(seatIndex, direction, steps);
}

export function evaluateMixedCircleConstraint(
  constraint: MixedCircleConstraint,
  placement: MixedCirclePlacement,
  facings: MixedCircleFacingMap,
  topology: CircularTopology,
): MixedCircleVerdict {
  switch (constraint.kind) {
    case "FACING": {
      const facing = facings.get(constraint.personId);
      return facing === undefined ? "UNDECIDED" : facing === constraint.facing ? "SATISFIED" : "VIOLATED";
    }
    case "SAME_FACING": {
      const first = facings.get(constraint.firstId);
      const second = facings.get(constraint.secondId);
      return first === undefined || second === undefined
        ? "UNDECIDED"
        : first === second ? "SATISFIED" : "VIOLATED";
    }
    case "OPPOSITE_FACING": {
      const first = facings.get(constraint.firstId);
      const second = facings.get(constraint.secondId);
      return first === undefined || second === undefined
        ? "UNDECIDED"
        : first !== second ? "SATISFIED" : "VIOLATED";
    }
    case "CONDITIONAL_FACING": {
      const condition = facings.get(constraint.conditionPersonId);
      const target = facings.get(constraint.targetPersonId);
      if (condition === undefined || target === undefined) return "UNDECIDED";
      const expected = condition === constraint.conditionFacing
        ? constraint.thenFacing
        : constraint.elseFacing;
      return target === expected ? "SATISFIED" : "VIOLATED";
    }
    case "CYCLIC_POSITION": {
      const reference = placement.get(constraint.referenceId);
      const subject = placement.get(constraint.subjectId);
      if (reference !== undefined) {
        return fixedTarget(
          placement,
          constraint.subjectId,
          topology.moveCyclic(reference, constraint.direction, constraint.steps),
        );
      }
      if (subject !== undefined) {
        return fixedTarget(
          placement,
          constraint.referenceId,
          topology.moveCyclic(
            subject,
            constraint.direction === "CLOCKWISE" ? "ANTICLOCKWISE" : "CLOCKWISE",
            constraint.steps,
          ),
        );
      }
      return "UNDECIDED";
    }
    case "RELATIVE_POSITION": {
      const reference = placement.get(constraint.referenceId);
      const subject = placement.get(constraint.subjectId);
      const facing = facings.get(constraint.referenceId);
      if (reference !== undefined && facing !== undefined) {
        return fixedTarget(
          placement,
          constraint.subjectId,
          moveRelative(topology, reference, facing, constraint.direction, constraint.steps),
        );
      }
      if (reference !== undefined && subject !== undefined && facing === undefined) {
        const possible = (["CENTER", "OUTWARD"] as const).some((candidateFacing) =>
          moveRelative(
            topology,
            reference,
            candidateFacing,
            constraint.direction,
            constraint.steps,
          ) === subject);
        return possible ? "UNDECIDED" : "VIOLATED";
      }
      if (subject !== undefined && facing !== undefined) {
        return fixedTarget(
          placement,
          constraint.referenceId,
          moveRelative(
            topology,
            subject,
            facing,
            constraint.direction === "LEFT" ? "RIGHT" : "LEFT",
            constraint.steps,
          ),
        );
      }
      return "UNDECIDED";
    }
    case "ADJACENT": {
      const first = placement.get(constraint.firstId);
      const second = placement.get(constraint.secondId);
      return first === undefined || second === undefined
        ? "UNDECIDED"
        : topology.adjacentSeatIndices(first).includes(second) ? "SATISFIED" : "VIOLATED";
    }
    case "OPPOSITE": {
      if (topology.seatCount % 2 !== 0) return "VIOLATED";
      const first = placement.get(constraint.firstId);
      const second = placement.get(constraint.secondId);
      if (first !== undefined) {
        return fixedTarget(
          placement,
          constraint.secondId,
          topology.oppositeSeatIndex(first) as number,
        );
      }
      if (second !== undefined) {
        return fixedTarget(
          placement,
          constraint.firstId,
          topology.oppositeSeatIndex(second) as number,
        );
      }
      return "UNDECIDED";
    }
    case "DIRECTIONAL_COUNT_BETWEEN": {
      const first = placement.get(constraint.firstId);
      const second = placement.get(constraint.secondId);
      const steps = constraint.count + 1;
      if (first !== undefined) {
        return fixedTarget(
          placement,
          constraint.secondId,
          topology.moveCyclic(first, constraint.direction, steps),
        );
      }
      if (second !== undefined) {
        return fixedTarget(
          placement,
          constraint.firstId,
          topology.moveCyclic(
            second,
            constraint.direction === "CLOCKWISE" ? "ANTICLOCKWISE" : "CLOCKWISE",
            steps,
          ),
        );
      }
      return "UNDECIDED";
    }
  }
}

export function mixedCircleConstraintTrue(
  constraint: MixedCircleConstraint,
  clockwiseOrder: readonly MixedCirclePersonId[],
  facings: Readonly<Record<MixedCirclePersonId, MixedCircleFacing>>,
): boolean {
  const placement = new Map(clockwiseOrder.map((personId, seatIndex) => [personId, seatIndex]));
  const facingMap = new Map(
    Object.entries(facings) as [MixedCirclePersonId, MixedCircleFacing][],
  );
  return evaluateMixedCircleConstraint(
    constraint,
    placement,
    facingMap,
    new CircularTopology(clockwiseOrder.length),
  ) === "SATISFIED";
}

export function mixedCircleConstraintFingerprint(constraint: MixedCircleConstraint): string {
  switch (constraint.kind) {
    case "FACING":
      return `FACE:${constraint.personId}:${constraint.facing}`;
    case "SAME_FACING":
      return `SAME:${[constraint.firstId, constraint.secondId].sort().join(":")}`;
    case "OPPOSITE_FACING":
      return `OPPF:${[constraint.firstId, constraint.secondId].sort().join(":")}`;
    case "CONDITIONAL_FACING":
      return `COND:${constraint.conditionPersonId}:${constraint.conditionFacing}:${constraint.targetPersonId}:${constraint.thenFacing}:${constraint.elseFacing}`;
    case "CYCLIC_POSITION":
      return `CYC:${constraint.subjectId}:${constraint.direction}:${constraint.steps}:${constraint.referenceId}`;
    case "RELATIVE_POSITION":
      return `REL:${constraint.subjectId}:${constraint.direction}:${constraint.steps}:${constraint.referenceId}`;
    case "ADJACENT":
      return `ADJ:${[constraint.firstId, constraint.secondId].sort().join(":")}`;
    case "OPPOSITE":
      return `OPP:${[constraint.firstId, constraint.secondId].sort().join(":")}`;
    case "DIRECTIONAL_COUNT_BETWEEN":
      return `BET:${constraint.firstId}:${constraint.direction}:${constraint.count}:${constraint.secondId}`;
  }
}

function ordinal(value: number): string {
  if (value === 1) return "immediately";
  if (value === 2) return "second";
  if (value === 3) return "third";
  return `${value}th`;
}

export function renderMixedCircleConstraint(constraint: MixedCircleConstraint): string {
  switch (constraint.kind) {
    case "FACING":
      return `${constraint.personId} faces ${constraint.facing === "CENTER" ? "the centre" : "outward"}.`;
    case "SAME_FACING":
      return `${constraint.firstId} and ${constraint.secondId} face the same direction.`;
    case "OPPOSITE_FACING":
      return `${constraint.firstId} and ${constraint.secondId} face opposite directions.`;
    case "CONDITIONAL_FACING":
      return `If ${constraint.conditionPersonId} faces ${constraint.conditionFacing === "CENTER" ? "the centre" : "outward"}, ${constraint.targetPersonId} faces ${constraint.thenFacing === "CENTER" ? "the centre" : "outward"}; otherwise, ${constraint.targetPersonId} faces ${constraint.elseFacing === "CENTER" ? "the centre" : "outward"}.`;
    case "CYCLIC_POSITION":
      return `${constraint.subjectId} sits ${ordinal(constraint.steps)} ${constraint.direction.toLowerCase()} from ${constraint.referenceId}.`;
    case "RELATIVE_POSITION":
      return `${constraint.subjectId} sits ${ordinal(constraint.steps)} to the ${constraint.direction.toLowerCase()} of ${constraint.referenceId}.`;
    case "ADJACENT":
      return `${constraint.firstId} sits adjacent to ${constraint.secondId}.`;
    case "OPPOSITE":
      return `${constraint.firstId} sits opposite ${constraint.secondId}.`;
    case "DIRECTIONAL_COUNT_BETWEEN":
      return `Exactly ${constraint.count} ${constraint.count === 1 ? "person sits" : "persons sit"} between ${constraint.firstId} and ${constraint.secondId} when counted ${constraint.direction.toLowerCase()} from ${constraint.firstId}.`;
  }
}
