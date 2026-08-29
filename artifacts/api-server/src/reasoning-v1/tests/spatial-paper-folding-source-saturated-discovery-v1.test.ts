import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_001_MULTISHAPE_DISCOVERY_WAVE1_AUTHORITY,
  PfcDiscoveryWave1Error,
  generatePfcMultishapeDiscoveryWave1,
  pfcMappedCutFingerprintWave1,
  pfcMultishapeDiscoveryScenariosWave1,
  solvePfcForwardScenarioWave1,
  solvePfcReverseInferenceWave1,
  type PfcForwardScenarioWave1,
} from "../foundation/spatial/paper-folding-multishape-discovery-v1";
import {
  TPF_001_DISCOVERY_WAVE1_AUTHORITY,
  TpfDiscoveryWave1Error,
  generateTpfDiscoveryWave1,
  solveTransparentPatternFoldWave1,
  tpfDiscoveryScenariosWave1,
} from "../foundation/spatial/transparent-pattern-folding-discovery-v1";

assert.equal(PFC_001_MULTISHAPE_DISCOVERY_WAVE1_AUTHORITY.status, "EXECUTABLE_DISCOVERY_WAVE_NOT_SATURATION_FREEZE");
assert.equal(PFC_001_MULTISHAPE_DISCOVERY_WAVE1_AUTHORITY.permanentQlAllocationAllowed, false);
assert.equal(PFC_001_MULTISHAPE_DISCOVERY_WAVE1_AUTHORITY.questionStudioAllowed, false);
assert.deepEqual(PFC_001_MULTISHAPE_DISCOVERY_WAVE1_AUTHORITY.sourceSheetShapes, ["SQUARE", "RECTANGLE", "CIRCLE"]);

const scenarios = pfcMultishapeDiscoveryScenariosWave1();
const pfcSolutions = generatePfcMultishapeDiscoveryWave1();
assert.equal(scenarios.length, 12);
assert.equal(pfcSolutions.length, 12);
assert.equal(new Set(pfcSolutions.map((item) => item.scenarioId)).size, 12);
assert.equal(new Set(pfcSolutions.map((item) => item.fingerprint)).size, 12);
assert.deepEqual([...new Set(pfcSolutions.map((item) => item.sourceShape))].sort(), ["CIRCLE", "RECTANGLE", "SQUARE"]);
assert.equal(pfcSolutions.filter((item) => item.sourceShape === "CIRCLE").every((item) => item.usedAnalyticCircleEngine), true);
assert.equal(pfcSolutions.filter((item) => item.sourceShape !== "CIRCLE").every((item) => !item.usedAnalyticCircleEngine), true);

const rectSingle = pfcSolutions.find((item) => item.scenarioId === "PFC-W1-RECT-V-HOLE")!;
assert.equal(rectSingle.affectedLayersByCut.H1, 2);
assert.equal(rectSingle.mappedCuts.length, 2);

const rectDouble = pfcSolutions.find((item) => item.scenarioId === "PFC-W1-RECT-DOUBLE-TRIANGLE")!;
assert.equal(rectDouble.affectedLayersByCut.T1, 4);
assert.equal(rectDouble.mappedCuts.length, 4);
assert.equal(new Set(rectDouble.mappedCuts.map(pfcMappedCutFingerprintWave1)).size, 4);

const circleSingle = pfcSolutions.find((item) => item.scenarioId === "PFC-W1-CIRCLE-V-HOLE")!;
assert.equal(circleSingle.affectedLayersByCut.H1, 2);
assert.equal(circleSingle.mappedCuts.length, 2);

const circleDouble = pfcSolutions.find((item) => item.scenarioId === "PFC-W1-CIRCLE-DOUBLE-TRIANGLE")!;
assert.equal(circleDouble.affectedLayersByCut.T1, 4);
assert.equal(circleDouble.mappedCuts.length, 4);
assert.equal(new Set(circleDouble.mappedCuts.map(pfcMappedCutFingerprintWave1)).size, 4);

const offCenter = pfcSolutions.find((item) => item.scenarioId === "PFC-W1-RECT-OFFCENTER")!;
assert.equal(offCenter.affectedLayersByCut.H1, 2);

const cutKinds = new Set(pfcSolutions.flatMap((item) => item.mappedCuts.map((cut) => cut.kind)));
assert.ok(cutKinds.has("CIRCLE_HOLE"));
assert.ok(cutKinds.has("POLYGON_CUT"));
assert.ok(cutKinds.has("SLIT"));

