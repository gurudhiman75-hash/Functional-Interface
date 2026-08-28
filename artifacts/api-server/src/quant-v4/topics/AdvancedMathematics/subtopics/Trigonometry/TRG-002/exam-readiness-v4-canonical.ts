import { degree } from "../foundation/angle";
import { addExact, exactInteger, exactSurd, formatExactPlain, subtractExact } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import type { Trg002SpatialPoint, Trg002SpatialState, Trg002VerticalObject } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick } from "./mvp-runtime-core";
import { generateTrg002ExamRealnessV2CanonicalQuestion } from "./production-exam-realness-v2";

const ZERO = exactInteger(0);
function p(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint { return { id, x, y, role, label }; }
function obj(id: string, basePointId: string, topPointId: string, height: ExactTrigNumber, kind: Trg002VerticalObject["kind"] = "POLE"): Trg002VerticalObject { return { id, kind, basePointId, topPointId, height }; }

function ql005(seed: string) {
  const k = mvpPick(seed, "v4-005-k", [8, 10, 12] as const);
  const buildingHeight = exactInteger(k);
  const horizontal = exactInteger(3 * k);
  const totalHeight = exactSurd(k, 3);
  const flagHeight = subtractExact(totalHeight, buildingHeight);
  const state: Trg002SpatialState = {
    packageId: "TRG-002",
    scenario: "BUILDING",
    groundY: ZERO,
    points: [
      p("building-base", ZERO, ZERO, "OBJECT_BASE", "B"),
      p("roof", ZERO, buildingHeight, "AUXILIARY", "R"),
      p("flag-top", ZERO, totalHeight, "OBJECT_TOP", "T"),
      p("observer", horizontal, ZERO, "OBSERVER_GROUND", "O"),
    ],
    verticalObjects: [
      obj("building-1", "building-base", "roof", buildingHeight, "BUILDING"),
      obj("flagstaff-1", "roof", "flag-top", flagHeight, "FLAGPOLE"),
    ],
    observers: [{ id: "observer-1", groundPointId: "observer", eyePointId: "observer", eyeHeight: ZERO }],
    observations: [{ id: "obs-top", observerId: "observer-1", eyePointId: "observer", targetPointId: "flag-top", classification: "ELEVATION", angle: degree(30), horizontalReference: "EYE_LEVEL" }],
    movements: [],
    requested: { kind: "OBJECT_HEIGHT", objectId: "flagstaff-1" },
    diagramStrategy: "SINGLE_ELEVATION",
    metadata: { units: "m", sameSide: true, notes: ["V4 composite vertical: the trigonometric height is roof plus flagstaff; subtract the known building height only after finding the total top level."] },
  };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-005", cpId: "TRG-CP-007", lockedFamily: "COMPOSITE_VERTICAL", solveMode: "findFlagstaffHeightOnBuildingFromElevation", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A vertical flagstaff stands on the roof of a ${formatExactPlain(buildingHeight)} m high building. From a point ${formatExactPlain(horizontal)} m from the foot of the building, the angle of elevation of the top of the flagstaff is 30°. Find the exact height of the flagstaff.`,
    state,
    correct: mvpNumberAnswer(flagHeight),
    wrong: [
      { value: mvpNumberAnswer(totalHeight), misconceptionId: "RETURNED_TOTAL_HEIGHT_TO_FLAG_TOP" },
      { value: mvpNumberAnswer(buildingHeight), misconceptionId: "RETURNED_BUILDING_HEIGHT" },
      { value: mvpNumberAnswer(exactSurd(k, 2)), misconceptionId: "USED_SINE_WITH_HORIZONTAL_DISTANCE" },
    ],
    explanation: mvpExplanation(
      "First find the total height up to the top of the flagstaff, then subtract the building height.",
      [`Total height = ${formatExactPlain(horizontal)}×tan30° = ${formatExactPlain(totalHeight)} m.`, `Flagstaff height = ${formatExactPlain(totalHeight)} − ${formatExactPlain(buildingHeight)} = ${formatExactPlain(flagHeight)} m.`],
      "The tangent gives the height of the top above ground, not the flagstaff alone.",
    ),
  });
}

