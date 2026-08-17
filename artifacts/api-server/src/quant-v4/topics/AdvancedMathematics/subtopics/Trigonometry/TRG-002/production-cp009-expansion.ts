import { degree } from "../foundation/angle";
import {
  addExact,
  exactInteger,
  exactSurd,
  formatExactPlain,
  multiplyExact,
  subtractExact,
} from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import {
  buildSameSideMovingState,
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

export const TRG_002_PRODUCTION_CP009_EXPANSION_IDS = [
  "TRG-002-QL-050", "TRG-002-QL-051", "TRG-002-QL-053", "TRG-002-QL-054",
  "TRG-002-QL-057", "TRG-002-QL-059", "TRG-002-QL-060",
  "TRG-002-QL-062", "TRG-002-QL-063",
  "TRG-002-QL-066",
  "TRG-002-QL-070", "TRG-002-QL-072",
] as const;
export type Trg002ProductionCp009ExpansionId = (typeof TRG_002_PRODUCTION_CP009_EXPANSION_IDS)[number];

function base3060(seed: string, salt: string) {
  const k = mvpPick(seed, salt, [6, 8, 10] as const);
  const near = exactInteger(k), far = exactInteger(3 * k), movement = exactInteger(2 * k);
  const state = buildSameSideMovingState({ farAngle: degree(30), nearAngle: degree(60), movementTowardObject: movement, units: "m" });
  return { k, near, far, movement, height: state.verticalObjects[0].height, state };
}
function base3045(seed: string, salt: string) {
  const k = mvpPick(seed, salt, [6, 8, 10] as const);
  const near = exactInteger(k), far = exactSurd(k, 3), movement = subtractExact(far, near);
  const state = buildSameSideMovingState({ farAngle: degree(30), nearAngle: degree(45), movementTowardObject: movement, units: "m" });
  return { k, near, far, movement, height: exactInteger(k), state };
}
function base4560(seed: string, salt: string) {
  const k = mvpPick(seed, salt, [6, 8, 10] as const);
  const near = exactInteger(k), far = exactSurd(k, 3), movement = subtractExact(far, near), height = exactSurd(k, 3);
  const state = buildSameSideMovingState({ farAngle: degree(45), nearAngle: degree(60), movementTowardObject: movement, units: "m" });
  return { k, near, far, movement, height, state };
}
function asTwoObservationState(state: Trg002SpatialState) {
  state.movements = [];
  state.diagramStrategy = "TWO_OBSERVATIONS_SAME_SIDE";
  return state;
}
function reverseMovementToFarther(state: Trg002SpatialState) {
  const movement = state.movements[0];
  if (!movement) throw new Error("TRG-002 CP009 expansion: canonical movement missing.");
  state.movements = [{ ...movement, observerId: "observer-near", fromGroundPointId: "near-ground", toGroundPointId: "far-ground", direction: "FARTHER" }];
  state.diagramStrategy = "OBSERVER_MOVES_FARTHER";
  return state;
}

function ql050(seed: string) {
  const b = base3045(seed, "050-k");
  asTwoObservationState(b.state);
  b.state.requested = { kind: "OBJECT_HEIGHT", objectId: "object-1" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-050", cpId: "TRG-CP-009", lockedFamily: "SAME_SIDE_TWO_OBSERVATIONS", solveMode: "findHeightFrom30And45SameSidePoints", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two points on the same side of a tower are ${formatExactPlain(b.movement)} m apart. The angles of elevation are 30° at the farther point and 45° at the nearer point. Find the height of the tower.`, state: b.state, correct: mvpNumberAnswer(b.height),
    wrong: [{ value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_NEAR_DISTANCE" }, { value: mvpNumberAnswer(b.far), misconceptionId: "RETURNED_FAR_DISTANCE" }, { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_POINT_SEPARATION" }],
    explanation: mvpExplanation("The same height must satisfy both tangent equations.", [`Let the nearer distance be x. Then the farther distance is x+${formatExactPlain(b.movement)}.`, `x tan45°=(x+${formatExactPlain(b.movement)})tan30°.`, `Solving gives x=${formatExactPlain(b.near)} m and height=${formatExactPlain(b.height)} m.`], "Do not treat the given separation as a distance from the tower."),
  });
}

