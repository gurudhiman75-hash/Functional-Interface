import {
  angle, equals, polygonExteriorAngleSum, rational,
  regularPolygonExteriorAngle, regularPolygonInteriorAngle,
  regularPolygonSideCountFromExteriorAngle, regularPolygonSideCountFromInteriorAngle,
  type GeoProofEvent, type TheoremId,
} from "../../../../../../shared/geometry";
import { buildExplanation, buildOptions, finalizePhase3Question, proveClueMinimality } from "../discovery/phase3-utils";
import type { Phase3PrototypeDefinition, Phase3PrototypeQuestion } from "../discovery/phase3-types";

const CP_ID = "GEO-CP-009" as const;

function variantIndex(seed: string, length: number): number {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % length;
}

function exteriorSumEvent(count: number): GeoProofEvent {
  return { kind: "ANGLE_SUM", angleIds: Array.from({ length: count }, (_, i) => `E${i + 1}`), total: angle(360), reason: "POLYGON_EXTERIOR_SUM" };
}

function generateExteriorFromSides(seed: string): Phase3PrototypeQuestion {
  const sidePool = [8, 9, 10, 12, 15, 18] as const;
  const n = sidePool[variantIndex(seed, sidePool.length)]!;
  const exterior = 360 / n;
  const clues = ["POLYGON_IS_REGULAR", "SIDE_COUNT_GIVEN"] as const;
  const expected = `${exterior}°`;
  const solve = (active: ReadonlySet<string>) => {
    if (!clues.every((clue) => active.has(clue))) return null;
    const value = regularPolygonExteriorAngle(n);
    return value.denominator === 1n ? `${value.numerator}°` : `${value.numerator}/${value.denominator}°`;
  };
  if (solve(new Set(clues)) !== expected) throw new Error("Regular exterior-angle solver mismatch");
  const verifierPassed = n * exterior === 360 && equals(polygonExteriorAngleSum(), rational(360));
  const theoremTrace: TheoremId[] = ["POLYGON_EXTERIOR_SUM", "REGULAR_POLYGON_ANGLE"];
  const optionSet = buildOptions(expected, [
    { text: `${180 / n}°`, misconceptionId: "USED_180_INSTEAD_OF_360", rationale: "Divides 180° by the side count instead of the exterior-angle sum." },
    { text: `${180 - exterior}°`, misconceptionId: "RETURNED_INTERIOR_ANGLE", rationale: "Returns the regular interior angle instead of the exterior angle." },
    { text: `${720 / n}°`, misconceptionId: "HALVED_SIDE_COUNT", rationale: "Uses half the actual number of equal exterior angles." },
  ], seed);
  return finalizePhase3Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP009-EXTERIOR-FROM-N-V1", solveMode: "findRegularPolygonExteriorAngle", difficulty: "Easy", seed,
    stem: `What is each exterior angle of a regular ${n}-sided polygon?`, ...optionSet,
    explanation: buildExplanation(theoremTrace, ["One exterior angle at each vertex adds to 360°. In a regular polygon those exterior angles are equal.", `So each exterior angle is 360°/${n} = ${exterior}°.`]),
    theoremTrace, proofEvents: [exteriorSumEvent(n)], displayedClueIds: clues,
    minimalityProof: proveClueMinimality(clues, solve, expected),
    independentVerifierResult: Object.freeze({ passed: verifierPassed, oracle: "INDEPENDENT_ARITHMETIC", checks: Object.freeze([`${n} × ${exterior}° = 360°`, "shared exterior-angle-sum authority returns 360°"]) }),
  });
}

function generateSidesFromExterior(seed: string): Phase3PrototypeQuestion {
  const statePool = [
    { exterior: 45, n: 8 },
    { exterior: 40, n: 9 },
    { exterior: 36, n: 10 },
    { exterior: 30, n: 12 },
    { exterior: 24, n: 15 },
    { exterior: 20, n: 18 },
  ] as const;
  const state = statePool[variantIndex(seed, statePool.length)]!;
  const clues = ["POLYGON_IS_REGULAR", "EXTERIOR_ANGLE_GIVEN"] as const;
  const expected = String(state.n);
  const solve = (active: ReadonlySet<string>) => clues.every((clue) => active.has(clue)) ? String(regularPolygonSideCountFromExteriorAngle(rational(state.exterior))) : null;
  if (solve(new Set(clues)) !== expected) throw new Error("Side-count-from-exterior solver mismatch");
  const verifierPassed = state.n * state.exterior === 360 && equals(regularPolygonExteriorAngle(state.n), rational(state.exterior));
  const theoremTrace: TheoremId[] = ["POLYGON_EXTERIOR_SUM", "REGULAR_POLYGON_ANGLE"];
  const optionSet = buildOptions(expected, [
    { text: String(180 / state.exterior), misconceptionId: "USED_180_INSTEAD_OF_360", rationale: "Uses 180° divided by the exterior angle instead of the full exterior-angle sum." },
    { text: String(state.exterior), misconceptionId: "COPIED_ANGLE_AS_SIDE_COUNT", rationale: "Copies the angle measure as the side count." },
    { text: String(Math.max(3, state.n - 3)), misconceptionId: "ARBITRARY_SIDE_COUNT_OFFSET", rationale: "Subtracts from the correct side count without using the exterior-angle relation." },
  ], seed);
  return finalizePhase3Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP009-N-FROM-EXTERIOR-V1", solveMode: "findRegularPolygonSideCountFromExterior", difficulty: "Easy", seed,
    stem: `Each exterior angle of a regular polygon is ${state.exterior}°. How many sides does the polygon have?`, ...optionSet,
    explanation: buildExplanation(theoremTrace, ["The equal exterior angles of a regular polygon add to 360°.", `Hence the number of sides is 360°/${state.exterior}° = ${state.n}.`]),
    theoremTrace, proofEvents: [exteriorSumEvent(state.n)], displayedClueIds: clues,
    minimalityProof: proveClueMinimality(clues, solve, expected),
    independentVerifierResult: Object.freeze({ passed: verifierPassed, oracle: "INDEPENDENT_ARITHMETIC", checks: Object.freeze([`${state.n} × ${state.exterior}° = 360°`, `a regular ${state.n}-gon independently returns exterior angle ${state.exterior}°`]) }),
  });
}

