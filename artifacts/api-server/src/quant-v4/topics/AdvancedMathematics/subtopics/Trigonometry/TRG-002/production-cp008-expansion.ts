import { degree } from "../foundation/angle";
import {
  addExact,
  assertDefined,
  divideExact,
  exactInteger,
  exactSurd,
  formatExactPlain,
  multiplyExact,
} from "../foundation/exact";
import { requireTrigExact } from "../foundation/standard-values";
import type { ExactTrigNumber } from "../foundation/types";
import {
  buildLadderState,
  buildSingleElevationState,
  type Trg002SpatialPoint,
  type Trg002SpatialState,
  type Trg002VerticalObject,
} from "./spatial";
import {
  buildTrg002MvpQuestion,
  mvpExplanation,
  mvpNumberAnswer,
  mvpPick,
  type Trg002MvpQuestion,
} from "./mvp-runtime-core";

export const TRG_002_PRODUCTION_CP008_EXPANSION_IDS = [
  "TRG-002-QL-026", "TRG-002-QL-027", "TRG-002-QL-029",
  "TRG-002-QL-031", "TRG-002-QL-034",
  "TRG-002-QL-037", "TRG-002-QL-039", "TRG-002-QL-040",
  "TRG-002-QL-042", "TRG-002-QL-044",
  "TRG-002-QL-046", "TRG-002-QL-047",
] as const;
export type Trg002ProductionCp008ExpansionId = (typeof TRG_002_PRODUCTION_CP008_EXPANSION_IDS)[number];

const ZERO = exactInteger(0);
const div = (a: ExactTrigNumber, b: ExactTrigNumber) => assertDefined(divideExact(a, b));
const tan = (angle: 30 | 45 | 60) => requireTrigExact("TAN", degree(angle));
const sin = (angle: 30 | 45 | 60) => requireTrigExact("SIN", degree(angle));

function point(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint {
  return { id, x, y, role, label };
}
function object(id: string, kind: Trg002VerticalObject["kind"], basePointId: string, topPointId: string, height: ExactTrigNumber): Trg002VerticalObject {
  return { id, kind, basePointId, topPointId, height };
}

function shadowState(height: ExactTrigNumber, shadow: ExactTrigNumber, angle: 30 | 45 | 60, requested: "HEIGHT" | "SHADOW"): Trg002SpatialState {
  return {
    packageId: "TRG-002", scenario: "SHADOW", groundY: ZERO,
    points: [
      point("object-base", ZERO, ZERO, "OBJECT_BASE", "B"),
      point("object-top", ZERO, height, "OBJECT_TOP", "T"),
      point("shadow-tip", shadow, ZERO, "SHADOW_TIP", "S"),
    ],
    verticalObjects: [object("object-1", "POLE", "object-base", "object-top", height)],
    observers: [{ id: "sun-reference", groundPointId: "shadow-tip", eyePointId: "shadow-tip", eyeHeight: ZERO }],
    observations: [{ id: "obs-sun", observerId: "sun-reference", eyePointId: "shadow-tip", targetPointId: "object-top", classification: "ELEVATION", angle: degree(angle), horizontalReference: "EYE_LEVEL" }],
    movements: [],
    requested: requested === "HEIGHT" ? { kind: "OBJECT_HEIGHT", objectId: "object-1" } : { kind: "SHADOW_LENGTH", objectId: "object-1", shadowTipPointId: "shadow-tip" },
    diagramStrategy: "SHADOW", metadata: { units: "m", sameSide: true },
  };
}

function brokenState(stump: ExactTrigNumber, angle: 30 | 45, requested: "PART" | "RUN") {
  const run = div(stump, tan(angle));
  const part = div(stump, sin(angle));
  const state: Trg002SpatialState = {
    packageId: "TRG-002", scenario: "BROKEN_OBJECT", groundY: ZERO,
    points: [point("tree-base", ZERO, ZERO, "OBJECT_BASE", "B"), point("break-point", ZERO, stump, "BREAK_POINT", "C"), point("touch-point", run, ZERO, "TOUCH_POINT", "D")],
    verticalObjects: [object("stump", "TREE", "tree-base", "break-point", stump)],
    observers: [{ id: "ground-reference", groundPointId: "touch-point", eyePointId: "touch-point", eyeHeight: ZERO }],
    observations: [{ id: "fallen-part", observerId: "ground-reference", eyePointId: "touch-point", targetPointId: "break-point", classification: "ELEVATION", angle: degree(angle), horizontalReference: "EYE_LEVEL" }],
    movements: [],
    requested: requested === "PART" ? { kind: "SIGHT_LINE_LENGTH", fromPointId: "touch-point", toPointId: "break-point" } : { kind: "HORIZONTAL_DISTANCE", fromPointId: "tree-base", toPointId: "touch-point" },
    diagramStrategy: "BROKEN_TREE", metadata: { units: "m", sameSide: true, notes: ["The sloping segment is the broken upper part."] },
  };
  return { state, run, part };
}

function ql026(seed: string) {
  const k = mvpPick(seed, "026-k", [5, 7, 9] as const);
  const shadow = exactInteger(3 * k), height = exactSurd(k, 3);
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-026", cpId: "TRG-CP-008", lockedFamily: "SHADOW_TO_HEIGHT", solveMode: "findHeightFrom30DegreeShadow", seed, difficulty: "Easy", target: "LENGTH",
    stem: `A pole casts a ${formatExactPlain(shadow)} m shadow when the sun's elevation is 30°. Find the exact height of the pole.`, state: shadowState(height, shadow, 30, "HEIGHT"), correct: mvpNumberAnswer(height),
    wrong: [{ value: mvpNumberAnswer(shadow), misconceptionId: "TREATED_SOLAR_ANGLE_AS_45" }, { value: mvpNumberAnswer(exactInteger(k)), misconceptionId: "DROPPED_SURD_FACTOR" }, { value: mvpNumberAnswer(exactInteger(3 * k / 2)), misconceptionId: "USED_SINE_HALF_FACTOR" }],
    explanation: mvpExplanation("For a shadow triangle, tanθ=object height/shadow length.", [`h=${formatExactPlain(shadow)}×tan30°.`, `Hence h=${formatExactPlain(height)} m.`], "The shadow is the adjacent side, so use tangent rather than sine."),
  });
}

