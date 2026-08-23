import type { TheoremId } from "../../../../../shared/geometry";
import {
  buildExplanation,
  buildOptions,
  finalizeGapWave8Question,
  proveClueMinimality,
  wave8Verifier,
} from "./wave8-utils";
import type { GapWave8PrototypeDefinition, GapWave8Question } from "./wave8-types";

function variantIndex(seed: string, count: number): number {
  const final = seed.at(-1)?.toLowerCase();
  if (final && final >= "a" && final <= "z") return (final.charCodeAt(0) - 97) % count;
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  return hash % count;
}

function polygonSidesFromInteriorSum(sumDegrees: number): number | null {
  if (!Number.isInteger(sumDegrees) || sumDegrees < 180 || sumDegrees % 180 !== 0) return null;
  const sides = sumDegrees / 180 + 2;
  return Number.isInteger(sides) && sides >= 3 ? sides : null;
}

function regularPolygonAngles(sides: number): Readonly<{ exterior: number; interior: number; difference: number }> | null {
  if (!Number.isInteger(sides) || sides < 3 || 360 % sides !== 0) return null;
  const exterior = 360 / sides;
  const interior = 180 - exterior;
  return Object.freeze({ exterior, interior, difference: interior - exterior });
}

function generateInteriorSumToSides(seed: string): GapWave8Question {
  const variants = [
    {
      sum: 1260,
      target: 9,
      stem: "The sum of the interior angles of a polygon is 1260°. How many sides does the polygon have?",
      wrong: [
        { value: 7, misconceptionId: "POLYGON_INTERIOR_SUM_FORGOT_PLUS_TWO", rationale: "Stops at 1260 ÷ 180 = 7 and forgets that the formula gives n − 2, not n." },
        { value: 8, misconceptionId: "POLYGON_INTERIOR_SUM_ADDED_ONE", rationale: "Finds 1260 ÷ 180 = 7 but adds only 1 instead of the required 2." },
        { value: 11, misconceptionId: "POLYGON_INTERIOR_SUM_ADDED_FOUR", rationale: "Misremembers (n − 2) × 180° as (n − 4) × 180° and therefore adds 4 to 7." },
      ] as const,
      explanation: [
        "For an n-sided polygon, the interior-angle sum is (n − 2) × 180°.",
        "So (n − 2) × 180° = 1260°, giving n − 2 = 7.",
        "Therefore n = 9 sides.",
      ] as const,
    },
    {
      sum: 1440,
      target: 10,
      stem: "A polygon has a total interior-angle sum of 1440°. Find its number of sides.",
      wrong: [
        { value: 8, misconceptionId: "POLYGON_INTERIOR_SUM_FORGOT_PLUS_TWO", rationale: "Uses 1440 ÷ 180 = 8 directly as n instead of recognizing that it equals n − 2." },
        { value: 9, misconceptionId: "POLYGON_INTERIOR_SUM_ADDED_ONE", rationale: "Adds only 1 to the intermediate value 8 instead of adding 2." },
        { value: 12, misconceptionId: "POLYGON_INTERIOR_SUM_ADDED_FOUR", rationale: "Adds 4 to the intermediate value 8 after using an incorrect n − 4 interior-sum formula." },
      ] as const,
      explanation: [
        "Use the polygon interior-sum relation (n − 2) × 180°.",
        "1440° ÷ 180° = 8, so n − 2 = 8.",
        "Hence the polygon has n = 10 sides.",
      ] as const,
    },
    {
      sum: 1800,
      target: 12,
      stem: "The interior angles of a polygon add up to 1800°. Determine the number of sides.",
      wrong: [
        { value: 10, misconceptionId: "POLYGON_INTERIOR_SUM_FORGOT_PLUS_TWO", rationale: "Treats 1800 ÷ 180 = 10 as the side count, forgetting that this quotient is n − 2." },
        { value: 11, misconceptionId: "POLYGON_INTERIOR_SUM_ADDED_ONE", rationale: "Adds 1 rather than 2 to the quotient 10." },
        { value: 14, misconceptionId: "POLYGON_INTERIOR_SUM_ADDED_FOUR", rationale: "Uses an incorrect n − 4 form and adds 4 to the quotient 10." },
      ] as const,
      explanation: [
        "An n-sided polygon has interior-angle sum (n − 2) × 180°.",
        "1800° ÷ 180° = 10, so n − 2 = 10.",
        "Thus n = 12 sides.",
      ] as const,
    },
  ] as const;
  const variant = variants[variantIndex(seed, variants.length)];
  const clueIds = ["INTERIOR_ANGLE_SUM_GIVEN", "TARGET_POLYGON_SIDE_COUNT"] as const;
  const expected = `${variant.target} sides`;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const sides = polygonSidesFromInteriorSum(variant.sum);
    return sides === null ? null : `${sides} sides`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Wave 8 interior-sum inverse fixture mismatch");

  const theoremTrace: TheoremId[] = ["POLYGON_INTERIOR_SUM"];
  const optionSet = buildOptions(expected, variant.wrong.map((item) => ({
    text: `${item.value} sides`,
    misconceptionId: item.misconceptionId,
    rationale: item.rationale,
  })), seed);
  const verifierPassed = (variant.target - 2) * 180 === variant.sum && variant.target >= 3;

  return finalizeGapWave8Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W8-CP009-INTERIOR-SUM-TO-SIDES-V1",
    sourceGapId: "GEO-CP-009/INTERIOR_SUM_AND_INVERSE",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-POLYGON-INTERIOR-SUM-INVERSE-PYQ-2019"],
    solveMode: "findPolygonSideCountFromInteriorAngleSum",
    difficulty: "Easy",
    seed,
    stem: variant.stem,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, variant.explanation),
    theoremTrace,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave8Verifier(verifierPassed, [
      "independent substitution confirms (n - 2) x 180 equals the supplied interior-angle sum",
      "the recovered side count is an integer at least 3",
    ]),
  });
}

