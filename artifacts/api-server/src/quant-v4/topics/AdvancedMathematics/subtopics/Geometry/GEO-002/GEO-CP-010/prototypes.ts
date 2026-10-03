import {
  CoordinateOracle,
  chordHalfFromCentrePerpendicular,
  equalChordLengthFromEqualCentreDistance,
  equals,
  rational,
  type GeoDiagramModel,
  type GeoProofEvent,
  type TheoremId,
} from "../../../../../../shared/geometry";
import {
  buildExplanation,
  buildOptions,
  finalizePhase4Question,
  proveClueMinimality,
  verifier,
} from "../discovery/phase4-utils";
import type { Phase4PrototypeDefinition, Phase4PrototypeQuestion } from "../discovery/phase4-types";

const CP_ID = "GEO-CP-010" as const;
const q = (value: number, denominator = 1) => rational(value, denominator);

function variantIndex(seed: string, length: number): number {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % length;
}
const lengthText = (value: ReturnType<typeof rational>) => value.denominator === 1n ? `${value.numerator} cm` : `${value.numerator}/${value.denominator} cm`;

function centrePerpendicularDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "O", label: "O", x: 100, y: 100 },
      { id: "A", label: "A", x: 55, y: 40 },
      { id: "B", label: "B", x: 145, y: 40 },
      { id: "M", label: "M", x: 100, y: 40 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "OM", fromPointId: "O", toPointId: "M" },
      { id: "AM", fromPointId: "A", toPointId: "M" },
      { id: "MB", fromPointId: "M", toPointId: "B" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 75 }],
    angleMarks: [],
    rightAngleMarks: [{ id: "right-om-ab", vertexPointId: "M", firstRayPointId: "O", secondRayPointId: "A" }],
    equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function equalCentreDistanceDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "O", label: "O", x: 100, y: 100 },
      { id: "A", label: "A", x: 40, y: 55 }, { id: "B", label: "B", x: 160, y: 55 }, { id: "M", label: "M", x: 100, y: 55 },
      { id: "C", label: "C", x: 40, y: 145 }, { id: "D", label: "D", x: 160, y: 145 }, { id: "N", label: "N", x: 100, y: 145 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" }, { id: "CD", fromPointId: "C", toPointId: "D" },
      { id: "OM", fromPointId: "O", toPointId: "M" }, { id: "ON", fromPointId: "O", toPointId: "N" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 75 }],
    angleMarks: [],
    rightAngleMarks: [
      { id: "right-m", vertexPointId: "M", firstRayPointId: "O", secondRayPointId: "A" },
      { id: "right-n", vertexPointId: "N", firstRayPointId: "O", secondRayPointId: "C" },
    ],
    equalLengthMarks: [{ id: "equal-om-on", segmentIds: ["OM", "ON"] }],
    parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generateCentrePerpendicular(seed: string): Phase4PrototypeQuestion {
  const scalePool = [1, 2, 3, 4, 5] as const;
  const scale = scalePool[variantIndex(seed, scalePool.length)]!;
  const chord = 12 * scale;
  const half = 6 * scale;
  const clueIds = ["AB_IS_CHORD", "OM_PERPENDICULAR_AB", "AB_GIVEN"] as const;
  const expected = `${half} cm`;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return lengthText(chordHalfFromCentrePerpendicular(q(chord)));
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Centre-perpendicular chord solver mismatch");
  const oracle = new CoordinateOracle({
    O: { x: q(0), y: q(0) }, A: { x: q(-6 * scale), y: q(8 * scale) }, B: { x: q(6 * scale), y: q(8 * scale) }, M: { x: q(0), y: q(8 * scale) },
  });
  const passed = oracle.pointOnCircle("A", "O", q(100 * scale * scale))
    && oracle.pointOnCircle("B", "O", q(100))
    && oracle.perpendicular("O", "M", "A", "B")
    && oracle.equalLengths("A", "M", "M", "B")
    && equals(oracle.squaredLength("A", "B"), q(chord * chord));
  const theoremTrace: TheoremId[] = ["PERPENDICULAR_FROM_CENTRE_BISECTS_CHORD"];
  const proofEvents: GeoProofEvent[] = [{ kind: "SEGMENT_RATIO", left: "AM", right: "MB", ratio: q(1), reason: "PERPENDICULAR_FROM_CENTRE_BISECTS_CHORD" }];
  const options = buildOptions(expected, [
    { text: `${chord} cm`, misconceptionId: "USED_FULL_CHORD_AS_HALF", rationale: "Uses the whole chord as one half." },
    { text: `${2 * chord} cm`, misconceptionId: "DOUBLED_CHORD", rationale: "Doubles the chord instead of bisecting it." },
    { text: `${chord / 3} cm`, misconceptionId: "DIVIDED_CHORD_INTO_THREE", rationale: "Divides the chord into three parts instead of two equal parts." },
  ], seed);
  return finalizePhase4Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP010-CENTRE-PERP-CHORD-V1", solveMode: "findHalfChordFromCentrePerpendicular", difficulty: "Easy", seed,
    stem: `In a circle with centre O, AB is a chord. OM is perpendicular to AB at M. If AB = ${chord} cm, find AM.`,
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "A perpendicular drawn from the centre of a circle to a chord bisects that chord.",
      `So M is the midpoint of AB, and AM = ${chord}/2 = ${half} cm.`
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("COORDINATE_ORACLE", passed, ["A and B lie exactly on the hidden circle", "OM is exactly perpendicular to AB", "AM = MB exactly", `AB has exact length ${chord}`]),
    diagramModel: centrePerpendicularDiagram(),
  });
}

