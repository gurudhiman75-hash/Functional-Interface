import {
  correspondingLengthFromPerimeterScale,
  perimeterFromCorrespondingSideScale,
  rational,
  type Rational,
  type TheoremId,
} from "../../../../../shared/geometry";
import {
  buildExplanation,
  buildOptions,
  finalizeGapWave4Question,
  proveClueMinimality,
  wave4Verifier,
  wholeNumberText,
} from "./wave4-utils";
import type { GapWave4PrototypeDefinition, GapWave4Question } from "./wave4-types";

function variantIndex(seed: string, count: number): number {
  const final = seed.at(-1)?.toLowerCase();
  if (final && final >= "a" && final <= "z") return (final.charCodeAt(0) - 97) % count;
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  return hash % count;
}

function integer(value: number): Rational {
  return rational(value);
}

function exactInteger(value: Rational): number {
  if (value.denominator !== 1n) throw new Error("Wave 4 fixture expected an integer result");
  return Number(value.numerator);
}

function generatePerimeterToSide(seed: string): GapWave4Question {
  const variants = [
    {
      firstTriangle: "RST", secondTriangle: "ABC", firstPerimeter: 26, secondPerimeter: 39,
      targetIsFirst: true, knownSide: "AB", knownLength: 24, targetSide: "RS", target: 16,
      sourceEvidenceIds: ["SRC-TESTBOOK-CGL-PERIMETER-TO-SIDE-PYQ-2024"] as const,
      wrong: [
        { value: 36, misconceptionId: "SIMILARITY_SCALE_INVERTED", rationale: "Uses 39/26 instead of 26/39, giving 24 × 39/26 = 36." },
        { value: 24, misconceptionId: "SIMILARITY_SCALE_COPIED", rationale: "Copies AB directly and ignores that the two similar triangles have different perimeters." },
        { value: 13, misconceptionId: "PERIMETER_DIFFERENCE_USED_AS_LENGTH", rationale: "Uses the perimeter difference 39 − 26 = 13 as though it were the missing side." },
      ] as const,
      stem: "Triangles RST and ABC are similar in corresponding order. Their perimeters are 26 cm and 39 cm respectively. If AB = 24 cm, find RS.",
      explanation: [
        "RST and ABC are similar, so their corresponding sides change in the same ratio as their perimeters.",
        "RST has 26/39 of the perimeter of ABC, so RS must be 26/39 of its corresponding side AB.",
        "Thus RS = 24 × 26/39 = 16 cm.",
      ] as const,
    },
    {
      firstTriangle: "ABC", secondTriangle: "PQR", firstPerimeter: 72, secondPerimeter: 48,
      targetIsFirst: false, knownSide: "AB", knownLength: 18, targetSide: "PQ", target: 12,
      sourceEvidenceIds: ["SRC-TESTBOOK-CHSL-PERIMETER-TO-SIDE-PYQ-2022"] as const,
      wrong: [
        { value: 27, misconceptionId: "SIMILARITY_SCALE_INVERTED", rationale: "Reverses the scale and calculates 18 × 72/48 = 27." },
        { value: 18, misconceptionId: "SIMILARITY_SCALE_COPIED", rationale: "Copies AB as PQ instead of applying the smaller-triangle scale." },
        { value: 24, misconceptionId: "PERIMETER_DIFFERENCE_USED_AS_LENGTH", rationale: "Uses the perimeter difference 72 − 48 = 24 as the side length." },
      ] as const,
      stem: "The perimeters of similar triangles ABC and PQR are 72 cm and 48 cm. AB corresponds to PQ and AB = 18 cm. What is PQ?",
      explanation: [
        "PQR is the smaller similar triangle: its perimeter scale relative to ABC is 48/72 = 2/3.",
        "The corresponding side PQ therefore has the same 2/3 scale relative to AB.",
        "So PQ = 18 × 48/72 = 12 cm.",
      ] as const,
    },
    {
      firstTriangle: "XYZ", secondTriangle: "PQR", firstPerimeter: 80, secondPerimeter: 60,
      targetIsFirst: true, knownSide: "PQ", knownLength: 24, targetSide: "XY", target: 32,
      sourceEvidenceIds: ["SRC-TESTBOOK-CGL-PERIMETER-TO-SIDE-PYQ-2024", "SRC-TESTBOOK-CHSL-PERIMETER-TO-SIDE-PYQ-2022"] as const,
      wrong: [
        { value: 18, misconceptionId: "SIMILARITY_SCALE_INVERTED", rationale: "Uses 60/80 instead of 80/60, giving 24 × 60/80 = 18." },
        { value: 24, misconceptionId: "SIMILARITY_SCALE_COPIED", rationale: "Copies PQ as XY and ignores the larger perimeter of XYZ." },
        { value: 20, misconceptionId: "PERIMETER_DIFFERENCE_USED_AS_LENGTH", rationale: "Uses the perimeter difference 80 − 60 = 20 as the missing side." },
      ] as const,
      stem: "Triangles XYZ and PQR are similar, with X ↔ P, Y ↔ Q and Z ↔ R. Their perimeters are 80 cm and 60 cm. If PQ = 24 cm, find XY.",
      explanation: [
        "The perimeter ratio XYZ : PQR is 80 : 60 = 4 : 3.",
        "Because XY corresponds to PQ, their lengths must follow that same 4 : 3 scale.",
        "Hence XY = 24 × 80/60 = 32 cm.",
      ] as const,
    },
  ] as const;
  const variant = variants[variantIndex(seed, variants.length)];
  const clueIds = ["TRIANGLES_ARE_SIMILAR_IN_CORRESPONDENCE", "BOTH_PERIMETERS_GIVEN", "ONE_CORRESPONDING_SIDE_GIVEN", "TARGET_CORRESPONDING_SIDE"] as const;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const target = variant.targetIsFirst
      ? correspondingLengthFromPerimeterScale(integer(variant.firstPerimeter), integer(variant.secondPerimeter), integer(variant.knownLength))
      : correspondingLengthFromPerimeterScale(integer(variant.secondPerimeter), integer(variant.firstPerimeter), integer(variant.knownLength));
    return wholeNumberText(target);
  };
  const expected = `${variant.target} cm`;
  if (solve(new Set(clueIds)) !== expected) throw new Error("Perimeter-to-side fixture mismatch");

  const targetPerimeter = variant.targetIsFirst ? variant.firstPerimeter : variant.secondPerimeter;
  const knownPerimeter = variant.targetIsFirst ? variant.secondPerimeter : variant.firstPerimeter;
  const synthetic = variant.targetIsFirst
    ? correspondingLengthFromPerimeterScale(integer(variant.firstPerimeter), integer(variant.secondPerimeter), integer(variant.knownLength))
    : correspondingLengthFromPerimeterScale(integer(variant.secondPerimeter), integer(variant.firstPerimeter), integer(variant.knownLength));
  const verifierPassed = BigInt(targetPerimeter) * BigInt(variant.knownLength) === BigInt(knownPerimeter) * BigInt(exactInteger(synthetic));
  const theoremTrace: TheoremId[] = ["SIMILAR_TRIANGLES_PERIMETER_SCALE"];
  const optionSet = buildOptions(expected, variant.wrong.map((item) => ({
    text: `${item.value} cm`,
    misconceptionId: item.misconceptionId,
    rationale: item.rationale,
  })), seed);

  return finalizeGapWave4Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W4-CP005-PERIMETER-TO-SIDE-V1",
    sourceGapId: "GEO-CP-005/PERIMETER_RATIO_SIMILARITY_SCALE",
    sourceEvidenceIds: variant.sourceEvidenceIds,
    solveMode: "findCorrespondingSideFromPerimeterScale",
    difficulty: "Easy",
    seed,
    stem: variant.stem,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, variant.explanation),
    theoremTrace,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave4Verifier(verifierPassed, [
      "independent cross-multiplication confirms target perimeter × known side = known perimeter × target side",
      "the target side changes in the same direction as the corresponding perimeter scale",
    ]),
  });
}

