import { CircularTopology } from "../cp003/topology.ts";
import type {
  MixedCircularConstraint,
  MixedCircularFacing,
  MixedCircularPersonId,
  MixedCircularRelativeDirection,
} from "./types.ts";

export type MixedCircularConstraintVerdict = "SATISFIED" | "VIOLATED" | "UNDECIDED";
export type MixedCircularPlacement = ReadonlyMap<MixedCircularPersonId, number>;
export type MixedCircularFacings = ReadonlyMap<MixedCircularPersonId, MixedCircularFacing>;

function occupantAt(
  placement: MixedCircularPlacement,
  seatIndex: number,
): MixedCircularPersonId | undefined {
  for (const [personId, assignedSeat] of placement) {
    if (assignedSeat === seatIndex) return personId;
  }
  return undefined;
}

function fixedTargetVerdict(
  placement: MixedCircularPlacement,
  personId: MixedCircularPersonId,
  targetSeat: number | undefined,
): MixedCircularConstraintVerdict {
  if (targetSeat === undefined) return "UNDECIDED";
  const assignedSeat = placement.get(personId);
  if (assignedSeat !== undefined) return assignedSeat === targetSeat ? "SATISFIED" : "VIOLATED";
  const occupant = occupantAt(placement, targetSeat);
  return occupant === undefined || occupant === personId ? "UNDECIDED" : "VIOLATED";
}

export function moveMixedCircularRelative(
  topology: CircularTopology,
  seatIndex: number,
  facing: MixedCircularFacing,
  direction: MixedCircularRelativeDirection,
  steps: number,
): number {
  return facing === "CENTRE"
    ? topology.moveRelativeCentre(seatIndex, direction, steps)
    : topology.moveRelativeOutward(seatIndex, direction, steps);
}

function evaluateConditionalRelation(
  constraint: Extract<MixedCircularConstraint, { kind: "FACING_CONDITIONAL_RELATION" }>,
  placement: MixedCircularPlacement,
  facings: MixedCircularFacings,
  topology: CircularTopology,
): MixedCircularConstraintVerdict {
  const referenceSeat = placement.get(constraint.referenceId);
  const subjectSeat = placement.get(constraint.subjectId);
  const referenceFacing = facings.get(constraint.referenceId);

  const targetFor = (facing: MixedCircularFacing): number => moveMixedCircularRelative(
    topology,
    referenceSeat as number,
    facing,
    facing === "CENTRE" ? constraint.centreDirection : constraint.outwardDirection,
    facing === "CENTRE" ? constraint.centreSteps : constraint.outwardSteps,
  );

  if (referenceSeat !== undefined && referenceFacing !== undefined) {
    return fixedTargetVerdict(placement, constraint.subjectId, targetFor(referenceFacing));
  }
  if (referenceSeat !== undefined && subjectSeat !== undefined) {
    const possible = (["CENTRE", "OUTWARD"] as const).some((facing) => targetFor(facing) === subjectSeat);
    return possible ? "UNDECIDED" : "VIOLATED";
  }
  return "UNDECIDED";
}

export function evaluateMixedCircularConstraint(
  constraint: MixedCircularConstraint,
  placement: MixedCircularPlacement,
  facings: MixedCircularFacings,
  topology: CircularTopology,
): MixedCircularConstraintVerdict {
  switch (constraint.kind) {
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
      const subjectSeat = placement.get(constraint.subjectId);
      const referenceFacing = facings.get(constraint.referenceId);
      if (referenceSeat !== undefined && referenceFacing !== undefined) {
        return fixedTargetVerdict(
          placement,
          constraint.subjectId,
          moveMixedCircularRelative(
            topology,
            referenceSeat,
            referenceFacing,
            constraint.direction,
            constraint.steps,
          ),
        );
      }
      if (referenceSeat !== undefined && subjectSeat !== undefined) {
        const possible = (["CENTRE", "OUTWARD"] as const).some((facing) =>
          moveMixedCircularRelative(topology, referenceSeat, facing, constraint.direction, constraint.steps) === subjectSeat);
        return possible ? "UNDECIDED" : "VIOLATED";
      }
      return "UNDECIDED";
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
    case "FACING_CONDITIONAL_RELATION":
      return evaluateConditionalRelation(constraint, placement, facings, topology);
  }
}