function ql027(seed: string) {
  const k = mvpPick(seed, "027-k", [6, 8, 10] as const);
  const shadow = exactInteger(k), height = exactSurd(k, 3);
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-027", cpId: "TRG-CP-008", lockedFamily: "SHADOW_TO_HEIGHT", solveMode: "findHeightFrom60DegreeShadow", seed, difficulty: "Easy", target: "LENGTH",
    stem: `A vertical mast casts a ${formatExactPlain(shadow)} m shadow when the sun is at an elevation of 60°. Find the mast's exact height.`, state: shadowState(height, shadow, 60, "HEIGHT"), correct: mvpNumberAnswer(height),
    wrong: [{ value: mvpNumberAnswer(shadow), misconceptionId: "TREATED_ANGLE_AS_45" }, { value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "USED_TAN60_AS_THREE" }, { value: mvpNumberAnswer(exactSurd(k, 2)), misconceptionId: "USED_45_DEGREE_PATTERN" }],
    explanation: mvpExplanation("At 60°, tan60°=√3.", [`h=${formatExactPlain(shadow)}×√3.`, `Therefore h=${formatExactPlain(height)} m.`], "Keep √3 exact; do not replace it with 3."),
  });
}

function ql029(seed: string) {
  const k = mvpPick(seed, "029-k", [6, 9, 12] as const);
  const shadow = exactSurd(k, 3), height = exactInteger(k);
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-029", cpId: "TRG-CP-008", lockedFamily: "SHADOW_TO_HEIGHT", solveMode: "simplifyHeightFromSurdShadowAt30Degrees", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A tree casts a shadow ${formatExactPlain(shadow)} m long when the sun's elevation is 30°. Find the height of the tree.`, state: shadowState(height, shadow, 30, "HEIGHT"), correct: mvpNumberAnswer(height),
    wrong: [{ value: mvpNumberAnswer(shadow), misconceptionId: "RETURNED_SHADOW_LENGTH" }, { value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "MULTIPLIED_SURDS_INCORRECTLY" }, { value: mvpNumberAnswer(div(shadow, exactInteger(2))), misconceptionId: "USED_SINE_HALF_FACTOR" }],
    explanation: mvpExplanation("Multiply the shadow by tan30° and simplify the surd.", [`h=${formatExactPlain(shadow)}×1/√3.`, `Thus h=${formatExactPlain(height)} m.`], "The √3 cancels; it does not remain in the answer."),
  });
}

