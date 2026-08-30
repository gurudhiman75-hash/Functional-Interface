import {
  CoordinateOracle,
  exactRationalSquareRoot,
  equals,
  multiply,
  rational,
  subtract,
  type GeoDiagramModel,
  type GeoProofEvent,
  type TheoremId,
} from "../../../../../../shared/geometry";
import { buildExplanation, buildOptions, finalizePhase5Question, proveClueMinimality, verifier } from "../discovery/phase5-utils";
import type { Phase5PrototypeDefinition, Phase5PrototypeQuestion } from "../discovery/phase5-types";

const CP_ID = "GEO-CP-014" as const;
const q = (value: number, denominator = 1) => rational(value, denominator);
const lengthText = (value: ReturnType<typeof rational>) => value.denominator === 1n ? `${value.numerator} cm` : `${value.numerator}/${value.denominator} cm`;

function diagram(): GeoDiagramModel {
  return {
    points: [
      { id: "O", label: "O", x: 90, y: 125 },
      { id: "A", label: "A", x: 35, y: 55 }, { id: "B", label: "B", x: 165, y: 55 },
      { id: "M", label: "M", x: 90, y: 55 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" }, { id: "OM", fromPointId: "O", toPointId: "M" },
      { id: "OA", fromPointId: "O", toPointId: "A" }, { id: "AM", fromPointId: "A", toPointId: "M" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 88 }],
    angleMarks: [], rightAngleMarks: [{ id: "right-m", vertexPointId: "M", firstRayPointId: "O", secondRayPointId: "A" }],
    equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generate(seed: string): Phase5PrototypeQuestion {
  const clueIds = ["O_CENTRE_AB_CHORD", "OM_PERPENDICULAR_AB_AT_M", "OA_IS_10", "OM_IS_8"] as const;
  const expected = "12 cm";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const halfSquare = subtract(multiply(q(10), q(10)), multiply(q(8), q(8)));
    const halfChord = exactRationalSquareRoot(halfSquare);
    return lengthText(multiply(halfChord, q(2)));
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Chord + Pythagoras mixed solver mismatch");
  const oracle = new CoordinateOracle({ O: { x: q(0), y: q(0) }, A: { x: q(-6), y: q(8) }, B: { x: q(6), y: q(8) }, M: { x: q(0), y: q(8) } });
  const passed = oracle.pointOnCircle("A", "O", q(100)) && oracle.pointOnCircle("B", "O", q(100))
    && oracle.perpendicular("O", "M", "A", "B") && oracle.equalLengths("A", "M", "M", "B")
    && equals(oracle.squaredLength("O", "M"), q(64)) && equals(oracle.squaredLength("A", "B"), q(144));
  const theoremTrace: TheoremId[] = ["PERPENDICULAR_FROM_CENTRE_BISECTS_CHORD", "PYTHAGORAS"];
  const proofEvents: GeoProofEvent[] = [{ kind: "SEGMENT_RATIO", left: "AM", right: "MB", ratio: q(1), reason: "PERPENDICULAR_FROM_CENTRE_BISECTS_CHORD" }];
  const options = buildOptions(expected, [
    { text: "6 cm", misconceptionId: "STOPPED_AT_HALF_CHORD", rationale: "Finds AM correctly but forgets that AB contains two equal halves." },
    { text: "18 cm", misconceptionId: "ADDED_RADIUS_AND_DISTANCE", rationale: "Adds OA and OM rather than using the right triangle." },
    { text: "2 cm", misconceptionId: "SUBTRACTED_RADIUS_AND_DISTANCE", rationale: "Uses 10 − 8 instead of Pythagoras." },
  ], seed);
  return finalizePhase5Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP014-CHORD-PYTHAGORAS-V1", solveMode: "findChordFromRadiusAndCentreDistance", difficulty: "Medium", seed,
    stem: "In a circle with centre O, AB is a chord. OM is perpendicular to AB at M. If OA = 10 cm and OM = 8 cm, find AB.",
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "Because OM is perpendicular to chord AB from the centre, M bisects the chord. So AM = MB.",
      "Triangle OMA is right-angled at M. With OA = 10 cm and OM = 8 cm, Pythagoras gives AM² = 10² − 8² = 36, so AM = 6 cm.",
      "Therefore AB = AM + MB = 6 + 6 = 12 cm.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("COORDINATE_ORACLE", passed, ["hidden chord endpoints lie on the exact radius-10 circle", "OM is exactly perpendicular to AB", "M is the exact chord midpoint", "OM = 8 and AB = 12 exactly"]),
    diagramModel: diagram(),
  });
}

export const GEO_CP_014_CHORD_PYTHAGORAS_PHASE5_PROTOTYPE: Phase5PrototypeDefinition = Object.freeze({
  temporaryPrototypeId: "GEO-TMP-CP014-CHORD-PYTHAGORAS-V1", cpId: CP_ID, solveMode: "findChordFromRadiusAndCentreDistance", generate,
});
