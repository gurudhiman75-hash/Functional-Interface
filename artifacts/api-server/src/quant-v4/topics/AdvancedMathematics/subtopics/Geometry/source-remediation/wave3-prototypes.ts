import {
  angle,
  identifyTriangleCentreFromConcurrency,
  incentreOppositeAngleFromVertexAngle,
  rightTriangleOrthocentreLocation,
  vertexAngleFromIncentreOppositeAngle,
  type GeoDiagramModel,
  type TheoremId,
} from "../../../../../shared/geometry";
import {
  approximate,
  buildExplanation,
  buildOptions,
  finalizeGapWave3Question,
  numericAngleDegrees,
  proveClueMinimality,
  remediationVerifier,
} from "./wave3-utils";
import type { GapWave3PrototypeDefinition, GapWave3Question } from "./wave3-types";

function variantIndex(seed: string, count: number): number {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  return hash % count;
}

function pointDistance(a: Readonly<{ x: number; y: number }>, b: Readonly<{ x: number; y: number }>): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function triangleIncentre(
  A: Readonly<{ x: number; y: number }>,
  B: Readonly<{ x: number; y: number }>,
  C: Readonly<{ x: number; y: number }>,
): Readonly<{ x: number; y: number }> {
  const a = pointDistance(B, C);
  const b = pointDistance(C, A);
  const c = pointDistance(A, B);
  const total = a + b + c;
  return {
    x: (a * A.x + b * B.x + c * C.x) / total,
    y: (a * A.y + b * B.y + c * C.y) / total,
  };
}

function incentreIdentificationDiagram(): GeoDiagramModel {
  const A = { x: 42, y: 158 };
  const B = { x: 188, y: 148 };
  const C = { x: 78, y: 28 };
  const I = triangleIncentre(A, B, C);
  return {
    points: [
      { id: "A", label: "A", ...A, labelPosition: "SW" },
      { id: "B", label: "B", ...B, labelPosition: "SE" },
      { id: "C", label: "C", ...C, labelPosition: "N" },
      { id: "I", label: "I", ...I, labelPosition: "E" },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "CA", fromPointId: "C", toPointId: "A" },
      { id: "AI", fromPointId: "A", toPointId: "I", style: "CONSTRUCTION" },
      { id: "BI", fromPointId: "B", toPointId: "I", style: "CONSTRUCTION" },
      { id: "CI", fromPointId: "C", toPointId: "I", style: "CONSTRUCTION" },
    ],
    circles: [], angleMarks: [], rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [],
    disclosure: "STEM", notToScale: true,
  };
}

function rightTriangleOrthocentreDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 48, y: 156, labelPosition: "SW" },
      { id: "B", label: "B", x: 190, y: 156, labelPosition: "SE" },
      { id: "C", label: "C", x: 48, y: 36, labelPosition: "NW" },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "AC", fromPointId: "A", toPointId: "C" },
      { id: "BC", fromPointId: "B", toPointId: "C" },
    ],
    circles: [], angleMarks: [],
    rightAngleMarks: [{ id: "right-at-a", vertexPointId: "A", firstRayPointId: "B", secondRayPointId: "C" }],
    equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function incentreAngleDiagram(vertexAngle: number, mode: "DIRECT" | "INVERSE"): GeoDiagramModel {
  const A = { x: 48, y: 156 };
  const B = { x: 196, y: 156 };
  const lengthAC = 132;
  const radians = vertexAngle * Math.PI / 180;
  const C = { x: A.x + Math.cos(radians) * lengthAC, y: A.y - Math.sin(radians) * lengthAC };
  const I = triangleIncentre(A, B, C);
  const incentreAngle = 90 + vertexAngle / 2;
  return {
    points: [
      { id: "A", label: "A", ...A, labelPosition: "SW" },
      { id: "B", label: "B", ...B, labelPosition: "SE" },
      { id: "C", label: "C", ...C, labelPosition: "N" },
      { id: "I", label: "I", ...I, labelPosition: "E" },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "AC", fromPointId: "A", toPointId: "C" },
      { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "BI", fromPointId: "B", toPointId: "I", style: "CONSTRUCTION" },
      { id: "CI", fromPointId: "C", toPointId: "I", style: "CONSTRUCTION" },
    ],
    circles: [],
    angleMarks: [
      {
        id: "vertex-angle",
        firstPointId: "B",
        vertexPointId: "A",
        secondPointId: "C",
        label: mode === "DIRECT" ? `${vertexAngle}°` : "x",
        radius: 18,
        labelRadius: 37,
      },
      {
        id: "incentre-angle",
        firstPointId: "B",
        vertexPointId: "I",
        secondPointId: "C",
        label: mode === "DIRECT" ? "x" : `${incentreAngle}°`,
        radius: 16,
        labelRadius: 34,
      },
    ],
    rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [],
    disclosure: "STEM", notToScale: true,
  };
}