function ql051(seed: string) {
  const b = base3045(seed, "051-k");
  asTwoObservationState(b.state);
  b.state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "far-ground" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-051", cpId: "TRG-CP-009", lockedFamily: "SAME_SIDE_TWO_OBSERVATIONS", solveMode: "findFarDistanceFrom30And45SameSidePoints", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two observation points on the same side of a tower are ${formatExactPlain(b.movement)} m apart. Their elevation angles are 45° at the nearer point and 30° at the farther point. Find the farther point's distance from the tower.`, state: b.state, correct: mvpNumberAnswer(b.far),
    wrong: [{ value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_NEAR_DISTANCE" }, { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_SEPARATION" }, { value: mvpNumberAnswer(b.height), misconceptionId: "RETURNED_TOWER_HEIGHT" }],
    explanation: mvpExplanation("Use equal tower height at the two observation points.", [`Near height=x tan45°=x.`, `Far height=(x+${formatExactPlain(b.movement)})tan30°.`, `Equating them gives far distance=${formatExactPlain(b.far)} m.`], "The farther distance includes the nearer distance plus the given separation."),
  });
}

function ql053(seed: string) {
  const b = base4560(seed, "053-k");
  asTwoObservationState(b.state);
  b.state.requested = { kind: "OBJECT_HEIGHT", objectId: "object-1" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-053", cpId: "TRG-CP-009", lockedFamily: "SAME_SIDE_TWO_OBSERVATIONS", solveMode: "findHeightFrom45And60SameSidePoints", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two points on the same side of a tower are ${formatExactPlain(b.movement)} m apart. The top is seen at 45° from the farther point and 60° from the nearer point. Find the tower's exact height.`, state: b.state, correct: mvpNumberAnswer(b.height),
    wrong: [{ value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_NEAR_DISTANCE" }, { value: mvpNumberAnswer(b.far), misconceptionId: "RETURNED_FAR_DISTANCE" }, { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_POINT_SEPARATION" }],
    explanation: mvpExplanation("Link the two tangent equations through the common height.", [`At the nearer point h=x tan60°=x√3.`, `At the farther point h=(x+${formatExactPlain(b.movement)})tan45°.`, `Solving gives h=${formatExactPlain(b.height)} m.`], "The 45° distance equals the height, but it is the farther ground distance in this configuration."),
  });
}

function ql054(seed: string) {
  const b = base4560(seed, "054-k");
  asTwoObservationState(b.state);
  b.state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "near-ground" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-054", cpId: "TRG-CP-009", lockedFamily: "SAME_SIDE_TWO_OBSERVATIONS", solveMode: "findNearDistanceFrom45And60SameSidePoints", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two observation points on the same side of a tower are ${formatExactPlain(b.movement)} m apart. The angles of elevation are 45° at the farther point and 60° at the nearer point. Find the nearer point's distance from the tower.`, state: b.state, correct: mvpNumberAnswer(b.near),
    wrong: [{ value: mvpNumberAnswer(b.far), misconceptionId: "RETURNED_FAR_DISTANCE" }, { value: mvpNumberAnswer(b.height), misconceptionId: "RETURNED_HEIGHT" }, { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_SEPARATION" }],
    explanation: mvpExplanation("Use the common height to solve the unequal ground distances.", [`Let nearer distance=x, so farther distance=x+${formatExactPlain(b.movement)}.`, `x tan60°=(x+${formatExactPlain(b.movement)})tan45°.`, `Hence x=${formatExactPlain(b.near)} m.`], "The nearer point is not at the given separation from the tower."),
  });
}

function ql057(seed: string) {
  const b = base3060(seed, "057-k");
  b.state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "far-ground" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-057", cpId: "TRG-CP-009", lockedFamily: "OBSERVER_MOVES_CLOSER", solveMode: "findOriginalDistanceAfterMovingCloser", seed, difficulty: "Hard", target: "LENGTH",
    stem: `An observer sees the top of a tower at 30°. After walking ${formatExactPlain(b.movement)} m straight toward it, the angle becomes 60°. Find the observer's original distance from the tower.`, state: b.state, correct: mvpNumberAnswer(b.far),
    wrong: [{ value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_FINAL_DISTANCE" }, { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_DISTANCE_WALKED" }, { value: mvpNumberAnswer(b.height), misconceptionId: "RETURNED_TOWER_HEIGHT" }],
    explanation: mvpExplanation("The original and final distances differ by the walked distance and share one tower height.", [`Let final distance=x, original=x+${formatExactPlain(b.movement)}.`, `x tan60°=(x+${formatExactPlain(b.movement)})tan30°.`, `This gives original distance=${formatExactPlain(b.far)} m.`], "Original distance is the farther ground distance, not the movement alone."),
  });
}

