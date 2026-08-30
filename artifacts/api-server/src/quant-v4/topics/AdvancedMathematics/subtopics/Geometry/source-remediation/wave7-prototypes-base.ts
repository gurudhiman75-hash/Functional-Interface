import {
  angle,
  angleInSemicircle,
  centreLineThroughChordMidpointAngle,
  equalCentralAngleFromEqualChord,
  equalCentreDistanceFromEqualChord,
  inscribedAngleFromCentral,
  rational,
  sameSegmentAngleFromSameChord,
  toNumber,
  type GeoDiagramModel,
  type TheoremId,
} from "../../../../../shared/geometry";
import {
  buildExplanation,
  buildOptions,
  finalizeGapWave7Question,
  proveClueMinimality,
  wave7Verifier,
} from "./wave7-utils";
import type { GapWave7PrototypeDefinition, GapWave7Question } from "./wave7-types";

const CX = 130;
const CY = 110;
const RADIUS = 82;

function variantIndex(seed: string, count: number): number {
  const final = seed.at(-1)?.toLowerCase();
  if (final && final >= "a" && final <= "z") return (final.charCodeAt(0) - 97) % count;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash % count;
}

function circlePoint(id: string, label: string, degrees: number, radius = RADIUS, cx = CX, cy = CY) {
  const radians = degrees * Math.PI / 180;
  return { id, label, x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}

function angleText(value: number): string { return `${value}°`; }
function lengthText(value: number): string { return `${value} cm`; }

function minimality(clues: readonly string[], expected: string) {
  const solve = (active: ReadonlySet<string>) => clues.every((clue) => active.has(clue)) ? expected : null;
  return proveClueMinimality(clues, solve, expected);
}

function equalChordCentralDiagram(value: number, solution: boolean): GeoDiagramModel {
  const A = circlePoint("A", "A", 198);
  const B = circlePoint("B", "B", 198 + value);
  const C = circlePoint("C", "C", 18);
  const D = circlePoint("D", "D", 18 + value);
  return {
    points: [{ id: "O", label: "O", x: CX, y: CY }, A, B, C, D],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" }, { id: "CD", fromPointId: "C", toPointId: "D" },
      { id: "OA", fromPointId: "O", toPointId: "A", style: "CONSTRUCTION" }, { id: "OB", fromPointId: "O", toPointId: "B", style: "CONSTRUCTION" },
      { id: "OC", fromPointId: "O", toPointId: "C", style: "CONSTRUCTION" }, { id: "OD", fromPointId: "O", toPointId: "D", style: "CONSTRUCTION" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: RADIUS }],
    angleMarks: [
      { id: "given-aob", firstPointId: "A", vertexPointId: "O", secondPointId: "B", label: angleText(value), radius: 22, labelRadius: 34 },
      ...(solution ? [{ id: "derived-cod", firstPointId: "C", vertexPointId: "O", secondPointId: "D", label: angleText(value), radius: 30, labelRadius: 44 }] : []),
    ],
    rightAngleMarks: [],
    equalLengthMarks: [{ id: "given-equal-chords", segmentIds: ["AB", "CD"] }],
    parallelMarks: [], arcs: [], labels: [], disclosure: solution ? "SOLUTION" : "STEM", notToScale: true,
  };
}

