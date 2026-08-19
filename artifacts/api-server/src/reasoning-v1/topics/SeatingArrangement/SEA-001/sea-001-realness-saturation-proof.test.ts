import { strict as assert } from "node:assert";

import { buildSea001SaturationCorpus } from "./saturation/corpus.ts";
import { auditSea001StructuralClones } from "./saturation/structural-clone-audit.ts";

const corpus = buildSea001SaturationCorpus(80);
const audit = auditSea001StructuralClones(corpus.caselets);

assert.equal(audit.caseletCount, 1600);
assert.equal(Object.keys(audit.authorityStructureByBlueprint).length, 20);
assert.equal(audit.methodology, "ROLE_GRAPH_V1_TELEMETRY_ONLY");
assert.equal(audit.thresholdStatus, "UNSET_PENDING_MEASUREMENT");

for (const [label, stats] of Object.entries({
  authorityStructure: audit.authorityStructure,
  familyStructure: audit.familyStructure,
  nearStructure: audit.nearStructure,
  lexicalTemplate: audit.lexicalTemplate,
  structuralQueryCombination: audit.structuralQueryCombination,
})) {
  assert(stats.uniqueCount > 0, `${label}: expected at least one distinct fingerprint`);
  assert(stats.uniqueCount <= audit.caseletCount, `${label}: unique count cannot exceed corpus size`);
  assert(stats.cloneCaseletCount >= 0, `${label}: clone count cannot be negative`);
  assert(stats.largestCluster >= 1, `${label}: largest cluster must be at least one`);
}

for (const [blueprintId, stats] of Object.entries(audit.authorityStructureByBlueprint)) {
  assert.equal(stats.uniqueCount + stats.cloneCaseletCount, 80, `${blueprintId}: cluster accounting must cover all 80 caselets`);
}

const ratio = (uniqueCount: number) => Number((uniqueCount / audit.caseletCount).toFixed(4));

console.log("PASS_SEA_001_REALNESS_SATURATION_MEASUREMENT");
console.log("methodology", audit.methodology);
console.log("thresholds", audit.thresholdStatus);
console.log("caselets", audit.caseletCount);
console.log("authority structure", JSON.stringify({ ...audit.authorityStructure, uniqueRatio: ratio(audit.authorityStructure.uniqueCount) }));
console.log("family structure", JSON.stringify({ ...audit.familyStructure, uniqueRatio: ratio(audit.familyStructure.uniqueCount) }));
console.log("near structure", JSON.stringify({ ...audit.nearStructure, uniqueRatio: ratio(audit.nearStructure.uniqueCount) }));
console.log("lexical template", JSON.stringify({ ...audit.lexicalTemplate, uniqueRatio: ratio(audit.lexicalTemplate.uniqueCount) }));
console.log("structure + query bundle", JSON.stringify({ ...audit.structuralQueryCombination, uniqueRatio: ratio(audit.structuralQueryCombination.uniqueCount) }));
console.log("authority structure by blueprint", JSON.stringify(audit.authorityStructureByBlueprint));
