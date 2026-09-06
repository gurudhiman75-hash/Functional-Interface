import { strict as assert } from "node:assert";

import {
  COM004_DISCOVERY_GAP_ADDITIONS_V2,
  auditCom004DiscoveryGapAdditionsV2,
} from "./com004-discovery-gap-additions-v2";

const audit = auditCom004DiscoveryGapAdditionsV2();

assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.gapCandidateCount, 4);
assert.equal(audit.totalDiscoveryCandidateCount, 40);
assert.equal(audit.officialExamIds.length >= 3, true);
assert.equal(audit.historyIds.length, 3);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.productionReady, false);
assert.equal(audit.nextGate, "COM004_SOURCE_SATURATION_V2_EVIDENCE_CLOSURE_AND_MERGE_SPLIT");

for (const candidateId of ["WEB-DISC-037", "WEB-DISC-038", "WEB-DISC-039", "WEB-DISC-040"]) {
  const candidate = COM004_DISCOVERY_GAP_ADDITIONS_V2.find((item) => item.candidateId === candidateId);
  assert.ok(candidate, `Missing ${candidateId}`);
  assert.equal(candidate.productionState, "DISCOVERY_ONLY");
  assert.equal(candidate.surfaceVariants.length >= 3, true);
}

const isp = COM004_DISCOVERY_GAP_ADDITIONS_V2.find((candidate) => candidate.candidateId === "WEB-DISC-037");
assert.ok(isp);
assert.equal(isp.ownershipNotes?.some((note) => note.includes("COM-005")), true);

const arpanet = COM004_DISCOVERY_GAP_ADDITIONS_V2.find((candidate) => candidate.candidateId === "WEB-DISC-038");
assert.ok(arpanet);
assert.equal(arpanet.evidence.includes("OFFICIAL_CURRICULUM"), true);
assert.equal(arpanet.ambiguityRisks?.some((risk) => /identical to the modern Internet/i.test(risk)), true);

const webHistory = COM004_DISCOVERY_GAP_ADDITIONS_V2.find((candidate) => candidate.candidateId === "WEB-DISC-039");
assert.ok(webHistory);
assert.equal(webHistory.ambiguityRisks?.some((risk) => /distinct from invention of the Internet/i.test(risk)), true);

console.log("[COM004-DISCOVERY-GAP-ADDITIONS-V2]", audit);
