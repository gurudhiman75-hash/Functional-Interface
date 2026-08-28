import {
  exactInteger,
  exactKey,
  exactRational,
  exactSurd,
} from "../../foundation/exact";
import { degree, toDegrees } from "../../foundation/angle";
import {
  TRG_002_DIAGRAM_STRATEGIES,
  buildLadderState,
  buildObserverHeightElevationState,
  buildOppositeSideState,
  buildSameSideMovingState,
  buildSingleDepressionState,
  buildSingleElevationState,
  buildTrg002DiagramSpec,
  findCleanStandardAngleFromRiseRun,
  horizontalFromVerticalDelta,
  ladderAgainstWall,
  oppositeSideObservationSystem,
  sameSideTwoObservationSystem,
  singleElevationObjectHeight,
  validateTrg002DiagramSpec,
  verifyTrg002SpatialState,
  verticalDeltaFromHorizontal,
} from "./index";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function exactEquals(actual: any, expected: any, message: string) {
  assert(exactKey(actual) === exactKey(expected), `${message}: ${exactKey(actual)} !== ${exactKey(expected)}`);
}

function expectThrow(action: () => unknown, message: string) {
  let threw = false;
  try { action(); } catch { threw = true; }
  assert(threw, message);
}

function objectHeight(state: any) {
  assert(state.verticalObjects.length > 0, "Expected a vertical object.");
  return state.verticalObjects[0].height;
}

const twenty = exactInteger(20);
const ten = exactInteger(10);
const zero = exactInteger(0);

exactEquals(verticalDeltaFromHorizontal(twenty, degree(45)), twenty, "20 m at 45° must rise 20 m");
exactEquals(horizontalFromVerticalDelta(twenty, degree(45)), twenty, "20 m rise at 45° must have 20 m run");
exactEquals(singleElevationObjectHeight(twenty, degree(45)), twenty, "Ground-level 45° elevation height mismatch");

const clean60 = findCleanStandardAngleFromRiseRun(exactSurd(10, 3), ten);
assert(clean60, "10√3/10 should resolve to a clean standard angle.");
const clean60Degrees = toDegrees(clean60);
assert(clean60Degrees.numerator === 60n && clean60Degrees.denominator === 1n, "Clean ratio should resolve to 60° exactly.");
assert(findCleanStandardAngleFromRiseRun(exactInteger(2), exactInteger(3)) === null, "Non-standard ratio must not fabricate an angle.");

const single = buildSingleElevationState({ horizontal: twenty, angle: degree(45), units: "m" });
exactEquals(objectHeight(single), twenty, "Single elevation object height mismatch");
assert(verifyTrg002SpatialState(single).valid, "Single elevation canonical state must verify.");
assert(validateTrg002DiagramSpec(buildTrg002DiagramSpec(single)).valid, "Single elevation diagram must validate.");

const explicitZeroEye = buildSingleElevationState({ horizontal: twenty, angle: degree(45), eyeHeight: exactInteger(0), units: "m" });
assert(explicitZeroEye.diagramStrategy === "SINGLE_ELEVATION", "Explicit exact zero eye height must not switch to OBSERVER_HEIGHT strategy.");

const observerHeight = buildObserverHeightElevationState({
  horizontal: ten,
  angle: degree(45),
  eyeHeight: exactRational(3, 2),
  units: "m",
});
exactEquals(objectHeight(observerHeight), exactRational(23, 2), "Observer-height correction must be applied exactly once");
assert(verifyTrg002SpatialState(observerHeight).valid, "Observer-height state must verify.");
const observerDiagram = buildTrg002DiagramSpec(observerHeight);
assert(observerDiagram.strategy === "OBSERVER_HEIGHT", "Observer-height builder must use the observer-height diagram strategy.");
assert(validateTrg002DiagramSpec(observerDiagram).valid, "Observer-height diagram must validate.");

const depression = buildSingleDepressionState({
  horizontal: ten,
  angle: degree(45),
  observerEyeHeight: ten,
  targetHeight: zero,
  units: "m",
});
assert(verifyTrg002SpatialState(depression).valid, "45° depression state must verify.");
const depressionDiagram = buildTrg002DiagramSpec(depression);
assert(depressionDiagram.angles[0]?.classification === "DEPRESSION", "Depression diagram must retain depression classification.");
assert(validateTrg002DiagramSpec(depressionDiagram).valid, "Depression diagram must validate.");

const sameSideSolved = sameSideTwoObservationSystem(degree(30), degree(60), twenty);
exactEquals(sameSideSolved.farDistance, exactInteger(30), "30°→60° with 20 m movement must start 30 m away");
exactEquals(sameSideSolved.nearDistance, ten, "30°→60° with 20 m movement must finish 10 m away");
exactEquals(sameSideSolved.verticalDelta, exactSurd(10, 3), "Same-side system height delta mismatch");