function ql027(seed: string) {
  const k = mvpPick(seed, "v4-027-k", [8, 10, 12] as const);
  const height = exactSurd(k, 3);
  const shortShadow = exactInteger(k);
  const longShadow = exactInteger(3 * k);
  const difference = exactInteger(2 * k);
  const state: Trg002SpatialState = {
    packageId: "TRG-002",
    scenario: "SHADOW",
    groundY: ZERO,
    points: [
      p("pole-base", ZERO, ZERO, "OBJECT_BASE", "B"),
      p("pole-top", ZERO, height, "OBJECT_TOP", "T"),
      p("shadow-60", shortShadow, ZERO, "SHADOW_TIP", "S₆₀"),
      p("shadow-30", longShadow, ZERO, "SHADOW_TIP", "S₃₀"),
    ],
    verticalObjects: [obj("pole-1", "pole-base", "pole-top", height)],
    observers: [
      { id: "sun-ref-60", groundPointId: "shadow-60", eyePointId: "shadow-60", eyeHeight: ZERO },
      { id: "sun-ref-30", groundPointId: "shadow-30", eyePointId: "shadow-30", eyeHeight: ZERO },
    ],
    observations: [
      { id: "obs-60", observerId: "sun-ref-60", eyePointId: "shadow-60", targetPointId: "pole-top", classification: "ELEVATION", angle: degree(60), horizontalReference: "EYE_LEVEL" },
      { id: "obs-30", observerId: "sun-ref-30", eyePointId: "shadow-30", targetPointId: "pole-top", classification: "ELEVATION", angle: degree(30), horizontalReference: "EYE_LEVEL" },
    ],
    movements: [],
    requested: { kind: "OBJECT_HEIGHT", objectId: "pole-1" },
    diagramStrategy: "SHADOW",
    metadata: { units: "m", sameSide: true, notes: ["V4: show both shadow endpoints and label the given difference between them."] },
  };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-027", cpId: "TRG-CP-008", lockedFamily: "CHANGED_SHADOW", solveMode: "findHeightFromDifferenceOf30And60DegreeShadows", seed, difficulty: "Medium", target: "LENGTH",
    stem: `At two different times, the angles of elevation of the sun are 30° and 60°. The difference between the lengths of the shadows of a vertical pole is ${formatExactPlain(difference)} m. Find the exact height of the pole.`,
    state,
    correct: mvpNumberAnswer(height),
    wrong: [
      { value: mvpNumberAnswer(exactInteger(k)), misconceptionId: "USED_SHORT_SHADOW_AS_HEIGHT" },
      { value: mvpNumberAnswer(difference), misconceptionId: "RETURNED_SHADOW_DIFFERENCE" },
      { value: mvpNumberAnswer(exactSurd(2 * k, 3)), misconceptionId: "MISSED_FACTOR_TWO_IN_SHADOW_DIFFERENCE" },
    ],
    explanation: mvpExplanation(
      "For a fixed pole, shadow length is h cotθ. Use the difference of the two shadow lengths.",
      ["At 30°, shadow = h√3; at 60°, shadow = h/√3.", `So h√3 − h/√3 = ${formatExactPlain(difference)}.`, `That is 2h/√3 = ${formatExactPlain(difference)}, hence h=${formatExactPlain(height)} m.`],
      "Do not treat the given difference as either one of the two shadow lengths.",
    ),
  });
}

function ql028(seed: string) {
  const k = mvpPick(seed, "v4-028-k", [4, 5, 6] as const);
  const difference = exactInteger(2 * k);
  const height = addExact(exactInteger(k), exactSurd(k, 3));
  const shadow = addExact(exactInteger(3 * k), exactSurd(k, 3));
  const state: Trg002SpatialState = {
    packageId: "TRG-002",
    scenario: "SHADOW",
    groundY: ZERO,
    points: [
      p("pole-base", ZERO, ZERO, "OBJECT_BASE", "B"),
      p("pole-top", ZERO, height, "OBJECT_TOP", "T"),
      p("shadow-tip", shadow, ZERO, "SHADOW_TIP", "S"),
    ],
    verticalObjects: [obj("pole-1", "pole-base", "pole-top", height)],
    observers: [{ id: "sun-ref", groundPointId: "shadow-tip", eyePointId: "shadow-tip", eyeHeight: ZERO }],
    observations: [{ id: "obs-sun", observerId: "sun-ref", eyePointId: "shadow-tip", targetPointId: "pole-top", classification: "ELEVATION", angle: degree(30), horizontalReference: "EYE_LEVEL" }],
    movements: [],
    requested: { kind: "OBJECT_HEIGHT", objectId: "pole-1" },
    diagramStrategy: "SHADOW",
    metadata: { units: "m", sameSide: true, measurements: { "shadow-minus-height": difference }, notes: ["V4 relational shadow: the given is the difference between shadow length and pole height, not either length itself."] },
  };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-028", cpId: "TRG-CP-008", lockedFamily: "SHADOW_RELATION", solveMode: "findHeightWhen30DegreeShadowExceedsHeightByGivenAmount", seed, difficulty: "Medium", target: "LENGTH",
    stem: `When the angle of elevation of the sun is 30°, the shadow of a vertical pole is ${formatExactPlain(difference)} m longer than the height of the pole. Find the exact height of the pole.`,
    state,
    correct: mvpNumberAnswer(height),
    wrong: [
      { value: mvpNumberAnswer(difference), misconceptionId: "RETURNED_GIVEN_DIFFERENCE" },
      { value: mvpNumberAnswer(exactSurd(k, 3)), misconceptionId: "MISSED_RATIONALIZATION_TERM" },
      { value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "USED_TAN30_AS_ONE_THIRD" },
    ],
    explanation: mvpExplanation(
      "At 30°, shadow = h√3. Use the stated difference between shadow length and pole height.",
      [`h√3 − h = ${formatExactPlain(difference)}, so h(√3−1) = ${formatExactPlain(difference)}.`, `Therefore h = ${formatExactPlain(difference)}/(√3−1) = ${formatExactPlain(height)} m.`],
      "The given number is shadow minus height; it is neither the shadow length nor the pole height.",
    ),
  });
}

