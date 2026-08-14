import { degree } from "../foundation/angle";
import { addExact, exactInteger, exactSurd, formatExactPlain, multiplyExact, divideExact, assertDefined, subtractExact } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import { buildSameSideMovingState, type Trg002SpatialPoint, type Trg002SpatialState, type Trg002VerticalObject } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export const TRG_002_MVP_CP009_B_IDS = ["TRG-002-QL-067", "TRG-002-QL-069", "TRG-002-QL-071"] as const;
export type Trg002MvpCp009BId = (typeof TRG_002_MVP_CP009_B_IDS)[number];
const ZERO = exactInteger(0);
const div = (a: ExactTrigNumber, b: ExactTrigNumber) => assertDefined(divideExact(a, b));

function ql067(seed: string) {
  const k = mvpPick(seed, "067-k", [8, 10, 12] as const);
  const near = exactInteger(k);
  const far = exactSurd(k, 3);
  const separation = subtractExact(far, near);
  const state = buildSameSideMovingState({ farAngle: degree(30), nearAngle: degree(45), movementTowardObject: separation, units: "m" });
  state.movements = [];
  state.diagramStrategy = "TWO_OBSERVATIONS_SAME_SIDE";
  state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "far-ground" };
  const nearSightLine = exactSurd(k, 2);
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-067", cpId: "TRG-CP-009", lockedFamily: "FIND_ORIGINAL_DISTANCE", solveMode: "recoverOriginalDistanceFromKnownNearPoint",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `From a point ${formatExactPlain(near)} m from a tower, the angle of elevation of its top is 45°. From a farther point on the same straight line through the tower's foot, the angle is 30°. Find the farther point's distance from the tower.`,
    state, correct: mvpNumberAnswer(far),
    wrong: [
      { value: mvpNumberAnswer(near), misconceptionId: "RETURNED_NEAR_DISTANCE" },
      { value: mvpNumberAnswer(separation), misconceptionId: "RETURNED_POINT_SEPARATION" },
      { value: mvpNumberAnswer(nearSightLine), misconceptionId: "RETURNED_45_DEGREE_SIGHT_LINE" },
    ],
    explanation: mvpExplanation(
      "Use the 45° observation to find the tower height, then use the 30° observation for the farther distance.",
      [`At 45°, tower height=${formatExactPlain(near)} m.`, `If the farther distance is x, tan30°=${formatExactPlain(near)}/x=1/√3, so x=${formatExactPlain(far)} m.`],
      "The farther distance is not the separation between the two observation points.",
    ),
  });
}

function ql069(seed: string) {
  const k = mvpPick(seed, "069-k", [8, 10, 12] as const);
  const far = exactInteger(3 * k);
  const near = exactSurd(k, 3);
  const movement = subtractExact(far, near);
  const state = buildSameSideMovingState({ farAngle: degree(45), nearAngle: degree(60), movementTowardObject: movement, units: "m" });
  state.requested = { kind: "MOVEMENT_DISTANCE", movementId: "movement-1" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-069", cpId: "TRG-CP-009", lockedFamily: "FIND_MOVEMENT_SEPARATION", solveMode: "findCloserMovementFromOriginalDistanceAndAngles",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `From a point ${formatExactPlain(far)} m from a tower, its top is seen at an angle of elevation of 45°. An observer walks straight toward the tower until the angle becomes 60°. How far does the observer walk?`,
    state, correct: mvpNumberAnswer(movement),
    wrong: [
      { value: mvpNumberAnswer(near), misconceptionId: "RETURNED_FINAL_DISTANCE" },
      { value: mvpNumberAnswer(far), misconceptionId: "RETURNED_ORIGINAL_DISTANCE" },
      { value: mvpNumberAnswer(addExact(far, near)), misconceptionId: "ADDED_INSTEAD_OF_SUBTRACTING_DISTANCES" },
    ],
    explanation: mvpExplanation(
      "Use the first observation to get the height, the second to get the new distance, then subtract.",
      [`At 45°, tower height=${formatExactPlain(far)} m.`, `At 60°, final distance=${formatExactPlain(far)}/√3=${formatExactPlain(near)} m.`, `Movement=${formatExactPlain(far)}−${formatExactPlain(near)}=${formatExactPlain(movement)} m.`],
      "Walking distance is the difference between the original and final horizontal distances.",
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
    stem: `From an observation point on level ground, the tops of two towers of heights ${formatExactPlain(d)} m and ${formatExactPlain(farHeight)} m are each seen at an angle of elevation of 45°. The observation point and the feet of both towers lie on the same straight line, with both towers on the same side of the observation point. Find the distance between their feet.`,
    state: comparativeState(d), correct: mvpNumberAnswer(d),
    wrong: [
      { value: mvpNumberAnswer(farHeight), misconceptionId: "RETURNED_FAR_TOWER_DISTANCE" },
      { value: mvpNumberAnswer(multiplyExact(d, exactInteger(3))), misconceptionId: "ADDED_BOTH_GROUND_DISTANCES" },
      { value: mvpNumberAnswer(div(d, exactInteger(2))), misconceptionId: "HALVED_HEIGHT_DIFFERENCE" },
    ],
    explanation: mvpExplanation(
      "At 45°, each tower's horizontal distance from the observation point equals its height.",
      [`Near tower distance=${formatExactPlain(d)} m; far tower distance=${formatExactPlain(farHeight)} m.`, `Because the three ground points are collinear and both towers lie on the same side, separation=${formatExactPlain(farHeight)}−${formatExactPlain(d)}=${formatExactPlain(d)} m.`],
      "Subtract the two distances only because the observation point and both tower feet are on one straight line on the same side.",
    ),
  });
}

export function generateTrg002MvpCp009BQuestion(qlId: Trg002MvpCp009BId, seed: string): Trg002MvpQuestion {
  switch (qlId) { case "TRG-002-QL-067": return ql067(seed); case "TRG-002-QL-069": return ql069(seed); case "TRG-002-QL-071": return ql071(seed); }
}
