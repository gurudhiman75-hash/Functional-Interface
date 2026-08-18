import { degree } from "../foundation/angle";
import { exactInteger, exactSurd, formatExactPlain } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import type { Trg002SpatialPoint, Trg002SpatialState, Trg002VerticalObject } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick } from "./mvp-runtime-core";
import { generateTrg002ExamRealnessV2CanonicalQuestion } from "./production-exam-realness-v2";

const ZERO = exactInteger(0);
function p(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint { return { id, x, y, role, label }; }
function obj(id: string, basePointId: string, topPointId: string, height: ExactTrigNumber): Trg002VerticalObject { return { id, kind: "POLE", basePointId, topPointId, height }; }

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
      [`At 30°, shadow = h√3; at 60°, shadow = h/√3.`, `So h√3 − h/√3 = ${formatExactPlain(difference)}.`, `That is 2h/√3 = ${formatExactPlain(difference)}, hence h=${formatExactPlain(height)} m.`],
      "Do not treat the given difference as either one of the two shadow lengths.",
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
      [`Let the distance to the 60° pillar be x. Then h=x√3.`, `The other distance is ${formatExactPlain(roadWidth)}−x and h=(${formatExactPlain(roadWidth)}−x)/√3.`, `Equating gives 3x=${formatExactPlain(roadWidth)}−x, so x=${formatExactPlain(near)} and h=${formatExactPlain(height)} m.`],
      "The observer is not at the midpoint because the two elevation angles are different.",
    ),
  });
}

export const TRG_002_V4_CANONICAL_OVERRIDE_IDS = ["TRG-002-QL-027", "TRG-002-QL-079"] as const;

export function isTrg002V4CanonicalOverride(qlId: string) {
  return (TRG_002_V4_CANONICAL_OVERRIDE_IDS as readonly string[]).includes(qlId);
}

export function generateTrg002V4CanonicalQuestion(qlId: string, seed: string) {
  if (qlId === "TRG-002-QL-027") return ql027(seed);
  if (qlId === "TRG-002-QL-079") return ql079(seed);
  return generateTrg002ExamRealnessV2CanonicalQuestion(qlId, seed);
}
