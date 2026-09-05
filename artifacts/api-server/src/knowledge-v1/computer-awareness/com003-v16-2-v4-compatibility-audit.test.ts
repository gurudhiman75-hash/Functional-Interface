import { strict as assert } from "node:assert";
import { COM003_V16_2_V4_COMPATIBILITY } from "./com003-v16-2-v4-compatibility-audit";

const audit = COM003_V16_2_V4_COMPATIBILITY;
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questions, 228);
assert.equal(audit.localizationLineageReusable, true);
assert.equal(audit.mappings.length, 228);
assert.equal(new Set(audit.mappings.map((item) => item.legacyQuestionId)).size, 228);
assert.equal(new Set(audit.mappings.map((item) => item.currentQuestionId)).size, 228);

console.log("[COM003-V16.2-V4-COMPATIBILITY]", {
  questions: audit.questions,
  legacyAuthority: audit.legacyAuthority,
  currentAuthority: audit.currentAuthority,
  compatibility: audit.compatibility,
  localizationLineageReusable: audit.localizationLineageReusable,
});