function generateEqualChordCentral(seed: string): GapWave7Question {
  const values = [60, 70, 84] as const;
  const value = values[variantIndex(seed, values.length)];
  const expected = angleText(toNumber(equalCentralAngleFromEqualChord(angle(value))));
  const theoremTrace: TheoremId[] = ["EQUAL_CHORD_EQUAL_CENTRAL_ANGLE"];
  const clues = ["AB_CD_EQUAL_CHORDS", "AOB_GIVEN", "SAME_CIRCLE"] as const;
  const options = buildOptions(expected, [
    { text: angleText(value / 2), misconceptionId: "HALVED_EQUAL_CENTRAL_ANGLE", rationale: "Incorrectly halves the known central angle." },
    { text: angleText(value * 2), misconceptionId: "DOUBLED_EQUAL_CENTRAL_ANGLE", rationale: "Incorrectly doubles the known central angle." },
    { text: angleText(180 - value), misconceptionId: "USED_SUPPLEMENT", rationale: "Uses a supplementary angle instead of the equal central angle." },
  ], seed);
  const stems = [
    `In the same circle with centre O, chords AB and CD are equal. If ∠AOB = ${value}°, find ∠COD.`,
    `Equal chords AB and CD lie in a circle centred at O. The angle subtended by AB at O is ${value}°. What is ∠COD?`,
    `AB = CD in a circle with centre O. Given central angle ∠AOB = ${value}°, determine the central angle subtended by CD.`,
  ];
  return finalizeGapWave7Question({
    cpId: "GEO-CP-010", temporaryPrototypeId: "GEO-TMP-GAP-W7-CP010-EQUAL-CHORD-CENTRAL-ANGLE-V1",
    sourceGapId: "GEO-CP-010/EQUAL_CHORD_EQUAL_CENTRAL_ANGLE_OR_ARC_AND_CONVERSE",
    sourceEvidenceIds: ["SRC-TESTBOOK-SELECTION-POST-EQUAL-CHORD-CENTRAL-ANGLE-2025"], solveMode: "transferCentralAngleAcrossEqualChords",
    seed, stem: stems[variantIndex(seed, stems.length)], ...options,
    explanation: buildExplanation(theoremTrace, [
      "AB and CD are equal chords of the same circle.",
      `Equal chords subtend equal angles at the centre, so ∠COD = ∠AOB = ${value}°.`
    ]), theoremTrace, displayedClueIds: clues, minimalityProof: minimality(clues, expected),
    independentVerifierResult: wave7Verifier("EXACT_THEOREM_CROSSCHECK", expected === angleText(value), ["exact circle inference returns the same central angle for equal chords", "the two drawn chords subtend equal central angles"]),
    diagramModel: equalChordCentralDiagram(value, false), solutionDiagramModel: equalChordCentralDiagram(value, true),
  });
}

function equalChordDistanceDiagram(value: number, solution: boolean): GeoDiagramModel {
  const xLeft = 55, xRight = 205, yTop = 76, yBottom = 144;
  return {
    points: [
      { id: "O", label: "O", x: 130, y: 110 },
      { id: "A", label: "A", x: xLeft, y: yTop }, { id: "B", label: "B", x: xRight, y: yTop }, { id: "M", label: "M", x: 130, y: yTop },
      { id: "C", label: "C", x: xLeft, y: yBottom }, { id: "D", label: "D", x: xRight, y: yBottom }, { id: "N", label: "N", x: 130, y: yBottom },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" }, { id: "CD", fromPointId: "C", toPointId: "D" },
      { id: "OM", fromPointId: "O", toPointId: "M", style: "CONSTRUCTION" }, { id: "ON", fromPointId: "O", toPointId: "N", style: "CONSTRUCTION" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 88 }], angleMarks: [],
    rightAngleMarks: [
      { id: "right-m", vertexPointId: "M", firstRayPointId: "O", secondRayPointId: "A" },
      { id: "right-n", vertexPointId: "N", firstRayPointId: "O", secondRayPointId: "C" },
    ],
    equalLengthMarks: [{ id: "given-equal-chords", segmentIds: ["AB", "CD"] }], parallelMarks: [], arcs: [],
    labels: [
      { id: "given-om", text: `OM = ${value} cm`, x: 88, y: 96 },
      ...(solution ? [{ id: "derived-on", text: `ON = ${value} cm`, x: 178, y: 130 }] : []),
    ], disclosure: solution ? "SOLUTION" : "STEM", notToScale: true,
  };
}

