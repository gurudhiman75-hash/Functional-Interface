import { evaluateMixedConstraint } from "./constraints.ts";
import { MixedFacingRowTopology, mixedFacingModelKey } from "./topology.ts";
import type {
  MixedFacingConstraint,
  MixedFacingDirection,
  MixedFacingModel,
  MixedPersonId,
} from "./types.ts";

export interface MixedFacingSolveInput {
  readonly persons: readonly MixedPersonId[];
  readonly constraints: readonly MixedFacingConstraint[];
  readonly maxModels?: number;
}

function personWeight(constraint: MixedFacingConstraint, personId: MixedPersonId): number {
  switch (constraint.kind) {
    case "ABSOLUTE_SEAT": return constraint.personId === personId ? 10 : 0;
    case "AT_END": return constraint.personId === personId ? 7 : 0;
    case "FACING": return constraint.personId === personId ? 8 : 0;
    case "SAME_FACING":
    case "OPPOSITE_FACING": return constraint.firstId === personId || constraint.secondId === personId ? 6 : 0;
    case "RELATIVE_POSITION": return constraint.subjectId === personId || constraint.referenceId === personId ? 5 : 0;
    case "EXACT_COUNT_BETWEEN": return constraint.firstId === personId || constraint.secondId === personId ? 4 : 0;
    case "ADJACENT":
    case "NOT_ADJACENT": return constraint.firstId === personId || constraint.secondId === personId ? 3 : 0;
  }
}

function buildModel(
  placement: ReadonlyMap<MixedPersonId, number>,
  facings: ReadonlyMap<MixedPersonId, MixedFacingDirection>,
  persons: readonly MixedPersonId[],
): MixedFacingModel {
  const order = Array<MixedPersonId>(persons.length);
  const facingRecord: Record<MixedPersonId, MixedFacingDirection> = {};
  for (const [personId, seatIndex] of placement) order[seatIndex] = personId;
  for (const personId of persons) {
    const facing = facings.get(personId);
    if (!facing) throw new Error(`Missing facing for ${personId}`);
    facingRecord[personId] = facing;
  }
  if (order.some((personId) => personId === undefined)) throw new Error("Incomplete mixed-facing model");
  return { seatOrder: order, facings: facingRecord, canonicalKey: mixedFacingModelKey(order, facingRecord) };
}

