import assert from "node:assert/strict";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";
import { assertTrg002V4ScenarioCatalog } from "./exam-readiness-v4-scenario-engine";
import {
  generateTrg002V4ScenarioWave4Question,
  TRG_002_V4_SCENARIO_WAVE4_IDS,
  trg002V4ScenarioWave4ScenarioId,
  trg002V4ScenarioWave4Topology,
} from "./exam-readiness-v4-scenario-wave4";

assert.deepEqual([...TRG_002_V4_SCENARIO_WAVE4_IDS], [
  "TRG-002-QL-044",
  "TRG-002-QL-053",
  "TRG-002-QL-066",
  "TRG-002-QL-081",
]);
assert.equal(assertTrg002V4ScenarioCatalog().shells, 38, "Wave4 must expand the approved scenario catalog to 38 structural shells.");

const expectedScenario = {
  "TRG-002-QL-044": "NATURAL_BROKEN_TREE",
  "TRG-002-QL-053": "URBAN_UNFINISHED_TOWER_EXTENSION",
  "TRG-002-QL-066": "MOVE_VEHICLE_TIME_SPEED",
  "TRG-002-QL-081": "ROAD_TWO_SIDES_TOWER_CARS",
} as const;

const expectedTopology = {
  "TRG-002-QL-044": "SUPPORT_TRIANGLE",
  "TRG-002-QL-053": "COMPOSITE_VERTICAL",
  "TRG-002-QL-066": "SAME_SIDE_TWO_POSITIONS",
  "TRG-002-QL-081": "OPPOSITE_SIDES",
} as const;

for (const qlId of TRG_002_V4_SCENARIO_WAVE4_IDS) {
  assert.equal(trg002V4ScenarioWave4ScenarioId(qlId), expectedScenario[qlId]);
  assert.equal(trg002V4ScenarioWave4Topology(qlId), expectedTopology[qlId]);
  for (let seedIndex = 1; seedIndex <= 12; seedIndex += 1) {
    const seed = `trg002-v4-wave4-${seedIndex}`;
    const canonical: any = generateTrg002V4ScenarioWave4Question(qlId, seed, "en");
    assert.equal(canonical.qlId, qlId);
    assert.equal(canonical.validation.valid, true, `${qlId}: canonical Wave4 spatial/math validation must pass.`);
    assert(!/√\d+\s*m\b/u.test(canonical.stem), `${qlId}: Wave4 physical learner stem must not use a surd measured given.`);

    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const localized: any = generateTrg002V4CandidateQuestion(qlId, seed, locale);
      assert.equal(localized.answer, canonical.answer, `${qlId}:${locale}: answer drift.`);
      assert.equal(localized.correctIndex, canonical.correctIndex, `${qlId}:${locale}: correct-index drift.`);
      assert.deepEqual(localized.options, canonical.options, `${qlId}:${locale}: option drift.`);
      assert.deepEqual(localized.canonicalSpatialState, canonical.canonicalSpatialState, `${qlId}:${locale}: spatial-state drift.`);
      assert.deepEqual(localized.solutionDiagram, canonical.solutionDiagram, `${qlId}:${locale}: diagram drift.`);
      assert.equal(localized.v4ExamReadiness.scenarioWave4Override, true);
      assert.equal(localized.v4ExamReadiness.recommendedScenarioShell, expectedScenario[qlId]);
      assert.equal(localized.v4ExamReadiness.spatialTopology, expectedTopology[qlId]);
      assert.equal(localized.v4ExamReadiness.scenarioTextApplied, true);
      assert.equal(localized.v4ExamReadiness.scenarioSurfaceApplied, true);
      assert.equal(localized.v4ExamReadiness.stemVarietyApplied, false, `${qlId}: decorative stem prefixing must not mutate a structural Wave4 surface.`);
      assert.equal(localized.v4ExamReadiness.diagramMigrationRequired, false);
      assert.equal(localized.activationAuthorized, false);
      assert.equal(localized.freezeStatus, "NOT_FROZEN");
      assert(!/√\d+\s*m\b/u.test(localized.stem), `${qlId}:${locale}: physical learner stem must not expose a surd measured given.`);
      const explanationText = [localized.explanation.keyRule, ...localized.explanation.steps.map((s: any) => s.body), localized.explanation.shortcut, ...localized.explanation.traps].join(" ");
      if (localized.difficulty === "Hard") {
        assert(!/(?:हल करने पर|हल करने से|समीकरण हल)/u.test(explanationText), `${qlId}:${locale}: Hard Wave4 solution must show the algebra rather than hand-wave it.`);
      }
    }
  }
}

const q44: any = generateTrg002V4CandidateQuestion("TRG-002-QL-044", "wave4-content", "hi-IN");
assert(q44.stem.includes("टूटने से पहले"));
assert(q44.explanation.steps.some((step: any) => step.body.includes("sin30°")));
assert(q44.explanation.steps.some((step: any) => step.body.includes("मूल ऊँचाई")));
assert.equal(q44.solutionDiagram.strategy, "BROKEN_TREE");

const q53: any = generateTrg002V4CandidateQuestion("TRG-002-QL-053", "wave4-content", "pa-IN");
assert(q53.stem.includes("ਅਧੂਰੀ ਮੀਨਾਰ"));
assert(q53.explanation.steps.some((step: any) => step.body.includes("3h=h+")));
assert.equal(q53.solutionDiagram.strategy, "TOWER_EXTENSION");
assert.equal(q53.canonicalSpatialState.observers.length, 1, "QL053 must use one fixed observation point before and after extension.");
assert.equal(q53.canonicalSpatialState.observations.length, 2);

const q66: any = generateTrg002V4CandidateQuestion("TRG-002-QL-066", "wave4-content", "hi-IN");
assert(q66.stem.includes("36 km/h"));
assert(q66.explanation.steps.some((step: any) => step.body.includes("36 km/h=10 m/s")));
assert(q66.explanation.steps.some((step: any) => step.body.includes("3x=x+")));

const q81: any = generateTrg002V4CandidateQuestion("TRG-002-QL-081", "wave4-content", "pa-IN");
assert(q81.stem.includes("ਦੋ ਕਾਰਾਂ"));
assert(q81.stem.includes("ਵਿਚਕਾਰ"));
assert(q81.explanation.steps.some((step: any) => step.body.includes("x+3x=")));

console.log("TRG002_V4_SCENARIO_WAVE4_PASS qls=4 seeds=12 locales=2 cases=96 structuralScenarios=4 catalog=38");