function generateEqualCentreDistanceChord(seed: string): Phase4PrototypeQuestion {
  const scalePool = [1, 2, 3, 4, 5] as const;
  const scale = scalePool[variantIndex(seed, scalePool.length)]!;
  const chord = 8 * scale;
  const clueIds = ["AB_AND_CD_ARE_CHORDS", "OM_ON_ARE_EQUAL_PERPENDICULAR_DISTANCES", "AB_GIVEN"] as const;
  const expected = `${chord} cm`;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return lengthText(equalChordLengthFromEqualCentreDistance(q(chord)));
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Equal-centre-distance chord solver mismatch");
  const oracle = new CoordinateOracle({
    O: { x: q(0), y: q(0) }, A: { x: q(-4 * scale), y: q(3 * scale) }, B: { x: q(4 * scale), y: q(3 * scale) }, M: { x: q(0), y: q(3 * scale) },
    C: { x: q(-4 * scale), y: q(-3 * scale) }, D: { x: q(4 * scale), y: q(-3 * scale) }, N: { x: q(0), y: q(-3 * scale) },
  });
  const passed = ["A", "B", "C", "D"].every((point) => oracle.pointOnCircle(point, "O", q(25 * scale * scale)))
    && oracle.perpendicular("O", "M", "A", "B") && oracle.perpendicular("O", "N", "C", "D")
    && oracle.equalLengths("O", "M", "O", "N") && oracle.equalLengths("A", "B", "C", "D")
    && equals(oracle.squaredLength("A", "B"), q(chord * chord));
  const theoremTrace: TheoremId[] = ["EQUAL_CHORD_EQUAL_CENTRE_DISTANCE"];
  const proofEvents: GeoProofEvent[] = [{ kind: "SEGMENT_RATIO", left: "AB", right: "CD", ratio: q(1), reason: "EQUAL_CHORD_EQUAL_CENTRE_DISTANCE" }];
  const options = buildOptions(expected, [
    { text: `${chord / 2} cm`, misconceptionId: "HALVED_EQUAL_CHORD", rationale: "Halves the known chord even though equal centre distances imply equal whole chords." },
    { text: `${2 * chord} cm`, misconceptionId: "DOUBLED_EQUAL_CHORD", rationale: "Doubles the known chord rather than matching it." },
    { text: "Cannot be determined", misconceptionId: "MISSED_EQUAL_CHORD_THEOREM", rationale: "Misses the equal-distance-from-centre chord theorem." },
  ], seed);
  return finalizePhase4Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP010-EQUAL-CENTRE-DISTANCE-CHORD-V1", solveMode: "findEqualChordFromEqualCentreDistance", difficulty: "Easy", seed,
    stem: `AB and CD are chords of the same circle with centre O. Their perpendicular distances from O are equal. If AB = ${chord} cm, find CD.`,
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "Chords of the same circle that are equally distant from the centre are equal in length.",
      `Since AB and CD are at equal perpendicular distances from O, CD = AB = ${chord} cm.`
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("COORDINATE_ORACLE", passed, ["all four chord endpoints lie exactly on one hidden circle", "OM and ON are equal perpendicular centre distances", `AB and CD have equal exact squared lengths ${chord * chord}`]),
    diagramModel: equalCentreDistanceDiagram(),
  });
}

export const GEO_CP_010_PHASE4_PROTOTYPES: readonly Phase4PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP010-CENTRE-PERP-CHORD-V1", cpId: CP_ID, solveMode: "findHalfChordFromCentrePerpendicular", generate: generateCentrePerpendicular },
  { temporaryPrototypeId: "GEO-TMP-CP010-EQUAL-CENTRE-DISTANCE-CHORD-V1", cpId: CP_ID, solveMode: "findEqualChordFromEqualCentreDistance", generate: generateEqualCentreDistanceChord },
]);
