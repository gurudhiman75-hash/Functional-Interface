import { degree } from "../foundation/angle";
import {
  addExact,
  assertDefined,
  divideExact,
  exactInteger,
  exactSurd,
  formatExactPlain,
  multiplyExact,
  subtractExact,
} from "../foundation/exact";
import { requireTrigExact } from "../foundation/standard-values";
import type { ExactTrigNumber } from "../foundation/types";
import {
  buildSingleDepressionState,
  buildSingleElevationState,
  type Trg002SpatialPoint,
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

export const TRG_002_MVP_CP007_ADDED_IDS = [
  "TRG-002-QL-002",
  "TRG-002-QL-005",
  "TRG-002-QL-009",
  "TRG-002-QL-014",
  "TRG-002-QL-018",
  "TRG-002-QL-020",
  "TRG-002-QL-024",
] as const;

export type Trg002MvpCp007AddedId = (typeof TRG_002_MVP_CP007_ADDED_IDS)[number];

const ZERO = exactInteger(0);
const div = (a: ExactTrigNumber, b: ExactTrigNumber) => assertDefined(divideExact(a, b));
const tan = (angle: 30 | 45 | 60) => requireTrigExact("TAN", degree(angle));
const sin = (angle: 30 | 45 | 60) => requireTrigExact("SIN", degree(angle));

function point(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label?: string): Trg002SpatialPoint {
  return { id, x, y, role, ...(label ? { label } : {}) };
}

function verticalObject(id: string, kind: Trg002VerticalObject["kind"], basePointId: string, topPointId: string, height: ExactTrigNumber): Trg002VerticalObject {
  return { id, kind, basePointId, topPointId, height };
}

function ql002(seed: string) {
  const run = exactInteger(mvpPick(seed, "002-run", [12, 18, 24] as const));
  const state = buildSingleElevationState({ horizontal: run, angle: degree(45), objectKind: "FLAGPOLE", scenario: "FLAGPOLE", units: "m" });
  const correct = run;
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-002", cpId: "TRG-CP-007", lockedFamily: "HEIGHT_FROM_ELEVATION", solveMode: "findHeightFrom45DegreeElevation",
    seed, difficulty: "Easy", target: "LENGTH",
    stem: `From a point ${formatExactPlain(run)} m from the foot of a vertical flagpole, its top is seen at an elevation of 45°. Find the height of the flagpole.`,
    state, correct: mvpNumberAnswer(correct),
    wrong: [
      { value: mvpNumberAnswer(multiplyExact(run, exactInteger(2))), misconceptionId: "DOUBLED_HORIZONTAL_DISTANCE" },
      { value: mvpNumberAnswer(div(run, exactInteger(2))), misconceptionId: "HALVED_EQUAL_LEGS" },
      { value: mvpNumberAnswer(multiplyExact(run, exactSurd(1, 2))), misconceptionId: "USED_SINE_INSTEAD_OF_TANGENT" },
    ],
    explanation: mvpExplanation(
      "At 45°, tan45°=1, so height equals the horizontal distance.",
      [`tan45°=h/${formatExactPlain(run)}=1.`, `Therefore h=${formatExactPlain(run)} m.`],
      "The given ground distance is the adjacent side, so tangent—not sine—is the direct ratio.",
    ),
  });
}

function ql005(seed: string) {
  const k = mvpPick(seed, "005-k", [8, 10, 12] as const);
  const angle = mvpPick(seed, "005-angle", [30, 60] as const);
  const run = exactInteger(angle === 30 ? 3 * k : k);
  const correct = exactSurd(k, 3);
  const state = buildSingleElevationState({ horizontal: run, angle: degree(angle), objectKind: "TOWER", units: "m" });
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-005", cpId: "TRG-CP-007", lockedFamily: "HEIGHT_FROM_ELEVATION", solveMode: "findExactSurdHeightFromElevation",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `From a point ${formatExactPlain(run)} m from a tower, the angle of elevation of the top is ${angle}°. Find the exact height of the tower.`,
    state, correct: mvpNumberAnswer(correct),
    wrong: [
      { value: mvpNumberAnswer(run), misconceptionId: "TREATED_ANGLE_AS_45_DEGREES" },
      { value: mvpNumberAnswer(div(run, tan(angle))), misconceptionId: "INVERTED_TANGENT_RATIO" },
      { value: mvpNumberAnswer(multiplyExact(run, sin(angle))), misconceptionId: "USED_SINE_WITH_HORIZONTAL_SIDE" },
    ],
    explanation: mvpExplanation(
      "Use tanθ=height/horizontal distance and keep the exact surd form.",
      [`tan${angle}°=h/${formatExactPlain(run)}.`, `So h=${formatExactPlain(run)}×tan${angle}°=${formatExactPlain(correct)} m.`],
      "Do not decimalize √3; SSC-style exact values should stay exact.",
    ),
  });
}

