export type TriangleCentreConcurrency =
  | "MEDIANS"
  | "ANGLE_BISECTORS"
  | "PERPENDICULAR_BISECTORS"
  | "ALTITUDES";

export type TriangleCentreName = "Centroid" | "Incentre" | "Circumcentre" | "Orthocentre";

const CENTRE_BY_CONCURRENCY: Readonly<Record<TriangleCentreConcurrency, TriangleCentreName>> = Object.freeze({
  MEDIANS: "Centroid",
  ANGLE_BISECTORS: "Incentre",
  PERPENDICULAR_BISECTORS: "Circumcentre",
  ALTITUDES: "Orthocentre",
});

export function identifyTriangleCentreFromConcurrency(
  concurrency: TriangleCentreConcurrency,
): TriangleCentreName {
  return CENTRE_BY_CONCURRENCY[concurrency];
}
