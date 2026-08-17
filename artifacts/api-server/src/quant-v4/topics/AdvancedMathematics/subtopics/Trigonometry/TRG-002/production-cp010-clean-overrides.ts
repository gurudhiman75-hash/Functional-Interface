import { degree } from "../foundation/angle";
import { addExact, exactInteger, exactSurd, formatExactPlain } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import type { Trg002SpatialPoint, Trg002SpatialState, Trg002VerticalObject } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export const TRG_002_CP010_CLEAN_OVERRIDE_IDS = [
  "TRG-002-QL-084",
  "TRG-002-QL-085",
  "TRG-002-QL-087",
] as const;
export type Trg002Cp010CleanOverrideId = (typeof TRG_002_CP010_CLEAN_OVERRIDE_IDS)[number];

const ZERO = exactInteger(0);
function p(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint {
  return { id, x, y, role, label };
}
function obj(id: string, basePointId: string, topPointId: string, height: ExactTrigNumber): Trg002VerticalObject {
  return { id, kind: "BUILDING", basePointId, topPointId, height };
}
function buildingState(input: {
  firstHeight: ExactTrigNumber;
  run: ExactTrigNumber;
  secondHeight: ExactTrigNumber;
  angle: 30 | 45 | 60;
  classification: "ELEVATION" | "DEPRESSION";
  requested: "SECOND_HEIGHT" | "DISTANCE";
}): Trg002SpatialState {
  return {
    packageId: "TRG-002",
    scenario: "TWO_BUILDINGS",
    groundY: ZERO,
    points: [
      p("first-base", ZERO, ZERO, "OBJECT_BASE", "A"),
      p("first-top", ZERO, input.firstHeight, "OBSERVER_EYE", "E"),
      p("second-base", input.run, ZERO, "OBJECT_BASE", "B"),
      p("second-top", input.run, input.secondHeight, "OBJECT_TOP", "T"),
    ],
    verticalObjects: [
      obj("building-1", "first-base", "first-top", input.firstHeight),
      obj("building-2", "second-base", "second-top", input.secondHeight),
    ],
    observers: [{ id: "observer-1", groundPointId: "first-base", eyePointId: "first-top", eyeHeight: input.firstHeight }],
    observations: [{ id: "obs-1", observerId: "observer-1", eyePointId: "first-top", targetPointId: "second-top", classification: input.classification, angle: degree(input.angle), horizontalReference: "EYE_LEVEL" }],
    movements: [],
    requested: input.requested === "SECOND_HEIGHT"
      ? { kind: "OBJECT_HEIGHT", objectId: "building-2" }
      : { kind: "HORIZONTAL_DISTANCE", fromPointId: "first-base", toPointId: "second-base" },
    diagramStrategy: "BUILDING_TO_BUILDING",
    metadata: { units: "m", sameSide: true },
  };
}

function ql084(seed: string): Trg002MvpQuestion {
  const k = mvpPick(seed, "084-k", [6, 8, 10] as const);
  const first = exactInteger(2 * k);
  const run = exactSurd(k, 3);
  const rise = exactInteger(k);
  const second = exactInteger(3 * k);
  const state = buildingState({ firstHeight: first, run, secondHeight: second, angle: 30, classification: "ELEVATION", requested: "SECOND_HEIGHT" });
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-084", cpId: "TRG-CP-010", lockedFamily: "BUILDING_TO_BUILDING", solveMode: "findSecondBuildingHeightFrom30DegreeRoofView", seed, difficulty: "Hard", target: "LENGTH",
    stem: `From the roof of a ${formatExactPlain(first)} m building, the top of another building ${formatExactPlain(run)} m away is seen at an elevation of 30°. Find the height of the second building.`,
    state,
    correct: mvpNumberAnswer(second),
    wrong: [
      { value: mvpNumberAnswer(rise), misconceptionId: "RETURNED_ONLY_RISE" },
      { value: mvpNumberAnswer(first), misconceptionId: "RETURNED_FIRST_BUILDING_HEIGHT" },
      { value: mvpNumberAnswer(addExact(second, first)), misconceptionId: "ADDED_FULL_BUILDING_HEIGHTS" },
    ],
    explanation: mvpExplanation(
      "Find the rise above the first roof, then add the first building's height.",
      [`tan30°=rise/${formatExactPlain(run)}=1/√3.`, `Rise=${formatExactPlain(run)}×tan30°=${formatExactPlain(rise)} m.`, `Second building height=${formatExactPlain(first)}+${formatExactPlain(rise)}=${formatExactPlain(second)} m.`],
      "The tangent triangle starts at the roof level, so the rise is not the total second height.",
    ),
  });
}

