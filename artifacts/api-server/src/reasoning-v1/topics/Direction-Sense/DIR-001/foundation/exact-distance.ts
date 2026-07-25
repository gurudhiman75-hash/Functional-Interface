export type DistanceDisplayMode = "INTEGER" | "RADICAL" | "DECIMAL_1";

export interface ExactDistanceValue {
  readonly dx: number;
  readonly dy: number;
  readonly squaredDistance: number;
  readonly distance: number;
  readonly exactInteger: number | null;
  readonly radicalCoefficient: number;
  readonly radicalRadicand: number;
}

function greatestSquareFactor(value: number): number {
  const limit = Math.floor(Math.sqrt(value));
  for (let candidate = limit; candidate >= 2; candidate -= 1) {
    if (value % (candidate * candidate) === 0) return candidate;
  }
  return 1;
}

export function exactDistanceFromComponents(dx: number, dy: number, epsilon = 1e-9): ExactDistanceValue {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) {
    throw new Error(`Distance components must be finite, received (${dx}, ${dy})`);
  }
  const squaredDistance = dx * dx + dy * dy;
  const distance = Math.sqrt(squaredDistance);
  const nearestInteger = Math.round(distance);
  const exactInteger = Math.abs(distance - nearestInteger) <= epsilon ? nearestInteger : null;

  if (Math.abs(squaredDistance - Math.round(squaredDistance)) > epsilon) {
    throw new Error(`Exact radical formatting requires an integer squared distance, received ${squaredDistance}`);
  }
  const integerSquaredDistance = Math.round(squaredDistance);
  const factor = greatestSquareFactor(integerSquaredDistance);
  return {
    dx,
    dy,
    squaredDistance: integerSquaredDistance,
    distance,
    exactInteger,
    radicalCoefficient: factor,
    radicalRadicand: integerSquaredDistance / (factor * factor),
  };
}

export function formatDistanceValue(value: ExactDistanceValue, mode: DistanceDisplayMode): string {
  if (mode === "INTEGER") {
    if (value.exactInteger === null) {
      throw new Error(`INTEGER distance display requested for non-integer distance ${value.distance}`);
    }
    return String(value.exactInteger);
  }
  if (mode === "DECIMAL_1") return value.distance.toFixed(1);
  if (value.exactInteger !== null) return String(value.exactInteger);
  if (value.radicalCoefficient === 1) return `√${value.radicalRadicand}`;
  return `${value.radicalCoefficient}√${value.radicalRadicand}`;
}

export function formatDistanceWithUnit(value: ExactDistanceValue, mode: DistanceDisplayMode): string {
  const rendered = formatDistanceValue(value, mode);
  return `${rendered} ${rendered === "1" || rendered === "1.0" ? "metre" : "metres"}`;
}
