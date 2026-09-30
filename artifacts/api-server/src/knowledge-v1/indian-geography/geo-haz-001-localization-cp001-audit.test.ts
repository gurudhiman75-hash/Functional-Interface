import assert from "node:assert/strict";
import { auditIndianGeoLocalizationV1 } from "./indian-geo-localization-v1";
import { GEO_HAZ_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-haz-001-adapter-v1";

const cp001 = GEO_HAZ_001_QUESTION_STUDIO_CORPUS_V1.filter((q) => q.cpId === "GEO-HAZ-001-CP001");
const audit = auditIndianGeoLocalizationV1(cp001, "GEO-HAZ-001");
console.log(JSON.stringify({cpId:"GEO-HAZ-001-CP001", ...audit}, null, 2));

assert.equal(cp001.length, 25);
assert.equal(audit.structuralValid, true);
assert.equal(audit.hindiStemResidueCount, 0);
assert.equal(audit.punjabiStemResidueCount, 0);
assert.equal(audit.hindiOptionResidueCount, 0);
assert.equal(audit.punjabiOptionResidueCount, 0);
assert.equal(audit.genericExplanationFallbackCount, 0);
assert.equal(audit.mixedScriptCount, 0);
assert.equal(audit.qualityReadyForFreeze, true);
