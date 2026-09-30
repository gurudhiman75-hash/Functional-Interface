import assert from "node:assert/strict";
import { GEO_SOI_001_CP001_REVIEW_BATCH_V1 } from "./soils/geo-soi-001-cp001-review-batch-v1";
import { auditIndianGeoLocalizationV1, localizeIndianGeoQuestionV1 } from "./indian-geo-localization-v1";

const slice=GEO_SOI_001_CP001_REVIEW_BATCH_V1.slice(0,36);
const audit=auditIndianGeoLocalizationV1(slice,"GEO-SOI-001");
assert.equal(slice.length,36);
assert.equal(audit.structuralValid,true);
assert.equal(audit.hindiStemResidueCount,0);
assert.equal(audit.punjabiStemResidueCount,0);
assert.equal(audit.hindiOptionResidueCount,0);
assert.equal(audit.punjabiOptionResidueCount,0);
assert.equal(audit.genericExplanationFallbackCount,0);
assert.equal(audit.mixedScriptCount,0);
assert.equal(audit.qualityReadyForFreeze,true);

const q2=GEO_SOI_001_CP001_REVIEW_BATCH_V1[1]!;
assert.equal(q2.correctIndex,1);
assert.equal(localizeIndianGeoQuestionV1(q2,"hi","GEO-SOI-001").canonicalAnswer,"मिट्टी");
assert.equal(localizeIndianGeoQuestionV1(q2,"pa","GEO-SOI-001").canonicalAnswer,"ਮਿੱਟੀ");
const q20=GEO_SOI_001_CP001_REVIEW_BATCH_V1[19]!;
assert.equal(q20.correctIndex,3);
assert.equal(localizeIndianGeoQuestionV1(q20,"hi","GEO-SOI-001").canonicalAnswer,"यह अपक्षय और पदार्थों के संचलन के लिए नमी देती है");
assert.equal(localizeIndianGeoQuestionV1(q20,"pa","GEO-SOI-001").canonicalAnswer,"ਇਹ ਅਪਖੰਡਨ ਅਤੇ ਪਦਾਰਥਾਂ ਦੀ ਹਿਲਚਲ ਲਈ ਨਮੀ ਦਿੰਦੀ ਹੈ");
