import assert from "node:assert/strict";
import { formatExactPlain } from "../foundation/exact";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";

const riverIds = ["TRG-002-QL-092", "TRG-002-QL-093", "TRG-002-QL-094"] as const;

for (const qlId of riverIds) {
  for (let seedIndex = 1; seedIndex <= 12; seedIndex += 1) {
    const seed = `trg002-v4-river-proof-${seedIndex}`;
    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const q: any = generateTrg002V4CandidateQuestion(qlId, seed, locale);
      assert.equal(q.v4ExamReadiness.spatialTopology, "RIVER_WIDTH", `${qlId}:${locale}: river topology drift.`);
      assert.equal(q.v4ExamReadiness.recommendedScenarioShell, "WATER_BRIDGE_RIVER_WIDTH", `${qlId}:${locale}: river scenario shell drift.`);
      assert.equal(q.v4ExamReadiness.scenarioTextApplied, true, `${qlId}:${locale}: river learner surface missing.`);
      assert.equal(q.v4ExamReadiness.physicalObserverSupport, true, `${qlId}:${locale}: river observer must be physically supported.`);
      assert.equal(q.v4ExamReadiness.diagramMigrationRequired, false, `${qlId}:${locale}: river diagram must be state-bound and complete.`);
      assert.equal(q.v4ExamReadiness.scenarioSurfaceApplied, true, `${qlId}:${locale}: river text+state+diagram surface must be complete.`);
      assert.equal(q.canonicalSpatialState.scenario, "RIVER_BANK");
      assert.equal(q.canonicalSpatialState.diagramStrategy, "RIVER_WIDTH");
      assert.equal(q.canonicalSpatialState.requested.kind, "HORIZONTAL_DISTANCE");

      for (const observer of q.canonicalSpatialState.observers) {
        const support = q.canonicalSpatialState.verticalObjects.find((object: any) =>
          object.basePointId === observer.groundPointId && object.topPointId === observer.eyePointId,
        );
        assert(support, `${qlId}:${locale}: no platform support binds bank level to observer eye/top.`);
        const segment = q.solutionDiagram.segments.find((item: any) =>
          item.kind === "VERTICAL_OBJECT" && item.fromPointId === support.basePointId && item.toPointId === support.topPointId,
        );
        assert(segment, `${qlId}:${locale}: river platform support is missing from the solution diagram.`);
      }

      assert.equal(q.verification.spatial.valid, true);
      assert.equal(q.verification.diagram.valid, true);
      assert.equal(q.verification.diagramPolicy.valid, true);
      assert.equal(q.v4ExamReadiness.frozenEnglishAuthorityMutated, false);
      assert.equal(q.activationAuthorized, false);
      assert.equal(q.freezeStatus, "NOT_FROZEN");

      if (qlId === "TRG-002-QL-093") {
        assert.equal(q.v4ExamReadiness.canonicalOverride, true, `${locale}: QL093 must use the V4 math override.`);
        const observer = q.canonicalSpatialState.observers[0];
        const measuredHeight = formatExactPlain(observer.eyeHeight);
        assert(!measuredHeight.includes("√"), `${locale}: QL093 measured platform height must be an ordinary integer.`);
        assert(q.answer.includes("√3"), `${locale}: QL093 exact surd should remain in the derived answer.`);
        assert(!new RegExp(`${measuredHeight}√3\\s*m\\s*(?:ऊँचा|ਉੱਚਾ)`, "u").test(q.stem), `${locale}: QL093 must not reintroduce a surd measured height.`);
        assert.equal(q.validation.valid, true);
      } else {
        assert.equal(q.v4ExamReadiness.canonicalOverride, false, `${qlId}:${locale}: QL092/094 math must remain on the frozen canonical family.`);
      }
    }
  }
}

const hi93: any = generateTrg002V4CandidateQuestion("TRG-002-QL-093", "trg002-v4-river-language", "hi-IN");
assert(hi93.stem.includes("अवलोकन मंच"));
assert(hi93.stem.includes("ठीक सामने"));
const pa93: any = generateTrg002V4CandidateQuestion("TRG-002-QL-093", "trg002-v4-river-language", "pa-IN");
assert(pa93.stem.includes("ਨਿਰੀਖਣ ਮੰਚ"));
assert(pa93.stem.includes("ਕਿਨਾਰੇ"));
assert(pa93.stem.includes("ਬਿਲਕੁਲ ਸਾਹਮਣੇ"));

console.log(`TRG002_V4_RIVER_PLATFORM_PASS qls=${riverIds.length} seeds=12 locales=2 cases=${riverIds.length * 12 * 2}`);