export function enumerateMixedFacingProduction(input: MixedFacingSolveInput): readonly MixedFacingModel[] {
  const topology = new MixedFacingRowTopology(input.persons.length);
  const maximum = input.maxModels ?? Number.POSITIVE_INFINITY;
  const modelByKey = new Map<string, MixedFacingModel>();
  const facings = new Map<MixedPersonId, MixedFacingDirection>();
  const facingOrder = [...input.persons].sort((left, right) => {
    const rightWeight = input.constraints.reduce((sum, constraint) => sum + personWeight(constraint, right), 0);
    const leftWeight = input.constraints.reduce((sum, constraint) => sum + personWeight(constraint, left), 0);
    return rightWeight - leftWeight || left.localeCompare(right);
  });

  const solvePlacements = (): void => {
    const placement = new Map<MixedPersonId, number>();
    const usedSeats = new Set<number>();
    for (const constraint of input.constraints) {
      if (constraint.kind !== "ABSOLUTE_SEAT") continue;
      const existing = placement.get(constraint.personId);
      if ((existing !== undefined && existing !== constraint.seatIndex) || usedSeats.has(constraint.seatIndex)) return;
      placement.set(constraint.personId, constraint.seatIndex);
      usedSeats.add(constraint.seatIndex);
    }
    if (input.constraints.some((constraint) => evaluateMixedConstraint(constraint, placement, facings, topology) === "VIOLATED")) return;

    const remaining = input.persons
      .filter((personId) => !placement.has(personId))
      .sort((left, right) => {
        const rightWeight = input.constraints.reduce((sum, constraint) => sum + personWeight(constraint, right), 0);
        const leftWeight = input.constraints.reduce((sum, constraint) => sum + personWeight(constraint, left), 0);
        return rightWeight - leftWeight || left.localeCompare(right);
      });

    const place = (personIndex: number): void => {
      if (modelByKey.size >= maximum) return;
      if (personIndex === remaining.length) {
        if (input.constraints.some((constraint) => evaluateMixedConstraint(constraint, placement, facings, topology) !== "SATISFIED")) return;
        const model = buildModel(placement, facings, input.persons);
        modelByKey.set(model.canonicalKey, model);
        return;
      }
      const personId = remaining[personIndex];
      if (!personId) return;
      for (let seatIndex = 0; seatIndex < input.persons.length; seatIndex += 1) {
        if (usedSeats.has(seatIndex)) continue;
        placement.set(personId, seatIndex);
        usedSeats.add(seatIndex);
        if (!input.constraints.some((constraint) => evaluateMixedConstraint(constraint, placement, facings, topology) === "VIOLATED")) {
          place(personIndex + 1);
        }
        placement.delete(personId);
        usedSeats.delete(seatIndex);
        if (modelByKey.size >= maximum) return;
      }
    };
    place(0);
  };

  const assignFacing = (personIndex: number): void => {
    if (modelByKey.size >= maximum) return;
    if (personIndex === facingOrder.length) {
      solvePlacements();
      return;
    }
    const personId = facingOrder[personIndex];
    if (!personId) return;
    for (const facing of ["NORTH", "SOUTH"] as const) {
      facings.set(personId, facing);
      const placement = new Map<MixedPersonId, number>();
      const violated = input.constraints.some((constraint) => evaluateMixedConstraint(constraint, placement, facings, topology) === "VIOLATED");
      if (!violated) assignFacing(personIndex + 1);
      facings.delete(personId);
      if (modelByKey.size >= maximum) return;
    }
  };

  assignFacing(0);
  return [...modelByKey.values()].sort((left, right) => left.canonicalKey.localeCompare(right.canonicalKey));
}

function knownSeat(order: readonly (MixedPersonId | undefined)[], personId: MixedPersonId): number | undefined {
  const index = order.indexOf(personId);
  return index < 0 ? undefined : index;
}

function oracleFacingCompatible(
  constraint: MixedFacingConstraint,
  facings: ReadonlyMap<MixedPersonId, MixedFacingDirection>,
): boolean {
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
    default:
      return true;
  }
}

function oraclePlacementCompatible(
  constraint: MixedFacingConstraint,
  order: readonly (MixedPersonId | undefined)[],
  facings: ReadonlyMap<MixedPersonId, MixedFacingDirection>,
): boolean {
  const count = order.length;
  switch (constraint.kind) {
    case "ABSOLUTE_SEAT": {
      const seat = knownSeat(order, constraint.personId);
      return seat === undefined ? order[constraint.seatIndex] === undefined || order[constraint.seatIndex] === constraint.personId : seat === constraint.seatIndex;
    }
    case "AT_END": {
      const seat = knownSeat(order, constraint.personId);
      return seat === undefined || seat === 0 || seat === count - 1;
    }
    case "FACING":
    case "SAME_FACING":
    case "OPPOSITE_FACING":
      return oracleFacingCompatible(constraint, facings);
    case "RELATIVE_POSITION": {
      const subjectSeat = knownSeat(order, constraint.subjectId);
      const referenceSeat = knownSeat(order, constraint.referenceId);
      const referenceFacing = facings.get(constraint.referenceId);
      if (referenceSeat === undefined || referenceFacing === undefined) return true;
      const delta = referenceFacing === "NORTH"
        ? (constraint.direction === "LEFT" ? -constraint.steps : constraint.steps)
        : (constraint.direction === "LEFT" ? constraint.steps : -constraint.steps);
      const target = referenceSeat + delta;
      if (target < 0 || target >= count) return false;
      const occupant = order[target];
      return subjectSeat === undefined ? occupant === undefined || occupant === constraint.subjectId : subjectSeat === target;
    }
    case "ADJACENT": {
      const first = knownSeat(order, constraint.firstId);
      const second = knownSeat(order, constraint.secondId);
      return first === undefined || second === undefined || Math.abs(first - second) === 1;
    }
    case "NOT_ADJACENT": {
      const first = knownSeat(order, constraint.firstId);
      const second = knownSeat(order, constraint.secondId);
      return first === undefined || second === undefined || Math.abs(first - second) !== 1;
    }
    case "EXACT_COUNT_BETWEEN": {
      const first = knownSeat(order, constraint.firstId);
      const second = knownSeat(order, constraint.secondId);
      return first === undefined || second === undefined || Math.abs(first - second) - 1 === constraint.count;
    }
  }
}

