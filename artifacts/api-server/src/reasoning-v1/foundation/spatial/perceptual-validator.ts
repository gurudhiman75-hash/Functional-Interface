import type { SpatialProofOption } from "./proof-types";
import type {
  SpatialCircleNode,
  SpatialLineNode,
  SpatialNode,
  SpatialPoint,
  SpatialScene,
} from "./types";

export interface SpatialPerceptualValidation {
  ok: boolean;
  minimumDistance: number;
  closestPair: [number, number] | null;
  errors: string[];
}

function distance(a: SpatialPoint, b: SpatialPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointToSegmentDistance(
  point: SpatialPoint,
  start: SpatialPoint,
  end: SpatialPoint,
): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return distance(point, start);
  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - start.x) * dx + (point.y - start.y) * dy) /
        lengthSquared,
    ),
  );
  return distance(point, { x: start.x + t * dx, y: start.y + t * dy });
}

function nodeDistanceFromPoint(point: SpatialPoint, node: SpatialNode): number {
  if (node.kind === "circle") {
    return Math.max(0, distance(point, node.center) - node.radius);
  }
  if (node.kind === "line") {
    return pointToSegmentDistance(point, node.start, node.end);
  }
  if (node.kind === "polygon" || node.kind === "polyline") {
    let minimum = Number.POSITIVE_INFINITY;
    for (let index = 0; index < node.points.length - 1; index += 1) {
      minimum = Math.min(
        minimum,
        pointToSegmentDistance(point, node.points[index]!, node.points[index + 1]!),
      );
    }
    if (node.kind === "polygon" && node.points.length > 2) {
      minimum = Math.min(
        minimum,
        pointToSegmentDistance(
          point,
          node.points[node.points.length - 1]!,
          node.points[0]!,
        ),
      );
    }
    return minimum;
  }
  return Math.abs(distance(point, node.center) - node.radius);
}

function lineByRole(scene: SpatialScene, role: string): SpatialLineNode {
  const node = scene.nodes.find(
    (candidate): candidate is SpatialLineNode =>
      candidate.kind === "line" && candidate.role === role,
  );
  if (!node) throw new Error(`Clock scene is missing '${role}'.`);
  return node;
}

export function validateClockOptionPerceptualSeparation(
  options: readonly SpatialProofOption[],
  minimumEndpointDistance = 8,
): SpatialPerceptualValidation {
  let minimumDistance = Number.POSITIVE_INFINITY;
  let closestPair: [number, number] | null = null;
  const errors: string[] = [];

  for (let left = 0; left < options.length; left += 1) {
    for (let right = left + 1; right < options.length; right += 1) {
      const leftHour = lineByRole(options[left]!.scene, "hour-hand");
      const rightHour = lineByRole(options[right]!.scene, "hour-hand");
      const leftMinute = lineByRole(options[left]!.scene, "minute-hand");
      const rightMinute = lineByRole(options[right]!.scene, "minute-hand");
      const visualDistance = Math.max(
        distance(leftHour.end, rightHour.end),
        distance(leftMinute.end, rightMinute.end),
      );
      if (visualDistance < minimumDistance) {
        minimumDistance = visualDistance;
        closestPair = [left, right];
      }
      if (visualDistance < minimumEndpointDistance) {
        errors.push(
          `Clock options ${left + 1} and ${right + 1} are only ${visualDistance.toFixed(
            2,
          )} units apart.`,
        );
      }
    }
  }

  return {
    ok: errors.length === 0,
    minimumDistance:
      minimumDistance === Number.POSITIVE_INFINITY ? 0 : minimumDistance,
    closestPair,
    errors,
  };
}

export function validateMarkerClearance(
  scene: SpatialScene,
  minimumGap = 4,
): SpatialPerceptualValidation {
  const marker = scene.nodes.find(
    (node): node is SpatialCircleNode => node.kind === "circle" && node.id === "marker",
  );
  if (!marker) {
    return { ok: true, minimumDistance: Number.POSITIVE_INFINITY, closestPair: null, errors: [] };
  }

  const tracked = scene.nodes.filter(
    (node) => node.id === "secondary-shape" || node.id === "orientation-mark",
  );
  let minimumDistance = Number.POSITIVE_INFINITY;
  const errors: string[] = [];

  for (const node of tracked) {
    const clearance = nodeDistanceFromPoint(marker.center, node) - marker.radius;
    minimumDistance = Math.min(minimumDistance, clearance);
    if (clearance < minimumGap) {
      errors.push(
        `Marker clearance from '${node.id}' is ${clearance.toFixed(2)} units.`,
      );
    }
  }

  return {
    ok: errors.length === 0,
    minimumDistance:
      minimumDistance === Number.POSITIVE_INFINITY ? 0 : minimumDistance,
    closestPair: null,
    errors,
  };
}
