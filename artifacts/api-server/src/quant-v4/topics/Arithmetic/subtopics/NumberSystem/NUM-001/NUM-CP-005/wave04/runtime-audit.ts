import assert from "node:assert/strict";
import { generateNumCp005Wave04Sweep } from "./runtime-proven";
import { NUM_CP005_WAVE04_PROTOTYPE_IDS } from "./types";

const packages = generateNumCp005Wave04Sweep(60);
const prototypeCounts = new Map<string, number>();
const sourceFamilies = new Set<string>();
const semantics = new Set<string>();
const representations = new Set<string>();
const dataSufficiencyClasses = new Set<string>();
const solutionClasses = new Set<string>();
const comparisonOutcomes = new Set<string>();
const existenceClasses = new Set<string>();
let lifecycleViolations = 0;
let verifierViolations = 0;
let optionViolations = 0;
let internalLeaks = 0;

for (const pkg of packages) {
  prototypeCounts.set(pkg.temporaryPrototypeId, (prototypeCounts.get(pkg.temporaryPrototypeId) ?? 0) + 1);
  for (const source of pkg.sourceAncestry) sourceFamilies.add(source);
  semantics.add(pkg.answerSemantic);
  representations.add(pkg.representation);
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-025") dataSufficiencyClasses.add(pkg.canonicalAnswer);
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-027") solutionClasses.add(pkg.canonicalAnswer);
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-031") comparisonOutcomes.add(pkg.canonicalAnswer);
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-032") existenceClasses.add(String(pkg.hiddenState.existenceClass));

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
for (const prototypeId of NUM_CP005_WAVE04_PROTOTYPE_IDS) {
  assert.equal(prototypeCounts.get(prototypeId), 60);
}
assert.deepEqual([...dataSufficiencyClasses].sort(), [
  "Both together are sufficient",
  "Even together are insufficient",
  "I alone is sufficient",
  "II alone is sufficient",
]);
assert.deepEqual([...solutionClasses].sort(), ["Multiple solutions", "No solution", "Unique solution"]);
assert.deepEqual([...comparisonOutcomes].sort(), ["Number A", "Number B", "They are equal"]);
assert.deepEqual([...existenceClasses].sort(), ["HAS_SOLUTION", "NO_SOLUTION"]);
assert.ok(sourceFamilies.has("NUM-CP005-WAVES-01-03"));
assert.equal(lifecycleViolations, 0);
assert.equal(verifierViolations, 0);
assert.equal(optionViolations, 0);
assert.equal(internalLeaks, 0);

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_WAVE04_STRUCTURAL_AUDIT",
  generatedAuditPackages: packages.length,
  temporaryPrototypeCount: prototypeCounts.size,
  sourceFamilies: [...sourceFamilies].sort(),
  answerSemantics: [...semantics].sort(),
  representations: [...representations].sort(),
  dataSufficiencyClasses: [...dataSufficiencyClasses].sort(),
  inverseSolutionClasses: [...solutionClasses].sort(),
  comparisonOutcomes: [...comparisonOutcomes].sort(),
  boundedExistenceClasses: [...existenceClasses].sort(),
  lifecycleViolations,
  verifierViolations,
  optionViolations,
  internalLeaks,
  permanentQlCount: 0,
}, null, 2));
