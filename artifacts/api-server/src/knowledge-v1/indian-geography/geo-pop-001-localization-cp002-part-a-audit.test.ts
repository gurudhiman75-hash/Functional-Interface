import assert from "node:assert/strict";
import { auditIndianGeoLocalizationV1 } from "./indian-geo-localization-v1";
import { GEO_POP_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-pop-001-adapter-v1";
const first=GEO_POP_001_QUESTION_STUDIO_CORPUS_V1.filter(q=>q.cpId==="GEO-POP-001-CP002" && /^GEO-POP-001-CP002-Q00[1-6]$/.test(q.questionId));
assert.equal(first.length,6);
const audit=auditIndianGeoLocalizationV1(first,"GEO-POP-001");
console.log(JSON.stringify({section:"GEO-POP-001 CP002 natural increase",...audit},null,2));
assert.equal(audit.structuralValid,true);
assert.equal(audit.hindiStemResidueCount,0);
assert.equal(audit.punjabiStemResidueCount,0);
assert.equal(audit.hindiOptionResidueCount,0);
assert.equal(audit.punjabiOptionResidueCount,0);
assert.equal(audit.genericExplanationFallbackCount,0);
assert.equal(audit.mixedScriptCount,0);
assert.equal(audit.qualityReadyForFreeze,true);
const mismatches=[
 ["GROWTH-STEADY-MATCH","1921–1951"],
 ["GROWTH-RAPID-MATCH","1951–1981"],
 ["GROWTH-POST1981-MATCH","after 1981"],
 ["COMP-AGE-MATCH","age composition"],
 ["COMP-SEX-MATCH","sex ratio"],
 ["COMP-LIT-MATCH","literacy rate"]
] as const;
for(const [fact,phrase] of mismatches){
 const found=GEO_POP_001_QUESTION_STUDIO_CORPUS_V1.find(q=>q.cpId==="GEO-POP-001-CP002" && q.sourceFactIds?.includes(fact));
 assert.ok(found,"Missing demographic fact "+fact);
 assert.ok(found.stem.toLowerCase().includes(phrase.toLowerCase()),fact+": stem no longer describes the answer");
}
