import {
  CoordinateOracle,
  equals,
  intersectingChordMissingSegment,
  rational,
  secantSecantMissingWhole,
  tangentSecantTangentLength,
  type GeoDiagramModel,
  type GeoProofEvent,
  type TheoremId,
} from "../../../../../../shared/geometry";
import { buildExplanation, buildOptions, finalizePhase4Question, proveClueMinimality, verifier } from "../discovery/phase4-utils";
import type { Phase4PrototypeDefinition, Phase4PrototypeQuestion } from "../discovery/phase4-types";

const CP_ID = "GEO-CP-013" as const;
const q = (value: number, denominator = 1) => rational(value, denominator);
const lengthText = (value: ReturnType<typeof rational>) => value.denominator === 1n ? `${value.numerator} cm` : `${value.numerator}/${value.denominator} cm`;

function intersectingChordsDiagram(): GeoDiagramModel {
  const polar = (id: string, degrees: number) => {
    const r = degrees * Math.PI / 180;
    return { id, label: id, x: 100 + 75 * Math.cos(r), y: 100 + 75 * Math.sin(r) };
  };
  return {
    points: [{ id: "O", label: "O", x: 100, y: 100 }, { id: "P", label: "P", x: 100, y: 100 }, polar("A", 190), polar("B", 10), polar("C", 260), polar("D", 80)],
    segments: [{ id: "AB", fromPointId: "A", toPointId: "B" }, { id: "CD", fromPointId: "C", toPointId: "D" }],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 75 }],
    angleMarks: [], rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function secantSecantDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "O", label: "O", x: 110, y: 100 }, { id: "P", label: "P", x: 15, y: 100 },
      { id: "A", label: "A", x: 45, y: 100 }, { id: "B", label: "B", x: 175, y: 100 },
      { id: "C", label: "C", x: 47, y: 116 }, { id: "D", label: "D", x: 135, y: 160 },
    ],
    segments: [{ id: "PB", fromPointId: "P", toPointId: "B" }, { id: "PD", fromPointId: "P", toPointId: "D" }],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 65 }],
    angleMarks: [], rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function tangentSecantDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "O", label: "O", x: 110, y: 100 }, { id: "P", label: "P", x: 15, y: 100 },
      { id: "A", label: "A", x: 45, y: 100 }, { id: "B", label: "B", x: 175, y: 100 },
      { id: "T", label: "T", x: 65.5, y: 52.5 },
    ],
    segments: [{ id: "PB", fromPointId: "P", toPointId: "B" }, { id: "PT", fromPointId: "P", toPointId: "T" }],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 65 }],
    angleMarks: [], rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generateIntersectingChords(seed: string): Phase4PrototypeQuestion {
  const clueIds = ["AB_AND_CD_CHORDS_INTERSECT_AT_P_INSIDE", "PA_IS_2", "PB_IS_6", "PC_IS_3"] as const;
  const expected = "4 cm";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return lengthText(intersectingChordMissingSegment(q(2), q(6), q(3)));
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Intersecting-chord solver mismatch");
  const oracle = new CoordinateOracle({
    O: { x: q(2), y: q(1, 2) }, P: { x: q(0), y: q(0) },
    A: { x: q(-2), y: q(0) }, B: { x: q(6), y: q(0) }, C: { x: q(0), y: q(-3) }, D: { x: q(0), y: q(4) },
  });
  const passed = ["A", "B", "C", "D"].every((point) => oracle.pointOnCircle(point, "O", q(65, 4)))
    && oracle.collinear("A", "P", "B") && oracle.collinear("C", "P", "D")
    && equals(q(2 * 6), q(3 * 4));
  const theoremTrace: TheoremId[] = ["INTERSECTING_CHORD_PRODUCT"];
  const proofEvents: GeoProofEvent[] = [{ kind: "SEGMENT_PRODUCT", left: { firstSegmentId: "PA", secondSegmentId: "PB" }, right: { firstSegmentId: "PC", secondSegmentId: "PD" }, reason: "INTERSECTING_CHORD_PRODUCT" }];
  const options = buildOptions(expected, [
    { text: "1 cm", misconceptionId: "INTERSECTING_CHORD_WRONG_PAIRING", rationale: "Pairs the segments incorrectly in the product relation." },
    { text: "9 cm", misconceptionId: "USED_SUM_INSTEAD_OF_PRODUCT", rationale: "Uses additive reasoning instead of the chord product theorem." },
    { text: "12 cm", misconceptionId: "FAILED_TO_DIVIDE_PRODUCT", rationale: "Stops at PA × PB without dividing by PC." },
  ], seed);
  return finalizePhase4Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP013-INTERSECTING-CHORDS-V1", solveMode: "findMissingIntersectingChordSegment", difficulty: "Medium", seed,
    stem: "Chords AB and CD intersect at P inside a circle. If PA = 2 cm, PB = 6 cm and PC = 3 cm, find PD.",
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "For two chords intersecting inside a circle, the products of the two chord parts are equal: PA × PB = PC × PD.",
      "So 2 × 6 = 3 × PD, giving PD = 12/3 = 4 cm.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("COORDINATE_ORACLE", passed, ["all four hidden endpoints lie exactly on one circle", "A-P-B and C-P-D are exact collinear chord orderings", "independent segment products are 2×6 and 3×4"]),
    diagramModel: intersectingChordsDiagram(),
  });
}

