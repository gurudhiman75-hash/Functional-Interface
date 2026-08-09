import type { EnumerationResult } from "../../../../shared/constraint-core/types.ts";
import { evaluateConstraint } from "../constraints/evaluate.ts";
import { LinearTopology } from "../topology/linear.ts";
import type { FacingDirection, LinearConstraint, PersonId, SolverModel } from "../types.ts";

export interface SolveLinearInput {
  readonly personIds: readonly PersonId[];
  readonly facing: FacingDirection;
  readonly constraints: readonly LinearConstraint[];
  readonly maxModels?: number;
}

function canonicalKey(seatOrder: readonly PersonId[], facing: FacingDirection): string {
  return `${facing}|${seatOrder.join(">")}`;
}

export function solveLinear(input: SolveLinearInput): EnumerationResult<SolverModel> {
  const topology = new LinearTopology(input.personIds.length);
  const maxModels = input.maxModels ?? Number.POSITIVE_INFINITY;
  const models: SolverModel[] = [];
  const placement = new Map<PersonId, number>();
  const used = new Set<PersonId>();
  let exploredNodes = 0;
  let truncated = false;

  const constraintsByPerson = new Map<PersonId, LinearConstraint[]>();
  for (const constraint of input.constraints) {
    const ids = (() => {
      switch (constraint.kind) {
        case "ABSOLUTE_SEAT":
        case "AT_END":
        case "AT_MIDDLE":
          return [constraint.personId];
        case "RELATIVE_POSITION":
          return [constraint.subjectId, constraint.referenceId];
        case "ADJACENT":
        case "NOT_ADJACENT":
        case "EXACT_COUNT_BETWEEN":
          return [constraint.firstId, constraint.secondId];
      }
    })();
    for (const id of ids) {
      const bucket = constraintsByPerson.get(id) ?? [];
      bucket.push(constraint);
      constraintsByPerson.set(id, bucket);
    }
  }

  function viableAfter(personId: PersonId): boolean {
    const relevant = constraintsByPerson.get(personId) ?? [];
    return relevant.every((constraint) => evaluateConstraint(constraint, placement, topology, input.facing) !== "VIOLATED");
  }

  function search(seatIndex: number): void {
    if (models.length >= maxModels) {
      truncated = true;
      return;
    }
    exploredNodes += 1;
    if (seatIndex === input.personIds.length) {
      if (input.constraints.every((constraint) => evaluateConstraint(constraint, placement, topology, input.facing) === "SATISFIED")) {
        const seatOrder = Array.from({ length: input.personIds.length }, (_, index) => {
          const found = [...placement.entries()].find(([, seat]) => seat === index);
          if (!found) throw new Error(`Missing occupant for seat ${index}`);
          return found[0];
        });
        models.push({ seatOrder, facing: input.facing, canonicalKey: canonicalKey(seatOrder, input.facing) });
      }
      return;
    }

    for (const personId of input.personIds) {
      if (used.has(personId)) continue;
      used.add(personId);
      placement.set(personId, seatIndex);
      if (viableAfter(personId)) search(seatIndex + 1);
      placement.delete(personId);
      used.delete(personId);
      if (truncated) return;
    }
  }

  search(0);
  return { models, truncated, exploredNodes };
}
