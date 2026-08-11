import { CircularTopology, canonicalCircularOrder, mod } from "../cp003/topology.ts";
import { evaluateMixedCircularConstraint, moveMixedCircularRelative } from "./constraints.ts";
import type {
  MixedCircularConstraint,
  MixedCircularFacing,
  MixedCircularModel,
  MixedCircularPersonId,
} from "./types.ts";

export interface MixedCircularSolveInput {
  readonly persons: readonly MixedCircularPersonId[];
  readonly constraints: readonly MixedCircularConstraint[];
  readonly maxModels?: number;
}

function modelKey(
  clockwiseOrder: readonly MixedCircularPersonId[],
  facings: Readonly<Record<MixedCircularPersonId, MixedCircularFacing>>,
): string {
  const canonicalOrder = canonicalCircularOrder(clockwiseOrder, false);
  return canonicalOrder.map((personId) => `${personId}:${facings[personId] === "CENTRE" ? "C" : "O"}`).join("|");
}

function buildModel(
  placement: ReadonlyMap<MixedCircularPersonId, number>,
  facings: ReadonlyMap<MixedCircularPersonId, MixedCircularFacing>,
  persons: readonly MixedCircularPersonId[],
): MixedCircularModel {
  const order = Array<MixedCircularPersonId>(persons.length);
  const facingRecord: Record<MixedCircularPersonId, MixedCircularFacing> = {};
  for (const [personId, seatIndex] of placement) order[seatIndex] = personId;
  for (const personId of persons) {
    const facing = facings.get(personId);
    if (!facing) throw new Error(`Missing mixed-circle facing for ${personId}`);
    facingRecord[personId] = facing;
  }
  if (order.some((personId) => personId === undefined)) throw new Error("Incomplete mixed-circle placement");
  return { clockwiseOrder: order, facings: facingRecord, canonicalKey: modelKey(order, facingRecord) };
}

function personWeight(constraint: MixedCircularConstraint, personId: MixedCircularPersonId): number {
  switch (constraint.kind) {
    case "FACING":
      return constraint.personId === personId ? 9 : 0;
    case "SAME_FACING":
    case "OPPOSITE_FACING":
      return constraint.firstId === personId || constraint.secondId === personId ? 7 : 0;
    case "RELATIVE_POSITION":
    case "FACING_CONDITIONAL_RELATION":
      return constraint.subjectId === personId || constraint.referenceId === personId ? 6 : 0;
    case "CYCLIC_POSITION":
      return constraint.subjectId === personId || constraint.referenceId === personId ? 5 : 0;
    case "OPPOSITE":
    case "DIRECTIONAL_COUNT_BETWEEN":
      return constraint.firstId === personId || constraint.secondId === personId ? 4 : 0;
    case "ADJACENT":
    case "NOT_ADJACENT":
      return constraint.firstId === personId || constraint.secondId === personId ? 2 : 0;
  }
}

export function enumerateMixedCircularProduction(
  input: MixedCircularSolveInput,
): readonly MixedCircularModel[] {
  const topology = new CircularTopology(input.persons.length);
  const maximum = input.maxModels ?? Number.POSITIVE_INFINITY;
  const models = new Map<string, MixedCircularModel>();
  const facings = new Map<MixedCircularPersonId, MixedCircularFacing>();
  const orderedPersons = [...input.persons].sort((left, right) => {
    const rw = input.constraints.reduce((sum, constraint) => sum + personWeight(constraint, right), 0);
    const lw = input.constraints.reduce((sum, constraint) => sum + personWeight(constraint, left), 0);
    return rw - lw || left.localeCompare(right);
  });

  const solvePlacements = (): void => {
    const anchor = [...input.persons].sort()[0];
    if (!anchor) throw new Error("Mixed-circle solve requires a person anchor");
    const placement = new Map<MixedCircularPersonId, number>([[anchor, 0]]);
    const usedSeats = new Set<number>([0]);
    if (input.constraints.some((constraint) =>
      evaluateMixedCircularConstraint(constraint, placement, facings, topology) === "VIOLATED")) return;

    const remaining = orderedPersons.filter((personId) => personId !== anchor);
    const place = (index: number): void => {
      if (models.size >= maximum) return;
      if (index === remaining.length) {
        if (input.constraints.some((constraint) =>
          evaluateMixedCircularConstraint(constraint, placement, facings, topology) !== "SATISFIED")) return;
        const model = buildModel(placement, facings, input.persons);
        models.set(model.canonicalKey, model);
        return;
      }
      const personId = remaining[index];
      if (!personId) return;
      for (let seatIndex = 1; seatIndex < input.persons.length; seatIndex += 1) {
        if (usedSeats.has(seatIndex)) continue;
        placement.set(personId, seatIndex);
        usedSeats.add(seatIndex);
        if (!input.constraints.some((constraint) =>
          evaluateMixedCircularConstraint(constraint, placement, facings, topology) === "VIOLATED")) {
          place(index + 1);
        }
        placement.delete(personId);
        usedSeats.delete(seatIndex);
        if (models.size >= maximum) return;
      }
    };
    place(0);
  };

  const assignFacing = (index: number): void => {
    if (models.size >= maximum) return;
    if (index === orderedPersons.length) {
      solvePlacements();
      return;
    }
    const personId = orderedPersons[index];
    if (!personId) return;
    for (const facing of ["CENTRE", "OUTWARD"] as const) {
      facings.set(personId, facing);
      const emptyPlacement = new Map<MixedCircularPersonId, number>();
      if (!input.constraints.some((constraint) =>
        evaluateMixedCircularConstraint(constraint, emptyPlacement, facings, topology) === "VIOLATED")) {
        assignFacing(index + 1);
      }
      facings.delete(personId);
      if (models.size >= maximum) return;
    }
  };

  assignFacing(0);
  return [...models.values()].sort((left, right) => left.canonicalKey.localeCompare(right.canonicalKey));
}

