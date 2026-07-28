import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  countLabelledPrescribedGroupsExact,
  countSpecifiedPairDifferentLabelledEqualGroupsExact,
  countSpecifiedPairDifferentUnlabelledEqualGroupsExact,
  countSpecifiedPairSameLabelledEqualGroupsExact,
  countSpecifiedPairSameUnlabelledEqualGroupsExact,
  countUnlabelledPrescribedGroupsExact,
  countUnnamedPairsExact,
} from "./cp011-discovery-core";
import {
  bellNumberExact,
  countDistinctToAtMostIdenticalBoxesExact,
  countDistinctToLabelledBoxesAtLeastOneEmptyExact,
  countDistinctToLabelledBoxesExactlyKNonEmptyExact,
  countDistinctToLabelledBoxesExact,
  countDistinctToLabelledBoxesNonEmptyExact,
  countIdenticalToAtMostIdenticalBoxesExact,
  countIdenticalToIdenticalBoxesExact,
  countIdenticalToLabelledBoxesAtLeastOneEmptyExact,
  countIdenticalToLabelledBoxesExactlyKNonEmptyExact,
  countIdenticalToLabelledBoxesExact,
  countIdenticalToLabelledBoxesNonEmptyExact,
  countIdenticalToLabelledBoxesWithMinimumExact,
  countIdenticalToLabelledBoxesWithUniformCapacityExact,
  stirlingSecondKindExact,
} from "./cp011-discovery-distribution";
import { buildCp011PrototypeChecks } from "./cp011-discovery-prototype";

assert.equal(countLabelledPrescribedGroupsExact([4, 3]), 35n);
assert.equal(countLabelledPrescribedGroupsExact([3, 3]), 20n);
assert.equal(countUnlabelledPrescribedGroupsExact([3, 3]), 10n);
assert.equal(countUnnamedPairsExact(4), 105n);
assert.equal(countUnlabelledPrescribedGroupsExact([3, 3, 2, 2]), 6300n);
assert.equal(countDistinctToLabelledBoxesExact(4, 3), 81n);
assert.equal(countDistinctToLabelledBoxesNonEmptyExact(4, 3), 36n);
assert.equal(countDistinctToLabelledBoxesExactlyKNonEmptyExact(5, 3, 2), 90n);
assert.equal(countDistinctToLabelledBoxesAtLeastOneEmptyExact(5, 3), 93n);
assert.equal(stirlingSecondKindExact(5, 3), 25n);
assert.equal(countDistinctToAtMostIdenticalBoxesExact(5, 3), 41n);
assert.equal(bellNumberExact(5), 52n);
assert.equal(countIdenticalToLabelledBoxesExact(6, 3), 28n);
assert.equal(countIdenticalToLabelledBoxesNonEmptyExact(6, 3), 10n);
assert.equal(countIdenticalToLabelledBoxesExactlyKNonEmptyExact(6, 3, 2), 15n);
assert.equal(countIdenticalToLabelledBoxesAtLeastOneEmptyExact(6, 3), 18n);
assert.equal(countIdenticalToLabelledBoxesWithMinimumExact(8, 3, 2), 6n);
assert.equal(countIdenticalToLabelledBoxesWithUniformCapacityExact(6, 3, 3), 10n);
assert.equal(countIdenticalToIdenticalBoxesExact(7, 3), 4n);
assert.equal(countIdenticalToAtMostIdenticalBoxesExact(7, 3), 8n);
assert.equal(countSpecifiedPairSameLabelledEqualGroupsExact(8, 2), 30n);
assert.equal(countSpecifiedPairDifferentLabelledEqualGroupsExact(8, 2), 40n);
assert.equal(countSpecifiedPairSameUnlabelledEqualGroupsExact(8, 2), 15n);
assert.equal(countSpecifiedPairDifferentUnlabelledEqualGroupsExact(8, 2), 20n);

const checks = buildCp011PrototypeChecks();
assert.equal(checks.length, 35);
for (const check of checks) assert.equal(check.formula, check.independent, check.id);
const familyCounts = Object.fromEntries(
  [...new Set(checks.map((check) => check.family))]
    .sort()
    .map((family) => [family, checks.filter((check) => check.family === family).length]),
);
assert.deepEqual(familyCounts, {
  BOUNDED_INVERSE: 3,
  DISTINCT_TO_IDENTICAL_BOXES: 3,
  DISTINCT_TO_LABELLED_BOXES: 7,
  DISTINCT_TO_PRESCRIBED_GROUPS: 8,
  GROUP_RELATION_RESTRICTION: 4,
  IDENTICAL_TO_IDENTICAL_BOXES: 2,
  IDENTICAL_TO_LABELLED_BOXES: 8,
});

const report = {
  canonicalProblemId: "PNC-CP-011",
  status: "EXECUTABLE_DISCOVERY_PASS",
  permanentQlIdsAllocated: 0,
  nextAvailableQlId: "PNC-QL-209",
  prototypeCheckCount: checks.length,
  allFormulaIndependentPairsAgree: true,
  familyCounts,
  checks: checks.map((check) => ({
    id: check.id,
    family: check.family,
    formula: check.formula.toString(),
    independent: check.independent.toString(),
    passed: check.formula === check.independent,
  })),
};
const reportDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-002-cp011-discovery");
mkdirSync(reportDirectory, { recursive: true });
writeFileSync(resolve(reportDirectory, "pnc-002-cp011-executable-discovery-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
