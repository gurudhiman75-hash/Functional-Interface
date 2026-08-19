import {
  add,
  commonTangentSimilarityRadiusFromOuterTangent,
  directCommonTangentLength,
  externallyTangentCentreDistance,
  multiply,
  rational,
  subtract,
  type GeoDiagramModel,
  type Rational,
  type TheoremId,
} from "../../../../../shared/geometry";
import {
  approximate,
  buildExplanation,
  buildOptions,
  finalizeGapWave2Question,
  numericAngleDegrees,
  proveClueMinimality,
  remediationVerifier,
} from "./wave2-utils";
import type { GapWave2PrototypeDefinition, GapWave2Question } from "./wave2-types";

const q = (value: number, denominator = 1) => rational(value, denominator);

function variantIndex(seed: string, count: number): number {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  return hash % count;
}

function formatRational(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  const decimal = Number(value.numerator) / Number(value.denominator);
  return decimal.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

function pointDistance(a: Readonly<{ x: number; y: number }>, b: Readonly<{ x: number; y: number }>): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function dotAtVertex(
  first: Readonly<{ x: number; y: number }>,
  vertex: Readonly<{ x: number; y: number }>,
  second: Readonly<{ x: number; y: number }>,
): number {
  return (first.x - vertex.x) * (second.x - vertex.x) + (first.y - vertex.y) * (second.y - vertex.y);
}

function directCommonTangentDiagram(): GeoDiagramModel {
  const contactX = { x: 119.84615384615384, y: 63.230769230769226 };
  return {
    points: [
      { id: "O1", label: "O1", x: 70, y: 84, labelPosition: "SW" },
      { id: "O2", label: "O2", x: 142, y: 54, labelPosition: "SE" },
      { id: "A", label: "A", x: 70, y: 30, labelPosition: "NW" },
      { id: "B", label: "B", x: 142, y: 30, labelPosition: "NE" },
      { id: "X", label: "X", x: contactX.x, y: contactX.y, labelPosition: "S" },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "O1A", fromPointId: "O1", toPointId: "A", style: "CONSTRUCTION" },
      { id: "O2B", fromPointId: "O2", toPointId: "B", style: "CONSTRUCTION" },
      { id: "O1O2", fromPointId: "O1", toPointId: "O2", style: "CONSTRUCTION" },
    ],
    circles: [
      { id: "large-circle", centerPointId: "O1", radius: 54 },
      { id: "small-circle", centerPointId: "O2", radius: 24 },
    ],
    angleMarks: [],
    rightAngleMarks: [],
    equalLengthMarks: [],
    parallelMarks: [],
    arcs: [],
    labels: [],
    disclosure: "STEM",
    notToScale: true,
  };
}

function commonTangentSimilarityDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "P", label: "P", x: 20, y: 170, labelPosition: "SW" },
      { id: "N", label: "N", x: 57.5, y: 170, labelPosition: "S" },
      { id: "M", label: "M", x: 170, y: 170, labelPosition: "SE" },
      { id: "D", label: "D", x: 44, y: 152, labelPosition: "NW" },
      { id: "C", label: "C", x: 116, y: 98, labelPosition: "N" },
      { id: "X", label: "X", x: 80, y: 170, labelPosition: "N" },
    ],
    segments: [
      { id: "PC", fromPointId: "P", toPointId: "C", extent: "RAY", extension: 36 },
      { id: "PM", fromPointId: "P", toPointId: "M", style: "CONSTRUCTION" },
      { id: "ND", fromPointId: "N", toPointId: "D", style: "CONSTRUCTION" },
      { id: "MC", fromPointId: "M", toPointId: "C", style: "CONSTRUCTION" },
    ],
    circles: [
      { id: "small-circle", centerPointId: "N", radius: 22.5 },
      { id: "large-circle", centerPointId: "M", radius: 90 },
    ],
    angleMarks: [],
    rightAngleMarks: [],
    equalLengthMarks: [],
    parallelMarks: [],
    arcs: [],
    labels: [],
    disclosure: "STEM",
    notToScale: true,
  };
}

