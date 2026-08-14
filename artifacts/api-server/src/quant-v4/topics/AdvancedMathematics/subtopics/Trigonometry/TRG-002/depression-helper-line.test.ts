import { renderTrg002DiagramReviewSvg } from "./diagram-review-svg";
import { generateFinalEditorialTrg002Mvp48Question } from "./mvp-final-editorial-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const question: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-015", "trg002-depression-helper-review");
const depression = question.canonicalSpatialState.observations.find((item: any) => item.classification === "DEPRESSION");
assert(depression, "QL-015 must retain a depression observation.");

const segmentId = `depression-drop-${depression.id}`;
const helper = question.solutionDiagram.segments.find((segment: any) => segment.id === segmentId);
assert(helper, "QL-015 solution diagram must include the dotted vertical depression helper.");
assert(helper.kind === "AUXILIARY", "QL-015 depression helper must use the dotted AUXILIARY segment style.");
assert(helper.fromPointId === `eye-level-${depression.id}`, "QL-015 depression helper must start at the eye-level endpoint.");
assert(helper.toPointId === depression.targetPointId, "QL-015 depression helper must terminate at the shorter target top.");

const from = question.solutionDiagram.points.find((point: any) => point.id === helper.fromPointId);
const to = question.solutionDiagram.points.find((point: any) => point.id === helper.toPointId);
assert(from && to, "QL-015 depression-helper endpoints must resolve in the diagram.");
assert(Math.abs(from.x - to.x) <= 1e-9, "QL-015 depression helper must be vertical.");
assert(Math.abs(from.y - to.y) > 1e-9, "QL-015 depression helper must visibly span the unequal heights.");

const svg = renderTrg002DiagramReviewSvg(question.solutionDiagram, { title: "QL-015 depression helper" });
assert(svg.includes(`data-segment-id="${segmentId}"`), "QL-015 rendered review SVG must contain the depression helper segment.");
assert(svg.includes("segment-auxiliary"), "QL-015 rendered depression helper must use the auxiliary CSS class.");
assert(svg.includes(".segment-auxiliary") && svg.includes("stroke-dasharray"), "Auxiliary helper styling must remain dotted/dashed in the rendered solution figure.");

console.log("TRG-002 QL-015 depression helper locked: eye-level endpoint connects vertically to the shorter target with a dotted auxiliary segment.");