function ql059(seed: string) {
  const b = base3060(seed, "059-k");
  b.state.requested = { kind: "MOVEMENT_DISTANCE", movementId: "movement-1" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-059", cpId: "TRG-CP-009", lockedFamily: "OBSERVER_MOVES_CLOSER", solveMode: "findCloserMovementFromKnownHeight30To60", seed, difficulty: "Hard", target: "LENGTH",
    stem: `A tower is ${formatExactPlain(b.height)} m high. An observer sees its top at 30°, then walks directly toward the tower until the angle becomes 60°. Find the distance walked.`, state: b.state, correct: mvpNumberAnswer(b.movement),
    wrong: [{ value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_FINAL_DISTANCE" }, { value: mvpNumberAnswer(b.far), misconceptionId: "RETURNED_ORIGINAL_DISTANCE" }, { value: mvpNumberAnswer(b.height), misconceptionId: "RETURNED_HEIGHT" }],
    explanation: mvpExplanation("Use the known height to recover both ground distances, then subtract.", [`Original distance=${formatExactPlain(b.height)}/tan30°=${formatExactPlain(b.far)} m.`, `Final distance=${formatExactPlain(b.height)}/tan60°=${formatExactPlain(b.near)} m.`, `Movement=${formatExactPlain(b.far)}−${formatExactPlain(b.near)}=${formatExactPlain(b.movement)} m.`], "Moving toward the tower means original distance minus final distance."),
  });
}

function ql060(seed: string) {
  const b = base4560(seed, "060-k");
  b.state.requested = { kind: "OBJECT_HEIGHT", objectId: "object-1" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-060", cpId: "TRG-CP-009", lockedFamily: "OBSERVER_MOVES_CLOSER", solveMode: "findHeightAfterMovingCloser45To60", seed, difficulty: "Hard", target: "LENGTH",
    stem: `The angle of elevation of a tower top is initially 45°. After an observer walks ${formatExactPlain(b.movement)} m straight toward the tower, the angle becomes 60°. Find the exact height of the tower.`, state: b.state, correct: mvpNumberAnswer(b.height),
    wrong: [{ value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_FINAL_DISTANCE" }, { value: mvpNumberAnswer(b.far), misconceptionId: "RETURNED_INITIAL_DISTANCE" }, { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_MOVEMENT" }],
    explanation: mvpExplanation("The two observations use the same height with distances differing by the movement.", [`Let final distance=x. Then h=x√3 and initial distance=x+${formatExactPlain(b.movement)}.`, `Because the initial angle is 45°, h=x+${formatExactPlain(b.movement)}.`, `Solving gives h=${formatExactPlain(b.height)} m.`], "Do not use the movement as either complete ground distance."),
  });
}

function ql062(seed: string) {
  const b = base3045(seed, "062-k");
  reverseMovementToFarther(b.state);
  b.state.requested = { kind: "OBJECT_HEIGHT", objectId: "object-1" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-062", cpId: "TRG-CP-009", lockedFamily: "OBSERVER_MOVES_FARTHER", solveMode: "findHeightAfterMovingFarther45To30", seed, difficulty: "Hard", target: "LENGTH",
    stem: `An observer sees a tower top at 45°, then walks ${formatExactPlain(b.movement)} m straight away from the tower until the angle becomes 30°. Find the tower's height.`, state: b.state, correct: mvpNumberAnswer(b.height),
    wrong: [{ value: mvpNumberAnswer(b.far), misconceptionId: "RETURNED_FINAL_DISTANCE" }, { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_MOVEMENT" }, { value: mvpNumberAnswer(addExact(b.near, b.far)), misconceptionId: "ADDED_GROUND_DISTANCES" }],
    explanation: mvpExplanation("Moving farther increases the ground distance while the tower height stays fixed.", [`Initial distance=x and h=x tan45°=x.`, `Final distance=x+${formatExactPlain(b.movement)} and h=(x+${formatExactPlain(b.movement)})tan30°.`, `Solving gives h=${formatExactPlain(b.height)} m.`], "The movement is added to the initial distance before using the smaller 30° angle."),
  });
}

function ql063(seed: string) {
  const b = base3060(seed, "063-k");
  reverseMovementToFarther(b.state);
  b.state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "far-ground" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-063", cpId: "TRG-CP-009", lockedFamily: "OBSERVER_MOVES_FARTHER", solveMode: "findFinalDistanceAfterMovingFarther60To30", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A tower is ${formatExactPlain(b.height)} m high. An observer first sees its top at 60°, then walks away until the angle becomes 30°. Find the final horizontal distance from the tower.`, state: b.state, correct: mvpNumberAnswer(b.far),
    wrong: [{ value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_INITIAL_DISTANCE" }, { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_DISTANCE_WALKED" }, { value: mvpNumberAnswer(b.height), misconceptionId: "RETURNED_HEIGHT" }],
    explanation: mvpExplanation("Use the final 30° observation with the fixed tower height.", [`d_final=${formatExactPlain(b.height)}/tan30°.`, `Therefore d_final=${formatExactPlain(b.far)} m.`], "The final distance is measured from the tower, not merely the extra distance walked."),
  });
}