function ql085(seed: string): Trg002MvpQuestion {
  const k = mvpPick(seed, "085-k", [5, 7, 9] as const);
  const first = exactInteger(4 * k);
  const run = exactSurd(k, 3);
  const drop = exactInteger(3 * k);
  const second = exactInteger(k);
  const state = buildingState({ firstHeight: first, run, secondHeight: second, angle: 60, classification: "DEPRESSION", requested: "SECOND_HEIGHT" });
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-085", cpId: "TRG-CP-010", lockedFamily: "BUILDING_TO_BUILDING", solveMode: "findShorterBuildingHeightFrom60DegreeRoofDepression", seed, difficulty: "Hard", target: "LENGTH",
    stem: `From the roof of a ${formatExactPlain(first)} m building, the top of a shorter building ${formatExactPlain(run)} m away is seen at a depression of 60°. Find the shorter building's height.`,
    state,
    correct: mvpNumberAnswer(second),
    wrong: [
      { value: mvpNumberAnswer(drop), misconceptionId: "RETURNED_VERTICAL_DROP" },
      { value: mvpNumberAnswer(first), misconceptionId: "RETURNED_TALLER_BUILDING_HEIGHT" },
      { value: mvpNumberAnswer(exactInteger(7 * k)), misconceptionId: "ADDED_DROP_INSTEAD_OF_SUBTRACTING" },
    ],
    explanation: mvpExplanation(
      "Depression gives the vertical drop from the taller roof to the shorter roof.",
      [`tan60°=drop/${formatExactPlain(run)}=√3.`, `Drop=${formatExactPlain(run)}×√3=${formatExactPlain(drop)} m.`, `Shorter height=${formatExactPlain(first)}−${formatExactPlain(drop)}=${formatExactPlain(second)} m.`],
      "A depression angle means the target roof is below the observer's horizontal level.",
    ),
  });
}

function ql087(seed: string): Trg002MvpQuestion {
  const k = mvpPick(seed, "087-k", [6, 8, 10] as const);
  const first = exactInteger(2 * k);
  const run = exactInteger(k);
  const rise = exactSurd(k, 3);
  const second = addExact(first, rise);
  const state = buildingState({ firstHeight: first, run, secondHeight: second, angle: 60, classification: "ELEVATION", requested: "DISTANCE" });
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-087", cpId: "TRG-CP-010", lockedFamily: "BUILDING_TO_BUILDING", solveMode: "findBuildingSeparationFrom60DegreeRoofView", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two buildings are ${formatExactPlain(first)} m and ${formatExactPlain(second)} m high. From the roof of the shorter building, the top of the taller one is seen at 60°. Find their horizontal separation.`,
    state,
    correct: mvpNumberAnswer(run),
    wrong: [
      { value: mvpNumberAnswer(rise), misconceptionId: "RETURNED_HEIGHT_DIFFERENCE" },
      { value: mvpNumberAnswer(first), misconceptionId: "RETURNED_SHORTER_HEIGHT" },
      { value: mvpNumberAnswer(second), misconceptionId: "RETURNED_TALLER_HEIGHT" },
    ],
    explanation: mvpExplanation(
      "Use only the height difference as the opposite side of the roof-level triangle.",
      [`Rise=${formatExactPlain(second)}−${formatExactPlain(first)}=${formatExactPlain(rise)} m.`, `tan60°=${formatExactPlain(rise)}/d=√3.`, `Therefore d=${formatExactPlain(rise)}/√3=${formatExactPlain(run)} m.`],
      "Do not use either full building height as the trigonometric rise.",
    ),
  });
}

export function generateTrg002ProductionCp010CleanOverride(qlId: Trg002Cp010CleanOverrideId, seed: string): Trg002MvpQuestion {
  switch (qlId) {
    case "TRG-002-QL-084": return ql084(seed);
    case "TRG-002-QL-085": return ql085(seed);
    case "TRG-002-QL-087": return ql087(seed);
  }
}