const targetScenario = scenarios.find((item) => item.scenarioId === "PFC-W1-RECT-V-HOLE")!;
const target = solvePfcForwardScenarioWave1(targetScenario);
const rectangle = targetScenario.sourceSheet;
const reverseCandidates: Array<{ candidateId: string; scenario: PfcForwardScenarioWave1 }> = [
  { candidateId: "A", scenario: targetScenario },
  {
    candidateId: "B",
    scenario: {
      scenarioId: "REV-B",
      sourceSheet: rectangle,
      folds: [{ foldId: "F1", kind: "HORIZONTAL", line: { a: { x: -100, y: 40 }, b: { x: 200, y: 40 } }, movingSide: "POSITIVE" }],
      cuts: [{ cutId: "H1", kind: "CIRCLE_HOLE", center: { x: 84, y: 26 }, radius: 2.4 }],
      sourceFamily: "REVERSE_WRONG_AXIS",
    },
  },
  {
    candidateId: "C",
    scenario: {
      ...targetScenario,
      scenarioId: "REV-C",
      cuts: [{ cutId: "H1", kind: "CIRCLE_HOLE", center: { x: 92, y: 26 }, radius: 2.4 }],
      sourceFamily: "REVERSE_WRONG_PUNCH_POSITION",
    },
  },
  {
    candidateId: "D",
    scenario: {
      ...targetScenario,
      scenarioId: "REV-D",
      folds: [
        ...targetScenario.folds,
        { foldId: "F2", kind: "HORIZONTAL", line: { a: { x: -100, y: 40 }, b: { x: 200, y: 40 } }, movingSide: "POSITIVE" },
      ],
      cuts: [{ cutId: "H1", kind: "CIRCLE_HOLE", center: { x: 84, y: 26 }, radius: 2.4 }],
      sourceFamily: "REVERSE_EXTRA_FOLD",
    },
  },
];
const reverseSolved = solvePfcReverseInferenceWave1(target.fingerprint, reverseCandidates);
assert.equal(reverseSolved.candidateId, "A");
assert.equal(reverseSolved.solution.fingerprint, target.fingerprint);
assert.throws(
  () => solvePfcReverseInferenceWave1(target.fingerprint, [reverseCandidates[0], { ...reverseCandidates[0], candidateId: "A2" }]),
  (error: unknown) => error instanceof PfcDiscoveryWave1Error && error.code === "PFC_W1_REVERSE_NOT_UNIQUE",
);

assert.equal(TPF_001_DISCOVERY_WAVE1_AUTHORITY.chapterCode, "TPF-001");
assert.equal(TPF_001_DISCOVERY_WAVE1_AUTHORITY.permanentQlAllocation, "NONE_DISCOVERY_REQUIRED");
assert.equal(TPF_001_DISCOVERY_WAVE1_AUTHORITY.questionStudioAllowed, false);
const tpfScenarios = tpfDiscoveryScenariosWave1();
const tpfSolutions = generateTpfDiscoveryWave1();
assert.equal(tpfScenarios.length, 4);
assert.equal(tpfSolutions.length, 4);
assert.equal(new Set(tpfSolutions.map((item) => item.fingerprint)).size, 4);

const tpfVertical = tpfSolutions.find((item) => item.scenarioId === "TPF-W1-VERTICAL-POINT-PAIR")!;
assert.equal(tpfVertical.fingerprint, "P:75,30;P:80,70");
const tpfHorizontal = tpfSolutions.find((item) => item.scenarioId === "TPF-W1-HORIZONTAL-POINT-PAIR")!;
assert.equal(tpfHorizontal.fingerprint, "P:28,78;P:72,76");

assert.throws(
  () => solveTransparentPatternFoldWave1({
    scenarioId: "TPF-UNSUPPORTED-DIAGONAL",
    sheetSize: 100,
    folds: [{ foldId: "F1", kind: "DIAGONAL", line: { a: { x: 0, y: 0 }, b: { x: 100, y: 100 } }, movingSide: "POSITIVE" }],
    pattern: [{ primitiveId: "P1", kind: "POINT_MARK", point: { x: 25, y: 70 } }],
    sourceFamily: "HELD_UNSUPPORTED_DIAGONAL",
  }),
  (error: unknown) => error instanceof TpfDiscoveryWave1Error && error.code === "TPF_W1_UNSUPPORTED_FOLD",
);

const evidence = {
  pfcAuthority: PFC_001_MULTISHAPE_DISCOVERY_WAVE1_AUTHORITY,
  tpfAuthority: TPF_001_DISCOVERY_WAVE1_AUTHORITY,
  status: "PASS_PFC_TPF_EXECUTABLE_DISCOVERY_WAVE1",
  pfc: {
    scenarioCount: pfcSolutions.length,
    shapes: [...new Set(pfcSolutions.map((item) => item.sourceShape))].sort(),
    sourceFamilies: pfcSolutions.map((item) => item.sourceFamily),
    circleScenarioCount: pfcSolutions.filter((item) => item.sourceShape === "CIRCLE").length,
    analyticCircleScenarios: pfcSolutions.filter((item) => item.usedAnalyticCircleEngine).length,
    reverseInferenceUniqueCandidate: reverseSolved.candidateId,
    solutions: pfcSolutions,
  },
  tpf: {
    scenarioCount: tpfSolutions.length,
    sourceFamilies: tpfSolutions.map((item) => item.sourceFamily),
    solutions: tpfSolutions,
  },
  governance: {
    sourceSaturationFreezeClaimed: false,
    permanentQlAllocated: false,
    questionStudioAllowed: false,
    nextRequiredWork: [
      "EXPAND_PFC_DISCOVERY_MATRIX",
      "ADD_EDGE_NOTCH_CURVED_BOUNDARY_TOPOLOGY",
      "EXPAND_REVERSE_INFERENCE_GRAMMAR",
      "EXPAND_TPF_PATTERN_PRIMITIVES_AND_SOURCE_REVIEW",
      "POST_EXECUTION_SOURCE_GAP_AUDIT",
      "MERGE_SPLIT_REVIEW_BEFORE_QL_ALLOCATION",
    ],
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-tpf-executable-discovery-wave1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence));
