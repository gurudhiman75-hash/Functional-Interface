import { compareRational, equalsRational, type Rational } from "./rational";
import type { QuadraticRootState } from "./quadratic";

export type RootSetRelation =
  | "X_GREATER_THAN_Y"
  | "X_LESS_THAN_Y"
  | "X_GREATER_THAN_OR_EQUAL_TO_Y"
  | "X_LESS_THAN_OR_EQUAL_TO_Y"
  | "X_EQUAL_TO_Y"
  | "RELATION_CANNOT_BE_ESTABLISHED";

export function rationalRootsFromQuadraticState(state: QuadraticRootState): Rational[] {
  if (state.kind === "REPEATED_ROOT") return [state.root];
  if (state.kind === "TWO_RATIONAL_ROOTS") {
    return equalsRational(state.roots[0], state.roots[1]) ? [state.roots[0]] : [...state.roots];
  }
  throw new Error("Banking root comparison currently requires real rational roots");
}

export function compareRootSets(xRoots: Rational[], yRoots: Rational[]): RootSetRelation {
  if (xRoots.length === 0 || yRoots.length === 0) throw new Error("Root-set comparison requires non-empty root sets");
  const relations: Array<-1 | 0 | 1> = [];
  for (const x of xRoots) {
    for (const y of yRoots) relations.push(compareRational(x, y));
  }

  if (relations.every((value) => value === 0)) return "X_EQUAL_TO_Y";
  if (relations.every((value) => value > 0)) return "X_GREATER_THAN_Y";
  if (relations.every((value) => value < 0)) return "X_LESS_THAN_Y";
  if (relations.every((value) => value >= 0)) return "X_GREATER_THAN_OR_EQUAL_TO_Y";
  if (relations.every((value) => value <= 0)) return "X_LESS_THAN_OR_EQUAL_TO_Y";
  return "RELATION_CANNOT_BE_ESTABLISHED";
}