function generateEqualChordDistance(seed: string): GapWave7Question {
  const values = [4, 6, 8] as const;
  const value = values[variantIndex(seed, values.length)];
  const expected = lengthText(toNumber(equalCentreDistanceFromEqualChord(rational(value))));
  const theoremTrace: TheoremId[] = ["EQUAL_CHORD_EQUAL_CENTRE_DISTANCE"];
  const clues = ["AB_CD_EQUAL", "OM_ON_PERPENDICULAR", "OM_VALUE"] as const;
  const options = buildOptions(expected, [
    { text: lengthText(value / 2), misconceptionId: "HALVED_CENTRE_DISTANCE", rationale: "Halves the known distance without a geometric reason." },
    { text: lengthText(value * 2), misconceptionId: "DOUBLED_CENTRE_DISTANCE", rationale: "Doubles the known distance instead of matching equal-chord distances." },
    { text: lengthText(value + 2), misconceptionId: "ADDED_TO_CENTRE_DISTANCE", rationale: "Adds an arbitrary amount instead of using equality." },
  ], seed);
  const stems = [
    `AB and CD are equal chords of a circle with centre O. OM and ON are perpendicular to AB and CD. If OM = ${value} cm, find ON.`,
    `Two equal chords AB and CD have perpendiculars OM and ON drawn from the centre O. OM measures ${value} cm. What is ON?`,
    `In one circle, AB = CD. Their perpendicular distances from centre O are OM and ON. Given OM = ${value} cm, determine ON.`,
  ];
  return finalizeGapWave7Question({
    cpId: "GEO-CP-010", temporaryPrototypeId: "GEO-TMP-GAP-W7-CP010-EQUAL-CHORD-CENTRE-DISTANCE-V1",
    sourceGapId: "GEO-CP-010/CHORD_DISTANCE_FROM_CENTRE_OR_EQUAL_CHORD_EQUAL_DISTANCE",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-EQUAL-CHORD-EQUAL-CENTRE-DISTANCE-2025"], solveMode: "transferCentreDistanceAcrossEqualChords",
    seed, stem: stems[variantIndex(seed, stems.length)], ...options,
    explanation: buildExplanation(theoremTrace, [
      "Equal chords of the same circle are equally distant from the centre.",
      `Since AB = CD and OM and ON are the perpendicular distances, ON = OM = ${value} cm.`
    ]), theoremTrace, displayedClueIds: clues, minimalityProof: minimality(clues, expected),
    independentVerifierResult: wave7Verifier("EXACT_THEOREM_CROSSCHECK", expected === lengthText(value), ["exact inference preserves the perpendicular centre distance for equal chords"]),
    diagramModel: equalChordDistanceDiagram(value, false), solutionDiagramModel: equalChordDistanceDiagram(value, true),
  });
}

function chordMidpointDiagram(solution: boolean): GeoDiagramModel {
  return {
    points: [
      { id: "O", label: "O", x: 130, y: 135 }, { id: "P", label: "P", x: 55, y: 70 },
      { id: "Q", label: "Q", x: 205, y: 70 }, { id: "R", label: "R", x: 130, y: 70 },
    ],
    segments: [
      { id: "PQ", fromPointId: "P", toPointId: "Q" }, { id: "PR", fromPointId: "P", toPointId: "R" },
      { id: "RQ", fromPointId: "R", toPointId: "Q" }, { id: "OR", fromPointId: "O", toPointId: "R", style: "CONSTRUCTION" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 99 }], angleMarks: [],
    rightAngleMarks: solution ? [{ id: "derived-right", vertexPointId: "R", firstRayPointId: "O", secondRayPointId: "P" }] : [],
    equalLengthMarks: [{ id: "given-midpoint", segmentIds: ["PR", "RQ"] }], parallelMarks: [], arcs: [],
    labels: solution ? [{ id: "answer-angle", text: "∠ORP = 90°", x: 198, y: 112 }] : [],
    disclosure: solution ? "SOLUTION" : "STEM", notToScale: true,
  };
}

