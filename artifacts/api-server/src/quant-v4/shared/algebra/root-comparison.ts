import { compareRational, equalsRational, type Rational } from "./rational";
import { compareQuadraticSurdExact } from "./exact-real";
import { rationalAsSurd, type QuadraticSurd } from "./quadratic-surd";
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
  throw new Error("Requested rational roots from a non-rational quadratic state");
}

export function exactRootsFromQuadraticState(state: QuadraticRootState): QuadraticSurd[] {
  if (state.kind === "REPEATED_ROOT") return [rationalAsSurd(state.root)];
  if (state.kind === "TWO_RATIONAL_ROOTS") {
    return equalsRational(state.roots[0], state.roots[1])
      ? [rationalAsSurd(state.roots[0])]
      : state.roots.map(rationalAsSurd);
  }
  if (state.kind === "TWO_IRRATIONAL_ROOTS") return [...state.roots];
  throw new Error("Banking root comparison requires real roots");
}

function classifyComparisons(relations: Array<-1 | 0 | 1>): RootSetRelation {
  if (relations.every((value) => value === 0)) return "X_EQUAL_TO_Y";
  if (relations.every((value) => value > 0)) return "X_GREATER_THAN_Y";
  if (relations.every((value) => value < 0)) return "X_LESS_THAN_Y";
  if (relations.every((value) => value >= 0)) return "X_GREATER_THAN_OR_EQUAL_TO_Y";
  if (relations.every((value) => value <= 0)) return "X_LESS_THAN_OR_EQUAL_TO_Y";
  return "RELATION_CANNOT_BE_ESTABLISHED";
}

export function compareRootSets(xRoots: Rational[], yRoots: Rational[]): RootSetRelation {
  if (xRoots.length === 0 || yRoots.length === 0) throw new Error("Root-set comparison requires non-empty root sets");
  const relations: Array<-1 | 0 | 1> = [];
  for (const x of xRoots) for (const y of yRoots) relations.push(compareRational(x, y));
  return classifyComparisons(relations);
}

export function compareExactRootSets(xRoots: QuadraticSurd[], yRoots: QuadraticSurd[]): RootSetRelation {
  if (xRoots.length === 0 || yRoots.length === 0) throw new Error("Root-set comparison requires non-empty root sets");
  const relations: Array<-1 | 0 | 1> = [];
  for (const x of xRoots) for (const y of yRoots) relations.push(compareQuadraticSurdExact(x, y));
  return classifyComparisons(relations);
}
