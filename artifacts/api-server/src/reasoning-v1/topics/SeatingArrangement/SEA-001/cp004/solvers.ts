import { CircularTopology, circularCanonicalKey, mod } from "../cp003/topology.ts";
import { evaluateOutwardConstraint } from "./constraints.ts";
import type { OutwardConstraint, OutwardPersonId, OutwardSolverModel } from "./types.ts";

export interface OutwardSolveInput {
  readonly persons: readonly OutwardPersonId[];
  readonly constraints: readonly OutwardConstraint[];
  readonly landmarkAnchored: boolean;
  readonly maxModels?: number;
}

function buildModel(
  placement: ReadonlyMap<OutwardPersonId, number>,
  persons: readonly OutwardPersonId[],
  landmarkAnchored: boolean,
): OutwardSolverModel {
  const order = Array<OutwardPersonId>(persons.length);
  for (const [personId, seatIndex] of placement) order[seatIndex] = personId;
  if (order.some((personId) => personId === undefined)) throw new Error("Incomplete outward model");
  return { clockwiseOrder: order, canonicalKey: circularCanonicalKey(order, landmarkAnchored) };
}

function personWeight(constraint: OutwardConstraint, personId: OutwardPersonId): number {
  switch (constraint.kind) {
    case "LANDMARK_ANCHOR": return constraint.personId === personId ? 8 : 0;
    case "CYCLIC_POSITION":
    case "RELATIVE_POSITION": return constraint.subjectId === personId || constraint.referenceId === personId ? 5 : 0;
    case "DIRECTIONAL_COUNT_BETWEEN":
    case "OPPOSITE": return constraint.firstId === personId || constraint.secondId === personId ? 4 : 0;
    case "ADJACENT":
    case "NOT_ADJACENT": return constraint.firstId === personId || constraint.secondId === personId ? 2 : 0;
  }
}

export function enumerateOutwardProduction(input: OutwardSolveInput): readonly OutwardSolverModel[] {
  const topology = new CircularTopology(input.persons.length);
  const placement = new Map<OutwardPersonId, number>();
  const usedSeats = new Set<number>();
  const maximum = input.maxModels ?? Number.POSITIVE_INFINITY;
  const landmark = input.constraints.find((constraint) => constraint.kind === "LANDMARK_ANCHOR");
  const anchor = input.landmarkAnchored
    ? landmark?.kind === "LANDMARK_ANCHOR" ? landmark.personId : undefined
    : [...input.persons].sort()[0];
  if (!anchor) throw new Error("Outward solve requires an anchor");
  placement.set(anchor, 0);
  usedSeats.add(0);

  const remaining = input.persons.filter((personId) => personId !== anchor).sort((left, right) => {
    const rightWeight = input.constraints.reduce((sum, constraint) => sum + personWeight(constraint, right), 0);
    const leftWeight = input.constraints.reduce((sum, constraint) => sum + personWeight(constraint, left), 0);
    return rightWeight - leftWeight || left.localeCompare(right);
  });
  const modelByKey = new Map<string, OutwardSolverModel>();

  const dfs = (personIndex: number): void => {
    if (modelByKey.size >= maximum) return;
    if (personIndex === remaining.length) {
      if (input.constraints.some((constraint) => evaluateOutwardConstraint(constraint, placement, topology) !== "SATISFIED")) return;
      const model = buildModel(placement, input.persons, input.landmarkAnchored);
      modelByKey.set(model.canonicalKey, model);
      return;
    }
    const personId = remaining[personIndex];
    if (!personId) return;
    for (let seatIndex = 0; seatIndex < input.persons.length; seatIndex += 1) {
      if (usedSeats.has(seatIndex)) continue;
      placement.set(personId, seatIndex);
      usedSeats.add(seatIndex);
      if (!input.constraints.some((constraint) => evaluateOutwardConstraint(constraint, placement, topology) === "VIOLATED")) {
        dfs(personIndex + 1);
      }
      placement.delete(personId);
      usedSeats.delete(seatIndex);
      if (modelByKey.size >= maximum) return;
    }
  };

  dfs(0);
  return [...modelByKey.values()].sort((left, right) => left.canonicalKey.localeCompare(right.canonicalKey));
}

function knownSeat(order: readonly (OutwardPersonId | undefined)[], personId: OutwardPersonId): number | undefined {
  const index = order.indexOf(personId);
  return index < 0 ? undefined : index;
}

function occupant(order: readonly (OutwardPersonId | undefined)[], seatIndex: number): OutwardPersonId | undefined {
  return order[mod(seatIndex, order.length)];
}