function generateExteriorSumInvariant(seed: string): GapWave8Question {
  const variants = [
    {
      sides: 5,
      polygonName: "convex pentagon",
      stem: "Take one exterior angle at each vertex of a convex pentagon, all measured in the same turning direction. What is their total?",
      wrong: [
        { value: 540, misconceptionId: "USED_INTERIOR_ANGLE_SUM", rationale: "Calculates (5 − 2) × 180° = 540°, which is the interior-angle sum rather than the exterior-angle sum." },
        { value: 72, misconceptionId: "USED_ONE_REGULAR_EXTERIOR_ANGLE", rationale: "Computes 360° ÷ 5 = 72° as though the question asked for one exterior angle of a regular pentagon." },
        { value: 900, misconceptionId: "SUMMED_LINEAR_PAIRS_WITHOUT_SUBTRACTION", rationale: "Uses 5 × 180° = 900° for all interior-plus-exterior linear pairs but never removes the interior-angle contribution." },
      ] as const,
    },
    {
      sides: 8,
      polygonName: "convex octagon",
      stem: "For a convex octagon, one exterior angle is taken at every vertex in a consistent direction. Find the sum of those exterior angles.",
      wrong: [
        { value: 1080, misconceptionId: "USED_INTERIOR_ANGLE_SUM", rationale: "Uses (8 − 2) × 180° = 1080°, the octagon's interior-angle sum." },
        { value: 45, misconceptionId: "USED_ONE_REGULAR_EXTERIOR_ANGLE", rationale: "Uses 360° ÷ 8 = 45° as if a single regular exterior angle were requested." },
        { value: 1440, misconceptionId: "SUMMED_LINEAR_PAIRS_WITHOUT_SUBTRACTION", rationale: "Adds eight 180° vertex linear pairs to get 1440° without subtracting the interior angles." },
      ] as const,
    },
    {
      sides: 12,
      polygonName: "convex dodecagon",
      stem: "A convex 12-sided polygon is traversed once, taking the exterior turn at every vertex in the same sense. What is the sum of all these exterior angles?",
      wrong: [
        { value: 1800, misconceptionId: "USED_INTERIOR_ANGLE_SUM", rationale: "Computes (12 − 2) × 180° = 1800°, which belongs to the interior angles." },
        { value: 30, misconceptionId: "USED_ONE_REGULAR_EXTERIOR_ANGLE", rationale: "Computes 360° ÷ 12 = 30° and mistakes one regular exterior angle for the total." },
        { value: 2160, misconceptionId: "SUMMED_LINEAR_PAIRS_WITHOUT_SUBTRACTION", rationale: "Uses 12 × 180° = 2160° for vertex linear pairs without removing the interior-angle sum." },
      ] as const,
    },
  ] as const;
  const variant = variants[variantIndex(seed, variants.length)];
  const clueIds = ["ONE_EXTERIOR_ANGLE_AT_EACH_VERTEX", "CONSISTENT_TURN_DIRECTION", "TARGET_EXTERIOR_ANGLE_TOTAL"] as const;
  const expected = "360°";
  const solve = (active: ReadonlySet<string>): string | null => clueIds.every((clue) => active.has(clue)) ? expected : null;
  const theoremTrace: TheoremId[] = ["POLYGON_EXTERIOR_SUM"];
  const optionSet = buildOptions(expected, variant.wrong.map((item) => ({
    text: `${item.value}°`,
    misconceptionId: item.misconceptionId,
    rationale: item.rationale,
  })), seed);
  const interiorSum = (variant.sides - 2) * 180;
  const verifierPassed = variant.sides * 180 - interiorSum === 360;

  return finalizeGapWave8Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W8-CP009-EXTERIOR-SUM-INVARIANT-V1",
    sourceGapId: "GEO-CP-009/GENERAL_EXTERIOR_SUM_OR_MISSING_ANGLE",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-POLYGON-EXTERIOR-SUM-PYQ-2025"],
    solveMode: "identifyConvexPolygonExteriorAngleSum",
    difficulty: "Easy",
    seed,
    stem: variant.stem,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      `At each vertex of the ${variant.polygonName}, the interior angle and the chosen exterior angle form a 180° linear pair.`,
      `Across ${variant.sides} vertices those linear pairs total ${variant.sides * 180}°, while the interior angles total (${variant.sides} − 2) × 180° = ${interiorSum}°.`,
      `The exterior-angle total is therefore ${variant.sides * 180}° − ${interiorSum}° = 360°.`,
    ]),
    theoremTrace,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave8Verifier(verifierPassed, [
      "independent linear-pair accounting gives n x 180 minus (n - 2) x 180 = 360",
      "the result is invariant across the seeded 5-, 8- and 12-sided convex polygons",
    ]),
  });
}

