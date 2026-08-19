import assert from "node:assert/strict";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";
import {
  generateTrg002V4ScenarioWave3Question,
  TRG_002_V4_SCENARIO_WAVE3_IDS,
  trg002V4ScenarioWave3ScenarioId,
  trg002V4ScenarioWave3Topology,
} from "./exam-readiness-v4-scenario-wave3";

assert.deepEqual([...TRG_002_V4_SCENARIO_WAVE3_IDS], [
  "TRG-002-QL-037",
  "TRG-002-QL-046",
  "TRG-002-QL-050",
  "TRG-002-QL-060",
]);

const expectedScenario = {
  "TRG-002-QL-037": "SUPPORT_LADDER_WALL",
  "TRG-002-QL-046": "SUPPORT_GUY_WIRE_POLE",
  "TRG-002-QL-050": "ROAD_CAR_APPROACHES_TOWER",
  "TRG-002-QL-060": "WATER_TWO_BOATS_OPPOSITE",
} as const;

const expectedTopology = {
  "TRG-002-QL-037": "SUPPORT_TRIANGLE",
  "TRG-002-QL-046": "SUPPORT_TRIANGLE",
  "TRG-002-QL-050": "SAME_SIDE_TWO_POSITIONS",
  "TRG-002-QL-060": "OPPOSITE_SIDES",
} as const;

for (const qlId of TRG_002_V4_SCENARIO_WAVE3_IDS) {
  assert.equal(trg002V4ScenarioWave3ScenarioId(qlId), expectedScenario[qlId]);
  assert.equal(trg002V4ScenarioWave3Topology(qlId), expectedTopology[qlId]);
  for (let seedIndex = 1; seedIndex <= 12; seedIndex += 1) {
    const seed = `trg002-v4-wave3-${seedIndex}`;
    const canonical: any = generateTrg002V4ScenarioWave3Question(qlId, seed, "en");
    assert.equal(canonical.qlId, qlId);
    assert.equal(canonical.validation.valid, true, `${qlId}: canonical Wave3 spatial/math validation must pass.`);
    assert(!canonical.stem.includes("√"), `${qlId}: Wave3 physical learner stem must use ordinary measured givens.`);

    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const localized: any = generateTrg002V4CandidateQuestion(qlId, seed, locale);
      assert.equal(localized.answer, canonical.answer, `${qlId}:${locale}: answer drift.`);
      assert.equal(localized.correctIndex, canonical.correctIndex, `${qlId}:${locale}: correct-index drift.`);
      assert.deepEqual(localized.options, canonical.options, `${qlId}:${locale}: option drift.`);
      assert.deepEqual(localized.canonicalSpatialState, canonical.canonicalSpatialState, `${qlId}:${locale}: spatial-state drift.`);
      assert.deepEqual(localized.solutionDiagram, canonical.solutionDiagram, `${qlId}:${locale}: diagram drift.`);
      assert.equal(localized.v4ExamReadiness.scenarioWave3Override, true);
      assert.equal(localized.v4ExamReadiness.recommendedScenarioShell, expectedScenario[qlId]);
      assert.equal(localized.v4ExamReadiness.spatialTopology, expectedTopology[qlId]);
      assert.equal(localized.v4ExamReadiness.scenarioTextApplied, true);
      assert.equal(localized.v4ExamReadiness.scenarioSurfaceApplied, true);
      assert.equal(localized.v4ExamReadiness.stemVarietyApplied, false, `${qlId}: decorative prefixing must not mutate a canonical Wave3 surface.`);
      assert.equal(localized.v4ExamReadiness.diagramMigrationRequired, false);
      assert.equal(localized.activationAuthorized, false);
      assert.equal(localized.freezeStatus, "NOT_FROZEN");
      assert(!localized.stem.includes("√"), `${qlId}:${locale}: physical learner stem must not expose a surd given.`);
    }
  }
}

const q37: any = generateTrg002V4CandidateQuestion("TRG-002-QL-037", "wave3-content", "hi-IN");
assert(q37.stem.includes("सीढ़ी और दीवार के बीच"));
assert(q37.explanation.steps.some((step: any) => step.body.includes("90°−30° = 60°")));

const q46: any = generateTrg002V4CandidateQuestion("TRG-002-QL-046", "wave3-content", "pa-IN");
assert(q46.stem.includes("ਲੰਗਰ-ਬਿੰਦੂ"));
assert(q46.explanation.steps.some((step: any) => step.body.includes("cos60°")));

const q50: any = generateTrg002V4CandidateQuestion("TRG-002-QL-050", "wave3-content", "hi-IN");
assert(q50.stem.includes("एक कार"));
assert(q50.explanation.steps.some((step: any) => step.body.includes("3x=x+")));
assert(q50.explanation.steps.some((step: any) => step.body.includes("2x=")));

const q60: any = generateTrg002V4CandidateQuestion("TRG-002-QL-060", "wave3-content", "pa-IN");
assert(q60.stem.includes("ਲਾਈਟਹਾਊਸ"));
assert(q60.stem.includes("ਉਲਟ ਪਾਸਿਆਂ"));
assert(q60.explanation.steps.some((step: any) => step.body.includes("x+y=")));

console.log("TRG002_V4_SCENARIO_WAVE3_PASS qls=4 seeds=12 locales=2 cases=96 structuralScenarios=4");
