import assert from "node:assert/strict";
import { GEO_SOI_001_CP009_REVIEW_BATCH_V1 } from "./soils/geo-soi-001-cp009-review-batch-v1";
import { GEO_SOI_001_CP010_REVIEW_BATCH_V1 } from "./soils/geo-soi-001-cp010-review-batch-v1";
import { GEO_SOI_001_CP011_REVIEW_BATCH_V1 } from "./soils/geo-soi-001-cp011-review-batch-v1";
import { GEO_SOI_001_CP012_REVIEW_BATCH_V1 } from "./soils/geo-soi-001-cp012-review-batch-v1";
import { auditIndianGeoLocalizationV1 } from "./indian-geo-localization-v1";

const questions=[
 ...GEO_SOI_001_CP009_REVIEW_BATCH_V1,
 ...GEO_SOI_001_CP010_REVIEW_BATCH_V1,
 ...GEO_SOI_001_CP011_REVIEW_BATCH_V1,
 ...GEO_SOI_001_CP012_REVIEW_BATCH_V1,
];
const audit=auditIndianGeoLocalizationV1(questions,"GEO-SOI-001");
console.log(JSON.stringify({scope:"GEO-SOI-001-CP009-CP012",questionCount:questions.length,...audit},null,2));
assert.equal(questions.length,216);
assert.equal(audit.structuralValid,true);
assert.equal(audit.hindiStemResidueCount,0);
assert.equal(audit.punjabiStemResidueCount,0);
assert.equal(audit.hindiOptionResidueCount,0);
assert.equal(audit.punjabiOptionResidueCount,0);
assert.equal(audit.genericExplanationFallbackCount,0);
assert.equal(audit.mixedScriptCount,0);
assert.equal(audit.qualityReadyForFreeze,true);