function ql079(seed: string) {
  const k = mvpPick(seed, "v4-079-k", [8, 10, 12] as const);
  const roadWidth = exactInteger(4 * k);
  const near = exactInteger(k);
  const far = exactInteger(3 * k);
  const height = exactSurd(k, 3);
  const state: Trg002SpatialState = {
    packageId: "TRG-002",
    scenario: "POLE",
    groundY: ZERO,
    points: [
      p("left-base", ZERO, ZERO, "OBJECT_BASE", "A"),
      p("left-top", ZERO, height, "OBJECT_TOP", "P"),
      p("observer", near, ZERO, "OBSERVER_GROUND", "O"),
      p("right-base", roadWidth, ZERO, "OBJECT_BASE", "B"),
      p("right-top", roadWidth, height, "OBJECT_TOP", "Q"),
    ],
    verticalObjects: [obj("pillar-left", "left-base", "left-top", height), obj("pillar-right", "right-base", "right-top", height)],
    observers: [{ id: "observer-1", groundPointId: "observer", eyePointId: "observer", eyeHeight: ZERO }],
    observations: [
      { id: "obs-left", observerId: "observer-1", eyePointId: "observer", targetPointId: "left-top", classification: "ELEVATION", angle: degree(60), horizontalReference: "EYE_LEVEL" },
      { id: "obs-right", observerId: "observer-1", eyePointId: "observer", targetPointId: "right-top", classification: "ELEVATION", angle: degree(30), horizontalReference: "EYE_LEVEL" },
    ],
    movements: [],
    requested: { kind: "OBJECT_HEIGHT", objectId: "pillar-left" },
    diagramStrategy: "OPPOSITE_SIDE_OBSERVATIONS",
    metadata: { units: "m", oppositeSide: true, observerOrder: ["left-base", "observer", "right-base"], notes: ["V4 roadway: two equal pillars at opposite road edges, observer between them."] },
  };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-079", cpId: "TRG-CP-010", lockedFamily: "OPPOSITE_SIDE_OBSERVATIONS", solveMode: "equalRoadsidePillarsObserverBetween30And60", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two pillars of equal height stand at opposite edges of a straight road ${formatExactPlain(roadWidth)} m wide. From a point between them, their tops are seen at angles of elevation 60° and 30°. Find the height of each pillar.`,
    state,
    correct: mvpNumberAnswer(height),
    wrong: [
      { value: mvpNumberAnswer(near), misconceptionId: "RETURNED_NEAR_GROUND_DISTANCE" },
      { value: mvpNumberAnswer(far), misconceptionId: "RETURNED_FAR_GROUND_DISTANCE" },
      { value: mvpNumberAnswer(exactSurd(2 * k, 3)), misconceptionId: "ASSUMED_OBSERVER_AT_MIDPOINT" },
    ],
    explanation: mvpExplanation(
      "Equal pillar heights link the two tangent equations, while the two ground distances add to the road width.",
      ["Let the distance to the 60° pillar be x. Then h=x√3.", `The other distance is ${formatExactPlain(roadWidth)}−x and h=(${formatExactPlain(roadWidth)}−x)/√3.`, `Equating gives 3x=${formatExactPlain(roadWidth)}−x, so x=${formatExactPlain(near)} and h=${formatExactPlain(height)} m.`],
      "The observer is not at the midpoint because the two elevation angles are different.",
    ),
  });
}