function ql009(seed: string) {
  const h = exactInteger(mvpPick(seed, "009-h", [14, 20, 26] as const));
  const state = buildSingleElevationState({ horizontal: h, angle: degree(45), objectKind: "POLE", scenario: "POLE", units: "m" });
  state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-009", cpId: "TRG-CP-007", lockedFamily: "DISTANCE_FROM_ELEVATION", solveMode: "findDistanceAt45Degrees",
    seed, difficulty: "Easy", target: "LENGTH",
    stem: `A vertical pole is ${formatExactPlain(h)} m high. From a point on level ground, its top is seen at an elevation of 45°. Find the horizontal distance from the point to the pole.`,
    state, correct: mvpNumberAnswer(h),
    wrong: [
      { value: mvpNumberAnswer(multiplyExact(h, exactInteger(2))), misconceptionId: "DOUBLED_EQUAL_LEGS" },
      { value: mvpNumberAnswer(div(h, exactInteger(2))), misconceptionId: "HALVED_EQUAL_LEGS" },
      { value: mvpNumberAnswer(multiplyExact(h, exactSurd(1, 2))), misconceptionId: "USED_COSINE_AS_DIRECT_DISTANCE" },
    ],
    explanation: mvpExplanation(
      "At 45°, tan45°=height/distance=1.",
      [`1=${formatExactPlain(h)}/d.`, `Hence d=${formatExactPlain(h)} m.`],
      "The requested quantity is the horizontal distance, not the line of sight.",
    ),
  });
}

function ql014(seed: string) {
  const side = exactInteger(mvpPick(seed, "014-side", [9, 15, 21] as const));
  const state = buildSingleElevationState({ horizontal: side, angle: degree(45), objectKind: "CHIMNEY", scenario: "CHIMNEY", units: "m" });
  state.requested = { kind: "ANGLE", observationId: "obs-1" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-014", cpId: "TRG-CP-007", lockedFamily: "ANGLE_FROM_HEIGHT_DISTANCE", solveMode: "recover45DegreeAngleFromEqualLegs",
    seed, difficulty: "Easy", target: "ANGLE",
    stem: `A chimney is ${formatExactPlain(side)} m high, and an observation point is ${formatExactPlain(side)} m from its foot. Find the angle of elevation of the top.`,
    state, correct: mvpAngleAnswer(degree(45)),
    wrong: [
      { value: mvpAngleAnswer(degree(30)), misconceptionId: "MATCHED_TAN_ONE_TO_30" },
      { value: mvpAngleAnswer(degree(60)), misconceptionId: "MATCHED_TAN_ONE_TO_60" },
      { value: mvpAngleAnswer(degree(90)), misconceptionId: "CONFUSED_VERTICAL_OBJECT_WITH_SIGHT_ANGLE" },
    ],
    explanation: mvpExplanation(
      "Form tanθ=height/distance and match the exact standard value.",
      [`tanθ=${formatExactPlain(side)}/${formatExactPlain(side)}=1.`, "Since tan45°=1, θ=45°."],
      "The object being vertical does not make the angle of elevation 90°.",
    ),
  });
}

function depressionHeightState(observerHeight: ExactTrigNumber, run: ExactTrigNumber, targetHeight: ExactTrigNumber): Trg002SpatialState {
  return {
    packageId: "TRG-002", scenario: "TWO_BUILDINGS", groundY: ZERO,
    points: [
      point("observer-base", ZERO, ZERO, "OBJECT_BASE", "A"),
      point("observer-top", ZERO, observerHeight, "OBSERVER_EYE", "E"),
      point("target-base", run, ZERO, "OBJECT_BASE", "B"),
      point("target-top", run, targetHeight, "OBJECT_TOP", "T"),
    ],
    verticalObjects: [
      verticalObject("observer-building", "BUILDING", "observer-base", "observer-top", observerHeight),
      verticalObject("target-object", "POLE", "target-base", "target-top", targetHeight),
    ],
    observers: [{ id: "observer-1", groundPointId: "observer-base", eyePointId: "observer-top", eyeHeight: observerHeight }],
    observations: [{ id: "obs-1", observerId: "observer-1", eyePointId: "observer-top", targetPointId: "target-top", classification: "DEPRESSION", angle: degree(45), horizontalReference: "EYE_LEVEL" }],
    movements: [], requested: { kind: "OBJECT_HEIGHT", objectId: "target-object" }, diagramStrategy: "SINGLE_DEPRESSION",
    metadata: { units: "m", sameSide: true },
  };
}