function ql031(seed: string) {
  const k = mvpPick(seed, "031-k", [6, 8, 12] as const);
  const shadow = exactInteger(k), height = exactSurd(k, 3);
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-031", cpId: "TRG-CP-008", lockedFamily: "HEIGHT_TO_SHADOW", solveMode: "findShadowFromHeightAt60Degrees", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A pole is ${formatExactPlain(height)} m high. When the sun's elevation is 60°, find the length of its shadow.`, state: shadowState(height, shadow, 60, "SHADOW"), correct: mvpNumberAnswer(shadow),
    wrong: [{ value: mvpNumberAnswer(height), misconceptionId: "RETURNED_HEIGHT" }, { value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "MULTIPLIED_BY_SQRT3" }, { value: mvpNumberAnswer(exactInteger(2 * k)), misconceptionId: "USED_SINE_RATIO" }],
    explanation: mvpExplanation("Shadow=height/tan60°.", [`s=${formatExactPlain(height)}/√3.`, `So s=${formatExactPlain(shadow)} m.`], "The shadow shortens as the solar elevation rises."),
  });
}

function ql034(seed: string) {
  const k = mvpPick(seed, "034-k", [5, 7, 9] as const);
  const oldShadow = exactInteger(k), height = exactSurd(k, 3), newShadow = exactInteger(3 * k);
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-034", cpId: "TRG-CP-008", lockedFamily: "CHANGED_SHADOW", solveMode: "findChangedShadowFrom60To30Degrees", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A pole casts a ${formatExactPlain(oldShadow)} m shadow when the sun's elevation is 60°. Later the elevation falls to 30°. Find the new shadow length.`, state: shadowState(height, newShadow, 30, "SHADOW"), correct: mvpNumberAnswer(newShadow),
    wrong: [{ value: mvpNumberAnswer(oldShadow), misconceptionId: "KEPT_SHADOW_UNCHANGED" }, { value: mvpNumberAnswer(height), misconceptionId: "RETURNED_POLE_HEIGHT" }, { value: mvpNumberAnswer(exactInteger(2 * k)), misconceptionId: "ASSUMED_SHADOW_DOUBLES" }],
    explanation: mvpExplanation("The pole height stays fixed while the tangent ratio changes.", [`From the 60° case, h=${formatExactPlain(oldShadow)}√3=${formatExactPlain(height)} m.`, `At 30°, s=h/tan30°=${formatExactPlain(newShadow)} m.`], "Changing 60° to 30° triples this shadow; it does not merely double it."),
  });
}

function ql037(seed: string) {
  const k = mvpPick(seed, "037-k", [5, 7, 10] as const);
  const ladder = exactInteger(2 * k), height = exactInteger(k);
  const state = buildLadderState({ ladderLength: ladder, angleAtGround: degree(30), units: "m" });
  state.requested = { kind: "OBJECT_HEIGHT", objectId: "wall-1" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-037", cpId: "TRG-CP-008", lockedFamily: "LADDER_AGAINST_WALL", solveMode: "findWallHeightFrom30DegreeLadder", seed, difficulty: "Easy", target: "LENGTH",
    stem: `A ${formatExactPlain(ladder)} m ladder leans against a wall and makes an angle of 30° with the ground. How high up the wall does it reach?`, state, correct: mvpNumberAnswer(height),
    wrong: [{ value: mvpNumberAnswer(ladder), misconceptionId: "RETURNED_LADDER_LENGTH" }, { value: mvpNumberAnswer(exactSurd(k, 3)), misconceptionId: "RETURNED_HORIZONTAL_REACH" }, { value: mvpNumberAnswer(exactInteger(4 * k)), misconceptionId: "INVERTED_SINE_RATIO" }],
    explanation: mvpExplanation("The ladder is the hypotenuse and wall height is opposite the 30° angle.", [`sin30°=h/${formatExactPlain(ladder)}=1/2.`, `Hence h=${formatExactPlain(height)} m.`], "Cosine would give the horizontal foot-to-wall distance, not the height."),
  });
}

