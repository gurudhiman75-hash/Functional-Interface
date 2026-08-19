import {
  correspondingLengthFromPerimeterScale,
  getTheoremDefinition,
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
      knownTriangle: "ABC", knownSide: "AB", knownLength: 24, targetSide: "RS", target: 16,
      distractors: [24, 36, 37],
      stem: "Triangles RST and ABC are similar in corresponding order. Their perimeters are 26 cm and 39 cm respectively. If AB = 24 cm, find RS.",
    },
    {
      firstTriangle: "ABC", secondTriangle: "PQR", firstPerimeter: 64, secondPerimeter: 56,
      knownTriangle: "ABC", knownSide: "AB", knownLength: 16, targetSide: "PQ", target: 14,
      distractors: [16, 18, 8],
      stem: "The perimeters of similar triangles ABC and PQR are 64 cm and 56 cm respectively. AB corresponds to PQ and AB = 16 cm. What is PQ?",
    },
    {
      firstTriangle: "XYZ", secondTriangle: "PQR", firstPerimeter: 80, secondPerimeter: 45,
      knownTriangle: "PQR", knownSide: "PQ", knownLength: 18, targetSide: "XY", target: 32,
      distractors: [18, 10, 35],
      stem: "Triangles XYZ and PQR are similar, with X ↔ P, Y ↔ Q and Z ↔ R. Their perimeters are 80 cm and 45 cm. If PQ = 18 cm, find XY.",
    },
  ] as const;
  const variant = variants[variantIndex(seed, variants.length)];
  const clueIds = ["TRIANGLES_ARE_SIMILAR_IN_CORRESPONDENCE", "BOTH_PERIMETERS_GIVEN", "ONE_CORRESPONDING_SIDE_GIVEN", "TARGET_CORRESPONDING_SIDE"] as const;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const targetIsFirst = variant.targetSide[0] === variant.firstTriangle[0];
    const target = targetIsFirst
      ? correspondingLengthFromPerimeterScale(integer(variant.firstPerimeter), integer(variant.secondPerimeter), integer(variant.knownLength))
      : correspondingLengthFromPerimeterScale(integer(variant.secondPerimeter), integer(variant.firstPerimeter), integer(variant.knownLength));
    return wholeNumberText(target);
  };
  const expected = `${variant.target} cm`;
  if (solve(new Set(clueIds)) !== expected) throw new Error("Perimeter-to-side fixture mismatch");

  const targetIsFirst = variant.targetSide[0] === variant.firstTriangle[0];
  const targetPerimeter = targetIsFirst ? variant.firstPerimeter : variant.secondPerimeter;
  const knownPerimeter = targetIsFirst ? variant.secondPerimeter : variant.firstPerimeter;
  const synthetic = targetIsFirst
    ? correspondingLengthFromPerimeterScale(integer(variant.firstPerimeter), integer(variant.secondPerimeter), integer(variant.knownLength))
    : correspondingLengthFromPerimeterScale(integer(variant.secondPerimeter), integer(variant.firstPerimeter), integer(variant.knownLength));
  const verifierPassed = BigInt(targetPerimeter) * BigInt(variant.knownLength) === BigInt(knownPerimeter) * BigInt(exactInteger(synthetic));
  const theoremTrace: TheoremId[] = ["SIMILAR_TRIANGLES_PERIMETER_SCALE"];
  const optionSet = buildOptions(expected, variant.distractors.map((value, index) => ({
    text: `${value} cm`,
    misconceptionId: ["SIMILARITY_SCALE_INVERTED", "SIMILARITY_SCALE_COPIED", "SIMILARITY_ADDITIVE_SCALING"][index],
    rationale: [
      "Uses the perimeter scale in the wrong direction.",
      "Copies a given length instead of applying the similarity scale.",
      "Treats similarity as an additive change instead of a multiplicative scale.",
    ][index],
  })), seed);
  const scaleNumerator = targetPerimeter;
  const scaleDenominator = knownPerimeter;

  return finalizeGapWave4Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W4-CP005-PERIMETER-TO-SIDE-V1",
    sourceGapId: "GEO-CP-005/PERIMETER_RATIO_SIMILARITY_SCALE",
    sourceEvidenceIds: ["SRC-TESTBOOK-CHSL-PERIMETER-TO-SIDE-PYQ-2022"],
    solveMode: "findCorrespondingSideFromPerimeterScale",
    difficulty: "Easy",
    seed,
    stem: variant.stem,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      `The triangles are already stated to be similar. For similar triangles, the perimeter changes by the same scale as every pair of corresponding sides.`,
      `Here ${variant.targetSide} is in triangle ${targetIsFirst ? variant.firstTriangle : variant.secondTriangle}, whose perimeter is ${targetPerimeter} cm; ${variant.knownSide} is in the corresponding triangle with perimeter ${knownPerimeter} cm.`,
      `So ${variant.targetSide} = ${variant.knownLength} × ${scaleNumerator}/${scaleDenominator} = ${variant.target} cm.`,
    ]),
    theoremTrace,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave4Verifier(verifierPassed, [
      "independent cross-multiplication confirms target perimeter × known side = known perimeter × target side",
      "the target side remains smaller/larger in the same direction as the corresponding perimeter scale",
    ]),
  });
}

function generateSideToPerimeter(seed: string): GapWave4Question {
  const variants = [
    {
      firstSide: 8, secondSide: 12, secondSides: [12, 18, 24] as const, target: 36,
      stem: "Triangles ABC and PQR are similar in corresponding order. AB = 8 cm, PQ = 12 cm, QR = 18 cm and PR = 24 cm. Find the perimeter of triangle ABC.",
      distractors: [54, 48, 30],
    },
    {
      firstSide: 10, secondSide: 15, secondSides: [15, 20, 25] as const, target: 40,
      stem: "ABC ∼ PQR with AB corresponding to PQ. If AB = 10 cm, while PQ = 15 cm, QR = 20 cm and PR = 25 cm, what is the perimeter of ABC?",
      distractors: [60, 45, 35],
    },
    {
      firstSide: 14, secondSide: 21, secondSides: [21, 28, 35] as const, target: 56,
      stem: "Two triangles ABC and PQR are similar, and AB : PQ = 14 : 21. The sides of PQR are 21 cm, 28 cm and 35 cm. Find the perimeter of ABC.",
      distractors: [84, 63, 49],
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
  const optionSet = buildOptions(expected, variant.distractors.map((value, index) => ({
    text: `${value} cm`,
    misconceptionId: ["SIMILARITY_PERIMETER_COPIED", "SIMILARITY_SCALE_INVERTED", "SIMILARITY_PARTIAL_SIDE_SUM"][index],
    rationale: [
      "Copies the reference triangle perimeter without scaling it.",
      "Applies the corresponding-side scale in the wrong direction.",
      "Scales or sums only part of the reference triangle instead of the whole perimeter.",
    ][index],
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
    explanation: buildExplanation(theoremTrace, [
      `First find the perimeter of the reference triangle PQR: ${variant.secondSides.join(" + ")} = ${secondPerimeter} cm.`,
      `Because the triangles are similar, ABC has the same linear scale as the corresponding side pair AB : PQ = ${variant.firstSide} : ${variant.secondSide}.`,
      `Therefore the perimeter of ABC is ${secondPerimeter} × ${variant.firstSide}/${variant.secondSide} = ${variant.target} cm.`,
    ]),
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

void getTheoremDefinition;