function generateIncentreIdentification(seed: string): GapWave3Question {
  const stems = [
    "In triangle ABC, the three internal angle bisectors meet at I. Which centre of the triangle is I?",
    "The internal bisectors of ∠A, ∠B and ∠C of triangle ABC are concurrent at I. Identify I.",
    "Point I is the common point of the three internal angle bisectors of a triangle. What is this point called?",
  ] as const;
  const clueIds = ["ABC_IS_TRIANGLE", "I_IS_CONCURRENCY_OF_INTERNAL_ANGLE_BISECTORS"] as const;
  const expected = "Incentre";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return identifyTriangleCentreFromConcurrency("ANGLE_BISECTORS");
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Incentre identification mismatch");

  const model = incentreIdentificationDiagram();
  const p = (id: string) => {
    const point = model.points.find((candidate) => candidate.id === id);
    if (!point) throw new Error(`Missing incentre diagram point ${id}`);
    return point;
  };
  const passed = approximate(numericAngleDegrees(p("B"), p("A"), p("I")), numericAngleDegrees(p("I"), p("A"), p("C")), 1e-6)
    && approximate(numericAngleDegrees(p("A"), p("B"), p("I")), numericAngleDegrees(p("I"), p("B"), p("C")), 1e-6)
    && approximate(numericAngleDegrees(p("A"), p("C"), p("I")), numericAngleDegrees(p("I"), p("C"), p("B")), 1e-6);
  const theoremTrace: TheoremId[] = ["TRIANGLE_CENTRE_ANGLE_BISECTORS_INCENTRE"];
  const optionSet = buildOptions(expected, [
    { text: "Circumcentre", misconceptionId: "CENTRE_CONFUSED_WITH_PERPENDICULAR_BISECTORS", rationale: "The circumcentre is formed by perpendicular bisectors of the sides." },
    { text: "Centroid", misconceptionId: "CENTRE_CONFUSED_WITH_MEDIANS", rationale: "The centroid is formed by the medians." },
    { text: "Orthocentre", misconceptionId: "CENTRE_CONFUSED_WITH_ALTITUDES", rationale: "The orthocentre is formed by the altitudes." },
  ], seed);
  return finalizeGapWave3Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W3-CP006-INCENTRE-IDENTIFY-V1",
    sourceGapId: "GEO-CP-006/CENTRE_IDENTIFICATION",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-INCENTRE-IDENTIFICATION-PYQ-2017"],
    solveMode: "identifyTriangleCentreFromAngleBisectors",
    difficulty: "Easy", seed, stem: stems[variantIndex(seed, stems.length)], ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "The three internal angle bisectors of a triangle meet at one point called the incentre.",
      "So the point I is the incentre of triangle ABC.",
    ]),
    theoremTrace, proofEvents: [], displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: remediationVerifier("HIGH_PRECISION_COORDINATE", passed, [
      "AI, BI and CI meet at one displayed point I",
      "each displayed construction ray independently bisects its corresponding vertex angle",
    ]),
    diagramDisposition: "REQUIRED_STEM_DIAGRAM", diagramModel: model,
  });
}