function knownSeat(
  order: readonly (MixedCircularPersonId | undefined)[],
  personId: MixedCircularPersonId,
): number | undefined {
  const index = order.indexOf(personId);
  return index < 0 ? undefined : index;
}

function occupant(
  order: readonly (MixedCircularPersonId | undefined)[],
  seatIndex: number,
): MixedCircularPersonId | undefined {
  return order[mod(seatIndex, order.length)];
}

function targetCompatible(
  order: readonly (MixedCircularPersonId | undefined)[],
  personId: MixedCircularPersonId,
  targetSeat: number,
): boolean {
  const seat = knownSeat(order, personId);
  if (seat !== undefined) return seat === targetSeat;
  const current = occupant(order, targetSeat);
  return current === undefined || current === personId;
}

function oracleCompatible(
  constraint: MixedCircularConstraint,
  order: readonly (MixedCircularPersonId | undefined)[],
  facings: ReadonlyMap<MixedCircularPersonId, MixedCircularFacing>,
): boolean {
  const topology = new CircularTopology(order.length);
  switch (constraint.kind) {
    case "FACING": {
      const facing = facings.get(constraint.personId);
      return facing === undefined || facing === constraint.facing;
    }
    case "SAME_FACING": {
      const first = facings.get(constraint.firstId);
      const second = facings.get(constraint.secondId);
      return first === undefined || second === undefined || first === second;
    }
    case "OPPOSITE_FACING": {
      const first = facings.get(constraint.firstId);
      const second = facings.get(constraint.secondId);
      return first === undefined || second === undefined || first !== second;
    }
    case "CYCLIC_POSITION": {
      const referenceSeat = knownSeat(order, constraint.referenceId);
      const subjectSeat = knownSeat(order, constraint.subjectId);
      const signed = constraint.direction === "CLOCKWISE" ? constraint.steps : -constraint.steps;
      if (referenceSeat !== undefined) {
        return targetCompatible(order, constraint.subjectId, mod(referenceSeat + signed, order.length));
      }
      if (subjectSeat !== undefined) {
        return targetCompatible(order, constraint.referenceId, mod(subjectSeat - signed, order.length));
      }
      return true;
    }
    case "RELATIVE_POSITION": {
      const referenceSeat = knownSeat(order, constraint.referenceId);
      const referenceFacing = facings.get(constraint.referenceId);
      if (referenceSeat === undefined || referenceFacing === undefined) return true;
      const target = moveMixedCircularRelative(
        topology,
        referenceSeat,
        referenceFacing,
        constraint.direction,
        constraint.steps,
      );
      return targetCompatible(order, constraint.subjectId, target);
    }
    case "ADJACENT":
    case "NOT_ADJACENT": {
      const first = knownSeat(order, constraint.firstId);
      const second = knownSeat(order, constraint.secondId);
      if (first === undefined || second === undefined) return true;
      const adjacent = mod(first - second, order.length) === 1 || mod(second - first, order.length) === 1;
      return constraint.kind === "ADJACENT" ? adjacent : !adjacent;
    }
    case "OPPOSITE": {
      if (order.length % 2 !== 0) return false;
      const first = knownSeat(order, constraint.firstId);
      const second = knownSeat(order, constraint.secondId);
      if (first !== undefined) return targetCompatible(order, constraint.secondId, mod(first + order.length / 2, order.length));
      if (second !== undefined) return targetCompatible(order, constraint.firstId, mod(second + order.length / 2, order.length));
      return true;
    }
    case "DIRECTIONAL_COUNT_BETWEEN": {
      const first = knownSeat(order, constraint.firstId);
      const second = knownSeat(order, constraint.secondId);
      const steps = constraint.count + 1;
      const signed = constraint.direction === "CLOCKWISE" ? steps : -steps;
      if (first !== undefined) return targetCompatible(order, constraint.secondId, mod(first + signed, order.length));
      if (second !== undefined) return targetCompatible(order, constraint.firstId, mod(second - signed, order.length));
      return true;
    }
    case "FACING_CONDITIONAL_RELATION": {
      const referenceSeat = knownSeat(order, constraint.referenceId);
      const facing = facings.get(constraint.referenceId);
      if (referenceSeat === undefined || facing === undefined) return true;
      const target = moveMixedCircularRelative(
        topology,
        referenceSeat,
        facing,
        facing === "CENTRE" ? constraint.centreDirection : constraint.outwardDirection,
        facing === "CENTRE" ? constraint.centreSteps : constraint.outwardSteps,
      );
      return targetCompatible(order, constraint.subjectId, target);
    }
  }
}

