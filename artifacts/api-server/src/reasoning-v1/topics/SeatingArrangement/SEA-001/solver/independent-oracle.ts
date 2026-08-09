import type { FacingDirection, LinearConstraint, PersonId, SolverModel } from "../types.ts";

function relativeTarget(reference: number, facing: FacingDirection, direction: "LEFT" | "RIGHT", steps: number): number {
  const sign = direction === "RIGHT" ? 1 : -1;
  return reference + (facing === "NORTH" ? sign : -sign) * steps;
}

function oracleSatisfied(
  constraint: LinearConstraint,
  positionOf: ReadonlyMap<PersonId, number>,
  seatCount: number,
  facing: FacingDirection,
): boolean {
  const p = (id: PersonId): number => {
    const value = positionOf.get(id);
    if (value === undefined) throw new Error(`Oracle missing ${id}`);
    return value;
  };
  switch (constraint.kind) {
    case "ABSOLUTE_SEAT":
      return p(constraint.personId) === constraint.seatIndex;
    case "AT_END":
      return p(constraint.personId) === 0 || p(constraint.personId) === seatCount - 1;
    case "AT_MIDDLE": {
      const position = p(constraint.personId);
      return seatCount % 2 === 1
        ? position === Math.floor(seatCount / 2)
        : position === seatCount / 2 - 1 || position === seatCount / 2;
    }
    case "RELATIVE_POSITION":
      return p(constraint.subjectId) === relativeTarget(p(constraint.referenceId), facing, constraint.direction, constraint.steps);
    case "ADJACENT":
      return Math.abs(p(constraint.firstId) - p(constraint.secondId)) === 1;
    case "NOT_ADJACENT":
      return Math.abs(p(constraint.firstId) - p(constraint.secondId)) !== 1;
    case "EXACT_COUNT_BETWEEN":
      return Math.abs(p(constraint.firstId) - p(constraint.secondId)) - 1 === constraint.count;
  }
}

function heapPermutations<T>(values: readonly T[]): T[][] {
  const working = [...values];
  const output: T[][] = [];
  const counters = Array(working.length).fill(0) as number[];
  output.push([...working]);
  let index = 0;
  while (index < working.length) {
    if ((counters[index] as number) < index) {
      const swapIndex = index % 2 === 0 ? 0 : (counters[index] as number);
      [working[swapIndex], working[index]] = [working[index] as T, working[swapIndex] as T];
      output.push([...working]);
      counters[index] = (counters[index] as number) + 1;
      index = 0;
    } else {
      counters[index] = 0;
      index += 1;
    }
  }
  return output;
}

export function enumerateLinearOracle(input: {
  readonly personIds: readonly PersonId[];
  readonly facing: FacingDirection;
  readonly constraints: readonly LinearConstraint[];
}): readonly SolverModel[] {
  const models: SolverModel[] = [];
  for (const seatOrder of heapPermutations(input.personIds)) {
    const positions = new Map(seatOrder.map((personId, index) => [personId, index] as const));
    if (input.constraints.every((constraint) => oracleSatisfied(constraint, positions, seatOrder.length, input.facing))) {
      models.push({
        seatOrder,
        facing: input.facing,
        canonicalKey: `${input.facing}|${seatOrder.join(">")}`,
      });
    }
  }
  return models.sort((left, right) => left.canonicalKey.localeCompare(right.canonicalKey));
}