function generateSecantSecant(seed: string): Phase4PrototypeQuestion {
  const clueIds = ["TWO_SECANTS_FROM_EXTERNAL_P", "PA_EXTERNAL_IS_3", "PB_WHOLE_IS_8", "PC_EXTERNAL_IS_4"] as const;
  const expected = "6 cm";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return lengthText(secantSecantMissingWhole(q(3), q(8), q(4)));
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Secant-secant solver mismatch");
  const oracle = new CoordinateOracle({
    O: { x: q(11, 2), y: q(17, 8) }, P: { x: q(0), y: q(0) }, A: { x: q(3), y: q(0) }, B: { x: q(8), y: q(0) },
    C: { x: q(12, 5), y: q(16, 5) }, D: { x: q(18, 5), y: q(24, 5) },
  });
  const passed = ["A", "B", "C", "D"].every((point) => oracle.pointOnCircle(point, "O", q(689, 64)))
    && oracle.collinear("P", "A", "B") && oracle.collinear("P", "C", "D")
    && equals(q(3 * 8), q(4 * 6));
  const theoremTrace: TheoremId[] = ["SECANT_SECANT_POWER"];
  const proofEvents: GeoProofEvent[] = [{ kind: "SEGMENT_PRODUCT", left: { firstSegmentId: "PA", secondSegmentId: "PB" }, right: { firstSegmentId: "PC", secondSegmentId: "PD" }, reason: "SECANT_SECANT_POWER" }];
  const options = buildOptions(expected, [
    { text: "3 cm", misconceptionId: "SECANT_EXTERNAL_USED_AS_WHOLE", rationale: "Uses an external part where the theorem requires a whole secant." },
    { text: "8 cm", misconceptionId: "COPIED_FIRST_WHOLE_SECANT", rationale: "Assumes the two whole secants are equal." },
    { text: "12 cm", misconceptionId: "SECANT_SECANT_USED_LINEAR_PRODUCT", rationale: "Uses the product without dividing by the second external part." },
  ], seed);
  return finalizePhase4Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP013-SECANT-SECANT-V1", solveMode: "findMissingWholeSecant", difficulty: "Medium", seed,
    stem: "From an external point P, two secants PAB and PCD meet the same circle, with A and C the nearer points. If PA = 3 cm, PB = 8 cm, and PC = 4 cm, find the whole secant PD.",
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "For two secants from the same external point, external part × whole secant is equal for both secants.",
      "Thus PA × PB = PC × PD, so 3 × 8 = 4 × PD and PD = 6 cm.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("COORDINATE_ORACLE", passed, ["A, B, C and D lie exactly on one hidden circle", "P-A-B and P-C-D are exact external secant orderings", "independent products are 3×8 and 4×6"]),
    diagramModel: secantSecantDiagram(),
  });
}