function generateRightTriangleOrthocentre(seed: string): GapWave3Question {
  const stems = [
    "Triangle ABC is right-angled at A. Where is its orthocentre located?",
    "If ∠A = 90° in triangle ABC, which point is the orthocentre of the triangle?",
    "ABC is a right triangle with the right angle at A. The three altitudes meet at which location?",
  ] as const;
  const clueIds = ["ABC_IS_TRIANGLE", "ANGLE_A_IS_90", "TARGET_ORTHOCENTRE_LOCATION"] as const;
  const expected = "At A, the right-angled vertex";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return rightTriangleOrthocentreLocation() === "RIGHT_ANGLED_VERTEX" ? expected : null;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Right-triangle orthocentre mismatch");

  const model = rightTriangleOrthocentreDiagram();
  const p = (id: string) => {
    const point = model.points.find((candidate) => candidate.id === id);
    if (!point) throw new Error(`Missing orthocentre diagram point ${id}`);
    return point;
  };
  const passed = approximate(numericAngleDegrees(p("B"), p("A"), p("C")), 90)
    && approximate((p("B").x - p("A").x) * (p("C").x - p("A").x) + (p("B").y - p("A").y) * (p("C").y - p("A").y), 0);
  const theoremTrace: TheoremId[] = ["TRIANGLE_CENTRE_ALTITUDES_ORTHOCENTRE", "TRIANGLE_CENTRE_RIGHT_TRIANGLE_ORTHOCENTRE_VERTEX"];
  const optionSet = buildOptions(expected, [
    { text: "At the midpoint of BC", misconceptionId: "ORTHOCENTRE_CONFUSED_WITH_RIGHT_TRIANGLE_CIRCUMCENTRE", rationale: "The midpoint of the hypotenuse is the circumcentre, not the orthocentre." },
    { text: "At the centroid", misconceptionId: "ORTHOCENTRE_CONFUSED_WITH_CENTROID", rationale: "The centroid is where the medians meet." },
    { text: "Outside the triangle", misconceptionId: "ORTHOCENTRE_LOCATION_OBTUSE_RULE_MISAPPLIED", rationale: "Outside placement applies to an obtuse triangle, not a right triangle." },
  ], seed);
  return finalizeGapWave3Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W3-CP006-RIGHT-TRIANGLE-ORTHOCENTRE-V1",
    sourceGapId: "GEO-CP-006/CENTRE_IDENTIFICATION_ORTHOCENTRE_RIGHT_TRIANGLE",
    sourceEvidenceIds: ["SRC-TESTBOOK-CPO-RIGHT-TRIANGLE-ORTHOCENTRE-PYQ-2025"],
    solveMode: "locateOrthocentreOfRightTriangle",
    difficulty: "Easy", seed, stem: stems[variantIndex(seed, stems.length)], ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "In a right triangle, the two perpendicular sides themselves act as two altitudes.",
      "Those altitudes already meet at the right-angled vertex, so the orthocentre is at A.",
    ]),
    theoremTrace, proofEvents: [], displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: remediationVerifier("HIGH_PRECISION_COORDINATE", passed, [
      "the displayed angle at A is exactly 90 degrees",
      "AB and AC are perpendicular and therefore serve as two altitudes meeting at A",
    ]),
    diagramDisposition: "REQUIRED_STEM_DIAGRAM", diagramModel: model,
  });
}