function generateSidesFromInterior(seed: string): Phase3PrototypeQuestion {
  const statePool = [
    { interior: 135, exterior: 45, n: 8 },
    { interior: 140, exterior: 40, n: 9 },
    { interior: 144, exterior: 36, n: 10 },
    { interior: 150, exterior: 30, n: 12 },
    { interior: 156, exterior: 24, n: 15 },
    { interior: 160, exterior: 20, n: 18 },
  ] as const;
  const state = statePool[variantIndex(seed, statePool.length)]!;
  const clues = ["POLYGON_IS_REGULAR", "INTERIOR_ANGLE_GIVEN"] as const;
  const expected = String(state.n);
  const solve = (active: ReadonlySet<string>) => clues.every((clue) => active.has(clue)) ? String(regularPolygonSideCountFromInteriorAngle(rational(state.interior))) : null;
  if (solve(new Set(clues)) !== expected) throw new Error("Side-count-from-interior solver mismatch");
  const verifierPassed = equals(regularPolygonInteriorAngle(state.n), rational(state.interior)) && state.n * state.exterior === 360;
  const theoremTrace: TheoremId[] = ["REGULAR_POLYGON_ANGLE", "POLYGON_EXTERIOR_SUM"];
  const optionSet = buildOptions(expected, [
    { text: String(state.exterior), misconceptionId: "USED_INTERIOR_AS_EXTERIOR", rationale: "Confuses the converted exterior angle with the side count." },
    { text: String(Math.max(3, state.n - 3)), misconceptionId: "ARBITRARY_SIDE_COUNT_OFFSET", rationale: "Chooses a nearby side count without solving from the interior angle." },
    { text: String(360 / Math.max(1, state.interior)), misconceptionId: "USED_INTERIOR_DIRECTLY", rationale: "Divides 360° by the interior angle instead of first finding the exterior angle." },
  ], seed);
  return finalizePhase3Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP009-N-FROM-INTERIOR-V1", solveMode: "findRegularPolygonSideCountFromInterior", difficulty: "Medium", seed,
    stem: `Each interior angle of a regular polygon is ${state.interior}°. How many sides does the polygon have?`, ...optionSet,
    explanation: buildExplanation(theoremTrace, [`The corresponding exterior angle is 180° − ${state.interior}° = ${state.exterior}°.`, `The equal exterior angles total 360°, so n = 360°/${state.exterior}° = ${state.n}.`]),
    theoremTrace, proofEvents: [exteriorSumEvent(state.n)], displayedClueIds: clues,
    minimalityProof: proveClueMinimality(clues, solve, expected),
    independentVerifierResult: Object.freeze({ passed: verifierPassed, oracle: "INDEPENDENT_ARITHMETIC", checks: Object.freeze([`a regular ${state.n}-gon independently has interior angle ${state.interior}°`, `${state.n} × ${state.exterior}° = 360°`]) }),
  });
}

export const GEO_CP_009_ANGLE_PHASE3_PROTOTYPES: readonly Phase3PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP009-EXTERIOR-FROM-N-V1", cpId: CP_ID, solveMode: "findRegularPolygonExteriorAngle", generate: generateExteriorFromSides },
  { temporaryPrototypeId: "GEO-TMP-CP009-N-FROM-EXTERIOR-V1", cpId: CP_ID, solveMode: "findRegularPolygonSideCountFromExterior", generate: generateSidesFromExterior },
  { temporaryPrototypeId: "GEO-TMP-CP009-N-FROM-INTERIOR-V1", cpId: CP_ID, solveMode: "findRegularPolygonSideCountFromInterior", generate: generateSidesFromInterior },
]);
