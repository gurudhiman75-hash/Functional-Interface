import type {
  SpatialArcNode,
  SpatialCircleNode,
  SpatialLineNode,
  SpatialPoint,
  SpatialPolygonNode,
  SpatialPolylineNode,
  SpatialScene,
} from "./types";

export interface SpatialPerceptualSimilarityV2 {
  dice: number;
  jaccard: number;
  leftCellCount: number;
  rightCellCount: number;
  intersectionCellCount: number;
  unionCellCount: number;
}

const GRID = 64;
const NORMALIZED_SPAN = 50;
const DILATION_RADIUS = 1;
const sampleCache = new WeakMap<SpatialScene, ReadonlySet<number>>();

function sampleLine(start: SpatialPoint, end: SpatialPoint, output: SpatialPoint[]): void {
  const length = Math.hypot(end.x - start.x, end.y - start.y);
  const steps = Math.max(2, Math.ceil(length * 1.6));
  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps;
    output.push({
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t,
    });
  }
}

function samplePolyline(node: SpatialPolylineNode | SpatialPolygonNode, output: SpatialPoint[]): void {
  for (let index = 0; index < node.points.length - 1; index += 1) {
    sampleLine(node.points[index]!, node.points[index + 1]!, output);
  }
  if (node.kind === "polygon" && node.points.length > 2) {
    sampleLine(node.points[node.points.length - 1]!, node.points[0]!, output);
  }
}

function sampleCircle(node: SpatialCircleNode, output: SpatialPoint[]): void {
  const steps = 240;
  for (let index = 0; index < steps; index += 1) {
    const angle = (index / steps) * Math.PI * 2;
    output.push({
      x: node.center.x + node.radius * Math.cos(angle),
      y: node.center.y + node.radius * Math.sin(angle),
    });
  }
}

function normaliseAngle(angle: number): number {
  let result = angle % 360;
  if (result < 0) result += 360;
  return result;
}

function sampleArc(node: SpatialArcNode, output: SpatialPoint[]): void {
  const start = normaliseAngle(node.startAngleDeg);
  const end = normaliseAngle(node.endAngleDeg);
  let delta: number;
  if (node.sweep === "clockwise") {
    delta = end - start;
    if (delta <= 0) delta += 360;
  } else {
    delta = end - start;
    if (delta >= 0) delta -= 360;
  }
  const steps = Math.max(24, Math.ceil(Math.abs(delta) * 0.75));
  for (let index = 0; index <= steps; index += 1) {
    const angle = ((start + delta * (index / steps)) * Math.PI) / 180;
    output.push({
      x: node.center.x + node.radius * Math.cos(angle),
      y: node.center.y + node.radius * Math.sin(angle),
    });
  }
}

function sceneStrokeSamples(scene: SpatialScene): SpatialPoint[] {
  const output: SpatialPoint[] = [];
  for (const node of scene.nodes) {
    switch (node.kind) {
      case "line":
        sampleLine((node as SpatialLineNode).start, (node as SpatialLineNode).end, output);
        break;
      case "polyline":
      case "polygon":
        samplePolyline(node as SpatialPolylineNode | SpatialPolygonNode, output);
        break;
      case "circle":
        sampleCircle(node as SpatialCircleNode, output);
        break;
      case "arc":
        sampleArc(node as SpatialArcNode, output);
        break;
      default:
        break;
    }
  }
  return output;
}

function normalizedRaster(scene: SpatialScene): ReadonlySet<number> {
  const cached = sampleCache.get(scene);
  if (cached) return cached;
  const points = sceneStrokeSamples(scene);
  if (points.length === 0) {
    const empty = new Set<number>();
    sampleCache.set(scene, empty);
    return empty;
  }
  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));
  const width = Math.max(1e-6, maxX - minX);
  const height = Math.max(1e-6, maxY - minY);
  const scale = NORMALIZED_SPAN / Math.max(width, height);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const raster = new Set<number>();

  for (const point of points) {
    const x = Math.round((point.x - centerX) * scale + GRID / 2);
    const y = Math.round((point.y - centerY) * scale + GRID / 2);
    for (let dx = -DILATION_RADIUS; dx <= DILATION_RADIUS; dx += 1) {
      for (let dy = -DILATION_RADIUS; dy <= DILATION_RADIUS; dy += 1) {
        const gx = x + dx;
        const gy = y + dy;
        if (gx < 0 || gx >= GRID || gy < 0 || gy >= GRID) continue;
        raster.add(gy * GRID + gx);
      }
    }
  }
  sampleCache.set(scene, raster);
  return raster;
}

export function compareSpatialScenePerceptualSimilarityV2(
  left: SpatialScene,
  right: SpatialScene,
): SpatialPerceptualSimilarityV2 {
  const leftRaster = normalizedRaster(left);
  const rightRaster = normalizedRaster(right);
  let intersection = 0;
  const smaller = leftRaster.size <= rightRaster.size ? leftRaster : rightRaster;
  const larger = leftRaster.size <= rightRaster.size ? rightRaster : leftRaster;
  for (const cell of smaller) {
    if (larger.has(cell)) intersection += 1;
  }
  const union = leftRaster.size + rightRaster.size - intersection;
  const denominator = leftRaster.size + rightRaster.size;
  return {
    dice: denominator === 0 ? 1 : (2 * intersection) / denominator,
    jaccard: union === 0 ? 1 : intersection / union,
    leftCellCount: leftRaster.size,
    rightCellCount: rightRaster.size,
    intersectionCellCount: intersection,
    unionCellCount: union,
  };
}

export const SPATIAL_PERCEPTUAL_HARD_ALIAS_DICE_V2 = 0.94;
export const SPATIAL_PERCEPTUAL_SAME_ROLE_NEAR_ALIAS_DICE_V2 = 0.80;
