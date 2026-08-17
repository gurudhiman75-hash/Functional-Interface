import { degree } from "../foundation/angle";
import {
  addExact,
  assertDefined,
  divideExact,
  exactInteger,
  exactRational,
  exactSurd,
  formatExactPlain,
  multiplyExact,
} from "../foundation/exact";
import { requireTrigExact } from "../foundation/standard-values";
import type { ExactTrigNumber } from "../foundation/types";
import {
  buildSingleDepressionState,
  buildSingleElevationState,
  type Trg002SpatialState,
  type Trg002VerticalObject,
} from "./spatial";
import {
  buildTrg002MvpQuestion,
  mvpAngleAnswer,
  mvpExplanation,
  mvpNumberAnswer,
  mvpPick,
  type Trg002MvpQuestion,
} from "./mvp-runtime-core";

export const TRG_002_PRODUCTION_CP007_EXPANSION_IDS = [
  "TRG-002-QL-003", "TRG-002-QL-004", "TRG-002-QL-006",
  "TRG-002-QL-008", "TRG-002-QL-010", "TRG-002-QL-011",
  "TRG-002-QL-013",
  "TRG-002-QL-016", "TRG-002-QL-017",
  "TRG-002-QL-019", "TRG-002-QL-021", "TRG-002-QL-022",
] as const;
export type Trg002ProductionCp007ExpansionId = (typeof TRG_002_PRODUCTION_CP007_EXPANSION_IDS)[number];

const div = (a: ExactTrigNumber, b: ExactTrigNumber) => assertDefined(divideExact(a, b));
const tan = (angle: 30 | 60) => requireTrigExact("TAN", degree(angle));
const sin = (angle: 30 | 60) => requireTrigExact("SIN", degree(angle));

function targetObject(state: Trg002SpatialState, id = "target-object", kind: Trg002VerticalObject["kind"] = "POLE") {
  const ground = state.points.find((item) => item.id === "target-ground");
  const top = state.points.find((item) => item.id === "target");
  if (!ground || !top) throw new Error("TRG-002 CP007 expansion: depression target points missing.");
  ground.role = "OBJECT_BASE";
  top.role = "OBJECT_TOP";
  const height = top.y;
  state.verticalObjects = [{ id, kind, basePointId: ground.id, topPointId: top.id, height }];
  return { id, height };
}

function depressionState(input: {
  run: ExactTrigNumber;
  angle: 30 | 45 | 60;
  observerHeight: ExactTrigNumber;
  targetHeight: ExactTrigNumber;
  requested: "HEIGHT" | "DISTANCE";
}) {
  const state = buildSingleDepressionState({
    horizontal: input.run,
    angle: degree(input.angle),
    observerEyeHeight: input.observerHeight,
    targetHeight: input.targetHeight,
    units: "m",
  });
  const target = targetObject(state);
  if (input.requested === "HEIGHT") state.requested = { kind: "OBJECT_HEIGHT", objectId: target.id };
  return state;
}

function ql003(seed: string) {
  const k = mvpPick(seed, "003-k", [6, 8, 10] as const);
  const run = exactInteger(3 * k);
  const height = exactSurd(k, 3);
  const state = buildSingleElevationState({ horizontal: run, angle: degree(30), objectKind: "TOWER", scenario: "TOWER", units: "m" });
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-003", cpId: "TRG-CP-007", lockedFamily: "HEIGHT_FROM_ELEVATION", solveMode: "findSurdHeightFrom30DegreeElevation",
    seed, difficulty: "Easy", target: "LENGTH",
    stem: `From a point ${formatExactPlain(run)} m from the foot of a tower, the angle of elevation of its top is 30°. Find the exact height of the tower.`,
    state, correct: mvpNumberAnswer(height),
    wrong: [
      { value: mvpNumberAnswer(run), misconceptionId: "TREATED_ANGLE_AS_45" },
      { value: mvpNumberAnswer(exactInteger(k)), misconceptionId: "DROPPED_SURD_FACTOR" },
      { value: mvpNumberAnswer(multiplyExact(run, exactRational(1, 2))), misconceptionId: "USED_SINE_WITH_HORIZONTAL_SIDE" },
    ],
    explanation: mvpExplanation("Use tan30°=height/horizontal distance.", [`h=${formatExactPlain(run)}×tan30°.`, `Therefore h=${formatExactPlain(height)} m.`], "The given ground distance is adjacent to the angle, so tangent is the direct ratio."),
  });
}

