import { generateFinalEditorialTrg002Mvp48Question } from "./mvp-final-editorial-runtime";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const seed = "trg002-special-render-projection";

const changed: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-035", seed);
assert(changed.solutionDiagram.segments.filter((segment: any) => segment.kind === "SHADOW").length === 2, "QL-035 must project both old and new shadow segments.");
assert(changed.solutionDiagram.segments.filter((segment: any) => segment.kind === "SIGHT_LINE").length === 2, "QL-035 must project both solar rays.");
assert(changed.solutionDiagram.angles.length === 2, "QL-035 must project both 45° and 30° angle markers.");

const ladder: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-038", seed);
assert(ladder.solutionDiagram.segments.some((segment: any) => segment.kind === "LADDER"), "QL-038 must contain the ladder segment.");
assert(ladder.solutionDiagram.angles.some((angle: any) => angle.label === "60°"), "QL-038 must contain the 60° ground-angle marker.");

const broken: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-041", seed);
assert(broken.canonicalSpatialState.points.some((point: any) => point.role === "BREAK_POINT"), "QL-041 must retain the break point.");
assert(broken.canonicalSpatialState.points.some((point: any) => point.role === "TOUCH_POINT"), "QL-041 must retain the ground-touch point.");
assert(broken.solutionDiagram.segments.some((segment: any) => segment.kind === "SIGHT_LINE" && segment.fromPointId === "touch-point" && segment.toPointId === "break-point"), "QL-041 must project the fallen part between touch point and break point.");

const composite: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-095", seed);
assert(composite.solutionDiagram.segments.filter((segment: any) => segment.kind === "VERTICAL_OBJECT").length >= 2, "QL-095 must project building and upper mast as stacked vertical segments.");
assert(composite.solutionDiagram.segments.filter((segment: any) => segment.kind === "SIGHT_LINE").length === 2, "QL-095 must project roof and mast-top sight lines.");
assert(composite.canonicalSpatialState.verticalObjects[0].topPointId === composite.canonicalSpatialState.verticalObjects[1].basePointId, "QL-095 upper mast must remain attached to the roof junction.");

console.log("TRG-002 special render-projection gate targets changed-shadow, ladder, broken-object and composite structure.");