function ql018(seed: string) {
  const run = exactInteger(mvpPick(seed, "018-run", [8, 12, 16] as const));
  const targetHeight = exactInteger(mvpPick(seed, "018-target", [10, 14, 18] as const));
  const observerHeight = addExact(targetHeight, run);
  const state = depressionHeightState(observerHeight, run, targetHeight);
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-018", cpId: "TRG-CP-007", lockedFamily: "HEIGHT_FROM_DEPRESSION", solveMode: "findLowerObjectHeightFrom45DegreeDepression",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `From the top of a ${formatExactPlain(observerHeight)} m building, the top of a pole ${formatExactPlain(run)} m away is seen at an angle of depression of 45°. Find the pole's height.`,
    state, correct: mvpNumberAnswer(targetHeight),
    wrong: [
      { value: mvpNumberAnswer(run), misconceptionId: "RETURNED_VERTICAL_DROP" },
      { value: mvpNumberAnswer(observerHeight), misconceptionId: "IGNORED_DEPRESSION" },
      { value: mvpNumberAnswer(addExact(observerHeight, run)), misconceptionId: "ADDED_DROP_INSTEAD_OF_SUBTRACTING" },
    ],
    explanation: mvpExplanation(
      "At 45° depression, vertical drop equals horizontal separation.",
      [`Vertical drop=${formatExactPlain(run)} m.`, `Pole height=${formatExactPlain(observerHeight)}−${formatExactPlain(run)}=${formatExactPlain(targetHeight)} m.`],
      "The horizontal distance gives the drop from eye level, not the pole height itself.",
    ),
  });
}

function ql020(seed: string) {
  const drop = exactInteger(mvpPick(seed, "020-drop", [9, 12, 15] as const));
  const targetHeight = exactInteger(mvpPick(seed, "020-target", [6, 10, 14] as const));
  const observerHeight = addExact(targetHeight, drop);
  const state = buildSingleDepressionState({ horizontal: drop, angle: degree(45), observerEyeHeight: observerHeight, targetHeight, units: "m" });
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-020", cpId: "TRG-CP-007", lockedFamily: "DISTANCE_FROM_DEPRESSION", solveMode: "findHorizontalDistanceFromDepressionAndLevels",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `From a point ${formatExactPlain(observerHeight)} m above the ground, the top of a ${formatExactPlain(targetHeight)} m pole is seen at a depression of 45°. Find the horizontal distance to the pole.`,
    state, correct: mvpNumberAnswer(drop),
    wrong: [
      { value: mvpNumberAnswer(observerHeight), misconceptionId: "USED_FULL_OBSERVER_HEIGHT" },
      { value: mvpNumberAnswer(targetHeight), misconceptionId: "RETURNED_TARGET_HEIGHT" },
      { value: mvpNumberAnswer(addExact(observerHeight, targetHeight)), misconceptionId: "ADDED_LEVELS_INSTEAD_OF_FINDING_DROP" },
    ],
    explanation: mvpExplanation(
      "First find the vertical drop between the two observed levels, then use tangent.",
      [`Vertical drop=${formatExactPlain(observerHeight)}−${formatExactPlain(targetHeight)}=${formatExactPlain(drop)} m.`, `At 45°, tan45°=drop/distance=1, so distance=${formatExactPlain(drop)} m.`],
      "Use the difference of the two heights; neither full height alone is the opposite side.",
    ),
  });
}

function ql024(seed: string) {
  const h = exactInteger(mvpPick(seed, "024-h", [8, 10, 12] as const));
  const run = exactSurd(h, 3);
  const state = buildSingleElevationState({ horizontal: run, angle: degree(30), objectKind: "TOWER", units: "m" });
  state.requested = { kind: "SIGHT_LINE_LENGTH", fromPointId: "observer-eye", toPointId: "object-top" };
  const correct = multiplyExact(h, exactInteger(2));
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-024", cpId: "TRG-CP-007", lockedFamily: "REVERSE_SINGLE_OBSERVATION", solveMode: "findSightLineFromHeightAndElevation",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `The top of a ${formatExactPlain(h)} m tower is seen from level ground at an elevation of 30°. Find the length of the line of sight to the top.`,
    state, correct: mvpNumberAnswer(correct),
    wrong: [
      { value: mvpNumberAnswer(h), misconceptionId: "RETURNED_TOWER_HEIGHT" },
      { value: mvpNumberAnswer(run), misconceptionId: "RETURNED_HORIZONTAL_DISTANCE" },
      { value: mvpNumberAnswer(multiplyExact(h, exactSurd(1, 3))), misconceptionId: "MULTIPLIED_BY_SQRT3_INSTEAD_OF_USING_SINE" },
    ],
    explanation: mvpExplanation(
      "When height is opposite and line of sight is the hypotenuse, use sine.",
      [`sin30°=${formatExactPlain(h)}/L=1/2.`, `Therefore L=2×${formatExactPlain(h)}=${formatExactPlain(correct)} m.`],
      "The line of sight is the hypotenuse, so it must exceed the tower height.",
    ),
  });
}

export function generateTrg002MvpCp007AddedQuestion(qlId: Trg002MvpCp007AddedId, seed: string): Trg002MvpQuestion {
  switch (qlId) {
    case "TRG-002-QL-002": return ql002(seed);
    case "TRG-002-QL-005": return ql005(seed);
    case "TRG-002-QL-009": return ql009(seed);
    case "TRG-002-QL-014": return ql014(seed);
    case "TRG-002-QL-018": return ql018(seed);
    case "TRG-002-QL-020": return ql020(seed);
    case "TRG-002-QL-024": return ql024(seed);
  }
}