export function enumerateMixedFacingOracle(input: MixedFacingSolveInput): readonly MixedFacingModel[] {
  const maximum = input.maxModels ?? Number.POSITIVE_INFINITY;
  const models = new Map<string, MixedFacingModel>();
  const facings = new Map<MixedPersonId, MixedFacingDirection>();
  const persons = [...input.persons].sort();

  const fillSeats = (): void => {
    const order = Array<MixedPersonId | undefined>(persons.length).fill(undefined);
    const remaining = new Set<MixedPersonId>(persons);
    for (const constraint of input.constraints) {
      if (constraint.kind !== "ABSOLUTE_SEAT") continue;
      if (order[constraint.seatIndex] !== undefined && order[constraint.seatIndex] !== constraint.personId) return;
      order[constraint.seatIndex] = constraint.personId;
      remaining.delete(constraint.personId);
    }
    if (!input.constraints.every((constraint) => oraclePlacementCompatible(constraint, order, facings))) return;

    const fill = (seatIndex: number): void => {
      if (models.size >= maximum) return;
      if (seatIndex === order.length) {
        if (!input.constraints.every((constraint) => oraclePlacementCompatible(constraint, order, facings))) return;
        const completed = order.map((personId) => {
          if (!personId) throw new Error("Incomplete oracle order");
          return personId;
        });
        const facingRecord: Record<MixedPersonId, MixedFacingDirection> = {};
        for (const personId of persons) {
          const facing = facings.get(personId);
          if (!facing) throw new Error(`Missing oracle facing for ${personId}`);
          facingRecord[personId] = facing;
        }
        const canonicalKey = mixedFacingModelKey(completed, facingRecord);
        models.set(canonicalKey, { seatOrder: completed, facings: facingRecord, canonicalKey });
        return;
      }
      if (order[seatIndex] !== undefined) {
        fill(seatIndex + 1);
        return;
      }
      for (const personId of [...remaining].sort()) {
        order[seatIndex] = personId;
        remaining.delete(personId);
        if (input.constraints.every((constraint) => oraclePlacementCompatible(constraint, order, facings))) fill(seatIndex + 1);
        remaining.add(personId);
        order[seatIndex] = undefined;
        if (models.size >= maximum) return;
      }
    };
    fill(0);
  };

  const assignFacing = (personIndex: number): void => {
    if (models.size >= maximum) return;
    if (personIndex === persons.length) {
      fillSeats();
      return;
    }
    const personId = persons[personIndex];
    if (!personId) return;
    for (const facing of ["NORTH", "SOUTH"] as const) {
      facings.set(personId, facing);
      if (input.constraints.every((constraint) => oracleFacingCompatible(constraint, facings))) assignFacing(personIndex + 1);
      facings.delete(personId);
      if (models.size >= maximum) return;
    }
  };

  assignFacing(0);
  return [...models.values()].sort((left, right) => left.canonicalKey.localeCompare(right.canonicalKey));
}
