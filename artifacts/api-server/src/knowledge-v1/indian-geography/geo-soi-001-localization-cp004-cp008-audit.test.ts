import assert from "node:assert/strict";
import { GEO_SOI_001_CP004_REVIEW_BATCH_V1 } from "./soils/geo-soi-001-cp004-review-batch-v1";
import { GEO_SOI_001_CP005_REVIEW_BATCH_V1 } from "./soils/geo-soi-001-cp005-review-batch-v1";
import { GEO_SOI_001_CP006_REVIEW_BATCH_V1 } from "./soils/geo-soi-001-cp006-review-batch-v1";
import { GEO_SOI_001_CP007_REVIEW_BATCH_V1 } from "./soils/geo-soi-001-cp007-review-batch-v1";
import { GEO_SOI_001_CP008_REVIEW_BATCH_V1 } from "./soils/geo-soi-001-cp008-review-batch-v1";
import { auditIndianGeoLocalizationV1, localizeIndianGeoQuestionV1 } from "./indian-geo-localization-v1";

const questions=[
 ...GEO_SOI_001_CP004_REVIEW_BATCH_V1,
 ...GEO_SOI_001_CP005_REVIEW_BATCH_V1,
 ...GEO_SOI_001_CP006_REVIEW_BATCH_V1,
 ...GEO_SOI_001_CP007_REVIEW_BATCH_V1,
 ...GEO_SOI_001_CP008_REVIEW_BATCH_V1,
];

const COMMON=/\b(?:which|what|why|where|when|how|the|and|or|is|are|was|were|does|do|did|can|could|would|should|has|have|had|with|from|into|for|of|to|in|on|at|by|as|than|that|this|these|those|most|main|major|only|correct|statement|following)\b/gi;
for (const q of questions) {
  for (const language of ["hi","pa"] as const) {
    const l=localizeIndianGeoQuestionV1(q,language,"GEO-SOI-001");
    const stemHits=l.stem.match(COMMON);
    if (stemHits) console.log("RESIDUE_STEM",q.questionId,language,JSON.stringify(stemHits),l.stem);
    l.options.forEach((o,i)=>{ const hits=o.match(COMMON); if(hits) console.log("RESIDUE_OPTION",q.questionId,language,i,JSON.stringify(hits),o); });
  }
}

const audit=auditIndianGeoLocalizationV1(questions,"GEO-SOI-001");
console.log(JSON.stringify({scope:"GEO-SOI-001-CP004-CP008",questionCount:questions.length,...audit},null,2));
assert.equal(questions.length,270);
assert.equal(audit.structuralValid,true);
assert.equal(audit.hindiStemResidueCount,0);
assert.equal(audit.punjabiStemResidueCount,0);
assert.equal(audit.hindiOptionResidueCount,0);
assert.equal(audit.punjabiOptionResidueCount,0);
assert.equal(audit.genericExplanationFallbackCount,0);
assert.equal(audit.mixedScriptCount,0);
assert.equal(audit.qualityReadyForFreeze,true);
