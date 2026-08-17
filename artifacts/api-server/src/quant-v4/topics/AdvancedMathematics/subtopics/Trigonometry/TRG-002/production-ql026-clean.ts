import { degree } from "../foundation/angle";
import { exactInteger, exactSurd, formatExactPlain } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import type { Trg002SpatialPoint, Trg002SpatialState, Trg002VerticalObject } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

const ZERO = exactInteger(0);
function p(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint { return { id, x, y, role, label }; }
function obj(height: ExactTrigNumber): Trg002VerticalObject { return { id: "object-1", kind: "POLE", basePointId: "object-base", topPointId: "object-top", height }; }

export function generateTrg002ProductionQl026Clean(seed: string): Trg002MvpQuestion {
  const k = mvpPick(seed, "026-k", [6, 8, 10] as const);
  const shadow = exactInteger(3 * k);
  const height = exactSurd(k, 3);
  const state: Trg002SpatialState = {
    packageId: "TRG-002",
    scenario: "SHADOW",
    groundY: ZERO,
    points: [p("object-base", ZERO, ZERO, "OBJECT_BASE", "B"), p("object-top", ZERO, height, "OBJECT_TOP", "T"), p("shadow-tip", shadow, ZERO, "SHADOW_TIP", "S")],
    verticalObjects: [obj(height)],
    observers: [{ id: "sun-reference", groundPointId: "shadow-tip", eyePointId: "shadow-tip", eyeHeight: ZERO }],
    observations: [{ id: "obs-sun", observerId: "sun-reference", eyePointId: "shadow-tip", targetPointId: "object-top", classification: "ELEVATION", angle: degree(30), horizontalReference: "EYE_LEVEL" }],
    movements: [],
    requested: { kind: "OBJECT_HEIGHT", objectId: "object-1" },
    diagramStrategy: "SHADOW",
    metadata: { units: "m", sameSide: true },
  };

  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-026",
    cpId: "TRG-CP-008",
    lockedFamily: "SHADOW_TO_HEIGHT",
    solveMode: "findHeightFrom30DegreeShadow",
    seed,
    difficulty: "Easy",
    target: "LENGTH",
    stem: `A pole casts a ${formatExactPlain(shadow)} m shadow when the sun's elevation is 30°. Find the exact height of the pole.`,
    state,
    correct: mvpNumberAnswer(height),
    wrong: [
      { value: mvpNumberAnswer(shadow), misconceptionId: "TREATED_SOLAR_ANGLE_AS_45" },
      { value: mvpNumberAnswer(exactInteger(k)), misconceptionId: "DROPPED_SURD_FACTOR" },
      { value: mvpNumberAnswer(exactInteger((3 * k) / 2)), misconceptionId: "USED_SINE_HALF_FACTOR" },
    ],
    explanation: mvpExplanation(
      "For a shadow triangle, tanθ=object height/shadow length.",
      [`h=${formatExactPlain(shadow)}×tan30°.`, `Hence h=${formatExactPlain(height)} m.`],
      "The shadow is the adjacent side, so use tangent rather than sine.",
    ),
  });
}