function ql004(seed: string) {
  const k = mvpPick(seed, "004-k", [7, 9, 12] as const);
  const run = exactInteger(k);
  const height = exactSurd(k, 3);
  const state = buildSingleElevationState({ horizontal: run, angle: degree(60), objectKind: "CHIMNEY", scenario: "CHIMNEY", units: "m" });
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-004", cpId: "TRG-CP-007", lockedFamily: "HEIGHT_FROM_ELEVATION", solveMode: "findHeightFrom60DegreeElevation",
    seed, difficulty: "Easy", target: "LENGTH",
    stem: `An observation point is ${formatExactPlain(run)} m from a vertical chimney. If the angle of elevation of its top is 60°, find the chimney's exact height.`,
    state, correct: mvpNumberAnswer(height),
    wrong: [
      { value: mvpNumberAnswer(run), misconceptionId: "TREATED_ANGLE_AS_45" },
      { value: mvpNumberAnswer(multiplyExact(run, exactInteger(3))), misconceptionId: "USED_TAN60_AS_3" },
      { value: mvpNumberAnswer(exactSurd(k, 2)), misconceptionId: "USED_45_DEGREE_SIGHT_LINE_PATTERN" },
    ],
    explanation: mvpExplanation("For a 60° elevation, tan60°=√3.", [`h=${formatExactPlain(run)}×√3.`, `Hence h=${formatExactPlain(height)} m.`], "Do not replace the exact value √3 by 3."),
  });
}

function ql006(seed: string) {
  const k = mvpPick(seed, "006-k", [8, 10, 14] as const);
  const run = exactSurd(k, 3);
  const height = exactInteger(k);
  const state = buildSingleElevationState({ horizontal: run, angle: degree(30), objectKind: "POLE", scenario: "POLE", units: "m" });
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-006", cpId: "TRG-CP-007", lockedFamily: "HEIGHT_FROM_ELEVATION", solveMode: "simplifyHeightFromSurdDistanceAt30Degrees",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `A point on level ground is ${formatExactPlain(run)} m from a vertical pole. The angle of elevation of its top is 30°. Find the height of the pole.`,
    state, correct: mvpNumberAnswer(height),
    wrong: [
      { value: mvpNumberAnswer(run), misconceptionId: "RETURNED_GIVEN_DISTANCE" },
      { value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "MULTIPLIED_BY_SQRT3_INSTEAD_OF_DIVIDING" },
      { value: mvpNumberAnswer(div(run, exactInteger(2))), misconceptionId: "USED_SINE_HALF_FACTOR" },
    ],
    explanation: mvpExplanation("Apply tan30°=1/√3 and simplify the surd exactly.", [`h=${formatExactPlain(run)}×1/√3.`, `Thus h=${formatExactPlain(height)} m.`], "The √3 in the distance cancels; it is not retained in the final height."),
  });
}