export function mixedCircularConstraintTrue(
  constraint: MixedCircularConstraint,
  clockwiseOrder: readonly MixedCircularPersonId[],
  facings: Readonly<Record<MixedCircularPersonId, MixedCircularFacing>>,
): boolean {
  const placement = new Map(clockwiseOrder.map((personId, seatIndex) => [personId, seatIndex]));
  const facingMap = new Map(Object.entries(facings) as [MixedCircularPersonId, MixedCircularFacing][]);
  return evaluateMixedCircularConstraint(
    constraint,
    placement,
    facingMap,
    new CircularTopology(clockwiseOrder.length),
  ) === "SATISFIED";
}

export function mixedCircularConstraintFingerprint(constraint: MixedCircularConstraint): string {
  switch (constraint.kind) {
    case "FACING":
      return `FACE:${constraint.personId}:${constraint.facing}`;
    case "SAME_FACING":
      return `SAME_FACE:${[constraint.firstId, constraint.secondId].sort().join(":")}`;
    case "OPPOSITE_FACING":
      return `OPP_FACE:${[constraint.firstId, constraint.secondId].sort().join(":")}`;
    case "CYCLIC_POSITION":
      return `CYC:${constraint.subjectId}:${constraint.direction}:${constraint.steps}:${constraint.referenceId}`;
    case "RELATIVE_POSITION":
      return `REL:${constraint.subjectId}:${constraint.direction}:${constraint.steps}:${constraint.referenceId}`;
    case "ADJACENT":
    case "NOT_ADJACENT":
      return `${constraint.kind}:${[constraint.firstId, constraint.secondId].sort().join(":")}`;
    case "OPPOSITE":
      return `OPP:${[constraint.firstId, constraint.secondId].sort().join(":")}`;
    case "DIRECTIONAL_COUNT_BETWEEN":
      return `BET:${constraint.firstId}:${constraint.direction}:${constraint.count}:${constraint.secondId}`;
    case "FACING_CONDITIONAL_RELATION":
      return [
        "COND_REL",
        constraint.subjectId,
        constraint.referenceId,
        `C:${constraint.centreDirection}:${constraint.centreSteps}`,
        `O:${constraint.outwardDirection}:${constraint.outwardSteps}`,
      ].join(":");
  }
}

function ordinal(value: number): string {
  if (value === 1) return "immediately";
  if (value === 2) return "second";
  if (value === 3) return "third";
  return `${value}th`;
}

function relativePhrase(direction: MixedCircularRelativeDirection, steps: number): string {
  return `${ordinal(steps)} to the ${direction.toLowerCase()}`;
}

export function renderMixedCircularConstraint(constraint: MixedCircularConstraint): string {
  switch (constraint.kind) {
    case "FACING":
      return `${constraint.personId} faces ${constraint.facing === "CENTRE" ? "the centre" : "outward"}.`;
    case "SAME_FACING":
      return `${constraint.firstId} and ${constraint.secondId} face the same direction.`;
    case "OPPOSITE_FACING":
      return `${constraint.firstId} and ${constraint.secondId} face opposite directions.`;
    case "CYCLIC_POSITION":
      return constraint.steps === 1
        ? `${constraint.subjectId} sits immediately ${constraint.direction.toLowerCase()} from ${constraint.referenceId}.`
        : `${constraint.subjectId} sits ${ordinal(constraint.steps)} ${constraint.direction.toLowerCase()} from ${constraint.referenceId}.`;
    case "RELATIVE_POSITION":
      return `${constraint.subjectId} sits ${relativePhrase(constraint.direction, constraint.steps)} of ${constraint.referenceId}.`;
    case "ADJACENT":
      return `${constraint.firstId} sits adjacent to ${constraint.secondId}.`;
    case "NOT_ADJACENT":
      return `${constraint.firstId} does not sit adjacent to ${constraint.secondId}.`;
    case "OPPOSITE":
      return `${constraint.firstId} sits opposite ${constraint.secondId}.`;
    case "DIRECTIONAL_COUNT_BETWEEN":
      return `Exactly ${constraint.count} ${constraint.count === 1 ? "person sits" : "persons sit"} between ${constraint.firstId} and ${constraint.secondId} when counted ${constraint.direction.toLowerCase()} from ${constraint.firstId}.`;
    case "FACING_CONDITIONAL_RELATION":
      return `If ${constraint.referenceId} faces the centre, ${constraint.subjectId} sits ${relativePhrase(constraint.centreDirection, constraint.centreSteps)} of ${constraint.referenceId}; if ${constraint.referenceId} faces outward, ${constraint.subjectId} sits ${relativePhrase(constraint.outwardDirection, constraint.outwardSteps)} of ${constraint.referenceId}.`;
  }
}
