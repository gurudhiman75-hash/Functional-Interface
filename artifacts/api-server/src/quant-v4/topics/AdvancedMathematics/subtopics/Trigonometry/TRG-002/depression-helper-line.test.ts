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

const arrows: any[] = question.solutionDiagram.measurementArrows ?? [];
const arrowById = new Map<string, any>();
for (const arrow of arrows) arrowById.set(arrow.id, arrow);
const poleId = `height-arrow-target-total-${depression.id}`;
const dropArrowId = `height-arrow-target-drop-${depression.id}`;
const combinedId = `height-arrow-target-combined-${depression.id}`;
const poleArrow = arrowById.get(poleId);
const dropArrow = arrowById.get(dropArrowId);
const combinedArrow = arrowById.get(combinedId);

assert(poleArrow && dropArrow && combinedArrow, "QL-015 must show three adjacent pole-side arrows: pole height, upper drop, and combined total.");
assert(poleArrow.kind === "HEIGHT_PART" && poleArrow.fromPointId === "target-base" && poleArrow.toPointId === "target-top", "QL-015 pole-height arrow must span the shorter pole from base to top.");
assert(dropArrow.kind === "HEIGHT_DIFFERENCE" && dropArrow.fromPointId === "target-top" && dropArrow.toPointId === `eye-level-${depression.id}`, "QL-015 upper breakup arrow must span the vertical drop above the pole.");
assert(combinedArrow.kind === "TOTAL_HEIGHT" && combinedArrow.fromPointId === "target-base" && combinedArrow.toPointId === `eye-level-${depression.id}`, "QL-015 outer arrow must span the combined reference height beside the pole.");
assert(poleArrow.side === dropArrow.side && dropArrow.side === combinedArrow.side, "QL-015 breakup arrows must stay on one side adjacent to the shorter pole.");
assert(poleArrow.lane === 0 && dropArrow.lane === 0 && combinedArrow.lane === 1, "QL-015 pole and drop arrows must share the near lane while the combined total uses the outer lane.");
assert([poleArrow, dropArrow, combinedArrow].every((arrow) => typeof arrow.label === "string" && arrow.label.trim().length > 0), "QL-015 pole-side arrows must carry exact non-empty labels.");

const pointById = new Map<string, any>();
for (const point of question.solutionDiagram.points) pointById.set(point.id, point);
const verticalSpan = (arrow: any) => Math.abs(pointById.get(arrow.fromPointId).y - pointById.get(arrow.toPointId).y);
assert(Math.abs(verticalSpan(poleArrow) + verticalSpan(dropArrow) - verticalSpan(combinedArrow)) <= 1e-9, "QL-015 pole height plus upper drop must reconstruct the combined reference height.");

const svg = renderTrg002DiagramReviewSvg(question.solutionDiagram, { title: "QL-015 depression helpers", annotations: question.solutionAnnotations });
assert(svg.includes(`data-segment-id="${dropId}"`), "QL-015 rendered review SVG must contain the vertical depression drop.");
assert(svg.includes(`data-segment-id="${transferId}"`), "QL-015 rendered review SVG must contain the horizontal height-transfer helper.");
assert(svg.includes("segment-auxiliary"), "QL-015 rendered depression helpers must use the auxiliary CSS class.");
assert(svg.includes(".segment-auxiliary") && svg.includes("stroke-dasharray"), "Auxiliary helper styling must remain dotted/dashed in the rendered solution figure.");
for (const id of [poleId, dropArrowId, combinedId]) {
  assert(svg.includes(`data-measurement-arrow-id="${id}"`), `QL-015 rendered SVG must contain measurement arrow ${id}.`);
}
assert(svg.includes('marker-start="url(#dimension-arrow)"') && svg.includes('marker-end="url(#dimension-arrow)"'), "QL-015 height dimensions must render with double-headed arrows.");
assert(svg.includes("dimension-label-height-part") && svg.includes("dimension-label-height-difference") && svg.includes("dimension-label-total-height"), "QL-015 rendered breakup must distinguish pole height, upper drop, and combined total.");

console.log("TRG-002 QL-015 depression construction locked: dotted transfer helpers plus exact three-part double-arrow height breakup adjacent to the shorter pole.");
