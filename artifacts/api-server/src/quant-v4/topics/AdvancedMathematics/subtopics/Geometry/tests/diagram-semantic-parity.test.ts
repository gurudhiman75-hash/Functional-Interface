import { renderGeometrySvg, type GeoDiagramModel } from "../../../../../shared/geometry";
import { assert, pass } from "./test-helpers";

const model: GeoDiagramModel = {
  points: [
    { id: "A", label: "A", x: 10, y: 10 },
    { id: "B", label: "B", x: 110, y: 10 },
    { id: "C", label: "C", x: 10, y: 80 },
    { id: "D", label: "D", x: 110, y: 80 },
  ],
  segments: [
    { id: "AB", fromPointId: "A", toPointId: "B" },
    { id: "CD", fromPointId: "C", toPointId: "D" },
  ],
  circles: [],
  angleMarks: [],
  rightAngleMarks: [],
  equalLengthMarks: [],
  parallelMarks: [{ id: "parallel-1", segmentIds: ["AB", "CD"] }],
  arcs: [],
  labels: [],
  disclosure: "STEM",
  notToScale: true,
};
const svg = renderGeometrySvg(model);
assert((svg.match(/data-geo-kind="segment"/g) ?? []).length === 2, "Renderer changed segment count");
assert((svg.match(/data-geo-kind="parallel-mark"/g) ?? []).length === 1, "Renderer failed to preserve explicit parallel mark");
assert(svg.includes("<path"), "Parallel relation marker is semantic-only and not visibly rendered");
assert(svg.includes("viewBox="), "Responsive Geometry viewBox is missing");
assert(!svg.includes("right-angle-mark"), "Renderer invented a right-angle relation");
assert(svg.includes('data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V1"'), "Renderer version marker missing");
pass("diagram-semantic-parity");
