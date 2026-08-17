import { useId } from "react";
import { cn } from "@/lib/utils";

type DiagramPoint = {
  id: string;
  x: number;
  y: number;
  label?: string;
  role: string;
};

type DiagramSegment = {
  id: string;
  fromPointId: string;
  toPointId: string;
  kind: string;
};

type DiagramAngle = {
  id: string;
  vertexPointId: string;
  rayPointId: string;
  referenceDirection: "LEFT" | "RIGHT";
  classification: "ELEVATION" | "DEPRESSION";
  label: string;
  arcLane: number;
};

type RightAngleMarker = {
  id: string;
  vertexPointId: string;
  verticalRayPointId: string;
  horizontalDirection: "LEFT" | "RIGHT";
};

type MeasurementArrow = {
  id: string;
  fromPointId: string;
  toPointId: string;
  label: string;
  side: "LEFT" | "RIGHT";
  lane: number;
  kind: "TOTAL_HEIGHT" | "HEIGHT_PART" | "HEIGHT_DIFFERENCE";
};

type SolutionAnnotation = {
  id?: string;
  fromPointId: string;
  toPointId: string;
  label: string;
  placement?: "ABOVE" | "BELOW" | "LEFT" | "RIGHT" | "CENTER";
};

export type Trg002SolutionDiagramData = {
  version: 1;
  qlId: string;
  diagram: {
    strategy: string;
    width: number;
    height: number;
    padding: number;
    points: DiagramPoint[];
    segments: DiagramSegment[];
    angles: DiagramAngle[];
    rightAngles: RightAngleMarker[];
    measurementArrows: MeasurementArrow[];
    labels: Array<{ id: string; pointId: string; text: string }>;
  };
  annotations?: SolutionAnnotation[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isTrg002SolutionDiagramData(value: unknown): value is Trg002SolutionDiagramData {
  if (!isRecord(value) || value.version !== 1 || typeof value.qlId !== "string") return false;
  const diagram = value.diagram;
  if (!isRecord(diagram) || !isFiniteNumber(diagram.width) || !isFiniteNumber(diagram.height)) return false;
  if (diagram.width <= 0 || diagram.height <= 0 || diagram.width > 4000 || diagram.height > 4000) return false;
  if (!Array.isArray(diagram.points) || diagram.points.length < 2 || diagram.points.length > 100) return false;
  if (!Array.isArray(diagram.segments) || diagram.segments.length > 150) return false;
  if (!Array.isArray(diagram.angles) || diagram.angles.length > 30) return false;
  if (!Array.isArray(diagram.rightAngles) || diagram.rightAngles.length > 30) return false;
  if (!Array.isArray(diagram.measurementArrows) || diagram.measurementArrows.length > 30) return false;
  if (!Array.isArray(diagram.labels) || diagram.labels.length > 100) return false;

  const pointIds = new Set<string>();
  for (const point of diagram.points) {
    if (!isRecord(point) || typeof point.id !== "string" || !point.id) return false;
    if (!isFiniteNumber(point.x) || !isFiniteNumber(point.y) || typeof point.role !== "string") return false;
    if (pointIds.has(point.id)) return false;
    pointIds.add(point.id);
  }

  const hasPoint = (id: unknown) => typeof id === "string" && pointIds.has(id);
  for (const segment of diagram.segments) {
    if (!isRecord(segment) || typeof segment.id !== "string" || typeof segment.kind !== "string") return false;
    if (!hasPoint(segment.fromPointId) || !hasPoint(segment.toPointId)) return false;
  }
  for (const arrow of diagram.measurementArrows) {
    if (!isRecord(arrow) || typeof arrow.id !== "string" || typeof arrow.label !== "string") return false;
    if (!hasPoint(arrow.fromPointId) || !hasPoint(arrow.toPointId)) return false;
    if (arrow.side !== "LEFT" && arrow.side !== "RIGHT") return false;
    if (!isFiniteNumber(arrow.lane)) return false;
  }
  return true;
}

function endpointKey(fromPointId: string, toPointId: string) {
  return [fromPointId, toPointId].sort().join("|");
}

function normalizeSignedRadians(value: number) {
  let normalized = value;
  while (normalized > Math.PI) normalized -= Math.PI * 2;
  while (normalized <= -Math.PI) normalized += Math.PI * 2;
  return normalized;
}

function insetSharedEndpoint(endpointY: number, otherY: number, shared: boolean) {
  if (!shared) return endpointY;
  const direction = Math.sign(otherY - endpointY);
  return endpointY + direction * 6;
}

export function Trg002SolutionDiagram({
  data,
  className,
}: {
  data: Trg002SolutionDiagramData;
  className?: string;
}) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const movementMarkerId = `trg002-movement-${rawId}`;
  const dimensionMarkerId = `trg002-dimension-${rawId}`;
  const { diagram } = data;
  const points = new Map(diagram.points.map((point) => [point.id, point]));

  const endpointCounts = new Map<string, number>();
  for (const arrow of diagram.measurementArrows) {
    endpointCounts.set(arrow.fromPointId, (endpointCounts.get(arrow.fromPointId) ?? 0) + 1);
    endpointCounts.set(arrow.toPointId, (endpointCounts.get(arrow.toPointId) ?? 0) + 1);
  }
  const sharedEndpointIds = new Set(
    [...endpointCounts.entries()].filter(([, count]) => count > 1).map(([id]) => id),
  );
  const dimensionEndpointKeys = new Set(
    diagram.measurementArrows.map((arrow) => endpointKey(arrow.fromPointId, arrow.toPointId)),
  );

  return (
    <figure
      className={cn("my-3 overflow-hidden rounded-lg border border-slate-200 bg-white p-2 sm:p-3", className)}
      data-testid="trg002-solution-diagram"
      data-ql-id={data.qlId}
      data-strategy={diagram.strategy}
    >
      <figcaption className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Solution diagram
      </figcaption>
      <svg
        viewBox={`0 0 ${diagram.width} ${diagram.height}`}
        role="img"
        aria-label={`${data.qlId} solution diagram`}
        className="block h-auto w-full text-slate-900"
        preserveAspectRatio="xMidYMid meet"
        data-trg002-solution-svg="true"
      >
        <defs>
          <marker id={movementMarkerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
          <marker id={dimensionMarkerId} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 5 L 10 0 L 10 10 z" fill="currentColor" />
          </marker>
        </defs>

        {diagram.segments.map((segment) => {
          const a = points.get(segment.fromPointId);
          const b = points.get(segment.toPointId);
          if (!a || !b) return null;
          const dashed = segment.kind === "EYE_LEVEL" ? "8 7" : segment.kind === "AUXILIARY" ? "6 7" : undefined;
          const strokeWidth = segment.kind === "GROUND"
            ? 3
            : segment.kind === "VERTICAL_OBJECT" || segment.kind === "LADDER" || segment.kind === "WIRE"
              ? 4
              : 2.5;
          return (
            <line
              key={segment.id}
              data-segment-id={segment.id}
              data-segment-kind={segment.kind}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={dashed}
              markerEnd={segment.kind === "MOVEMENT" ? `url(#${movementMarkerId})` : undefined}
            />
          );
        })}

        {diagram.points.filter((point) => point.role !== "AUXILIARY").map((point) => (
          <circle key={`dot-${point.id}`} data-point-id={point.id} cx={point.x} cy={point.y} r="4" fill="currentColor" />
        ))}

        {diagram.rightAngles.map((marker) => {
          const vertex = points.get(marker.vertexPointId);
          const top = points.get(marker.verticalRayPointId);
          if (!vertex || !top) return null;
          const size = 22;
          const horizontalDir = marker.horizontalDirection === "LEFT" ? -1 : 1;
          const verticalDir = top.y < vertex.y ? -1 : 1;
          const x1 = vertex.x + horizontalDir * size;
          const y1 = vertex.y;
          const x2 = x1;
          const y2 = vertex.y + verticalDir * size;
          return (
            <path
              key={marker.id}
              data-right-angle-id={marker.id}
              d={`M ${x1} ${y1} L ${x2} ${y2} L ${vertex.x} ${y2}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          );
        })}

        {diagram.angles.map((angle) => {
          const vertex = points.get(angle.vertexPointId);
          const ray = points.get(angle.rayPointId);
          if (!vertex || !ray) return null;
          const dx = ray.x - vertex.x;
          const dy = ray.y - vertex.y;
          const rayAngle = Math.atan2(dy, dx);
          const referenceAngle = angle.referenceDirection === "LEFT" ? Math.PI : 0;
          const delta = normalizeSignedRadians(rayAngle - referenceAngle);
          const radius = 38 + Number(angle.arcLane ?? 0) * 24;
          const labelRadius = radius + 24;
          const startX = vertex.x + Math.cos(referenceAngle) * radius;
          const startY = vertex.y + Math.sin(referenceAngle) * radius;
          const endX = vertex.x + Math.cos(rayAngle) * radius;
          const endY = vertex.y + Math.sin(rayAngle) * radius;
          const midAngle = referenceAngle + delta / 2;
          const labelX = vertex.x + Math.cos(midAngle) * labelRadius;
          const labelY = vertex.y + Math.sin(midAngle) * labelRadius;
          const sweep = delta >= 0 ? 1 : 0;
          return (
            <g key={angle.id} data-angle-id={angle.id} data-angle-lane={angle.arcLane ?? 0}>
              <path d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 ${sweep} ${endX} ${endY}`} fill="none" stroke="currentColor" strokeWidth="3" />
              <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="700" paintOrder="stroke" stroke="white" strokeWidth="5" strokeLinejoin="round">
                {angle.label}
              </text>
            </g>
          );
        })}

        {diagram.measurementArrows.map((arrow) => {
          const a = points.get(arrow.fromPointId);
          const b = points.get(arrow.toPointId);
          if (!a || !b) return null;
          const direction = arrow.side === "LEFT" ? -1 : 1;
          const offset = 38 + Number(arrow.lane ?? 0) * 58;
          const arrowX = a.x + direction * offset;
          const witnessEndX = arrowX - direction * 7;
          const labelX = arrowX + direction * 46;
          const midY = (a.y + b.y) / 2;
          const renderedAY = insetSharedEndpoint(a.y, b.y, sharedEndpointIds.has(arrow.fromPointId));
          const renderedBY = insetSharedEndpoint(b.y, a.y, sharedEndpointIds.has(arrow.toPointId));
          return (
            <g key={arrow.id} data-measurement-group-id={arrow.id} data-measurement-kind={arrow.kind}>
              <line x1={a.x} y1={a.y} x2={witnessEndX} y2={a.y} stroke="currentColor" strokeWidth="1.7" opacity="0.65" />
              <line x1={b.x} y1={b.y} x2={witnessEndX} y2={b.y} stroke="currentColor" strokeWidth="1.7" opacity="0.65" />
              <line
                data-measurement-arrow-id={arrow.id}
                x1={arrowX}
                y1={renderedAY}
                x2={arrowX}
                y2={renderedBY}
                stroke="currentColor"
                strokeWidth="2.2"
                fill="none"
                markerStart={`url(#${dimensionMarkerId})`}
                markerEnd={`url(#${dimensionMarkerId})`}
              />
              <text x={labelX} y={midY} textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight={arrow.kind === "HEIGHT_DIFFERENCE" ? "800" : "700"} paintOrder="stroke" stroke="white" strokeWidth="5" strokeLinejoin="round">
                {arrow.label}
              </text>
            </g>
          );
        })}

        {(data.annotations ?? []).filter((annotation) => !dimensionEndpointKeys.has(endpointKey(annotation.fromPointId, annotation.toPointId))).map((annotation, index) => {
          const a = points.get(annotation.fromPointId);
          const b = points.get(annotation.toPointId);
          if (!a || !b) return null;
          let x = (a.x + b.x) / 2;
          let y = (a.y + b.y) / 2;
          const offset = 20;
          if (annotation.placement === "ABOVE") y -= offset;
          if (annotation.placement === "BELOW") y += offset;
          if (annotation.placement === "LEFT") x -= offset;
          if (annotation.placement === "RIGHT") x += offset;
          return (
            <text key={annotation.id ?? `${annotation.fromPointId}-${annotation.toPointId}-${index}`} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="700" paintOrder="stroke" stroke="white" strokeWidth="5" strokeLinejoin="round">
              {annotation.label}
            </text>
          );
        })}

        {diagram.labels.map((label) => {
          const point = points.get(label.pointId);
          if (!point) return null;
          return (
            <text key={label.id} x={point.x + 10} y={point.y - 10} fontSize="20" fontWeight="700" paintOrder="stroke" stroke="white" strokeWidth="5" strokeLinejoin="round">
              {label.text}
            </text>
          );
        })}
      </svg>
    </figure>
  );
}
