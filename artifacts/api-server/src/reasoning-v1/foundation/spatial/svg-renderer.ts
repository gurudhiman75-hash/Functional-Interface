import { normalizeAngleDeg, pointAtAngle } from "./geometry";
import { normalizeSpatialScene, roundSpatialNumber } from "./normalize";
import { assertValidSpatialScene } from "./validator";
import type { SpatialNode, SpatialScene, SpatialStyle } from "./types";

export interface SpatialSvgRenderOptions {
  ariaLabel?: string;
  includeNodeIds?: boolean;
  className?: string;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function numberAttribute(value: number): string {
  return String(roundSpatialNumber(value));
}

function renderStyle(style: SpatialStyle | undefined): string {
  const resolved: Required<Pick<SpatialStyle, "stroke" | "strokeWidth" | "fill">> &
    SpatialStyle = {
    stroke: style?.stroke ?? "currentColor",
    strokeWidth: style?.strokeWidth ?? 2,
    fill: style?.fill ?? "none",
    ...style,
  };

  const attributes = [
    `stroke="${escapeXml(resolved.stroke)}"`,
    `stroke-width="${numberAttribute(resolved.strokeWidth)}"`,
    `fill="${escapeXml(resolved.fill)}"`,
  ];

  if (resolved.opacity !== undefined) {
    attributes.push(`opacity="${numberAttribute(resolved.opacity)}"`);
  }
  if (resolved.dashArray?.length) {
    attributes.push(
      `stroke-dasharray="${resolved.dashArray.map(numberAttribute).join(" ")}"`,
    );
  }
  if (resolved.lineCap !== undefined) {
    attributes.push(`stroke-linecap="${resolved.lineCap}"`);
  }
  if (resolved.lineJoin !== undefined) {
    attributes.push(`stroke-linejoin="${resolved.lineJoin}"`);
  }

  return attributes.join(" ");
}

function renderCommonAttributes(
  node: SpatialNode,
  includeNodeIds: boolean,
): string {
  const attributes = [`data-role="${escapeXml(node.role ?? node.kind)}"`];
  if (includeNodeIds) {
    attributes.unshift(`data-node-id="${escapeXml(node.id)}"`);
  }
  return attributes.join(" ");
}

function renderNode(node: SpatialNode, includeNodeIds: boolean): string {
  const common = renderCommonAttributes(node, includeNodeIds);
  const style = renderStyle(node.style);

  switch (node.kind) {
    case "line":
      return `<line ${common} x1="${numberAttribute(node.start.x)}" y1="${numberAttribute(node.start.y)}" x2="${numberAttribute(node.end.x)}" y2="${numberAttribute(node.end.y)}" ${style} />`;
    case "circle":
      return `<circle ${common} cx="${numberAttribute(node.center.x)}" cy="${numberAttribute(node.center.y)}" r="${numberAttribute(node.radius)}" ${style} />`;
    case "polygon":
      return `<polygon ${common} points="${node.points
        .map((point) => `${numberAttribute(point.x)},${numberAttribute(point.y)}`)
        .join(" ")}" ${style} />`;
    case "polyline":
      return `<polyline ${common} points="${node.points
        .map((point) => `${numberAttribute(point.x)},${numberAttribute(point.y)}`)
        .join(" ")}" ${style} />`;
    case "arc": {
      const start = pointAtAngle(node.center, node.radius, node.startAngleDeg);
      const end = pointAtAngle(node.center, node.radius, node.endAngleDeg);
      const span =
        node.sweep === "clockwise"
          ? normalizeAngleDeg(node.endAngleDeg - node.startAngleDeg)
          : normalizeAngleDeg(node.startAngleDeg - node.endAngleDeg);
      const largeArcFlag = span > 180 ? 1 : 0;
      const sweepFlag = node.sweep === "clockwise" ? 1 : 0;
      const path = [
        `M ${numberAttribute(start.x)} ${numberAttribute(start.y)}`,
        `A ${numberAttribute(node.radius)} ${numberAttribute(node.radius)} 0 ${largeArcFlag} ${sweepFlag} ${numberAttribute(end.x)} ${numberAttribute(end.y)}`,
      ].join(" ");
      return `<path ${common} d="${path}" ${style} />`;
    }
  }
}

export function renderSpatialSceneToSvg(
  scene: SpatialScene,
  options: SpatialSvgRenderOptions = {},
): string {
  assertValidSpatialScene(scene);
  const normalized = normalizeSpatialScene(scene);
  const { minX, minY, width, height } = normalized.viewBox;
  const attributes = [
    `xmlns="http://www.w3.org/2000/svg"`,
    `viewBox="${numberAttribute(minX)} ${numberAttribute(minY)} ${numberAttribute(width)} ${numberAttribute(height)}"`,
    `role="img"`,
    `preserveAspectRatio="xMidYMid meet"`,
    `data-spatial-version="${normalized.version}"`,
    `data-scene-id="${escapeXml(normalized.id)}"`,
  ];

  if (options.ariaLabel) {
    attributes.push(`aria-label="${escapeXml(options.ariaLabel)}"`);
  }
  if (options.className) {
    attributes.push(`class="${escapeXml(options.className)}"`);
  }

  const body = normalized.nodes
    .map((node) => renderNode(node, options.includeNodeIds ?? false))
    .join("");

  return `<svg ${attributes.join(" ")}>${body}</svg>`;
}
