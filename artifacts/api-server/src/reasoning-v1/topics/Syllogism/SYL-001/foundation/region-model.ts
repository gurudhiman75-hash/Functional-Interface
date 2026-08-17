import type {
  CanonicalModel,
  PrimitiveConstraint,
  RegionAssignment,
  TermId,
} from "./types";

export const SYL_001_MAX_TERMS = 5;

export function validateTermOrder(termOrder: readonly TermId[]): void {
  if (termOrder.length === 0) throw new Error("At least one term is required.");
  if (termOrder.length > SYL_001_MAX_TERMS) {
    throw new Error(`SYL-001 V1 supports at most ${SYL_001_MAX_TERMS} terms.`);
  }
  if (new Set(termOrder).size !== termOrder.length) {
    throw new Error("Term order must contain unique term IDs.");
  }
}

export function termBit(termOrder: readonly TermId[], term: TermId): number {
  const index = termOrder.indexOf(term);
  if (index < 0) throw new Error(`Unknown term ID: ${term}.`);
  return 1 << index;
}

export function regionHas(
  termOrder: readonly TermId[],
  mask: number,
  term: TermId,
): boolean {
  return (mask & termBit(termOrder, term)) !== 0;
}

export function allRegionMasks(termOrder: readonly TermId[]): readonly number[] {
  validateTermOrder(termOrder);
  return Array.from({ length: 1 << termOrder.length }, (_, mask) => mask);
}

export function constraintProhibitsRegion(
  constraint: PrimitiveConstraint,
  termOrder: readonly TermId[],
  mask: number,
): boolean {
  switch (constraint.kind) {
    case "ALL":
      return regionHas(termOrder, mask, constraint.subject)
        && !regionHas(termOrder, mask, constraint.predicate);
    case "NO":
      return regionHas(termOrder, mask, constraint.subject)
        && regionHas(termOrder, mask, constraint.predicate);
    case "EMPTY":
      return regionHas(termOrder, mask, constraint.term);
    case "SOME":
    case "SOME_NOT":
    case "EXISTS":
      return false;
    default: {
      const exhaustive: never = constraint;
      return Boolean(exhaustive);
    }
  }
}

export function regionSatisfiesObligation(
  constraint: PrimitiveConstraint,
  termOrder: readonly TermId[],
  mask: number,
): boolean {
  switch (constraint.kind) {
    case "EXISTS":
      return regionHas(termOrder, mask, constraint.term);
    case "SOME":
      return regionHas(termOrder, mask, constraint.subject)
        && regionHas(termOrder, mask, constraint.predicate);
    case "SOME_NOT":
      return regionHas(termOrder, mask, constraint.subject)
        && !regionHas(termOrder, mask, constraint.predicate);
    case "ALL":
    case "NO":
    case "EMPTY":
      return false;
    default: {
      const exhaustive: never = constraint;
      return Boolean(exhaustive);
    }
  }
}

export function isExistentialObligation(constraint: PrimitiveConstraint): boolean {
  return constraint.kind === "EXISTS"
    || constraint.kind === "SOME"
    || constraint.kind === "SOME_NOT";
}

export function regionAssignment(
  termOrder: readonly TermId[],
  mask: number,
): RegionAssignment {
  return {
    mask,
    memberTerms: termOrder.filter((term) => regionHas(termOrder, mask, term)),
  };
}

export function canonicalModel(
  termOrder: readonly TermId[],
  occupiedMasks: readonly number[],
): CanonicalModel {
  const uniqueMasks = [...new Set(occupiedMasks)].sort((a, b) => a - b);
  return {
    termOrder: [...termOrder],
    occupiedRegions: uniqueMasks.map((mask) => regionAssignment(termOrder, mask)),
  };
}

export function modelSatisfiesConstraints(
  model: CanonicalModel,
  constraints: readonly PrimitiveConstraint[],
): boolean {
  const masks = model.occupiedRegions.map((region) => region.mask);
  for (const constraint of constraints) {
    if (constraint.kind === "ALL" || constraint.kind === "NO" || constraint.kind === "EMPTY") {
      if (masks.some((mask) => constraintProhibitsRegion(constraint, model.termOrder, mask))) {
        return false;
      }
      continue;
    }
    if (!masks.some((mask) => regionSatisfiesObligation(constraint, model.termOrder, mask))) {
      return false;
    }
  }
  return true;
}
