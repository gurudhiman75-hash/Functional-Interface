import { strict as assert } from "node:assert";

import { COM004_SOURCE_AUTHORITIES, auditCom004SourceManifest } from "./com004-source-manifest";

const audit = auditCom004SourceManifest();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.sourceCount >= 21, true);
assert.equal(audit.officialScopeCount >= 3, true);
assert.equal(audit.technicalAuthorityCount >= 12, true);
assert.equal(audit.pyqCount >= 5, true);

for (const requiredSource of [
  "SSC-CHSL-2024-NOTICE",
  "NIELIT-CCC-REV4-2023",
  "WHATWG-URL-STANDARD-2026",
  "IETF-SMTP-RFC5321",
  "IETF-IMAP-RFC9051",
  "IETF-POP3-RFC1939",
  "NPCI-UPI-PRODUCT-2026",
  "NPCI-IMPS-BOOKLET-2026",
  "NPCI-AEPS-BOOKLET-2026",
  "RBI-NEFT-FAQ-2024",
  "RBI-RTGS-FAQ-2022",
]) {
  assert.equal(
    COM004_SOURCE_AUTHORITIES.some((source) => source.sourceId === requiredSource),
    true,
    `COM-004 source manifest missing ${requiredSource}`,
  );
}

const upi = COM004_SOURCE_AUTHORITIES.find((source) => source.sourceId === "NPCI-UPI-PRODUCT-2026");
assert.ok(upi);
assert.equal(upi.notes.some((note) => note.includes("Unified Payments Interface")), true);

console.log("[COM004-SOURCE-MANIFEST]", audit);
