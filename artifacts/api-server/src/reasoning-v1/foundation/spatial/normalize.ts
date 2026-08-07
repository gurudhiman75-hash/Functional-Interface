import { normalizeAngleDeg } from "./geometry";
import type {
  SpatialArcNode,
  SpatialNode,
  SpatialPoint,
  SpatialScene,
  SpatialStyle,
} from "./types";

const DEFAULT_PRECISION = 6;

export function roundSpatialNumber(
  value: number,
  precision = DEFAULT_PRECISION,
): number {
  if (!Number.isFinite(value)) {
    return value;
  }

  const factor = 10 ** precision;
  const rounded = Math.round((value + Number.EPSILON) * factor) / factor;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function normalizePoint(point: SpatialPoint): SpatialPoint {
  return {
    x: roundSpatialNumber(point.x),
    y: roundSpatialNumber(point.y),
  };
}

function normalizeStyle(style: SpatialStyle | undefined): SpatialStyle | undefined {
  if (!style) {
    return undefined;
  }

  const normalized: SpatialStyle = {};

  if (style.stroke !== undefined) normalized.stroke = style.stroke.trim();
  if (style.strokeWidth !== undefined) {
    normalized.strokeWidth = roundSpatialNumber(style.strokeWidth);
  }
  if (style.fill !== undefined) normalized.fill = style.fill.trim();
  if (style.opacity !== undefined) {
    normalized.opacity = roundSpatialNumber(style.opacity);
  }
  if (style.dashArray !== undefined) {
    normalized.dashArray = style.dashArray.map((entry) =>
      roundSpatialNumber(entry),
    );
  }
  if (style.lineCap !== undefined) normalized.lineCap = style.lineCap;
  if (style.lineJoin !== undefined) normalized.lineJoin = style.lineJoin;

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

function normalizeArc(node: SpatialArcNode): SpatialArcNode {
  return {
    ...node,
    center: normalizePoint(node.center),
    radius: roundSpatialNumber(node.radius),
    startAngleDeg: roundSpatialNumber(normalizeAngleDeg(node.startAngleDeg)),
    endAngleDeg: roundSpatialNumber(normalizeAngleDeg(node.endAngleDeg)),
    layer: node.layer ?? 0,
    style: normalizeStyle(node.style),
    explanationTags: node.explanationTags
      ? [...node.explanationTags].sort()
      : undefined,
  };
}

export function normalizeSpatialNode(node: SpatialNode): SpatialNode {
  const common = {
    ...node,
    layer: node.layer ?? 0,
    style: normalizeStyle(node.style),
    explanationTags: node.explanationTags
      ? [...node.explanationTags].sort()
      : undefined,
  };

  switch (node.kind) {
    case "line":
      return {
        ...common,
        kind: "line",
        start: normalizePoint(node.start),
        end: normalizePoint(node.end),
      };
    case "circle":
      return {
        ...common,
        kind: "circle",
        center: normalizePoint(node.center),
        radius: roundSpatialNumber(node.radius),
      };
    case "polygon":
      return {
        ...common,
        kind: "polygon",
        points: node.points.map(normalizePoint),
      };
    case "polyline":
      return {
        ...common,
        kind: "polyline",
        points: node.points.map(normalizePoint),
      };
    case "arc":
      return normalizeArc(node);
  }
}

export function normalizeSpatialScene(scene: SpatialScene): SpatialScene {
  const metadata = scene.metadata
    ? Object.fromEntries(
        Object.entries(scene.metadata).sort(([left], [right]) =>
          left.localeCompare(right),
        ),
      )
    : undefined;

  return {
    ...scene,
    viewBox: {
      minX: roundSpatialNumber(scene.viewBox.minX),
      minY: roundSpatialNumber(scene.viewBox.minY),
      width: roundSpatialNumber(scene.viewBox.width),
      height: roundSpatialNumber(scene.viewBox.height),
    },
    nodes: scene.nodes
      .map(normalizeSpatialNode)
      .sort(
        (left, right) =>
          (left.layer ?? 0) - (right.layer ?? 0) ||
          left.id.localeCompare(right.id),
      ),
    metadata,
  };
}

function pointKey(point: SpatialPoint): string {
  return `${roundSpatialNumber(point.x)},${roundSpatialNumber(point.y)}`;
}

function canonicalCycle(points: SpatialPoint[]): string {
  const keys = points.map(pointKey);
  if (keys.length === 0) return "";

  const candidates: string[] = [];
  const reversed = [...keys].reverse();

  for (const sequence of [keys, reversed]) {
    for (let index = 0; index < sequence.length; index += 1) {
      candidates.push(
        [...sequence.slice(index), ...sequence.slice(0, index)].join(";"),
      );
    }
  }

  return candidates.sort()[0] ?? "";
}

function canonicalPath(points: SpatialPoint[]): string {
  const forward = points.map(pointKey).join(";");
  const reverse = [...points].reverse().map(pointKey).join(";");
  return forward < reverse ? forward : reverse;
}

function stableRecord(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stableRecord);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entry]) => entry !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, stableRecord(entry)]),
    );
  }

  return value;
}

function nodeSemanticRecord(node: SpatialNode): Record<string, unknown> {
  const normalized = normalizeSpatialNode(node);
  const common = {
    kind: normalized.kind,
    layer: normalized.layer ?? 0,
    role: normalized.role,
    style: normalized.style,
  };

  switch (normalized.kind) {
    case "line": {
      const endpoints = [pointKey(normalized.start), pointKey(normalized.end)].sort();
      return { ...common, endpoints };
    }
    case "circle":
      return {
        ...common,
        center: pointKey(normalized.center),
        radius: normalized.radius,
      };
    case "polygon":
      return { ...common, points: canonicalCycle(normalized.points) };
    case "polyline":
      return { ...common, points: canonicalPath(normalized.points) };
    case "arc": {
      const forward = `${normalized.startAngleDeg}:${normalized.endAngleDeg}:${normalized.sweep}`;
      const reverseSweep =
        normalized.sweep === "clockwise" ? "counterclockwise" : "clockwise";
      const reverse = `${normalized.endAngleDeg}:${normalized.startAngleDeg}:${reverseSweep}`;
      return {
        ...common,
        center: pointKey(normalized.center),
        radius: normalized.radius,
        arc: forward < reverse ? forward : reverse,
      };
    }
  }
}

export function spatialNodeSemanticFingerprint(node: SpatialNode): string {
  return JSON.stringify(stableRecord(nodeSemanticRecord(node)));
}

export function spatialSceneSemanticFingerprint(scene: SpatialScene): string {
  const normalized = normalizeSpatialScene(scene);
  return JSON.stringify(
    stableRecord({
      version: normalized.version,
      viewBox: normalized.viewBox,
      nodes: normalized.nodes
        .map(spatialNodeSemanticFingerprint)
        .sort(),
    }),
  );
}

export function areSpatialScenesEquivalent(
  left: SpatialScene,
  right: SpatialScene,
): boolean {
  return (
    spatialSceneSemanticFingerprint(left) ===
    spatialSceneSemanticFingerprint(right)
  );
}
