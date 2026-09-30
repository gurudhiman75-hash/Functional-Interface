import assert from "node:assert/strict";
import { auditIndianGeoLocalizationV1 } from "./indian-geo-localization-v1";
import { GEO_TRN_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-trn-001-adapter-v1";
const audit=auditIndianGeoLocalizationV1(GEO_TRN_001_QUESTION_STUDIO_CORPUS_V1,"GEO-TRN-001");
console.log(JSON.stringify({packageId:"GEO-TRN-001",...audit},null,2));
assert.equal(GEO_TRN_001_QUESTION_STUDIO_CORPUS_V1.length,330);