function ql066(seed: string) {
  const b = base4560(seed, "066-k");
  b.state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "far-ground" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-066", cpId: "TRG-CP-009", lockedFamily: "FIND_ORIGINAL_DISTANCE", solveMode: "findOriginalDistanceFrom45To60Movement", seed, difficulty: "Hard", target: "LENGTH",
    stem: `From an initial point, a tower top is seen at 45°. After moving ${formatExactPlain(b.movement)} m toward the tower, the angle becomes 60°. Find the initial distance from the tower.`, state: b.state, correct: mvpNumberAnswer(b.far),
    wrong: [{ value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_FINAL_DISTANCE" }, { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_MOVEMENT" }, { value: mvpNumberAnswer(b.height), misconceptionId: "RETURNED_HEIGHT" }],
    explanation: mvpExplanation("Set the common height from the 45° and 60° observations and use the movement difference.", [`Initial distance=d gives h=d at 45°.`, `Final distance=d−${formatExactPlain(b.movement)} gives h=(d−${formatExactPlain(b.movement)})√3.`, `Solving gives d=${formatExactPlain(b.far)} m.`], "The initial point is the farther of the two observation points."),
  });
}

const ZERO = exactInteger(0);
function p(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint { return { id, x, y, role, label }; }
function obj(id: string, basePointId: string, topPointId: string, height: ExactTrigNumber): Trg002VerticalObject { return { id, kind: "TOWER", basePointId, topPointId, height }; }
function comparativeState(input: { nearDistance: ExactTrigNumber; nearHeight: ExactTrigNumber; nearAngle: 30 | 45 | 60; farDistance: ExactTrigNumber; farHeight: ExactTrigNumber; farAngle: 30 | 45 | 60; }): Trg002SpatialState {
  return {
    packageId: "TRG-002", scenario: "TWO_BUILDINGS", groundY: ZERO,
    points: [
      p("observer-ground", ZERO, ZERO, "OBSERVER_GROUND", "O"),
      p("near-base", input.nearDistance, ZERO, "OBJECT_BASE", "A"), p("near-top", input.nearDistance, input.nearHeight, "OBJECT_TOP", "P"),
      p("far-base", input.farDistance, ZERO, "OBJECT_BASE", "B"), p("far-top", input.farDistance, input.farHeight, "OBJECT_TOP", "Q"),
    ],
    verticalObjects: [obj("near-tower", "near-base", "near-top", input.nearHeight), obj("far-tower", "far-base", "far-top", input.farHeight)],
    observers: [{ id: "observer-1", groundPointId: "observer-ground", eyePointId: "observer-ground", eyeHeight: ZERO }],
    observations: [
      { id: "obs-near", observerId: "observer-1", eyePointId: "observer-ground", targetPointId: "near-top", classification: "ELEVATION", angle: degree(input.nearAngle), horizontalReference: "EYE_LEVEL" },
      { id: "obs-far", observerId: "observer-1", eyePointId: "observer-ground", targetPointId: "far-top", classification: "ELEVATION", angle: degree(input.farAngle), horizontalReference: "EYE_LEVEL" },
    ],
    movements: [], requested: { kind: "HORIZONTAL_DISTANCE", fromPointId: "near-base", toPointId: "far-base" },
    diagramStrategy: "BUILDING_TO_BUILDING", metadata: { units: "m", sameSide: true, observerOrder: ["observer-ground", "near-base", "far-base"] },
  };
}

function ql070(seed: string) {
  const k = mvpPick(seed, "070-k", [6, 8, 10] as const);
  const nearDistance = exactInteger(k), nearHeight = exactInteger(k), farDistance = exactInteger(3 * k), farHeight = exactSurd(3 * k, 3), separation = exactInteger(2 * k);
  const state = comparativeState({ nearDistance, nearHeight, nearAngle: 45, farDistance, farHeight, farAngle: 60 });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-070", cpId: "TRG-CP-009", lockedFamily: "COMPARATIVE_TWO_OBJECT_CONTROLLED", solveMode: "compareTwoObjectsAt45And60FromOnePoint", seed, difficulty: "Hard", target: "LENGTH",
    stem: `From one observation point, a ${formatExactPlain(nearHeight)} m tower is seen at 45° and a farther ${formatExactPlain(farHeight)} m tower at 60°. Both tower feet lie on the same ray from the observer. Find the distance between the tower feet.`, state, correct: mvpNumberAnswer(separation),
    wrong: [{ value: mvpNumberAnswer(nearDistance), misconceptionId: "RETURNED_NEAR_TOWER_DISTANCE" }, { value: mvpNumberAnswer(farDistance), misconceptionId: "RETURNED_FAR_TOWER_DISTANCE" }, { value: mvpNumberAnswer(addExact(nearDistance, farDistance)), misconceptionId: "ADDED_SAME_SIDE_DISTANCES" }],
    explanation: mvpExplanation("Recover each tower's ground distance from its own height and elevation angle, then subtract because both feet are on the same ray.", [`Near distance=${formatExactPlain(nearHeight)}/tan45°=${formatExactPlain(nearDistance)} m.`, `Far distance=${formatExactPlain(farHeight)}/tan60°=${formatExactPlain(farDistance)} m.`, `Separation=${formatExactPlain(farDistance)}−${formatExactPlain(nearDistance)}=${formatExactPlain(separation)} m.`], "For same-ray points, use the difference of their distances from the observer."),
  });
}

