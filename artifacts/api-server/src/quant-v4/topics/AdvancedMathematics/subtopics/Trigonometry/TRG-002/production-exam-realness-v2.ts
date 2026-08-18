import { degree } from "../foundation/angle";
import {
  addExact,
  exactInteger,
  exactRational,
  exactSurd,
  exactToNumber,
  formatExactPlain,
  multiplyExact,
  subtractExact,
} from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import {
  buildSameSideMovingState,
  buildSingleElevationState,
  type Trg002SpatialState,
} from "./spatial";
import {
  buildTrg002MvpQuestion,
  mvpExplanation,
  mvpNumberAnswer,
  mvpPick,
} from "./mvp-runtime-core";
import { generateFrozenTrg002Production96Question } from "./production-frozen-96-runtime";

export const TRG_002_EXAM_REALNESS_V2_CANONICAL_OVERRIDE_IDS = [
  "TRG-002-QL-007",
  "TRG-002-QL-050",
  "TRG-002-QL-051",
  "TRG-002-QL-053",
  "TRG-002-QL-054",
  "TRG-002-QL-060",
  "TRG-002-QL-062",
  "TRG-002-QL-066",
] as const;

function absoluteExactDifference(left: ExactTrigNumber, right: ExactTrigNumber) {
  return exactToNumber(left) >= exactToNumber(right) ? subtractExact(left, right) : subtractExact(right, left);
}

function point(state: Trg002SpatialState, id: string) {
  const found = state.points.find((item) => item.id === id);
  if (!found) throw new Error(`TRG-002 exam-realness V2: missing canonical point ${id}.`);
  return found;
}

function movementGeometry(seed: string, salt: string, farAngle: 30 | 45, nearAngle: 45 | 60) {
  const moved = exactInteger(mvpPick(seed, salt, [8, 10, 12] as const));
  const state = buildSameSideMovingState({
    farAngle: degree(farAngle),
    nearAngle: degree(nearAngle),
    movementTowardObject: moved,
    units: "m",
  });
  const base = point(state, "object-base");
  const nearGround = point(state, "near-ground");
  const farGround = point(state, "far-ground");
  const near = absoluteExactDifference(nearGround.x, base.x);
  const far = absoluteExactDifference(farGround.x, base.x);
  const height = state.verticalObjects[0].height;
  const movement = state.movements[0]?.distance ?? moved;
  return { state, near, far, height, movement };
}

function asTwoObservationState(state: Trg002SpatialState) {
  state.movements = [];
  state.diagramStrategy = "TWO_OBSERVATIONS_SAME_SIDE";
  return state;
}

function reverseMovementToFarther(state: Trg002SpatialState) {
  const movement = state.movements[0];
  if (!movement) throw new Error("TRG-002 exam-realness V2: canonical movement missing.");
  state.movements = [{
    ...movement,
    observerId: "observer-near",
    fromGroundPointId: "near-ground",
    toGroundPointId: "far-ground",
    direction: "FARTHER",
  }];
  state.diagramStrategy = "OBSERVER_MOVES_FARTHER";
  return state;
}

function ql007(seed: string) {
  const distance = exactInteger(mvpPick(seed, "realness-007-distance", [16, 20, 24] as const));
  const state = buildSingleElevationState({ horizontal: distance, angle: degree(45), units: "m" });
  state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-007", cpId: "TRG-CP-007", lockedFamily: "DISTANCE_FROM_ELEVATION",
    solveMode: "findDistanceFromElevation", seed, difficulty: "Easy", target: "LENGTH",
    stem: `A tower is ${formatExactPlain(distance)} m high. From a point on level ground, its top is seen at an elevation of 45°. Find the horizontal distance from the point to the foot of the tower.`,
    state, correct: mvpNumberAnswer(distance),
    wrong: [
      { value: mvpNumberAnswer(multiplyExact(distance, exactInteger(2))), misconceptionId: "DOUBLED_EQUAL_LEGS" },
      { value: mvpNumberAnswer(multiplyExact(distance, exactRational(1, 2))), misconceptionId: "HALVED_EQUAL_LEGS" },
      { value: mvpNumberAnswer(multiplyExact(distance, exactSurd(1, 2))), misconceptionId: "RETURNED_SIGHT_LINE" },
    ],
    explanation: mvpExplanation(
      "At 45°, tan45°=1, so the tower height equals the horizontal distance.",
      [`tan45°=${formatExactPlain(distance)}/d=1.`, `Therefore d=${formatExactPlain(distance)} m.`],
      "Use the horizontal base distance, not the sloping line of sight.",
    ),
  });
}

