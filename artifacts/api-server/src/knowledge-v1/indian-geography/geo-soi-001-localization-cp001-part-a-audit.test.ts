import assert from "node:assert/strict";
import { GEO_SOI_001_CP001_REVIEW_BATCH_V1 } from "./soils/geo-soi-001-cp001-review-batch-v1";
import { auditIndianGeoLocalizationV1 } from "./indian-geo-localization-v1";

const slice=GEO_SOI_001_CP001_REVIEW_BATCH_V1.slice(0,18);
const audit=auditIndianGeoLocalizationV1(slice,"GEO-SOI-001");
assert.equal(slice.length,18);
assert.equal(audit.structuralValid,true);
assert.equal(audit.hindiStemResidueCount,0);
assert.equal(audit.punjabiStemResidueCount,0);
assert.equal(audit.hindiOptionResidueCount,0);
assert.equal(audit.punjabiOptionResidueCount,0);
assert.equal(audit.genericExplanationFallbackCount,0);
assert.equal(audit.mixedScriptCount,0);
assert.equal(audit.qualityReadyForFreeze,true);
