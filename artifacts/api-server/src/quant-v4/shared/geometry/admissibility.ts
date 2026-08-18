import { compare, equals, isPositive, isZero, rational, type Rational } from "./exact";
import type { ExactCoordinate } from "./point";
import { squaredDistance } from "./incidence";
import { areParallelVectors, arePerpendicularVectors, cross, vectorBetween } from "./vector";

export type QuadrilateralFamily =
  | "GENERAL"
  | "PARALLELOGRAM"
  | "RECTANGLE"
  | "RHOMBUS"
  | "SQUARE"
  | "TRAPEZIUM"
  | "KITE";

export interface QuadrilateralClassification {
  readonly valid: boolean;
  readonly convex: boolean;
  readonly families: readonly QuadrilateralFamily[];
  readonly errors: readonly string[];
}

function orientation(a: ExactCoordinate, b: ExactCoordinate, c: ExactCoordinate): Rational {
  return cross(vectorBetween(a, b), vectorBetween(a, c));
}

function oppositeEdgesCross(
  a: ExactCoordinate,
  b: ExactCoordinate,
  c: ExactCoordinate,
  d: ExactCoordinate,
): boolean {
  const o1 = compare(orientation(a, b, c), rational(0));
  const o2 = compare(orientation(a, b, d), rational(0));
  const o3 = compare(orientation(c, d, a), rational(0));
  const o4 = compare(orientation(c, d, b), rational(0));
  return o1 !== 0 && o2 !== 0 && o3 !== 0 && o4 !== 0 && o1 !== o2 && o3 !== o4;
}

export function classifyQuadrilateral(
  points: readonly [ExactCoordinate, ExactCoordinate, ExactCoordinate, ExactCoordinate],
): QuadrilateralClassification {
  const [a, b, c, d] = points;
  const errors: string[] = [];
  const edgeSquares = [
    squaredDistance(a, b),
    squaredDistance(b, c),
    squaredDistance(c, d),
    squaredDistance(d, a),
  ];
  if (edgeSquares.some(isZero)) errors.push("NON_ZERO_EDGES_REQUIRED");
  if (oppositeEdgesCross(a, b, c, d) || oppositeEdgesCross(b, c, d, a)) {
    errors.push("NON_ADJACENT_EDGES_CROSS");
  }

  const turns = [orientation(a, b, c), orientation(b, c, d), orientation(c, d, a), orientation(d, a, b)];
  const turnSigns = turns.map((turn) => compare(turn, rational(0)));
  const convex = turnSigns.every((sign) => sign !== 0)
    && (turnSigns.every((sign) => sign > 0) || turnSigns.every((sign) => sign < 0));
  if (!convex) errors.push("VERTEX_ORDER_OR_CONVEXITY_INVALID");

  const ab = vectorBetween(a, b);
  const bc = vectorBetween(b, c);
  const cd = vectorBetween(c, d);
  const da = vectorBetween(d, a);
  const ac = vectorBetween(a, c);
  const bd = vectorBetween(b, d);

  const abCd = areParallelVectors(ab, cd);
  const bcDa = areParallelVectors(bc, da);
  const adjacentPerpendicular = arePerpendicularVectors(ab, bc);
  const allSidesEqual = edgeSquares.every((side) => equals(side, edgeSquares[0]));
  const oppositeSidesEqual = equals(edgeSquares[0], edgeSquares[2]) && equals(edgeSquares[1], edgeSquares[3]);
  const diagonalsEqual = equals(squaredDistance(a, c), squaredDistance(b, d));
  const diagonalsPerpendicular = arePerpendicularVectors(ac, bd);

  const families: QuadrilateralFamily[] = [];
  if (errors.length === 0) families.push("GENERAL");
  const parallelogram = errors.length === 0 && abCd && bcDa && oppositeSidesEqual;
  if (parallelogram) families.push("PARALLELOGRAM");
  const rectangle = parallelogram && adjacentPerpendicular && diagonalsEqual;
  if (rectangle) families.push("RECTANGLE");
  const rhombus = parallelogram && allSidesEqual && diagonalsPerpendicular;
  if (rhombus) families.push("RHOMBUS");
  const square = rectangle && rhombus;
  if (square) families.push("SQUARE");
  const exactlyOneParallelPair = (abCd ? 1 : 0) + (bcDa ? 1 : 0) === 1;
  if (errors.length === 0 && exactlyOneParallelPair) families.push("TRAPEZIUM");
  const kite = errors.length === 0
    && ((equals(edgeSquares[0], edgeSquares[1]) && equals(edgeSquares[2], edgeSquares[3]))
      || (equals(edgeSquares[1], edgeSquares[2]) && equals(edgeSquares[3], edgeSquares[0])))
    && !allSidesEqual;
  if (kite) families.push("KITE");

  return Object.freeze({
    valid: errors.length === 0,
    convex,
    families: Object.freeze(families),
    errors: Object.freeze(errors),
  });
}

const STRONGER_SUBTYPES: Readonly<Record<QuadrilateralFamily, readonly QuadrilateralFamily[]>> = Object.freeze({
  GENERAL: Object.freeze(["PARALLELOGRAM", "RECTANGLE", "RHOMBUS", "SQUARE", "TRAPEZIUM", "KITE"] as QuadrilateralFamily[]),
  PARALLELOGRAM: Object.freeze(["RECTANGLE", "RHOMBUS", "SQUARE"] as QuadrilateralFamily[]),
  RECTANGLE: Object.freeze(["SQUARE"] as QuadrilateralFamily[]),
  RHOMBUS: Object.freeze(["SQUARE"] as QuadrilateralFamily[]),
  SQUARE: Object.freeze([] as QuadrilateralFamily[]),
  TRAPEZIUM: Object.freeze([] as QuadrilateralFamily[]),
  KITE: Object.freeze([] as QuadrilateralFamily[]),
});

export function validateIntendedQuadrilateral(
  points: readonly [ExactCoordinate, ExactCoordinate, ExactCoordinate, ExactCoordinate],
  intended: QuadrilateralFamily,
  options: Readonly<{ allowStrongerSubtype?: boolean }> = {},
): QuadrilateralClassification {
  const classification = classifyQuadrilateral(points);
  const errors = [...classification.errors];
  if (!classification.families.includes(intended)) errors.push(`INTENDED_${intended}_NOT_PROVEN`);
  if (!options.allowStrongerSubtype) {
    for (const stronger of STRONGER_SUBTYPES[intended]) {
      if (classification.families.includes(stronger)) errors.push(`UNINTENDED_STRONGER_SUBTYPE_${stronger}`);
    }
  }
  return Object.freeze({
    ...classification,
    valid: errors.length === 0,
    errors: Object.freeze(errors),
  });
}

export function triangleSidesAdmissible(a: Rational, b: Rational, c: Rational): boolean {
  if (![a, b, c].every(isPositive)) return false;
  const add = (x: Rational, y: Rational) => rational(
    x.numerator * y.denominator + y.numerator * x.denominator,
    x.denominator * y.denominator,
  );
  return compare(add(a, b), c) > 0 && compare(add(b, c), a) > 0 && compare(add(c, a), b) > 0;
}