function generateTangentSecant(seed: string): Phase4PrototypeQuestion {
  const clueIds = ["PT_TANGENT_FROM_P", "PAB_SECANT_FROM_P", "PA_EXTERNAL_IS_2", "PB_WHOLE_IS_18"] as const;
  const expected = "6 cm";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return lengthText(tangentSecantTangentLength(q(2), q(18)));
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Tangent-secant solver mismatch");
  const oracle = new CoordinateOracle({
    O: { x: q(10), y: q(0) }, P: { x: q(0), y: q(0) }, A: { x: q(2), y: q(0) }, B: { x: q(18), y: q(0) }, T: { x: q(18, 5), y: q(24, 5) },
  });
  const passed = ["A", "B", "T"].every((point) => oracle.pointOnCircle(point, "O", q(64)))
    && oracle.collinear("P", "A", "B") && oracle.perpendicular("O", "T", "P", "T")
    && equals(oracle.squaredLength("P", "T"), q(36)) && equals(q(2 * 18), q(36));
  const theoremTrace: TheoremId[] = ["TANGENT_SECANT_POWER"];
  const proofEvents: GeoProofEvent[] = [{ kind: "SEGMENT_PRODUCT", left: { firstSegmentId: "PT", secondSegmentId: "PT" }, right: { firstSegmentId: "PA", secondSegmentId: "PB" }, reason: "TANGENT_SECANT_POWER" }];
  const options = buildOptions(expected, [
    { text: "36 cm", misconceptionId: "TANGENT_SECANT_FORGOT_SQUARE_ROOT", rationale: "Stops at PT² = 36 and reports the squared value as a length." },
    { text: "8 cm", misconceptionId: "SECANT_EXTERNAL_USED_AS_WHOLE", rationale: "Uses the internal segment instead of external × whole secant." },
    { text: "10 cm", misconceptionId: "ADDED_SECANT_PARTS", rationale: "Uses additive secant reasoning instead of the tangent–secant power relation." },
  ], seed);
  return finalizePhase4Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP013-TANGENT-SECANT-V1", solveMode: "findTangentFromSecantPower", difficulty: "Medium", seed,
    stem: "From an external point P, PT is tangent to a circle at T and secant PAB meets the circle first at A and then at B. If PA = 2 cm and the whole secant PB = 18 cm, find PT.",
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "For a tangent and a secant from the same external point, PT² = PA × PB, where PB is the whole secant.",
      "So PT² = 2 × 18 = 36. Since PT is a positive length, PT = 6 cm.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("COORDINATE_ORACLE", passed, ["A, B and T lie exactly on one hidden circle", "P-A-B is the exact secant ordering", "OT is exactly perpendicular to PT", "PT² = 36 = 2×18 independently"]),
    diagramModel: tangentSecantDiagram(),
  });
}

export const GEO_CP_013_PHASE4_PROTOTYPES: readonly Phase4PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP013-INTERSECTING-CHORDS-V1", cpId: CP_ID, solveMode: "findMissingIntersectingChordSegment", generate: generateIntersectingChords },
  { temporaryPrototypeId: "GEO-TMP-CP013-SECANT-SECANT-V1", cpId: CP_ID, solveMode: "findMissingWholeSecant", generate: generateSecantSecant },
  { temporaryPrototypeId: "GEO-TMP-CP013-TANGENT-SECANT-V1", cpId: CP_ID, solveMode: "findTangentFromSecantPower", generate: generateTangentSecant },
]);
