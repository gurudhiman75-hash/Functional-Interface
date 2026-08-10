import { getSpatialPrimitiveV2 } from "./primitive-library-v2";
import { SPATIAL_SCENE_VERSION } from "./types";
import type {
  SpatialArcNode,
  SpatialNode,
  SpatialPoint,
  SpatialScene,
  SpatialStyle,
} from "./types";
import type { SpatialPrimitiveIdV2 } from "./primitive-types";

export interface SpatialPrimitiveInstanceOptionsV2 {
  center?: SpatialPoint;
  scale?: number;
  rotationQuarterTurns?: 0 | 1 | 2 | 3;
  idPrefix?: string;
  rolePrefix?: string;
  styleOverride?: Partial<SpatialStyle>;
}

function transformPoint(
  point: SpatialPoint,
  center: SpatialPoint,
  scale: number,
  quarterTurns: number,
): SpatialPoint {
  const x = (point.x - 50) * scale;
  const y = (point.y - 50) * scale;
  const angle = (quarterTurns * Math.PI) / 2;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: center.x + x * cos - y * sin,
    y: center.y + x * sin + y * cos,
  };
}

function instanceStyle(
  node: SpatialNode,
  styleOverride: Partial<SpatialStyle> | undefined,
): SpatialStyle | undefined {
  if (!styleOverride) return node.style ? { ...node.style } : undefined;
  return { ...(node.style ?? {}), ...styleOverride };
}

function instantiateNode(
  node: SpatialNode,
  primitiveId: SpatialPrimitiveIdV2,
  options: Required<Pick<SpatialPrimitiveInstanceOptionsV2, "center" | "scale" | "rotationQuarterTurns" | "idPrefix" | "rolePrefix">> & SpatialPrimitiveInstanceOptionsV2,
): SpatialNode {
  const common = {
    ...node,
    id: `${options.idPrefix}-${node.id}`,
    role: node.role ? `${options.rolePrefix}${node.role}` : options.rolePrefix.replace(/-$/, ""),
    style: instanceStyle(node, options.styleOverride),
    explanationTags: [
      ...(node.explanationTags ?? []),
      `primitive:${primitiveId}`,
      `quarter:${options.rotationQuarterTurns}`,
    ],
  };
  const map = (point: SpatialPoint) =>
    transformPoint(point, options.center, options.scale, options.rotationQuarterTurns);

  switch (node.kind) {
    case "line":
      return { ...common, kind: "line", start: map(node.start), end: map(node.end) };
    case "circle":
      return {
        ...common,
        kind: "circle",
        center: map(node.center),
        radius: node.radius * options.scale,
      };
    case "polygon":
      return { ...common, kind: "polygon", points: node.points.map(map) };
    case "polyline":
      return { ...common, kind: "polyline", points: node.points.map(map) };
    case "arc": {
      const arc: SpatialArcNode = {
        ...common,
        kind: "arc",
        center: map(node.center),
        radius: node.radius * options.scale,
        startAngleDeg: node.startAngleDeg + options.rotationQuarterTurns * 90,
        endAngleDeg: node.endAngleDeg + options.rotationQuarterTurns * 90,
        sweep: node.sweep,
      };
      return arc;
    }
  }
}

export function instantiateSpatialPrimitiveNodesV2(
  primitiveId: SpatialPrimitiveIdV2,
  options: SpatialPrimitiveInstanceOptionsV2 = {},
): SpatialNode[] {
  const entry = getSpatialPrimitiveV2(primitiveId);
  const resolved = {
    ...options,
    center: options.center ?? { x: 50, y: 50 },
    scale: options.scale ?? 1,
    rotationQuarterTurns: options.rotationQuarterTurns ?? 0,
    idPrefix: options.idPrefix ?? primitiveId.toLowerCase(),
    rolePrefix: options.rolePrefix ?? "primitive-instance-",
  };
  if (!(resolved.scale > 0 && Number.isFinite(resolved.scale))) {
    throw new Error("Primitive instance scale must be a positive finite number.");
  }
  return entry.canonicalScene.nodes.map((node) =>
    instantiateNode(node, primitiveId, resolved),
  );
}

export function buildSpatialPrimitiveInstanceSceneV2(
  primitiveId: SpatialPrimitiveIdV2,
  sceneId: string,
  options: SpatialPrimitiveInstanceOptionsV2 = {},
): SpatialScene {
  const entry = getSpatialPrimitiveV2(primitiveId);
  return {
    version: SPATIAL_SCENE_VERSION,
    id: sceneId,
    viewBox: { minX: 0, minY: 0, width: 100, height: 100 },
    nodes: instantiateSpatialPrimitiveNodesV2(primitiveId, options),
    metadata: {
      chapterCode: "SPA-FND-001",
      semanticRole: "SPATIAL_PRIMITIVE_INSTANCE_V2",
      primitiveId,
      primitiveCategory: entry.category,
      primitiveTopology: entry.topology,
      rotationQuarterTurns: options.rotationQuarterTurns ?? 0,
      instanceScale: options.scale ?? 1,
    },
  };
}
