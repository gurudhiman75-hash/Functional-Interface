import { strict as assert } from "node:assert";

import {
  COM002_SOURCE_AUTHORITY_EXTENSION,
  auditCom002SourceAuthorityExtension,
} from "./com002-source-authority-extension";

const audit = auditCom002SourceAuthorityExtension();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.sourceCount, 9);

for (const scope of [
  "os-function",
  "gui-cli-awareness",
  "os-type-classification",
  "real-time-os-property",
  "kernel-core",
  "taskbar-function",
  "start-menu-function",
  "delete-recovery-behavior",
  "boot-load-operating-system",
  "shutdown-action",
  "restart-action",
]) {
  assert.equal(audit.supportScopes.includes(scope), true, `Missing COM-002 truth scope ${scope}`);
}

assert.equal(
  COM002_SOURCE_AUTHORITY_EXTENSION.every(
    (source) => source.authorityClass === "VENDOR_TECHNICAL",
  ),
  true,
);

console.log("[COM002-SOURCE-AUTHORITY-EXTENSION]", audit);