function ql039(seed: string) {
  const k = mvpPick(seed, "039-k", [6, 8, 10] as const);
  const ladder = exactSurd(k, 2), run = exactInteger(k);
  const state = buildLadderState({ ladderLength: ladder, angleAtGround: degree(45), units: "m" });
  state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "wall-base", toPointId: "ladder-base" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-039", cpId: "TRG-CP-008", lockedFamily: "LADDER_AGAINST_WALL", solveMode: "findLadderFootDistanceAt45Degrees", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A ladder of length ${formatExactPlain(ladder)} m makes a 45° angle with the ground while leaning against a wall. Find the distance of its foot from the wall.`, state, correct: mvpNumberAnswer(run),
    wrong: [{ value: mvpNumberAnswer(ladder), misconceptionId: "RETURNED_LADDER_LENGTH" }, { value: mvpNumberAnswer(exactInteger(2 * k)), misconceptionId: "DROPPED_SQUARE_ROOT_DENOMINATOR" }, { value: mvpNumberAnswer(exactInteger(k / 2)), misconceptionId: "HALVED_EQUAL_LEG" }],
    explanation: mvpExplanation("At 45°, each leg equals hypotenuse/√2.", [`d=${formatExactPlain(ladder)}/√2.`, `Therefore d=${formatExactPlain(run)} m.`], "The ladder is the hypotenuse; the two legs are equal but shorter."),
  });
}

function ql040(seed: string) {
  const k = mvpPick(seed, "040-k", [5, 7, 9] as const);
  const ladder = exactInteger(2 * k), height = exactSurd(k, 3);
  const state = buildLadderState({ ladderLength: ladder, angleAtGround: degree(60), units: "m" });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-040", cpId: "TRG-CP-008", lockedFamily: "LADDER_AGAINST_WALL", solveMode: "findLadderLengthFromWallHeightAt60Degrees", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A ladder reaches ${formatExactPlain(height)} m up a wall and makes an angle of 60° with the ground. Find the length of the ladder.`, state, correct: mvpNumberAnswer(ladder),
    wrong: [{ value: mvpNumberAnswer(height), misconceptionId: "RETURNED_WALL_HEIGHT" }, { value: mvpNumberAnswer(exactInteger(k)), misconceptionId: "USED_COS60_INSTEAD_OF_SIN60" }, { value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "USED_SQRT3_AS_THREE" }],
    explanation: mvpExplanation("Wall height is opposite the ground angle and ladder length is the hypotenuse.", [`sin60°=${formatExactPlain(height)}/L=√3/2.`, `So L=${formatExactPlain(ladder)} m.`], "Use sine because the known wall reach is opposite the 60° angle."),
  });
}

function ql042(seed: string) {
  const stump = exactInteger(mvpPick(seed, "042-stump", [6, 8, 10] as const));
  const b = brokenState(stump, 45, "PART");
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-042", cpId: "TRG-CP-008", lockedFamily: "BROKEN_TREE_TOUCHING_GROUND", solveMode: "findFallenPartLengthAt45Degrees", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A tree breaks ${formatExactPlain(stump)} m above the ground and the broken upper part touches the ground at an angle of 45°. Find the length of the broken upper part.`, state: b.state, correct: mvpNumberAnswer(b.part),
    wrong: [{ value: mvpNumberAnswer(stump), misconceptionId: "RETURNED_STUMP_HEIGHT" }, { value: mvpNumberAnswer(b.run), misconceptionId: "RETURNED_TOUCH_DISTANCE" }, { value: mvpNumberAnswer(multiplyExact(stump, exactInteger(2))), misconceptionId: "ADDED_EQUAL_LEGS" }],
    explanation: mvpExplanation("At 45°, the stump and ground run are equal legs; the broken part is the hypotenuse.", [`L=${formatExactPlain(stump)}/sin45°.`, `Thus L=${formatExactPlain(b.part)} m.`], "The sloping broken part is longer than either equal leg."),
  });
}

function ql044(seed: string) {
  const stump = exactInteger(mvpPick(seed, "044-stump", [5, 7, 9] as const));
  const b = brokenState(stump, 30, "RUN");
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-044", cpId: "TRG-CP-008", lockedFamily: "BROKEN_TREE_TOUCHING_GROUND", solveMode: "findTouchDistanceAt30Degrees", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A pole breaks ${formatExactPlain(stump)} m above the ground. Its upper part touches the ground making a 30° angle with it. How far from the foot of the pole is the touch point?`, state: b.state, correct: mvpNumberAnswer(b.run),
    wrong: [{ value: mvpNumberAnswer(stump), misconceptionId: "RETURNED_STUMP_HEIGHT" }, { value: mvpNumberAnswer(b.part), misconceptionId: "RETURNED_FALLEN_PART" }, { value: mvpNumberAnswer(addExact(stump, b.part)), misconceptionId: "RETURNED_SUM_OF_STUMP_AND_FALLEN_PART" }],
    explanation: mvpExplanation("Use tangent with stump height opposite and touch distance adjacent.", [`tan30°=${formatExactPlain(stump)}/d.`, `So d=${formatExactPlain(b.run)} m.`], "The question asks for the horizontal run, not the sloping broken part."),
  });
}

