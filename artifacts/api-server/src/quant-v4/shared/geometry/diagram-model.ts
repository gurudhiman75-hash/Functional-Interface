export type DiagramDisclosure = "STEM" | "SOLUTION";
export type DiagramLabelPosition = "AUTO" | "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
export type DiagramSegmentExtent = "SEGMENT" | "RAY" | "LINE";
export type DiagramSegmentStyle = "PRIMARY" | "CONSTRUCTION";

export interface DiagramPoint {
  readonly id: string;
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly labelPosition?: DiagramLabelPosition;
  readonly showPoint?: boolean;
}

export interface DiagramSegment {
  readonly id: string;
  readonly fromPointId: string;
  readonly toPointId: string;
  readonly extent?: DiagramSegmentExtent;
  readonly style?: DiagramSegmentStyle;
  readonly extension?: number;
}

export interface DiagramCircle {
  readonly id: string;
  readonly centerPointId: string;
  readonly radius: number;
}

export interface DiagramAngleMark {
  readonly id: string;
  readonly firstPointId: string;
  readonly vertexPointId: string;
  readonly secondPointId: string;
  readonly label?: string;
  readonly radius?: number;
  readonly labelRadius?: number;
}

export interface DiagramRightAngleMark {
  readonly id: string;
  readonly vertexPointId: string;
  readonly firstRayPointId: string;
  readonly secondRayPointId: string;
}

export interface DiagramEqualLengthMark {
  readonly id: string;
  readonly segmentIds: readonly string[];
}

export interface DiagramParallelMark {
  readonly id: string;
  readonly segmentIds: readonly string[];
}

export interface DiagramArc {
  readonly id: string;
  readonly circleId: string;
  readonly fromPointId: string;
  readonly toPointId: string;
}

export interface DiagramLabel {
  readonly id: string;
  readonly text: string;
  readonly x: number;
  readonly y: number;
}

export interface GeoDiagramModel {
  readonly points: readonly DiagramPoint[];
  readonly segments: readonly DiagramSegment[];
  readonly circles: readonly DiagramCircle[];
  readonly angleMarks: readonly DiagramAngleMark[];
  readonly rightAngleMarks: readonly DiagramRightAngleMark[];
  readonly equalLengthMarks: readonly DiagramEqualLengthMark[];
  readonly parallelMarks: readonly DiagramParallelMark[];
  readonly arcs: readonly DiagramArc[];
  readonly labels: readonly DiagramLabel[];
  readonly disclosure: DiagramDisclosure;
  readonly notToScale: boolean;
}

export function diagramSemanticFingerprint(model: GeoDiagramModel): string {
  return JSON.stringify({
    points: [...model.points].map((point) => [point.id, point.label]).sort(),
    segments: [...model.segments].map((segment) => [
      segment.id,
      segment.fromPointId,
      segment.toPointId,
      segment.extent ?? "SEGMENT",
      segment.style ?? "PRIMARY",
    ]).sort(),
    circles: [...model.circles].map((circle) => [circle.id, circle.centerPointId]).sort(),
    angleMarks: [...model.angleMarks].map((mark) => [
      mark.id,
      mark.firstPointId,
      mark.vertexPointId,
      mark.secondPointId,
      mark.label ?? null,
    ]).sort(),
    rightAngleMarks: [...model.rightAngleMarks].map((mark) => [
      mark.id,
      mark.vertexPointId,
      mark.firstRayPointId,
      mark.secondRayPointId,
    ]).sort(),
    equalLengthMarks: [...model.equalLengthMarks].map((mark) => [mark.id, [...mark.segmentIds].sort()]).sort(),
    parallelMarks: [...model.parallelMarks].map((mark) => [mark.id, [...mark.segmentIds].sort()]).sort(),
    arcs: [...model.arcs].map((arc) => [arc.id, arc.circleId, arc.fromPointId, arc.toPointId]).sort(),
    labels: [...model.labels].map((label) => [label.id, label.text]).sort(),
    disclosure: model.disclosure,
    notToScale: model.notToScale,
  });
}
