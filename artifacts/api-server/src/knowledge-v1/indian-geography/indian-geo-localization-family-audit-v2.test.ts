import assert from "node:assert/strict";
import { auditIndianGeoLocalizationFamilyV2 } from "./indian-geo-localization-family-audit-v2";

const audit = auditIndianGeoLocalizationFamilyV2();

assert.equal(audit.authorityId, "INDIAN-GEO-LOCALIZATION-FAMILY-QA-V2");
assert.equal(audit.packageCount, 15);
assert.equal(audit.structuralValid, true);
assert.equal(audit.totals.structuralIssueCount, 0);
assert.equal(audit.packages.every((pkg) => pkg.canonicalQuestionCount > 0), true);
assert.equal(
  audit.totals.localizedVersionCount,
  audit.totals.canonicalQuestionCount * 3,
);
assert.equal(
  audit.packages.every((pkg) => pkg.localizedVersionCount === pkg.canonicalQuestionCount * 3),
  true,
);

// Quality freeze is intentionally a separate gate. It may remain false until
// explicit Hindi/Punjabi stem/explanation cleanup eliminates all measured residue.
assert.equal(audit.reviewRequired, !audit.qualityReadyForFreeze);