function ql050(seed: string) {
  const g = movementGeometry(seed, "realness-050-movement", 30, 45);
  asTwoObservationState(g.state);
  g.state.requested = { kind: "OBJECT_HEIGHT", objectId: "object-1" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-050", cpId: "TRG-CP-009", lockedFamily: "SAME_SIDE_TWO_OBSERVATIONS",
    solveMode: "findHeightFrom30And45SameSidePoints", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two observation points on the same side of a tower are ${formatExactPlain(g.movement)} m apart. The angle of elevation of the top is 45° at the nearer point and 30° at the farther point. Find the exact height of the tower.`,
    state: g.state, correct: mvpNumberAnswer(g.height),
    wrong: [
      { value: mvpNumberAnswer(g.movement), misconceptionId: "RETURNED_POINT_SEPARATION" },
      { value: mvpNumberAnswer(g.far), misconceptionId: "RETURNED_FAR_DISTANCE" },
      { value: mvpNumberAnswer(multiplyExact(g.movement, exactInteger(2))), misconceptionId: "DOUBLED_POINT_SEPARATION" },
    ],
    explanation: mvpExplanation(
      "Use the common tower height in the 45° and 30° tangent relations.",
      [`Let the nearer distance be x. Then the farther distance is x+${formatExactPlain(g.movement)}.`, `x tan45°=(x+${formatExactPlain(g.movement)})tan30°; solve for x and hence the height.`],
      "The given integer is the separation between observation points, not a tower distance.",
    ),
  });
}

function ql051(seed: string) {
  const g = movementGeometry(seed, "realness-051-movement", 30, 45);
  asTwoObservationState(g.state);
  g.state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "far-ground" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-051", cpId: "TRG-CP-009", lockedFamily: "SAME_SIDE_TWO_OBSERVATIONS",
    solveMode: "findFarDistanceFrom30And45SameSidePoints", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two observation points on the same side of a tower are ${formatExactPlain(g.movement)} m apart. The angle of elevation is 45° at the nearer point and 30° at the farther point. Find the farther point's exact distance from the tower.`,
    state: g.state, correct: mvpNumberAnswer(g.far),
    wrong: [
      { value: mvpNumberAnswer(g.height), misconceptionId: "RETURNED_TOWER_HEIGHT" },
      { value: mvpNumberAnswer(g.movement), misconceptionId: "RETURNED_POINT_SEPARATION" },
      { value: mvpNumberAnswer(addExact(g.far, g.movement)), misconceptionId: "ADDED_SEPARATION_TWICE" },
    ],
    explanation: mvpExplanation(
      "Use one common tower height for both observation points.",
      [`Let the nearer distance be x; the farther distance is x+${formatExactPlain(g.movement)}.`, `Equate x tan45° and (x+${formatExactPlain(g.movement)})tan30° and then find the farther distance.`],
      "Do not report only the given separation between the two points.",
    ),
  });
}