function generateIncentreAngleDirect(seed: string): GapWave3Question {
  const variants = [
    { a: 60, target: 120 },
    { a: 68, target: 124 },
    { a: 80, target: 130 },
  ] as const;
  const variant = variants[variantIndex(seed, variants.length)];
  const clueIds = ["I_IS_INCENTRE", "ANGLE_A_GIVEN", "TARGET_ANGLE_BIC"] as const;
  const expected = `${variant.target}°`;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const result = incentreOppositeAngleFromVertexAngle(angle(variant.a));
    return `${Number(result.numerator) / Number(result.denominator)}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Direct incentre-angle mismatch");

  const model = incentreAngleDiagram(variant.a, "DIRECT");
  const p = (id: string) => {
    const point = model.points.find((candidate) => candidate.id === id);
    if (!point) throw new Error(`Missing direct incentre-angle point ${id}`);
    return point;
  };
  const passed = approximate(numericAngleDegrees(p("B"), p("A"), p("C")), variant.a, 1e-6)
    && approximate(numericAngleDegrees(p("B"), p("I"), p("C")), variant.target, 1e-6);
  const theoremTrace: TheoremId[] = ["TRIANGLE_CENTRE_INCENTRE_OPPOSITE_ANGLE"];
  const optionSet = buildOptions(expected, [
    { text: `${90 + variant.a}°`, misconceptionId: "INCENTRE_ANGLE_ADDS_FULL_VERTEX", rationale: "Adds the full vertex angle instead of half of it." },
    { text: `${180 - variant.a}°`, misconceptionId: "INCENTRE_ANGLE_USES_SUPPLEMENT", rationale: "Uses a simple supplement instead of the incentre relation." },
    { text: `${variant.a}°`, misconceptionId: "INCENTRE_ANGLE_COPIES_VERTEX", rationale: "Copies the vertex angle directly to the incentre." },
  ], seed);
  return finalizeGapWave3Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W3-CP006-INCENTRE-ANGLE-DIRECT-V1",
    sourceGapId: "GEO-CP-006/CIRCUMCENTRE_OR_INCENTRE_ANGLE_PROPERTY",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-INCENTRE-ANGLE-DIRECT-PYQ-2021"],
    solveMode: "findIncentreOppositeAngleFromVertexAngle",
    difficulty: "Medium", seed,
    stem: `In triangle ABC, I is the incentre and ∠A = ${variant.a}°. Find ∠BIC.`, ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "Because I is the incentre, BI and CI bisect angles B and C.",
      `The angle between those two bisectors on the side opposite A is 90° plus half of ∠A. Half of ${variant.a}° is ${variant.a / 2}°.` ,
      `Therefore ∠BIC = 90° + ${variant.a / 2}° = ${variant.target}°.` ,
    ]),
    theoremTrace, proofEvents: [], displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: remediationVerifier("HIGH_PRECISION_COORDINATE", passed, [
      "the learner layout independently reproduces the stated vertex angle",
      "I is constructed as the geometric incentre of the displayed triangle",
      "the measured angle BIC matches the exact synthetic target",
    ]),
    diagramDisposition: "REQUIRED_STEM_DIAGRAM", diagramModel: model,
  });
}

function generateIncentreAngleInverse(seed: string): GapWave3Question {
  const variants = [
    { bic: 120, target: 60 },
    { bic: 125, target: 70 },
    { bic: 130, target: 80 },
  ] as const;
  const variant = variants[variantIndex(seed, variants.length)];
  const clueIds = ["I_IS_INCENTRE", "ANGLE_BIC_GIVEN", "TARGET_ANGLE_A"] as const;
  const expected = `${variant.target}°`;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const result = vertexAngleFromIncentreOppositeAngle(angle(variant.bic));
    return `${Number(result.numerator) / Number(result.denominator)}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Inverse incentre-angle mismatch");

  const model = incentreAngleDiagram(variant.target, "INVERSE");
  const p = (id: string) => {
    const point = model.points.find((candidate) => candidate.id === id);
    if (!point) throw new Error(`Missing inverse incentre-angle point ${id}`);
    return point;
  };
  const passed = approximate(numericAngleDegrees(p("B"), p("I"), p("C")), variant.bic, 1e-6)
    && approximate(numericAngleDegrees(p("B"), p("A"), p("C")), variant.target, 1e-6);
  const theoremTrace: TheoremId[] = ["TRIANGLE_CENTRE_INCENTRE_OPPOSITE_ANGLE"];
  const optionSet = buildOptions(expected, [
    { text: `${variant.bic - 90}°`, misconceptionId: "INCENTRE_INVERSE_FORGETS_DOUBLE", rationale: "Subtracts 90 degrees but forgets to double the remainder." },
    { text: `${180 - variant.bic}°`, misconceptionId: "INCENTRE_INVERSE_USES_SUPPLEMENT", rationale: "Uses the supplement of the incentre angle." },
    { text: `${variant.bic / 2}°`, misconceptionId: "INCENTRE_INVERSE_HALVES_GIVEN", rationale: "Halves the given incentre angle directly." },
  ], seed);
  return finalizeGapWave3Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W3-CP006-INCENTRE-ANGLE-INVERSE-V1",
    sourceGapId: "GEO-CP-006/CIRCUMCENTRE_OR_INCENTRE_ANGLE_PROPERTY_INVERSE",
    sourceEvidenceIds: ["SRC-TESTBOOK-CHSL-INCENTRE-ANGLE-INVERSE-PYQ-2018"],
    solveMode: "recoverVertexAngleFromIncentreOppositeAngle",
    difficulty: "Medium", seed,
    stem: `In triangle ABC, I is the incentre and ∠BIC = ${variant.bic}°. Find ∠A.`, ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "For an incentre, ∠BIC is 90° plus half of the opposite vertex angle A.",
      `So half of ∠A is ${variant.bic}° − 90° = ${variant.bic - 90}°.` ,
      `Doubling that gives ∠A = ${variant.target}°.` ,
    ]),
    theoremTrace, proofEvents: [], displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: remediationVerifier("HIGH_PRECISION_COORDINATE", passed, [
      "I is independently constructed as the geometric incentre",
      "the learner layout reproduces the stated angle BIC",
      "the recovered vertex angle agrees with the exact inverse relation",
    ]),
    diagramDisposition: "REQUIRED_STEM_DIAGRAM", diagramModel: model,
  });
}

