import { strict as assert } from "node:assert";
import {
  auditCom002SourceAuthorityExtension2,
  COM002_SOURCE_AUTHORITY_EXTENSION2,
} from "./com002-source-authority-extension2";

const audit = auditCom002SourceAuthorityExtension2();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.sourceCount, 2);
for (const scope of ["single-user-os", "multi-user-os", "time-sharing-os", "multitasking-os", "single-tasking-os-property"]) {
  assert.equal(audit.supportScopes.includes(scope), true, `Missing OS-type scope ${scope}`);
}
assert.equal(COM002_SOURCE_AUTHORITY_EXTENSION2.every((source) => source.authorityClass === "OFFICIAL_CURRICULUM" || source.authorityClass === "GOVERNMENT_REFERENCE"), true);
console.log("[COM002-SOURCE-AUTHORITY-EXTENSION2]", audit);
