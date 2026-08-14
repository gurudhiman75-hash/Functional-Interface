import { renderTrg002DiagramReviewSvg } from "./diagram-review-svg";
import { generateFinalEditorialTrg002Mvp48Question } from "./mvp-final-editorial-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const question: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-015", "trg002-depression-helper-review");
const depression = question.canonicalSpatialState.observations.find((item: any) => item.classification === "DEPRESSION");
assert(depression, "QL-015 must retain a depression observation.");

const dropId = `depression-drop-${depression.id}`;
const drop = question.solutionDiagram.segments.find((segment: any) => segment.id === dropId);
assert(drop, "QL-015 solution diagram must include the dotted vertical depression drop.");
assert(drop.kind === "AUXILIARY", "QL-015 depression drop must use the dotted AUXILIARY segment style.");
assert(drop.fromPointId === `eye-level-${depression.id}`, "QL-015 depression drop must start at the eye-level endpoint.");
assert(drop.toPointId === depression.targetPointId, "QL-015 depression drop must terminate at the shorter target top.");

const dropFrom = question.solutionDiagram.points.find((point: any) => point.id === drop.fromPointId);
const dropTo = question.solutionDiagram.points.find((point: any) => point.id === drop.toPointId);
assert(dropFrom && dropTo, "QL-015 depression-drop endpoints must resolve in the diagram.");
assert(Math.abs(dropFrom.x - dropTo.x) <= 1e-9, "QL-015 depression drop must be vertical.");
assert(Math.abs(dropFrom.y - dropTo.y) > 1e-9, "QL-015 depression drop must visibly span the unequal heights.");

const transferId = `depression-height-transfer-${depression.id}`;
const transfer = question.solutionDiagram.segments.find((segment: any) => segment.id === transferId);
assert(transfer, "QL-015 solution diagram must include a dotted horizontal line connecting the tall and short verticals at the shorter top level.");
assert(transfer.kind === "AUXILIARY", "QL-015 height-transfer line must use the dotted AUXILIARY style.");
assert(transfer.fromPointId === `target-level-${depression.id}`, "QL-015 height-transfer line must start on the taller vertical at the shorter target height.");
assert(transfer.toPointId === depression.targetPointId, "QL-015 height-transfer line must end at the shorter target top.");

const transferFrom = question.solutionDiagram.points.find((point: any) => point.id === transfer.fromPointId);
const transferTo = question.solutionDiagram.points.find((point: any) => point.id === transfer.toPointId);
assert(transferFrom && transferTo, "QL-015 height-transfer endpoints must resolve in the diagram.");
assert(Math.abs(transferFrom.y - transferTo.y) <= 1e-9, "QL-015 height-transfer helper must be horizontal.");
assert(Math.abs(transferFrom.x - transferTo.x) > 1e-9, "QL-015 height-transfer helper must visibly connect the two verticals.");

const svg = renderTrg002DiagramReviewSvg(question.solutionDiagram, { title: "QL-015 depression helpers" });
assert(svg.includes(`data-segment-id="${dropId}"`), "QL-015 rendered review SVG must contain the vertical depression drop.");
assert(svg.includes(`data-segment-id="${transferId}"`), "QL-015 rendered review SVG must contain the horizontal height-transfer helper.");
assert(svg.includes("segment-auxiliary"), "QL-015 rendered depression helpers must use the auxiliary CSS class.");
assert(svg.includes(".segment-auxiliary") && svg.includes("stroke-dasharray"), "Auxiliary helper styling must remain dotted/dashed in the rendered solution figure.");

console.log("TRG-002 QL-015 depression construction locked: dotted eye-level, vertical drop, and horizontal height-transfer line connect the taller and shorter objects clearly.");
