import {
  CoordinateOracle,
  angle,
  centralAngleFromInscribed,
  cross,
  cyclicOppositeAngle,
  dot,
  equals,
  rational,
  vectorBetween,
  type GeoDiagramModel,
  type GeoProofEvent,
  type TheoremId,
} from "../../../../../../shared/geometry";
import {
  approximate,
  buildExplanation,
  buildOptions,
  finalizePhase4Question,
  numericAngleDegrees,
  proveClueMinimality,
  verifier,
} from "../discovery/phase4-utils";
import type { Phase4PrototypeDefinition, Phase4PrototypeQuestion } from "../discovery/phase4-types";

const CP_ID = "GEO-CP-011" as const;
const q = (value: number, denominator = 1) => rational(value, denominator);

function polarPoint(id: string, label: string, degrees: number, radius = 75): { id: string; label: string; x: number; y: number } {
  const radians = degrees * Math.PI / 180;
  return { id, label, x: 100 + radius * Math.cos(radians), y: 100 + radius * Math.sin(radians) };
}

function centralInscribedDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "O", label: "O", x: 100, y: 100 },
      polarPoint("A", "A", -20), polarPoint("B", "B", -80), polarPoint("P", "P", 150),
    ],
    segments: [
      { id: "OA", fromPointId: "O", toPointId: "A" }, { id: "OB", fromPointId: "O", toPointId: "B" },
      { id: "PA", fromPointId: "P", toPointId: "A" }, { id: "PB", fromPointId: "P", toPointId: "B" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 75 }],
    angleMarks: [
      { id: "inscribed-apb", firstPointId: "A", vertexPointId: "P", secondPointId: "B", label: "45°" },
      { id: "central-aob", firstPointId: "A", vertexPointId: "O", secondPointId: "B", label: "x" },
    ],
    rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [{ id: "arc-ab", circleId: "circle-o", fromPointId: "A", toPointId: "B" }], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function cyclicDiagram(): GeoDiagramModel {
  return {
    points: [polarPoint("A", "A", 250), polarPoint("B", "B", 5), polarPoint("C", "C", 100), polarPoint("D", "D", 210), { id: "O", label: "O", x: 100, y: 100 }],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" }, { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "CD", fromPointId: "C", toPointId: "D" }, { id: "DA", fromPointId: "D", toPointId: "A" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 75 }],
    angleMarks: [
      { id: "angle-a", firstPointId: "B", vertexPointId: "A", secondPointId: "D", label: "110°" },
      { id: "angle-c", firstPointId: "B", vertexPointId: "C", secondPointId: "D", label: "x" },
    ],
    rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generateCentralFromInscribed(seed: string): Phase4PrototypeQuestion {
  const clueIds = ["A_B_P_ON_SAME_CIRCLE", "O_IS_CENTRE", "ANGLE_APB_IS_45", "ANGLES_SUBTEND_SAME_ARC_AB"] as const;
  const expected = "90°";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const value = centralAngleFromInscribed(angle(45));
    return `${value.numerator}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Central-from-inscribed solver mismatch");
  const oracle = new CoordinateOracle({ O: { x: q(0), y: q(0) }, A: { x: q(5), y: q(0) }, B: { x: q(0), y: q(5) }, P: { x: q(-5), y: q(0) } });
  const pa = vectorBetween(oracle.coordinate("P"), oracle.coordinate("A"));
  const pb = vectorBetween(oracle.coordinate("P"), oracle.coordinate("B"));
  const inscribedDot = dot(pa, pb);
  const inscribedCross = cross(pa, pb);
  const passed = ["A", "B", "P"].every((point) => oracle.pointOnCircle(point, "O", q(25)))
    && oracle.perpendicular("O", "A", "O", "B")
    && equals(inscribedDot, inscribedCross)
    && inscribedDot.numerator > 0n;
  const theoremTrace: TheoremId[] = ["CENTRAL_ANGLE_DOUBLE_INSCRIBED"];
  const options = buildOptions(expected, [
    { text: "45°", misconceptionId: "CENTRAL_EQUALS_INSCRIBED", rationale: "Treats the central and inscribed angles as equal." },
    { text: "22.5°", misconceptionId: "CENTRAL_HALF_INSCRIBED", rationale: "Halves the inscribed angle instead of doubling it." },
    { text: "135°", misconceptionId: "USED_SUPPLEMENT_OF_INSCRIBED", rationale: "Uses the supplement of the inscribed angle." },
  ], seed);
  return finalizePhase4Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP011-CENTRAL-FROM-INSCRIBED-V1", solveMode: "findCentralAngleFromInscribed", difficulty: "Easy", seed,
    stem: "A, B and P lie on a circle with centre O. ∠APB = 45°, and both ∠APB and ∠AOB subtend arc AB. Find ∠AOB.",
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "The angle subtended by an arc at the centre is twice the angle subtended by the same arc at the circumference.",
      "Therefore ∠AOB = 2 × 45° = 90°.",
    ]),
    theoremTrace, proofEvents: [], displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("COORDINATE_ORACLE", passed, ["A, B and P lie exactly on one hidden circle", "hidden OA and OB are perpendicular, giving a 90° central angle", "hidden vectors PA and PB have equal positive dot and cross products, establishing a 45° inscribed angle independently"]),
    diagramModel: centralInscribedDiagram(),
  });
}

function generateCyclicOpposite(seed: string): Phase4PrototypeQuestion {
  const clueIds = ["ABCD_IS_CYCLIC", "ANGLE_A_IS_110"] as const;
  const expected = "70°";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const value = cyclicOppositeAngle(angle(110));
    return `${value.numerator}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Cyclic-opposite solver mismatch");
  const unit = (degrees: number) => ({ x: Math.cos(degrees * Math.PI / 180), y: Math.sin(degrees * Math.PI / 180) });
  const A = unit(270); const B = unit(0); const C = unit(80); const D = unit(220);
  const radii = [A, B, C, D].map((point) => Math.hypot(point.x, point.y));
  const measuredA = numericAngleDegrees(B, A, D);
  const measuredC = numericAngleDegrees(B, C, D);
  const passed = radii.every((radius) => approximate(radius, 1, 1e-10))
    && approximate(measuredA, 110, 1e-8) && approximate(measuredC, 70, 1e-8);
  const theoremTrace: TheoremId[] = ["CYCLIC_OPPOSITE_SUPPLEMENTARY"];
  const proofEvents: GeoProofEvent[] = [{ kind: "ANGLE_SUM", angleIds: ["A", "C"], total: angle(180), reason: "CYCLIC_OPPOSITE_SUPPLEMENTARY" }];
  const options = buildOptions(expected, [
    { text: "110°", misconceptionId: "CYCLIC_OPPOSITE_EQUAL", rationale: "Treats opposite cyclic angles as equal instead of supplementary." },
    { text: "55°", misconceptionId: "HALVED_CYCLIC_ANGLE", rationale: "Halves the known angle without a valid theorem." },
    { text: "250°", misconceptionId: "SUBTRACTED_FROM_360", rationale: "Uses a full-turn subtraction instead of the cyclic supplementary relation." },
  ], seed);
  return finalizePhase4Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP011-CYCLIC-OPPOSITE-V1", solveMode: "findOppositeCyclicAngle", difficulty: "Easy", seed,
    stem: "ABCD is a cyclic quadrilateral. If ∠DAB = 110°, find the opposite angle ∠BCD.",
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "Opposite angles of a cyclic quadrilateral add to 180°.",
      "So ∠BCD = 180° − 110° = 70°.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("HIGH_PRECISION_COORDINATE", passed, ["four independently placed verifier points lie on one unit circle", `coordinate angle at A = ${measuredA.toFixed(8)}°`, `coordinate angle at C = ${measuredC.toFixed(8)}°`]),
    diagramModel: cyclicDiagram(),
  });
}

export const GEO_CP_011_PHASE4_PROTOTYPES: readonly Phase4PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP011-CENTRAL-FROM-INSCRIBED-V1", cpId: CP_ID, solveMode: "findCentralAngleFromInscribed", generate: generateCentralFromInscribed },
  { temporaryPrototypeId: "GEO-TMP-CP011-CYCLIC-OPPOSITE-V1", cpId: CP_ID, solveMode: "findOppositeCyclicAngle", generate: generateCyclicOpposite },
]);
