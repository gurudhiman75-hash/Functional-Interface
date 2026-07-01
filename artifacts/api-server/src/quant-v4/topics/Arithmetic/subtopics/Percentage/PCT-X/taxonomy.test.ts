import { strict as assert } from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { pctXTaxonomyReport, recoveredPct002CanonicalProblems } from "./taxonomy-report";
import { pctXTaxonomyStatus } from "./taxonomy-status";

const futureTaxonomyPath = path.join(
  process.cwd(),
  "src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-X/future-taxonomy.md",
);

assert.equal(pctXTaxonomyStatus.length, 6);
assert.deepEqual(
  pctXTaxonomyStatus.map((record) => record.permanentHome),
  ["UNKNOWN", "UNKNOWN", "UNKNOWN", "UNKNOWN", "UNKNOWN", "UNKNOWN"],
);
assert.deepEqual(
  pctXTaxonomyStatus.map((record) => record.temporaryHome),
  ["PCT-X", "PCT-X", "PCT-X", "PCT-X", "PCT-X", "PCT-X"],
);
assert.equal(pctXTaxonomyReport.implementedCpCount, 6);
assert.equal(pctXTaxonomyReport.temporaryClassification, "PCT-X");
assert.equal(pctXTaxonomyReport.permanentAssignments, 0);
assert.equal(pctXTaxonomyReport.lostCpCount, 0);
assert.equal(pctXTaxonomyReport.deletedCpCount, 0);
assert.equal(pctXTaxonomyReport.recommendation, "DEFER");
assert.equal(pctXTaxonomyReport.recoveredPct002.canonicalProblemCount, 10);
assert.equal(recoveredPct002CanonicalProblems.length, 10);

const markdown = fs.readFileSync(futureTaxonomyPath, "utf8");
for (const record of pctXTaxonomyStatus) {
  assert.ok(markdown.includes(record.cpName), `${record.cpName} missing from future taxonomy`);
}
for (const recovered of recoveredPct002CanonicalProblems) {
  assert.ok(markdown.includes(recovered.cpName), `${recovered.cpName} missing from future taxonomy`);
}

console.log("PCT-X taxonomy recovery test passed.");