const sameSide = buildSameSideMovingState({
  farAngle: degree(30),
  nearAngle: degree(60),
  movementTowardObject: twenty,
  units: "m",
});
assert(verifyTrg002SpatialState(sameSide).valid, "Same-side movement state must verify point order and both angles.");
const sameSideDiagram = buildTrg002DiagramSpec(sameSide);
assert(sameSideDiagram.strategy === "OBSERVER_MOVES_CLOSER", "Same-side movement must use closer diagram strategy.");
assert(sameSideDiagram.angles.length === 2, "Same-side diagram must contain both sight-line angles.");
assert(validateTrg002DiagramSpec(sameSideDiagram).valid, "Same-side diagram must validate.");

const oppositeSolved = oppositeSideObservationSystem(degree(45), degree(45), twenty);
exactEquals(oppositeSolved.leftDistance, ten, "Symmetric opposite-side left distance mismatch");
exactEquals(oppositeSolved.rightDistance, ten, "Symmetric opposite-side right distance mismatch");
exactEquals(oppositeSolved.verticalDelta, ten, "Symmetric opposite-side height mismatch");

const opposite = buildOppositeSideState({
  leftAngle: degree(45),
  rightAngle: degree(45),
  observerSeparation: twenty,
  units: "m",
});
assert(verifyTrg002SpatialState(opposite).valid, "Opposite-side state must verify object-between-observers geometry.");
const oppositeDiagram = buildTrg002DiagramSpec(opposite);
assert(oppositeDiagram.strategy === "OPPOSITE_SIDE_OBSERVATIONS", "Opposite-side strategy mismatch.");
assert(validateTrg002DiagramSpec(oppositeDiagram).valid, "Opposite-side diagram must validate.");

const ladderSolved = ladderAgainstWall(ten, degree(30));
exactEquals(ladderSolved.verticalHeight, exactInteger(5), "10 m ladder at 30° must reach 5 m high");
exactEquals(ladderSolved.baseDistance, exactSurd(5, 3), "10 m ladder at 30° base distance mismatch");
const ladder = buildLadderState({ ladderLength: ten, angleAtGround: degree(30), units: "m" });
assert(verifyTrg002SpatialState(ladder).valid, "Ladder canonical state must verify.");
const ladderDiagram = buildTrg002DiagramSpec(ladder);
assert(ladderDiagram.segments.some((segment) => segment.kind === "LADDER"), "Ladder diagram must contain an explicit ladder segment.");
assert(validateTrg002DiagramSpec(ladderDiagram).valid, "Ladder diagram must validate.");

const tamperedClassification = {
  ...single,
  observations: single.observations.map((observation) => ({ ...observation, classification: "DEPRESSION" as const })),
};
assert(!verifyTrg002SpatialState(tamperedClassification).valid, "Verifier must reject an elevation scene mislabeled as depression.");

const tamperedMovement = {
  ...sameSide,
  movements: sameSide.movements.map((movement) => ({ ...movement, direction: "FARTHER" as const })),
};
assert(!verifyTrg002SpatialState(tamperedMovement).valid, "Verifier must reject a closer move mislabeled as farther.");

const tamperedOpposite = {
  ...opposite,
  points: opposite.points.map((point) => point.id === "object-base" || point.id === "object-top"
    ? { ...point, x: exactInteger(30) }
    : point),
};
assert(!verifyTrg002SpatialState(tamperedOpposite).valid, "Verifier must reject an opposite-side object moved outside the observers.");

expectThrow(
  () => sameSideTwoObservationSystem(degree(60), degree(30), twenty),
  "Same-side closer solver must reject a near angle smaller than the far angle.",
);
expectThrow(
  () => sameSideTwoObservationSystem(degree(30), degree(60), zero),
  "Same-side solver must reject zero movement.",
);
expectThrow(
  () => oppositeSideObservationSystem(degree(45), degree(45), zero),
  "Opposite-side solver must reject zero observer separation.",
);
expectThrow(
  () => ladderAgainstWall(zero, degree(30)),
  "Ladder solver must reject zero ladder length.",
);

assert(TRG_002_DIAGRAM_STRATEGIES.length === 15, "The TRG-002 spatial diagram strategy union must contain all 15 supported strategy families after V4 tower-extension support.");
assert(new Set(TRG_002_DIAGRAM_STRATEGIES).size === 15, "Diagram strategy names must be unique.");

console.log("TRG-002 spatial foundation fixtures passed: exact solvers, 6 canonical scenes, exact-zero strategy semantics, 3 verifier tamper checks and 4 physical-feasibility rejection checks.");
