import type { SpatialPoint } from "./types";

export interface AffineTransform {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export const IDENTITY_TRANSFORM: AffineTransform = {
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  e: 0,
  f: 0,
};

export function degreesToRadians(angleDeg: number): number {
  return (angleDeg * Math.PI) / 180;
}

export function radiansToDegrees(angleRad: number): number {
  return (angleRad * 180) / Math.PI;
}

export function normalizeAngleDeg(angleDeg: number): number {
  const normalized = angleDeg % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function applyAffineTransform(
  point: SpatialPoint,
  transform: AffineTransform,
): SpatialPoint {
  return {
    x: transform.a * point.x + transform.c * point.y + transform.e,
    y: transform.b * point.x + transform.d * point.y + transform.f,
  };
}

export function composeAffineTransforms(
  after: AffineTransform,
  before: AffineTransform,
): AffineTransform {
  return {
    a: after.a * before.a + after.c * before.b,
    b: after.b * before.a + after.d * before.b,
    c: after.a * before.c + after.c * before.d,
    d: after.b * before.c + after.d * before.d,
    e: after.a * before.e + after.c * before.f + after.e,
    f: after.b * before.e + after.d * before.f + after.f,
  };
}

export function determinant(transform: AffineTransform): number {
  return transform.a * transform.d - transform.b * transform.c;
}

export function translationTransform(dx: number, dy: number): AffineTransform {
  return { a: 1, b: 0, c: 0, d: 1, e: dx, f: dy };
}

export function rotationTransform(
  angleDeg: number,
  pivot: SpatialPoint = { x: 0, y: 0 },
): AffineTransform {
  const angleRad = degreesToRadians(angleDeg);
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  return {
    a: cos,
    b: sin,
    c: -sin,
    d: cos,
    e: pivot.x - cos * pivot.x + sin * pivot.y,
    f: pivot.y - sin * pivot.x - cos * pivot.y,
  };
}

export function reflectionAcrossLineTransform(
  lineStart: SpatialPoint,
  lineEnd: SpatialPoint,
): AffineTransform {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const lengthSquared = dx * dx + dy * dy;

  if (!Number.isFinite(lengthSquared) || lengthSquared <= 0) {
    throw new Error("Reflection line must contain two distinct finite points.");
  }

  const cos2 = (dx * dx - dy * dy) / lengthSquared;
  const sin2 = (2 * dx * dy) / lengthSquared;

  const originReflection: AffineTransform = {
    a: cos2,
    b: sin2,
    c: sin2,
    d: -cos2,
    e: 0,
    f: 0,
  };

  return composeAffineTransforms(
    translationTransform(lineStart.x, lineStart.y),
    composeAffineTransforms(
      originReflection,
      translationTransform(-lineStart.x, -lineStart.y),
    ),
  );
}

export function verticalReflectionTransform(axisX: number): AffineTransform {
  return reflectionAcrossLineTransform(
    { x: axisX, y: 0 },
    { x: axisX, y: 1 },
  );
}

export function horizontalReflectionTransform(axisY: number): AffineTransform {
  return reflectionAcrossLineTransform(
    { x: 0, y: axisY },
    { x: 1, y: axisY },
  );
}

export function pointAtAngle(
  center: SpatialPoint,
  radius: number,
  angleDeg: number,
): SpatialPoint {
  const angleRad = degreesToRadians(angleDeg);
  return {
    x: center.x + radius * Math.cos(angleRad),
    y: center.y + radius * Math.sin(angleRad),
  };
}

export function angleFromCenter(
  center: SpatialPoint,
  point: SpatialPoint,
): number {
  return normalizeAngleDeg(
    radiansToDegrees(Math.atan2(point.y - center.y, point.x - center.x)),
  );
}

export function isRigidTransform(
  transform: AffineTransform,
  tolerance = 1e-9,
): boolean {
  const columnOneLength = Math.hypot(transform.a, transform.b);
  const columnTwoLength = Math.hypot(transform.c, transform.d);
  const dot = transform.a * transform.c + transform.b * transform.d;

  return (
    Math.abs(columnOneLength - 1) <= tolerance &&
    Math.abs(columnTwoLength - 1) <= tolerance &&
    Math.abs(dot) <= tolerance &&
    Math.abs(Math.abs(determinant(transform)) - 1) <= tolerance
  );
}