export const GEO_GAP_REMEDIATION_WAVE3_PROTOTYPES: readonly GapWave3PrototypeDefinition[] = Object.freeze([
  Object.freeze({
    temporaryPrototypeId: "GEO-TMP-GAP-W3-CP006-INCENTRE-IDENTIFY-V1",
    cpId: "GEO-CP-006",
    sourceGapId: "GEO-CP-006/CENTRE_IDENTIFICATION",
    solveMode: "identifyTriangleCentreFromAngleBisectors",
    generate: generateIncentreIdentification,
  }),
  Object.freeze({
    temporaryPrototypeId: "GEO-TMP-GAP-W3-CP006-RIGHT-TRIANGLE-ORTHOCENTRE-V1",
    cpId: "GEO-CP-006",
    sourceGapId: "GEO-CP-006/CENTRE_IDENTIFICATION_ORTHOCENTRE_RIGHT_TRIANGLE",
    solveMode: "locateOrthocentreOfRightTriangle",
    generate: generateRightTriangleOrthocentre,
  }),
  Object.freeze({
    temporaryPrototypeId: "GEO-TMP-GAP-W3-CP006-INCENTRE-ANGLE-DIRECT-V1",
    cpId: "GEO-CP-006",
    sourceGapId: "GEO-CP-006/CIRCUMCENTRE_OR_INCENTRE_ANGLE_PROPERTY",
    solveMode: "findIncentreOppositeAngleFromVertexAngle",
    generate: generateIncentreAngleDirect,
  }),
  Object.freeze({
    temporaryPrototypeId: "GEO-TMP-GAP-W3-CP006-INCENTRE-ANGLE-INVERSE-V1",
    cpId: "GEO-CP-006",
    sourceGapId: "GEO-CP-006/CIRCUMCENTRE_OR_INCENTRE_ANGLE_PROPERTY_INVERSE",
    solveMode: "recoverVertexAngleFromIncentreOppositeAngle",
    generate: generateIncentreAngleInverse,
  }),
]);
