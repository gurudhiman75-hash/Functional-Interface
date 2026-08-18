import type { GeoDiagramModel } from "./diagram-model";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function pointLookup(model: GeoDiagramModel): Map<string, { x: number; y: number }> {
  return new Map(model.points.map((point) => [point.id, point]));
}

export function renderGeometrySvg(model: GeoDiagramModel): string {
  const points = pointLookup(model);
  const body: string[] = [];

  for (const segment of model.segments) {
    const from = points.get(segment.fromPointId);
    const to = points.get(segment.toPointId);
    if (!from || !to) throw new Error(`Diagram segment ${segment.id} references a missing point`);
    body.push(`<line data-geo-kind="segment" data-geo-id="${escapeXml(segment.id)}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" />`);
  }

  for (const circle of model.circles) {
    const center = points.get(circle.centerPointId);
    if (!center) throw new Error(`Diagram circle ${circle.id} references a missing center`);
    body.push(`<circle data-geo-kind="circle" data-geo-id="${escapeXml(circle.id)}" cx="${center.x}" cy="${center.y}" r="${circle.radius}" />`);
  }

  for (const mark of model.parallelMarks) {
    body.push(`<g data-geo-kind="parallel-mark" data-geo-id="${escapeXml(mark.id)}" data-segments="${escapeXml(mark.segmentIds.join(","))}"></g>`);
  }
  for (const mark of model.equalLengthMarks) {
    body.push(`<g data-geo-kind="equal-length-mark" data-geo-id="${escapeXml(mark.id)}" data-segments="${escapeXml(mark.segmentIds.join(","))}"></g>`);
  }
  for (const mark of model.rightAngleMarks) {
    body.push(`<g data-geo-kind="right-angle-mark" data-geo-id="${escapeXml(mark.id)}" data-vertex="${escapeXml(mark.vertexPointId)}"></g>`);
  }
  for (const mark of model.angleMarks) {
    body.push(`<g data-geo-kind="angle-mark" data-geo-id="${escapeXml(mark.id)}" data-vertex="${escapeXml(mark.vertexPointId)}"${mark.label ? ` data-label="${escapeXml(mark.label)}"` : ""}></g>`);
  }
  for (const arc of model.arcs) {
    body.push(`<g data-geo-kind="arc" data-geo-id="${escapeXml(arc.id)}" data-circle="${escapeXml(arc.circleId)}"></g>`);
  }
  for (const point of model.points) {
    body.push(`<g data-geo-kind="point" data-geo-id="${escapeXml(point.id)}"><circle cx="${point.x}" cy="${point.y}" r="2"/><text x="${point.x + 4}" y="${point.y - 4}">${escapeXml(point.label)}</text></g>`);
  }
  for (const label of model.labels) {
    body.push(`<text data-geo-kind="label" data-geo-id="${escapeXml(label.id)}" x="${label.x}" y="${label.y}">${escapeXml(label.text)}</text>`);
  }

  const description = model.notToScale ? "Geometry diagram, not to scale" : "Geometry diagram";
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${description}" data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V1" data-disclosure="${model.disclosure}">${body.join("")}</svg>`;
}