function tangentInscribedDiagram(angleBetweenTangents: number): GeoDiagramModel {
  const O = { x: 100, y: 110 };
  const radius = 70;
  const halfCentral = (180 - angleBetweenTangents) / 2;
  const theta = halfCentral * Math.PI / 180;
  const cosine = Math.cos(theta);
  const sine = Math.sin(theta);
  const A = { x: O.x + radius * cosine, y: O.y - radius * sine };
  const B = { x: O.x + radius * cosine, y: O.y + radius * sine };
  const P = { x: O.x + radius / cosine, y: O.y };
  const C = { x: O.x - radius, y: O.y };
  return {
    points: [
      { id: "O", label: "O", ...O, labelPosition: "SW" },
      { id: "A", label: "A", ...A, labelPosition: "NE" },
      { id: "B", label: "B", ...B, labelPosition: "SE" },
      { id: "P", label: "P", ...P, labelPosition: "E" },
      { id: "C", label: "C", ...C, labelPosition: "W" },
    ],
    segments: [
      { id: "PA", fromPointId: "P", toPointId: "A" },
      { id: "PB", fromPointId: "P", toPointId: "B" },
      { id: "OA", fromPointId: "O", toPointId: "A", style: "CONSTRUCTION" },
      { id: "OB", fromPointId: "O", toPointId: "B", style: "CONSTRUCTION" },
      { id: "CA", fromPointId: "C", toPointId: "A" },
      { id: "CB", fromPointId: "C", toPointId: "B" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius }],
    angleMarks: [
      { id: "given-tangent-angle", firstPointId: "A", vertexPointId: "P", secondPointId: "B", label: `${angleBetweenTangents}°`, radius: 20, labelRadius: 40 },
      { id: "target-inscribed-angle", firstPointId: "A", vertexPointId: "C", secondPointId: "B", label: "x", radius: 20, labelRadius: 36 },
    ],
    rightAngleMarks: [],
    equalLengthMarks: [],
    parallelMarks: [],
    arcs: [],
    labels: [],
    disclosure: "STEM",
    notToScale: true,
  };
}

function generateDirectCommonTangent(seed: string): GapWave2Question {
  const variants = [
    { r1: 9, r2: 4, answer: 12, stem: "Two circles of radii 9 cm and 4 cm touch externally. AB is a direct common tangent, touching them at A and B. Find AB." },
    { r1: 16, r2: 9, answer: 24, stem: "The radii of two externally touching circles are 16 cm and 9 cm. A direct common tangent meets them at A and B. What is the length of AB?" },
    { r1: 25, r2: 4, answer: 20, stem: "Two circles touch each other externally and have radii 25 cm and 4 cm. Their direct common tangent touches at A and B. Calculate AB." },
  ] as const;
  const variant = variants[variantIndex(seed, variants.length)];
  const clueIds = ["CIRCLES_TOUCH_EXTERNALLY", "RADII_GIVEN", "AB_DIRECT_COMMON_TANGENT"] as const;
  const expected = `${variant.answer} cm`;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const r1 = q(variant.r1);
    const r2 = q(variant.r2);
    const d = externallyTangentCentreDistance(r1, r2);
    const length = directCommonTangentLength(d, r1, r2);
    return `${formatRational(length)} cm`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Direct common tangent solver mismatch");

  const model = directCommonTangentDiagram();
  const p = (id: string) => {
    const point = model.points.find((candidate) => candidate.id === id);
    if (!point) throw new Error(`Missing direct-common-tangent diagram point ${id}`);
    return point;
  };
  const visualPassed = approximate(pointDistance(p("O1"), p("O2")), 78)
    && approximate(pointDistance(p("O1"), p("A")), 54)
    && approximate(pointDistance(p("O2"), p("B")), 24)
    && approximate(pointDistance(p("O1"), p("X")), 54)
    && approximate(pointDistance(p("O2"), p("X")), 24)
    && approximate(dotAtVertex(p("O1"), p("A"), p("B")), 0)
    && approximate(dotAtVertex(p("O2"), p("B"), p("A")), 0);

  const theoremTrace: TheoremId[] = ["RADIUS_PERPENDICULAR_TANGENT", "PYTHAGORAS"];
  const wrong = [`${Math.abs(variant.r1 - variant.r2)} cm`, `${variant.r1 + variant.r2} cm`, `${2 * Math.abs(variant.r1 - variant.r2)} cm`];
  const optionSet = buildOptions(expected, [
    { text: wrong[0], misconceptionId: "COMMON_TANGENT_USES_RADIUS_DIFFERENCE_ONLY", rationale: "Uses the difference of radii as the tangent length." },
    { text: wrong[1], misconceptionId: "COMMON_TANGENT_USES_CENTRE_DISTANCE", rationale: "Uses the centre distance of externally touching circles directly." },
    { text: wrong[2], misconceptionId: "COMMON_TANGENT_DOUBLES_RADIUS_DIFFERENCE", rationale: "Doubles the perpendicular offset instead of applying the right-triangle relation." },
  ], seed);

  return finalizeGapWave2Question({
    cpId: "GEO-CP-012",
    temporaryPrototypeId: "GEO-TMP-GAP-W2-CP012-DIRECT-COMMON-TANGENT-V1",
    sourceGapId: "GEO-CP-012/COMMON_TANGENT_TWO_CIRCLES",
    sourceEvidenceIds: ["SRC-OLIVEBOARD-CGL-DIRECT-COMMON-TANGENT-PYQ-2024"],
    solveMode: "findDirectCommonTangentOfExternallyTouchingCircles",
    difficulty: "Medium",
    seed,
    stem: variant.stem,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      `Because the circles touch externally, the distance between their centres is ${variant.r1 + variant.r2} cm.`,
      `For a direct common tangent, the perpendicular offset between the two radii is ${Math.abs(variant.r1 - variant.r2)} cm.`,
      `Using the right triangle formed by the line of centres, that offset and AB gives AB = ${variant.answer} cm.`,
    ]),
    theoremTrace,
    proofEvents: [],
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: remediationVerifier("HIGH_PRECISION_COORDINATE", visualPassed, [
      "the two drawn circles touch at the named contact point X",
      "A and B lie on one exact common tangent line",
      "the displayed radius directions are perpendicular to the common tangent",
    ]),
    diagramDisposition: "REQUIRED_STEM_DIAGRAM",
    diagramModel: model,
  });
}

