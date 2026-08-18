import assert from "node:assert/strict";
import { buildTrg002V4BaselineAudit } from "./exam-readiness-v4-audit";

const audit = buildTrg002V4BaselineAudit();
assert.equal(audit.qls, 96);
assert.equal(audit.bilingualRecords, 192);
assert(audit.scenarioCatalog.shells >= 36, "V4 scenario engine must start with at least 36 approved shells.");
assert(audit.scenarioCatalog.domains >= 8, "V4 scenario engine must cover at least 8 domains.");
assert(audit.scenarioCatalog.topologies >= 10, "V4 scenario engine must cover at least 10 spatial topologies.");

// Baseline audit is intentionally a blocker-discovery gate, not a freeze gate.
// These assertions prevent known V3.2 weaknesses from being accidentally hidden by later refactors.
assert(audit.blockers.malformedExactMath.some((id) => id.startsWith("TRG-002-QL-013:")), "V4 baseline must detect QL013 exact-math corruption until remediated.");
assert(audit.blockers.duplicateStemGroups.some((g) => g.qlIds.includes("TRG-002-QL-001") && g.qlIds.includes("TRG-002-QL-005")), "V4 baseline must detect the QL001/QL005 collapse until one is repurposed.");
assert(audit.blockers.surdPhysicalGivenQlIds.length > 0, "V4 baseline must inventory surd physical givens.");
assert(audit.readyForV4Freeze === false);
assert.equal(audit.governance.multilingualFreezeGranted, false);
assert.equal(audit.governance.activationAuthorized, false);

console.log(JSON.stringify({
  status: "TRG002_V4_BASELINE_AUDIT_PASS_BLOCKERS_DISCOVERED",
  scenarioCatalog: audit.scenarioCatalog,
  malformedExactMath: audit.blockers.malformedExactMath,
  duplicateStemGroups: audit.blockers.duplicateStemGroups.length,
  surdPhysicalGivens: audit.blockers.surdPhysicalGivenQlIds.length,
  floatingElevatedObservers: audit.blockers.floatingElevatedObserverQlIds.length,
  shallowHardSolutions: audit.blockers.shallowHardSolutionQlIds.length,
}, null, 2));
