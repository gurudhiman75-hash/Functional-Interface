import { strict as assert } from "node:assert";

import {
  COM004_INTERNET_WEB_EMAIL_DISCOVERY,
  auditCom004InternetWebEmailDiscovery,
} from "./com004-internet-web-email-discovery";

const audit = auditCom004InternetWebEmailDiscovery();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.candidateCount, 42);
assert.equal(audit.relationFamilyCount >= 24, true);
assert.equal(audit.pyqConfirmedCandidateIds.length >= 6, true);
assert.equal(audit.ambiguityGuardedCandidateIds.length >= 8, true);
assert.equal(audit.crossBoundaryGuardedCandidateIds.length >= 4, true);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.productionReady, false);

for (const family of ["D-CP-A", "D-CP-B", "D-CP-C", "D-CP-D", "D-CP-E", "D-CP-F", "D-CP-G", "D-CP-H", "D-CP-I"]) {
  assert.equal((audit.familyCounts as Record<string, number>)[family] >= 2, true, `Thin COM-004 family ${family}`);
}

for (const requiredCandidate of [
  "WEB-DISC-002",
  "WEB-DISC-005",
  "WEB-DISC-008",
  "WEB-DISC-010",
  "WEB-DISC-012",
  "WEB-DISC-014",
  "WEB-DISC-019",
  "WEB-DISC-022",
  "WEB-DISC-028",
  "WEB-DISC-035",
  "WEB-DISC-036",
  "WEB-DISC-037",
  "WEB-DISC-039",
  "WEB-DISC-042",
]) {
  assert.equal(
    COM004_INTERNET_WEB_EMAIL_DISCOVERY.some((candidate) => candidate.candidateId === requiredCandidate),
    true,
    `COM-004 discovery missing ${requiredCandidate}`,
  );
}

const upi = COM004_INTERNET_WEB_EMAIL_DISCOVERY.find((candidate) => candidate.candidateId === "WEB-DISC-028");
assert.ok(upi);
assert.equal(upi.ambiguityRisks?.some((risk) => risk.includes("Unified Payments Interface")), true);

const https = COM004_INTERNET_WEB_EMAIL_DISCOVERY.find((candidate) => candidate.candidateId === "WEB-DISC-012");
assert.ok(https);
assert.equal(https.ambiguityRisks?.some((risk) => /trustworthy/i.test(risk)), true);

const mailProtocols = COM004_INTERNET_WEB_EMAIL_DISCOVERY.filter((candidate) =>
  ["WEB-DISC-019", "WEB-DISC-020", "WEB-DISC-021", "WEB-DISC-022"].includes(candidate.candidateId),
);
assert.equal(mailProtocols.length, 4);
assert.equal(mailProtocols.every((candidate) => candidate.evidence.includes("STANDARDS_AUTHORITY")), true);

console.log("[COM004-INTERNET-WEB-EMAIL-DISCOVERY]", audit);
