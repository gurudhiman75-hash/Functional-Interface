import { atomicOrderForValues, relationAcceptsAtomicOrder } from "./relations";
import type {
  AtomicOrder,
  ComparisonConstraint,
  ModelEnumerationOptions,
  ModelEnumerationResult,
  NumericAssignment,
} from "./types";

const ATOMIC_ORDER_SEQUENCE: readonly AtomicOrder[] = ["LT", "EQ", "GT"];

function entitiesFor(
  constraints: readonly ComparisonConstraint[],
  leftId: string,
  rightId: string,
): string[] {
  return [
    ...new Set([
      leftId,
      rightId,
      ...constraints.flatMap((constraint) => [
        constraint.leftId,
        constraint.rightId,
      ]),
    ]),
  ].sort();
}

function assignmentSatisfies(
  constraints: readonly ComparisonConstraint[],
  assignment: NumericAssignment,
): boolean {
  return constraints.every((constraint) =>
    relationAcceptsAtomicOrder(
      constraint.relation,
      atomicOrderForValues(
        assignment[constraint.leftId]!,
        assignment[constraint.rightId]!,
      ),
    ),
  );
}

export function enumeratePairRelationModels(
  constraints: readonly ComparisonConstraint[],
  leftId: string,
  rightId: string,
  options: ModelEnumerationOptions = {},
): ModelEnumerationResult {
  const entities = entitiesFor(constraints, leftId, rightId);
  const maxEntities = options.maxEntities ?? 7;
  const maxAssignments = options.maxAssignments ?? 1_000_000;
  if (entities.some((entityId) => entityId.trim().length === 0)) {
    throw new Error("Inequality entities must use non-empty identifiers.");
  }
  if (entities.length > maxEntities) {
    throw new Error(
      `Bounded model enumeration supports at most ${maxEntities} entities; received ${entities.length}.`,
    );
  }

  const domainSize = Math.max(1, entities.length);
  const possible = new Set<AtomicOrder>();
  const witnessByRelation: Partial<Record<AtomicOrder, NumericAssignment>> = {};
  let validModelCount = 0;
  let evaluatedAssignmentCount = 0;
  let truncated = false;
  const values = new Array<number>(entities.length).fill(0);

  const visit = (index: number): void => {
    if (truncated) return;
    if (index < entities.length) {
      for (let value = 0; value < domainSize; value += 1) {
        values[index] = value;
        visit(index + 1);
        if (truncated) return;
      }
      return;
    }

    if (evaluatedAssignmentCount >= maxAssignments) {
      truncated = true;
      return;
    }
    evaluatedAssignmentCount += 1;
    const assignment = Object.fromEntries(
      entities.map((entityId, entityIndex) => [entityId, values[entityIndex]!]),
    );
    if (!assignmentSatisfies(constraints, assignment)) return;

    validModelCount += 1;
    const order = atomicOrderForValues(
      assignment[leftId]!,
      assignment[rightId]!,
    );
    possible.add(order);
    witnessByRelation[order] ??= assignment;
  };

  visit(0);

  return {
    entities,
    validModelCount,
    evaluatedAssignmentCount,
    possibleAtomicRelations: ATOMIC_ORDER_SEQUENCE.filter((order) =>
      possible.has(order),
    ),
    witnessByRelation,
    truncated,
  };
}