function ql053(seed: string) {
  const g = movementGeometry(seed, "realness-053-movement", 45, 60);
  asTwoObservationState(g.state);
  g.state.requested = { kind: "OBJECT_HEIGHT", objectId: "object-1" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-053", cpId: "TRG-CP-009", lockedFamily: "SAME_SIDE_TWO_OBSERVATIONS",
    solveMode: "findHeightFrom45And60SameSidePoints", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two observation points on the same side of a tower are ${formatExactPlain(g.movement)} m apart. The angle of elevation of the top is 60° at the nearer point and 45° at the farther point. Find the exact height of the tower.`,
    state: g.state, correct: mvpNumberAnswer(g.height),
    wrong: [
      { value: mvpNumberAnswer(g.near), misconceptionId: "RETURNED_NEAR_DISTANCE" },
      { value: mvpNumberAnswer(g.movement), misconceptionId: "RETURNED_POINT_SEPARATION" },
      { value: mvpNumberAnswer(addExact(g.height, g.movement)), misconceptionId: "ADDED_MOVEMENT_TO_HEIGHT" },
    ],
    explanation: mvpExplanation(
      "The tower height is the same in the 60° and 45° triangles.",
      [`Let the nearer distance be x; the farther distance is x+${formatExactPlain(g.movement)}.`, `Solve x tan60°=(x+${formatExactPlain(g.movement)})tan45° for the exact height.`],
      "The given separation is not itself the height or either tower distance.",
    ),
  });
}

function ql054(seed: string) {
  const g = movementGeometry(seed, "realness-054-movement", 45, 60);
  asTwoObservationState(g.state);
  g.state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "near-ground" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-054", cpId: "TRG-CP-009", lockedFamily: "SAME_SIDE_TWO_OBSERVATIONS",
    solveMode: "findNearDistanceFrom45And60SameSidePoints", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two observation points on the same side of a tower are ${formatExactPlain(g.movement)} m apart. The angle of elevation is 60° at the nearer point and 45° at the farther point. Find the nearer point's exact distance from the tower.`,
    state: g.state, correct: mvpNumberAnswer(g.near),
    wrong: [
      { value: mvpNumberAnswer(g.movement), misconceptionId: "RETURNED_POINT_SEPARATION" },
      { value: mvpNumberAnswer(g.height), misconceptionId: "RETURNED_TOWER_HEIGHT" },
      { value: mvpNumberAnswer(addExact(g.height, g.movement)), misconceptionId: "ADDED_SEPARATION_TO_HEIGHT" },
    ],
    explanation: mvpExplanation(
      "Relate the two unequal ground distances through the common tower height.",
      [`Let the nearer distance be x; the farther distance is x+${formatExactPlain(g.movement)}.`, `Solve x tan60°=(x+${formatExactPlain(g.movement)})tan45°.`],
      "The nearer tower distance is not equal to the separation between the observation points.",
    ),
  });
}

function ql060(seed: string) {
  const g = movementGeometry(seed, "realness-060-movement", 45, 60);
  g.state.requested = { kind: "OBJECT_HEIGHT", objectId: "object-1" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-060", cpId: "TRG-CP-009", lockedFamily: "OBSERVER_MOVES_CLOSER",
    solveMode: "findHeightAfterMovingCloser45To60", seed, difficulty: "Hard", target: "LENGTH",
    stem: `The angle of elevation of the top of a tower is 45°. After an observer walks ${formatExactPlain(g.movement)} m straight toward the tower, the angle becomes 60°. Find the exact height of the tower.`,
    state: g.state, correct: mvpNumberAnswer(g.height),
    wrong: [
      { value: mvpNumberAnswer(g.near), misconceptionId: "RETURNED_FINAL_DISTANCE" },
      { value: mvpNumberAnswer(g.movement), misconceptionId: "RETURNED_DISTANCE_WALKED" },
      { value: mvpNumberAnswer(addExact(g.height, g.movement)), misconceptionId: "ADDED_MOVEMENT_TO_HEIGHT" },
    ],
    explanation: mvpExplanation(
      "The two observations share one tower height; the ground distances differ by the distance walked.",
      [`Let the final distance be x. Then the initial distance is x+${formatExactPlain(g.movement)}.`, `Use x tan60°=(x+${formatExactPlain(g.movement)})tan45° and solve for the height.`],
      "Do not use the walked distance as a complete tower distance.",
    ),
  });
}

