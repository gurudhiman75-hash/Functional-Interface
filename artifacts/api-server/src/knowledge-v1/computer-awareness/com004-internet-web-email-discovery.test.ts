import { strict as assert } from "node:assert";

import {
  COM004_DISCOVERY_SOURCE_REFS,
  COM004_INTERNET_WEB_EMAIL_DISCOVERY,
  auditCom004InternetWebEmailDiscovery,
} from "./com004-internet-web-email-discovery";

const audit = auditCom004InternetWebEmailDiscovery();

assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.candidateCount, 36);
assert.equal(audit.relationFamilyCount >= 28, true);
assert.equal(audit.officialExamCandidateIds.length >= 15, true);
assert.equal(audit.pyqConfirmedCandidateIds.length >= 10, true);
assert.equal(audit.standardsBackedCandidateIds.length >= 8, true);
assert.equal(audit.regulatorBackedCandidateIds.length >= 4, true);
assert.equal(audit.com005BoundaryIds.length >= 5, true);
assert.equal(audit.com006BoundaryIds.length >= 3, true);
assert.equal(audit.bankingBoundaryIds.length >= 2, true);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.productionReady, false);
assert.equal(audit.sourceSaturationClosed, false);
assert.equal(audit.nextGate, "COM004_SOURCE_SATURATION_AND_MERGE_SPLIT_AUDIT");
assert.equal(Object.keys(COM004_DISCOVERY_SOURCE_REFS).length >= 10, true);

for (const requiredCandidate of [
  "WEB-DISC-001",
  "WEB-DISC-002",
  "WEB-DISC-006",
  "WEB-DISC-011",
  "WEB-DISC-013",
  "WEB-DISC-017",
  "WEB-DISC-021",
  "WEB-DISC-027",
  "WEB-DISC-028",
  "WEB-DISC-029",
  "WEB-DISC-031",
  "WEB-DISC-033",
  "WEB-DISC-036",
]) {
  assert.equal(
    COM004_INTERNET_WEB_EMAIL_DISCOVERY.some((candidate) => candidate.candidateId === requiredCandidate),
    true,
    `COM-004 discovery missing ${requiredCandidate}`,
  );
}

const httpsSafety = COM004_INTERNET_WEB_EMAIL_DISCOVERY.find((candidate) => candidate.candidateId === "WEB-DISC-033");
assert.ok(httpsSafety);
assert.equal(
  httpsSafety.ambiguityRisks?.some((risk) => /HTTPS alone does not prove/i.test(risk)),
  true,
  "COM-004 must not teach HTTPS alone as proof that a banking site is legitimate",
);

const domain = COM004_INTERNET_WEB_EMAIL_DISCOVERY.find((candidate) => candidate.candidateId === "WEB-DISC-015");
assert.ok(domain);
assert.equal(
  domain.ownershipNotes?.some((note) => note.includes("COM-005")),
  true,
  "COM-004 must protect DNS/IP mechanics for COM-005 Networking",
);

const credentialSafety = COM004_INTERNET_WEB_EMAIL_DISCOVERY.find((candidate) => candidate.candidateId === "WEB-DISC-034");
assert.ok(credentialSafety);
assert.equal(
  credentialSafety.ownershipNotes?.some((note) => note.includes("COM-006")),
  true,
  "COM-004 must protect phishing/social-engineering taxonomy for COM-006 Cyber Security",
);

const eBanking = COM004_INTERNET_WEB_EMAIL_DISCOVERY.find((candidate) => candidate.candidateId === "WEB-DISC-031");
assert.ok(eBanking);
assert.equal(
  eBanking.ownershipNotes?.some((note) => /Banking Awareness|current affairs/i.test(note)),
  true,
  "COM-004 must not absorb mutable banking-product/rule knowledge",
);

const composition = COM004_INTERNET_WEB_EMAIL_DISCOVERY.find((candidate) => candidate.candidateId === "WEB-DISC-036");
assert.ok(composition);
assert.equal(
  composition.ownershipNotes?.some((note) => /Composition-only|source-approved/i.test(note)),
  true,
  "WEB-DISC-036 must remain a composition-only family",
);

console.log("[COM004-INTERNET-WEB-EMAIL-DISCOVERY]", audit);
