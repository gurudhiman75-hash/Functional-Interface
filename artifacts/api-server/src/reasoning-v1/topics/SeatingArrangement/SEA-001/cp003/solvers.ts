import { evaluateCircularConstraint } from "./constraints.ts";
import { CircularTopology, circularCanonicalKey, mod } from "./topology.ts";
import type { CircularConstraint, CircularSolverModel, PersonId } from "./types.ts";

export interface CircularSolveInput {
  readonly persons: readonly PersonId[];
  readonly constraints: readonly CircularConstraint[];
  readonly landmarkAnchored: boolean;
  readonly maxModels?: number;
}

function modelsFromPlacement(
  placement: ReadonlyMap<PersonId, number>,
  persons: readonly PersonId[],
  landmarkAnchored: boolean,
): CircularSolverModel {
  const order = Array<PersonId>(persons.length);
  for (const [personId, seatIndex] of placement) order[seatIndex] = personId;
  if (order.some((person) => person === undefined)) throw new Error("Incomplete circular production model");
  return { clockwiseOrder: order, canonicalKey: circularCanonicalKey(order, landmarkAnchored) };
}

function constraintWeight(constraint: CircularConstraint, personId: PersonId): number {
  switch (constraint.kind) {
    case "LANDMARK_ANCHOR": return constraint.personId === personId ? 8 : 0;
    case "CYCLIC_POSITION":
    case "RELATIVE_POSITION": return constraint.subjectId === personId || constraint.referenceId === personId ? 5 : 0;
    case "DIRECTIONAL_COUNT_BETWEEN": return constraint.firstId === personId || constraint.secondId === personId ? 4 : 0;
    case "OPPOSITE": return constraint.firstId === personId || constraint.secondId === personId ? 4 : 0;
    case "ADJACENT":
    case "NOT_ADJACENT": return constraint.firstId === personId || constraint.secondId === personId ? 2 : 0;
  }
}

export function enumerateCircularProduction(input: CircularSolveInput): readonly CircularSolverModel[] {
  const topology = new CircularTopology(input.persons.length);
  const placement = new Map<PersonId, number>();
  const usedSeats = new Set<number>();
  const maximum = input.maxModels ?? Number.POSITIVE_INFINITY;

  const landmark = input.constraints.find((constraint) => constraint.kind === "LANDMARK_ANCHOR");
  if (input.landmarkAnchored) {
    if (!landmark || landmark.kind !== "LANDMARK_ANCHOR") throw new Error("Landmark-anchored solve requires LANDMARK_ANCHOR");
    placement.set(landmark.personId, 0);
    usedSeats.add(0);
  } else {
    const anchor = [...input.persons].sort()[0];
    if (anchor === undefined) throw new Error("Cannot solve an empty circle");
    placement.set(anchor, 0);
    usedSeats.add(0);
  }

  const remaining = input.persons
    .filter((personId) => !placement.has(personId))
    .sort((left, right) => {
      const rightWeight = input.constraints.reduce((sum, constraint) => sum + constraintWeight(constraint, right), 0);
      const leftWeight = input.constraints.reduce((sum, constraint) => sum + constraintWeight(constraint, left), 0);
      return rightWeight - leftWeight || left.localeCompare(right);
    });

  const modelByKey = new Map<string, CircularSolverModel>();

  const dfs = (personIndex: number): void => {
    if (modelByKey.size >= maximum) return;
    if (personIndex === remaining.length) {
      if (input.constraints.some((constraint) => evaluateCircularConstraint(constraint, placement, topology) !== "SATISFIED")) return;
      const model = modelsFromPlacement(placement, input.persons, input.landmarkAnchored);
      modelByKey.set(model.canonicalKey, model);
      return;
    }

    const personId = remaining[personIndex];
    if (personId === undefined) return;
    for (let seatIndex = 0; seatIndex < input.persons.length; seatIndex += 1) {
      if (usedSeats.has(seatIndex)) continue;
      placement.set(personId, seatIndex);
      usedSeats.add(seatIndex);
      const violated = input.constraints.some((constraint) => evaluateCircularConstraint(constraint, placement, topology) === "VIOLATED");
      if (!violated) dfs(personIndex + 1);
      placement.delete(personId);
      usedSeats.delete(seatIndex);
      if (modelByKey.size >= maximum) return;
    }
  };

  dfs(0);
  return [...modelByKey.values()].sort((left, right) => left.canonicalKey.localeCompare(right.canonicalKey));
}

function oracleKnownSeat(order: readonly (PersonId | undefined)[], personId: PersonId): number | undefined {
  const index = order.indexOf(personId);
  return index < 0 ? undefined : index;
}

function oracleOccupant(order: readonly (PersonId | undefined)[], seatIndex: number): PersonId | undefined {
  return order[mod(seatIndex, order.length)];
}