function distanceElevation(seed: string, qlId: "TRG-002-QL-008" | "TRG-002-QL-010" | "TRG-002-QL-011") {
  if (qlId === "TRG-002-QL-008") {
    const k = mvpPick(seed, "008-k", [6, 9, 12] as const);
    const run = exactSurd(k, 3), height = exactInteger(k);
    const state = buildSingleElevationState({ horizontal: run, angle: degree(30), objectKind: "TREE", scenario: "TREE", units: "m" });
    state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" };
    return buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-007", lockedFamily: "DISTANCE_FROM_ELEVATION", solveMode: "findDistanceFromHeightAt30Degrees", seed, difficulty: "Easy", target: "LENGTH",
      stem: `A tree is ${formatExactPlain(height)} m high. Its top is seen at an angle of elevation of 30° from a point on level ground. Find the horizontal distance from the point to the tree.`, state, correct: mvpNumberAnswer(run),
      wrong: [{ value: mvpNumberAnswer(height), misconceptionId: "TREATED_ANGLE_AS_45" }, { value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "USED_TAN30_AS_ONE_THIRD" }, { value: mvpNumberAnswer(exactSurd(k, 2)), misconceptionId: "USED_45_DEGREE_HYPOTENUSE_PATTERN" }],
      explanation: mvpExplanation("Use tan30°=height/distance.", [`1/√3=${formatExactPlain(height)}/d.`, `Therefore d=${formatExactPlain(run)} m.`], "The required distance is the horizontal adjacent side, not the sight line.") });
  }
  if (qlId === "TRG-002-QL-010") {
    const k = mvpPick(seed, "010-k", [6, 8, 10] as const);
    const run = exactInteger(k), height = exactSurd(k, 3);
    const state = buildSingleElevationState({ horizontal: run, angle: degree(60), objectKind: "TOWER", scenario: "TOWER", units: "m" });
    state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" };
    return buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-007", lockedFamily: "DISTANCE_FROM_ELEVATION", solveMode: "findDistanceFromSurdHeightAt60Degrees", seed, difficulty: "Medium", target: "LENGTH",
      stem: `A tower is ${formatExactPlain(height)} m high. From a point on level ground its top is seen at 60°. Find the horizontal distance from the point to the tower.`, state, correct: mvpNumberAnswer(run),
      wrong: [{ value: mvpNumberAnswer(height), misconceptionId: "RETURNED_GIVEN_HEIGHT" }, { value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "MULTIPLIED_BY_SQRT3" }, { value: mvpNumberAnswer(exactSurd(k, 2)), misconceptionId: "USED_45_DEGREE_PATTERN" }],
      explanation: mvpExplanation("Use d=h/tan60° and simplify exactly.", [`d=${formatExactPlain(height)}/√3.`, `So d=${formatExactPlain(run)} m.`], "Divide by tan60°; do not multiply by √3 again.") });
  }
  const k = mvpPick(seed, "011-k", [5, 7, 9] as const);
  const run = exactInteger(3 * k), height = exactSurd(k, 3);
  const state = buildSingleElevationState({ horizontal: run, angle: degree(30), objectKind: "FLAGPOLE", scenario: "FLAGPOLE", units: "m" });
  state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" };
  return buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-007", lockedFamily: "DISTANCE_FROM_ELEVATION", solveMode: "findIntegerDistanceFromSurdHeightAt30Degrees", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A vertical flagpole has height ${formatExactPlain(height)} m. If its top is seen at an angle of elevation of 30°, find the horizontal distance from the observation point to its foot.`, state, correct: mvpNumberAnswer(run),
    wrong: [{ value: mvpNumberAnswer(height), misconceptionId: "RETURNED_HEIGHT" }, { value: mvpNumberAnswer(exactInteger(k)), misconceptionId: "CANCELLED_SURD_INCORRECTLY" }, { value: mvpNumberAnswer(exactInteger(2 * k)), misconceptionId: "USED_SINE_HALF_RATIO" }],
    explanation: mvpExplanation("Since tan30°=1/√3, distance=height×√3.", [`d=${formatExactPlain(height)}×√3.`, `Hence d=${formatExactPlain(run)} m.`], "Multiplying √3 by √3 gives 3, not √3."),
  });
}

function ql013(seed: string) {
  const k = mvpPick(seed, "013-k", [5, 8, 11] as const);
  const run = exactInteger(3 * k);
  const state = buildSingleElevationState({ horizontal: run, angle: degree(30), objectKind: "TOWER", scenario: "TOWER", units: "m" });
  const height = state.verticalObjects[0].height;
  state.requested = { kind: "ANGLE", observationId: "obs-1" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-013", cpId: "TRG-CP-007", lockedFamily: "ANGLE_FROM_HEIGHT_DISTANCE", solveMode: "recover30DegreeAngleFromExactRatio", seed, difficulty: "Medium", target: "ANGLE",
    stem: `A tower is ${formatExactPlain(height)} m high and an observation point is ${formatExactPlain(run)} m from its foot. Find the angle of elevation of the top.`, state, correct: mvpAngleAnswer(degree(30)),
    wrong: [{ value: mvpAngleAnswer(degree(45)), misconceptionId: "MATCHED_RATIO_TO_45" }, { value: mvpAngleAnswer(degree(60)), misconceptionId: "INVERTED_TANGENT_RATIO" }, { value: mvpAngleAnswer(degree(90)), misconceptionId: "CONFUSED_VERTICAL_ANGLE" }],
    explanation: mvpExplanation("Compare height/distance with the exact tangent table.", [`tanθ=${formatExactPlain(height)}/${formatExactPlain(run)}=1/√3.`, "Therefore θ=30°."], "Use the ratio height ÷ horizontal distance, not its reciprocal."),
  });
}

