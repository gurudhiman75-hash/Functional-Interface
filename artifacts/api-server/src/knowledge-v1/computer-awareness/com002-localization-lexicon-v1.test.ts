import { strict as assert } from "node:assert";

import { auditCom002LocalizationLexiconCoverageV1 } from "./com002-localization-lexicon-v1";

const audit = auditCom002LocalizationLexiconCoverageV1();
console.log("[COM002-LOCALIZATION-LEXICON-V1]", audit);
assert.equal(audit.approvedFactCount, 85);
assert.equal(
  audit.valid,
  true,
  `Missing COM-002 Hindi/Punjabi semantic lexemes:\n${audit.missingLexemes.join("\n")}`,
);
