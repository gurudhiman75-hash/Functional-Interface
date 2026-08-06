import assert from "node:assert/strict";
import { generateNumCp005Wave01Sweep } from "./runtime";
import { NUM_CP005_WAVE01_PROTOTYPE_IDS } from "./types";

const packages = generateNumCp005Wave01Sweep(60);
const prototypeCounts = new Map<string, number>();
const sourceFamilies = new Set<string>();
const taskClasses = new Set<string>();
const conditionKinds = new Set<string>();
let lifecycleViolations = 0;
let verifierViolations = 0;
let ownershipViolations = 0;
let internalIdentityLeaks = 0;

for (const pkg of packages) {
  prototypeCounts.set(
    pkg.temporaryPrototypeId,
    (prototypeCounts.get(pkg.temporaryPrototypeId) ?? 0) + 1,
  );
  for (const source of pkg.sourceAncestry) sourceFamilies.add(source);
  taskClasses.add(pkg.answerSemantic);

  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-005") {
    conditionKinds.add("DIVISIBLE_BY_CONSTRUCTED_K");
    assert.ok(Number(pkg.hiddenState.requirementValue) >= 2);
  }
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-006") {
    conditionKinds.add("PERFECT_SQUARE_DIVISOR");
  }
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-008") {
    conditionKinds.add("BOUNDED_INVERSE_EXPONENT");
  }

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
    internalIdentityLeaks += 1;
  }

  const ownedByCp005 = [
    "DIVISOR_COUNT",
    "DIVISOR_SUM",
    "PRIME_EXPONENT",
  ].includes(pkg.answerSemantic);
  if (!ownedByCp005) ownershipViolations += 1;
}

assert.equal(packages.length, 480);
assert.equal(prototypeCounts.size, 8);
for (const prototypeId of NUM_CP005_WAVE01_PROTOTYPE_IDS) {
  assert.equal(prototypeCounts.get(prototypeId), 60,
    `${prototypeId} does not have the required structural sample count`);
}
assert.ok(sourceFamilies.has("NUMBER-SYSTEM-COMPLETE-CHECKPOINT-DESIGN"));
assert.ok(sourceFamilies.has("NUM-CP-004-PRIME-FACTORISATION-AUTHORITY"));
assert.deepEqual([...taskClasses].sort(), [
  "DIVISOR_COUNT",
  "DIVISOR_SUM",
  "PRIME_EXPONENT",
]);
assert.deepEqual([...conditionKinds].sort(), [
  "BOUNDED_INVERSE_EXPONENT",
  "DIVISIBLE_BY_CONSTRUCTED_K",
  "PERFECT_SQUARE_DIVISOR",
]);
assert.equal(lifecycleViolations, 0);
assert.equal(verifierViolations, 0);
assert.equal(ownershipViolations, 0);
assert.equal(internalIdentityLeaks, 0);

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_WAVE01_STRUCTURAL_AUDIT",
  generatedAuditPackages: packages.length,
  temporaryPrototypeCount: prototypeCounts.size,
  sourceFamilies: [...sourceFamilies].sort(),
  answerSemantics: [...taskClasses].sort(),
  conditionKinds: [...conditionKinds].sort(),
  lifecycleViolations,
  verifierViolations,
  ownershipViolations,
  internalIdentityLeaks,
  permanentQlCount: 0,
}, null, 2));
