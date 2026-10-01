import assert from "node:assert/strict";
import { auditIndianGeoLocalizationV1 } from "./indian-geo-localization-v1";
import { GEO_RIV_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-riv-001-adapter-v1";

const audit=auditIndianGeoLocalizationV1(GEO_RIV_001_QUESTION_STUDIO_CORPUS_V1,"GEO-RIV-001");
console.log(JSON.stringify({scope:"GEO-RIV-001",questionCount:GEO_RIV_001_QUESTION_STUDIO_CORPUS_V1.length,...audit},null,2));
assert.equal(GEO_RIV_001_QUESTION_STUDIO_CORPUS_V1.length,762);
assert.equal(audit.structuralValid,true);
assert.equal(audit.hindiStemResidueCount,0);
assert.equal(audit.punjabiStemResidueCount,0);
assert.equal(audit.hindiOptionResidueCount,0);
assert.equal(audit.punjabiOptionResidueCount,0);
assert.equal(audit.genericExplanationFallbackCount,0);
assert.equal(audit.mixedScriptCount,0);
assert.equal(audit.qualityReadyForFreeze,true);
