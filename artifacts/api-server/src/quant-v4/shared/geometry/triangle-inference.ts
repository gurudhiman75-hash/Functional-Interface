import {
  add,
  divide,
  equals,
  isPositive,
  multiply,
  rational,
  type Rational,
} from "./exact";

export interface RhsCongruenceEvidence {
  readonly leftRightAngle: boolean;
  readonly rightRightAngle: boolean;
  readonly leftHypotenuse: Rational;
  readonly rightHypotenuse: Rational;
  readonly leftLeg: Rational;
  readonly rightLeg: Rational;
}

export interface SssCongruenceEvidence {
  readonly leftSides: readonly [Rational, Rational, Rational];
  readonly rightSides: readonly [Rational, Rational, Rational];
}

function requirePositive(values: readonly Rational[], label: string): void {
  if (values.some((value) => !isPositive(value))) {
    throw new Error(`${label} requires positive segment lengths`);
  }
}

export function provesRhsCongruence(evidence: RhsCongruenceEvidence): boolean {
  requirePositive([
    evidence.leftHypotenuse,
    evidence.rightHypotenuse,
    evidence.leftLeg,
    evidence.rightLeg,
  ], "RHS congruence");
  return evidence.leftRightAngle
    && evidence.rightRightAngle
    && equals(evidence.leftHypotenuse, evidence.rightHypotenuse)
    && equals(evidence.leftLeg, evidence.rightLeg);
}

export function provesSssCongruence(evidence: SssCongruenceEvidence): boolean {
  requirePositive([...evidence.leftSides, ...evidence.rightSides], "SSS congruence");
  return evidence.leftSides.every((side, index) => equals(side, evidence.rightSides[index]));
}

export function provesAaSimilarity(
  firstAnglePairEqual: boolean,
  secondAnglePairEqual: boolean,
): boolean {
  return firstAnglePairEqual && secondAnglePairEqual;
}

export function exactScaleFactor(
  sourceSides: readonly Rational[],
  targetSides: readonly Rational[],
): Rational {
  if (sourceSides.length === 0 || sourceSides.length !== targetSides.length) {
    throw new Error("Similarity scale-factor proof requires matching non-empty side lists");
  }
  requirePositive([...sourceSides, ...targetSides], "Similarity scale factor");
  const factor = divide(targetSides[0], sourceSides[0]);
  for (let index = 1; index < sourceSides.length; index += 1) {
    if (!equals(divide(targetSides[index], sourceSides[index]), factor)) {
      throw new Error("Corresponding sides do not share one exact similarity scale factor");
    }
  }
  return factor;
}

export function solveCorrespondingLength(
  sourceKnown: Rational,
  targetKnown: Rational,
  sourceWanted: Rational,
): Rational {
  requirePositive([sourceKnown, targetKnown, sourceWanted], "Corresponding-length solve");
  return multiply(sourceWanted, divide(targetKnown, sourceKnown));
}

export function solveProportionalPartner(
  leftWeight: Rational,
  rightWeight: Rational,
  knownLeftPart: Rational,
): Rational {
  requirePositive([leftWeight, rightWeight, knownLeftPart], "Proportional segment solve");
  return multiply(knownLeftPart, divide(rightWeight, leftWeight));
}

export function centroidMedianSplit(medianLength: Rational): Readonly<{
  vertexToCentroid: Rational;
  centroidToMidpoint: Rational;
}> {
  requirePositive([medianLength], "Centroid median split");
  return Object.freeze({
    vertexToCentroid: multiply(medianLength, rational(2, 3)),
    centroidToMidpoint: multiply(medianLength, rational(1, 3)),
  });
}

export function angleBisectorBaseSplit(
  leftAdjacentSide: Rational,
  rightAdjacentSide: Rational,
  knownLeftBasePart: Rational,
): Rational {
  return solveProportionalPartner(leftAdjacentSide, rightAdjacentSide, knownLeftBasePart);
}

export function midpointTheoremSegment(oppositeSide: Rational): Rational {
  requirePositive([oppositeSide], "Midpoint theorem");
  return divide(oppositeSide, rational(2));
}

export function ratioSum(left: Rational, right: Rational): Rational {
  return add(left, right);
}
