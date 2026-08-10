import { buildSea001SaturationCorpus } from "./saturation/corpus.ts";
import {
  runSea001GapAudit,
  runSea001InverseAudit,
  runSea001MergeSplitAudit,
} from "./saturation/authority-audits.ts";

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

const gap = runSea001GapAudit(corpus.caselets);
if (!gap.passedAutomatedGate || gap.technicalGapCount !== 0) {
  throw new Error(`SEA-001 technical gap audit failed: ${JSON.stringify(gap.records.filter((record) => record.disposition === "GENUINE_MISSING_IMPLEMENTATION"))}`);
}
if (gap.eligibleForPermanentAllocation) {
  throw new Error("SEA-001 must not become eligible for permanent allocation while source/manual governance gaps remain open");
}
if (gap.openGovernanceCount === 0) {
  throw new Error("SEA-001 gap audit unexpectedly lost its explicit source/manual governance blockers");
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
console.log("open governance gaps", gap.openGovernanceCount);
console.log("permanent allocation eligible", gap.eligibleForPermanentAllocation);
console.log("checkpoint seat counts", JSON.stringify(gap.checkpointSeatCounts));
console.log("checkpoint query contracts", JSON.stringify(gap.checkpointQueryContracts));
console.log("gap records", JSON.stringify(gap.records));
console.log("elapsed milliseconds", Date.now() - startedAt);
console.log("permanent QLs", 0);
