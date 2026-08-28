import { degree } from "../foundation/angle";
import { addExact, assertDefined, divideExact, exactInteger, exactSurd, formatExactPlain, multiplyExact } from "../foundation/exact";
import { requireTrigExact } from "../foundation/standard-values";
import type { ExactTrigNumber } from "../foundation/types";
import type { Trg002SpatialPoint, Trg002SpatialState, Trg002VerticalObject } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export const TRG_002_MVP_CP008_BROKEN_IDS = ["TRG-002-QL-041", "TRG-002-QL-043"] as const;
export type Trg002MvpCp008BrokenId = (typeof TRG_002_MVP_CP008_BROKEN_IDS)[number];
const ZERO = exactInteger(0);
const div = (a: ExactTrigNumber, b: ExactTrigNumber) => assertDefined(divideExact(a, b));
const tan = (a: 30 | 45) => requireTrigExact("TAN", degree(a));
const sin = (a: 30 | 45) => requireTrigExact("SIN", degree(a));
function p(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint { return { id, x, y, role, label }; }
function tree(id: string, basePointId: string, topPointId: string, height: ExactTrigNumber): Trg002VerticalObject { return { id, kind: "TREE", basePointId, topPointId, height }; }
function makeState(stump: ExactTrigNumber, angle: 30 | 45, target: "PART" | "RUN") {
  const run = div(stump, tan(angle)); const part = div(stump, sin(angle));
  const state: Trg002SpatialState = {
    packageId: "TRG-002", scenario: "BROKEN_OBJECT", groundY: ZERO,
    points: [p("tree-base", ZERO, ZERO, "OBJECT_BASE", "B"), p("break-point", ZERO, stump, "BREAK_POINT", "C"), p("touch-point", run, ZERO, "TOUCH_POINT", "D")],
    verticalObjects: [tree("stump", "tree-base", "break-point", stump)],
    observers: [{ id: "ground-reference", groundPointId: "touch-point", eyePointId: "touch-point", eyeHeight: ZERO }],
    observations: [{ id: "fallen-part", observerId: "ground-reference", eyePointId: "touch-point", targetPointId: "break-point", classification: "ELEVATION", angle: degree(angle), horizontalReference: "EYE_LEVEL" }],
    movements: [], requested: target === "PART" ? { kind: "SIGHT_LINE_LENGTH", fromPointId: "touch-point", toPointId: "break-point" } : { kind: "HORIZONTAL_DISTANCE", fromPointId: "tree-base", toPointId: "touch-point" },
    diagramStrategy: "BROKEN_TREE", metadata: { units: "m", sameSide: true, notes: ["The sloping line from break point to touch point is the fallen part."] },
  };
  return { state, run, part };
}
function ql041(seed: string) {
  const stump = exactInteger(mvpPick(seed, "041-stump", [6, 8, 10] as const)); const b = makeState(stump, 30, "PART");
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-041", cpId: "TRG-CP-008", lockedFamily: "BROKEN_TREE_TOUCHING_GROUND", solveMode: "findFallenPartLength", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A tree breaks ${formatExactPlain(stump)} m above the ground. Its upper part touches the ground and makes an angle of 30° with the ground. Find the length of the fallen part.`, state: b.state, correct: mvpNumberAnswer(b.part),
    wrong: [{ value: mvpNumberAnswer(stump), misconceptionId: "RETURNED_STUMP_HEIGHT" }, { value: mvpNumberAnswer(b.run), misconceptionId: "RETURNED_TOUCH_DISTANCE" }, { value: mvpNumberAnswer(addExact(stump, b.part)), misconceptionId: "RETURNED_ORIGINAL_HEIGHT" }],
    explanation: mvpExplanation("The fallen part is the hypotenuse and the stump is opposite the ground angle.", [`sin30°=${formatExactPlain(stump)}/L=1/2.`, `So L=${formatExactPlain(b.part)} m.`], "Do not add the stump unless original height is asked.") });
}
function ql043(seed: string) {
  const stump = exactInteger(mvpPick(seed, "043-stump", [6, 9, 12] as const)); const b = makeState(stump, 45, "RUN");
  const treatedStumpAsHypotenuse = multiplyExact(stump, exactSurd(1, 2, 2));
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-043", cpId: "TRG-CP-008", lockedFamily: "BROKEN_TREE_TOUCHING_GROUND", solveMode: "findGroundTouchDistance", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A pole breaks ${formatExactPlain(stump)} m above the ground. The upper part touches the ground and makes an angle of 45° with the ground. How far from the foot of the pole does it touch the ground?`, state: b.state, correct: mvpNumberAnswer(b.run),
    wrong: [{ value: mvpNumberAnswer(b.part), misconceptionId: "RETURNED_FALLEN_PART" }, { value: mvpNumberAnswer(treatedStumpAsHypotenuse), misconceptionId: "TREATED_STUMP_AS_HYPOTENUSE" }, { value: mvpNumberAnswer(multiplyExact(stump, exactInteger(2))), misconceptionId: "ADDED_EQUAL_LEGS" }],
    explanation: mvpExplanation("At 45°, the stump and horizontal touch distance are equal legs.", [`tan45°=${formatExactPlain(stump)}/d=1.`, `Hence d=${formatExactPlain(b.run)} m.`], "The sloping upper part is the hypotenuse; the question asks for the horizontal distance.") });
}
export function generateTrg002MvpCp008BrokenQuestion(qlId: Trg002MvpCp008BrokenId, seed: string): Trg002MvpQuestion { return qlId === "TRG-002-QL-041" ? ql041(seed) : ql043(seed); }
