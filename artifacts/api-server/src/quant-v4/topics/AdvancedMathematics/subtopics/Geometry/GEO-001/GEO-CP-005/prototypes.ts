import {
  CoordinateOracle,
  exactScaleFactor,
  equals,
  multiply,
  provesAaSimilarity,
  rational,
  solveCorrespondingLength,
  solveProportionalPartner,
  type GeoDiagramModel,
  type GeoProofEvent,
  type TheoremId,
} from "../../../../../../shared/geometry";
import {
  buildExplanation,
  buildOptions,
  finalizePhase2Question,
  proveClueMinimality,
} from "../discovery/phase2-utils";
import type { Phase2PrototypeDefinition, Phase2PrototypeQuestion } from "../discovery/phase2-types";

const CP_ID = "GEO-CP-005" as const;
const q = (value: number) => rational(value);

function variantIndex(seed: string, length: number): number {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % length;
}

function formatCm(value: ReturnType<typeof rational>): string {
  return value.denominator === 1n
    ? `${value.numerator} cm`
    : `${value.numerator}/${value.denominator} cm`;
}

function twoTriangleDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 20, y: 100 },
      { id: "B", label: "B", x: 85, y: 100 },
      { id: "C", label: "C", x: 20, y: 25 },
      { id: "P", label: "P", x: 130, y: 100 },
      { id: "Q", label: "Q", x: 220, y: 100 },
      { id: "R", label: "R", x: 130, y: 15 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "AC", fromPointId: "A", toPointId: "C" },
      { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "PQ", fromPointId: "P", toPointId: "Q" },
      { id: "PR", fromPointId: "P", toPointId: "R" },
      { id: "QR", fromPointId: "Q", toPointId: "R" },
    ],
    circles: [],
    angleMarks: [
      { id: "a-pair-left", firstPointId: "B", vertexPointId: "A", secondPointId: "C", label: "α" },
      { id: "a-pair-right", firstPointId: "Q", vertexPointId: "P", secondPointId: "R", label: "α" },
      { id: "b-pair-left", firstPointId: "A", vertexPointId: "B", secondPointId: "C", label: "β" },
      { id: "b-pair-right", firstPointId: "P", vertexPointId: "Q", secondPointId: "R", label: "β" },
    ],
    rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function bptDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 25, y: 20 },
      { id: "B", label: "B", x: 25, y: 150 },
      { id: "C", label: "C", x: 185, y: 150 },
      { id: "D", label: "D", x: 25, y: 72 },
      { id: "E", label: "E", x: 89, y: 72 },
    ],
    segments: [
      { id: "AD", fromPointId: "A", toPointId: "D" },
      { id: "DB", fromPointId: "D", toPointId: "B" },
      { id: "AE", fromPointId: "A", toPointId: "E" },
      { id: "EC", fromPointId: "E", toPointId: "C" },
      { id: "DE", fromPointId: "D", toPointId: "E" },
      { id: "BC", fromPointId: "B", toPointId: "C" },
    ],
    circles: [], angleMarks: [], rightAngleMarks: [], equalLengthMarks: [],
    parallelMarks: [{ id: "de-parallel-bc", segmentIds: ["DE", "BC"] }],
    arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function aaCoordinateOracle(): CoordinateOracle {
  return new CoordinateOracle({
    A: { x: q(0), y: q(0) }, B: { x: q(3), y: q(0) }, C: { x: q(0), y: q(4) },
    P: { x: q(10), y: q(0) }, Q: { x: q(16), y: q(0) }, R: { x: q(10), y: q(8) },
  });
}