function oracleCompatible(constraint: CircularConstraint, order: readonly (PersonId | undefined)[]): boolean {
  const count = order.length;
  const first = "firstId" in constraint ? oracleKnownSeat(order, constraint.firstId) : undefined;
  const second = "secondId" in constraint ? oracleKnownSeat(order, constraint.secondId) : undefined;

  switch (constraint.kind) {
    case "LANDMARK_ANCHOR": {
      const seat = oracleKnownSeat(order, constraint.personId);
      return seat === undefined || seat === 0;
    }
    case "CYCLIC_POSITION": {
      const subject = oracleKnownSeat(order, constraint.subjectId);
      const reference = oracleKnownSeat(order, constraint.referenceId);
      const signed = constraint.direction === "CLOCKWISE" ? constraint.steps : -constraint.steps;
      if (reference !== undefined) {
        const target = mod(reference + signed, count);
        const occupant = oracleOccupant(order, target);
        return subject === undefined ? occupant === undefined || occupant === constraint.subjectId : subject === target;
      }
      if (subject !== undefined) {
        const requiredReference = mod(subject - signed, count);
        const occupant = oracleOccupant(order, requiredReference);
        return occupant === undefined || occupant === constraint.referenceId;
      }
      return true;
    }
    case "RELATIVE_POSITION": {
      const subject = oracleKnownSeat(order, constraint.subjectId);
      const reference = oracleKnownSeat(order, constraint.referenceId);
      const signed = constraint.direction === "LEFT" ? constraint.steps : -constraint.steps;
      if (reference !== undefined) {
        const target = mod(reference + signed, count);
        const occupant = oracleOccupant(order, target);
        return subject === undefined ? occupant === undefined || occupant === constraint.subjectId : subject === target;
      }
      if (subject !== undefined) {
        const requiredReference = mod(subject - signed, count);
        const occupant = oracleOccupant(order, requiredReference);
        return occupant === undefined || occupant === constraint.referenceId;
      }
      return true;
    }
    case "ADJACENT": {
      if (first === undefined || second === undefined) return true;
      const distance = mod(first - second, count);
      return distance === 1 || distance === count - 1;
    }
    case "NOT_ADJACENT": {
      if (first === undefined || second === undefined) return true;
      const distance = mod(first - second, count);
      return distance !== 1 && distance !== count - 1;
    }
    case "OPPOSITE": {
      if (count % 2 !== 0) return false;
      if (first === undefined || second === undefined) {
        const known = first ?? second;
        const unknownId = first === undefined ? constraint.firstId : constraint.secondId;
        if (known === undefined) return true;
        const occupant = oracleOccupant(order, mod(known + count / 2, count));
        return occupant === undefined || occupant === unknownId;
      }
      return mod(first - second, count) === count / 2;
    }
    case "DIRECTIONAL_COUNT_BETWEEN": {
      const steps = constraint.count + 1;
      const signed = constraint.direction === "CLOCKWISE" ? steps : -steps;
      if (first !== undefined) {
        const target = mod(first + signed, count);
        const occupant = oracleOccupant(order, target);
        return second === undefined ? occupant === undefined || occupant === constraint.secondId : second === target;
      }
      if (second !== undefined) {
        const requiredFirst = mod(second - signed, count);
        const occupant = oracleOccupant(order, requiredFirst);
        return occupant === undefined || occupant === constraint.firstId;
      }
      return true;
    }
  }
}

export function enumerateCircularOracle(input: CircularSolveInput): readonly CircularSolverModel[] {
  const count = input.persons.length;
  const order = Array<PersonId | undefined>(count).fill(undefined);
  const remaining = new Set<PersonId>(input.persons);
  const maximum = input.maxModels ?? Number.POSITIVE_INFINITY;

  const landmark = input.constraints.find((constraint) => constraint.kind === "LANDMARK_ANCHOR");
  const anchor = input.landmarkAnchored && landmark?.kind === "LANDMARK_ANCHOR"
    ? landmark.personId
    : [...input.persons].sort()[0];
  if (anchor === undefined) throw new Error("Cannot solve an empty circle");
  order[0] = anchor;
  remaining.delete(anchor);

  const modelByKey = new Map<string, CircularSolverModel>();

  const fillSeat = (seatIndex: number): void => {
    if (modelByKey.size >= maximum) return;
    if (seatIndex === count) {
      if (input.constraints.some((constraint) => !oracleCompatible(constraint, order))) return;
      const completed = order.map((person) => {
        if (person === undefined) throw new Error("Incomplete circular oracle model");
        return person;
      });
      const canonicalKey = circularCanonicalKey(completed, input.landmarkAnchored);
      modelByKey.set(canonicalKey, { clockwiseOrder: completed, canonicalKey });
      return;
    }
    if (order[seatIndex] !== undefined) {
      fillSeat(seatIndex + 1);
      return;
    }

    for (const personId of [...remaining].sort()) {
      order[seatIndex] = personId;
      remaining.delete(personId);
      if (input.constraints.every((constraint) => oracleCompatible(constraint, order))) fillSeat(seatIndex + 1);
      remaining.add(personId);
      order[seatIndex] = undefined;
      if (modelByKey.size >= maximum) return;
    }
  };

  fillSeat(1);
  return [...modelByKey.values()].sort((left, right) => left.canonicalKey.localeCompare(right.canonicalKey));
}