function ql016(seed: string) {
  const k = mvpPick(seed, "016-k", [6, 8, 10] as const);
  const run = exactSurd(k, 3), targetHeight = exactInteger(2 * k), observerHeight = exactInteger(3 * k);
  const state = depressionState({ run, angle: 30, observerHeight, targetHeight, requested: "HEIGHT" });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-016", cpId: "TRG-CP-007", lockedFamily: "HEIGHT_FROM_DEPRESSION", solveMode: "findLowerObjectHeightFrom30DegreeDepression", seed, difficulty: "Medium", target: "LENGTH",
    stem: `From the top of a ${formatExactPlain(observerHeight)} m building, the top of a pole ${formatExactPlain(run)} m away is seen at a depression of 30°. Find the height of the pole.`, state, correct: mvpNumberAnswer(targetHeight),
    wrong: [{ value: mvpNumberAnswer(exactInteger(k)), misconceptionId: "RETURNED_VERTICAL_DROP" }, { value: mvpNumberAnswer(observerHeight), misconceptionId: "IGNORED_DEPRESSION" }, { value: mvpNumberAnswer(addExact(observerHeight, exactInteger(k))), misconceptionId: "ADDED_DROP_INSTEAD_OF_SUBTRACTING" }],
    explanation: mvpExplanation("The depression angle determines the vertical drop from the observer's level.", [`Drop=${formatExactPlain(run)}×tan30°=${k} m.`, `Pole height=${formatExactPlain(observerHeight)}−${k}=${formatExactPlain(targetHeight)} m.`], "The trigonometric opposite side is the level difference, not the full pole height."),
  });
}

function ql017(seed: string) {
  const k = mvpPick(seed, "017-k", [5, 7, 9] as const);
  const run = exactSurd(k, 3), targetHeight = exactInteger(2 * k), observerHeight = exactInteger(5 * k);
  const state = depressionState({ run, angle: 60, observerHeight, targetHeight, requested: "HEIGHT" });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-017", cpId: "TRG-CP-007", lockedFamily: "HEIGHT_FROM_DEPRESSION", solveMode: "findLowerObjectHeightFrom60DegreeDepression", seed, difficulty: "Medium", target: "LENGTH",
    stem: `From the top of a ${formatExactPlain(observerHeight)} m building, the top of a shorter tower ${formatExactPlain(run)} m away is seen at a depression of 60°. Find the shorter tower's height.`, state, correct: mvpNumberAnswer(targetHeight),
    wrong: [{ value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "RETURNED_VERTICAL_DROP" }, { value: mvpNumberAnswer(observerHeight), misconceptionId: "RETURNED_OBSERVER_HEIGHT" }, { value: mvpNumberAnswer(exactInteger(8 * k)), misconceptionId: "ADDED_VERTICAL_DROP" }],
    explanation: mvpExplanation("At 60° depression, drop=horizontal distance×√3.", [`Drop=${formatExactPlain(run)}×√3=${3 * k} m.`, `Target height=${formatExactPlain(observerHeight)}−${3 * k}=${formatExactPlain(targetHeight)} m.`], "Subtract the drop from the observer level; do not add it."),
  });
}

function ql019(seed: string) {
  const k = mvpPick(seed, "019-k", [6, 8, 12] as const);
  const run = exactSurd(k, 3), targetHeight = exactInteger(2 * k), observerHeight = exactInteger(3 * k);
  const state = depressionState({ run, angle: 30, observerHeight, targetHeight, requested: "DISTANCE" });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-019", cpId: "TRG-CP-007", lockedFamily: "DISTANCE_FROM_DEPRESSION", solveMode: "findDistanceFrom30DegreeDepressionBetweenKnownLevels", seed, difficulty: "Medium", target: "LENGTH",
    stem: `From a point ${formatExactPlain(observerHeight)} m above ground, the top of a ${formatExactPlain(targetHeight)} m pole is seen at a depression of 30°. Find the horizontal distance to the pole.`, state, correct: mvpNumberAnswer(run),
    wrong: [{ value: mvpNumberAnswer(exactInteger(k)), misconceptionId: "RETURNED_VERTICAL_DROP" }, { value: mvpNumberAnswer(observerHeight), misconceptionId: "USED_FULL_OBSERVER_HEIGHT" }, { value: mvpNumberAnswer(multiplyExact(exactInteger(k), exactInteger(3))), misconceptionId: "USED_TAN30_AS_ONE_THIRD" }],
    explanation: mvpExplanation("First take the difference in levels, then use tan30°.", [`Vertical drop=${formatExactPlain(observerHeight)}−${formatExactPlain(targetHeight)}=${k} m.`, `tan30°=${k}/d, so d=${formatExactPlain(run)} m.`], "Use the vertical difference, not either full height."),
  });
}