export function enumerateMixedCircularOracle(
  input: MixedCircularSolveInput,
): readonly MixedCircularModel[] {
  const maximum = input.maxModels ?? Number.POSITIVE_INFINITY;
  const persons = [...input.persons].sort();
  const anchor = persons[0];
  if (!anchor) throw new Error("Mixed-circle oracle requires a person anchor");
  const models = new Map<string, MixedCircularModel>();
  const facings = new Map<MixedCircularPersonId, MixedCircularFacing>();

  const fillSeats = (): void => {
    const order = Array<MixedCircularPersonId | undefined>(persons.length).fill(undefined);
    order[0] = anchor;
    const remaining = new Set(persons.slice(1));
    if (!input.constraints.every((constraint) => oracleCompatible(constraint, order, facings))) return;

    const fill = (seatIndex: number): void => {
      if (models.size >= maximum) return;
      if (seatIndex === order.length) {
        if (!input.constraints.every((constraint) => oracleCompatible(constraint, order, facings))) return;
        const complete = order.map((personId) => {
          if (!personId) throw new Error("Incomplete mixed-circle oracle order");
          return personId;
        });
        const facingRecord: Record<MixedCircularPersonId, MixedCircularFacing> = {};
        for (const personId of persons) {
          const facing = facings.get(personId);
          if (!facing) throw new Error(`Missing mixed-circle oracle facing for ${personId}`);
          facingRecord[personId] = facing;
        }
        const canonicalKey = modelKey(complete, facingRecord);
        models.set(canonicalKey, { clockwiseOrder: complete, facings: facingRecord, canonicalKey });
        return;
      }
      for (const personId of [...remaining].sort()) {
        order[seatIndex] = personId;
        remaining.delete(personId);
        if (input.constraints.every((constraint) => oracleCompatible(constraint, order, facings))) fill(seatIndex + 1);
        remaining.add(personId);
        order[seatIndex] = undefined;
        if (models.size >= maximum) return;
      }
    };
    fill(1);
  };

  const assignFacing = (personIndex: number): void => {
    if (models.size >= maximum) return;
    if (personIndex === persons.length) {
      fillSeats();
      return;
    }
    const personId = persons[personIndex];
    if (!personId) return;
    for (const facing of ["CENTRE", "OUTWARD"] as const) {
      facings.set(personId, facing);
      const emptyOrder = Array<MixedCircularPersonId | undefined>(persons.length).fill(undefined);
      emptyOrder[0] = anchor;
      if (input.constraints.every((constraint) => oracleCompatible(constraint, emptyOrder, facings))) {
        assignFacing(personIndex + 1);
      }
      facings.delete(personId);
      if (models.size >= maximum) return;
    }
  };

  assignFacing(0);
  return [...models.values()].sort((left, right) => left.canonicalKey.localeCompare(right.canonicalKey));
}
