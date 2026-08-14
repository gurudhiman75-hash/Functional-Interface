import { generateFinalEditorialTrg002Mvp48Question } from "./mvp-final-editorial-runtime";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const seed = "trg002-special-render-projection";

const depression: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-020", seed);
assert(depression.solutionAnnotations.some((item: any) => item.id === "given-target-height" && item.role === "GIVEN"), "QL-020 must label the given target-pole height.");
assert(depression.solutionAnnotations.some((item: any) => item.id === "given-eye-level"), "QL-020 must label the observer level.");
assert(depression.solutionDiagram.segments.some((segment: any) => segment.kind === "VERTICAL_OBJECT" && segment.fromPointId === "target-ground" && segment.toPointId === "target"), "QL-020 must visibly draw the target pole, not leave its height as a floating label.");
assert(depression.solutionDiagram.segments.some((segment: any) => segment.kind === "VERTICAL_OBJECT" && segment.fromPointId === "observer-ground" && segment.toPointId === "observer-eye"), "QL-020 must visibly draw the observer-level vertical reference.");

const reverseSight: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-023", seed);
assert(reverseSight.solutionAnnotations.some((item: any) => item.id === "given-sight-line" && item.role === "GIVEN" && item.source.kind === "OBSERVATION_SIGHT_LINE"), "QL-023 must label the given line-of-sight length from canonical observation geometry.");
assert(reverseSight.solutionAnnotations.some((item: any) => item.id === "target-height" && item.role === "TARGET_SOLVED"), "QL-023 must retain the solved tower-height label.");

const proofLadder: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-036", seed);
assert(proofLadder.solutionAnnotations.some((item: any) => item.id === "given-ladder-length" && item.role === "GIVEN" && item.source.kind === "OBSERVATION_SIGHT_LINE"), "QL-036 must label the given ladder length from canonical observation geometry.");
assert(proofLadder.solutionAnnotations.some((item: any) => item.id === "target-wall-height" && item.role === "TARGET_SOLVED"), "QL-036 must retain the solved wall-height label.");

const changed: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-035", seed);
assert(changed.solutionDiagram.segments.filter((segment: any) => segment.kind === "SHADOW").length === 2, "QL-035 must project both old and new shadow segments.");
assert(changed.solutionDiagram.segments.filter((segment: any) => segment.kind === "SIGHT_LINE").length === 2, "QL-035 must project both solar rays.");
assert(changed.solutionDiagram.angles.length === 2, "QL-035 must project both 45° and 30° angle markers.");

const ladder: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-038", seed);
assert(ladder.solutionDiagram.segments.some((segment: any) => segment.kind === "LADDER"), "QL-038 must contain the ladder segment.");
assert(ladder.solutionDiagram.angles.some((angle: any) => angle.label === "60°"), "QL-038 must contain the 60° ground-angle marker.");
assert(ladder.solutionAnnotations.some((item: any) => item.id === "given-ladder-length" && item.role === "GIVEN"), "QL-038 must label the given ladder length from exact canonical measurement authority.");
assert(ladder.solutionAnnotations.some((item: any) => item.id === "target-foot-distance" && item.role === "TARGET_SOLVED"), "QL-038 must label the solved foot distance.");

const broken: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-041", seed);
assert(broken.canonicalSpatialState.points.some((point: any) => point.role === "BREAK_POINT"), "QL-041 must retain the break point.");
assert(broken.canonicalSpatialState.points.some((point: any) => point.role === "TOUCH_POINT"), "QL-041 must retain the ground-touch point.");
assert(broken.solutionDiagram.segments.some((segment: any) => segment.kind === "SIGHT_LINE" && segment.fromPointId === "touch-point" && segment.toPointId === "break-point"), "QL-041 must project the fallen part between touch point and break point.");

const composite: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-095", seed);
assert(composite.solutionDiagram.segments.filter((segment: any) => segment.kind === "VERTICAL_OBJECT").length >= 2, "QL-095 must project building and upper mast as stacked vertical segments.");
assert(composite.solutionDiagram.segments.filter((segment: any) => segment.kind === "SIGHT_LINE").length === 2, "QL-095 must project roof and mast-top sight lines.");
assert(composite.canonicalSpatialState.verticalObjects[0].topPointId === composite.canonicalSpatialState.verticalObjects[1].basePointId, "QL-095 upper mast must remain attached to the roof junction.");

console.log("TRG-002 special render-projection gate locks depression, reverse sight-line, proof ladder, changed-shadow, ladder, broken-object and composite teaching-aid structure.");
