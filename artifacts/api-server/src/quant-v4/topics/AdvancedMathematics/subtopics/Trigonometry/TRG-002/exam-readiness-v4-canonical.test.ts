import assert from "node:assert/strict";
import { generateTrg002V4CanonicalQuestion, TRG_002_V4_CANONICAL_OVERRIDE_IDS } from "./exam-readiness-v4-canonical";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";

assert.deepEqual([...TRG_002_V4_CANONICAL_OVERRIDE_IDS], [
  "TRG-002-QL-005",
  "TRG-002-QL-027",
  "TRG-002-QL-028",
  "TRG-002-QL-079",
  "TRG-002-QL-087",
]);

const expectedScenario: Record<string, string> = {
  "TRG-002-QL-005": "URBAN_BUILDING_AND_FLAGPOLE",
  "TRG-002-QL-027": "SHADOW_DIFFERENCE_TWO_TIMES",
  "TRG-002-QL-028": "SHADOW_TOWER_DIRECT",
  "TRG-002-QL-079": "ROAD_EQUAL_PILLARS",
  "TRG-002-QL-087": "URBAN_TWO_BUILDINGS",
};

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
      assert.equal(localized.v4ExamReadiness.recommendedScenarioShell, expectedScenario[qlId]);
      assert.equal(localized.v4ExamReadiness.scenarioTextApplied, true);
      assert.equal(localized.v4ExamReadiness.scenarioSurfaceApplied, true);
      assert.equal(localized.v4ExamReadiness.diagramMigrationRequired, false);
      assert.equal(localized.activationAuthorized, false);
      assert.equal(localized.freezeStatus, "NOT_FROZEN");
    }
  }
}

const q5: any = generateTrg002V4CanonicalQuestion("TRG-002-QL-005", "trg002-v4-content-check");
assert(q5.stem.includes("flagstaff stands on the roof"));
assert.equal(q5.lockedFamily, "COMPOSITE_VERTICAL");
assert(!/√.+?m high building/u.test(q5.stem), "QL005 measured building height must be ordinary, not a surd.");

const q27: any = generateTrg002V4CanonicalQuestion("TRG-002-QL-027", "trg002-v4-content-check");
assert(q27.stem.includes("difference between the lengths of the shadows"));
assert.equal(q27.lockedFamily, "CHANGED_SHADOW");

const q28: any = generateTrg002V4CanonicalQuestion("TRG-002-QL-028", "trg002-v4-content-check");
assert(q28.stem.includes("longer than the height of the pole"));
assert.equal(q28.lockedFamily, "SHADOW_RELATION");
assert.equal(q28.difficulty, "Medium");

const q79: any = generateTrg002V4CanonicalQuestion("TRG-002-QL-079", "trg002-v4-content-check");
assert(q79.stem.includes("Two pillars of equal height"));
assert(q79.stem.includes("road"));
assert.equal(q79.difficulty, "Hard");

const q87: any = generateTrg002V4CanonicalQuestion("TRG-002-QL-087", "trg002-v4-content-check");
assert(q87.stem.includes("Two buildings are"));
assert(!q87.stem.includes("√"), "QL087 physical building-height givens must be ordinary integers.");
assert(q87.answer.includes("√3"), "QL087 may retain an exact surd as the derived answer.");
assert.equal(q87.difficulty, "Medium");

console.log("TRG002_V4_CANONICAL_REPURPOSE_PASS overrides=5 seeds=12 locales=2");
