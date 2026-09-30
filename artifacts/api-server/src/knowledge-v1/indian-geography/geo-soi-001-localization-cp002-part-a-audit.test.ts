import assert from "node:assert/strict";
import { GEO_SOI_001_CP002_REVIEW_BATCH_V1 } from "./soils/geo-soi-001-cp002-review-batch-v1";
import { auditIndianGeoLocalizationV1, localizeIndianGeoQuestionV1 } from "./indian-geo-localization-v1";

const slice=GEO_SOI_001_CP002_REVIEW_BATCH_V1.slice(0,36);
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

const q2=GEO_SOI_001_CP002_REVIEW_BATCH_V1[1]!;
assert.equal(q2.correctIndex,1);
assert.equal(localizeIndianGeoQuestionV1(q2,"hi","GEO-SOI-001").canonicalAnswer,"उत्तरी मैदान");
assert.equal(localizeIndianGeoQuestionV1(q2,"pa","GEO-SOI-001").canonicalAnswer,"ਉੱਤਰੀ ਮੈਦਾਨ");
const q18=GEO_SOI_001_CP002_REVIEW_BATCH_V1[17]!;
assert.equal(q18.correctIndex,1);
assert.equal(localizeIndianGeoQuestionV1(q18,"hi","GEO-SOI-001").canonicalAnswer,"केवल I और II");
assert.equal(localizeIndianGeoQuestionV1(q18,"pa","GEO-SOI-001").canonicalAnswer,"ਕੇਵਲ I ਅਤੇ II");

const q36=GEO_SOI_001_CP002_REVIEW_BATCH_V1[35]!;
assert.equal(q36.correctIndex,3);
assert.equal(localizeIndianGeoQuestionV1(q36,"hi","GEO-SOI-001").canonicalAnswer,"केवल I और II");
assert.equal(localizeIndianGeoQuestionV1(q36,"pa","GEO-SOI-001").canonicalAnswer,"ਕੇਵਲ I ਅਤੇ II");
