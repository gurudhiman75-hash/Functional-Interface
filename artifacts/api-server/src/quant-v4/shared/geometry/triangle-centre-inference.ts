import {
  ANGLE_180,
  add,
  angle,
  compare,
  multiply,
  rational,
  subtract,
  type ExactAngle,
} from "./exact";

export type TriangleCentreConcurrency =
  | "MEDIANS"
  | "ANGLE_BISECTORS"
  | "PERPENDICULAR_BISECTORS"
  | "ALTITUDES";

export type TriangleCentreName = "Centroid" | "Incentre" | "Circumcentre" | "Orthocentre";
export type RightTriangleOrthocentreLocation = "RIGHT_ANGLED_VERTEX";

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

export function rightTriangleOrthocentreLocation(): RightTriangleOrthocentreLocation {
  return "RIGHT_ANGLED_VERTEX";
}