function ql072(seed: string) {
  const k = mvpPick(seed, "072-k", [6, 8, 10] as const);
  const height = exactInteger(k), nearDistance = exactInteger(k), farDistance = exactSurd(k, 3), separation = subtractExact(farDistance, nearDistance);
  const state = comparativeState({ nearDistance, nearHeight: height, nearAngle: 45, farDistance, farHeight: height, farAngle: 30 });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-072", cpId: "TRG-CP-009", lockedFamily: "COMPARATIVE_TWO_OBJECT_CONTROLLED", solveMode: "compareEqualHeightObjectsAt45And30", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two equal-height towers of height ${formatExactPlain(height)} m stand on the same side of an observation point. Their tops are seen at 45° and 30°, with the 30° tower farther away. Find the distance between their feet.`, state, correct: mvpNumberAnswer(separation),
    wrong: [{ value: mvpNumberAnswer(nearDistance), misconceptionId: "RETURNED_NEAR_DISTANCE" }, { value: mvpNumberAnswer(farDistance), misconceptionId: "RETURNED_FAR_DISTANCE" }, { value: mvpNumberAnswer(addExact(nearDistance, farDistance)), misconceptionId: "ADDED_SAME_SIDE_DISTANCES" }],
    explanation: mvpExplanation("Use each tower height to find its ground distance, then subtract the same-side distances.", [`45° tower distance=${formatExactPlain(height)} m.`, `30° tower distance=${formatExactPlain(farDistance)} m.`, `Distance between feet=${formatExactPlain(farDistance)}−${formatExactPlain(nearDistance)}=${formatExactPlain(separation)} m.`], "Equal heights do not mean equal distances when the elevation angles differ."),
  });
}

export function generateTrg002ProductionCp009ExpansionQuestion(qlId: Trg002ProductionCp009ExpansionId, seed: string): Trg002MvpQuestion {
  switch (qlId) {
    case "TRG-002-QL-050": return ql050(seed);
    case "TRG-002-QL-051": return ql051(seed);
    case "TRG-002-QL-053": return ql053(seed);
    case "TRG-002-QL-054": return ql054(seed);
    case "TRG-002-QL-057": return ql057(seed);
    case "TRG-002-QL-059": return ql059(seed);
    case "TRG-002-QL-060": return ql060(seed);
    case "TRG-002-QL-062": return ql062(seed);
    case "TRG-002-QL-063": return ql063(seed);
    case "TRG-002-QL-066": return ql066(seed);
    case "TRG-002-QL-070": return ql070(seed);
    case "TRG-002-QL-072": return ql072(seed);
  }
}
