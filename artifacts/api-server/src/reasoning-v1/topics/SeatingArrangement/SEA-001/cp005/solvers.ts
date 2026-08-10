import { CircularTopology } from "../cp003/topology.ts";
import { evaluateMixedCircleConstraint } from "./constraints.ts";
import type {
  MixedCircleConstraint,
  MixedCircleFacing,
  MixedCircleModel,
  MixedCirclePersonId,
} from "./types.ts";

export interface MixedCircleSolveInput {
  readonly persons: readonly MixedCirclePersonId[];
  readonly constraints: readonly MixedCircleConstraint[];
  readonly maxModels?: number;
}

function modelKey(
  clockwiseOrder: readonly MixedCirclePersonId[],
  facings: Readonly<Record<MixedCirclePersonId, MixedCircleFacing>>,
): string {
  return `${clockwiseOrder.join(">")}|${[...clockwiseOrder]
    .sort()
    .map((personId) => `${personId}:${facings[personId]}`)
    .join(",")}`;
}

function buildModel(
  placement: ReadonlyMap<MixedCirclePersonId, number>,
  facings: ReadonlyMap<MixedCirclePersonId, MixedCircleFacing>,
  persons: readonly MixedCirclePersonId[],
): MixedCircleModel {
  const clockwiseOrder = Array<MixedCirclePersonId>(persons.length);
  const facingRecord: Record<MixedCirclePersonId, MixedCircleFacing> = {};
  for (const [personId, seatIndex] of placement) clockwiseOrder[seatIndex] = personId;
  for (const personId of persons) {
    const facing = facings.get(personId);
    if (!facing) throw new Error(`Missing mixed-circle facing for ${personId}`);
    facingRecord[personId] = facing;
  }
  if (clockwiseOrder.some((personId) => personId === undefined)) {
    throw new Error("Incomplete mixed-circle model");
  }
  return {
    clockwiseOrder,
    facings: facingRecord,
    canonicalKey: modelKey(clockwiseOrder, facingRecord),
  };
}

function personWeight(
  constraint: MixedCircleConstraint,
  personId: MixedCirclePersonId,
): number {
  switch (constraint.kind) {
    case "FACING":
      return constraint.personId === personId ? 9 : 0;
    case "SAME_FACING":
    case "OPPOSITE_FACING":
      return constraint.firstId === personId || constraint.secondId === personId ? 7 : 0;
    case "CONDITIONAL_FACING":
      return constraint.conditionPersonId === personId || constraint.targetPersonId === personId ? 8 : 0;
    case "RELATIVE_POSITION":
      return constraint.referenceId === personId ? 6 : constraint.subjectId === personId ? 4 : 0;
    case "CYCLIC_POSITION":
      return constraint.referenceId === personId || constraint.subjectId === personId ? 5 : 0;
    case "OPPOSITE":
    case "DIRECTIONAL_COUNT_BETWEEN":
      return constraint.firstId === personId || constraint.secondId === personId ? 4 : 0;
    case "ADJACENT":
      return constraint.firstId === personId || constraint.secondId === personId ? 2 : 0;
  }
}