function generateCommonTangentSimilarity(seed: string): GapWave2Question {
  const variants = [
    { largeRadius: 15, tangent: 20, answer: q(15, 4), stem: "Two circles touch externally. A common tangent from P touches the smaller circle at D and the larger circle at C. Their centres N and M lie on PM, with N between P and M. If the larger radius is 15 cm and PC = 20 cm, find the smaller radius." },
    { largeRadius: 12, tangent: 16, answer: q(3), stem: "Two externally touching circles have centres N and M on the same line from an external point P. The same tangent from P touches the smaller circle at D and the larger at C. The larger radius is 12 cm and PC = 16 cm. Find the smaller radius." },
    { largeRadius: 21, tangent: 28, answer: q(21, 4), stem: "A common tangent from P touches two externally touching circles at D and C. The centres N and M are collinear with P, N lying between P and M. The larger circle has radius 21 cm and PC = 28 cm. What is the radius of the smaller circle?" },
  ] as const;
  const variant = variants[variantIndex(seed, variants.length)];
  const clueIds = ["CIRCLES_TOUCH_EXTERNALLY", "P_N_M_COLLINEAR", "PC_COMMON_TANGENT", "LARGE_RADIUS_GIVEN", "PC_LENGTH_GIVEN"] as const;
  const expected = `${formatRational(variant.answer)} cm`;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const radius = commonTangentSimilarityRadiusFromOuterTangent(q(variant.largeRadius), q(variant.tangent));
    return `${formatRational(radius)} cm`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Common-tangent similarity solver mismatch");

  const R = variant.largeRadius;
  const t = variant.tangent;
  const PM = Math.hypot(R, t);
  const r = Number(variant.answer.numerator) / Number(variant.answer.denominator);
  const PN = PM * r / R;
  const ux = t / PM;
  const uy = -R / PM;
  const C = { x: t * ux, y: t * uy };
  const projectionN = PN * ux;
  const D = { x: projectionN * ux, y: projectionN * uy };
  const N = { x: PN, y: 0 };
  const M = { x: PM, y: 0 };
  const P = { x: 0, y: 0 };
  const verifierPassed = approximate(pointDistance(P, C), t)
    && approximate(pointDistance(M, C), R)
    && approximate(pointDistance(N, D), r)
    && approximate(dotAtVertex(M, C, P), 0)
    && approximate(dotAtVertex(N, D, P), 0)
    && approximate(pointDistance(N, M), R + r)
    && approximate(numericAngleDegrees(D, P, N), numericAngleDegrees(C, P, M));

  const theoremTrace: TheoremId[] = ["RADIUS_PERPENDICULAR_TANGENT", "AA_SIMILARITY", "PYTHAGORAS"];
  const wrongValues = [R / 3, R / 2, R / 6].map((value) => `${Number(value.toFixed(4))} cm`);
  const optionSet = buildOptions(expected, [
    { text: wrongValues[0], misconceptionId: "COMMON_TANGENT_SIMILARITY_WRONG_SCALE_RATIO", rationale: "Uses a guessed one-third scale instead of the similar tangent triangles." },
    { text: wrongValues[1], misconceptionId: "COMMON_TANGENT_SIMILARITY_HALVES_RADIUS", rationale: "Assumes the smaller radius is simply half the larger radius." },
    { text: wrongValues[2], misconceptionId: "COMMON_TANGENT_SIMILARITY_OVERREDUCES", rationale: "Uses an unsupported smaller scale after finding the large tangent triangle." },
  ], seed);

  return finalizeGapWave2Question({
    cpId: "GEO-CP-014",
    temporaryPrototypeId: "GEO-TMP-GAP-W2-CP014-COMMON-TANGENT-SIMILARITY-V1",
    sourceGapId: "GEO-CP-014/COMMON_TANGENT_PLUS_SIMILARITY_SYNTHESIS",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-COMMON-TANGENT-SIMILARITY-PYQ-2018"],
    solveMode: "recoverSmallerRadiusFromCommonTangentSimilarity",
    difficulty: "Medium",
    seed,
    stem: variant.stem,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      `The radius to C is perpendicular to the tangent, so the larger tangent triangle gives PM = ${formatRational(q(Math.round(PM)))} cm.`,
      "The small and large tangent triangles are similar because each has a right angle and they share the angle at P.",
      `Using that similarity together with the fact that the circles touch externally gives the smaller radius as ${formatRational(variant.answer)} cm.`,
    ]),
    theoremTrace,
    proofEvents: [],
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: remediationVerifier("HIGH_PRECISION_COORDINATE", verifierPassed, [
      "the large tangent triangle independently reconstructs the given tangent length",
      "both radius-to-tangent contacts are perpendicular",
      "the recovered circles satisfy external tangency and the tangent triangles have the same angle at P",
    ]),
    diagramDisposition: "REQUIRED_STEM_DIAGRAM",
    diagramModel: commonTangentSimilarityDiagram(),
  });
}