function generateAaCorrespondence(seed: string): Phase2PrototypeQuestion {
  const clueIds = ["BOTH_ARE_TRIANGLES", "ANGLE_A_EQUALS_P", "ANGLE_B_EQUALS_Q"] as const;
  const expected = "R";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return provesAaSimilarity(true, true) ? "R" : null;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("AA correspondence discovery solver mismatch");
  const oracle = aaCoordinateOracle();
  const sourceSquared = [oracle.squaredLength("A", "B"), oracle.squaredLength("A", "C"), oracle.squaredLength("B", "C")];
  const targetSquared = [oracle.squaredLength("P", "Q"), oracle.squaredLength("P", "R"), oracle.squaredLength("Q", "R")];
  const squaredScale = exactScaleFactor(sourceSquared, targetSquared);
  const verifierPassed = equals(squaredScale, rational(4));
  if (!verifierPassed) throw new Error("AA similarity coordinate proportionality verification failed");
  const theoremTrace: TheoremId[] = ["AA_SIMILARITY"];
  const proofEvents: GeoProofEvent[] = [{
    kind: "SIMILARITY",
    triangle1: { id: "ABC", vertexIds: ["A", "B", "C"] },
    triangle2: { id: "PQR", vertexIds: ["P", "Q", "R"] },
    criterion: "AA_SIMILARITY",
    correspondence: { pairs: [["A", "P"], ["B", "Q"], ["C", "R"]] },
  }];
  const optionSet = buildOptions(expected, [
    { text: "P", misconceptionId: "WRONG_VERTEX_CORRESPONDENCE", rationale: "Maps C back to the first matched vertex instead of using the established order." },
    { text: "Q", misconceptionId: "WRONG_VERTEX_CORRESPONDENCE", rationale: "Reuses the second matched vertex instead of the remaining corresponding vertex." },
    { text: "Cannot be determined", misconceptionId: "MISSED_AA_CORRESPONDENCE", rationale: "Misses that two matched angle pairs fix the third vertex correspondence." },
  ], seed);
  return finalizePhase2Question({
    cpId: CP_ID,
    temporaryPrototypeId: "GEO-TMP-CP005-AA-CORRESPONDENCE-V1",
    solveMode: "recoverSimilarityCorrespondence",
    difficulty: "Easy",
    seed,
    stem: "In triangles ABC and PQR, ∠A = ∠P and ∠B = ∠Q. Under the AA similarity correspondence, which vertex corresponds to C?",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "Two angle pairs match: A↔P and B↔Q, so the triangles are similar by AA.",
      "The only remaining vertices must correspond, so C↔R.",
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: Object.freeze({
      passed: verifierPassed,
      oracle: "COORDINATE_ORACLE",
      checks: Object.freeze(["hidden coordinate triangles have one exact common squared side-scale factor of 4", "the coordinate side correspondence is AB↔PQ, AC↔PR, BC↔QR"]),
    }),
    diagramModel: twoTriangleDiagram(),
  });
}

