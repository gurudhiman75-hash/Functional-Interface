import { degree } from "../foundation/angle";
import { addExact, exactInteger, exactSurd, formatExactPlain, subtractExact } from "../foundation/exact";
import type { Trg002SpatialState } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick } from "./mvp-runtime-core";

export function generateTrg002MvpQl095(seed: string) {
  const k = mvpPick(seed, "095-run", [6, 8, 10] as const);
  const d = exactInteger(k), roofH = d, totalH = exactSurd(k, 3), upperH = subtractExact(totalH, roofH), z = exactInteger(0);
  const state: Trg002SpatialState = {
    packageId: "TRG-002", scenario: "TWO_BUILDINGS", groundY: z,
    points: [
      { id: "base", x: z, y: z, role: "OBJECT_BASE", label: "B" },
      { id: "roof", x: z, y: roofH, role: "OBJECT_TOP", label: "R" },
      { id: "upper-top", x: z, y: totalH, role: "OBJECT_TOP", label: "T" },
      { id: "observer", x: d, y: z, role: "OBSERVER_GROUND", label: "O" }
    ],
    verticalObjects: [
      { id: "building", kind: "BUILDING", basePointId: "base", topPointId: "roof", height: roofH },
      { id: "upper-mast", kind: "MAST", basePointId: "roof", topPointId: "upper-top", height: upperH }
    ],
    observers: [{ id: "obsr", groundPointId: "observer", eyePointId: "observer", eyeHeight: z }],
    observations: [
      { id: "roof-angle", observerId: "obsr", eyePointId: "observer", targetPointId: "roof", classification: "ELEVATION", angle: degree(45), horizontalReference: "EYE_LEVEL" },
      { id: "top-angle", observerId: "obsr", eyePointId: "observer", targetPointId: "upper-top", classification: "ELEVATION", angle: degree(60), horizontalReference: "EYE_LEVEL" }
    ],
    movements: [], requested: { kind: "OBJECT_HEIGHT", objectId: "upper-mast" }, diagramStrategy: "BUILDING_TO_BUILDING",
    metadata: { units: "m", sameSide: true, notes: ["An upper vertical object is stacked on the roof."] }
  };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-095", cpId: "TRG-CP-010", lockedFamily: "COMPOSITE_VERTICAL_OBJECT_RELATIONS", solveMode: "findUpperHeightFromTwoSightAngles",
    seed, difficulty: "Hard", target: "LENGTH",
    stem: `From a point ${formatExactPlain(d)} m from a building, the angle of elevation of its roof is 45° and that of the top of a mast on the roof is 60°. Find the height of the mast.`,
    state, correct: mvpNumberAnswer(upperH),
    wrong: [
      { value: mvpNumberAnswer(roofH), misconceptionId: "RETURNED_BUILDING_HEIGHT" },
      { value: mvpNumberAnswer(totalH), misconceptionId: "RETURNED_TOTAL_HEIGHT" },
      { value: mvpNumberAnswer(addExact(totalH, roofH)), misconceptionId: "ADDED_INSTEAD_OF_SUBTRACTING" }
    ],
    explanation: mvpExplanation("Find the roof level and total top level from the same horizontal distance, then subtract.", [`Roof height=${formatExactPlain(roofH)} m.`, `Total height=${formatExactPlain(totalH)} m.`, `Mast height=${formatExactPlain(totalH)}−${formatExactPlain(roofH)}=${formatExactPlain(upperH)} m.`], "The steeper sight line gives total height, not the mast alone.")
  });
}