function generateChordMidpointPerpendicular(seed: string): GapWave7Question {
  const expected = angleText(toNumber(centreLineThroughChordMidpointAngle()));
  const theoremTrace: TheoremId[] = ["PERPENDICULAR_FROM_CENTRE_BISECTS_CHORD_CONVERSE"];
  const clues = ["PQ_CHORD", "PR_EQUALS_RQ", "OR_JOINED"] as const;
  const options = buildOptions(expected, [
    { text: "45°", misconceptionId: "HALVED_RIGHT_ANGLE", rationale: "Incorrectly halves the required perpendicular angle." },
    { text: "60°", misconceptionId: "ASSUMED_EQUILATERAL_ANGLE", rationale: "Treats the construction as if it created an equilateral triangle." },
    { text: "180°", misconceptionId: "USED_STRAIGHT_ANGLE", rationale: "Confuses perpendicularity with a straight line." },
  ], seed);
  const stems = [
    "PQ is a chord of a circle with centre O. R is the midpoint of PQ and OR is joined. Find ∠ORP.",
    "A chord PQ is bisected at R. The centre O is joined to R. What angle does OR make with RP?",
    "In a circle centred at O, PR = RQ on chord PQ. If OR is drawn, determine ∠ORP.",
  ];
  return finalizeGapWave7Question({
    cpId: "GEO-CP-010", temporaryPrototypeId: "GEO-TMP-GAP-W7-CP010-CENTRE-BISECTOR-PERPENDICULAR-V1",
    sourceGapId: "GEO-CP-010/CENTRE_TO_CHORD_BISECTOR_INVERSE",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-CHORD-MIDPOINT-CENTRE-PERPENDICULAR-2025"], solveMode: "inferPerpendicularFromCentreThroughChordMidpoint",
    seed, stem: stems[variantIndex(seed, stems.length)], ...options,
    explanation: buildExplanation(theoremTrace, [
      "R is the midpoint of chord PQ because PR = RQ.",
      "A line from the centre through the midpoint of a chord is perpendicular to that chord, so ∠ORP = 90°."
    ]), theoremTrace, displayedClueIds: clues, minimalityProof: minimality(clues, expected),
    independentVerifierResult: wave7Verifier("EXACT_THEOREM_CROSSCHECK", expected === "90°", ["exact inverse chord theorem returns a right angle"]),
    diagramModel: chordMidpointDiagram(false), solutionDiagramModel: chordMidpointDiagram(true),
  });
}

function sameSegmentDiagram(value: number, solution: boolean): GeoDiagramModel {
  const R = circlePoint("R", "R", 270 - value);
  const Q = circlePoint("Q", "Q", 270 + value);
  const P = circlePoint("P", "P", 95);
  const S = circlePoint("S", "S", 35);
  return {
    points: [{ id: "O", label: "O", x: CX, y: CY }, R, Q, P, S],
    segments: [
      { id: "RQ", fromPointId: "R", toPointId: "Q" }, { id: "PR", fromPointId: "P", toPointId: "R" },
      { id: "PQ", fromPointId: "P", toPointId: "Q" }, { id: "SR", fromPointId: "S", toPointId: "R" }, { id: "SQ", fromPointId: "S", toPointId: "Q" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: RADIUS }],
    angleMarks: [
      { id: "given-rpq", firstPointId: "R", vertexPointId: "P", secondPointId: "Q", label: angleText(value), radius: 20, labelRadius: 32 },
      ...(solution ? [{ id: "derived-rsq", firstPointId: "R", vertexPointId: "S", secondPointId: "Q", label: angleText(value), radius: 19, labelRadius: 31 }] : []),
    ], rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [],
    disclosure: solution ? "SOLUTION" : "STEM", notToScale: true,
  };
}