function ql046(seed: string) {
  const k = mvpPick(seed, "046-k", [5, 8, 10] as const);
  const height = exactInteger(k), run = exactSurd(k, 3), wire = exactInteger(2 * k);
  const state = buildSingleElevationState({ horizontal: run, angle: degree(30), objectKind: "MAST", scenario: "MAST", units: "m", diagramStrategy: "GUY_WIRE" });
  const anchor = state.points.find((item) => item.id === "observer-ground"); if (anchor) anchor.role = "ANCHOR";
  state.requested = { kind: "SIGHT_LINE_LENGTH", fromPointId: "observer-ground", toPointId: "object-top" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-046", cpId: "TRG-CP-008", lockedFamily: "GUY_WIRE_MAST_ANCHOR", solveMode: "findGuyWireLengthAt30Degrees", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A guy wire runs from the top of a ${formatExactPlain(height)} m mast to an anchor on level ground and makes a 30° angle with the ground. Find the length of the wire.`, state, correct: mvpNumberAnswer(wire),
    wrong: [{ value: mvpNumberAnswer(height), misconceptionId: "RETURNED_MAST_HEIGHT" }, { value: mvpNumberAnswer(run), misconceptionId: "RETURNED_ANCHOR_DISTANCE" }, { value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "USED_TAN30_INSTEAD_OF_SIN30" }],
    explanation: mvpExplanation("The wire is the hypotenuse and mast height is opposite 30°.", [`sin30°=${formatExactPlain(height)}/L=1/2.`, `Therefore L=${formatExactPlain(wire)} m.`], "Use sine for the wire length; tangent would relate height to anchor distance."),
  });
}

function ql047(seed: string) {
  const k = mvpPick(seed, "047-k", [5, 7, 9] as const);
  const run = exactInteger(k), height = exactSurd(k, 3), wire = exactInteger(2 * k);
  const state = buildSingleElevationState({ horizontal: run, angle: degree(60), objectKind: "MAST", scenario: "MAST", units: "m", diagramStrategy: "GUY_WIRE" });
  const anchor = state.points.find((item) => item.id === "observer-ground"); if (anchor) anchor.role = "ANCHOR";
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-047", cpId: "TRG-CP-008", lockedFamily: "GUY_WIRE_MAST_ANCHOR", solveMode: "findMastHeightFromGuyWireAt60Degrees", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A ${formatExactPlain(wire)} m supporting wire is attached from the top of a mast to level ground and makes a 60° angle with the ground. Find the height of the mast.`, state, correct: mvpNumberAnswer(height),
    wrong: [{ value: mvpNumberAnswer(wire), misconceptionId: "RETURNED_WIRE_LENGTH" }, { value: mvpNumberAnswer(run), misconceptionId: "RETURNED_ANCHOR_DISTANCE" }, { value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "USED_SQRT3_AS_THREE" }],
    explanation: mvpExplanation("Mast height is opposite 60° and the wire is the hypotenuse.", [`h=${formatExactPlain(wire)}×sin60°.`, `Hence h=${formatExactPlain(height)} m.`], "Cosine would give the horizontal anchor distance, not the mast height."),
  });
}

export function generateTrg002ProductionCp008ExpansionQuestion(qlId: Trg002ProductionCp008ExpansionId, seed: string): Trg002MvpQuestion {
  switch (qlId) {
    case "TRG-002-QL-026": return ql026(seed);
    case "TRG-002-QL-027": return ql027(seed);
    case "TRG-002-QL-029": return ql029(seed);
    case "TRG-002-QL-031": return ql031(seed);
    case "TRG-002-QL-034": return ql034(seed);
    case "TRG-002-QL-037": return ql037(seed);
    case "TRG-002-QL-039": return ql039(seed);
    case "TRG-002-QL-040": return ql040(seed);
    case "TRG-002-QL-042": return ql042(seed);
    case "TRG-002-QL-044": return ql044(seed);
    case "TRG-002-QL-046": return ql046(seed);
    case "TRG-002-QL-047": return ql047(seed);
  }
}
