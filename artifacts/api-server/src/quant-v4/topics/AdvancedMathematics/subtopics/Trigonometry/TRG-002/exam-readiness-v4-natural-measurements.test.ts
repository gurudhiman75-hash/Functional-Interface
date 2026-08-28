import assert from "node:assert/strict";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";
import {
  TRG_002_V4_NATURAL_MEASUREMENT_IDS,
  generateTrg002V4NaturalMeasurementQuestion,
  trg002V4NaturalMeasurementScenarioId,
  trg002V4NaturalMeasurementTopology,
} from "./exam-readiness-v4-natural-measurements";

assert.equal(TRG_002_V4_NATURAL_MEASUREMENT_IDS.length, 19);
let cases = 0;
for (const qlId of TRG_002_V4_NATURAL_MEASUREMENT_IDS) {
  assert(trg002V4NaturalMeasurementScenarioId(qlId), `${qlId}: natural-measurement scenario missing.`);
  assert(trg002V4NaturalMeasurementTopology(qlId), `${qlId}: natural-measurement topology missing.`);
  for (let seedIndex = 1; seedIndex <= 12; seedIndex += 1) {
    const seed = `trg002-v4-natural-${seedIndex}`;
    const en: any = generateTrg002V4NaturalMeasurementQuestion(qlId, seed, "en");
    assert.equal(en.validation.valid, true, `${qlId}: English canonical validation failed.`);
    assert.equal(en.verification.spatial.valid, true, `${qlId}: English spatial verification failed.`);
    assert.equal(en.verification.diagram.valid, true, `${qlId}: English diagram verification failed.`);
    assert.equal(en.verification.diagramPolicy.valid, true, `${qlId}: English diagram-policy verification failed.`);
    assert(!en.stem.includes("√"), `${qlId}: English stem still exposes a surd physical measurement.`);

    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const q: any = generateTrg002V4CandidateQuestion(qlId, seed, locale);
      assert(!q.stem.includes("√"), `${qlId}:${locale}: localized stem still exposes a surd physical measurement.`);
      assert.equal(q.answer, en.answer, `${qlId}:${locale}: answer drift from V4 natural canonical.`);
      assert.equal(q.correctIndex, en.correctIndex, `${qlId}:${locale}: correct-index drift.`);
      assert.deepEqual(q.options, en.options, `${qlId}:${locale}: options drift.`);
      assert.deepEqual(q.canonicalSpatialState, en.canonicalSpatialState, `${qlId}:${locale}: canonical spatial-state drift.`);
      assert.deepEqual(q.solutionDiagram, en.solutionDiagram, `${qlId}:${locale}: solution-diagram drift.`);
      assert.equal(q.v4ExamReadiness.naturalMeasurementOverride, true);
      assert.equal(q.v4ExamReadiness.scenarioTextApplied, true);
      assert.equal(q.v4ExamReadiness.scenarioSurfaceApplied, true);
      assert.equal(q.v4ExamReadiness.diagramMigrationRequired, false);
      assert.equal(q.v4ExamReadiness.recommendedScenarioShell, trg002V4NaturalMeasurementScenarioId(qlId));
      assert.equal(q.v4ExamReadiness.spatialTopology, trg002V4NaturalMeasurementTopology(qlId));
      assert.equal(q.activationAuthorized, false);
      assert.equal(q.freezeStatus, "NOT_FROZEN");
      cases += 1;
    }
  }
}

const q13: any = generateTrg002V4NaturalMeasurementQuestion("TRG-002-QL-013", "trg002-v4-natural-content", "en");
assert.equal(q13.answer, "45°");
assert(!q13.stem.includes("√"));

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const q29: any = generateTrg002V4CandidateQuestion("TRG-002-QL-029", "trg002-v4-natural-content", locale);
  assert(locale === "hi-IN" ? /पेड़/u.test(q29.stem) : /ਦਰੱਖਤ/u.test(q29.stem), `QL029:${locale}: tree-shadow semantics must be aligned.`);
  assert(/30°/u.test(q29.stem));

  const q48: any = generateTrg002V4CandidateQuestion("TRG-002-QL-048", "trg002-v4-natural-content", locale);
  assert(locale === "hi-IN" ? /मस्तूल/u.test(q48.stem) : /ਮਸਤੂਲ/u.test(q48.stem), `QL048:${locale}: mast semantics missing.`);
  assert(locale === "hi-IN" ? /क्षैतिज दूरी/u.test(q48.stem) : /ਖਿਤਿਜੀ ਦੂਰੀ/u.test(q48.stem), `QL048:${locale}: ground-anchor distance target missing.`);
}

assert.equal(cases, 19 * 12 * 2);
console.log(`TRG002_V4_NATURAL_MEASUREMENTS_PASS qls=19 seeds=12 locales=2 cases=${cases} surdPhysicalGivens=0`);
