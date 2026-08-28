import { degree } from "../foundation/angle";
import { exactInteger, exactSurd, formatExactPlain, multiplyExact } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import type { Trg002SpatialPoint, Trg002SpatialState, Trg002VerticalObject } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

const ZERO = exactInteger(0);
function p(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint {
  return { id, x, y, role, label };
}
function stumpObject(height: ExactTrigNumber): Trg002VerticalObject {
  return { id: "stump", kind: "TREE", basePointId: "tree-base", topPointId: "break-point", height };
}

export function generateTrg002ProductionQl042Clean(seed: string): Trg002MvpQuestion {
  const scalar = mvpPick(seed, "042-stump", [6, 8, 10] as const);
  const stump = exactInteger(scalar);
  const run = stump;
  const fallenPart = exactSurd(scalar, 2);
  const state: Trg002SpatialState = {
    packageId: "TRG-002",
    scenario: "BROKEN_OBJECT",
    groundY: ZERO,
    points: [
      p("tree-base", ZERO, ZERO, "OBJECT_BASE", "B"),
      p("break-point", ZERO, stump, "BREAK_POINT", "C"),
      p("touch-point", run, ZERO, "TOUCH_POINT", "D"),
    ],
    verticalObjects: [stumpObject(stump)],
    observers: [{ id: "ground-reference", groundPointId: "touch-point", eyePointId: "touch-point", eyeHeight: ZERO }],
    observations: [{ id: "fallen-part", observerId: "ground-reference", eyePointId: "touch-point", targetPointId: "break-point", classification: "ELEVATION", angle: degree(45), horizontalReference: "EYE_LEVEL" }],
    movements: [],
    requested: { kind: "SIGHT_LINE_LENGTH", fromPointId: "touch-point", toPointId: "break-point" },
    diagramStrategy: "BROKEN_TREE",
    metadata: { units: "m", sameSide: true, notes: ["The sloping segment is the broken upper part."] },
  };

  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-042",
    cpId: "TRG-CP-008",
    lockedFamily: "BROKEN_TREE_TOUCHING_GROUND",
    solveMode: "findFallenPartLengthAt45Degrees",
    seed,
    difficulty: "Medium",
    target: "LENGTH",
    stem: `A tree breaks ${formatExactPlain(stump)} m above the ground and the broken upper part touches the ground at an angle of 45°. Find the length of the broken upper part.`,
    state,
    correct: mvpNumberAnswer(fallenPart),
    wrong: [
      { value: mvpNumberAnswer(stump), misconceptionId: "RETURNED_STUMP_HEIGHT" },
      { value: mvpNumberAnswer(multiplyExact(stump, exactInteger(2))), misconceptionId: "ADDED_EQUAL_LEGS" },
      { value: mvpNumberAnswer(exactSurd(scalar, 3)), misconceptionId: "USED_30_60_TRIANGLE_SURD" },
    ],
    explanation: mvpExplanation(
      "At 45°, the stump and ground run are equal legs; the broken part is the hypotenuse.",
      [`The ground run is ${formatExactPlain(run)} m because tan45°=1.`, `L²=${formatExactPlain(stump)}²+${formatExactPlain(run)}².`, `Hence L=${formatExactPlain(fallenPart)} m.`],
      "The sloping broken part is longer than either equal leg.",
    ),
  });
}