function oracleCompatible(
  constraint: OutwardConstraint,
  order: readonly (OutwardPersonId | undefined)[],
): boolean {
  const seatCount = order.length;
  const firstSeat = "firstId" in constraint ? knownSeat(order, constraint.firstId) : undefined;
  const secondSeat = "secondId" in constraint ? knownSeat(order, constraint.secondId) : undefined;
  switch (constraint.kind) {
    case "LANDMARK_ANCHOR": {
      const seat = knownSeat(order, constraint.personId);
      return seat === undefined || seat === 0;
    }
    case "CYCLIC_POSITION": {
      const subjectSeat = knownSeat(order, constraint.subjectId);
      const referenceSeat = knownSeat(order, constraint.referenceId);
      const signedSteps = constraint.direction === "CLOCKWISE" ? constraint.steps : -constraint.steps;
      if (referenceSeat !== undefined) {
        const target = mod(referenceSeat + signedSteps, seatCount);
        const currentOccupant = occupant(order, target);
        return subjectSeat === undefined
          ? currentOccupant === undefined || currentOccupant === constraint.subjectId
          : subjectSeat === target;
      }
      if (subjectSeat !== undefined) {
        const requiredReference = mod(subjectSeat - signedSteps, seatCount);
        const currentOccupant = occupant(order, requiredReference);
        return currentOccupant === undefined || currentOccupant === constraint.referenceId;
      }
      return true;
    }
    case "RELATIVE_POSITION": {
      const subjectSeat = knownSeat(order, constraint.subjectId);
      const referenceSeat = knownSeat(order, constraint.referenceId);
      const signedSteps = constraint.direction === "LEFT" ? -constraint.steps : constraint.steps;
      if (referenceSeat !== undefined) {
        const target = mod(referenceSeat + signedSteps, seatCount);
        const currentOccupant = occupant(order, target);
        return subjectSeat === undefined
          ? currentOccupant === undefined || currentOccupant === constraint.subjectId
          : subjectSeat === target;
      }
      if (subjectSeat !== undefined) {
        const requiredReference = mod(subjectSeat - signedSteps, seatCount);
        const currentOccupant = occupant(order, requiredReference);
        return currentOccupant === undefined || currentOccupant === constraint.referenceId;
      }
      return true;
    }
    case "ADJACENT": {
      if (firstSeat === undefined || secondSeat === undefined) return true;
      const distance = mod(firstSeat - secondSeat, seatCount);
      return distance === 1 || distance === seatCount - 1;
    }
    case "NOT_ADJACENT": {
      if (firstSeat === undefined || secondSeat === undefined) return true;
      const distance = mod(firstSeat - secondSeat, seatCount);
      return distance !== 1 && distance !== seatCount - 1;
    }
    case "OPPOSITE": {
      if (seatCount % 2 !== 0) return false;
      if (firstSeat === undefined || secondSeat === undefined) {
        const known = firstSeat ?? secondSeat;
        const unknownId = firstSeat === undefined ? constraint.firstId : constraint.secondId;
        if (known === undefined) return true;
        const currentOccupant = occupant(order, known + seatCount / 2);
        return currentOccupant === undefined || currentOccupant === unknownId;
      }
      return mod(firstSeat - secondSeat, seatCount) === seatCount / 2;
    }
    case "DIRECTIONAL_COUNT_BETWEEN": {
      const steps = constraint.count + 1;
      const signedSteps = constraint.direction === "CLOCKWISE" ? steps : -steps;
      if (firstSeat !== undefined) {
        const target = mod(firstSeat + signedSteps, seatCount);
        const currentOccupant = occupant(order, target);
        return secondSeat === undefined
          ? currentOccupant === undefined || currentOccupant === constraint.secondId
          : secondSeat === target;
      }
      if (secondSeat !== undefined) {
        const requiredFirst = mod(secondSeat - signedSteps, seatCount);
        const currentOccupant = occupant(order, requiredFirst);
        return currentOccupant === undefined || currentOccupant === constraint.firstId;
      }
      return true;
    }
  }
}

export function enumerateOutwardOracle(input: OutwardSolveInput): readonly OutwardSolverModel[] {
  const seatCount = input.persons.length;
  const order = Array<OutwardPersonId | undefined>(seatCount).fill(undefined);
  const remaining = new Set(input.persons);
  const maximum = input.maxModels ?? Number.POSITIVE_INFINITY;
  const landmark = input.constraints.find((constraint) => constraint.kind === "LANDMARK_ANCHOR");
  const anchor = input.landmarkAnchored && landmark?.kind === "LANDMARK_ANCHOR"
    ? landmark.personId
    : [...input.persons].sort()[0];
  if (!anchor) throw new Error("Outward oracle requires an anchor");
  order[0] = anchor;
  remaining.delete(anchor);
  const modelByKey = new Map<string, OutwardSolverModel>();

  const fillSeat = (seatIndex: number): void => {
    if (modelByKey.size >= maximum) return;
    if (seatIndex === seatCount) {
      if (!input.constraints.every((constraint) => oracleCompatible(constraint, order))) return;
      const completed = order.map((personId) => {
        if (!personId) throw new Error("Incomplete outward oracle model");
        return personId;
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