function ql062(seed: string) {
  const g = movementGeometry(seed, "realness-062-movement", 30, 45);
  reverseMovementToFarther(g.state);
  g.state.requested = { kind: "OBJECT_HEIGHT", objectId: "object-1" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-062", cpId: "TRG-CP-009", lockedFamily: "OBSERVER_MOVES_FARTHER",
    solveMode: "findHeightAfterMovingFarther45To30", seed, difficulty: "Hard", target: "LENGTH",
    stem: `An observer sees the top of a tower at 45°. After walking ${formatExactPlain(g.movement)} m straight away from the tower, the angle becomes 30°. Find the exact height of the tower.`,
    state: g.state, correct: mvpNumberAnswer(g.height),
    wrong: [
      { value: mvpNumberAnswer(g.movement), misconceptionId: "RETURNED_DISTANCE_WALKED" },
      { value: mvpNumberAnswer(g.far), misconceptionId: "RETURNED_FINAL_DISTANCE" },
      { value: mvpNumberAnswer(multiplyExact(g.height, exactInteger(2))), misconceptionId: "DOUBLED_HEIGHT" },
    ],
    explanation: mvpExplanation(
      "Moving away increases the ground distance while the tower height stays unchanged.",
      [`Let the initial distance be x. The final distance is x+${formatExactPlain(g.movement)}.`, `Use x tan45°=(x+${formatExactPlain(g.movement)})tan30° and solve for the height.`],
      "Since the observer moves away, add the walked distance to the initial distance.",
    ),
  });
}

function ql066(seed: string) {
  const g = movementGeometry(seed, "realness-066-movement", 45, 60);
  g.state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "far-ground" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-066", cpId: "TRG-CP-009", lockedFamily: "FIND_ORIGINAL_DISTANCE",
    solveMode: "findOriginalDistanceFrom45To60Movement", seed, difficulty: "Hard", target: "LENGTH",
    stem: `From an initial point, the top of a tower is seen at 45°. After the observer walks ${formatExactPlain(g.movement)} m toward the tower, the angle becomes 60°. Find the exact initial distance from the tower.`,
    state: g.state, correct: mvpNumberAnswer(g.far),
    wrong: [
      { value: mvpNumberAnswer(g.near), misconceptionId: "RETURNED_FINAL_DISTANCE" },
      { value: mvpNumberAnswer(g.movement), misconceptionId: "RETURNED_DISTANCE_WALKED" },
      { value: mvpNumberAnswer(addExact(g.far, g.movement)), misconceptionId: "ADDED_MOVEMENT_TWICE" },
    ],
    explanation: mvpExplanation(
      "The initial distance is larger than the final distance by the distance walked.",
      [`Let the initial distance be d. The final distance is d−${formatExactPlain(g.movement)}.`, `Use d tan45°=(d−${formatExactPlain(g.movement)})tan60° and solve for d.`],
      "Do not confuse the walked distance with the initial tower distance.",
    ),
  });
}

export function generateTrg002ExamRealnessV2CanonicalQuestion(qlId: string, seed: string) {
  switch (qlId) {
    case "TRG-002-QL-007": return ql007(seed);
    case "TRG-002-QL-050": return ql050(seed);
    case "TRG-002-QL-051": return ql051(seed);
    case "TRG-002-QL-053": return ql053(seed);
    case "TRG-002-QL-054": return ql054(seed);
    case "TRG-002-QL-060": return ql060(seed);
    case "TRG-002-QL-062": return ql062(seed);
    case "TRG-002-QL-066": return ql066(seed);
    default: return generateFrozenTrg002Production96Question(qlId, seed) as any;
  }
}

export function isTrg002ExamRealnessV2CanonicalOverride(qlId: string) {
  return (TRG_002_EXAM_REALNESS_V2_CANONICAL_OVERRIDE_IDS as readonly string[]).includes(qlId);
}
