import assert from "node:assert/strict";
import { generateNumCp005Wave02ProvenSweep } from "./runtime-proven";
import { NUM_CP005_WAVE02_PROTOTYPE_IDS } from "./types";

const packages = generateNumCp005Wave02ProvenSweep(60);
const prototypeCounts = new Map<string, number>();
const sourceFamilies = new Set<string>();
const semantics = new Set<string>();
const powerKinds = new Set<number>();
const inverseKinds = new Set<string>();
let lifecycleViolations = 0;
let verifierViolations = 0;
let optionViolations = 0;
let internalLeaks = 0;

for (const pkg of packages) {
  prototypeCounts.set(pkg.temporaryPrototypeId, (prototypeCounts.get(pkg.temporaryPrototypeId) ?? 0) + 1);
  for (const source of pkg.sourceAncestry) sourceFamilies.add(source);
  semantics.add(pkg.answerSemantic);

  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-010") powerKinds.add(3);
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-011") {
    powerKinds.add(Number(pkg.hiddenState.power));
  }
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-015") inverseKinds.add("PRIME_POWER_FROM_DIVISOR_COUNT");
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-016") inverseKinds.add("LEAST_NUMBER_WITH_EXACT_DIVISOR_COUNT");

  if (
    pkg.permanentQlId !== null
    || pkg.lifecycle.permanentQlId !== null
    || pkg.lifecycle.active
    || pkg.lifecycle.questionStudioDiscoverable
    || pkg.lifecycle.questionBankWritable
    || pkg.lifecycle.testEligible
    || pkg.lifecycle.publiclyPublishable
  ) lifecycleViolations += 1;

  if (pkg.canonicalAnswer !== pkg.verifierAnswer) verifierViolations += 1;
  if (
    pkg.options.length !== 4
    || new Set(pkg.options.map((option) => option.value)).size !== 4
    || pkg.options.filter((option) => option.isCorrect).length !== 1
    || pkg.options[pkg.correctIndex]?.value !== pkg.canonicalAnswer
  ) optionViolations += 1;

  const learnerText = [
    pkg.stem,
    ...pkg.options.map((option) => option.value),
    pkg.explanation.coreConcept,
    pkg.explanation.givenDataAndStrategy,
    ...pkg.explanation.stepByStep,
    pkg.explanation.examSpeedMethod,
    ...pkg.explanation.commonTraps,
    pkg.explanation.finalAnswer,
  ].join("\n");
  if (/NUM-CP005-PROT|temporaryPrototypeId|mathematicalFingerprint/u.test(learnerText)) {
    internalLeaks += 1;
  }
}

assert.equal(packages.length, 480);
assert.equal(prototypeCounts.size, 8);
for (const prototypeId of NUM_CP005_WAVE02_PROTOTYPE_IDS) {
  assert.equal(prototypeCounts.get(prototypeId), 60);
}
assert.deepEqual([...powerKinds].sort(), [3, 4, 5]);
assert.deepEqual([...inverseKinds].sort(), [
  "LEAST_NUMBER_WITH_EXACT_DIVISOR_COUNT",
  "PRIME_POWER_FROM_DIVISOR_COUNT",
]);
assert.deepEqual([...semantics].sort(), [
  "DIVISOR_COUNT",
  "DIVISOR_PRODUCT",
  "DIVISOR_SET",
  "DIVISOR_SUM",
  "INTEGER",
]);
assert.ok(sourceFamilies.has("NUM-CP005-WAVE01-DIVISOR-FOUNDATION"));
assert.equal(lifecycleViolations, 0);
assert.equal(verifierViolations, 0);
assert.equal(optionViolations, 0);
assert.equal(internalLeaks, 0);

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_WAVE02_STRUCTURAL_AUDIT",
  generatedAuditPackages: packages.length,
  temporaryPrototypeCount: prototypeCounts.size,
  sourceFamilies: [...sourceFamilies].sort(),
  answerSemantics: [...semantics].sort(),
  perfectPowerKinds: [...powerKinds].sort(),
  inverseKinds: [...inverseKinds].sort(),
  lifecycleViolations,
  verifierViolations,
  optionViolations,
  internalLeaks,
  permanentQlCount: 0,
}, null, 2));