function generateSameSegment(seed: string): GapWave7Question {
  const values = [42, 48, 55] as const;
  const value = values[variantIndex(seed, values.length)];
  const expected = angleText(toNumber(sameSegmentAngleFromSameChord(angle(value))));
  const theoremTrace: TheoremId[] = ["SAME_SEGMENT_ANGLE"];
  const clues = ["P_S_SAME_SEGMENT", "RQ_COMMON_CHORD", "RPQ_VALUE"] as const;
  const options = buildOptions(expected, [
    { text: angleText(90 - value), misconceptionId: "USED_COMPLEMENT", rationale: "Uses a complementary angle instead of the same-segment equality." },
    { text: angleText(180 - value), misconceptionId: "USED_SUPPLEMENT", rationale: "Uses a supplementary angle instead of the equal angle." },
    { text: angleText(value * 2), misconceptionId: "DOUBLED_INSCRIBED_ANGLE", rationale: "Incorrectly doubles the inscribed angle." },
  ], seed);
  const stems = [
    `P and S lie in the same segment of a circle on chord RQ. If ∠RPQ = ${value}°, find ∠RSQ.`,
    `Angles RPQ and RSQ stand on the same chord RQ from the same segment. Given ∠RPQ = ${value}°, determine ∠RSQ.`,
    `In one circle, P and S are on the same side of chord RQ. If chord RQ subtends ${value}° at P, what angle does it subtend at S?`,
  ];
  return finalizeGapWave7Question({
    cpId: "GEO-CP-011", temporaryPrototypeId: "GEO-TMP-GAP-W7-CP011-SAME-SEGMENT-ANGLE-V1",
    sourceGapId: "GEO-CP-011/SAME_SEGMENT_ANGLE", sourceEvidenceIds: ["SRC-TESTBOOK-CGL-SAME-SEGMENT-ANGLE-2025"],
    solveMode: "transferInscribedAngleAcrossSameSegment", seed, stem: stems[variantIndex(seed, stems.length)], ...options,
    explanation: buildExplanation(theoremTrace, [
      "Both ∠RPQ and ∠RSQ stand on the same chord RQ, and P and S are in the same segment.",
      `Angles in the same segment are equal, so ∠RSQ = ${value}°.`
    ]), theoremTrace, displayedClueIds: clues, minimalityProof: minimality(clues, expected),
    independentVerifierResult: wave7Verifier("EXACT_THEOREM_CROSSCHECK", expected === angleText(value), ["exact same-segment inference preserves the known inscribed angle"]),
    diagramModel: sameSegmentDiagram(value, false), solutionDiagramModel: sameSegmentDiagram(value, true),
  });
}

function cyclicExteriorDiagram(central: number, solution: boolean): GeoDiagramModel {
  const A = circlePoint("A", "A", 180 - central / 2);
  const C = circlePoint("C", "C", 180 + central / 2);
  const B = circlePoint("B", "B", 180);
  const scale = 0.72;
  const P = { id: "P", label: "P", x: B.x + (B.x - A.x) * scale, y: B.y + (B.y - A.y) * scale };
  return {
    points: [{ id: "O", label: "O", x: CX, y: CY }, A, B, C, P],
    segments: [
      { id: "OA", fromPointId: "O", toPointId: "A", style: "CONSTRUCTION" }, { id: "OC", fromPointId: "O", toPointId: "C", style: "CONSTRUCTION" },
      { id: "AB", fromPointId: "A", toPointId: "B" }, { id: "BP", fromPointId: "B", toPointId: "P" }, { id: "BC", fromPointId: "B", toPointId: "C" },
    ], circles: [{ id: "circle-o", centerPointId: "O", radius: RADIUS }],
    angleMarks: [
      { id: "given-aoc", firstPointId: "A", vertexPointId: "O", secondPointId: "C", label: angleText(central), radius: 24, labelRadius: 37 },
      ...(solution ? [{ id: "answer-cbp", firstPointId: "C", vertexPointId: "B", secondPointId: "P", label: angleText(central / 2), radius: 20, labelRadius: 32 }] : []),
    ], rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [],
    disclosure: solution ? "SOLUTION" : "STEM", notToScale: true,
  };
}

