import assert from "node:assert/strict";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";

const rooftopIds = [
  "TRG-002-QL-015",
  "TRG-002-QL-016",
  "TRG-002-QL-017",
  "TRG-002-QL-018",
  "TRG-002-QL-019",
  "TRG-002-QL-020",
  "TRG-002-QL-022",
] as const;

for (const qlId of rooftopIds) {
  for (let seedIndex = 1; seedIndex <= 12; seedIndex += 1) {
    const seed = `trg002-v4-rooftop-support-${seedIndex}`;
    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const q: any = generateTrg002V4CandidateQuestion(qlId, seed, locale);
      assert.equal(q.v4ExamReadiness.scenarioTextApplied, true, `${qlId}:${locale}: rooftop scenario text must be applied.`);
      assert.equal(q.v4ExamReadiness.physicalObserverSupport, true, `${qlId}:${locale}: observer must have a physical support object.`);
      assert.equal(q.v4ExamReadiness.diagramMigrationRequired, false, `${qlId}:${locale}: supported rooftop diagram must no longer be pending.`);
      assert.equal(q.v4ExamReadiness.scenarioSurfaceApplied, true, `${qlId}:${locale}: rooftop surface must be complete after state migration.`);

      const state = q.canonicalSpatialState;
      for (const observer of state.observers) {
        const support = state.verticalObjects.find((object: any) =>
          object.basePointId === observer.groundPointId && object.topPointId === observer.eyePointId,
        );
        assert(support, `${qlId}:${locale}: no vertical support binds observer ground to eye point.`);
        const segment = q.solutionDiagram.segments.find((item: any) =>
          item.kind === "VERTICAL_OBJECT" && item.fromPointId === support.basePointId && item.toPointId === support.topPointId,
        );
        assert(segment, `${qlId}:${locale}: solution diagram does not render the observer support object.`);
      }
      assert.equal(q.verification.spatial.valid, true);
      assert.equal(q.verification.diagram.valid, true);
      assert.equal(q.verification.diagramPolicy.valid, true);
      assert.equal(q.activationAuthorized, false);
      assert.equal(q.freezeStatus, "NOT_FROZEN");
    }
  }
}

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const q21: any = generateTrg002V4CandidateQuestion("TRG-002-QL-021", "trg002-v4-bridge-pending", locale);
  assert.equal(q21.v4ExamReadiness.scenarioTextApplied, true);
  assert.equal(q21.v4ExamReadiness.scenarioSurfaceApplied, false, "QL021 bridge surface must remain pending until bridge-specific geometry is implemented.");
  assert.equal(q21.v4ExamReadiness.diagramMigrationRequired, true);
}

console.log(`TRG002_V4_PHYSICAL_SUPPORT_PASS rooftopQls=${rooftopIds.length} seeds=12 locales=2 bridgeQl021=PENDING`);
