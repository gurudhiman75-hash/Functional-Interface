import assert from "node:assert/strict";
import { generateTrg002V4CanonicalQuestion, TRG_002_V4_CANONICAL_OVERRIDE_IDS } from "./exam-readiness-v4-canonical";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";

assert.deepEqual([...TRG_002_V4_CANONICAL_OVERRIDE_IDS], ["TRG-002-QL-027", "TRG-002-QL-079"]);

for (const qlId of TRG_002_V4_CANONICAL_OVERRIDE_IDS) {
  for (let seedIndex = 1; seedIndex <= 12; seedIndex += 1) {
    const seed = `trg002-v4-canonical-proof-${seedIndex}`;
    const canonical: any = generateTrg002V4CanonicalQuestion(qlId, seed);
    assert.equal(canonical.qlId, qlId);
    assert.equal(canonical.validation.valid, true, `${qlId}: V4 canonical validation must pass.`);
    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const localized: any = generateTrg002V4CandidateQuestion(qlId, seed, locale);
      assert.equal(localized.answer, canonical.answer, `${qlId}:${locale}: answer drift.`);
      assert.equal(localized.correctIndex, canonical.correctIndex, `${qlId}:${locale}: correct index drift.`);
      assert.deepEqual(localized.options, canonical.options, `${qlId}:${locale}: option drift.`);
      assert.deepEqual(localized.canonicalSpatialState, canonical.canonicalSpatialState, `${qlId}:${locale}: canonical spatial state drift.`);
      assert.deepEqual(localized.solutionDiagram, canonical.solutionDiagram, `${qlId}:${locale}: solution diagram drift.`);
      assert.equal(localized.v4ExamReadiness.canonicalOverride, true);
      assert.equal(localized.v4ExamReadiness.scenarioTextApplied, true);
      assert.equal(localized.v4ExamReadiness.scenarioSurfaceApplied, true);
      assert.equal(localized.v4ExamReadiness.diagramMigrationRequired, false);
      assert.equal(localized.activationAuthorized, false);
      assert.equal(localized.freezeStatus, "NOT_FROZEN");
    }
  }
}

const q27: any = generateTrg002V4CanonicalQuestion("TRG-002-QL-027", "trg002-v4-content-check");
assert(q27.stem.includes("difference between the lengths of the shadows"));
assert.equal(q27.lockedFamily, "CHANGED_SHADOW");

const q79: any = generateTrg002V4CanonicalQuestion("TRG-002-QL-079", "trg002-v4-content-check");
assert(q79.stem.includes("Two pillars of equal height"));
assert(q79.stem.includes("road"));
assert.equal(q79.difficulty, "Hard");

console.log("TRG002_V4_CANONICAL_REPURPOSE_PASS overrides=2 seeds=12 locales=2");
