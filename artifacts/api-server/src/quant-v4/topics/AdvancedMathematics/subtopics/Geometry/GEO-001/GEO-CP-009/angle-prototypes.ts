import {
  angle, equals, polygonExteriorAngleSum, rational,
  regularPolygonExteriorAngle, regularPolygonInteriorAngle,
  regularPolygonSideCountFromExteriorAngle, regularPolygonSideCountFromInteriorAngle,
  type GeoProofEvent, type TheoremId,
} from "../../../../../../shared/geometry";
import { buildExplanation, buildOptions, finalizePhase3Question, proveClueMinimality } from "../discovery/phase3-utils";
import type { Phase3PrototypeDefinition, Phase3PrototypeQuestion } from "../discovery/phase3-types";

const CP_ID = "GEO-CP-009" as const;

function exteriorSumEvent(count: number): GeoProofEvent {
  return { kind: "ANGLE_SUM", angleIds: Array.from({ length: count }, (_, i) => `E${i + 1}`), total: angle(360), reason: "POLYGON_EXTERIOR_SUM" };
}

function generateExteriorFromSides(seed: string): Phase3PrototypeQuestion {
  const clues = ["POLYGON_IS_REGULAR", "SIDE_COUNT_IS_12"] as const;
  const expected = "30°";
  const solve = (active: ReadonlySet<string>) => {
    if (!clues.every((clue) => active.has(clue))) return null;
    const value = regularPolygonExteriorAngle(12);
    return value.denominator === 1n ? `${value.numerator}°` : `${value.numerator}/${value.denominator}°`;
  };
  if (solve(new Set(clues)) !== expected) throw new Error("Regular exterior-angle solver mismatch");
  const verifierPassed = 12 * 30 === 360 && equals(polygonExteriorAngleSum(), rational(360));
  const theoremTrace: TheoremId[] = ["POLYGON_EXTERIOR_SUM", "REGULAR_POLYGON_ANGLE"];
  const optionSet = buildOptions(expected, [
    { text: "15°", misconceptionId: "USED_180_INSTEAD_OF_360", rationale: "Divides 180° by the side count instead of the exterior-angle sum." },
    { text: "150°", misconceptionId: "RETURNED_INTERIOR_ANGLE", rationale: "Returns the regular interior angle instead of the exterior angle." },
    { text: "60°", misconceptionId: "HALVED_SIDE_COUNT", rationale: "Uses half the actual number of equal exterior angles." },
  ], seed);
  return finalizePhase3Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP009-EXTERIOR-FROM-N-V1", solveMode: "findRegularPolygonExteriorAngle", difficulty: "Easy", seed,
    stem: "What is each exterior angle of a regular 12-sided polygon?", ...optionSet,
    explanation: buildExplanation(theoremTrace, ["One exterior angle at each vertex adds to 360°. In a regular polygon those exterior angles are equal.", "So each exterior angle is 360°/12 = 30°."]),
    theoremTrace, proofEvents: [exteriorSumEvent(12)], displayedClueIds: clues,
    minimalityProof: proveClueMinimality(clues, solve, expected),
    independentVerifierResult: Object.freeze({ passed: verifierPassed, oracle: "INDEPENDENT_ARITHMETIC", checks: Object.freeze(["12 × 30° = 360°", "shared exterior-angle-sum authority returns 360°"]) }),
  });
}