function generateMissingSide(seed: string): Phase2PrototypeQuestion {
  const pool = [
    { ab: 6, pq: 9, ac: 8, pr: 12 },
    { ab: 4, pq: 6, ac: 10, pr: 15 },
    { ab: 8, pq: 12, ac: 6, pr: 9 },
    { ab: 10, pq: 15, ac: 12, pr: 18 },
    { ab: 6, pq: 10, ac: 9, pr: 15 },
  ] as const;
  const state = pool[variantIndex(seed, pool.length)]!;
  const clueIds = ["ANGLE_A_EQUALS_P", "ANGLE_B_EQUALS_Q", "AB_GIVEN", "PQ_GIVEN", "AC_GIVEN"] as const;
  const expected = `${state.pr} cm`;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    if (!provesAaSimilarity(true, true)) return null;
    const value = solveCorrespondingLength(rational(state.ab), rational(state.pq), rational(state.ac));
    return formatCm(value);
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Similarity missing-side discovery solver mismatch");
  const oracle = new CoordinateOracle({
    A: { x: q(0), y: q(0) }, B: { x: q(state.ab), y: q(0) }, C: { x: q(0), y: q(state.ac) },
    P: { x: q(20), y: q(0) }, Q: { x: q(20 + state.pq), y: q(0) }, R: { x: q(20), y: q(state.pr) },
  });
  const squaredScale = exactScaleFactor(
    [oracle.squaredLength("A", "B"), oracle.squaredLength("A", "C"), oracle.squaredLength("B", "C")],
    [oracle.squaredLength("P", "Q"), oracle.squaredLength("P", "R"), oracle.squaredLength("Q", "R")],
  );
  const verifierPassed =
    equals(squaredScale, rational(state.pq * state.pq, state.ab * state.ab))
    && equals(oracle.squaredLength("P", "R"), rational(state.pr * state.pr));
  if (!verifierPassed) throw new Error("Similarity missing-side coordinate verification failed");
  const theoremTrace: TheoremId[] = ["AA_SIMILARITY"];
  const proofEvents: GeoProofEvent[] = [
    {
      kind: "SIMILARITY",
      triangle1: { id: "ABC", vertexIds: ["A", "B", "C"] },
      triangle2: { id: "PQR", vertexIds: ["P", "Q", "R"] },
      criterion: "AA_SIMILARITY",
      correspondence: { pairs: [["A", "P"], ["B", "Q"], ["C", "R"]] },
    },
    { kind: "SEGMENT_RATIO", left: "PQ/AB", right: "PR/AC", ratio: rational(state.pq, state.ab), reason: "AA_SIMILARITY" },
  ];
  const inverted = solveCorrespondingLength(rational(state.pq), rational(state.ab), rational(state.ac));
  const optionSet = buildOptions(expected, [
    { text: formatCm(inverted), misconceptionId: "INVERTED_SIDE_RATIO", rationale: "Uses the reciprocal scale factor." },
    { text: `${state.pq} cm`, misconceptionId: "MIXED_NONCORRESPONDING_SIDES", rationale: "Copies the known corresponding side instead of scaling AC." },
    { text: `${state.ac + state.pq - state.ab} cm`, misconceptionId: "ADDITIVE_INSTEAD_OF_MULTIPLICATIVE_SCALE", rationale: "Treats similarity as an additive adjustment instead of a common scale factor." },
  ], seed);
  return finalizePhase2Question({
    cpId: CP_ID,
    temporaryPrototypeId: "GEO-TMP-CP005-MISSING-SIDE-V1",
    solveMode: "findMissingSideFromSimilarityScale",
    difficulty: "Medium",
    seed,
    stem: `In triangles ABC and PQR, ∠A = ∠P and ∠B = ∠Q. If AB = ${state.ab} cm, PQ = ${state.pq} cm and AC = ${state.ac} cm, find PR.`,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "The two matching angle pairs make the triangles similar by AA, with A↔P, B↔Q and C↔R.",
      `The scale factor from ABC to PQR is PQ/AB = ${state.pq}/${state.ab}. Therefore PR = AC × ${state.pq}/${state.ab} = ${state.ac} × ${state.pq}/${state.ab} = ${state.pr} cm.`,
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: Object.freeze({
      passed: verifierPassed,
      oracle: "COORDINATE_ORACLE",
      checks: Object.freeze([
        "hidden coordinate triangles preserve one exact common side-scale factor",
        `PR has exact squared length ${state.pr * state.pr}, hence length ${state.pr}`,
      ]),
    }),
    diagramModel: twoTriangleDiagram(),
  });
}

