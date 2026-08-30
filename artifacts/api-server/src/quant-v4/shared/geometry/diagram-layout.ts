import type { GeoDiagramModel } from "./diagram-model";

export interface DiagramTransform {
  readonly scale?: number;
  readonly rotateDegrees?: number;
  readonly translateX?: number;
  readonly translateY?: number;
}

export function transformDiagramLayout(
  model: GeoDiagramModel,
  transform: DiagramTransform,
): GeoDiagramModel {
  const scale = transform.scale ?? 1;
  const radians = ((transform.rotateDegrees ?? 0) * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const tx = transform.translateX ?? 0;
  const ty = transform.translateY ?? 0;
  const mapPoint = (x: number, y: number) => ({
    x: scale * (x * cos - y * sin) + tx,
    y: scale * (x * sin + y * cos) + ty,
  });

  return Object.freeze({
    ...model,
    points: Object.freeze(model.points.map((point) => Object.freeze({ ...point, ...mapPoint(point.x, point.y) }))),
    circles: Object.freeze(model.circles.map((circle) => Object.freeze({ ...circle, radius: Math.abs(circle.radius * scale) }))),
    labels: Object.freeze(model.labels.map((label) => Object.freeze({ ...label, ...mapPoint(label.x, label.y) }))),
  });
}
