import assert from "node:assert/strict";
import { buildTrg002V4BaselineAudit } from "./exam-readiness-v4-audit";

const audit = buildTrg002V4BaselineAudit();
assert.equal(audit.qls, 96);
assert.equal(audit.bilingualRecords, 192);
assert(audit.scenarioCatalog.shells >= 36, "V4 scenario engine must start with at least 36 approved shells.");
assert(audit.scenarioCatalog.domains >= 8, "V4 scenario engine must cover at least 8 domains.");
assert(audit.scenarioCatalog.topologies >= 10, "V4 spatial topology breadth must cover at least 10 spatial topologies.");

assert.equal(audit.repaired.ql013ExactMath, true, "QL013 exact learner math must remain repaired in V4.");
assert(!audit.blockers.malformedExactMath.some((id) => id.startsWith("TRG-002-QL-013:")), "QL013 must not re-enter the malformed exact-math inventory.");
assert.deepEqual(audit.blockers.surdPhysicalGivenQlIds, [], "Wave2 natural-measurement remediation must clear every surd physical given from the live V4 learner stems.");
assert.deepEqual(audit.blockers.duplicateStemGroups, [], "Wave3 stem-variety remediation must clear every normalized duplicate learner stem group.");
for (const qlId of ["TRG-002-QL-092", "TRG-002-QL-093", "TRG-002-QL-094"]) {
  assert(!audit.blockers.floatingElevatedObserverQlIds.includes(qlId), `${qlId}: river-platform migration must clear the floating-observer blocker.`);
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
}, null, 2));
