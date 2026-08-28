import { degree } from "../foundation/angle";
import { addExact, exactInteger, exactSurd, formatExactPlain, subtractExact } from "../foundation/exact";
import { buildSameSideMovingState, type Trg002SpatialState } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export const TRG_002_CP009_CLEAN_OVERRIDE_IDS = [
  "TRG-002-QL-050",
  "TRG-002-QL-051",
  "TRG-002-QL-053",
  "TRG-002-QL-054",
  "TRG-002-QL-060",
  "TRG-002-QL-066",
] as const;
export type Trg002Cp009CleanOverrideId = (typeof TRG_002_CP009_CLEAN_OVERRIDE_IDS)[number];

function base3045(seed: string, salt: string) {
  const k = mvpPick(seed, salt, [6, 8, 10] as const);
  const near = exactInteger(k);
  const far = exactSurd(k, 3);
  const movement = subtractExact(far, near);
  const height = exactInteger(k);
  const doubleNear = exactInteger(2 * k);
  const state = buildSameSideMovingState({ farAngle: degree(30), nearAngle: degree(45), movementTowardObject: movement, units: "m" });
  return { k, near, far, movement, height, doubleNear, state };
}

function base4560(seed: string, salt: string) {
  const k = mvpPick(seed, salt, [6, 8, 10] as const);
  const near = exactInteger(k);
  const far = exactSurd(k, 3);
  const movement = subtractExact(far, near);
  const height = exactSurd(k, 3);
  const doubleNear = exactInteger(2 * k);
  const state = buildSameSideMovingState({ farAngle: degree(45), nearAngle: degree(60), movementTowardObject: movement, units: "m" });
  return { k, near, far, movement, height, doubleNear, state };
}

function asTwoObservationState(state: Trg002SpatialState) {
  state.movements = [];
  state.diagramStrategy = "TWO_OBSERVATIONS_SAME_SIDE";
  return state;
}

function ql050(seed: string): Trg002MvpQuestion {
  const b = base3045(seed, "050-k");
  asTwoObservationState(b.state);
  b.state.requested = { kind: "OBJECT_HEIGHT", objectId: "object-1" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-050", cpId: "TRG-CP-009", lockedFamily: "SAME_SIDE_TWO_OBSERVATIONS", solveMode: "findHeightFrom30And45SameSidePoints", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two points on the same side of a tower are ${formatExactPlain(b.movement)} m apart. The angles of elevation are 30° at the farther point and 45° at the nearer point. Find the height of the tower.`,
    state: b.state,
    correct: mvpNumberAnswer(b.height),
    wrong: [
      { value: mvpNumberAnswer(b.far), misconceptionId: "RETURNED_FAR_DISTANCE" },
      { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_POINT_SEPARATION" },
      { value: mvpNumberAnswer(b.doubleNear), misconceptionId: "DOUBLED_NEAR_DISTANCE" },
    ],
    explanation: mvpExplanation("The same height must satisfy both tangent equations.", [`Let the nearer distance be x. Then the farther distance is x+${formatExactPlain(b.movement)}.`, `x tan45°=(x+${formatExactPlain(b.movement)})tan30°.`, `Solving gives x=${formatExactPlain(b.near)} m and height=${formatExactPlain(b.height)} m.`], "Do not treat the given separation as a distance from the tower."),
  });
}

function ql051(seed: string): Trg002MvpQuestion {
  const b = base3045(seed, "051-k");
  asTwoObservationState(b.state);
  b.state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "far-ground" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-051", cpId: "TRG-CP-009", lockedFamily: "SAME_SIDE_TWO_OBSERVATIONS", solveMode: "findFarDistanceFrom30And45SameSidePoints", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two observation points on the same side of a tower are ${formatExactPlain(b.movement)} m apart. Their elevation angles are 45° at the nearer point and 30° at the farther point. Find the farther point's distance from the tower.`,
    state: b.state,
    correct: mvpNumberAnswer(b.far),
    wrong: [
      { value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_NEAR_DISTANCE" },
      { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_SEPARATION" },
      { value: mvpNumberAnswer(b.doubleNear), misconceptionId: "DOUBLED_NEAR_DISTANCE" },
    ],
    explanation: mvpExplanation("Use equal tower height at the two observation points.", [`Near height=x tan45°=x.`, `Far height=(x+${formatExactPlain(b.movement)})tan30°.`, `Equating them gives far distance=${formatExactPlain(b.far)} m.`], "The farther distance includes the nearer distance plus the given separation."),
  });
}

