import { degree } from "../foundation/angle";
import { exactInteger, formatExactPlain, multiplyExact, divideExact, assertDefined } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import { buildSameSideMovingState, type Trg002SpatialPoint, type Trg002SpatialState, type Trg002VerticalObject } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export const TRG_002_MVP_CP009_B_IDS = ["TRG-002-QL-067", "TRG-002-QL-069", "TRG-002-QL-071"] as const;
export type Trg002MvpCp009BId = (typeof TRG_002_MVP_CP009_B_IDS)[number];
const ZERO = exactInteger(0);
const div = (a: ExactTrigNumber, b: ExactTrigNumber) => assertDefined(divideExact(a, b));

function movingBase(seed: string, salt: string) {
  const k = mvpPick(seed, salt, [8, 10, 12] as const);
  const movement = exactInteger(2 * k);
  const state = buildSameSideMovingState({ farAngle: degree(30), nearAngle: degree(60), movementTowardObject: movement, units: "m" });
  return { k, movement, state, near: exactInteger(k), far: exactInteger(3 * k), height: state.verticalObjects[0].height };
}

function ql067(seed: string) {
  const b = movingBase(seed, "067-k");
  b.state.movements = [];
  b.state.diagramStrategy = "TWO_OBSERVATIONS_SAME_SIDE";
  b.state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "far-ground" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-067", cpId: "TRG-CP-009", lockedFamily: "FIND_ORIGINAL_DISTANCE", solveMode: "recoverOriginalDistanceFromKnownNearPoint",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `From a point ${formatExactPlain(b.near)} m from a tower, the angle of elevation of its top is 60°. From a farther point on the same line, the angle is 30°. Find the farther point's distance from the tower.`,
    state: b.state, correct: mvpNumberAnswer(b.far),
    wrong: [
      { value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_NEAR_DISTANCE" },
      { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_POINT_SEPARATION" },
      { value: mvpNumberAnswer(b.height), misconceptionId: "RETURNED_HEIGHT" },
    ],
    explanation: mvpExplanation(
      "Use the nearer observation to find the common height, then recover the farther distance.",
      [`Height=${formatExactPlain(b.near)}×tan60°=${formatExactPlain(b.height)} m.`, `Far distance=${formatExactPlain(b.height)}/tan30°=${formatExactPlain(b.far)} m.`],
      "The two observations share one tower height; do not treat the point separation as the target.",
    ),
  });
}

function ql069(seed: string) {
  const b = movingBase(seed, "069-k");
  b.state.requested = { kind: "MOVEMENT_DISTANCE", movementId: "movement-1" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-069", cpId: "TRG-CP-009", lockedFamily: "FIND_MOVEMENT_SEPARATION", solveMode: "findCloserMovementFromOriginalDistanceAndAngles",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `From a point ${formatExactPlain(b.far)} m from a tower, its top is seen at 30°. An observer walks straight toward the tower until the angle becomes 60°. How far does the observer walk?`,
    state: b.state, correct: mvpNumberAnswer(b.movement),
    wrong: [
      { value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_FINAL_DISTANCE" },
      { value: mvpNumberAnswer(b.far), misconceptionId: "RETURNED_ORIGINAL_DISTANCE" },
      { value: mvpNumberAnswer(b.height), misconceptionId: "RETURNED_TOWER_HEIGHT" },
    ],
    explanation: mvpExplanation(
      "Find the common height from the first observation, then the final distance from the second.",
      [`Height=${formatExactPlain(b.far)}×tan30°=${formatExactPlain(b.height)} m.`, `Final distance=${formatExactPlain(b.height)}/tan60°=${formatExactPlain(b.near)} m.`, `Movement=${formatExactPlain(b.far)}−${formatExactPlain(b.near)}=${formatExactPlain(b.movement)} m.`],
      "Movement is the difference between the two same-side distances.",
    ),
  });
}

function point(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint { return { id, x, y, role, label }; }
function object(id: string, basePointId: string, topPointId: string, height: ExactTrigNumber): Trg002VerticalObject { return { id, kind: "TOWER", basePointId, topPointId, height }; }

function comparativeState(d: ExactTrigNumber): Trg002SpatialState {
  const farX = multiplyExact(d, exactInteger(2));
  return {
    packageId: "TRG-002", scenario: "TWO_BUILDINGS", groundY: ZERO,
    points: [
      point("observer-ground", ZERO, ZERO, "OBSERVER_GROUND", "O"),
      point("near-base", d, ZERO, "OBJECT_BASE", "A"), point("near-top", d, d, "OBJECT_TOP", "P"),
      point("far-base", farX, ZERO, "OBJECT_BASE", "B"), point("far-top", farX, farX, "OBJECT_TOP", "Q"),
    ],
    verticalObjects: [object("near-tower", "near-base", "near-top", d), object("far-tower", "far-base", "far-top", farX)],
    observers: [{ id: "observer-1", groundPointId: "observer-ground", eyePointId: "observer-ground", eyeHeight: ZERO }],
    observations: [
      { id: "obs-near", observerId: "observer-1", eyePointId: "observer-ground", targetPointId: "near-top", classification: "ELEVATION", angle: degree(45), horizontalReference: "EYE_LEVEL" },
      { id: "obs-far", observerId: "observer-1", eyePointId: "observer-ground", targetPointId: "far-top", classification: "ELEVATION", angle: degree(45), horizontalReference: "EYE_LEVEL" },
    ],
    movements: [], requested: { kind: "HORIZONTAL_DISTANCE", fromPointId: "near-base", toPointId: "far-base" },
    diagramStrategy: "BUILDING_TO_BUILDING", metadata: { units: "m", sameSide: true, observerOrder: ["observer-ground", "near-base", "far-base"] },
  };
}

function ql071(seed: string) {
  const d = exactInteger(mvpPick(seed, "071-d", [10, 12, 15] as const));
  const farHeight = multiplyExact(d, exactInteger(2));
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-071", cpId: "TRG-CP-009", lockedFamily: "COMPARATIVE_TWO_OBJECT_CONTROLLED", solveMode: "findSeparationBetweenTwo45DegreeObjects",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `From the same point on level ground, the tops of two towers of heights ${formatExactPlain(d)} m and ${formatExactPlain(farHeight)} m are each seen at 45°. The towers lie on the same side of the point. Find the distance between their feet.`,
    state: comparativeState(d), correct: mvpNumberAnswer(d),
    wrong: [
      { value: mvpNumberAnswer(farHeight), misconceptionId: "RETURNED_FAR_TOWER_DISTANCE" },
      { value: mvpNumberAnswer(multiplyExact(d, exactInteger(3))), misconceptionId: "ADDED_BOTH_GROUND_DISTANCES" },
      { value: mvpNumberAnswer(div(d, exactInteger(2))), misconceptionId: "HALVED_HEIGHT_DIFFERENCE" },
    ],
    explanation: mvpExplanation(
      "At 45°, each tower's horizontal distance from the observation point equals its height.",
      [`Near tower distance=${formatExactPlain(d)} m; far tower distance=${formatExactPlain(farHeight)} m.`, `Separation=${formatExactPlain(farHeight)}−${formatExactPlain(d)}=${formatExactPlain(d)} m.`],
      "Because both towers are on the same side, subtract their distances from the common observation point.",
    ),
  });
}

export function generateTrg002MvpCp009BQuestion(qlId: Trg002MvpCp009BId, seed: string): Trg002MvpQuestion {
  switch (qlId) { case "TRG-002-QL-067": return ql067(seed); case "TRG-002-QL-069": return ql069(seed); case "TRG-002-QL-071": return ql071(seed); }
}