function generateCyclicExterior(seed: string): GapWave7Question {
  const values = [110, 126, 134] as const;
  const central = values[variantIndex(seed, values.length)];
  const target = toNumber(inscribedAngleFromCentral(angle(central)));
  const expected = angleText(target);
  const theoremTrace: TheoremId[] = ["CENTRAL_ANGLE_DOUBLE_INSCRIBED", "CYCLIC_EXTERIOR_EQUALS_INTERIOR_OPPOSITE"];
  const clues = ["A_B_C_CONCYCLIC", "AB_EXTENDED_TO_P", "AOC_VALUE"] as const;
  const options = buildOptions(expected, [
    { text: angleText(central), misconceptionId: "COPIED_CENTRAL_ANGLE", rationale: "Copies the central angle without halving it." },
    { text: angleText(180 - target), misconceptionId: "USED_SUPPLEMENT_OF_TARGET", rationale: "Uses the supplementary angle at B." },
    { text: angleText(90 - target), misconceptionId: "USED_COMPLEMENT_OF_TARGET", rationale: "Uses an unrelated complement." },
  ], seed);
  const stems = [
    `A, B and C lie on a circle with centre O. AB is produced beyond B to P. If ∠AOC = ${central}°, find exterior angle ∠CBP.`,
    `In a circle centred at O, A, B and C are concyclic and side AB is extended to P. Given ∠AOC = ${central}°, determine ∠CBP.`,
    `AB is extended through B to an exterior point P. For concyclic A, B, C with centre O, ∠AOC = ${central}°. What is ∠CBP?`,
  ];
  return finalizeGapWave7Question({
    cpId: "GEO-CP-011", temporaryPrototypeId: "GEO-TMP-GAP-W7-CP011-CYCLIC-EXTERIOR-CENTRAL-V1",
    sourceGapId: "GEO-CP-011/CYCLIC_EXTERIOR_ANGLE", sourceEvidenceIds: ["SRC-TESTBOOK-CGL-CYCLIC-EXTERIOR-FROM-CENTRAL-2025"],
    solveMode: "recoverCyclicExteriorFromCentralAngle", seed, stem: stems[variantIndex(seed, stems.length)], ...options,
    explanation: buildExplanation(theoremTrace, [
      `The central angle standing on arc AC is ${central}°, so an inscribed angle standing on the same arc is half of it: ${target}°.` ,
      `The exterior angle formed by extending AB equals the opposite cyclic interior angle, so ∠CBP = ${target}°.`
    ]), theoremTrace, displayedClueIds: clues, minimalityProof: minimality(clues, expected),
    independentVerifierResult: wave7Verifier("INDEPENDENT_ANGLE_CHAIN", target * 2 === central, ["independent half-central-angle calculation matches the target exterior angle", "B lies on the minor AC arc so the drawn exterior is the required half-minor-arc angle"]),
    diagramModel: cyclicExteriorDiagram(central, false), solutionDiagramModel: cyclicExteriorDiagram(central, true),
  });
}

type XY = Readonly<{ x: number; y: number }>;
function cross(a: XY, b: XY): number { return a.x * b.y - a.y * b.x; }
function sourceChainGeometry(a: number, p: number) {
  const O = { x: 130, y: 90 }; const radius = 40;
  const A = { x: 90, y: 90 }; const D = { x: 170, y: 90 };
  const delta = 180 - a - p;
  const u = { x: Math.cos(a * Math.PI / 180), y: Math.sin(a * Math.PI / 180) };
  const v = { x: -Math.cos(delta * Math.PI / 180), y: Math.sin(delta * Math.PI / 180) };
  const w = { x: D.x - A.x, y: D.y - A.y };
  const t = cross(w, v) / cross(u, v);
  const P = { x: A.x + t * u.x, y: A.y + t * u.y };
  const second = (start: XY) => {
    const d = { x: P.x - start.x, y: P.y - start.y };
    const s = { x: start.x - O.x, y: start.y - O.y };
    const root = -2 * (s.x * d.x + s.y * d.y) / (d.x * d.x + d.y * d.y);
    return { x: start.x + root * d.x, y: start.y + root * d.y };
  };
  return { O, radius, A, D, P, B: second(A), C: second(D) };
}

