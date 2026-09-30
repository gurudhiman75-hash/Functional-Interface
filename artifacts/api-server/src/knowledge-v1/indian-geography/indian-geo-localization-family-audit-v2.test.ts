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


console.log(JSON.stringify({
  authorityId: audit.authorityId,
  structuralValid: audit.structuralValid,
  qualityReadyForFreeze: audit.qualityReadyForFreeze,
  reviewRequired: audit.reviewRequired,
  totals: audit.totals,
  packages: audit.packages.map((pkg) => ({
    packageId: pkg.packageId,
    canonicalQuestionCount: pkg.canonicalQuestionCount,
    hindiStemResidueCount: pkg.hindiStemResidueCount,
    punjabiStemResidueCount: pkg.punjabiStemResidueCount,
    hindiOptionResidueCount: pkg.hindiOptionResidueCount,
    punjabiOptionResidueCount: pkg.punjabiOptionResidueCount,
    genericExplanationFallbackCount: pkg.genericExplanationFallbackCount,
    mixedScriptCount: pkg.mixedScriptCount,
    qualityReadyForFreeze: pkg.qualityReadyForFreeze,
  })),
}, null, 2));

// CI trigger probe: validates dedicated localization workflow scheduling.
