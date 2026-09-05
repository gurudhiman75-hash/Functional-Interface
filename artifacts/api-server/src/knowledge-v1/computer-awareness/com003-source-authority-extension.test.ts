import { strict as assert } from "node:assert";

import {
  COM003_SOURCE_AUTHORITY_EXTENSION,
  auditCom003SourceAuthorityExtension,
} from "./com003-source-authority-extension";

const audit = auditCom003SourceAuthorityExtension();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.sourceCount >= 15, true);

for (const requiredSourceId of [
  "MICROSOFT-WORD-FIND-REPLACE-2026",
  "MICROSOFT-WORD-PROOFING-2026",
  "MICROSOFT-WORD-ALIGNMENT-2026",
  "MICROSOFT-WORD-ORIENTATION-2026",
  "MICROSOFT-EXCEL-REFERENCES-2026",
  "MICROSOFT-EXCEL-SUM-AUTOSUM-2026",
  "MICROSOFT-EXCEL-SORT-2026",
  "MICROSOFT-EXCEL-FILTER-2026",
  "MICROSOFT-EXCEL-AUTOFILL-2026",
  "MICROSOFT-OFFICE-CHART-TYPES-2026",
  "MICROSOFT-POWERPOINT-LAYOUT-2026",
  "MICROSOFT-POWERPOINT-TRANSITION-TIMING-2026",
]) {
  assert.equal(
    COM003_SOURCE_AUTHORITY_EXTENSION.some((source) => source.sourceId === requiredSourceId),
    true,
    `COM-003 relation authority missing ${requiredSourceId}`,
  );
}

assert.equal(
  COM003_SOURCE_AUTHORITY_EXTENSION.every((source) => source.authorityClass === "VENDOR_TECHNICAL"),
  true,
);

console.log("[COM003-SOURCE-AUTHORITY-EXTENSION]", audit);
