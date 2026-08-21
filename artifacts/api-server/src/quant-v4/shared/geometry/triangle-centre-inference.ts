import {
  ANGLE_180,
  add,
  angle,
  compare,
  multiply,
  rational,
  subtract,
  type ExactAngle,
  type Rational,
} from "./exact";

export type TriangleCentreConcurrency =
  | "MEDIANS"
  | "ANGLE_BISECTORS"
  | "PERPENDICULAR_BISECTORS"
  | "ALTITUDES";

export type TriangleCentreName = "Centroid" | "Incentre" | "Circumcentre" | "Orthocentre";
export type RightTriangleOrthocentreLocation = "RIGHT_ANGLED_VERTEX";
export type CentroidKnownSegment = "VERTEX_TO_CENTROID" | "CENTROID_TO_MIDPOINT";

const CENTRE_BY_CONCURRENCY: Readonly<Record<TriangleCentreConcurrency, TriangleCentreName>> = Object.freeze({
  MEDIANS: "Centroid",
  ANGLE_BISECTORS: "Incentre",
  PERPENDICULAR_BISECTORS: "Circumcentre",
  ALTITUDES: "Orthocentre",
});

function requireInteriorTriangleAngle(value: ExactAngle, label: string): void {
  if (compare(value, angle(0)) <= 0 || compare(value, ANGLE_180) >= 0) {
    throw new Error(`${label} must lie strictly between 0° and 180°`);
  }
}

function requirePositiveLength(value: Rational, label: string): void {
  if (compare(value, rational(0)) <= 0) throw new Error(`${label} must be positive`);
}

export function identifyTriangleCentreFromConcurrency(
  concurrency: TriangleCentreConcurrency,
): TriangleCentreName {
  return CENTRE_BY_CONCURRENCY[concurrency];
}

export function incentreOppositeAngleFromVertexAngle(vertexAngle: ExactAngle): ExactAngle {
  requireInteriorTriangleAngle(vertexAngle, "Vertex angle");
  const half = multiply(vertexAngle, rational(1, 2));
  const result = add(angle(90), half);
  return angle(result.numerator, result.denominator);
}

export function vertexAngleFromIncentreOppositeAngle(incentreAngle: ExactAngle): ExactAngle {
  if (compare(incentreAngle, angle(90)) <= 0 || compare(incentreAngle, ANGLE_180) >= 0) {
    throw new Error("Incentre opposite angle must lie strictly between 90° and 180°");
  }
  const result = multiply(subtract(incentreAngle, angle(90)), rational(2));
  const exact = angle(result.numerator, result.denominator);
  requireInteriorTriangleAngle(exact, "Recovered vertex angle");
  return exact;
}

export function medianLengthFromCentroidSegment(
  segmentLength: Rational,
  knownSegment: CentroidKnownSegment,
): Rational {
  requirePositiveLength(segmentLength, "Centroid segment length");
  return knownSegment === "VERTEX_TO_CENTROID"
    ? multiply(segmentLength, rational(3, 2))
    : multiply(segmentLength, rational(3));
}

export function rightTriangleOrthocentreLocation(): RightTriangleOrthocentreLocation {
  return "RIGHT_ANGLED_VERTEX";
}