function semicircleChainDiagram(a: number, p: number, solution: boolean): GeoDiagramModel {
  const g = sourceChainGeometry(a, p);
  const target = 90 - a - p;
  const adc = a + p;
  return {
    points: [
      { id: "O", label: "O", ...g.O }, { id: "A", label: "A", ...g.A }, { id: "D", label: "D", ...g.D },
      { id: "B", label: "B", ...g.B }, { id: "C", label: "C", ...g.C }, { id: "P", label: "P", ...g.P },
    ],
    segments: [
      { id: "AD", fromPointId: "A", toPointId: "D" }, { id: "AB", fromPointId: "A", toPointId: "B" }, { id: "BP", fromPointId: "B", toPointId: "P" },
      { id: "CD", fromPointId: "C", toPointId: "D" }, { id: "DP", fromPointId: "D", toPointId: "P" }, { id: "BC", fromPointId: "B", toPointId: "C" }, { id: "BD", fromPointId: "B", toPointId: "D" },
    ], circles: [{ id: "circle-o", centerPointId: "O", radius: g.radius }],
    angleMarks: [
      { id: "given-dap", firstPointId: "D", vertexPointId: "A", secondPointId: "P", label: angleText(a), radius: 16, labelRadius: 27 },
      { id: "given-apd", firstPointId: "A", vertexPointId: "P", secondPointId: "D", label: angleText(p), radius: 18, labelRadius: 30 },
      ...(solution ? [
        { id: "derived-adc", firstPointId: "A", vertexPointId: "D", secondPointId: "C", label: angleText(adc), radius: 17, labelRadius: 29 },
        { id: "derived-abd", firstPointId: "A", vertexPointId: "B", secondPointId: "D", label: "90°", radius: 16, labelRadius: 27 },
        { id: "answer-cbd", firstPointId: "C", vertexPointId: "B", secondPointId: "D", label: angleText(target), radius: 27, labelRadius: 40 },
      ] : []),
    ], rightAngleMarks: solution ? [{ id: "diameter-right", vertexPointId: "B", firstRayPointId: "A", secondRayPointId: "D" }] : [],
    equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: solution ? "SOLUTION" : "STEM", notToScale: true,
  };
}

function generateSemicircleChain(seed: string): GapWave7Question {
  const variants = [{ a: 39, p: 25 }, { a: 34, p: 28 }, { a: 44, p: 21 }] as const;
  const { a, p } = variants[variantIndex(seed, variants.length)];
  const target = 90 - a - p;
  const expected = angleText(target);
  const theoremTrace: TheoremId[] = ["TRIANGLE_ANGLE_SUM", "LINEAR_PAIR_SUM", "SAME_SEGMENT_ANGLE", "ANGLE_IN_SEMICIRCLE"];
  const clues = ["AD_DIAMETER", "AB_CD_EXTENDED_TO_P", "DAP_VALUE", "APD_VALUE"] as const;
  const options = buildOptions(expected, [
    { text: angleText(a + p), misconceptionId: "STOPPED_AT_SAME_SEGMENT_ANGLE", rationale: "Stops at the intermediate same-segment angle instead of subtracting from the semicircle right angle." },
    { text: angleText(90 - p), misconceptionId: "SUBTRACTED_ONLY_EXTERNAL_ANGLE", rationale: "Subtracts only the angle at P from 90°." },
    { text: angleText(90 - a), misconceptionId: "SUBTRACTED_ONLY_A_ANGLE", rationale: "Subtracts only the angle at A from 90°." },
  ], seed);
  const stems = [
    `AB and CD are chords produced to meet at P outside the circle, and AD is a diameter. If ∠APD = ${p}° and ∠DAP = ${a}°, find ∠CBD.`,
    `In the shown circle, AD is a diameter and the extensions of chords AB and CD meet at P. Given ∠DAP = ${a}° and ∠APD = ${p}°, determine ∠CBD.`,
    `AD is a diameter. Lines ABP and CDP are straight secants meeting at exterior point P. If ∠DAP = ${a}° and ∠APD = ${p}°, what is ∠CBD?`,
  ];
  const semicircle = toNumber(angleInSemicircle());
  return finalizeGapWave7Question({
    cpId: "GEO-CP-011", temporaryPrototypeId: "GEO-TMP-GAP-W7-CP011-SEMICIRCLE-SAME-SEGMENT-CHAIN-V1",
    sourceGapId: "GEO-CP-011/SEMICIRCLE_PLUS_CYCLIC_CHAIN", sourceEvidenceIds: ["SRC-TESTBOOK-CGL-SEMICIRCLE-SAME-SEGMENT-CHAIN-2022"],
    solveMode: "combineExteriorTriangleSameSegmentAndSemicircle", seed, stem: stems[variantIndex(seed, stems.length)], ...options,
    explanation: buildExplanation(theoremTrace, [
      `In triangle ADP, ∠ADP = 180° − ${a}° − ${p}° = ${180 - a - p}°.` ,
      `C, D and P are collinear, so ∠ADC = 180° − ${180 - a - p}° = ${a + p}°.` ,
      `Angles ∠ADC and ∠ABC stand on chord AC in the same segment, so ∠ABC = ${a + p}°.` ,
      `AD is a diameter, so ∠ABD = ${semicircle}°. Therefore ∠CBD = 90° − ${a + p}° = ${target}°.`
    ]), theoremTrace, displayedClueIds: clues, minimalityProof: minimality(clues, expected),
    independentVerifierResult: wave7Verifier("INDEPENDENT_ANGLE_CHAIN", semicircle === 90 && target === 90 - (a + p) && target > 0, ["independent triangle/linear-pair arithmetic gives the same chord angle", "diameter check gives a 90° angle at B", "final subtraction reproduces the target"]),
    diagramModel: semicircleChainDiagram(a, p, false), solutionDiagramModel: semicircleChainDiagram(a, p, true),
  });
}

