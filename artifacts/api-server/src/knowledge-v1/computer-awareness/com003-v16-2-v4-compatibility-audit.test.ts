import { strict as assert } from "node:assert";
import { COM003_V16_2_V4_COMPATIBILITY } from "./com003-v16-2-v4-compatibility-audit";

const audit = COM003_V16_2_V4_COMPATIBILITY;
assert.equal(audit.questions, 228);
assert.equal(audit.valid, false, "V4 must not be treated as structurally equivalent to V16.2");
assert.equal(audit.localizationLineageReusable, false);
assert.ok(audit.issues.length > 0, "Expected structural drift between V4 and V16.2");
assert.ok(audit.issues.some((issue) => issue.startsWith("STRUCTURAL_DRIFT:")));
assert.ok(audit.issues.some((issue) => issue.startsWith("ARRAY_DRIFT:")));

console.log("[COM003-V16.2-V4-INCOMPATIBILITY-LOCK]", {
  questions: audit.questions,
  legacyAuthority: audit.legacyAuthority,
  currentAuthority: audit.currentAuthority,
  structuralEquivalence: audit.valid,
  localizationLineageReusable: audit.localizationLineageReusable,
  driftIssueCount: audit.issues.length,
  policy: "FAIL_CLOSED_REQUIRE_LOCALIZATION_MIGRATION_V2",
});
