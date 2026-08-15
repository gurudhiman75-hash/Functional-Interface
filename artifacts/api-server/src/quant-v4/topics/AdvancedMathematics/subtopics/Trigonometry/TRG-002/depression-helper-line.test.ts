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

const arrows = question.solutionDiagram.measurementArrows ?? [];
const arrowById = new Map<string, any>(arrows.map((arrow: any) => [arrow.id, arrow]));
const targetTotalId = `height-arrow-target-total-${depression.id}`;
const observerLowerId = `height-arrow-observer-lower-${depression.id}`;
const observerDropId = `height-arrow-observer-drop-${depression.id}`;
const observerTotalId = `height-arrow-observer-total-${depression.id}`;

assert(arrows.length >= 4, "QL-015 must expose the pole/building height breakup as vertical measurement arrows.");
const targetTotal = arrowById.get(targetTotalId);
const observerLower = arrowById.get(observerLowerId);
const observerDrop = arrowById.get(observerDropId);
const observerTotal = arrowById.get(observerTotalId);
assert(targetTotal && observerLower && observerDrop && observerTotal, "QL-015 must include target total, matching lower part, vertical drop, and observer total arrows.");
assert(targetTotal.kind === "TOTAL_HEIGHT" && targetTotal.fromPointId === "target-base" && targetTotal.toPointId === "target-top", "QL-015 shorter pole total-height arrow must span its base to top.");
assert(observerLower.kind === "HEIGHT_PART" && observerLower.fromPointId === "observer-base" && observerLower.toPointId === `target-level-${depression.id}`, "QL-015 lower breakup arrow must span ground to the transferred pole-top level.");
assert(observerDrop.kind === "HEIGHT_DIFFERENCE" && observerDrop.fromPointId === `target-level-${depression.id}` && observerDrop.toPointId === "observer-top", "QL-015 upper breakup arrow must show the vertical drop from eye level to pole-top level.");
assert(observerTotal.kind === "TOTAL_HEIGHT" && observerTotal.fromPointId === "observer-base" && observerTotal.toPointId === "observer-top", "QL-015 taller-object total arrow must span its full height.");
assert(targetTotal.label === observerLower.label, "QL-015 transferred lower-height arrow must carry the same exact height as the shorter pole.");
assert([targetTotal, observerLower, observerDrop, observerTotal].every((arrow) => typeof arrow.label === "string" && arrow.label.trim().length > 0), "QL-015 height arrows must carry exact non-empty labels.");
assert(observerLower.lane === 0 && observerDrop.lane === 0 && observerTotal.lane === 1, "QL-015 split arrows must share the near lane while the full observer height uses the outer lane.");

const pointById = new Map<string, any>(question.solutionDiagram.points.map((point: any) => [point.id, point]));
const verticalSpan = (arrow: any) => Math.abs(pointById.get(arrow.fromPointId).y - pointById.get(arrow.toPointId).y);
assert(Math.abs(verticalSpan(targetTotal) - verticalSpan(observerLower)) <= 1e-9, "QL-015 lower breakup span must geometrically equal the shorter pole height.");
assert(Math.abs(verticalSpan(observerLower) + verticalSpan(observerDrop) - verticalSpan(observerTotal)) <= 1e-9, "QL-015 lower part plus upper drop must reconstruct the taller object's total height.");

const svg = renderTrg002DiagramReviewSvg(question.solutionDiagram, { title: "QL-015 depression helpers", annotations: question.solutionAnnotations });
assert(svg.includes(`data-segment-id="${dropId}"`), "QL-015 rendered review SVG must contain the vertical depression drop.");
assert(svg.includes(`data-segment-id="${transferId}"`), "QL-015 rendered review SVG must contain the horizontal height-transfer helper.");
assert(svg.includes("segment-auxiliary"), "QL-015 rendered depression helpers must use the auxiliary CSS class.");
assert(svg.includes(".segment-auxiliary") && svg.includes("stroke-dasharray"), "Auxiliary helper styling must remain dotted/dashed in the rendered solution figure.");
for (const id of [targetTotalId, observerLowerId, observerDropId, observerTotalId]) {
  assert(svg.includes(`data-measurement-arrow-id="${id}"`), `QL-015 rendered SVG must contain measurement arrow ${id}.`);
}
assert(svg.includes('marker-start="url(#dimension-arrow)"') && svg.includes('marker-end="url(#dimension-arrow)"'), "QL-015 height dimensions must render with double-headed arrows.");
assert(svg.includes("dimension-label-height-part") && svg.includes("dimension-label-height-difference"), "QL-015 rendered height breakup must distinguish the matching lower part and upper height difference.");

console.log("TRG-002 QL-015 depression construction locked: dotted transfer helpers plus exact adjacent double-arrow height breakup for the shorter pole and taller object.");