function ql087(seed: string) {
  const k = mvpPick(seed, "v4-087-k", [5, 6, 8] as const);
  const shorterHeight = exactInteger(3 * k);
  const tallerHeight = exactInteger(6 * k);
  const rise = exactInteger(3 * k);
  const separation = exactSurd(k, 3);
  const state: Trg002SpatialState = {
    packageId: "TRG-002",
    scenario: "TWO_BUILDINGS",
    groundY: ZERO,
    points: [
      p("short-base", ZERO, ZERO, "OBJECT_BASE", "A"),
      p("short-top", ZERO, shorterHeight, "OBSERVER_EYE", "P"),
      p("tall-base", separation, ZERO, "OBJECT_BASE", "B"),
      p("tall-top", separation, tallerHeight, "OBJECT_TOP", "Q"),
    ],
    verticalObjects: [
      obj("short-building", "short-base", "short-top", shorterHeight, "BUILDING"),
      obj("tall-building", "tall-base", "tall-top", tallerHeight, "BUILDING"),
    ],
    observers: [{ id: "roof-observer", groundPointId: "short-base", eyePointId: "short-top", eyeHeight: shorterHeight }],
    observations: [{ id: "obs-roofs", observerId: "roof-observer", eyePointId: "short-top", targetPointId: "tall-top", classification: "ELEVATION", angle: degree(60), horizontalReference: "EYE_LEVEL" }],
    movements: [],
    requested: { kind: "HORIZONTAL_DISTANCE", fromPointId: "short-base", toPointId: "tall-base" },
    diagramStrategy: "BUILDING_TO_BUILDING",
    metadata: { units: "m", sameSide: true, measurements: { "height-difference": rise }, notes: ["V4 natural parameters: both building heights are ordinary measured integers; the exact surd appears only in the derived answer."] },
  };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-087", cpId: "TRG-CP-010", lockedFamily: "BUILDING_TO_BUILDING", solveMode: "findBuildingSeparationFromNaturalIntegerHeightsAt60Degrees", seed, difficulty: "Medium", target: "LENGTH",
    stem: `Two buildings are ${formatExactPlain(shorterHeight)} m and ${formatExactPlain(tallerHeight)} m high. From the roof of the shorter building, the angle of elevation of the top of the taller building is 60°. Find the exact horizontal distance between the buildings.`,
    state,
    correct: mvpNumberAnswer(separation),
    wrong: [
      { value: mvpNumberAnswer(rise), misconceptionId: "RETURNED_HEIGHT_DIFFERENCE" },
      { value: mvpNumberAnswer(exactSurd(3 * k, 3)), misconceptionId: "MULTIPLIED_BY_TAN60_INSTEAD_OF_DIVIDING" },
      { value: mvpNumberAnswer(tallerHeight), misconceptionId: "RETURNED_TALLER_BUILDING_HEIGHT" },
    ],
    explanation: mvpExplanation(
      "Use the difference between the building heights as the vertical side of the roof-level triangle.",
      [`Height difference = ${formatExactPlain(tallerHeight)} − ${formatExactPlain(shorterHeight)} = ${formatExactPlain(rise)} m.`, `tan60° = ${formatExactPlain(rise)}/d, so d = ${formatExactPlain(rise)}/√3 = ${formatExactPlain(separation)} m.`],
      "The trigonometric rise is the difference of the two heights, not either full building height.",
    ),
  });
}

export const TRG_002_V4_CANONICAL_OVERRIDE_IDS = [
  "TRG-002-QL-005",
  "TRG-002-QL-027",
  "TRG-002-QL-028",
  "TRG-002-QL-079",
  "TRG-002-QL-087",
] as const;

export function isTrg002V4CanonicalOverride(qlId: string) {
  return (TRG_002_V4_CANONICAL_OVERRIDE_IDS as readonly string[]).includes(qlId);
}

export function generateTrg002V4CanonicalQuestion(qlId: string, seed: string) {
  if (qlId === "TRG-002-QL-005") return ql005(seed);
  if (qlId === "TRG-002-QL-027") return ql027(seed);
  if (qlId === "TRG-002-QL-028") return ql028(seed);
  if (qlId === "TRG-002-QL-079") return ql079(seed);
  if (qlId === "TRG-002-QL-087") return ql087(seed);
  return generateTrg002ExamRealnessV2CanonicalQuestion(qlId, seed);
}
