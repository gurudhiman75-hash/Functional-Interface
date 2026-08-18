import assert from "node:assert/strict";
import { buildTrg002V4BaselineAudit } from "./exam-readiness-v4-audit";

const audit = buildTrg002V4BaselineAudit();
assert.equal(audit.qls, 96);
assert.equal(audit.bilingualRecords, 192);
assert(audit.scenarioCatalog.shells >= 36, "V4 scenario engine must start with at least 36 approved shells.");
assert(audit.scenarioCatalog.domains >= 8, "V4 scenario engine must cover at least 8 domains.");
assert(audit.scenarioCatalog.topologies >= 10, "V4 scenario engine must cover at least 10 spatial topologies.");

// This gate measures the live V4 candidate. Repaired defects must disappear;
// unresolved weaknesses remain visible until their QLs are genuinely redesigned.
assert.equal(audit.repaired.ql013ExactMath, true, "QL013 exact learner math must remain repaired in V4.");
assert(!audit.blockers.malformedExactMath.some((id) => id.startsWith("TRG-002-QL-013:")), "QL013 must not re-enter the malformed exact-math inventory.");
assert(audit.blockers.surdPhysicalGivenQlIds.length > 0, "V4 must continue inventorying unresolved surd physical givens.");
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