function ql021(seed: string) {
  const run = exactInteger(mvpPick(seed, "021-run", [12, 16, 20] as const));
  const observerHeight = run, targetHeight = exactInteger(0);
  const state = depressionState({ run, angle: 45, observerHeight, targetHeight, requested: "DISTANCE" });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-021", cpId: "TRG-CP-007", lockedFamily: "DISTANCE_FROM_DEPRESSION", solveMode: "findGroundDistanceFrom45DegreeDepression", seed, difficulty: "Easy", target: "LENGTH",
    stem: `From the top of a ${formatExactPlain(observerHeight)} m building, a point on level ground is seen at an angle of depression of 45°. Find the horizontal distance of the point from the building.`, state, correct: mvpNumberAnswer(run),
    wrong: [{ value: mvpNumberAnswer(multiplyExact(run, exactInteger(2))), misconceptionId: "DOUBLED_EQUAL_LEGS" }, { value: mvpNumberAnswer(div(run, exactInteger(2))), misconceptionId: "HALVED_EQUAL_LEGS" }, { value: mvpNumberAnswer(exactSurd(Number(formatExactPlain(run)), 2)), misconceptionId: "RETURNED_SIGHT_LINE_PATTERN" }],
    explanation: mvpExplanation("At 45°, the vertical drop and horizontal run are equal.", [`tan45°=${formatExactPlain(observerHeight)}/d=1.`, `Therefore d=${formatExactPlain(run)} m.`], "The horizontal distance is not the sloping line of sight."),
  });
}

function ql022(seed: string) {
  const k = mvpPick(seed, "022-k", [5, 7, 9] as const);
  const run = exactSurd(k, 3), targetHeight = exactInteger(2 * k), observerHeight = exactInteger(5 * k);
  const state = depressionState({ run, angle: 60, observerHeight, targetHeight, requested: "DISTANCE" });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-022", cpId: "TRG-CP-007", lockedFamily: "DISTANCE_FROM_DEPRESSION", solveMode: "findDistanceFrom60DegreeDepressionBetweenKnownLevels", seed, difficulty: "Medium", target: "LENGTH",
    stem: `From a point ${formatExactPlain(observerHeight)} m above ground, the top of a ${formatExactPlain(targetHeight)} m pole is seen at a depression of 60°. Find the horizontal distance to the pole.`, state, correct: mvpNumberAnswer(run),
    wrong: [{ value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "RETURNED_VERTICAL_DROP" }, { value: mvpNumberAnswer(exactInteger(k)), misconceptionId: "DIVIDED_BY_THREE_INSTEAD_OF_SQRT3" }, { value: mvpNumberAnswer(exactInteger(5 * k)), misconceptionId: "USED_FULL_OBSERVER_HEIGHT" }],
    explanation: mvpExplanation("Use the level difference as the opposite side of the 60° right triangle.", [`Drop=${formatExactPlain(observerHeight)}−${formatExactPlain(targetHeight)}=${3 * k} m.`, `d=${3 * k}/tan60°=${formatExactPlain(run)} m.`], "The denominator is √3, not 3."),
  });
}

export function generateTrg002ProductionCp007ExpansionQuestion(qlId: Trg002ProductionCp007ExpansionId, seed: string): Trg002MvpQuestion {
  switch (qlId) {
    case "TRG-002-QL-003": return ql003(seed);
    case "TRG-002-QL-004": return ql004(seed);
    case "TRG-002-QL-006": return ql006(seed);
    case "TRG-002-QL-008": return distanceElevation(seed, qlId);
    case "TRG-002-QL-010": return distanceElevation(seed, qlId);
    case "TRG-002-QL-011": return distanceElevation(seed, qlId);
    case "TRG-002-QL-013": return ql013(seed);
    case "TRG-002-QL-016": return ql016(seed);
    case "TRG-002-QL-017": return ql017(seed);
    case "TRG-002-QL-019": return ql019(seed);
    case "TRG-002-QL-021": return ql021(seed);
    case "TRG-002-QL-022": return ql022(seed);
  }
}