export const GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES: readonly GapWave7PrototypeDefinition[] = Object.freeze([
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W7-CP010-EQUAL-CHORD-CENTRAL-ANGLE-V1", cpId: "GEO-CP-010", sourceGapId: "GEO-CP-010/EQUAL_CHORD_EQUAL_CENTRAL_ANGLE_OR_ARC_AND_CONVERSE", solveMode: "transferCentralAngleAcrossEqualChords", diagramDisposition: "REQUIRED_BOTH", generate: generateEqualChordCentral }),
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W7-CP010-EQUAL-CHORD-CENTRE-DISTANCE-V1", cpId: "GEO-CP-010", sourceGapId: "GEO-CP-010/CHORD_DISTANCE_FROM_CENTRE_OR_EQUAL_CHORD_EQUAL_DISTANCE", solveMode: "transferCentreDistanceAcrossEqualChords", diagramDisposition: "REQUIRED_BOTH", generate: generateEqualChordDistance }),
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W7-CP010-CENTRE-BISECTOR-PERPENDICULAR-V1", cpId: "GEO-CP-010", sourceGapId: "GEO-CP-010/CENTRE_TO_CHORD_BISECTOR_INVERSE", solveMode: "inferPerpendicularFromCentreThroughChordMidpoint", diagramDisposition: "REQUIRED_BOTH", generate: generateChordMidpointPerpendicular }),
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W7-CP011-SAME-SEGMENT-ANGLE-V1", cpId: "GEO-CP-011", sourceGapId: "GEO-CP-011/SAME_SEGMENT_ANGLE", solveMode: "transferInscribedAngleAcrossSameSegment", diagramDisposition: "REQUIRED_BOTH", generate: generateSameSegment }),
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W7-CP011-CYCLIC-EXTERIOR-CENTRAL-V1", cpId: "GEO-CP-011", sourceGapId: "GEO-CP-011/CYCLIC_EXTERIOR_ANGLE", solveMode: "recoverCyclicExteriorFromCentralAngle", diagramDisposition: "REQUIRED_BOTH", generate: generateCyclicExterior }),
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W7-CP011-SEMICIRCLE-SAME-SEGMENT-CHAIN-V1", cpId: "GEO-CP-011", sourceGapId: "GEO-CP-011/SEMICIRCLE_PLUS_CYCLIC_CHAIN", solveMode: "combineExteriorTriangleSameSegmentAndSemicircle", diagramDisposition: "REQUIRED_BOTH", generate: generateSemicircleChain }),
]);
