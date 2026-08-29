import assert from "node:assert/strict";
import { buildTrg002V4BaselineAudit } from "./exam-readiness-v4-audit";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";
import { TRG_002_V4_HARD_SOLUTION_REMEDIATION_IDS } from "./exam-readiness-v4-hard-solutions";

const audit = buildTrg002V4BaselineAudit();
assert.equal(audit.qls, 96);
assert.equal(audit.bilingualRecords, 192);
assert(audit.scenarioCatalog.shells >= 38, "V4 scenario engine must contain at least 38 approved structural shells after Wave4.");
assert(audit.scenarioCatalog.domains >= 8, "V4 scenario engine must cover at least 8 domains.");
assert(audit.scenarioCatalog.topologies >= 10, "V4 spatial topology breadth must cover at least 10 spatial topologies.");

assert.equal(audit.repaired.ql013ExactMath, true, "QL013 exact learner math must remain repaired in V4.");
assert(!audit.blockers.malformedExactMath.some((id) => id.startsWith("TRG-002-QL-013:")), "QL013 must not re-enter the malformed exact-math inventory.");
assert.deepEqual(audit.blockers.surdPhysicalGivenQlIds, [], "Wave2 natural-measurement remediation must clear every surd physical given from the live V4 learner stems.");
assert.deepEqual(audit.blockers.duplicateStemGroups, [], "V4 stem-variety and structural scenario remediations must keep normalized duplicate learner stem groups at zero.");
for (const qlId of ["TRG-002-QL-092", "TRG-002-QL-093", "TRG-002-QL-094"]) {
  assert(!audit.blockers.floatingElevatedObserverQlIds.includes(qlId), `${qlId}: river-platform migration must clear the floating-observer blocker.`);
}
assert.deepEqual(audit.blockers.shallowHardSolutionQlIds, [], "V4 Hard-solution remediation must clear every shallow Hard solution blocker.");

for (const qlId of TRG_002_V4_HARD_SOLUTION_REMEDIATION_IDS) {
  for (const locale of ["hi-IN", "pa-IN"] as const) {
    const q: any = generateTrg002V4CandidateQuestion(qlId, "trg002-v4-hard-solution-regression", locale);
    const bodies = q.explanation.steps.map((step: any) => step.body).join(" ");
    assert.equal(q.difficulty, "Hard", `${qlId}:${locale}: Hard-solution remediation must stay scoped to a Hard QL.`);
    assert.equal(q.v4ExamReadiness.hardSolutionRemediated, true, `${qlId}:${locale}: V4 Hard-solution remediation metadata missing.`);
    assert(q.explanation.steps.length >= 4, `${qlId}:${locale}: Hard explanation must expose setup, equation, exact simplification and answer.`);
    assert(/tan(?:30|45|60)°=/u.test(bodies), `${qlId}:${locale}: Hard explanation must substitute the relevant standard tangent value explicitly.`);
    if (locale === "hi-IN") {
      assert(!/(?:हल करने पर|हल करने से|समीकरण हल)/u.test(bodies), `${qlId}:${locale}: shallow equation-solve wording must not return.`);
    }
  }
}

assert(audit.readyForV4Freeze === false);
assert.equal(audit.governance.mutatesFrozenEnglishAuthority, false);
assert.equal(audit.governance.multilingualFreezeGranted, false);
assert.equal(audit.governance.activationAuthorized, false);

console.log(JSON.stringify({
  status: "TRG002_V4_CURRENT_CANDIDATE_AUDIT_PASS",
  scenarioCatalog: audit.scenarioCatalog,
  repaired: audit.repaired,
  malformedExactMath: audit.blockers.malformedExactMath,
  duplicateStemGroups: audit.blockers.duplicateStemGroups.length,
  surdPhysicalGivens: audit.blockers.surdPhysicalGivenQlIds.length,
  floatingElevatedObservers: audit.blockers.floatingElevatedObserverQlIds.length,
  shallowHardSolutions: audit.blockers.shallowHardSolutionQlIds.length,
  hardSolutionRemediatedQlIds: TRG_002_V4_HARD_SOLUTION_REMEDIATION_IDS.length,
}, null, 2));