function generateInteriorSumToAngleDifference(seed: string): GapWave8Question {
  const variants = [
    {
      sum: 1260,
      sides: 9,
      target: 100,
      stem: "The sum of the interior angles of a regular polygon is 1260°. Find the difference between one interior angle and its corresponding exterior angle.",
      wrong: [
        { value: 140, misconceptionId: "RETURNED_INTERIOR_ANGLE_ONLY", rationale: "Correctly reaches a 140° interior angle but stops before subtracting the corresponding 40° exterior angle." },
        { value: 40, misconceptionId: "RETURNED_EXTERIOR_ANGLE_ONLY", rationale: "Correctly finds the 40° exterior angle but returns it instead of the requested interior-minus-exterior difference." },
        { value: 80, misconceptionId: "DOUBLED_EXTERIOR_ANGLE", rationale: "Uses 2 × 40° = 80° instead of calculating 140° − 40°." },
      ] as const,
    },
    {
      sum: 1440,
      sides: 10,
      target: 108,
      stem: "A regular polygon has interior-angle sum 1440°. What is the numerical difference between each interior angle and each exterior angle?",
      wrong: [
        { value: 144, misconceptionId: "RETURNED_INTERIOR_ANGLE_ONLY", rationale: "Returns the 144° interior angle without subtracting the 36° exterior angle." },
        { value: 36, misconceptionId: "RETURNED_EXTERIOR_ANGLE_ONLY", rationale: "Returns the 36° exterior angle instead of the required difference." },
        { value: 72, misconceptionId: "DOUBLED_EXTERIOR_ANGLE", rationale: "Doubles the 36° exterior angle and reports 72° rather than 144° − 36°." },
      ] as const,
    },
    {
      sum: 1800,
      sides: 12,
      target: 120,
      stem: "The interior angles of a regular polygon total 1800°. Determine how much larger one interior angle is than its adjacent exterior angle.",
      wrong: [
        { value: 150, misconceptionId: "RETURNED_INTERIOR_ANGLE_ONLY", rationale: "Stops at the 150° interior angle and does not subtract the 30° exterior angle." },
        { value: 30, misconceptionId: "RETURNED_EXTERIOR_ANGLE_ONLY", rationale: "Returns the 30° exterior angle by itself rather than the requested difference." },
        { value: 60, misconceptionId: "DOUBLED_EXTERIOR_ANGLE", rationale: "Calculates 2 × 30° = 60° instead of 150° − 30°." },
      ] as const,
    },
  ] as const;
  const variant = variants[variantIndex(seed, variants.length)];
  const clueIds = ["REGULAR_POLYGON_GIVEN", "INTERIOR_ANGLE_SUM_GIVEN", "TARGET_INTERIOR_EXTERIOR_DIFFERENCE"] as const;
  const expected = `${variant.target}°`;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const sides = polygonSidesFromInteriorSum(variant.sum);
    if (sides === null) return null;
    const angles = regularPolygonAngles(sides);
    return angles === null ? null : `${angles.difference}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Wave 8 polygon mixed-chain fixture mismatch");

  const theoremTrace: TheoremId[] = ["POLYGON_INTERIOR_SUM", "POLYGON_EXTERIOR_SUM", "LINEAR_PAIR_SUM"];
  const optionSet = buildOptions(expected, variant.wrong.map((item) => ({
    text: `${item.value}°`,
    misconceptionId: item.misconceptionId,
    rationale: item.rationale,
  })), seed);
  const angles = regularPolygonAngles(variant.sides);
  const verifierPassed = angles !== null
    && (variant.sides - 2) * 180 === variant.sum
    && angles.exterior * variant.sides === 360
    && angles.interior + angles.exterior === 180
    && angles.difference === variant.target;

  return finalizeGapWave8Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W8-CP009-INTERIOR-SUM-ANGLE-DIFFERENCE-V1",
    sourceGapId: "GEO-CP-009/MIXED_POLYGON_ANGLE_CHAIN_OR_CLAIM",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-POLYGON-INTERIOR-SUM-INVERSE-PYQ-2019"],
    solveMode: "findRegularPolygonInteriorExteriorDifferenceFromInteriorSum",
    difficulty: "Medium",
    seed,
    stem: variant.stem,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      `From (${variant.sides} − 2) × 180° = ${variant.sum}°, the polygon has ${variant.sides} sides.`,
      `Each exterior angle is 360° ÷ ${variant.sides} = ${angles?.exterior}°, so the corresponding interior angle is 180° − ${angles?.exterior}° = ${angles?.interior}°.`,
      `The requested difference is ${angles?.interior}° − ${angles?.exterior}° = ${variant.target}°.`,
    ]),
    theoremTrace,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave8Verifier(verifierPassed, [
      "independent substitution checks the recovered side count against the supplied interior-angle sum",
      "independent exterior-angle accounting checks n x E = 360",
      "independent linear-pair accounting checks I + E = 180 and the requested difference I - E",
    ]),
  });
}

export const GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES: readonly GapWave8PrototypeDefinition[] = Object.freeze([
  Object.freeze({
    temporaryPrototypeId: "GEO-TMP-GAP-W8-CP009-INTERIOR-SUM-TO-SIDES-V1",
    cpId: "GEO-CP-009",
    sourceGapId: "GEO-CP-009/INTERIOR_SUM_AND_INVERSE",
    solveMode: "findPolygonSideCountFromInteriorAngleSum",
    generate: generateInteriorSumToSides,
  }),
  Object.freeze({
    temporaryPrototypeId: "GEO-TMP-GAP-W8-CP009-EXTERIOR-SUM-INVARIANT-V1",
    cpId: "GEO-CP-009",
    sourceGapId: "GEO-CP-009/GENERAL_EXTERIOR_SUM_OR_MISSING_ANGLE",
    solveMode: "identifyConvexPolygonExteriorAngleSum",
    generate: generateExteriorSumInvariant,
  }),
  Object.freeze({
    temporaryPrototypeId: "GEO-TMP-GAP-W8-CP009-INTERIOR-SUM-ANGLE-DIFFERENCE-V1",
    cpId: "GEO-CP-009",
    sourceGapId: "GEO-CP-009/MIXED_POLYGON_ANGLE_CHAIN_OR_CLAIM",
    solveMode: "findRegularPolygonInteriorExteriorDifferenceFromInteriorSum",
    generate: generateInteriorSumToAngleDifference,
  }),
]);
