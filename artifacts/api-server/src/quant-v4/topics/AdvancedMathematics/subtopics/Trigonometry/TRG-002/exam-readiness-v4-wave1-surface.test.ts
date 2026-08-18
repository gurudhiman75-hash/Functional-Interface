import assert from "node:assert/strict";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";

const migrated = [
  "TRG-002-QL-015","TRG-002-QL-016","TRG-002-QL-017","TRG-002-QL-018",
  "TRG-002-QL-019","TRG-002-QL-020","TRG-002-QL-021","TRG-002-QL-022",
  "TRG-002-QL-092","TRG-002-QL-093","TRG-002-QL-094",
] as const;

for (const qlId of migrated) {
  for (const locale of ["hi-IN","pa-IN"] as const) {
    const q: any = generateTrg002V4CandidateQuestion(qlId, "trg002-v4-wave1-proof", locale);
    assert.equal(q.v4ExamReadiness.scenarioTextApplied, true, `${qlId}:${locale}: V4 wave1 text must be applied.`);
    assert.equal(q.v4ExamReadiness.diagramMigrationRequired, true, `${qlId}:${locale}: scenario-aware diagram must remain an explicit pending gate.`);
    assert.equal(q.v4ExamReadiness.scenarioSurfaceApplied, false, `${qlId}:${locale}: text-only migration must not claim full scenario completion.`);
    if (locale === "hi-IN") {
      assert(!/जमीन से .+ ऊँचे (?:अवलोकन|निरीक्षण) बिंदु/u.test(q.stem), `${qlId}: floating Hindi observation point remains.`);
    } else {
      assert(!/ਜ਼ਮੀਨ ਤੋਂ .+ ਉੱਚੇ ਨਿਰੀਖਣ ਬਿੰਦੂ/u.test(q.stem), `${qlId}: floating Punjabi observation point remains.`);
    }
    assert.equal(q.activationAuthorized, false);
    assert.equal(q.freezeStatus, "NOT_FROZEN");
  }
}

console.log(`TRG002_V4_WAVE1_PHYSICAL_SCENARIOS_PASS qls=${migrated.length} bilingual=${migrated.length * 2} diagrams=PENDING`);