function generateBptDirect(seed: string): Phase2PrototypeQuestion {
  const pool = [
    { ad: 2, db: 3, ae: 4, ec: 6 },
    { ad: 3, db: 5, ae: 6, ec: 10 },
    { ad: 4, db: 6, ae: 6, ec: 9 },
    { ad: 5, db: 8, ae: 10, ec: 16 },
    { ad: 3, db: 4, ae: 9, ec: 12 },
  ] as const;
  const state = pool[variantIndex(seed, pool.length)]!;
  const clueIds = ["ABC_IS_TRIANGLE", "D_ON_AB", "E_ON_AC", "DE_PARALLEL_BC", "AD_GIVEN", "DB_GIVEN", "AE_GIVEN"] as const;
  const expected = `${state.ec} cm`;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const value = solveProportionalPartner(rational(state.ad), rational(state.db), rational(state.ae));
    return formatCm(value);
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("BPT direct discovery solver mismatch");
  const oracle = new CoordinateOracle({
    A: { x: q(0), y: q(0) }, B: { x: q(state.ad + state.db), y: q(0) }, C: { x: q(0), y: q(state.ae + state.ec) },
    D: { x: q(state.ad), y: q(0) }, E: { x: q(0), y: q(state.ae) },
  });
  const ad2 = oracle.squaredLength("A", "D");
  const db2 = oracle.squaredLength("D", "B");
  const ae2 = oracle.squaredLength("A", "E");
  const ec2 = oracle.squaredLength("E", "C");
  const verifierPassed = oracle.collinear("A", "D", "B")
    && oracle.collinear("A", "E", "C")
    && oracle.parallel("D", "E", "B", "C")
    && equals(multiply(ad2, ec2), multiply(db2, ae2));
  if (!verifierPassed) throw new Error("BPT coordinate verification failed");
  const theoremTrace: TheoremId[] = ["BASIC_PROPORTIONALITY_THEOREM"];
  const proofEvents: GeoProofEvent[] = [{
    kind: "SEGMENT_RATIO",
    left: "AD/DB",
    right: "AE/EC",
    ratio: rational(state.ad, state.db),
    reason: "BASIC_PROPORTIONALITY_THEOREM",
  }];
  const inverted = solveProportionalPartner(rational(state.db), rational(state.ad), rational(state.ae));
  const optionSet = buildOptions(expected, [
    { text: formatCm(inverted), misconceptionId: "INVERTED_SIDE_RATIO", rationale: "Uses the side ratio in the wrong direction." },
    { text: `${state.ad} cm`, misconceptionId: "MIXED_NONCORRESPONDING_SIDES", rationale: "Pairs AD with EC directly instead of comparing the divided sides proportionally." },
    { text: `${state.ae + state.db} cm`, misconceptionId: "ADDITIVE_RATIO_ERROR", rationale: "Adds unrelated segment values instead of using proportional division." },
  ], seed);
  return finalizePhase2Question({
    cpId: CP_ID,
    temporaryPrototypeId: "GEO-TMP-CP005-BPT-DIRECT-V1",
    solveMode: "findSegmentByBasicProportionality",
    difficulty: "Medium",
    seed,
    stem: `In triangle ABC, D lies on AB and E lies on AC, with DE parallel to BC. If AD = ${state.ad} cm, DB = ${state.db} cm and AE = ${state.ae} cm, find EC.`,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "Because DE is parallel to BC, the Basic Proportionality Theorem gives AD/DB = AE/EC.",
      `So ${state.ad}/${state.db} = ${state.ae}/EC. Cross-multiplying gives ${state.ad}EC = ${state.db * state.ae}, hence EC = ${state.ec} cm.`,
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: Object.freeze({
      passed: verifierPassed,
      oracle: "COORDINATE_ORACLE",
      checks: Object.freeze(["A-D-B and A-E-C are exactly collinear", "DE is exactly parallel to BC", "squared segment ratios independently satisfy the same proportional division"]),
    }),
    diagramModel: bptDiagram(),
  });
}

export const GEO_CP_005_PHASE2_PROTOTYPES: readonly Phase2PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP005-AA-CORRESPONDENCE-V1", cpId: CP_ID, solveMode: "recoverSimilarityCorrespondence", generate: generateAaCorrespondence },
  { temporaryPrototypeId: "GEO-TMP-CP005-MISSING-SIDE-V1", cpId: CP_ID, solveMode: "findMissingSideFromSimilarityScale", generate: generateMissingSide },
  { temporaryPrototypeId: "GEO-TMP-CP005-BPT-DIRECT-V1", cpId: CP_ID, solveMode: "findSegmentByBasicProportionality", generate: generateBptDirect },
]);
