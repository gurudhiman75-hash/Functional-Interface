import { buildSea001SaturationCorpus } from "./saturation/corpus.ts";
import {
  runSea001InverseAudit,
  runSea001MergeSplitAudit,
} from "./saturation/authority-audits.ts";
import { runSea001GovernanceAudit } from "./saturation/governance-audit.ts";

const startedAt = Date.now();
const corpus = buildSea001SaturationCorpus(40);

const mergeSplit = runSea001MergeSplitAudit(corpus.caselets);
if (!mergeSplit.passed) {
  throw new Error(`SEA-001 merge/split audit failed: ${JSON.stringify({
    missingAuthorities: mergeSplit.missingAuthorities,
    mergeCandidatePairs: mergeSplit.mergeCandidatePairs,
    splitCandidates: mergeSplit.splitCandidates,
  })}`);
}
if (mergeSplit.decisions.length !== 20) {
  throw new Error(`Expected 20 merge/split decisions, observed ${mergeSplit.decisions.length}`);
}

const inverse = runSea001InverseAudit();
if (!inverse.passed) throw new Error("SEA-001 inverse audit did not pass");

const gap = runSea001GovernanceAudit(corpus.caselets);
if (!gap.passedAutomatedGate || gap.technicalGapCount !== 0) {
  throw new Error(`SEA-001 automated governance audit failed: ${JSON.stringify(gap.records.filter((record) => record.disposition === "GENUINE_MISSING_IMPLEMENTATION" || record.disposition === "OPEN_GOVERNANCE"))}`);
}
if (!gap.sourceAudit.passed) throw new Error("SEA-001 source audit did not pass");
if (!gap.authorityDiscrepancyResolved) throw new Error("SEA-001 CP-001 authority-count discrepancy is not resolved");
if (gap.eligibleForPermanentAllocation) {
  throw new Error("SEA-001 must not become eligible for permanent allocation while manual English review remains open");
}
if (gap.openGovernanceCount !== 1) {
  throw new Error(`Expected exactly one remaining governance blocker (manual English review), observed ${gap.openGovernanceCount}`);
}
const remaining = gap.records.filter((record) => record.disposition === "OPEN_GOVERNANCE");
if (remaining.length !== 1 || remaining[0]?.id !== "GAP-SEA001-MANUAL-ENGLISH-REVIEW") {
  throw new Error(`Unexpected remaining governance blockers: ${JSON.stringify(remaining)}`);
}

console.log("PASS_SEA_001_AUTHORITY_AUDITS");
console.log("audit caselets", corpus.caselets.length);
console.log("merge/split decisions", mergeSplit.decisions.length);
console.log("merge candidates", mergeSplit.mergeCandidatePairs.length);
console.log("split candidates", mergeSplit.splitCandidates.length);
console.log("linear inverse round trips", inverse.linearRoundTrips);
console.log("linear facing inversions", inverse.linearFacingInversions);
console.log("cyclic inverse round trips", inverse.cyclicRoundTrips);
console.log("centre/outward facing inversions", inverse.centreOutwardFacingInversions);
console.log("opposite involutions", inverse.oppositeInvolutions);
console.log("odd opposite guards", inverse.oddOppositeGuards);
console.log("arc complement checks", inverse.arcComplementChecks);
console.log("mixed-facing double inversions", inverse.mixedFacingDoubleInversions);
console.log("technical gaps", gap.technicalGapCount);
console.log("source evidence records", gap.sourceAudit.evidenceCount);
console.log("source exam families", JSON.stringify(gap.sourceAudit.examFamiliesCovered));
console.log("source checkpoints", JSON.stringify(gap.sourceAudit.checkpointsCovered));
console.log("authority discrepancy resolved", gap.authorityDiscrepancyResolved);
console.log("open governance gaps", gap.openGovernanceCount);
console.log("remaining governance blocker", remaining[0]?.id);
console.log("permanent allocation eligible", gap.eligibleForPermanentAllocation);
console.log("checkpoint seat counts", JSON.stringify(gap.checkpointSeatCounts));
console.log("checkpoint query contracts", JSON.stringify(gap.checkpointQueryContracts));
console.log("gap records", JSON.stringify(gap.records));
console.log("elapsed milliseconds", Date.now() - startedAt);
console.log("permanent QLs", 0);