export function enumerateMixedCircleProduction(
  input: MixedCircleSolveInput,
): readonly MixedCircleModel[] {
  const topology = new CircularTopology(input.persons.length);
  const maximum = input.maxModels ?? Number.POSITIVE_INFINITY;
  const modelByKey = new Map<string, MixedCircleModel>();
  const anchor = [...input.persons].sort()[0];
  if (!anchor) throw new Error("Mixed-circle solve requires an anchor");

  const facings = new Map<MixedCirclePersonId, MixedCircleFacing>();
  const facingOrder = [...input.persons].sort((left, right) => {
    const rightWeight = input.constraints.reduce(
      (sum, constraint) => sum + personWeight(constraint, right),
      0,
    );
    const leftWeight = input.constraints.reduce(
      (sum, constraint) => sum + personWeight(constraint, left),
      0,
    );
    return rightWeight - leftWeight || left.localeCompare(right);
  });

  const facingCompatible = (): boolean => !input.constraints.some((constraint) =>
    evaluateMixedCircleConstraint(
      constraint,
      new Map<MixedCirclePersonId, number>(),
      facings,
      topology,
    ) === "VIOLATED");

  const solvePlacements = (): void => {
    const placement = new Map<MixedCirclePersonId, number>([[anchor, 0]]);
    const usedSeats = new Set<number>([0]);
    if (input.constraints.some((constraint) =>
      evaluateMixedCircleConstraint(constraint, placement, facings, topology) === "VIOLATED")) {
      return;
    }

    const remaining = input.persons
      .filter((personId) => personId !== anchor)
      .sort((left, right) => {
        const rightWeight = input.constraints.reduce(
          (sum, constraint) => sum + personWeight(constraint, right),
          0,
        );
        const leftWeight = input.constraints.reduce(
          (sum, constraint) => sum + personWeight(constraint, left),
          0,
        );
        return rightWeight - leftWeight || left.localeCompare(right);
      });

    const place = (personIndex: number): void => {
      if (modelByKey.size >= maximum) return;
      if (personIndex === remaining.length) {
        if (input.constraints.some((constraint) =>
          evaluateMixedCircleConstraint(constraint, placement, facings, topology) !== "SATISFIED")) {
          return;
        }
        const model = buildModel(placement, facings, input.persons);
        modelByKey.set(model.canonicalKey, model);
        return;
      }

      const personId = remaining[personIndex];
      if (!personId) return;
      for (let seatIndex = 1; seatIndex < input.persons.length; seatIndex += 1) {
        if (usedSeats.has(seatIndex)) continue;
        placement.set(personId, seatIndex);
        usedSeats.add(seatIndex);
        if (!input.constraints.some((constraint) =>
          evaluateMixedCircleConstraint(constraint, placement, facings, topology) === "VIOLATED")) {
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
    for (const facing of ["CENTER", "OUTWARD"] as const) {
      facings.set(personId, facing);
      if (facingCompatible()) assignFacing(personIndex + 1);
      facings.delete(personId);
      if (modelByKey.size >= maximum) return;
    }
  };

  assignFacing(0);
  return [...modelByKey.values()].sort((left, right) =>
    left.canonicalKey.localeCompare(right.canonicalKey));
}

export function enumerateMixedCircleOracle(
  input: MixedCircleSolveInput,
): readonly MixedCircleModel[] {
  const topology = new CircularTopology(input.persons.length);
  const maximum = input.maxModels ?? Number.POSITIVE_INFINITY;
  const modelByKey = new Map<string, MixedCircleModel>();
  const anchor = [...input.persons].sort()[0];
  if (!anchor) throw new Error("Mixed-circle oracle requires an anchor");

  const clockwiseOrder = Array<MixedCirclePersonId | undefined>(input.persons.length)
    .fill(undefined);
  clockwiseOrder[0] = anchor;
  const remaining = new Set(input.persons.filter((personId) => personId !== anchor));

  const partialPlacement = (): Map<MixedCirclePersonId, number> => new Map(
    clockwiseOrder.flatMap((personId, seatIndex) =>
      personId === undefined ? [] : [[personId, seatIndex] as [MixedCirclePersonId, number]]),
  );

  const placementCompatible = (): boolean => !input.constraints.some((constraint) =>
    evaluateMixedCircleConstraint(
      constraint,
      partialPlacement(),
      new Map<MixedCirclePersonId, MixedCircleFacing>(),
      topology,
    ) === "VIOLATED");

  const assignFacings = (): void => {
    const facings = new Map<MixedCirclePersonId, MixedCircleFacing>();
    const persons = [...input.persons].sort();

    const assign = (personIndex: number): void => {
      if (modelByKey.size >= maximum) return;
      if (personIndex === persons.length) {
        const placement = partialPlacement();
        if (input.constraints.some((constraint) =>
          evaluateMixedCircleConstraint(constraint, placement, facings, topology) !== "SATISFIED")) {
          return;
        }
        const model = buildModel(placement, facings, input.persons);
        modelByKey.set(model.canonicalKey, model);
        return;
      }

      const personId = persons[personIndex];
      if (!personId) return;
      for (const facing of ["OUTWARD", "CENTER"] as const) {
        facings.set(personId, facing);
        const placement = partialPlacement();
        if (!input.constraints.some((constraint) =>
          evaluateMixedCircleConstraint(constraint, placement, facings, topology) === "VIOLATED")) {
          assign(personIndex + 1);
        }
        facings.delete(personId);
        if (modelByKey.size >= maximum) return;
      }
    };

    assign(0);
  };

  const fillSeat = (seatIndex: number): void => {
    if (modelByKey.size >= maximum) return;
    if (seatIndex === clockwiseOrder.length) {
      assignFacings();
      return;
    }
    if (clockwiseOrder[seatIndex] !== undefined) {
      fillSeat(seatIndex + 1);
      return;
    }

    for (const personId of [...remaining].sort()) {
      clockwiseOrder[seatIndex] = personId;
      remaining.delete(personId);
      if (placementCompatible()) fillSeat(seatIndex + 1);
      remaining.add(personId);
      clockwiseOrder[seatIndex] = undefined;
      if (modelByKey.size >= maximum) return;
    }
  };

  fillSeat(1);
  return [...modelByKey.values()].sort((left, right) =>
    left.canonicalKey.localeCompare(right.canonicalKey));
}
