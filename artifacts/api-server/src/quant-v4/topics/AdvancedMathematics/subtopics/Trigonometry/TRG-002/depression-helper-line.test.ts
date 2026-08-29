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
assert(
  !question.solutionDiagram.segments.some((segment: any) => segment.id === transferId),
  "QL-015 must not include the redundant lower horizontal height-transfer line.",
);

const arrows: any[] = question.solutionDiagram.measurementArrows ?? [];
const lowerId = `height-arrow-observer-lower-${depression.id}`;
const upperId = `height-arrow-observer-upper-${depression.id}`;
const lowerArrow = arrows.find((arrow: any) => arrow.id === lowerId);
const upperArrow = arrows.find((arrow: any) => arrow.id === upperId);
assert(arrows.length === 2, "QL-015 height breakup must contain exactly two dimension spans, not an extra full-height arrow.");
assert(lowerArrow && upperArrow, "QL-015 must contain lower-height and upper-difference dimension spans.");
assert(lowerArrow.fromPointId === "observer-base" && lowerArrow.toPointId === `target-level-${depression.id}`, "QL-015 lower breakup span must sit beside the taller vertical from its base to the pole-top level.");
assert(upperArrow.fromPointId === `target-level-${depression.id}` && upperArrow.toPointId === "observer-top", "QL-015 upper breakup span must sit beside the taller vertical from pole-top level to the building top.");
assert(lowerArrow.kind === "HEIGHT_PART" && upperArrow.kind === "HEIGHT_DIFFERENCE", "QL-015 breakup spans must distinguish common lower height from upper difference.");
assert(lowerArrow.side === upperArrow.side && lowerArrow.lane === 0 && upperArrow.lane === 0, "QL-015 breakup spans must form one external dimension column.");

const points = new Map<string, any>(question.solutionDiagram.points.map((point: any) => [point.id, point]));
const observerBase: any = points.get("observer-base");
const observerTop: any = points.get("observer-top");
const targetTop: any = points.get(depression.targetPointId);
const split: any = points.get(`target-level-${depression.id}`);
assert(observerBase && observerTop && targetTop && split, "QL-015 breakup geometry points must resolve.");
assert(Math.abs(observerBase.x - split.x) <= 1e-9 && Math.abs(observerTop.x - split.x) <= 1e-9, "QL-015 breakup must be anchored to the taller vertical, not the shorter pole.");
assert(Math.abs(split.y - targetTop.y) <= 1e-9, "QL-015 external split must align with the shorter pole top height.");
const targetIsRight = targetTop.x > observerTop.x;
assert(lowerArrow.side === (targetIsRight ? "LEFT" : "RIGHT"), "QL-015 dimension breakup must be outside the main diagram, away from the shorter pole.");

const span = (arrow: any) => Math.abs((points.get(arrow.fromPointId) as any).y - (points.get(arrow.toPointId) as any).y);
assert(Math.abs(span(lowerArrow) + span(upperArrow) - Math.abs(observerBase.y - observerTop.y)) <= 1e-9, "QL-015 two breakup spans must reconstruct the taller vertical height.");
assert([lowerArrow, upperArrow].every((arrow) => typeof arrow.label === "string" && arrow.label.trim().length > 0), "QL-015 breakup spans must carry exact non-empty labels.");

const svg = renderTrg002DiagramReviewSvg(question.solutionDiagram, { title: "QL-015 depression helpers", annotations: question.solutionAnnotations });
assert(svg.includes(`data-segment-id="${dropId}"`), "QL-015 rendered review SVG must contain the vertical depression drop.");
assert(!svg.includes(`data-segment-id="${transferId}"`), "QL-015 rendered review SVG must not contain the removed lower transfer line.");
assert(svg.includes("segment-auxiliary") && svg.includes("stroke-dasharray"), "The retained depression drop must remain dotted/dashed.");
for (const id of [lowerId, upperId]) {
  assert(svg.includes(`data-measurement-arrow-id="${id}"`), `QL-015 rendered SVG must contain measurement span ${id}.`);
}
const startHeads = svg.match(/marker-start="url\(#dimension-arrow\)"/g) ?? [];
const endHeads = svg.match(/marker-end="url\(#dimension-arrow\)"/g) ?? [];
assert(startHeads.length === 2 && endHeads.length === 2, "QL-015 breakup must render four arrowheads in total: two on each double-headed span.");
assert(svg.includes("dimension-label-height-part") && svg.includes("dimension-label-height-difference"), "QL-015 rendered breakup must distinguish lower pole-equivalent height and upper difference.");
assert(!svg.includes("dimension-label-total-height"), "QL-015 must not add the redundant outer full-height dimension.");

console.log("TRG-002 QL-015 depression construction locked: no extra lower transfer line; two external tall-side spans render four visible arrowheads.");
