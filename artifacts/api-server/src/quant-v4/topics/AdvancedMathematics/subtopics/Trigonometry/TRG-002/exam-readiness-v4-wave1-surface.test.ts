import assert from "node:assert/strict";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";

const wave1 = [
  "TRG-002-QL-015","TRG-002-QL-016","TRG-002-QL-017","TRG-002-QL-018",
  "TRG-002-QL-019","TRG-002-QL-020","TRG-002-QL-021","TRG-002-QL-022",
  "TRG-002-QL-092","TRG-002-QL-093","TRG-002-QL-094",
] as const;

const diagramComplete = new Set<string>([
  "TRG-002-QL-015","TRG-002-QL-016","TRG-002-QL-017","TRG-002-QL-018",
  "TRG-002-QL-019","TRG-002-QL-020","TRG-002-QL-022",
  "TRG-002-QL-092","TRG-002-QL-093","TRG-002-QL-094",
]);

const diagramPending = new Set<string>([
  "TRG-002-QL-021",
]);

for (const qlId of wave1) {
  for (const locale of ["hi-IN","pa-IN"] as const) {
    const q: any = generateTrg002V4CandidateQuestion(qlId, "trg002-v4-wave1-proof", locale);
    assert.equal(q.v4ExamReadiness.scenarioTextApplied, true, `${qlId}:${locale}: V4 wave1 text must be applied.`);

    if (diagramComplete.has(qlId)) {
      assert.equal(q.v4ExamReadiness.diagramMigrationRequired, false, `${qlId}:${locale}: completed physical scenario must not remain diagram-pending.`);
      assert.equal(q.v4ExamReadiness.scenarioSurfaceApplied, true, `${qlId}:${locale}: completed text+geometry must report full scenario surface.`);
    } else {
      assert(diagramPending.has(qlId), `${qlId}: every incomplete wave1 scenario must be explicitly classified as pending.`);
      assert.equal(q.v4ExamReadiness.diagramMigrationRequired, true, `${qlId}:${locale}: unfinished bridge geometry must remain an explicit pending gate.`);
      assert.equal(q.v4ExamReadiness.scenarioSurfaceApplied, false, `${qlId}:${locale}: text-only migration must not claim full scenario completion.`);
    }

    if (locale === "hi-IN") {
      assert(!/जमीन से .+ ऊँचे (?:अवलोकन|निरीक्षण) बिंदु/u.test(q.stem), `${qlId}: floating Hindi observation point remains.`);
    } else {
      assert(!/ਜ਼ਮੀਨ ਤੋਂ .+ ਉੱਚੇ ਨਿਰੀਖਣ ਬਿੰਦੂ/u.test(q.stem), `${qlId}: floating Punjabi observation point remains.`);
    }
    assert.equal(q.activationAuthorized, false);
    assert.equal(q.freezeStatus, "NOT_FROZEN");
  }
}

console.log(`TRG002_V4_WAVE1_PHYSICAL_SCENARIOS_PASS qls=${wave1.length} bilingual=${wave1.length * 2} diagramsComplete=${diagramComplete.size} diagramsPending=${diagramPending.size}`);