function generateSideToPerimeter(seed: string): GapWave4Question {
  const variants = [
    {
      firstSide: 8, secondSide: 12, secondSides: [12, 18, 24] as const, target: 36,
      wrong: [
        { value: 54, misconceptionId: "SIMILARITY_PERIMETER_COPIED", rationale: "Copies the perimeter of PQR without applying the 8/12 similarity scale." },
        { value: 81, misconceptionId: "SIMILARITY_SCALE_INVERTED", rationale: "Reverses 8/12 to 12/8 and calculates 54 × 12/8 = 81." },
        { value: 50, misconceptionId: "SIMILARITY_ADDITIVE_SCALING", rationale: "Subtracts the side difference 12 − 8 = 4 from the perimeter 54, treating similarity as additive." },
      ] as const,
      stem: "Triangles ABC and PQR are similar in corresponding order. AB = 8 cm, PQ = 12 cm, QR = 18 cm and PR = 24 cm. Find the perimeter of triangle ABC.",
      explanation: [
        "The perimeter of PQR is 12 + 18 + 24 = 54 cm.",
        "AB : PQ = 8 : 12 = 2 : 3, so every length in ABC—including its whole perimeter—is 2/3 of the corresponding measure in PQR.",
        "Therefore the perimeter of ABC is 54 × 8/12 = 36 cm.",
      ] as const,
    },
    {
      firstSide: 10, secondSide: 15, secondSides: [15, 20, 25] as const, target: 40,
      wrong: [
        { value: 60, misconceptionId: "SIMILARITY_PERIMETER_COPIED", rationale: "Keeps the PQR perimeter unchanged even though ABC is the smaller similar triangle." },
        { value: 90, misconceptionId: "SIMILARITY_SCALE_INVERTED", rationale: "Uses 15/10 instead of 10/15, giving 60 × 15/10 = 90." },
        { value: 55, misconceptionId: "SIMILARITY_ADDITIVE_SCALING", rationale: "Subtracts the side difference 15 − 10 = 5 from 60 instead of scaling the whole perimeter." },
      ] as const,
      stem: "ABC ∼ PQR with AB corresponding to PQ. If AB = 10 cm, while PQ = 15 cm, QR = 20 cm and PR = 25 cm, what is the perimeter of ABC?",
      explanation: [
        "PQR has perimeter 15 + 20 + 25 = 60 cm.",
        "The corresponding-side scale from PQR to ABC is 10/15 = 2/3.",
        "Apply that same scale to the full perimeter: 60 × 10/15 = 40 cm.",
      ] as const,
    },
    {
      firstSide: 14, secondSide: 21, secondSides: [21, 28, 35] as const, target: 56,
      wrong: [
        { value: 84, misconceptionId: "SIMILARITY_PERIMETER_COPIED", rationale: "Copies the 84 cm perimeter of PQR instead of shrinking it by the 14/21 scale." },
        { value: 126, misconceptionId: "SIMILARITY_SCALE_INVERTED", rationale: "Uses 21/14 in the wrong direction, giving 84 × 21/14 = 126." },
        { value: 77, misconceptionId: "SIMILARITY_ADDITIVE_SCALING", rationale: "Subtracts 21 − 14 = 7 from 84, an additive operation that similarity does not justify." },
      ] as const,
      stem: "Two triangles ABC and PQR are similar, and AB : PQ = 14 : 21. The sides of PQR are 21 cm, 28 cm and 35 cm. Find the perimeter of ABC.",
      explanation: [
        "The three sides of PQR add to 21 + 28 + 35 = 84 cm.",
        "AB : PQ = 14 : 21 = 2 : 3, so ABC is two-thirds the linear size of PQR.",
        "Its perimeter is therefore two-thirds of 84 cm, which is 56 cm.",
      ] as const,
    },
  ] as const;
  const variant = variants[variantIndex(seed, variants.length)];
  const secondPerimeter = variant.secondSides.reduce((sum, value) => sum + value, 0);
  const clueIds = ["TRIANGLES_ARE_SIMILAR_IN_CORRESPONDENCE", "ONE_CORRESPONDING_SIDE_PAIR_GIVEN", "ALL_SIDES_OF_REFERENCE_TRIANGLE_GIVEN", "TARGET_OTHER_PERIMETER"] as const;
  const expected = `${variant.target} cm`;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return wholeNumberText(perimeterFromCorrespondingSideScale(integer(variant.firstSide), integer(variant.secondSide), integer(secondPerimeter)));
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Side-to-perimeter fixture mismatch");

  const synthetic = perimeterFromCorrespondingSideScale(integer(variant.firstSide), integer(variant.secondSide), integer(secondPerimeter));
  const verifierPassed = BigInt(exactInteger(synthetic)) * BigInt(variant.secondSide) === BigInt(secondPerimeter) * BigInt(variant.firstSide);
  const theoremTrace: TheoremId[] = ["SIMILAR_TRIANGLES_PERIMETER_SCALE"];
  const optionSet = buildOptions(expected, variant.wrong.map((item) => ({
    text: `${item.value} cm`,
    misconceptionId: item.misconceptionId,
    rationale: item.rationale,
  })), seed);

  return finalizeGapWave4Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W4-CP005-SIDE-TO-PERIMETER-V1",
    sourceGapId: "GEO-CP-005/PERIMETER_RECOVERY_FROM_SIDE_SCALE",
    sourceEvidenceIds: ["SRC-TESTBOOK-CHSL-SIDE-TO-PERIMETER-PYQ-2024"],
    solveMode: "findSimilarTrianglePerimeterFromCorrespondingSideScale",
    difficulty: "Medium",
    seed,
    stem: variant.stem,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, variant.explanation),
    theoremTrace,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave4Verifier(verifierPassed, [
      "the three supplied reference sides independently sum to the reference perimeter",
      "cross-multiplication independently confirms target perimeter / reference perimeter = first side / corresponding side",
    ]),
  });
}

export const GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES: readonly GapWave4PrototypeDefinition[] = Object.freeze([
  Object.freeze({
    temporaryPrototypeId: "GEO-TMP-GAP-W4-CP005-PERIMETER-TO-SIDE-V1",
    cpId: "GEO-CP-005",
    sourceGapId: "GEO-CP-005/PERIMETER_RATIO_SIMILARITY_SCALE",
    solveMode: "findCorrespondingSideFromPerimeterScale",
    generate: generatePerimeterToSide,
  }),
  Object.freeze({
    temporaryPrototypeId: "GEO-TMP-GAP-W4-CP005-SIDE-TO-PERIMETER-V1",
    cpId: "GEO-CP-005",
    sourceGapId: "GEO-CP-005/PERIMETER_RECOVERY_FROM_SIDE_SCALE",
    solveMode: "findSimilarTrianglePerimeterFromCorrespondingSideScale",
    generate: generateSideToPerimeter,
  }),
]);