function generateSidesFromExterior(seed: string): Phase3PrototypeQuestion {
  const clues = ["POLYGON_IS_REGULAR", "EACH_EXTERIOR_IS_24"] as const;
  const expected = "15";
  const solve = (active: ReadonlySet<string>) => clues.every((clue) => active.has(clue)) ? String(regularPolygonSideCountFromExteriorAngle(rational(24))) : null;
  if (solve(new Set(clues)) !== expected) throw new Error("Side-count-from-exterior solver mismatch");
  const verifierPassed = 15 * 24 === 360 && equals(regularPolygonExteriorAngle(15), rational(24));
  const theoremTrace: TheoremId[] = ["POLYGON_EXTERIOR_SUM", "REGULAR_POLYGON_ANGLE"];
  const optionSet = buildOptions(expected, [
    { text: "7.5", misconceptionId: "USED_180_INSTEAD_OF_360", rationale: "Uses 180°/24° instead of the full exterior-angle sum." },
    { text: "24", misconceptionId: "COPIED_ANGLE_AS_SIDE_COUNT", rationale: "Copies the angle measure as the side count." },
    { text: "12", misconceptionId: "ASSUMED_DODECAGON", rationale: "Chooses a familiar side count without using the given angle." },
  ], seed);
  return finalizePhase3Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP009-N-FROM-EXTERIOR-V1", solveMode: "findRegularPolygonSideCountFromExterior", difficulty: "Easy", seed,
    stem: "Each exterior angle of a regular polygon is 24°. How many sides does the polygon have?", ...optionSet,
    explanation: buildExplanation(theoremTrace, ["The equal exterior angles of a regular polygon add to 360°.", "Hence the number of sides is 360°/24° = 15."]),
    theoremTrace, proofEvents: [exteriorSumEvent(15)], displayedClueIds: clues,
    minimalityProof: proveClueMinimality(clues, solve, expected),
    independentVerifierResult: Object.freeze({ passed: verifierPassed, oracle: "INDEPENDENT_ARITHMETIC", checks: Object.freeze(["15 × 24° = 360°", "a regular 15-gon independently returns exterior angle 24°"]) }),
  });
}

function generateSidesFromInterior(seed: string): Phase3PrototypeQuestion {
  const clues = ["POLYGON_IS_REGULAR", "EACH_INTERIOR_IS_156"] as const;
  const expected = "15";
  const solve = (active: ReadonlySet<string>) => clues.every((clue) => active.has(clue)) ? String(regularPolygonSideCountFromInteriorAngle(rational(156))) : null;
  if (solve(new Set(clues)) !== expected) throw new Error("Side-count-from-interior solver mismatch");
  const verifierPassed = equals(regularPolygonInteriorAngle(15), rational(156)) && 15 * 24 === 360;
  const theoremTrace: TheoremId[] = ["REGULAR_POLYGON_ANGLE", "POLYGON_EXTERIOR_SUM"];
  const optionSet = buildOptions(expected, [
    { text: "24", misconceptionId: "USED_INTERIOR_AS_EXTERIOR", rationale: "Uses 156° directly in the exterior-angle side-count calculation." },
    { text: "12", misconceptionId: "ASSUMED_DODECAGON", rationale: "Chooses a familiar side count without solving from the interior angle." },
    { text: "10", misconceptionId: "STOPPED_AFTER_EXTERIOR_CONVERSION", rationale: "Converts the interior angle but does not complete the side-count calculation." },
  ], seed);
  return finalizePhase3Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP009-N-FROM-INTERIOR-V1", solveMode: "findRegularPolygonSideCountFromInterior", difficulty: "Medium", seed,
    stem: "Each interior angle of a regular polygon is 156°. How many sides does the polygon have?", ...optionSet,
    explanation: buildExplanation(theoremTrace, ["The corresponding exterior angle is 180° − 156° = 24°.", "The equal exterior angles total 360°, so n = 360°/24° = 15."]),
    theoremTrace, proofEvents: [exteriorSumEvent(15)], displayedClueIds: clues,
    minimalityProof: proveClueMinimality(clues, solve, expected),
    independentVerifierResult: Object.freeze({ passed: verifierPassed, oracle: "INDEPENDENT_ARITHMETIC", checks: Object.freeze(["a regular 15-gon independently has interior angle 156°", "15 × 24° = 360°"]) }),
  });
}

export const GEO_CP_009_ANGLE_PHASE3_PROTOTYPES: readonly Phase3PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP009-EXTERIOR-FROM-N-V1", cpId: CP_ID, solveMode: "findRegularPolygonExteriorAngle", generate: generateExteriorFromSides },
  { temporaryPrototypeId: "GEO-TMP-CP009-N-FROM-EXTERIOR-V1", cpId: CP_ID, solveMode: "findRegularPolygonSideCountFromExterior", generate: generateSidesFromExterior },
  { temporaryPrototypeId: "GEO-TMP-CP009-N-FROM-INTERIOR-V1", cpId: CP_ID, solveMode: "findRegularPolygonSideCountFromInterior", generate: generateSidesFromInterior },
]);
