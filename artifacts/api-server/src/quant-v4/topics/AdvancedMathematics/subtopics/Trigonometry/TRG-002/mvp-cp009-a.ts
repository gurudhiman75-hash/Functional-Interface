import { degree } from "../foundation/angle";
import { exactInteger, formatExactPlain } from "../foundation/exact";
import { buildSameSideMovingState } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export const TRG_002_MVP_CP009_A_IDS = ["TRG-002-QL-052", "TRG-002-QL-055", "TRG-002-QL-058", "TRG-002-QL-064"] as const;
export type Trg002MvpCp009AId = (typeof TRG_002_MVP_CP009_A_IDS)[number];

function base(seed: string, salt: string) {
  const k = mvpPick(seed, salt, [8, 10, 12] as const);
  const movement = exactInteger(2 * k);
  const state = buildSameSideMovingState({ farAngle: degree(30), nearAngle: degree(60), movementTowardObject: movement, units: "m" });
  return { k, movement, state, near: exactInteger(k), far: exactInteger(3 * k), height: state.verticalObjects[0].height };
}

function ql052(seed: string) {
  const b = base(seed, "052-k"); b.state.movements = []; b.state.diagramStrategy = "TWO_OBSERVATIONS_SAME_SIDE"; b.state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "near-ground" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-052", cpId: "TRG-CP-009", lockedFamily: "SAME_SIDE_TWO_OBSERVATIONS", solveMode: "findNearDistanceFromPointSeparation", seed, difficulty: "Medium", target: "LENGTH",
    stem: `Two observation points on the same side of a tower are ${formatExactPlain(b.movement)} m apart. Their angles of elevation are 30° at the farther point and 60° at the nearer point. Find the nearer point's distance from the tower.`, state: b.state, correct: mvpNumberAnswer(b.near),
    wrong: [{ value: mvpNumberAnswer(b.far), misconceptionId: "RETURNED_FAR_DISTANCE" }, { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_POINT_SEPARATION" }, { value: mvpNumberAnswer(b.height), misconceptionId: "RETURNED_TOWER_HEIGHT" }],
    explanation: mvpExplanation("Use the same tower height in the two tangent equations.", [`Let the nearer distance be x; the farther distance is x+${formatExactPlain(b.movement)}.`, `x tan60°=(x+${formatExactPlain(b.movement)})tan30°.`, `Solving gives x=${formatExactPlain(b.near)} m.`], "The two ground distances differ by the given separation.") });
}

function ql055(seed: string) {
  const b = base(seed, "055-k"); b.state.movements = []; b.state.diagramStrategy = "TWO_OBSERVATIONS_SAME_SIDE"; b.state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "far-ground" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-055", cpId: "TRG-CP-009", lockedFamily: "SAME_SIDE_TWO_OBSERVATIONS", solveMode: "findFarDistanceFromPointSeparation", seed, difficulty: "Medium", target: "LENGTH",
    stem: `Two points on the same side of a tower are ${formatExactPlain(b.movement)} m apart. The angles of elevation of the top are 60° at the nearer point and 30° at the farther point. Find the farther point's distance from the tower.`, state: b.state, correct: mvpNumberAnswer(b.far),
    wrong: [{ value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_NEAR_DISTANCE" }, { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_SEPARATION" }, { value: mvpNumberAnswer(b.height), misconceptionId: "RETURNED_HEIGHT" }],
    explanation: mvpExplanation("The same height links the two same-side observations.", [`Let the nearer distance be x; farther distance=x+${formatExactPlain(b.movement)}.`, `Equating x tan60° and (x+${formatExactPlain(b.movement)})tan30° gives x=${formatExactPlain(b.near)}.`, `Hence farther distance=${formatExactPlain(b.far)} m.`], "Do not stop after finding the nearer distance; the question asks for the farther point.") });
}

function ql058(seed: string) {
  const b = base(seed, "058-k"); b.state.requested = { kind: "OBJECT_HEIGHT", objectId: "object-1" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-058", cpId: "TRG-CP-009", lockedFamily: "OBSERVER_MOVES_CLOSER", solveMode: "findHeightAfterMovingCloser", seed, difficulty: "Medium", target: "LENGTH",
    stem: `An observer sees a tower top at 30°. After walking ${formatExactPlain(b.movement)} m directly toward the tower, the angle becomes 60°. Find the height of the tower.`, state: b.state, correct: mvpNumberAnswer(b.height),
    wrong: [{ value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_FINAL_DISTANCE" }, { value: mvpNumberAnswer(b.far), misconceptionId: "RETURNED_ORIGINAL_DISTANCE" }, { value: mvpNumberAnswer(b.movement), misconceptionId: "RETURNED_DISTANCE_WALKED" }],
    explanation: mvpExplanation("First solve the linked distances, then use either observation for height.", [`Let final distance be x; original distance=x+${formatExactPlain(b.movement)}.`, `x tan60°=(x+${formatExactPlain(b.movement)})tan30° gives x=${formatExactPlain(b.near)} m.`, `Height=x tan60°=${formatExactPlain(b.height)} m.`], "The movement is not itself a tower distance or height.") });
}

function ql064(seed: string) {
  const b = base(seed, "064-k");
  const movement = b.state.movements[0];
  if (!movement) throw new Error("TRG-002-QL-064: canonical movement missing.");
  b.state.movements = [{ ...movement, observerId: "observer-near", fromGroundPointId: "near-ground", toGroundPointId: "far-ground", direction: "FARTHER" }];
  b.state.diagramStrategy = "OBSERVER_MOVES_FARTHER"; b.state.requested = { kind: "MOVEMENT_DISTANCE", movementId: "movement-1" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-064", cpId: "TRG-CP-009", lockedFamily: "OBSERVER_MOVES_FARTHER", solveMode: "findMovementFromHeightAndTwoAngles", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A tower is ${formatExactPlain(b.height)} m high. An observer sees its top at 60°, then walks straight away until the angle becomes 30°. How far did the observer walk?`, state: b.state, correct: mvpNumberAnswer(b.movement),
    wrong: [{ value: mvpNumberAnswer(b.near), misconceptionId: "RETURNED_INITIAL_DISTANCE" }, { value: mvpNumberAnswer(b.far), misconceptionId: "RETURNED_FINAL_DISTANCE" }, { value: mvpNumberAnswer(b.height), misconceptionId: "RETURNED_TOWER_HEIGHT" }],
    explanation: mvpExplanation("Find both horizontal distances from the known height and subtract.", [`Initial distance=${formatExactPlain(b.height)}/tan60°=${formatExactPlain(b.near)} m.`, `Final distance=${formatExactPlain(b.height)}/tan30°=${formatExactPlain(b.far)} m.`, `Movement=${formatExactPlain(b.far)}−${formatExactPlain(b.near)}=${formatExactPlain(b.movement)} m.`], "Because the observer moves away, subtract the smaller initial distance from the larger final distance.") });
}

export function generateTrg002MvpCp009AQuestion(qlId: Trg002MvpCp009AId, seed: string): Trg002MvpQuestion { switch (qlId) { case "TRG-002-QL-052": return ql052(seed); case "TRG-002-QL-055": return ql055(seed); case "TRG-002-QL-058": return ql058(seed); case "TRG-002-QL-064": return ql064(seed); } }