function ql053(seed: string): Trg002MvpQuestion {
  const b = base4560(seed, "053-k");
  asTwoObservationState(b.state);
  b.state.requested = { kind: "OBJECT_HEIGHT", objectId: "object-1" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-053", cpId: "TRG-CP-009", lockedFamily: "SAME_SIDE_TWO_OBSERVATIONS", solveMode: "findHeightFrom45And60SameSidePoints", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two points on the same side of a tower are ${formatExactPlain(b.movement)} m apart. The top is seen at 45° from the farther point and 60° from the nearer point. Find the tower's exact height.`,
    state: b.state,
    correct: mvpNumberAnswer(b.height),
    wrong: [
      { value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_NEAR_DISTANCE" },
      { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_POINT_SEPARATION" },
      { value: mvpNumberAnswer(b.doubleNear), misconceptionId: "DOUBLED_NEAR_DISTANCE" },
    ],
    explanation: mvpExplanation("Link the two tangent equations through the common height.", [`At the nearer point h=x tan60°=x√3.`, `At the farther point h=(x+${formatExactPlain(b.movement)})tan45°.`, `Solving gives h=${formatExactPlain(b.height)} m.`], "The 45° distance equals the height, so it must not also appear as a distractor."),
  });
}

function ql054(seed: string): Trg002MvpQuestion {
  const b = base4560(seed, "054-k");
  asTwoObservationState(b.state);
  b.state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "near-ground" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-054", cpId: "TRG-CP-009", lockedFamily: "SAME_SIDE_TWO_OBSERVATIONS", solveMode: "findNearDistanceFrom45And60SameSidePoints", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two observation points on the same side of a tower are ${formatExactPlain(b.movement)} m apart. The angles of elevation are 45° at the farther point and 60° at the nearer point. Find the nearer point's distance from the tower.`,
    state: b.state,
    correct: mvpNumberAnswer(b.near),
    wrong: [
      { value: mvpNumberAnswer(b.far), misconceptionId: "RETURNED_FAR_DISTANCE" },
      { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_SEPARATION" },
      { value: mvpNumberAnswer(b.doubleNear), misconceptionId: "DOUBLED_NEAR_DISTANCE" },
    ],
    explanation: mvpExplanation("Use the common height to solve the unequal ground distances.", [`Let nearer distance=x, so farther distance=x+${formatExactPlain(b.movement)}.`, `x tan60°=(x+${formatExactPlain(b.movement)})tan45°.`, `Hence x=${formatExactPlain(b.near)} m.`], "The nearer point is not at the given separation from the tower."),
  });
}

function ql060(seed: string): Trg002MvpQuestion {
  const b = base4560(seed, "060-k");
  b.state.requested = { kind: "OBJECT_HEIGHT", objectId: "object-1" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-060", cpId: "TRG-CP-009", lockedFamily: "OBSERVER_MOVES_CLOSER", solveMode: "findHeightAfterMovingCloser45To60", seed, difficulty: "Hard", target: "LENGTH",
    stem: `The angle of elevation of a tower top is initially 45°. After an observer walks ${formatExactPlain(b.movement)} m straight toward the tower, the angle becomes 60°. Find the exact height of the tower.`,
    state: b.state,
    correct: mvpNumberAnswer(b.height),
    wrong: [
      { value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_FINAL_DISTANCE" },
      { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_MOVEMENT" },
      { value: mvpNumberAnswer(b.doubleNear), misconceptionId: "DOUBLED_FINAL_DISTANCE" },
    ],
    explanation: mvpExplanation("The two observations use the same height with distances differing by the movement.", [`Let final distance=x. Then h=x√3 and initial distance=x+${formatExactPlain(b.movement)}.`, `Because the initial angle is 45°, h=x+${formatExactPlain(b.movement)}.`, `Solving gives h=${formatExactPlain(b.height)} m.`], "At 45° the initial distance equals the height, so it cannot be used as a distinct distractor."),
  });
}

function ql066(seed: string): Trg002MvpQuestion {
  const b = base4560(seed, "066-k");
  b.state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "far-ground" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-066", cpId: "TRG-CP-009", lockedFamily: "FIND_ORIGINAL_DISTANCE", solveMode: "findOriginalDistanceFrom45To60Movement", seed, difficulty: "Hard", target: "LENGTH",
    stem: `From an initial point, a tower top is seen at 45°. After moving ${formatExactPlain(b.movement)} m toward the tower, the angle becomes 60°. Find the initial distance from the tower.`,
    state: b.state,
    correct: mvpNumberAnswer(b.far),
    wrong: [
      { value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_FINAL_DISTANCE" },
      { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_MOVEMENT" },
      { value: mvpNumberAnswer(b.doubleNear), misconceptionId: "DOUBLED_FINAL_DISTANCE" },
    ],
    explanation: mvpExplanation("Set the common height from the 45° and 60° observations and use the movement difference.", [`Initial distance=d gives h=d at 45°.`, `Final distance=d−${formatExactPlain(b.movement)} gives h=(d−${formatExactPlain(b.movement)})√3.`, `Solving gives d=${formatExactPlain(b.far)} m.`], "The 45° initial distance equals the height, so a separate height distractor would duplicate the correct option."),
  });
}

export function generateTrg002ProductionCp009CleanOverride(qlId: Trg002Cp009CleanOverrideId, seed: string): Trg002MvpQuestion {
  switch (qlId) {
    case "TRG-002-QL-050": return ql050(seed);
    case "TRG-002-QL-051": return ql051(seed);
    case "TRG-002-QL-053": return ql053(seed);
    case "TRG-002-QL-054": return ql054(seed);
    case "TRG-002-QL-060": return ql060(seed);
    case "TRG-002-QL-066": return ql066(seed);
  }
}