function generateTangentInscribedSynthesis(seed: string): GapWave2Question {
  const variants = [
    { tangentAngle: 40, answer: 70, stem: "Tangents PA and PB touch a circle at A and B. Point C lies on the major arc AB. If ∠APB = 40°, find ∠ACB." },
    { tangentAngle: 60, answer: 60, stem: "From an external point P, PA and PB are tangents to a circle at A and B. C is on the major arc AB. The angle between the tangents is 60°. Find ∠ACB." },
    { tangentAngle: 80, answer: 50, stem: "PA and PB are tangents from P to a circle, touching at A and B. A point C is taken on the major arc AB. If ∠APB is 80°, what is ∠ACB?" },
  ] as const;
  const variant = variants[variantIndex(seed, variants.length)];
  const clueIds = ["PA_PB_TANGENTS", "C_ON_MAJOR_ARC_AB", "ANGLE_APB_GIVEN"] as const;
  const expected = `${variant.answer}°`;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const central = 180 - variant.tangentAngle;
    return `${central / 2}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Tangent-inscribed synthesis solver mismatch");

  const model = tangentInscribedDiagram(variant.tangentAngle);
  const p = (id: string) => {
    const point = model.points.find((candidate) => candidate.id === id);
    if (!point) throw new Error(`Missing tangent-inscribed diagram point ${id}`);
    return point;
  };
  const verifierPassed = approximate(pointDistance(p("O"), p("A")), 70)
    && approximate(pointDistance(p("O"), p("B")), 70)
    && approximate(pointDistance(p("O"), p("C")), 70)
    && approximate(dotAtVertex(p("O"), p("A"), p("P")), 0, 1e-6)
    && approximate(dotAtVertex(p("O"), p("B"), p("P")), 0, 1e-6)
    && approximate(numericAngleDegrees(p("A"), p("P"), p("B")), variant.tangentAngle, 1e-7)
    && approximate(numericAngleDegrees(p("A"), p("C"), p("B")), variant.answer, 1e-7);

  const theoremTrace: TheoremId[] = ["RADIUS_PERPENDICULAR_TANGENT", "POLYGON_INTERIOR_SUM", "CENTRAL_ANGLE_DOUBLE_INSCRIBED"];
  const candidateDistractors = [
    variant.tangentAngle,
    180 - variant.tangentAngle,
    variant.tangentAngle / 2,
    90,
    90 - variant.tangentAngle / 2,
    180 - variant.answer,
  ].filter((value, index, all) => Number.isInteger(value) && value > 0 && value < 180 && value !== variant.answer && all.indexOf(value) === index).slice(0, 3);
  if (candidateDistractors.length !== 3) throw new Error("Insufficient unique tangent-inscribed distractors");
  const optionSet = buildOptions(expected, [
    { text: `${candidateDistractors[0]}°`, misconceptionId: "TANGENT_SYNTHESIS_COPIES_GIVEN_ANGLE", rationale: "Carries the angle between tangents directly to the circumference." },
    { text: `${candidateDistractors[1]}°`, misconceptionId: "TANGENT_SYNTHESIS_STOPS_AT_CENTRAL_ANGLE", rationale: "Finds a related central/exterior angle but does not complete the inscribed-angle step." },
    { text: `${candidateDistractors[2]}°`, misconceptionId: "TANGENT_SYNTHESIS_HALVES_WRONG_ANGLE", rationale: "Halves the wrong angle in the chain." },
  ], seed);

  return finalizeGapWave2Question({
    cpId: "GEO-CP-014",
    temporaryPrototypeId: "GEO-TMP-GAP-W2-CP014-TANGENT-CENTRAL-INSCRIBED-V1",
    sourceGapId: "GEO-CP-014/CENTRAL_OR_INSCRIBED_PLUS_TANGENT_SYNTHESIS",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-TANGENT-INSCRIBED-SYNTHESIS-PYQ-2025"],
    solveMode: "tangentAngleToCentralToInscribedAngle",
    difficulty: "Medium",
    seed,
    stem: variant.stem,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "The radii to A and B are perpendicular to the tangents, so the central angle ∠AOB and ∠APB are supplementary.",
      `Thus ∠AOB = 180° − ${variant.tangentAngle}° = ${180 - variant.tangentAngle}°.`,
      `An angle at the circumference subtended by chord AB is half the central angle on the same chord, so ∠ACB = ${variant.answer}°.`,
    ]),
    theoremTrace,
    proofEvents: [],
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: remediationVerifier("HIGH_PRECISION_COORDINATE", verifierPassed, [
      "A, B and C lie on the same drawn circle",
      "PA and PB are independently perpendicular to the corresponding radii at A and B",
      "the exact coordinate construction reproduces both the stated tangent angle and the target inscribed angle",
    ]),
    diagramDisposition: "REQUIRED_STEM_DIAGRAM",
    diagramModel: model,
  });
}

export const GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES: readonly GapWave2PrototypeDefinition[] = Object.freeze([
  Object.freeze({
    temporaryPrototypeId: "GEO-TMP-GAP-W2-CP012-DIRECT-COMMON-TANGENT-V1",
    cpId: "GEO-CP-012",
    sourceGapId: "GEO-CP-012/COMMON_TANGENT_TWO_CIRCLES",
    solveMode: "findDirectCommonTangentOfExternallyTouchingCircles",
    generate: generateDirectCommonTangent,
  }),
  Object.freeze({
    temporaryPrototypeId: "GEO-TMP-GAP-W2-CP014-COMMON-TANGENT-SIMILARITY-V1",
    cpId: "GEO-CP-014",
    sourceGapId: "GEO-CP-014/COMMON_TANGENT_PLUS_SIMILARITY_SYNTHESIS",
    solveMode: "recoverSmallerRadiusFromCommonTangentSimilarity",
    generate: generateCommonTangentSimilarity,
  }),
  Object.freeze({
    temporaryPrototypeId: "GEO-TMP-GAP-W2-CP014-TANGENT-CENTRAL-INSCRIBED-V1",
    cpId: "GEO-CP-014",
    sourceGapId: "GEO-CP-014/CENTRAL_OR_INSCRIBED_PLUS_TANGENT_SYNTHESIS",
    solveMode: "tangentAngleToCentralToInscribedAngle",
    generate: generateTangentInscribedSynthesis,
  }),
]);
