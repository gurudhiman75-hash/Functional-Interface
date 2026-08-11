import assert from "node:assert/strict";
import {
  generateNumCp007Wave03Package,
  NUM_CP007_WAVE03_PROTOTYPE_IDS,
  verifyNumCp007Wave03Package,
} from "./runtime.ts";

const stems = new Set<string>();
const representations = new Set<string>();
const semantics = new Set<string>();
const sourceFamilies = new Set<string>();
let generatedAuditPackages = 0;
let optionViolations = 0;
let verifierViolations = 0;
let lifecycleViolations = 0;
let internalIdentityLeaks = 0;

for (const prototypeId of NUM_CP007_WAVE03_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 75; seed++) {
    const pkg = generateNumCp007Wave03Package(prototypeId, seed);
    generatedAuditPackages++;
    stems.add(pkg.stem);
    representations.add(pkg.representation);
    semantics.add(pkg.answerSemantic);
    pkg.sourceAncestry.forEach((value) => sourceFamilies.add(value));

    if (pkg.options.length !== 4 || new Set(pkg.options.map((option) => option.value)).size !== 4) optionViolations++;
    if (verifyNumCp007Wave03Package(pkg) !== pkg.canonicalAnswer) verifierViolations++;
    if (
      pkg.permanentQlId !== null ||
      pkg.lifecycle.active ||
      pkg.lifecycle.questionStudioDiscoverable ||
      pkg.lifecycle.questionBankWritable ||
      pkg.lifecycle.testEligible ||
      pkg.lifecycle.publiclyPublishable
    ) lifecycleViolations++;
    if (/NUM-CP007-PROT|temporaryPrototypeId|hiddenState/.test(pkg.stem)) internalIdentityLeaks++;
  }
}

assert.ok(stems.size >= 500, `Insufficient exact stem breadth: ${stems.size}`);
assert.equal(representations.size, NUM_CP007_WAVE03_PROTOTYPE_IDS.length, "Each Wave 03 prototype should own a distinct discovery representation.");
assert.equal(optionViolations, 0);
assert.equal(verifierViolations, 0);
assert.equal(lifecycleViolations, 0);
assert.equal(internalIdentityLeaks, 0);

console.log(JSON.stringify({
  status: "PASS_NUM_CP007_WAVE03_STRUCTURAL_AUDIT",
  temporaryPrototypeCount: NUM_CP007_WAVE03_PROTOTYPE_IDS.length,
  seedsPerPrototype: 75,
  generatedAuditPackages,
  exactAuditStems: stems.size,
  representations: [...representations].sort(),
  answerSemantics: [...semantics].sort(),
  sourceFamilyCount: sourceFamilies.size,
  optionViolations,
  verifierViolations,
  lifecycleViolations,
  internalIdentityLeaks,
  permanentQlCount: 0,
}, null, 2));
